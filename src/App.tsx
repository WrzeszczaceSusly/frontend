import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import HomeScreen from "./core/HomeScreen.tsx";
import BreedPage from "./core/BreedPage.tsx";


declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true;
    desktop: true;
  }
  interface Theme {
    radius: {
      sm: number;
      md: number;
      lg: number;
      circle: string;
    };
  }
  interface ThemeOptions {
    radius?: {
      sm: number;
      md: number;
      lg: number;
      circle: string;
    };
  }
}

function App() {

  const theme = createTheme({
    breakpoints: {
      values: {
        mobile: 0,
        desktop: 1024,
      },
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 16,
      circle: '50%',
    },
    palette: {
      primary: {
        main: '#556cd6', // Zmiana koloru głównego na bardziej neutralny
        light: '#888fd6',
        dark: '#334cb2',
      },
      secondary: {
        main: '#f50057', // Zmiana koloru drugorzędnego na bardziej wyrazisty
      },
      text: {
        primary: '#2e3131', // Ciemniejszy kolor tekstu dla lepszej czytelności
        secondary: '#535353',
        disabled: '#acacac',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="homescreen" element={<HomeScreen/>}/>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
