import React, { useCallback, useState } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import api from "../../../services/api";

export const FileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setStatusMessage("Por favor, selecione um arquivo .OFX válido.");
      return;
    }

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    // Enviar o arquivo com api para o backend
    api
      .post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // ajustar depois
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then((response) => {
        setStatusMessage(
          `Upload bem-sucedido: ${
            response.data.message || "Arquivo enviado com sucesso!"
          }`
        );
      })
      .catch((error) => {
        console.error("Erro ao enviar arquivo:", error);
        setStatusMessage("Erro ao enviar o arquivo.");
      });
  }, []);

  // Configura o dropzone aceitação apenas de arquivos .ofx e sem múltiplos arquivos
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/octet-stream": [".ofx"] },
    multiple: false,
  });

  // Renderiza a área de upload
  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed",
        borderColor: isDragActive ? "primary.main" : "grey.500",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        backgroundColor: "background.default",
        color: "text.primary",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="subtitle1">
        {isDragActive
          ? "Solte o arquivo aqui..."
          : "Arraste e solte seu arquivo .OFX aqui"}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Suporta arquivos .OFX da maioria dos bancos.
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }}>
        Procurar Arquivos
      </Button>

      {uploadProgress > 0 && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{ mt: 2 }}
        />
      )}

      {statusMessage && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: statusMessage.includes("Erro")
              ? "error.main"
              : "success.main",
          }}
        >
          {statusMessage}
        </Typography>
      )}
    </Box>
  );
};
