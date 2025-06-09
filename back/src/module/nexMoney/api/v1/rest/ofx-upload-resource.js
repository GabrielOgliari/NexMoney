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

// POST
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

    //processa transações
    const payload = transactions.map((transacao, index) => {
      const item = {
        name: transacao.NAME || transacao.MEMO || "Transação",
        amount: parseFloat(transacao.TRNAMT),
        date: new Date(
          transacao.DTPOSTED?.substring(0, 8).replace(
            /(\d{4})(\d{2})(\d{2})/,
            "$1-$2-$3"
          )
        ),
        type: transacao.TRNTYPE || null,
        memo: transacao.MEMO || null,
        fitid: transacao.FITID || null,
        mapped: false,
        category: null,
      };

      //console.log(`transação ${index + 1}:`, item);
      return item;
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
