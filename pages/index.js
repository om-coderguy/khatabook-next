import "../styles/globals.css";
import Auth from "./login";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/app/theme";
Auth;

export default function Home() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Auth />
      </ThemeProvider>
    </div>
  );
}
