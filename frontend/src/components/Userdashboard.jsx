import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Avatar, Button, CircularProgress, Chip,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SmartToyOutlinedIcon   from '@mui/icons-material/SmartToyOutlined';
import PeopleOutlineIcon      from '@mui/icons-material/PeopleOutline';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import Navbar from './Navbar';
import API from '../../axiosinterceptor';

const ACTIONS = [
  { title: 'Assessment', icon: <AssignmentOutlinedIcon />, path: '/assessment', color: '#4A7C6F', desc: 'Check your wellness' },
  { title: 'AI Chatbot',  icon: <SmartToyOutlinedIcon />,  path: '/chatbot',    color: '#5B85A8', desc: '24/7 support' },
  { title: 'Volunteers',  icon: <PeopleOutlineIcon />,      path: '/volunteers', color: '#C9847A', desc: 'Peer support' },
  { title: 'Therapists',  icon: <MedicalServicesOutlinedIcon />, path: '/therapists', color: '#D4A84B', desc: 'Professional help' },
];

const LEVEL_COLOR = { mild: '#4A7C6F', moderate: '#C9847A', severe: '#D4A84B' };

export default function UserDashboard() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    API.get('/assessments')
      .then(r => setAssessments(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container sx={{ py: 5 }}>
        <Box mb={5}>
          <Typography variant="h3" sx={{ fontWeight: 400, color: '#2E5349' }}>
            Hello, {user?.name?.split(' ')[0] || 'there'} 🌿
          </Typography>
          <Typography sx={{ color: '#6b8b83', mt: 0.5 }}>How are you feeling today?</Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E5349', mb: 2 }}>Quick Actions</Typography>
        <Grid container spacing={2.5} mb={5}>
          {ACTIONS.map(a => (
            <Grid item xs={6} md={3} key={a.title}>
              <Card onClick={() => navigate(a.path)} sx={{
                cursor: 'pointer', borderRadius: 4, textAlign: 'center', py: 3,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid rgba(74,124,111,0.08)',
                transition: 'all 0.25s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 28px ${a.color}25` },
              }}>
                <Avatar sx={{ bgcolor: a.color + '18', color: a.color, mx: 'auto', mb: 1.5, width: 52, height: 52 }}>{a.icon}</Avatar>
                <Typography fontWeight={700} sx={{ color: '#1a2e28', fontSize: '0.95rem' }}>{a.title}</Typography>
                <Typography variant="caption" sx={{ color: '#6b8b83' }}>{a.desc}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E5349' }}>Assessment History</Typography>
          <Button onClick={() => navigate('/assessment')} variant="contained" size="small"
            sx={{ bgcolor: '#4A7C6F', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: '#2E5349' } }}>
            Take New
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}><CircularProgress sx={{ color: '#4A7C6F' }} /></Box>
        ) : assessments.length === 0 ? (
          <Card sx={{ borderRadius: 4, textAlign: 'center', py: 6, boxShadow: 'none', border: '2px dashed #c8e0d8' }}>
            <Typography sx={{ color: '#6b8b83' }}>No assessments yet.</Typography>
            <Button onClick={() => navigate('/assessment')} sx={{ mt: 1, color: '#4A7C6F', fontWeight: 700 }}>
              Take your first one →
            </Button>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {assessments.map(a => (
              <Grid item xs={12} md={6} key={a._id}>
                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid rgba(74,124,111,0.08)' }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography fontWeight={700} sx={{ color: '#1a2e28' }}>Score: {a.totalScore} / {a.maxScore}</Typography>
                      <Typography variant="body2" sx={{ color: '#6b8b83', mt: 0.5 }}>{a.recommendation}</Typography>
                      <Typography variant="caption" sx={{ color: '#aabfb8' }}>
                        {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Typography>
                    </Box>
                    {a.level && (
                      <Chip label={a.level} size="small"
                        sx={{ bgcolor: (LEVEL_COLOR[a.level] || '#4A7C6F') + '18', color: LEVEL_COLOR[a.level] || '#4A7C6F', fontWeight: 700, textTransform: 'capitalize' }} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
