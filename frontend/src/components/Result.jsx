import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Card, CardContent, Typography, Button, LinearProgress, Avatar, Stack } from '@mui/material';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import Navbar from './Navbar';

const getResult = (score) => {
  if (score <= 10) return { title: 'Mild Emotional Stress', color: '#4A7C6F', icon: <PsychologyOutlinedIcon sx={{ fontSize: 36 }} />, message: 'Your responses suggest mild emotional strain. Gentle self-care, mindful breathing, and consistent routines may help you regain your balance.', cta: 'Talk with AI Companion', route: '/chatbot' };
  if (score <= 20) return { title: 'Moderate Emotional Difficulty', color: '#C9847A', icon: <PeopleOutlineIcon sx={{ fontSize: 36 }} />, message: "Things have been heavy lately. Connecting with a supportive volunteer can give you the perspective and encouragement you need.", cta: 'Connect with a Volunteer', route: '/volunteers' };
  return             { title: 'Support Recommended', color: '#D4A84B', icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 36 }} />, message: "You're carrying a lot right now. Speaking with a professional therapist can provide a safe, structured way to navigate these challenges.", cta: 'Find a Therapist', route: '/therapists' };
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score ?? 0;
  const maxScore = 30;
  const result = getResult(score);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7f4 0%, #ffffff 100%)', pb: 8 }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ pt: { xs: 5, md: 8 } }}>
        <Card sx={{ borderRadius: 6, boxShadow: '0 24px 60px rgba(46,83,73,0.12)', border: '1px solid #e0ede9', overflow: 'hidden' }}>
          <Box sx={{ height: 6, bgcolor: result.color }} />
          <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: result.color + '20', color: result.color, width: 80, height: 80, mx: 'auto', mb: 3 }}>
              {result.icon}
            </Avatar>

            <Typography variant="caption" sx={{ color: '#4A7C6F', fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 1 }}>
              YOUR RESULT
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h2" sx={{ fontFamily: '"DM Serif Display", serif', color: result.color, fontWeight: 400, lineHeight: 1 }}>
                {score}
              </Typography>
              <Typography sx={{ color: '#aabfb8', fontWeight: 600, mt: 0.5 }}>out of {maxScore}</Typography>
            </Box>

            <LinearProgress variant="determinate" value={(score / maxScore) * 100} sx={{
              height: 10, borderRadius: 5, mb: 4, bgcolor: '#eef5f3',
              '& .MuiLinearProgress-bar': { bgcolor: result.color, borderRadius: 5 },
            }} />

            <Box sx={{ bgcolor: result.color + '08', border: `1px dashed ${result.color}40`, borderRadius: 4, p: 3, mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2e28', mb: 1.5 }}>{result.title}</Typography>
              <Typography sx={{ color: '#4A7C6F', lineHeight: 1.8 }}>{result.message}</Typography>
            </Box>

            <Stack spacing={2}>
              <Button fullWidth variant="contained" size="large" onClick={() => navigate(result.route)} sx={{
                bgcolor: result.color, py: 1.8, borderRadius: 3, fontWeight: 700, fontSize: '1rem', textTransform: 'none',
                boxShadow: `0 8px 20px ${result.color}40`, '&:hover': { filter: 'brightness(0.9)' },
              }}>
                {result.cta} →
              </Button>
              <Button onClick={() => navigate('/assessment')} sx={{ color: '#6b8b83', textTransform: 'none', fontWeight: 600 }}>
                Retake Assessment
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 4, color: '#aabfb8', px: 4, lineHeight: 1.7 }}>
          This assessment is a self-reflection tool and not a clinical diagnosis. If you are in immediate distress, please contact emergency services.
        </Typography>
      </Container>
    </Box>
  );
}
