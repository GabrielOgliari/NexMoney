//Importação de arquivo ofx
import { FileUpload } from "./components/file_upload";
import { Typography, Container, Box } from "@mui/material";

export const BankStatementPage = () => {
  return (
    <div className="flex gap-4 flex-col bg-background bg-[#1B2232] height-screen  h-screen w-full overflow-hidden">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom color="text.primary">
          Importar Extrato Bancário
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Carregue seu extrato bancário no formato OFX para importar transações.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <FileUpload />
        </Box>
      </Container>
    </div>
  );
};
