import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HOST from "../config/apiConst.tsx";
import { introBodyStyle } from "../config/style.tsx";
import { TextField, Button, Card, CardContent, Typography, Container, Box, InputAdornment, IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import background_login from "./../images/pieski3.jpg";
import PetsIcon from "@mui/icons-material/Pets";

function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) navigate("/homescreen");
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(HOST + "/auth/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                credentials: "include",
            });

            if (response.status === 403) {
                setError("Nieprawidłowy email lub hasło. Spróbuj ponownie.");
                return;
            }

            if (!response.ok) {
                setError(
                    "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później."
                );
                return;
            }

            const data = await response.json();
            const token = data.accessToken;
            localStorage.setItem("token", token);

            navigate("/homescreen");
        } catch (error) {
            setError(
                "Wystąpił nieoczekiwany błąd. Sprawdź połączenie i spróbuj ponownie."
            );
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="App" style={introBodyStyle}>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    mt: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "90%",
                }}
            >
                <Card
                    sx={{
                        bgcolor: "rgba(255, 255, 255, 0.85)",
                        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${background_login})`,
                        backgroundSize: "cover",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                        padding: 3,
                        maxWidth: 360,
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
                            <PetsIcon sx={{ fontSize: 50, color: "#556cd6" }} />
                            <Typography
                                component="h1"
                                variant="h6"
                                sx={{
                                    mt: 2,
                                    mb: 2,
                                    fontWeight: "bold",
                                    color: "#333",
                                    textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                Zaloguj się do strony głównej schroniska dla
                                psiaków
                            </Typography>
                            {error && (
                                <Typography
                                    color="error"
                                    sx={{
                                        mb: 2,
                                        bgcolor: "rgba(255, 0, 0, 0.1)", // Czerwone tło dla błędu
                                        padding: 1,
                                        borderRadius: 1,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}
                            <form
                                noValidate
                                onSubmit={handleLogin}
                                style={{ width: "100%" }}
                            >
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Adres e-mail"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
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
                                    type={showPassword ? "text" : "password"} // Typ zmienia się na jawny/ukryty
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    sx={{
                                        mb: 3,
                                        bgcolor: "rgba(255, 255, 255, 0.9)",
                                        borderRadius: "8px",
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={
                                                        handleTogglePasswordVisibility
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
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
                                    Zaloguj się
                                </Button>
                                <Link
                                    to="/register"
                                    style={{ textDecoration: "none" }}
                                >
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: "#555",
                                            ":hover": { color: "#333" },
                                            fontWeight: "bold",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Nie masz konta? Zarejestruj się
                                    </Button>
                                </Link>
                            </form>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}

export default LoginForm;
