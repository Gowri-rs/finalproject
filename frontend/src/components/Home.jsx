import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Avatar, Stack } from '@mui/material';
import Navbar from './Navbar';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';

const features = [
  { icon: <PsychologyOutlinedIcon />, title: 'Self Assessment', desc: 'Understand your mental wellness with our guided emotional health quiz.', color: '#4A7C6F' },
  { icon: <AutoAwesomeIcon />,         title: 'AI Companion',   desc: '24/7 supportive conversations with our AI wellness assistant.',         color: '#C9847A' },
  { icon: <PeopleOutlineIcon />,       title: 'Volunteers',     desc: 'Connect with trained community volunteers for peer support.',            color: '#5B85A8' },
  { icon: <MedicalServicesOutlinedIcon />, title: 'Therapists', desc: 'Book sessions with licensed mental health professionals.',              color: '#D4A84B' },
];

export default function Home() {
  return (
    <Box sx={{ bgcolor: '#f7fbf9', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #2E5349 0%, #4A7C6F 60%, #6FA898 100%)',
        py: { xs: 10, md: 14 }, position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 80, height: 80, mx: 'auto', mb: 3 }}>
            <SpaOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
          </Avatar>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 400, mb: 2, fontSize: { xs: '2.2rem', md: '3rem' }, lineHeight: 1.2 }}>
            You Deserve to Feel Better
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 5, fontSize: '1.1rem', maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
            MindBloom connects you with the support you need — from self-assessments to professional therapists.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={Link} to="/roleselect" variant="contained" size="large"
              sx={{ bgcolor: 'white', color: '#2E5349', fontWeight: 700, borderRadius: 3, px: 5, py: 1.5, '&:hover': { bgcolor: '#e8f3ef' } }}>
              Get Started
            </Button>
            <Button component={Link} to="/login" variant="outlined" size="large"
              sx={{ borderColor: 'rgba(255,255,255,0.7)', color: 'white', borderRadius: 3, px: 5, py: 1.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
              Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Stats */}
      <Container sx={{ py: 7 }}>
        <Grid container spacing={3}>
          {[['10,000+','Users Supported'],['500+','Volunteers'],['150+','Therapists'],['98%','Satisfaction']].map(([val, label]) => (
            <Grid item xs={6} md={3} key={label}>
              <Card sx={{ borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(74,124,111,0.08)' }}>
                <CardContent sx={{ py: 3 }}>
                  <Typography variant="h4" sx={{ fontFamily: '"DM Serif Display", serif', color: '#2E5349', fontWeight: 400 }}>{val}</Typography>
                  <Typography sx={{ color: '#4A7C6F', fontSize: '0.9rem', mt: 0.5 }}>{label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container>
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 400, color: '#2E5349', mb: 6 }}>
            How MindBloom Helps You
          </Typography>
          <Grid container spacing={3}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(74,124,111,0.08)', transition: '0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' } }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar sx={{ bgcolor: f.color + '18', color: f.color, width: 60, height: 60, mx: 'auto', mb: 2 }}>
                      {f.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2e28', mb: 1 }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#6b8b83', lineHeight: 1.7 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ background: 'linear-gradient(135deg, #eef5f3 0%, #dfeee9 100%)', py: 10, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ fontWeight: 400, color: '#2E5349', mb: 2 }}>Ready to begin?</Typography>
          <Typography sx={{ color: '#4A7C6F', mb: 4, fontSize: '1.05rem' }}>
            Join thousands who have taken the first step toward better mental wellness.
          </Typography>
          <Button component={Link} to="/roleselect" variant="contained" size="large"
            sx={{ bgcolor: '#4A7C6F', borderRadius: 3, px: 6, py: 1.8, fontWeight: 700, fontSize: '1rem', '&:hover': { bgcolor: '#2E5349' } }}>
            Start Your Journey 🌿
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1E3530', color: 'white', py: 4, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.1rem', mb: 0.5 }}>MindBloom</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Safe space for mental wellness 🌿</Typography>
      </Box>
    </Box>
  );
}
