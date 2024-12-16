// src/components/HomeScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
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
    Chip,
    Collapse,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Stack,
    TextField,
    InputAdornment,
    Paper,
    useTheme,
    TablePagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { Breed } from "../data/Breed";
import { Dog } from "../data/Dog";
import { Link } from "react-router-dom";
import NavBar from "./NavBar.tsx";
import HOST from "../config/apiConst.tsx";

function HomeScreen() {
    const theme = useTheme();
    const [allBreeds, setAllBreeds] = useState<Breed[]>([]);
    const [allDogs, setAllDogs] = useState<Dog[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Liczba psów na stronę
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [uniqueBreedNames, setUniqueBreedNames] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [openList, setOpenList] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBreedsForFiltering = async () => {
            try {
                const response = await fetch(`${HOST}/breeds?page=0&size=100`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch breeds.");
                }
                const data: Breed[] = await response.json();
                setAllBreeds(data);
                const names = data.map((b: Breed) => b.name);
                const uniqueNames = Array.from(new Set(names));
                setUniqueBreedNames(uniqueNames);
            } catch (error) {
                setError("Nie udało się pobrać danych. Spróbuj ponownie później.");
                console.error(error);
            }
        };

        fetchBreedsForFiltering();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchDogs = async () => {
            try {
                const response = await fetch(`${HOST}/dogs?page=0&size=100`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch dogs.");
                }
                const data: Dog[] = await response.json();
                setAllDogs(data);
            } catch (error) {
                setError("Nie udało się pobrać danych. Spróbuj ponownie później.");
                console.error(error);
            }
        };

        fetchDogs();
    }, []);

    const handleCheckboxChange = (name: string) => {
        if (selectedBreeds.includes(name)) {
            setSelectedBreeds(selectedBreeds.filter((b) => b !== name));
        } else {
            setSelectedBreeds([...selectedBreeds, name]);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Użycie useMemo do optymalizacji filtrowania
    const finalFiltered = useMemo(() => {
        const filteredBySelection =
            selectedBreeds.length === 0
                ? allDogs
                : allDogs.filter((dog) => selectedBreeds.includes(dog.breedName));

        return filteredBySelection.filter((dog) =>
            dog.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allDogs, selectedBreeds, searchTerm]);

    // Przycięcie wyników do aktualnej strony
    const paginatedDogs = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return finalFiltered.slice(startIndex, endIndex);
    }, [finalFiltered, page, rowsPerPage]);

    return (
        <div style={introBodyStyle}>
            <NavBar />

            {/* Stała Sekcja Filtrowania */}
            <Box
                sx={{
                    position: "fixed",
                    top: theme.spacing(8), // Dostosuj do wysokości NavBar
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" }, // Responsywna szerokość
                    backgroundColor: "transparent",
                    zIndex: 1000,
                    padding: theme.spacing(1),
                }}
            >
                <Paper
                    sx={{
                        padding: theme.spacing(2),
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(2),
                        width: "100%",
                        boxShadow: 3,
                        backgroundColor: theme.palette.background.paper,
                    }}
                >
                    <TextField
                        label="Szukaj po nazwie psa"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                            sx: {
                                '& .MuiInputBase-input': {
                                    height: 'auto',
                                    paddingTop: theme.spacing(1.1),
                                    paddingBottom: theme.spacing(1.1),
                                }
                            },
                        }}
                        sx={{
                            backgroundColor: "white",
                            '& .MuiOutlinedInput-root': {
                                height: '40px',
                            },
                        }}
                    />

                    <Box sx={{ position: "relative" }}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenList(!openList)}
                            endIcon={openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                fontSize: "0.9rem",
                                backgroundColor: "white",
                                height: '40px',
                                whiteSpace: "nowrap",
                            }}
                        >
                            {openList ? "Zwiń listę" : "Wybierz rasy"}
                        </Button>
                        <Collapse
                            in={openList}
                            sx={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                width: "300px",
                                mt: 1,
                                zIndex: 1, // zapewnia, że jest na wierzchu
                            }}
                        >
                            <Box
                                sx={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    paddingX: theme.spacing(2),
                                    paddingY: theme.spacing(1),
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2,
                                    backgroundColor: "white",
                                }}
                            >
                                <FormGroup>
                                    {uniqueBreedNames.map((name) => (
                                        <FormControlLabel
                                            key={name}
                                            control={
                                                <Checkbox
                                                    checked={selectedBreeds.includes(name)}
                                                    onChange={() => handleCheckboxChange(name)}
                                                    color="primary"
                                                />
                                            }
                                            label={name}
                                            sx={{
                                                "& .MuiTypography-root": {
                                                    fontSize: "0.9rem",
                                                },
                                            }}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                        </Collapse>
                    </Box>
                </Paper>
            </Box>

            {/* Sekcja Wybranych Ras */}
            {selectedBreeds.length > 0 && (
                <Box
                    sx={{
                        position: "fixed",
                        top: `calc(${theme.spacing(8)} + 72px + ${theme.spacing(1)})`, // Dostosuj do wysokości NavBar + filter box + odstęp
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" }, // Responsywna szerokość
                        backgroundColor: "transparent",
                        zIndex: 999, // niższy niż filter box
                        padding: theme.spacing(1),
                    }}
                >
                    <Paper
                        sx={{
                            padding: theme.spacing(1),
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing(1),
                            width: "100%",
                            boxShadow: 1,
                            backgroundColor: theme.palette.background.paper,
                            overflowX: "auto",
                            whiteSpace: "nowrap", // Zapobiega łamaniu się chipów
                        }}
                    >
                        <Stack direction="row" spacing={1} flexWrap="nowrap">
                            {selectedBreeds.map((name) => (
                                <Chip
                                    key={name}
                                    label={name}
                                    onDelete={() =>
                                        setSelectedBreeds(selectedBreeds.filter((b) => b !== name))
                                    }
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        fontSize: "0.85rem",
                                    }}
                                />
                            ))}
                        </Stack>
                    </Paper>
                </Box>
            )}

            <main
                className="App"
                style={{
                    padding: "20px",
                    paddingTop: selectedBreeds.length > 0 ? `calc(${theme.spacing(8)} + 72px + ${theme.spacing(2)})` : theme.spacing(12), // Dostosuj w zależności od wysokości sekcji filtrowania i wybranych ras
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
                        component="div" // Aby uniknąć zagnieżdżania <h6> wewnątrz <h2>
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
                            {paginatedDogs.map((dog) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3} // 4 karty na rząd
                                    key={dog.id}
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
                                                component="div" // Zmiana na <div>
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
                                                component="div" // Zmiana na <div>
                                                sx={{
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {dog.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ textAlign: "center" }}
                                                component="div" // Opcjonalnie, aby uniknąć zagnieżdżania <h6> wewnątrz <h2>
                                            >
                                                Rasa: {dog.breedName}
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
                                                    to={`/dog/${dog.id}`}
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
                                count={finalFiltered.length}
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
