import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, Alert, CircularProgress, InputAdornment, IconButton, Chip,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import API from '../../axiosinterceptor';
import Navbar from './Navbar';

const COLORS = { user: '#4A7C6F', volunteer: '#5B85A8', therapist: '#C9847A' };

// ✅ Field is defined OUTSIDE Register — never recreated on re-render
const Field = ({ name, label, type = 'text', placeholder, value, onChange }) => (
  <TextField
    fullWidth label={label} name={name} type={type}
    placeholder={placeholder} value={value} onChange={onChange}
    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
  />
);

export default function Register() {
  const [params]  = useSearchParams();
  const role      = params.get('role') || 'user';
  const navigate  = useNavigate();
  const color     = COLORS[role] || '#4A7C6F';

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', supportArea: '', experience: '',
    language: 'English', availability: '',
    specialization: '', qualification: '',
    license: '', consultationFee: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ useCallback so handler is never recreated on re-render
  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { ...form, role });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card sx={{ borderRadius: 5, boxShadow: '0 16px 40px rgba(46,83,73,0.1)', border: '1px solid rgba(74,124,111,0.1)' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>

            <Box textAlign="center" mb={4}>
              <Chip label={role.toUpperCase()} sx={{ mb: 2, bgcolor: color + '18', color, fontWeight: 700, fontSize: '0.8rem' }} />
              <Typography variant="h4" sx={{ fontWeight: 400, color: '#2E5349' }}>Create Account</Typography>
              <Typography sx={{ color: '#6b8b83', mt: 0.5, fontSize: '0.95rem' }}>Register as {role}</Typography>
            </Box>

            {error   && <Alert severity="error"   sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              <Field name="name"  label="Full Name" value={form.name}  onChange={handleChange} />
              <Field name="email" label="Email" type="email" value={form.email} onChange={handleChange} />

              <TextField
                fullWidth label="Password" name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(p => !p)} edge="end">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )}}
              />

              {role === 'volunteer' && <>
                <Field name="phone"        label="Phone Number"   value={form.phone}        onChange={handleChange} />
                <Field name="supportArea"  label="Support Area"   value={form.supportArea}  onChange={handleChange} placeholder="e.g. Anxiety, Grief, Stress" />
                <Field name="experience"   label="Experience"     value={form.experience}   onChange={handleChange} />
                <Field name="language"     label="Language"       value={form.language}     onChange={handleChange} />
                <Field name="availability" label="Availability"   value={form.availability} onChange={handleChange} placeholder="e.g. Weekends, Evenings" />
              </>}

              {role === 'therapist' && <>
                <Field name="specialization"  label="Specialization"   value={form.specialization}  onChange={handleChange} />
                <Field name="qualification"   label="Qualification"    value={form.qualification}   onChange={handleChange} />
                <Field name="license"         label="License Number"   value={form.license}         onChange={handleChange} />
                <Field name="consultationFee" label="Consultation Fee" value={form.consultationFee} onChange={handleChange} />
                <Field name="language"        label="Language"         value={form.language}        onChange={handleChange} />
                <Field name="availability"    label="Availability"     value={form.availability}    onChange={handleChange} />
              </>}

              <Button type="submit" fullWidth variant="contained" size="large"
                disabled={loading || !!success}
                sx={{ borderRadius: 3, py: 1.6, bgcolor: color, fontWeight: 700, fontSize: '1rem', mt: 1, '&:hover': { filter: 'brightness(0.9)' } }}>
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
              </Button>

            </Box>

            <Typography textAlign="center" sx={{ mt: 3, color: '#6b8b83', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </Typography>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}