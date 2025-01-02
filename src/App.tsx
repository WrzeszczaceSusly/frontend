import "./App.css";
import LoginForm from "./auth/LoginForm.tsx";
import RegisterForm from "./auth/RegisterForm.tsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import HomeScreen from "./core/HomeScreen.tsx";
import ProtectedRoute from "./security/ProtectedRoute.tsx";
import DogDetails from "./core/DogDetails.tsx";

declare module "@mui/material/styles" {
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
      circle: "50%",
    },
    palette: {
      primary: {
        main: "#556cd6",
        light: "#888fd6",
        dark: "#334cb2",
      },
      secondary: {
        main: "#f50057",
      },
      text: {
        primary: "#2e3131",
        secondary: "#535353",
        disabled: "#acacac",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route index element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="homescreen" element={<HomeScreen />} />
          <Route path="dog/:id" element={<DogDetails />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
