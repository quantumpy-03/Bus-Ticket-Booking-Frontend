/* eslint-disable no-unused-vars */
import api from '../api/api'

// Load the Razorpay script dynamically
const loadRazorpayScript = () => {
  const scriptId = 'razorpay-checkout-script'
  if (document.getElementById(scriptId)) {
    return Promise.resolve(true)
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Razorpay SDK failed to load.'))
    document.body.appendChild(script)
  })
}

// Get Razorpay Key ID from environment variables
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

const createOrder = async (bookingData) => {
  try {
    const response = await api.post('/payments/create-order/', bookingData)
    return response.data
  } catch (error) {
    console.error('Error creating Razorpay order:', error.response?.data)
    throw new Error('Failed to create payment order.')
  }
}

const verifyPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/verify/', paymentData)
    return response.data
  } catch (error) {
    console.error('Error verifying payment:', error.response?.data)
    throw new Error('Payment verification failed.')
  }
}

// Function to initiate Razorpay payment
export const initiatePayment = async ({
  orderId,
  amount,
  currency = 'INR',
  userEmail,
  userName,
  onSuccess,
  onError,
}) => {
  // Input validation
  if (!amount || amount <= 0) {
    onError('Invalid amount. Amount must be greater than 0')
    return
  }

  if (!userEmail || !userEmail.includes('@')) {
    onError('Invalid email address')
    return
  }

  if (!userName || userName.trim() === '') {
    onError('User name is required')
    return
  }

  if (!onSuccess || typeof onSuccess !== 'function') {
    onError('Success callback is required')
    return
  }

  if (!onError || typeof onError !== 'function') {
    console.error('Error callback is required')
    return
  }

  if (!RAZORPAY_KEY_ID) {
    onError('Payment gateway is not configured. Please contact support.')
    return
  }

  try {
    const script = await loadRazorpayScript()
    if (!script) {
      onError('Could not load payment gateway script.')
      return
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount, // Expect amount to be in paise
      currency,
      name: 'Bus Ticket Booking',
      description: 'Payment for your bus booking',
      order_id: orderId,
      handler: function (response) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        })
      },
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: '#3399cc',
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error)
      const reason = response.error.reason || 'unknown'
      const description = response.error.description || 'An unknown error occurred.'
      onError(`Payment failed: ${description} (reason: ${reason})`)
    })

    rzp.open()
  } catch (error) {
    console.error("Error in initiating payment:", error)
    onError("An unexpected error occurred while setting up the payment.")
  }
}
