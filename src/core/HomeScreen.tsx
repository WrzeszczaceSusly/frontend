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
    useTheme,
    TablePagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import { Breed } from "../data/Breed";
import { Link } from "react-router-dom";
import NavBar from "./NavBar.tsx";
import HOST from "../config/apiConst.tsx";

function HomeScreen() {
    const theme = useTheme();
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Wybrane rasy (tablica nazw)
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);

    // Unikalne nazwy ras do wyświetlenia (tylko z aktualnie pobranej strony)
    const [uniqueBreedNames, setUniqueBreedNames] = useState<string[]>([]);

    // Sterowanie pokazaniem listy z checkboxami
    const [openList, setOpenList] = useState<boolean>(false);

    // Wyszukiwanie po nazwie
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Logika paginacji
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBreeds = async () => {
            try {
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
    }, [page, rowsPerPage]);

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
                    padding: theme.spacing(4),
                    minHeight: "90vh",
                    overflowY: "auto",
                    width: "100%",
                }}
            >
                {error ? (
                    <Typography
                        variant="body1"
                        color="error"
                        sx={{
                            textAlign: "center",
                            marginTop: theme.spacing(2),
                        }}
                    >
                        {error}
                    </Typography>
                ) : (
                    <Container maxWidth="xl">
                        <Paper
                            sx={{
                                padding: theme.spacing(3),
                                marginBottom: theme.spacing(4),
                                borderRadius: 2,
                                boxShadow: "none",
                                border: `1px solid ${theme.palette.divider}`,
                                backgroundColor: theme.palette.background.paper,
                                display: "flex",
                                flexDirection: "column",
                                gap: theme.spacing(2),
                                alignItems: "center",
                            }}
                        >
                            {/* Wybrane rasy jako chipy */}
                            {selectedBreeds.length > 0 && (
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
                                                fontSize: "0.85rem",
                                            }}
                                        />
                                    ))}
                                </Stack>
                            )}

                            {/* Sekcja z wyszukiwaniem i przyciskiem do rozwijania listy */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: theme.spacing(2),
                                    width: "100%",
                                    maxWidth: "600px",
                                    backgroundColor: theme.palette.background.default,
                                    borderRadius: 2,
                                    position: "relative",
                                    padding: theme.spacing(2),
                                }}
                            >
                                <TextField
                                    label="Wyszukaj rasę"
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
                                    {/* Lista ras w formie checkboxów (rozwijana) z scrollbar, wychodząca od buttona */}
                                    <Collapse
                                        in={openList}
                                        sx={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            width: "300px",
                                            mt: 1,
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
                            </Box>
                        </Paper>

                        <Grid
                            container
                            spacing={3}
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
                                            borderRadius: 2,
                                            boxShadow: `0px 1px 4px rgba(0,0,0,0.1)`,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: "150px",
                                                backgroundColor: theme.palette.grey[100],
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                variant="h1"
                                                component="div"
                                                sx={{
                                                    fontSize: "40px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                🐶
                                            </Typography>
                                        </Box>
                                        <CardContent sx={{ padding: theme.spacing(2) }}>
                                            <Typography
                                                gutterBottom
                                                variant="subtitle1"
                                                component="div"
                                                sx={{
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    fontSize: "1rem",
                                                }}
                                            >
                                                {breed.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ textAlign: "center", fontSize: "0.85rem" }}
                                            >
                                                Popularna rasa psów.
                                            </Typography>
                                        </CardContent>
                                        <CardActions
                                            sx={{
                                                justifyContent: "center",
                                                paddingBottom: theme.spacing(2),
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{
                                                    textTransform: "none",
                                                    borderRadius: "20px",
                                                    fontSize: "0.85rem",
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
                                marginTop: theme.spacing(4),
                                padding: theme.spacing(2),
                                borderRadius: 2,
                                backgroundColor: "white",
                                boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
                                maxWidth: "500px",
                                margin: "40px auto 0",
                            }}
                        >
                            <TablePagination
                                component="div"
                                count={20}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 20]}
                                sx={{
                                    ".MuiTablePagination-toolbar": {
                                        justifyContent: "center",
                                        padding: 0,
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
