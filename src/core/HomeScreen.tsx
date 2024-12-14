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
    const [allBreeds, setAllBreeds] = useState<Breed[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); 
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [uniqueBreedNames, setUniqueBreedNames] = useState<string[]>([]);
    const [openList, setOpenList] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBreedsForFiltering = async () => {
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
                setAllBreeds(data); 
                const names = data.map((b: Breed) => b.name);
                const uniqueNames = Array.from(new Set(names));
                setUniqueBreedNames(uniqueNames);
            } catch (error) {
                setError("Nie udało się pobrać danych. Spróbuj ponownie później.");
            }
        };

        fetchBreedsForFiltering();
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

    // Filtrowanie po wybranych rasach z listy
    const filteredBySelection =
        selectedBreeds.length === 0
            ? allBreeds
            : allBreeds.filter((breed) => selectedBreeds.includes(breed.name));

    // Filtrowanie po wpisanej frazie
    const finalFiltered = filteredBySelection.filter((breed) =>
        breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Przycięcie wyników do aktualnej strony
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedBreeds = finalFiltered.slice(startIndex, endIndex);

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

                            {/* Sekcja Filtrowania */}
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
                            spacing={4}
                            justifyContent="center"
                            sx={{ maxWidth: "1400px", margin: "0 auto" }}
                        >
                            {paginatedBreeds.map((breed) => (
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
