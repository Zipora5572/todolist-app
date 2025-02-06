import React from "react";
import AppHeader from "./AppHeader";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Footer from "./Footer";


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A modern blue
    },
    secondary: {
      main: '#dc004e', // A modern pink
    },
    background: {
      default: 'white', // Light background for better contrast
    },
  },
});
const Layout = ({ children }) => {
  return (
    <>
      <div>
        <AppHeader />
      </div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box  component="main"
          flexGrow={1} // Allows the main content to grow and fill available space
          display="flex"
          justifyContent="center" // Center horizontally
          alignItems="center"  > 
          {children}
        </Box>
        <Box sx={{  p: 1 ,marginBottom:0}} component="footer">
          <Footer/>
        </Box>

      </ThemeProvider>
    </>
  );
};

export default Layout;
