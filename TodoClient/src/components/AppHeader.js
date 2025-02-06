import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import { useEffect, useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useTheme } from '@mui/material/styles';
import TaskIcon from '@mui/icons-material/Task';

const pages = [
  { title: "Manage Your Tasks", route: "/toDoList" ,icon: <TaskIcon />},
];

function AppHeader() {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const [loginUser, setLoginUser] = useState(null);
  useEffect(() => {
    setLoginUser(authService.getLoginUser());
  }, [location.key]);

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' ,borderBottom:'3px solid #1976d2'}}>
      <Container maxWidth="false">
        <Toolbar disableGutters>
          <PlaylistAddCheckIcon sx={{ color: theme.palette.primary.main, fontSize: '32px' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              color: theme.palette.primary.main,
              textDecoration: "none",
              marginRight: "20px",
              fontWeight: "bold",
              fontSize: '1.5rem' // Increased font size for better visibility
            }}
          >
            Todo List
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Link style={{ textDecoration: "none", textTransform: "none", color: theme.palette.primary.main }} href={page.route}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              letterSpacing: ".3rem",
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            Todo List
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link style={{ textDecoration: "none", marginLeft: '30px', color: theme.palette.primary.main }} href={page.route} key={page.title}>
                <Button
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: theme.palette.secondary,
                    display: "block",
                    textTransform: "none",
                    fontWeight: "bold",
                    '&:hover': {
                      color: theme.palette.secondary
                    }
                  }}
                >
                  {page.title}
                  
                </Button>
              </Link>
            ))}
          </Box>

          {loginUser ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: theme.palette.primary.main, marginRight: '10px' }}>
                {loginUser.name}
              </Typography>
              <Button 
                sx={{
                  borderRadius: '50px',
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  width: '110px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0px',
                  border: '1px solid',
                  borderColor: theme.palette.primary.main, // Border color
                  transition: 'all 0.3s ease-in-out',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main, // Change background on hover
                    color: 'white', // Change text color on hover
                  }
                }} // Hover effect
                onClick={() => {
                  authService.logout();
                  navigate('/');
                }}>Log out
              </Button>
            </div>
          ) : (
            <Button
              sx={{
                borderRadius: '50px',
                padding: '10px 20px',
                backgroundColor: theme.palette.primary.main,
                width: '110px',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0px',
                border: '1px solid',
               
                transition: 'all 0.3s ease-in-out',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'white', // Change background on hover
                  color:  theme.palette.primary.main,
                }
              }}
              onClick={() => {
                navigate('/login');
              }}>Login</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
