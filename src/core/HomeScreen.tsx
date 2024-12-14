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
    Chip,
    Collapse,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Stack,
    TextField,
    InputAdornment,
    Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { Breed } from "../data/Breed";
import { Link } from "react-router-dom";
import NavBar from "./NavBar.tsx";
import HOST from "../config/apiConst.tsx";

function HomeScreen() {
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Wybrane rasy (tablica nazw)
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

    // Unikalne nazwy ras do wyświetlenia
    const [uniqueBreedNames, setUniqueBreedNames] = useState<string[]>([]);

    // Sterowanie pokazaniem listy z checkboxami
    const [openList, setOpenList] = useState<boolean>(false);

    // Wyszukiwanie po nazwie
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBreeds = async () => {
            try {
                // Pobieramy wszystkie dostępne rasy, np. 20 sztuk
                const response = await fetch(`${HOST}/breeds?page=0&size=20`, {
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
                const data = await response.json();
                setBreeds(data);

                const names = data.map((b: Breed) => b.name);
                const uniqueNames = Array.from(new Set(names));
                setUniqueBreedNames(uniqueNames);
            } catch (error) {
                setError("Nie udało się pobrać danych. Spróbuj ponownie później.");
            }
        };

        fetchBreeds();
    }, []);

    const handleCheckboxChange = (name: string) => {
        if (selectedBreeds.includes(name)) {
            setSelectedBreeds(selectedBreeds.filter((b) => b !== name));
        } else {
            setSelectedBreeds([...selectedBreeds, name]);
        }
    };

    // Najpierw filtrujemy po wybranych rasach
    const filteredBySelection =
        selectedBreeds.length === 0
            ? breeds
            : breeds.filter((breed) => selectedBreeds.includes(breed.name));

    // Dodatkowo filtrujemy po wpisanej frazie
    const finalFiltered = filteredBySelection.filter((breed) =>
        breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <Paper
                            sx={{
                                padding: "20px",
                                marginBottom: "30px",
                                borderRadius: "12px",
                                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                            }}
                        >
                            {/* Wybrane rasy jako chipy */}
                            {selectedBreeds.length > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        justifyContent="center"
                                    >
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
                                                    fontSize: "0.9rem",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Sekcja z wyszukiwaniem i przyciskiem do rozwijania listy */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    marginBottom: "20px",
                                }}
                            >
                                <TextField
                                    label="Wyszukaj rasę"
                                    variant="outlined"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ width: "300px" }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    variant="text"
                                    onClick={() => setOpenList(!openList)}
                                    endIcon={openList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    sx={{ textTransform: "none", fontWeight: "bold" }}
                                >
                                    {openList ? "Zwiń listę ras" : "Wybierz rasy"}
                                </Button>
                            </Box>

                            {/* Lista ras w formie checkboxów (rozwijana) z scrollbar */}
                            <Collapse in={openList}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxHeight: "200px", // Wysokość na ok. 5 ras
                                            overflowY: "auto",
                                            padding: "0 10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            width: "300px",
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
                                </Box>
                            </Collapse>
                        </Paper>

                        <Grid
                            container
                            spacing={4}
                            justifyContent="center"
                            sx={{ maxWidth: "1400px", margin: "0 auto" }}
                        >
                            {finalFiltered.map((breed) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={2.4}
                                    key={breed.id}
                                    style={{ display: "flex", justifyContent: "center" }}
                                >
                                    <Card
                                        sx={{
                                            width: "220px",
                                            height: "320px",
                                            borderRadius: 4,
                                            boxShadow: 2,
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
                    </Container>
                )}
            </main>
        </div>
    );
}

export default HomeScreen;

