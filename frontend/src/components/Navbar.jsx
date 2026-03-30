import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, IconButton,
  Drawer, List, ListItem, ListItemText,
  useMediaQuery, useTheme, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';

const NAV = [
  { label: 'Home',       path: '/' },
  { label: 'Assessment', path: '/assessment' },
  { label: 'Volunteers', path: '/volunteers' },
  { label: 'Therapists', path: '/therapists' },
  { label: 'Chatbot',    path: '/chatbot' },
];

export default function Navbar() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const theme       = useTheme();
  const isMobile    = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const token      = localStorage.getItem('token');
  const user       = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!token;
  const isAdmin    = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const active = p => location.pathname === p;

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(74,124,111,0.12)',
      }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: 64 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}>
            <SpaOutlinedIcon sx={{ color: '#4A7C6F', fontSize: 26 }} />
            <Typography sx={{ fontFamily: '"DM Serif Display", serif', color: '#2E5349', fontSize: '1.25rem' }}>
              MindBloom
            </Typography>
          </Box>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {NAV.map(item => (
                <Button key={item.path} component={Link} to={item.path} sx={{
                  color: active(item.path) ? '#4A7C6F' : '#4a5e58',
                  fontWeight: active(item.path) ? 700 : 500,
                  fontSize: '0.875rem', px: 1.5, borderRadius: 2,
                  bgcolor: active(item.path) ? '#eef5f3' : 'transparent',
                  '&:hover': { bgcolor: '#eef5f3' },
                }}>{item.label}</Button>
              ))}
              {isAdmin && (
                <Button component={Link} to="/admin" sx={{ color: '#6B4E9E', fontWeight: 600, fontSize: '0.875rem', px: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#f3eeff' } }}>
                  Admin
                </Button>
              )}
              <Box sx={{ ml: 1, display: 'flex', gap: 1 }}>
                {isLoggedIn ? (
                  <>
                    <Button component={Link} to="/dashboard" variant="outlined" size="small" sx={{ borderColor: '#4A7C6F', color: '#4A7C6F', borderRadius: 2 }}>Dashboard</Button>
                    <Button onClick={handleLogout} variant="contained" size="small" sx={{ bgcolor: '#4A7C6F', borderRadius: 2, '&:hover': { bgcolor: '#2E5349' } }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button component={Link} to="/login" variant="outlined" size="small" sx={{ borderColor: '#4A7C6F', color: '#4A7C6F', borderRadius: 2 }}>Login</Button>
                    <Button component={Link} to="/roleselect" variant="contained" size="small" sx={{ bgcolor: '#4A7C6F', borderRadius: 2, '&:hover': { bgcolor: '#2E5349' } }}>Register</Button>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <IconButton onClick={() => setOpen(true)}><MenuIcon sx={{ color: '#2E5349' }} /></IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240, pt: 2, px: 1 }}>
          <List>
            {NAV.map(item => (
              <ListItem key={item.path} component={Link} to={item.path} onClick={() => setOpen(false)} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            {isLoggedIn ? (
              <>
                <ListItem component={Link} to="/dashboard" onClick={() => setOpen(false)} sx={{ borderRadius: 2, mb: 0.5 }}><ListItemText primary="Dashboard" /></ListItem>
                <ListItem onClick={() => { handleLogout(); setOpen(false); }} sx={{ borderRadius: 2, cursor: 'pointer' }}><ListItemText primary="Logout" primaryTypographyProps={{ color: '#C9847A' }} /></ListItem>
              </>
            ) : (
              <>
                <ListItem component={Link} to="/login" onClick={() => setOpen(false)} sx={{ borderRadius: 2, mb: 0.5 }}><ListItemText primary="Login" /></ListItem>
                <ListItem component={Link} to="/roleselect" onClick={() => setOpen(false)} sx={{ borderRadius: 2 }}><ListItemText primary="Register" /></ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
