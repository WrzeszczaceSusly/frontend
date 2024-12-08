// Importowanie niezbędnych bibliotek i komponentów
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from "@mui/icons-material/Pets";
import background_logout from "./../images/pieski3.jpg";


function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

    // Funkcja do wylogowania
    const logout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            navigate("/");
        }
    };

    // Otwiera dialog wylogowania
    const handleOpenLogoutDialog = () => {
        setLogoutDialogOpen(true);
    };

    // Zamyka dialog wylogowania
    const handleCloseLogoutDialog = () => {
        setLogoutDialogOpen(false);
    };

    const LogoutDialog = ({ open, handleClose }) => (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    padding: 2,
                    backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${background_logout})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
                    maxWidth: '400px',
                    textAlign: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.1)', // Subtelne obramowanie
                },
            }}
        >
            <DialogTitle>
                <PetsIcon sx={{ fontSize: 50, color: '#556cd6' }} />
                <Typography
                    variant="h6"
                    sx={{
                        mt: 1,
                        fontWeight: 'bold',
                        color: '#333',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    Potwierdzenie wylogowania
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography
                    variant="body1"
                    sx={{
                        color: '#444',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}
                >
                    Czy na pewno chcesz się wylogować?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    sx={{
                        bgcolor: '#f50057',
                        color: '#fff',
                        ':hover': { bgcolor: '#d4004c' },
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        padding: '6px 12px',
                        borderRadius: '12px', // Lekko zaokrąglone
                    }}
                >
                    Anuluj
                </Button>
                <Button
                    onClick={logout}
                    variant="contained"
                    sx={{
                        bgcolor: '#556cd6',
                        color: '#fff',
                        ':hover': { bgcolor: '#334cb2' },
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        padding: '6px 12px',
                        borderRadius: '12px',
                    }}
                >
                    Wyloguj
                </Button>
            </DialogActions>
        </Dialog>
    );

    const renderContent = () => {
        if (location.pathname === "/" || location.pathname === "/register") {
            return null;
        } else {
            return (
                <>
                    <AppBar
                        position="fixed"
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(8px)",
                            boxShadow: "none", // Bez cienia
                            borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Subtelna linia
                        }}
                    >
                        <Toolbar>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    flexGrow: 1,
                                    color: "#556cd6",
                                    fontWeight: "bold",
                                }}
                            >
                                Dog Breeds Catalog
                            </Typography>
                            <IconButton
                                onClick={() => navigate("/homescreen")}
                                sx={{
                                    color: "#556cd6",
                                    mr: 1,
                                    ":hover": { bgcolor: "rgba(85, 108, 214, 0.1)" },
                                }}
                            >
                                <DashboardIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleOpenLogoutDialog}
                                sx={{
                                    color: "#f50057",
                                    ":hover": { bgcolor: "rgba(245, 0, 87, 0.1)" },
                                }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <Toolbar /> {/* Ten dodatkowy Toolbar zapewnia, że treść pod AppBar nie zostanie zasłonięta */}
                    <LogoutDialog open={isLogoutDialogOpen} handleClose={handleCloseLogoutDialog} />
                </>
            );
        }
    };

    return renderContent();
}

export default NavBar;
