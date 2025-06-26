import React from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Link,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

export function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica de autenticação
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Muito triste!");
  };

  const slides = [
    {
      image: "/banners/banner1.jpg",
    },
    {
      image: "/banners/banner2.jpg",
    },
  ];

  return (
    <Box className="flex w-full h-screen overflow-hidden">
      {/* Carrossel */}
      <Box className="w-4/5 hidden md:flex h-screen">
        <Swiper
          modules={[Autoplay]}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <Box
                component="img"
                src={slide.image}
                alt={`Slide ${i + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // cobre toda a área mantendo proporção
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Formulário */}
      <Box className="w-full md:w-1/5 bg-gradient-to-br from-[#0F1729] to-[#1B2232] flex items-center justify-center">
        <Box className="w-full max-w-md px-4 sm:px-6 md:px-8">
          <Paper
            elevation={4}
            className="w-full p-8 rounded-2xl text-white bg-[#111827]"
          >
            <Box className="text-center mb-6">
              <Typography variant="h4" fontWeight="bold" color="primary">
                $ NexMoney
              </Typography>
              <Typography variant="body1" color="gray">
                A nova geração de controle financeiro
              </Typography>
            </Box>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <TextField
                type="email"
                required
                fullWidth
                placeholder="nome@exemplo.com"
                label="Email"
                variant="outlined"
                sx={{ input: { color: "white" } }}
                InputLabelProps={{ style: { color: "#ccc" } }}
              />
              <TextField
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                placeholder="Digite sua senha"
                label="Senha"
                variant="outlined"
                sx={{ input: { color: "white" } }}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box className="flex justify-between text-sm">
                <span></span>
                <Link
                  href="#"
                  underline="hover"
                  color="#3b82f6"
                  onClick={handleForgotPassword}
                >
                  Esqueceu a senha?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, fontWeight: "bold", py: 1.5, borderRadius: 2 }}
              >
                Entrar
              </Button>
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 4 }}>
              Não tem uma conta?{" "}
              <Link href="#" underline="hover" color="#3b82f6">
                Cadastre-se
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
