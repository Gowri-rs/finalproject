import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Card, CardContent,
  Button, LinearProgress, Grid, Stack, Alert, CircularProgress,
} from '@mui/material';
import Navbar from './Navbar';
import API from '../../axiosinterceptor';
import QuestionIllustration from './QuestionIllustration';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LEFT_PANEL_HINTS = [
  'Pause & Reflect', 'Take Your Time', 'Notice Your Feelings',
  'Breathe Slowly', 'Be Honest', 'One Step at a Time',
];

const getResult = (score) => {
  if (score <= 10) return { level: 'mild',     rec: 'Gentle self-care and mindful breathing can help restore your balance.',                              route: '/chatbot',    cta: 'Talk with AI Companion' };
  if (score <= 20) return { level: 'moderate', rec: 'Connecting with a supportive volunteer can give you the perspective you need.',                      route: '/volunteers', cta: 'Connect with a Volunteer' };
  return             { level: 'severe',   rec: 'Speaking with a professional therapist can provide structured guidance through these challenges.', route: '/therapists', cta: 'Find a Therapist' };
};

export default function Assessment() {
  const navigate = useNavigate();
  const [questions,  setQuestions]  = useState([]);
  const [loadingQ,   setLoadingQ]   = useState(true);
  const [fetchErr,   setFetchErr]   = useState('');
  const [current,    setCurrent]    = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [answers,    setAnswers]    = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState('');

  useEffect(() => {
    API.get('/questions')
      .then(r => setQuestions(r.data))
      .catch(() => setFetchErr('Could not load questions. Please refresh.'))
      .finally(() => setLoadingQ(false));
  }, []);

  const shuffledQuestions = useMemo(() => {
    return questions.map(q => ({ ...q, options: shuffleArray(q.options) }));
  }, [questions]);

  if (loadingQ) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f4faf7 0%, #ffffff 100%)', pb: 8 }}>
        <Navbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress sx={{ color: '#4A7C6F' }} />
        </Box>
      </Box>
    );
  }

  if (fetchErr || shuffledQuestions.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f4faf7 0%, #ffffff 100%)', pb: 8 }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {fetchErr || 'No questions available. Please check back later.'}
          </Alert>
        </Container>
      </Box>
    );
  }

  const q        = shuffledQuestions[current];
  const progress = ((current + 1) / shuffledQuestions.length) * 100;

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = [...answers, { questionId: q._id, score: selected.score }];

    if (current < shuffledQuestions.length - 1) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
      return;
    }

    const totalScore = newAnswers.reduce((s, a) => s + a.score, 0);
    const maxScore   = shuffledQuestions.length * 5;
    const result     = getResult(totalScore);
    setSaving(true);
    setMsg('Calculating your results...');

    try {
      await API.post('/assessments', { totalScore, maxScore, recommendation: result.rec, level: result.level });
    } catch { /* non-blocking */ }

    setTimeout(() => navigate('/result', { state: { score: totalScore, maxScore } }), 1200);
  };

  const handleBack = () => {
    if (current > 0) { setCurrent(c => c - 1); setSelected(null); setAnswers(a => a.slice(0, -1)); }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f4faf7 0%, #ffffff 100%)', pb: 8 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box textAlign="center" mb={5}>
          <Typography variant="h3" sx={{ fontWeight: 400, color: '#2E5349', mb: 1 }}>Mental Wellness Assessment</Typography>
          <Typography sx={{ color: '#5a8a7d' }}>Find a calm moment and answer honestly.</Typography>
        </Box>

        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" fontWeight={700} sx={{ color: '#4A7C6F' }}>Question {current + 1} of {shuffledQuestions.length}</Typography>
            <Typography variant="caption" sx={{ color: '#6b8b83' }}>{Math.round(progress)}% complete</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0ede9', '& .MuiLinearProgress-bar': { bgcolor: '#4A7C6F', borderRadius: 4 } }} />
        </Box>

        {msg && <Alert severity="success" sx={{ mb: 3, maxWidth: 600, mx: 'auto', borderRadius: 3 }}>{msg}</Alert>}

<Card
  sx={{
    borderRadius: 6,
    boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  }}
>          <Grid container>
            <Grid
  item
  xs={12}
  md={4}
  sx={{
    background: 'linear-gradient(180deg, #4A7C6F 0%, #5f9486 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 3,
    minHeight: '100%'
  }}
>
  <Box sx={{ width: '100%', mt: 2 }}>
    <QuestionIllustration imageKey={q.imageKey || 'default'} />
  </Box>

  <Box sx={{ textAlign: 'center', px: 2, pb: 2 }}>
    <Typography variant="h6" fontWeight={600} mb={1.5}>
      {LEFT_PANEL_HINTS[current % LEFT_PANEL_HINTS.length]}
    </Typography>

    <Typography
      sx={{
        opacity: 0.85,
        lineHeight: 1.7,
        fontSize: '0.95rem'
      }}
    >
      There are no wrong answers. Just be honest with yourself.
    </Typography>
  </Box>
</Grid>

            <Grid item xs={12} md={8}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Typography variant="h5" fontWeight={600} sx={{ color: '#1a2e28', mb: 4, lineHeight: 1.4 }}>
                  {q.question}
                </Typography>
                <Stack spacing={1.5} sx={{ maxWidth: 480 }}>
                  {q.options.map((opt, i) => {
                    const isSelected = selected?.text === opt.text;
                    return (
                      <Button key={opt._id || i} fullWidth
                        variant={isSelected ? 'contained' : 'outlined'}
                        onClick={() => setSelected(opt)}
                        sx={{
                          py: 1.5, borderRadius: 2.5, textTransform: 'none',
                          fontSize: '0.95rem', justifyContent: 'flex-start', px: 2.5,
                          borderColor: '#d0e5de',
                          bgcolor: isSelected ? '#4A7C6F' : 'white',
                          color:   isSelected ? 'white'   : '#2E5349',
                          '&:hover': { borderColor: '#4A7C6F', bgcolor: isSelected ? '#3b665a' : '#f0f8f4' },
                        }}>
                        {opt.text}
                      </Button>
                    );
                  })}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 4, maxWidth: 480 }}>
                  <Button onClick={handleBack} disabled={current === 0} sx={{ flex: 1, color: '#4A7C6F', fontWeight: 600 }}>← Back</Button>
                  <Button variant="contained" onClick={handleNext} disabled={!selected || saving}
                    sx={{ flex: 2, py: 1.4, borderRadius: 3, bgcolor: '#4A7C6F', fontWeight: 700, '&:hover': { bgcolor: '#2E5349' } }}>
                    {saving ? 'Saving...' : current === shuffledQuestions.length - 1 ? 'Finish' : 'Next →'}
                  </Button>
                </Stack>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}
