import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Primary color (e.g., button background)
    },
    secondary: {
      main: "#f50057", // Secondary color
    },
    background: {
      default: "#f5f5f5", // Background color for the app
    },
    text: {
      primary: "#333", // Default text color
      secondary: "#555", // Secondary text color
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1rem",
      color: "#333",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "1rem", // Add spacing between inputs
          "& .MuiInputBase-root": {
            borderRadius: "8px", // Rounded corners
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none", // Disable uppercase text
          fontSize: "20px",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#fff",
            borderRadius: "8px",
            fontSize: "20px",
          },
        },
      },
    },
  },
});

export default theme;
