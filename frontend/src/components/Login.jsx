import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import API from '../../axiosinterceptor';
import Navbar from './Navbar';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Card sx={{ borderRadius: 5, boxShadow: '0 16px 40px rgba(46,83,73,0.1)', border: '1px solid rgba(74,124,111,0.1)' }}>
          <CardContent sx={{ p: 5 }}>
            <Box textAlign="center" mb={4}>
              <SpaOutlinedIcon sx={{ color: '#4A7C6F', fontSize: 36, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 400, color: '#2E5349' }}>Welcome back</Typography>
              <Typography sx={{ color: '#6b8b83', mt: 0.5, fontSize: '0.95rem' }}>Sign in to your account</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth label="Password" name="password" type={showPw ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)} edge="end">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )}} />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{ borderRadius: 3, py: 1.6, bgcolor: '#4A7C6F', fontWeight: 700, fontSize: '1rem', mt: 1, '&:hover': { bgcolor: '#2E5349' } }}>
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
              </Button>
            </Box>

            <Typography textAlign="center" sx={{ mt: 3, color: '#6b8b83', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/roleselect" style={{ color: '#4A7C6F', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
