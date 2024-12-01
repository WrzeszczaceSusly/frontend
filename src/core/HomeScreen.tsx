import React from "react";
import { introBodyStyle } from "../config/style.tsx";
import NavBar from "./NavBar.tsx";

function HomeScreen() {
    return (
        <div style={introBodyStyle}>
            <NavBar />
            <main className="App" style={{ padding: '20px 20px 80px 20px', minHeight: '90vh', overflowX: 'hidden', overflowY: 'auto', width: 'calc(100% - 40px)' }}>
                {/* Content removed */}
            </main>
        </div>
    );
}

export default HomeScreen;
