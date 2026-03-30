import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"DM Serif Display", serif' },
    h2: { fontFamily: '"DM Serif Display", serif' },
    h3: { fontFamily: '"DM Serif Display", serif' },
    h4: { fontFamily: '"DM Serif Display", serif' },
  },
  palette: {
    primary:   { main: '#4A7C6F' },
    secondary: { main: '#C9847A' },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
