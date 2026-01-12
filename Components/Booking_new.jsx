import React, { useState, useEffect } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import { initiatePayment } from '../utils/payment'
import { useContext } from 'react'
import { DataContext } from '../Context/DataContext'

const Booking = () => {
  const [form, setForm] = useState({ bus: '', seats: 1, notes: '', start_location: '', drop_location: '', travel_date: '' })
  const [buses, setBuses] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookingPrice, setBookingPrice] = useState(0)
  const navigate = useNavigate()
  const { user } = useContext(DataContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await api.get('/buses/')
        if (!mounted) return
        setBuses(res.data)
      } catch (err) {
        console.error('Failed to load buses', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // When bus is selected, populate locations from route
  useEffect(() => {
    if (form.bus) {
      const bus = buses.find(b => b.id === Number(form.bus))
      if (bus && bus.route) {
        setSelectedBus(bus)
        setForm(prev => ({
          ...prev,
          start_location: bus.route.origin_city || prev.start_location,
          drop_location: bus.route.destination_city || prev.drop_location
        }))
      }
    }
  }, [form.bus, buses])

  // Calculate price (dummy: 500 per seat)
  useEffect(() => {
    setBookingPrice(Number(form.seats) * 500)
  }, [form.seats])

  const handlePayment = async () => {
    if (!form.bus || !form.start_location || !form.drop_location || !form.travel_date) {
      alert('Please fill in all required fields')
      return
    }

    // client-side travel date validation: must be a future date
    const selected = new Date(form.travel_date)
    const today = new Date()
    today.setHours(0,0,0,0)
    if (selected <= today) {
      alert('Please select a future travel date')
      return
    }

    setLoading(true)
    try {
      // Step 1: Create booking (initially)
      const bookingRes = await api.post('/book/', {
        bus: form.bus,
        seats_booked: Number(form.seats),
        start_location: form.start_location,
        drop_location: form.drop_location,
        travel_date: form.travel_date,
      })
      const bookingId = bookingRes.data.id

      // Step 2: Create Razorpay order
      const orderRes = await api.post('/payments/create-order/', {
        booking_id: bookingId,
        amount: bookingPrice,
        currency: 'INR',
      })
      const { razorpay_order_id } = orderRes.data
      // Step 3: Initiate Razorpay payment
      await initiatePayment({
        orderId: razorpay_order_id,
        amount: bookingPrice,
        userEmail: user?.email || 'user@example.com',
        userName: user?.username || user?.first_name || 'Passenger',
        onSuccess: async (paymentResponse) => {
          console.log('Payment successful:', paymentResponse)
          try {
            // Step 4: Verify payment on backend
            await api.post('/payments/verify/', {
              razorpay_payment_id: paymentResponse.paymentId,
              razorpay_order_id: paymentResponse.orderId,
              razorpay_signature: paymentResponse.signature,
            })
            alert('Booking confirmed! Payment received.')
            setForm({ bus: '', seats: 1, notes: '', start_location: '', drop_location: '', travel_date: '' })
            navigate('/mybooking')
          } catch (err) {
            console.error('Booking save failed', err)
            alert('Payment successful but booking failed. Please contact support.')
          }
        },
        onError: (error) => {
          console.error('Payment failed:', error)
          alert('Payment failed: ' + error)
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Book Your Bus Ticket</h2>

            <form onSubmit={(e) => { e.preventDefault(); handlePayment() }} className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="bus" className="text-sm font-semibold text-gray-700 mb-2">Select Bus *</label>
                <select
                  id="bus"
                  name="bus"
                  value={form.bus}
                  onChange={handleChange}
                  required
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition"
                >
                  <option value="">Choose a bus</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {`${b.name} (${b.owner}) — ${b.seats} seats available`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-populated locations from route */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="start_location" className="text-sm font-semibold text-gray-700 mb-2">From *</label>
                  <input 
                    id="start_location" 
                    name="start_location" 
                    value={form.start_location} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="Departure city" 
                    required 
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition" 
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="drop_location" className="text-sm font-semibold text-gray-700 mb-2">To *</label>
                  <input 
                    id="drop_location" 
                    name="drop_location" 
                    value={form.drop_location} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="Destination city" 
                    required 
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="seats" className="text-sm font-semibold text-gray-700 mb-2">Number of Seats *</label>
                  <input
                    id="seats"
                    name="seats"
                    type="number"
                    min="1"
                    value={form.seats}
                    onChange={handleChange}
                    required
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="travel_date" className="text-sm font-semibold text-gray-700 mb-2">Travel Date *</label>
                  <input
                    id="travel_date"
                    name="travel_date"
                    type="date"
                    value={form.travel_date}
                    onChange={handleChange}
                    required
                    min={(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()}
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="notes" className="text-sm font-semibold text-gray-700 mb-2">Special Requests (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special requirements?"
                  className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition" 
                  onClick={() => setForm({ bus: '', seats: 1, notes: '', start_location: '', drop_location: '', travel_date: '' })}
                >
                  Clear
                </button>
                <button 
                  disabled={loading} 
                  type="submit" 
                  className="px-8 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {loading ? '⏳ Processing...' : `Pay & Book (₹${bookingPrice})`}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Price Summary & Route Info */}
        <div className="space-y-4">
          {/* Price Card */}
          <div className="bg-linear-to-br from-red-600 to-red-500 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-red-50">Price per seat:</span>
                <span className="font-bold text-lg">₹500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-50">Number of seats:</span>
                <span className="font-bold text-lg">{form.seats}</span>
              </div>
              <div className="border-t border-red-400 pt-3 flex justify-between items-center">
                <span className="font-bold">Total Fare:</span>
                <span className="text-3xl font-bold">₹{bookingPrice}</span>
              </div>
            </div>
            <p className="text-red-100 text-xs mt-4">Taxes & charges included</p>
          </div>

          {/* Route Info */}
          {selectedBus && selectedBus.route && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-600">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Route Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-bold text-gray-800">{selectedBus.route.origin_city}</p>
                  {selectedBus.route.origin_latitude && (
                    <p className="text-xs text-gray-500">
                      📍 {selectedBus.route.origin_latitude.toFixed(2)}, {selectedBus.route.origin_longitude.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="border-t-2 border-dashed border-gray-300 py-2 text-center">
                  <p className="text-gray-600">↓</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-bold text-gray-800">{selectedBus.route.destination_city}</p>
                  {selectedBus.route.destination_latitude && (
                    <p className="text-xs text-gray-500">
                      📍 {selectedBus.route.destination_latitude.toFixed(2)}, {selectedBus.route.destination_longitude.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
            <h3 className="font-bold text-gray-800 mb-3">Why Book with Us?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Best prices guaranteed</li>
              <li>✓ Secure payment</li>
              <li>✓ Easy cancellation</li>
              <li>✓ 24/7 support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
