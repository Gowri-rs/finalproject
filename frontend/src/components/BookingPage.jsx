import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Card, CardContent, Typography,
  TextField, Button, Alert, CircularProgress,
  Divider, Stack,
} from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Navbar from './Navbar'
import API from '../../axiosinterceptor'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const BookingPage = () => {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const color = type === 'therapist' ? '#C9847A' : '#5B85A8'

  const [therapist, setTherapist] = useState(null)
  const [loadingT,  setLoadingT]  = useState(type === 'therapist')
  const [form,      setForm]      = useState({ userName: '', date: '', time: '' })
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    if (type === 'therapist' && id) {
      API.get(`/therapists`)
        .then(r => {
          const t = r.data.find(t => t._id === id)
          setTherapist(t || null)
        })
        .catch(() => {})
        .finally(() => setLoadingT(false))
    }
  }, [type, id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFreeBooking = async () => {
    if (!form.date) { setError('Please select a date'); return }
    setError('')
    setLoading(true)
    try {
      await API.post('/bookings', {
        personId: id, personType: type,
        userName: form.userName, date: form.date, time: form.time,
        paymentStatus: 'unpaid', amountPaid: 0,
      })
      setSuccess('Booking confirmed! You will be contacted shortly.')
      setTimeout(() => navigate('/dashboard'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpayPayment = async () => {
    if (!form.date) { setError('Please select a date'); return }
    setError('')
    setLoading(true)

    const fee = therapist?.consultationFee ? Number(therapist.consultationFee) : 500

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        setError('Failed to load payment gateway. Please check your internet connection.')
        setLoading(false)
        return
      }

      const { data } = await API.post('/payments/create-order', {
        therapistId: id,
        amount: fee,
      })

      const options = {
        key:      data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:   data.amount,
        currency: data.currency,
        name:     'MindBloom',
        description: `Session with ${data.therapistName}`,
        order_id: data.orderId,
        prefill: {
          name: form.userName || 'MindBloom User',
        },
        theme: { color },
        handler: async (response) => {
          try {
            await API.post('/payments/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            })

            await API.post('/bookings', {
              personId: id, personType: type,
              userName: form.userName, date: form.date, time: form.time,
              paymentStatus:   'paid',
              amountPaid:      fee,
              paymentIntentId: response.razorpay_payment_id,
            })

            setSuccess(`Payment of ₹${fee} successful! Booking confirmed.`)
            setLoading(false)
            setTimeout(() => navigate('/dashboard'), 2500)
          } catch (err) {
            setError('Payment verified but booking failed. Please contact support.')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled.')
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        setError(response.error?.description || 'Payment failed. Please try again.')
        setLoading(false)
      })
      rzp.open()

    } catch (err) {
      setError(err.response?.data?.message || 'Payment initiation failed. Please try again.')
      setLoading(false)
    }
  }

  if (!id || !type) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 7 }}>
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            Invalid booking link. Please go back and select a volunteer or therapist again.
          </Alert>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2, color: '#4A7C6F' }}>← Go back</Button>
        </Container>
      </Box>
    )
  }

  if (loadingT) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
        <Navbar />
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color }} />
        </Box>
      </Box>
    )
  }

  const fee = therapist?.consultationFee ? Number(therapist.consultationFee) : null

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 7 }}>
        <Card sx={{ borderRadius: 5, boxShadow: '0 16px 40px rgba(46,83,73,0.1)', overflow: 'hidden' }}>
          <Box sx={{ height: 6, bgcolor: color }} />
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <EventAvailableIcon sx={{ color, fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 400, color: '#2E5349' }}>
                  Book a Session
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b8b83', textTransform: 'capitalize' }}>
                  With {therapist ? therapist.name : `a ${type}`}
                  {fee && <span style={{ marginLeft: 8, color, fontWeight: 600 }}>· ₹{fee}</span>}
                </Typography>
              </Box>
            </Box>

            {error   && <Alert severity="error"   sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{success}</Alert>}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth label="Your Name" name="userName"
                value={form.userName} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <TextField
                fullWidth type="date" name="date" label="Preferred Date"
                InputLabelProps={{ shrink: true }}
                value={form.date} onChange={handleChange}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <TextField
                fullWidth type="time" name="time" label="Preferred Time"
                InputLabelProps={{ shrink: true }}
                value={form.time} onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              {type === 'therapist' && fee && (
                <>
                  <Divider />
                  <Box sx={{ bgcolor: '#f7fbf9', borderRadius: 3, p: 2.5 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#2E5349', mb: 1.5 }}>
                      Booking Summary
                    </Typography>
                    {[
                      ['Session with', therapist?.name || type],
                      form.date && ['Date', form.date],
                      form.time && ['Time', form.time],
                      ['Amount', `₹${fee}`],
                    ].filter(Boolean).map(([label, val]) => (
                      <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#6b8b83' }}>{label}</Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#1a2e28' }}>{val}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#9bb8b0', display: 'block', textAlign: 'center' }}>
                    <LockOutlinedIcon sx={{ fontSize: 13, mr: 0.5, verticalAlign: 'middle' }} />
                    Secured by Razorpay
                  </Typography>
                </>
              )}

              <Stack spacing={1.5}>
                <Button
                  fullWidth variant="contained" size="large"
                  onClick={type === 'therapist' ? handleRazorpayPayment : handleFreeBooking}
                  disabled={loading || !!success}
                  sx={{
                    borderRadius: 3, py: 1.6, bgcolor: color,
                    fontWeight: 700, fontSize: '1rem',
                    '&:hover': { filter: 'brightness(0.9)' },
                  }}
                >
                  {loading
                    ? <CircularProgress size={24} sx={{ color: 'white' }} />
                    : type === 'therapist'
                      ? `Pay ₹${fee || 500} via Razorpay`
                      : 'Confirm Booking'
                  }
                </Button>
                <Button onClick={() => navigate(-1)} sx={{ color: '#6b8b83', textTransform: 'none' }}>
                  ← Go back
                </Button>
              </Stack>
            </Box>

          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default BookingPage