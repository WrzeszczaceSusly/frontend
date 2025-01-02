import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HOST from "../config/apiConst.tsx";
import { introBodyStyle } from "../config/style.tsx";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import background_login from "./../images/pieski3.jpg";
import PetsIcon from "@mui/icons-material/Pets";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const validateFields = () => {
    let errors = { firstname: "", lastname: "", email: "", password: "" };
    let isValid = true;

    if (!formData.firstname.trim()) {
      errors.firstname = "Imię jest wymagane.";
      isValid = false;
    }

    if (!formData.lastname.trim()) {
      errors.lastname = "Nazwisko jest wymagane.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Adres e-mail jest wymagany.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Nieprawidłowy format adresu e-mail.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = "Hasło jest wymagane.";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Hasło musi mieć co najmniej 8 znaków.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      const response = await fetch(HOST + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.status === 400) {
        setError("Użytkownik o podanym adresie e-mail już istnieje.");
        return;
      }

      if (!response.ok) {
        setError("Wystąpił błąd. Spróbuj ponownie później.");
        return;
      }

      // Pokaż komunikat sukcesu
      setShowSuccessDialog(true);

      // Automatyczne przekierowanie po 4 sekundach
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      setError(
        "Wystąpił nieoczekiwany błąd. Sprawdź połączenie i spróbuj ponownie."
      );
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    navigate("/"); // Ręczne przekierowanie
  };

  return (
    <div className="App" style={introBodyStyle}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mt: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Card
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.9)",
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${background_login})`,
            backgroundSize: "cover",
            backdropFilter: "blur(6px)",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            borderRadius: "16px",
            padding: 2,
            maxWidth: 320,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <PetsIcon sx={{ fontSize: 40, color: "#556cd6" }} />
              <Typography
                component="h1"
                variant="h6"
                sx={{
                  mt: 1,
                  mb: 2,
                  fontWeight: "bold",
                  color: "#333",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                }}
              >
                Zarejestruj się, aby dołączyć
              </Typography>
              {error && (
                <Typography
                  color="error"
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255, 0, 0, 0.1)",
                    padding: 1,
                    borderRadius: 1,
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </Typography>
              )}
              <form noValidate onSubmit={handleRegister} style={{ width: "100%" }}>
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  id="firstname"
                  label="Imię"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  error={!!fieldErrors.firstname}
                  helperText={fieldErrors.firstname}
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                  }}
                />
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  id="lastname"
                  label="Nazwisko"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  error={!!fieldErrors.lastname}
                  helperText={fieldErrors.lastname}
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                  }}
                />
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adres e-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                  }}
                />
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Hasło"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  sx={{
                    mb: 2,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mb: 2,
                    bgcolor: "#556cd6",
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    ":hover": { bgcolor: "#334cb2" },
                    padding: "8px 16px",
                    borderRadius: "12px",
                  }}
                >
                  Zarejestruj się
                </Button>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button
                    variant="text"
                    sx={{
                      color: "#555",
                      ":hover": { color: "#333" },
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Masz już konto? Zaloguj się
                  </Button>
                </Link>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Dialog sukcesu */}
      <Dialog
        open={showSuccessDialog}
        onClose={handleCloseDialog}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">
          Rejestracja powiodła się!
        </DialogTitle>
        <DialogContent>
          <Typography>
            Twoje konto zostało utworzone. Za chwilę nastąpi przekierowanie do
            strony logowania.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Przejdź do logowania
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RegisterForm;
