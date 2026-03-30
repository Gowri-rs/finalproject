import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Card, CardContent, Typography,
  TextField, Button, Alert, CircularProgress,
  Divider, Stack, Avatar,
} from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Navbar from './Navbar'
import API from '../../axiosinterceptor'

// ─── Stripe ──────────────────────────────────────────────────────────────────
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a2e28',
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      '::placeholder': { color: '#9bb8b0' },
    },
    invalid: { color: '#C9847A' },
  },
}

// ─── Inner form (needs Stripe context) ───────────────────────────────────────
function BookingForm({ type, id }) {
  const navigate    = useNavigate()
  const stripe      = useStripe()
  const elements    = useElements()
  const color       = type === 'therapist' ? '#C9847A' : '#5B85A8'

  const [therapist, setTherapist]   = useState(null)
  const [loadingT,  setLoadingT]    = useState(type === 'therapist')
  const [form,      setForm]        = useState({ userName: '', date: '', time: '' })
  const [error,     setError]       = useState('')
  const [success,   setSuccess]     = useState('')
  const [loading,   setLoading]     = useState(false)
  const [step,      setStep]        = useState(1)   // 1 = details, 2 = payment (therapist only)

  // Fetch therapist info to show fee
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

  // Step 1 — save details and proceed
  const handleDetailsNext = () => {
    if (!form.date) { setError('Please select a date'); return }
    setError('')
    if (type === 'therapist') {
      setStep(2)
    } else {
      handleFreeBooking()
    }
  }

  // Free booking (volunteers)
  const handleFreeBooking = async () => {
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

  // Paid booking (therapists via Stripe)
  const handlePayment = async () => {
    if (!stripe || !elements) return
    setError('')
    setLoading(true)

    const fee = therapist?.consultationFee ? Number(therapist.consultationFee) : 500

    try {
      // 1. Create PaymentIntent on backend
      const { data } = await API.post('/payments/create-intent', {
        therapistId: id,
        amount: fee,
      })

      // 2. Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: form.userName || 'MindBloom User' },
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.')
        setLoading(false)
        return
      }

      // 3. Save booking with payment info
      await API.post('/bookings', {
        personId: id, personType: type,
        userName: form.userName, date: form.date, time: form.time,
        paymentStatus: 'paid',
        amountPaid: fee,
        paymentIntentId: paymentIntent.id,
      })

      setSuccess(`Payment of ₹${fee} successful! Booking confirmed.`)
      setTimeout(() => navigate('/dashboard'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingT) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress sx={{ color }} />
      </Box>
    )
  }

  const fee = therapist?.consultationFee ? Number(therapist.consultationFee) : null

  return (
    <Card sx={{ borderRadius: 5, boxShadow: '0 16px 40px rgba(46,83,73,0.1)', overflow: 'hidden' }}>
      <Box sx={{ height: 6, bgcolor: color }} />
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>

        {/* Header */}
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

        {/* Step 1 — Details */}
        {step === 1 && (
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

            <Button
              fullWidth variant="contained" size="large"
              onClick={handleDetailsNext}
              disabled={loading || !!success}
              sx={{ borderRadius: 3, py: 1.6, bgcolor: color, fontWeight: 700, fontSize: '1rem', '&:hover': { filter: 'brightness(0.9)' } }}
            >
              {type === 'therapist' ? 'Continue to Payment →' : (loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Confirm Booking')}
            </Button>

            <Button onClick={() => navigate(-1)} sx={{ color: '#6b8b83', textTransform: 'none' }}>
              ← Go back
            </Button>
          </Box>
        )}

        {/* Step 2 — Stripe Payment (therapist only) */}
        {step === 2 && type === 'therapist' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Booking summary */}
            <Box sx={{ bgcolor: '#f7fbf9', borderRadius: 3, p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#2E5349', mb: 1.5 }}>Booking Summary</Typography>
              {[
                ['Session with', therapist?.name || type],
                ['Date', form.date],
                form.time && ['Time', form.time],
                ['Amount', `₹${fee || 500}`],
              ].filter(Boolean).map(([label, val]) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#6b8b83' }}>{label}</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#1a2e28' }}>{val}</Typography>
                </Box>
              ))}
            </Box>

            <Divider />

            {/* Card input */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#2E5349', mb: 1.5 }}>
                <LockOutlinedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                Secure Card Payment
              </Typography>
              <Box sx={{
                border: '1px solid rgba(0,0,0,0.23)', borderRadius: 3, p: 2,
                '&:focus-within': { borderColor: color, borderWidth: 2 },
                transition: 'border 0.2s',
              }}>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </Box>
              <Typography variant="caption" sx={{ color: '#9bb8b0', mt: 1, display: 'block' }}>
                🔒 Powered by Stripe · Test: use card 4242 4242 4242 4242
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              <Button
                fullWidth variant="contained" size="large"
                onClick={handlePayment}
                disabled={loading || !!success || !stripe}
                sx={{ borderRadius: 3, py: 1.6, bgcolor: color, fontWeight: 700, fontSize: '1rem', '&:hover': { filter: 'brightness(0.9)' } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : `Pay ₹${fee || 500} & Confirm`}
              </Button>
              <Button onClick={() => setStep(1)} disabled={loading} sx={{ color: '#6b8b83', textTransform: 'none' }}>
                ← Edit details
              </Button>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Outer wrapper — provides Stripe context ──────────────────────────────────
const BookingPage = () => {
  const { type, id } = useParams()
  const navigate = useNavigate()

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

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef5f3 0%, #f7fbfa 100%)' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 7 }}>
        <Elements stripe={stripePromise}>
          <BookingForm type={type} id={id} />
        </Elements>
      </Container>
    </Box>
  )
}

export default BookingPage
