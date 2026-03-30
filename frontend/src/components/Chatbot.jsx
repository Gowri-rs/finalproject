import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, Typography, TextField, IconButton, CircularProgress, Avatar, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Navbar from './Navbar';
import API from '../../axiosinterceptor';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await API.post('/chatbot/chat', { message: text });
      setMessages(m => [...m, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'bot', text: "I'm sorry, I'm having trouble responding right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />

      <Container maxWidth="md" sx={{ flex: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: '#4A7C6F', width: 48, height: 48 }}>
            <SpaOutlinedIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 400, color: '#2E5349' }}>MindBloom Assistant</Typography>
            <Typography variant="caption" sx={{ color: '#4A7C6F' }}>● Online — here to support you</Typography>
          </Box>
        </Box>

        {/* Chat window */}
        <Paper sx={{ flex: 1, borderRadius: 4, p: 3, display: 'flex', flexDirection: 'column', minHeight: 420, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', boxShadow: '0 8px 30px rgba(46,83,73,0.08)' }}>
          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Welcome */}
            {messages.length === 0 && (
              <Box sx={{ alignSelf: 'flex-start', maxWidth: '75%' }}>
                <Box sx={{ bgcolor: 'white', px: 3, py: 2, borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <Typography sx={{ color: '#2E5349', lineHeight: 1.6 }}>
                    Hello 🌿 I'm your MindBloom companion. How are you feeling today? I'm here to listen.
                  </Typography>
                </Box>
              </Box>
            )}

            {messages.map((msg, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 1 }}>
                {msg.role === 'bot' && (
                  <Avatar sx={{ bgcolor: '#4A7C6F', width: 28, height: 28 }}>
                    <SpaOutlinedIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                )}
                <Box sx={{
                  maxWidth: '72%', px: 3, py: 1.5,
                  bgcolor: msg.role === 'user' ? '#4A7C6F' : 'white',
                  color: msg.role === 'user' ? 'white' : '#1a2e28',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', lineHeight: 1.6,
                }}>
                  {msg.text}
                </Box>
                {msg.role === 'user' && (
                  <Avatar sx={{ bgcolor: '#e8f3ef', color: '#4A7C6F', width: 28, height: 28 }}>
                    <PersonOutlineIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#4A7C6F', width: 28, height: 28 }}>
                  <SpaOutlinedIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box sx={{ bgcolor: 'white', px: 2.5, py: 1.5, borderRadius: '4px 16px 16px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <CircularProgress size={16} sx={{ color: '#4A7C6F' }} />
                </Box>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2, pt: 2, borderTop: '1px solid rgba(74,124,111,0.1)' }}>
            <TextField fullWidth placeholder="Share your thoughts..." value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }} />
            <IconButton onClick={send} disabled={!input.trim() || loading}
              sx={{ bgcolor: '#4A7C6F', color: 'white', width: 48, height: 48, '&:hover': { bgcolor: '#2E5349' }, '&:disabled': { bgcolor: '#c8e0d8' } }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
