import React from "react";
import { introBodyStyle } from "../config/style.tsx";
import NavBar from "./NavBar.tsx";

function HomeScreen() {
    return (
        <div style={introBodyStyle}>
            <NavBar />
            <main 
                className="App" 
                style={{ 
                    padding: '20px', 
                    minHeight: '90vh', 
                    overflowY: 'auto', 
                    width: '100%'
                }}
            >
                {/* Content removed */}
            </main>
        </div>
    );
}

export default HomeScreen;
