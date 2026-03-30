import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, CircularProgress, Avatar, Chip, Divider,
  Dialog, DialogContent, DialogTitle, IconButton, Stack,
} from '@mui/material';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Navbar from './Navbar';
import API from '../../axiosinterceptor';

const COLOR = '#C9847A';

function ProfileModal({ person, open, onClose, onBook }) {
  if (!person) return null;
  const initials = person.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const fields = [
    { icon: <MedicalServicesOutlinedIcon fontSize="small" />, label: 'Specialization', value: person.specialization },
    { icon: <SchoolOutlinedIcon fontSize="small" />,          label: 'Qualification',  value: person.qualification },
    { icon: <BadgeOutlinedIcon fontSize="small" />,           label: 'License No.',    value: person.license },
    { icon: <TranslateIcon fontSize="small" />,               label: 'Language',       value: person.language },
    { icon: <AccessTimeOutlinedIcon fontSize="small" />,      label: 'Availability',   value: person.availability },
    { icon: <CurrencyRupeeIcon fontSize="small" />,           label: 'Consultation Fee', value: person.consultationFee ? `₹${person.consultationFee}` : null },
  ].filter(f => f.value);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 5, overflow: 'hidden' } }}>
      <Box sx={{ height: 6, bgcolor: COLOR }} />
      <DialogTitle sx={{ pb: 0, pt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: COLOR + '20', color: COLOR, width: 56, height: 56, fontWeight: 700, fontSize: '1.2rem' }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#1a2e28' }}>{person.name}</Typography>
              <Chip label="Therapist" size="small"
                sx={{ bgcolor: COLOR + '15', color: COLOR, fontWeight: 600, fontSize: '0.75rem', height: 22, mt: 0.5 }} />
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#6b8b83' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Divider sx={{ mb: 2.5 }} />
        <Stack spacing={1.8}>
          {fields.map(({ icon, label, value }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ color: COLOR, mt: 0.2, flexShrink: 0 }}>{icon}</Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#6b8b83', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5 }}>
                  {label}
                </Typography>
                <Typography variant="body2" sx={{ color: '#1a2e28', fontWeight: 500, mt: 0.1 }}>{value}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 2.5 }} />
        <Button fullWidth variant="contained" onClick={() => { onClose(); onBook(person._id); }}
          sx={{ borderRadius: 3, py: 1.4, bgcolor: COLOR, fontWeight: 700, '&:hover': { filter: 'brightness(0.9)' } }}>
          Book a Session
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function TherapistCard({ person, onViewProfile }) {
  const initials = person.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <Card sx={{
      borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
      border: '1px solid rgba(74,124,111,0.08)', transition: 'all 0.25s', cursor: 'pointer',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 28px ${COLOR}22` },
      overflow: 'hidden',
    }} onClick={() => onViewProfile(person)}>
      <Box sx={{ height: 6, bgcolor: COLOR }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: COLOR + '20', color: COLOR, width: 48, height: 48, fontWeight: 700 }}>{initials}</Avatar>
          <Box>
            <Typography fontWeight={700} sx={{ color: '#1a2e28' }}>{person.name}</Typography>
            <Chip label="therapist" size="small" sx={{ bgcolor: COLOR + '15', color: COLOR, fontWeight: 600, fontSize: '0.75rem', height: 20 }} />
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {[
          ['Specialization',   person.specialization],
          ['Language',         person.language],
          ['Availability',     person.availability],
          ['Consultation Fee', person.consultationFee ? `₹${person.consultationFee}` : null],
        ].filter(([, v]) => v).map(([label, value]) => (
          <Typography key={label} variant="body2" sx={{ color: '#4a5e58', mb: 0.5 }}>
            <strong>{label}:</strong> {value}
          </Typography>
        ))}
        <Button fullWidth variant="outlined" onClick={e => { e.stopPropagation(); onViewProfile(person); }}
          sx={{ mt: 2.5, borderColor: COLOR, color: COLOR, borderRadius: 2.5, fontWeight: 700, '&:hover': { bgcolor: COLOR + '10' } }}>
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}

export default function TherapistPage() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/therapists').then(r => setTherapists(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
          <Avatar sx={{ bgcolor: COLOR + '20', color: COLOR, width: 52, height: 52 }}><MedicalServicesOutlinedIcon /></Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 400, color: '#2E5349' }}>Find a Therapist</Typography>
            <Typography sx={{ color: '#6b8b83', fontSize: '0.95rem' }}>
              {therapists.length} therapist{therapists.length !== 1 ? 's' : ''} available
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: COLOR }} /></Box>
        ) : therapists.length === 0 ? (
          <Card sx={{ borderRadius: 4, textAlign: 'center', py: 8, boxShadow: 'none', border: '2px dashed #c8e0d8' }}>
            <Typography sx={{ color: '#6b8b83' }}>No therapists available yet.</Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {therapists.map(p => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <TherapistCard person={p} onViewProfile={setSelected} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <ProfileModal
        person={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onBook={id => navigate(`/book/therapist/${id}`)}
      />
    </Box>
  );
}
