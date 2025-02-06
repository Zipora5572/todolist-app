import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Service from "../services/authService";
import { useState } from "react";
import Container from "@mui/material/Container";
import { useTheme } from '@mui/material/styles';

export default function Login() {
  const theme = useTheme();
  const [name, setName] = useState("default");
  const [password, setPassword] = useState("123456");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await Service.login(name, password);
    navigate("/toDoList", { replace: true });
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="name"
            name="username"
            autoComplete="true"
            autoFocus
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
         <FormControlLabel
  control={<Checkbox value="remember" color="primary" />}
  label={<Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Remember me</Typography>} // Smaller text
/>
          
          <Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{
    mt: 3,
    mb: 2,
    backgroundColor: theme.palette.primary.main, // Use primary color
    color: '#FFFFFF', // White text for contrast
    '&:hover': {
      backgroundColor: theme.palette.secondary.main, 
    },
    textTransform: 'none',
  }}
>
  Sign In
</Button>

          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Dont have an account? Sign up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
