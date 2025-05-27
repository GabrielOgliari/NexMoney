import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0F1729", // fundo padrão
      paper: "#0F1729", // fundo dos elementos tipo card/paper
    },
    text: {
      primary: "#ffffff",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: "#0F1729",
          color: "#fff",
          borderColor: "#1E2B45",
        },
        columnHeaders: {
          backgroundColor: "#0F1729",
          color: "#fff",
          borderColor: "#1E2B45",
          borderBottom: "#1E2B45 solid 1px",
        },
        columnHeaderTitle: {
          color: "#fff",
          fontWeight: "bold",
          borderColor: "#1E2B45",
        },
        footerContainer: {
          backgroundColor: "#0F1729",
          color: "#fff",
          borderColor: "#1E2B45",
        },
        cell: {
          borderColor: "#1E2B45",
        },
        topContainer: {
          borderColor: "#1E2B45", // borda do header personalizada
        },
        dowContainer: {
          backgroundColor: "#0F1729",
          borderColor: "#1E2B45",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#0F1729", // cor de fundo customizada
          color: "#fff", // cor do texto
          borderRadius: "3px", // borda arredondada
          border: "1px solid #1E2B45", // borda customizada.
          textAlign: "center", // centraliza o texto
          padding: "20px", // espaçamento interno
          backgroundImage: "none"
        },
      },
    },
  },
});
