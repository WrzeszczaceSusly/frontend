// src/components/DogDetails.tsx
import React, { useEffect, useState } from "react";
import { introBodyStyle } from "../config/style.tsx";
import { useParams, Link } from "react-router-dom";
import { Dog } from "../data/Dog";
import HOST from "../config/apiConst.tsx";
import NavBar from "./NavBar.tsx";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Card,
  CardContent,
  Stack,
  TextField
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Ikony Material UI
import PetsIcon from "@mui/icons-material/Pets";
import WcIcon from "@mui/icons-material/Wc";
import ScaleIcon from "@mui/icons-material/Scale";
import StraightenIcon from "@mui/icons-material/Straighten";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"; // do szczepienia
import FavoriteIcon from "@mui/icons-material/Favorite"; // do sterylizacji
import ChildCareIcon from "@mui/icons-material/ChildCare"; // do przyjazności wobec dzieci
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined"; // do przyjazności wobec zwierząt
import LocationSearchingIcon from "@mui/icons-material/LocationSearching"; // do mikrochipa

// reservation
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs"; // For handling dates
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers";
import { MenuItem, Alert } from "@mui/material";

const DogDetails: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [dog, setDog] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // reservation
  const [reservationDate, setReservationDate] = useState<Dayjs | null>(null);
const [reservationError, setReservationError] = useState<string | null>(null);
const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);
const [reservationTime, setReservationTime] = useState<string | null>(null);
const [unavailableMessage, setReservationStatusMessage] = useState<string | null>(null);

const timeOptions = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchDog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${HOST}/dogs/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // jeśli wymagana autoryzacja
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać danych o wybranym psie.");
      }

      const data: Dog = await response.json();
      setDog(data);
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd podczas pobierania danych o psie.");
    } finally {
      setLoading(false);
    }
  };

  fetchDog();
}, [id]);

  if (loading) {
    return (
      <div style={introBodyStyle}>
        <NavBar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: theme.spacing(8),
          }}
        >
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div style={introBodyStyle}>
        <NavBar />
        <Box
          sx={{
            marginTop: theme.spacing(8),
            textAlign: "center",
          }}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </div>
    );
  }

  if (!dog) {
    return (
      <div style={introBodyStyle}>
        <NavBar />
        <Box
          sx={{
            marginTop: theme.spacing(8),
            textAlign: "center",
          }}
        >
          <Typography>Nie znaleziono danych psa.</Typography>
        </Box>
      </div>
    );
  }

  const handleReservation = async () => {
    if (!reservationDate || !reservationTime) return;
  
    try {
      const token = localStorage.getItem("token");
      
      setReservationStatusMessage(null);
      const reservationDateTime = `${reservationDate.format("YYYY-MM-DD")}T${reservationTime}:00`;
      const response = await fetch(`${HOST}/reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // jeśli wymagana autoryzacja
        },
        body: JSON.stringify({
          dogId: id, // Assuming id comes from useParams()
          date: reservationDateTime,
        }),
      });

      const isAvailable = await response.json();
      if (isAvailable) {
        setReservationStatusMessage(`Rezerwacja pomyślnie zapisana`);
      } else {
        setReservationStatusMessage(`Godzina ${reservationTime} w dniu ${reservationDate} jest już zajęta.`);
      }
    } catch (error) {
      console.error(error);
      setReservationStatusMessage("Wystąpił błąd podczas rezerwacji. Spróbuj ponownie.");
    }
  };


  return (
    <div style={introBodyStyle}>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        {/* BOX z imieniem psa (z obramowaniem) */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            borderColor: "primary.main",
            textAlign: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {dog.name}
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {/* Sekcja główna: zdjęcie i kluczowe info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            {/* Duży obraz po lewej */}
            <Box
              sx={{
                flex: { xs: "1 1 auto", md: "0 0 50%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {dog.image ? (
                <img
                  src={`data:image/jpeg;base64,${dog.image}`}
                  alt={dog.name}
                  style={{
                    width: "400px",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <Typography>Brak zdjęcia</Typography>
              )}
            </Box>

            {/* Dane zasadnicze w formie kart z ikonami */}
            <Box sx={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: 2 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PetsIcon color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Rasa:
                    </Typography>
                    <Typography variant="body1">{dog.breedName}</Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <WcIcon color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Płeć:
                    </Typography>
                    <Typography variant="body1">
                      {dog.sex === "male" ? "Pies" : "Suka"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ScaleIcon color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Waga:
                    </Typography>
                    <Typography variant="body1">{dog.weight} kg</Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <StraightenIcon color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Rozmiar:
                    </Typography>
                    <Typography variant="body1">{dog.size}</Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ChildCareIcon color="primary" />
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Wiek:
                    </Typography>
                    <Typography variant="body1">{dog.age} lat</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Opis w osobnym boxie (z ikoną) */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <FavoriteIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Opis
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ textAlign: "justify" }}>
              {dog.description}
            </Typography>
          </Box>

          {/* Sekcja rozwijana – Dodatkowe informacje */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="additional-info-content"
              id="additional-info-header"
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Dodatkowe informacje
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                {/* Kolor sierści */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <ColorLensIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Kolor sierści:
                  </Typography>
                  <Typography variant="body1">{dog.color}</Typography>
                </Stack>

                {/* Zaszczepiony */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <HealthAndSafetyIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Zaszczepiony:
                  </Typography>
                  <Typography variant="body1">
                    {dog.vaccinated ? "Tak" : "Nie"}
                  </Typography>
                </Stack>

                {/* Wysterylizowany */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <FavoriteIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Wysterylizowany:
                  </Typography>
                  <Typography variant="body1">
                    {dog.sterilized ? "Tak" : "Nie"}
                  </Typography>
                </Stack>

                {/* Mikrochip */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationSearchingIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Mikrochip:
                  </Typography>
                  <Typography variant="body1">
                    {dog.microchipped ? "Tak" : "Nie"}
                  </Typography>
                </Stack>

                {/* Przyjazny dzieciom */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <ChildCareIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Przyjazny dzieciom:
                  </Typography>
                  <Typography variant="body1">
                    {dog.friendlyWithKids ? "Tak" : "Nie"}
                  </Typography>
                </Stack>

                {/* Przyjazny innym zwierzętom */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <PetsOutlinedIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Przyjazny innym zwierzętom:
                  </Typography>
                  <Typography variant="body1">
                    {dog.friendlyWithAnimals ? "Tak" : "Nie"}
                  </Typography>
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Przycisk powrotu */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              component={Link}
              to="/homescreen"
              sx={{ textTransform: "none" }}
            >
              Powrót do listy
            </Button>
          </Box>
        </Paper>
        
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
                Umów Wizytę
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DatePicker
                  label="Wybierz dzień wizyty"
                  value={reservationDate}
                  onChange={(newValue) => setReservationDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TextField
                  select
                  label="Wybierz godzinę"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                >
                  {timeOptions.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  onClick={handleReservation}
                  disabled={!reservationDate || !reservationTime}
                >
                  Zarezerwuj
                </Button>
                {unavailableMessage && (
                  <Alert severity={unavailableMessage.includes("pomyślnie") ? "success" : "warning"} sx={{ mt: 2 }}>
                  {unavailableMessage}
                </Alert>
                )}
              </Box>
            </Paper>
        </LocalizationProvider>
      </Container>
    </div>
  );
};

export default DogDetails;
