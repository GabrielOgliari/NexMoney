const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const ofx = require("node-ofx-parser");
const model = require("../../../model");

const BankStatementExpense = model.bankStatementExpense;

// Configura o multer para salvar temporariamente em /uploads
const upload = multer({ dest: "uploads/" });

// POST - Upload e processamento de arquivo OFX
router.post("/api/v1/rest/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse do OFX
    const parsedData = ofx.parse(fileContents);
    //console.log("dados brutos parseados:",JSON.stringify(parsedData, null, 2));

    // Detecta estrutura usada - Banco do Brasil
    const bankMsg =
      parsedData?.OFX?.BANKMSGSRSV1 || parsedData?.OFX?.BANKMSGSRSV5;

    if (!bankMsg?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN) {
      return res
        .status(400)
        .json({ error: "Nenhuma transação encontrada no arquivo OFX." });
    }

    const transactions = bankMsg.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

    const payload = transactions.map((transacao) => {
      const memo = transacao.MEMO || "";
      const memoRegex = /^(\d{2}\/\d{2}) (\d{2}:\d{2}) (.+)$/;
      const match = memo.match(memoRegex);

      let memo_info = null;
      let person_name = null;

      const dtPostedRaw = transacao.DTPOSTED?.substring(0, 8);
      const year = dtPostedRaw?.substring(0, 4);

      if (match && year) {
        const [_, dateStr, timeStr, nameStr] = match;
        const [day, month] = dateStr.split("/");
        const isoDateStr = `${year}-${month}-${day}T${timeStr}:00-03:00`;
        memo_info = new Date(isoDateStr);
        person_name = nameStr.trim();
      }

      return {
        name: transacao.NAME || person_name || "Transação",
        amount: parseFloat(transacao.TRNAMT),
        date: new Date(
          dtPostedRaw.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
        ),
        type: transacao.TRNTYPE || null,
        fitid: transacao.FITID || null,
        mapped: false,
        category: null,
        memo_info: memo_info || null,
        person_name: person_name || null,
      };
      //console.log(`transação ${index + 1}:`, item);
    });

    if (payload.length > 0) {
      await BankStatementExpense.bulkCreate(payload);
      //console.log(`${payload.length} transações salvas com sucesso no banco.`);
    }

    // Limpa o arquivo temporário
    fs.unlinkSync(filePath);

    return res.status(201).json({
      success: true,
      message: "Upload e importação concluídos com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao processar o arquivo OFX:", error);
    return res.status(500).json({ error: "Erro ao processar o arquivo OFX." });
  }
});

module.exports = router;
