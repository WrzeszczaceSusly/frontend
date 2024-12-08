import React, { useState, useEffect } from "react";
import { introBodyStyle } from "../config/style.tsx";
import {
    Card,
    CardActions,
    CardContent,
    Typography,
    Grid,
    Button,
    Box,
    Container,
    TablePagination,
} from "@mui/material";
import { Breed } from "../data/Breed";
import { Link } from "react-router-dom";
import NavBar from "./NavBar.tsx";
import HOST from "../config/apiConst.tsx";

function HomeScreen() {
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Liczba ras na stronę
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBreeds = async () => {
            try {
                const response = await fetch(
                    `${HOST}/breeds?page=${page}&size=${rowsPerPage}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch breeds.");
                }
                const data = await response.json();
                setBreeds(data.content); // Dane ras
                setTotalPages(data.totalPages); // Liczba stron
            } catch (error) {
                setError("Nie udało się pobrać danych. Spróbuj ponownie później.");
            }
        };

        fetchBreeds();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Resetuj stronę do 0 przy zmianie liczby wierszy
    };

    return (
        <div style={introBodyStyle}>
            <NavBar />
            <main
                className="App"
                style={{
                    padding: "20px",
                    minHeight: "90vh",
                    overflowY: "auto",
                    width: "100%",
                }}
            >
                {error ? (
                    <Typography
                        variant="h6"
                        color="error"
                        sx={{
                            textAlign: "center",
                            marginTop: "20px",
                        }}
                    >
                        {error}
                    </Typography>
                ) : (
                    <Container maxWidth="xl">
                        <Grid
                            container
                            spacing={4}
                            justifyContent="center"
                            sx={{ maxWidth: "1400px", margin: "0 auto" }}
                        >
                            {breeds.map((breed) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={2.4} // 5 kart w rzędzie
                                    key={breed.id}
                                    style={{ display: "flex", justifyContent: "center" }}
                                >
                                    <Card
                                        sx={{
                                            width: "220px",
                                            height: "320px",
                                            borderRadius: 4,
                                            boxShadow: 5,
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.05)",
                                                boxShadow: 10,
                                            },
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: "150px",
                                                backgroundColor: "#f5f5f5",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                variant="h1"
                                                component="div"
                                                sx={{
                                                    fontSize: "50px",
                                                    color: "#556cd6",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                🐶
                                            </Typography>
                                        </Box>
                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                                sx={{
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {breed.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ textAlign: "center" }}
                                            >
                                                Popularna rasa psów.
                                            </Typography>
                                        </CardContent>
                                        <CardActions
                                            sx={{
                                                justifyContent: "center",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    textTransform: "none",
                                                    borderRadius: "20px",
                                                }}
                                            >
                                                <Link
                                                    to={`/breed/${breed.id}`}
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "white",
                                                    }}
                                                >
                                                    Szczegóły
                                                </Link>
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        {/* Paginacja */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                                padding: "20px 0",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                borderRadius: "12px",
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <TablePagination
                                component="div"
                                count={totalPages * rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 20]}
                                sx={{
                                    ".MuiTablePagination-toolbar": {
                                        justifyContent: "center",
                                    },
                                }}
                            />
                        </Box>
                    </Container>
                )}
            </main>
        </div>
    );
}

export default HomeScreen;
