import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Avatar, Chip } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import Navbar from './Navbar';

const ROLES = [
  { id: 'user',      label: 'I Need Support',    sub: 'User',      icon: <PersonOutlineIcon />,                 color: '#4A7C6F', desc: 'Take assessments and connect with support resources.' },
  { id: 'volunteer', label: 'I Want to Help',    sub: 'Volunteer', icon: <VolunteerActivismOutlinedIcon />,     color: '#5B85A8', desc: 'Offer peer support to people in need.' },
  { id: 'therapist', label: "I'm a Professional", sub: 'Therapist', icon: <MedicalServicesOutlinedIcon />, color: '#C9847A', desc: 'Join as a licensed mental health professional.' },
];

export default function RoleSelect() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const role = ROLES.find(r => r.id === selected);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 400, color: '#2E5349', mb: 2 }}>
          Who are you?
        </Typography>
        <Typography textAlign="center" sx={{ color: '#4A7C6F', mb: 6, fontSize: '1.05rem' }}>
          Choose your role to get started
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {ROLES.map(r => (
            <Grid item xs={12} sm={4} key={r.id}>
              <Card onClick={() => setSelected(r.id)} sx={{
                cursor: 'pointer', borderRadius: 4, textAlign: 'center',
                border: selected === r.id ? `2px solid ${r.color}` : '2px solid transparent',
                boxShadow: selected === r.id ? `0 8px 30px ${r.color}30` : '0 4px 16px rgba(0,0,0,0.06)',
                transition: 'all 0.25s', p: 1,
                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 30px ${r.color}25` },
              }}>
                <CardContent sx={{ py: 4 }}>
                  <Avatar sx={{ bgcolor: r.color + '20', color: r.color, width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    {r.icon}
                  </Avatar>
                  <Chip label={r.sub} size="small" sx={{ mb: 1.5, bgcolor: r.color + '15', color: r.color, fontWeight: 700 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2e28', mb: 1 }}>{r.label}</Typography>
                  <Typography variant="body2" sx={{ color: '#6b8b83', lineHeight: 1.6 }}>{r.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selected && (
          <Box textAlign="center" mt={5} sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" size="large" onClick={() => navigate('/login')}
              sx={{ borderColor: role.color, color: role.color, borderRadius: 3, px: 5, fontWeight: 700, '&:hover': { bgcolor: role.color + '10' } }}>
              Login
            </Button>
            <Button variant="contained" size="large" onClick={() => navigate(`/register?role=${selected}`)}
              sx={{ bgcolor: role.color, borderRadius: 3, px: 5, fontWeight: 700, '&:hover': { bgcolor: '#2E5349' } }}>
              Register as {role.sub}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
