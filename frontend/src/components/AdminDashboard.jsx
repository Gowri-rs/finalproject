import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button,
  CircularProgress, Stack, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Divider, Collapse, Tooltip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from './Navbar';
import API from '../../axiosinterceptor';

const ROLE_COLOR = { volunteer: '#5B85A8', therapist: '#C9847A' };

// ─── Expanded user detail row ─────────────────────────────────────────────────
function UserDetailRow({ user }) {
  const isTherapist = user.role === 'therapist';
  const fields = isTherapist
    ? [
        ['Specialization', user.specialization],
        ['Qualification',  user.qualification],
        ['License No.',    user.license],
        ['Consultation Fee', user.consultationFee ? `₹${user.consultationFee}` : null],
        ['Language',       user.language],
        ['Availability',   user.availability],
        ['Phone',          user.phone],
      ]
    : [
        ['Support Area',   user.supportArea],
        ['Experience',     user.experience],
        ['Language',       user.language],
        ['Availability',   user.availability],
        ['Phone',          user.phone],
      ];

  return (
    <Box sx={{ bgcolor: '#f7fbf9', borderRadius: 2, p: 2, mt: 1 }}>
      <Typography variant="caption" fontWeight={700} sx={{ color: '#4A7C6F', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Full Details
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
        {fields.filter(([, v]) => v).map(([label, value]) => (
          <Box key={label} sx={{ minWidth: 140 }}>
            <Typography variant="caption" sx={{ color: '#9bb8b0', display: 'block', fontWeight: 600 }}>{label}</Typography>
            <Typography variant="body2" sx={{ color: '#1a2e28', fontWeight: 500 }}>{value}</Typography>
          </Box>
        ))}
        <Box>
          <Typography variant="caption" sx={{ color: '#9bb8b0', display: 'block', fontWeight: 600 }}>Registered</Typography>
          <Typography variant="body2" sx={{ color: '#1a2e28', fontWeight: 500 }}>
            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Approval tab ─────────────────────────────────────────────────────────────
function ApprovalTab() {
  const [pending,   setPending]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [actionId,  setActionId]  = useState(null);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [tab,       setTab]       = useState('all');
  const [expanded,  setExpanded]  = useState({});

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/pending-users');
      setPending(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleAction = async (id, action) => {
    setActionId(id); setError(''); setSuccess('');
    try {
      const res = await API.put(`/admin/${action}/${id}`);
      setSuccess(res.data.message);
      fetchPending();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = tab === 'all' ? pending : pending.filter(u => u.role === tab);

  return (
    <Box>
      {error   && <Alert severity="error"   sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Card sx={{ borderRadius: 5, boxShadow: '0 8px 30px rgba(0,0,0,0.07)', border: '1px solid rgba(74,124,111,0.08)' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: '1px solid rgba(74,124,111,0.1)', px: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }, '& .Mui-selected': { color: '#4A7C6F' }, '& .MuiTabs-indicator': { bgcolor: '#4A7C6F' } }}>
              <Tab label={`All (${pending.length})`} value="all" />
              <Tab label={`Volunteers (${pending.filter(u => u.role === 'volunteer').length})`} value="volunteer" />
              <Tab label={`Therapists (${pending.filter(u => u.role === 'therapist').length})`} value="therapist" />
            </Tabs>
          </Box>

          {loading ? (
            <Box textAlign="center" py={8}><CircularProgress sx={{ color: '#4A7C6F' }} /></Box>
          ) : filtered.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography sx={{ color: '#6b8b83' }}>No pending {tab === 'all' ? 'users' : tab + 's'} 🎉</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f7fbf9' }}>
                    {['', 'Name', 'Email', 'Role', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#4a5e58', fontSize: '0.85rem' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(user => (
                    <React.Fragment key={user._id}>
                      <TableRow sx={{ '&:hover': { bgcolor: '#f7fbf9' } }}>
                        <TableCell sx={{ width: 36 }}>
                          <Tooltip title={expanded[user._id] ? 'Hide details' : 'Show all details'}>
                            <IconButton size="small" onClick={() => setExpanded(e => ({ ...e, [user._id]: !e[user._id] }))}>
                              {expanded[user._id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: (ROLE_COLOR[user.role] || '#4A7C6F') + '20', color: ROLE_COLOR[user.role] || '#4A7C6F', width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700 }}>
                              {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography fontWeight={600} sx={{ color: '#1a2e28' }}>{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#4a5e58', fontSize: '0.9rem' }}>{user.email}</TableCell>
                        <TableCell>
                          <Chip label={user.role} size="small"
                            sx={{ bgcolor: (ROLE_COLOR[user.role] || '#4A7C6F') + '15', color: ROLE_COLOR[user.role] || '#4A7C6F', fontWeight: 700, textTransform: 'capitalize' }} />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button variant="contained" size="small" startIcon={<CheckCircleOutlineIcon />}
                              disabled={actionId === user._id}
                              onClick={() => handleAction(user._id, 'approve')}
                              sx={{ bgcolor: '#4A7C6F', borderRadius: 2, fontSize: '0.8rem', textTransform: 'none', '&:hover': { bgcolor: '#2E5349' } }}>
                              {actionId === user._id ? <CircularProgress size={14} sx={{ color: 'white' }} /> : 'Approve'}
                            </Button>
                            <Button variant="outlined" size="small" startIcon={<CancelOutlinedIcon />}
                              disabled={actionId === user._id}
                              onClick={() => handleAction(user._id, 'reject')}
                              sx={{ borderColor: '#C9847A', color: '#C9847A', borderRadius: 2, fontSize: '0.8rem', textTransform: 'none', '&:hover': { bgcolor: '#fdf0ee' } }}>
                              Reject
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                      {/* Expandable full detail row */}
                      <TableRow>
                        <TableCell colSpan={5} sx={{ py: 0, border: expanded[user._id] ? undefined : 'none' }}>
                          <Collapse in={expanded[user._id]} timeout="auto" unmountOnExit>
                            <Box sx={{ px: 2, pb: 2 }}>
                              <UserDetailRow user={user} />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

// ─── Question form dialog ─────────────────────────────────────────────────────
const IMAGE_KEY_OPTIONS = ['morning', 'responsibilities', 'disconnected', 'sleep', 'stress', 'connection', 'default'];

const BLANK_QUESTION = {
  order: 0, question: '', imageKey: 'default', isActive: true,
  options: [
    { text: '', score: 0 }, { text: '', score: 1 },
    { text: '', score: 2 }, { text: '', score: 3 },
    { text: '', score: 4 }, { text: '', score: 5 },
  ],
};

function QuestionDialog({ open, onClose, initial, onSaved, error: extError }) {
  const isEdit = !!initial?._id;
  const [form, setForm]       = useState(initial || BLANK_QUESTION);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');

  useEffect(() => {
    setForm(initial || { ...BLANK_QUESTION, options: BLANK_QUESTION.options.map(o => ({ ...o })) });
    setErr('');
  }, [initial, open]);

  const setOption = (i, field, value) => {
    const opts = form.options.map((o, idx) => idx === i ? { ...o, [field]: field === 'score' ? Number(value) : value } : o);
    setForm(f => ({ ...f, options: opts }));
  };

  const addOption = () => {
    if (form.options.length >= 10) return;
    setForm(f => ({ ...f, options: [...f.options, { text: '', score: f.options.length }] }));
  };

  const removeOption = (i) => {
    if (form.options.length <= 2) return;
    setForm(f => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async () => {
    if (!form.question.trim()) { setErr('Question text is required'); return; }
    if (form.options.some(o => !o.text.trim())) { setErr('All options must have text'); return; }
    setSaving(true); setErr('');
    try {
      if (isEdit) {
        await API.put(`/questions/${initial._id}`, form);
      } else {
        await API.post('/questions', form);
      }
      onSaved();
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 5 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: '#2E5349' }}>
          {isEdit ? 'Edit Question' : 'Add New Question'}
        </Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        {(err || extError) && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{err || extError}</Alert>}

        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Order" type="number" size="small"
              value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
              sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              select label="Image Theme" size="small" value={form.imageKey}
              onChange={e => setForm(f => ({ ...f, imageKey: e.target.value }))}
              SelectProps={{ native: true }}
              sx={{ width: 180, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              {IMAGE_KEY_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </TextField>
            <TextField
              select label="Active" size="small" value={form.isActive ? 'true' : 'false'}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}
              SelectProps={{ native: true }}
              sx={{ width: 110, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </TextField>
          </Box>

          <TextField
            fullWidth multiline rows={2} label="Question Text"
            value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#2E5349', mb: -1 }}>
            Answer Options (score 0 = best, higher = more distress)
          </Typography>

          {form.options.map((opt, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <TextField
                size="small" label={`Option ${i + 1}`} value={opt.text}
                onChange={e => setOption(i, 'text', e.target.value)}
                sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                size="small" label="Score" type="number" value={opt.score}
                onChange={e => setOption(i, 'score', e.target.value)}
                inputProps={{ min: 0, max: 10 }}
                sx={{ width: 90, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <IconButton size="small" onClick={() => removeOption(i)}
                disabled={form.options.length <= 2}
                sx={{ color: '#C9847A' }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {form.options.length < 10 && (
            <Button startIcon={<AddCircleOutlineIcon />} onClick={addOption}
              sx={{ color: '#4A7C6F', fontWeight: 600, textTransform: 'none', alignSelf: 'flex-start' }}>
              Add Option
            </Button>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ color: '#6b8b83', textTransform: 'none' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}
          sx={{ bgcolor: '#4A7C6F', borderRadius: 2, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#2E5349' } }}>
          {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : (isEdit ? 'Save Changes' : 'Create Question')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Questions tab ─────────────────────────────────────────────────────────────
function QuestionsTab() {
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [deleting,   setDeleting]   = useState(null);

  const fetchQuestions = () => {
    setLoading(true);
    API.get('/questions/all')
      .then(r => setQuestions(r.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to load questions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    setDeleting(id);
    try {
      await API.delete(`/questions/${id}`);
      setSuccess('Question deleted');
      fetchQuestions();
    } catch (e) {
      setError(e.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const openAdd  = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (q) => { setEditing(q);    setDialogOpen(true); };

  return (
    <Box>
      {error   && <Alert severity="error"   sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openAdd}
          sx={{ bgcolor: '#4A7C6F', borderRadius: 2, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#2E5349' } }}>
          Add Question
        </Button>
      </Box>

      <Card sx={{ borderRadius: 5, boxShadow: '0 8px 30px rgba(0,0,0,0.07)', border: '1px solid rgba(74,124,111,0.08)' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box textAlign="center" py={8}><CircularProgress sx={{ color: '#4A7C6F' }} /></Box>
          ) : questions.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography sx={{ color: '#6b8b83' }}>No questions yet. Add your first one!</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f7fbf9' }}>
                    {['#', 'Question', 'Image', 'Options', 'Status', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#4a5e58', fontSize: '0.85rem' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map(q => (
                    <TableRow key={q._id} sx={{ '&:hover': { bgcolor: '#f7fbf9' } }}>
                      <TableCell sx={{ color: '#6b8b83', fontSize: '0.85rem' }}>{q.order}</TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#1a2e28' }}>{q.question}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={q.imageKey || 'default'} size="small"
                          sx={{ bgcolor: '#4A7C6F15', color: '#4A7C6F', fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell sx={{ color: '#6b8b83', fontSize: '0.85rem' }}>{q.options.length} options</TableCell>
                      <TableCell>
                        <Chip
                          label={q.isActive ? 'Active' : 'Inactive'} size="small"
                          sx={{
                            bgcolor: q.isActive ? '#4A7C6F18' : '#C9847A18',
                            color:   q.isActive ? '#4A7C6F'   : '#C9847A',
                            fontWeight: 700,
                          }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton size="small" onClick={() => openEdit(q)} sx={{ color: '#5B85A8' }}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(q._id)}
                            disabled={deleting === q._id} sx={{ color: '#C9847A' }}>
                            {deleting === q._id ? <CircularProgress size={16} /> : <DeleteOutlineIcon fontSize="small" />}
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <QuestionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editing}
        onSaved={() => { fetchQuestions(); setSuccess(editing ? 'Question updated!' : 'Question created!'); }}
      />
    </Box>
  );
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [mainTab, setMainTab] = useState('approvals');

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar sx={{ bgcolor: '#6B4E9E20', color: '#6B4E9E', width: 52, height: 52 }}>
            <PeopleOutlineIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 400, color: '#2E5349' }}>Admin Dashboard</Typography>
            <Typography sx={{ color: '#6b8b83', fontSize: '0.95rem' }}>Manage approvals and assessment questions</Typography>
          </Box>
        </Box>

        {/* Main tabs */}
        <Box sx={{ borderBottom: '1px solid rgba(74,124,111,0.15)', mb: 3 }}>
          <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)}
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }, '& .Mui-selected': { color: '#4A7C6F' }, '& .MuiTabs-indicator': { bgcolor: '#4A7C6F' } }}>
            <Tab icon={<PeopleOutlineIcon fontSize="small" />} iconPosition="start" label="Pending Approvals" value="approvals" />
            <Tab icon={<QuizOutlinedIcon fontSize="small" />} iconPosition="start" label="Assessment Questions" value="questions" />
          </Tabs>
        </Box>

        {mainTab === 'approvals' && <ApprovalTab />}
        {mainTab === 'questions' && <QuestionsTab />}
      </Container>
    </Box>
  );
}
