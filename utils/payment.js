// Razorpay configuration from environment variables
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

if (!RAZORPAY_KEY_ID) {
  console.warn('VITE_RAZORPAY_KEY_ID is not configured in environment variables')
}

// Script loading cache
let scriptLoadPromise = null;
let isScriptLoaded = false;

// Function to load Razorpay script with caching and retry logic
export const loadRazorpayScript = (retries = 3) => {
  // Return cached promise if already loading or loaded
  if (scriptLoadPromise) {
    return scriptLoadPromise
  }

  if (isScriptLoaded && window.Razorpay) {
    return Promise.resolve(true)
  }

  scriptLoadPromise = new Promise((resolve) => {
    const attemptLoad = (attemptsLeft) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      
      script.onload = () => {
        isScriptLoaded = true
        scriptLoadPromise = null
        resolve(true)
      }
      
      script.onerror = () => {
        if (attemptsLeft > 0) {
          console.warn(`Failed to load Razorpay script. Retrying... (${retries - attemptsLeft + 1}/${retries})`)
          setTimeout(() => attemptLoad(attemptsLeft - 1), 1000)
        } else {
          console.error('Failed to load Razorpay script after retries')
          scriptLoadPromise = null
          resolve(false)
        }
      }
      
      document.body.appendChild(script)
    }

    attemptLoad(retries)
  })

  return scriptLoadPromise
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

  const scriptLoaded = await loadRazorpayScript()
  if (!scriptLoaded) {
    onError('Failed to load payment gateway. Please try again.')
    return
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
    currency,
    name: 'BookingApp',
    description: `Bus Booking${orderId ? ' - Order ' + orderId : ''}`,
    prefill: {
      email: userEmail,
      name: userName,
    },
    theme: {
      color: '#f59e0b', // Amber color to match your app
    },
    handler: function (response) {
      onSuccess({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      })
    },
    modal: {
      ondismiss: function () {
        onError('Payment cancelled by user')
      },
    },
  }

  // Only include order_id if it looks like a real Razorpay order id
  if (orderId && String(orderId).startsWith('order_')) {
    options.order_id = orderId
  }

  try {
    const rzp = new window.Razorpay(options)
    rzp.open()
  } catch (error) {
    onError('Failed to open payment gateway: ' + error.message)
  }
}
