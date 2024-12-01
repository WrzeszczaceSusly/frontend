// Importowanie niezbędnych bibliotek i komponentów
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, useTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();


    const renderContent = () => {

        return (
            <>
                <AppBar position="fixed" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', zIndex: theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main }}>
                            Schronisko psów
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar /> {/* Ten dodatkowy Toolbar zapewnia, że treść pod AppBar nie zostanie zasłonięta */}
            </>
        );
        
    };

    return renderContent();
}

export default NavBar;
