import React, { useState, useEffect } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import { initiatePayment } from '../utils/payment'
import { useContext } from 'react'
import DataContext from '../Context/DataContext'
import { FaHourglass, FaCheck, FaArrowRight, FaArrowDown, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa'
import Button from './Button'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Booking = () => {
  const [form, setForm] = useState({ bus: '', seats: 1, notes: '', start_location: '', drop_location: '', travel_date: '' })
  const [buses, setBuses] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookingPrice, setBookingPrice] = useState(0)
  const [step, setStep] = useState(1)
  const [uniqueCities, setUniqueCities] = useState({ origins: [], destinations: [] })
  const navigate = useNavigate()
  const { user, createBooking, fetchBookings } = useContext(DataContext)

  // Load all routes on component mount
  useEffect(() => {
    let mounted = true
    const loadRoutes = async () => {
      try {
        const res = await api.get('/routes/')
        if (!mounted) return
        // Extract unique origin and destination cities
        const origins = new Set()
        const destinations = new Set()
        res.data.forEach(route => {
          origins.add(route.origin_city)
          destinations.add(route.destination_city)
        })
        setUniqueCities({
          origins: Array.from(origins).sort(),
          destinations: Array.from(destinations).sort()
        })
      } catch (err) {
        console.error('Failed to load routes', err)
      }
    }
    loadRoutes()
    return () => { mounted = false }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setForm(prev => ({ ...prev, travel_date: date }))
  }

  // Step 1: Handle route selection and load buses
  const handleRouteSelection = async () => {
    if (!form.start_location || !form.drop_location) {
      alert('Please select both origin and destination')
      return
    }

    if (form.start_location === form.drop_location) {
      alert('Origin and destination cannot be the same')
      return
    }

    setLoading(true)
    try {
      const res = await api.get('/buses/', {
        params: {
          origin_city: form.start_location,
          destination_city: form.drop_location
        }
      })
      setBuses(res.data)
      
      if (res.data.length === 0) {
        alert('No buses available for this route')
        setLoading(false)
        return
      }
      
      setStep(2)
    } catch (err) {
      console.error('Failed to load buses', err)
      alert('Failed to load buses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // When bus is selected, show route info
  useEffect(() => {
    if (form.bus) {
      const bus = buses.find(b => b.id === Number(form.bus))
      if (bus && bus.route) {
        setSelectedBus(bus)
        setBookingPrice(bus.price)
      }
    }
  }, [form.bus, buses])

  // Calculate price (500 per seat)
  useEffect(() => {
    setBookingPrice(Number(form.seats) * Number(selectedBus?.price || 500))
  }, [form.seats, selectedBus])

  const handlePayment = async () => {
    if (!form.bus || !form.travel_date) {
      alert('Please fill in all required fields')
      return
    }

    const selected = new Date(form.travel_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selected <= today) {
      alert('Please select a future travel date')
      return
    }

    setLoading(true)
    try {
      const bookingRes = await createBooking({
        bus: form.bus,
        seats_booked: Number(form.seats),
        start_location: form.start_location,
        drop_location: form.drop_location,
        travel_date: form.travel_date.toISOString().split('T')[0],
      })
      const bookingId = bookingRes.id

      const orderRes = await api.post('/payments/create-order/', {
        booking_id: bookingId,
        amount: bookingPrice,
        currency: 'INR',
      })
      const { razorpay_order_id } = orderRes.data
      
      await initiatePayment({
        orderId: razorpay_order_id,
        amount: bookingPrice,
        userEmail: user?.email || 'user@example.com',
        userName: user?.username || user?.first_name || 'Passenger',
        onSuccess: async (paymentResponse) => {
          console.log('Payment successful:', paymentResponse)
          try {
            await api.post('/payments/verify/', {
              razorpay_payment_id: paymentResponse.paymentId,
              razorpay_order_id: paymentResponse.orderId,
              razorpay_signature: paymentResponse.signature,
            })
            if (user) {
                await fetchBookings();
            }
            alert('Booking confirmed! Payment received.')
            setForm({ bus: '', seats: 1, notes: '', start_location: '', drop_location: '', travel_date: '' })
            setStep(1)
            setBuses([])
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
    <div className="max-w-5xl mx-auto mt-6 p-2 sm:p-4 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Book Your Bus Ticket</h2>

            {/* Step 1: Route Selection */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); handleRouteSelection() }} className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold">1</div>
                    <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 rounded-full font-bold">2</div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">Select Your Route</p>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="start_location" className="text-sm font-semibold text-gray-700 mb-2">From (Origin) *</label>
                  <select
                    id="start_location"
                    name="start_location"
                    value={form.start_location}
                    onChange={handleChange}
                    required
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Select Origin City</option>
                    {uniqueCities.origins.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="drop_location" className="text-sm font-semibold text-gray-700 mb-2">To (Destination) *</label>
                  <select
                    id="drop_location"
                    name="drop_location"
                    value={form.drop_location}
                    onChange={handleChange}
                    required
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Select Destination City</option>
                    {uniqueCities.destinations.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    {loading ? <><FaHourglass className="animate-spin" /> Loading Buses...</> : <><span>Search Buses</span> <FaArrowRight /></>}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Bus & Details Selection */}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); handlePayment() }} className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full font-bold"><FaCheck /></div>
                    <div className="flex-1 h-1 bg-green-600 mx-2"></div>
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-bold">2</div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">Select Bus & Complete Details</p>
                </div>

                {/* Route Summary */}
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600 mb-4">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <span className="font-bold">{form.start_location}</span> <FaArrowRight /> <span className="font-bold">{form.drop_location}</span>
                    <button 
                      type="button"
                      onClick={() => { setStep(1); setBuses([]); setForm(prev => ({ ...prev, bus: '' })); }}
                      className="ml-4 text-blue-600 hover:text-blue-800 font-semibold text-xs"
                    >
                      Change Route
                    </button>
                  </p>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="bus" className="text-sm font-semibold text-gray-700 mb-2">Select Bus *</label>
                  <select
                    id="bus"
                    name="bus"
                    value={form.bus}
                    onChange={handleChange}
                    required
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Choose a bus</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {`${b.name} (${b.owner}) — ${b.seats} seats available`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="travel_date" className="text-sm font-semibold text-gray-700 mb-2">Travel Date *</label>
                    <DatePicker
                      id="travel_date"
                      selected={form.travel_date}
                      onChange={handleDateChange}
                      required
                      minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                      className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition w-full"
                      placeholderText="Select a date"
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
                    className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="px-6 py-2 rounded-lg flex items-center justify-center gap-2" 
                    onClick={() => { setStep(1); setBuses([]); setForm(prev => ({ ...prev, bus: '' })); }}
                  >
                    <FaArrowLeft /> Back
                  </Button>
                  <Button 
                    disabled={loading} 
                    type="submit" 
                    className="px-8 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    {loading ? <><FaHourglass className="animate-spin" /> Processing...</> : `Pay & Book (₹${bookingPrice})`}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Price Summary & Route Info */}
        <div className="space-y-4">
           {/* Route Info */}
          {selectedBus && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Route Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-bold text-gray-800">{selectedBus.route?.origin_city || 'N/A'}</p>
                  {selectedBus.route?.origin_latitude && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaMapMarkerAlt /> {selectedBus.route.origin_latitude.toFixed(2)}, {selectedBus.route.origin_longitude.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="border-t-2 border-dashed border-gray-300 py-2 text-center">
                  <p className="text-gray-600"><FaArrowDown /></p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-bold text-gray-800">{selectedBus.route?.destination_city || 'N/A'}</p>
                  {selectedBus.route?.destination_latitude && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FaMapMarkerAlt /> {selectedBus.route.destination_latitude.toFixed(2)}, {selectedBus.route.destination_longitude.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Price Card */}
          
          {selectedBus && (
            
          <div className="bg-linear-to-br from-blue-600 to-blue-500 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-50">Price per seat:</span>
                <span className="font-bold text-lg">{selectedBus.price || 500}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-50">Number of seats:</span>
                <span className="font-bold text-lg">{form.seats}</span>
              </div>
              <div className="border-t border-blue-400 pt-3 flex justify-between items-center">
                <span className="font-bold">Total Fare:</span>
                <span className="text-3xl font-bold">₹{bookingPrice}</span>
              </div>
            </div>
            <p className="text-blue-100 text-xs mt-4">Taxes & charges included</p>
          </div>
          )}
         
          {/* Features */}
          <div className="bg-blue-50 rounded-lg mb-4 sm:mb-0 p-6 border-l-4 border-blue-600">
            <h3 className="font-bold text-gray-800 mb-3">Why Book with Us?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><FaCheck className="text-green-600" /> Best prices guaranteed</li>
              <li className="flex items-center gap-2
              "><FaCheck className="text-green-600" /> Secure payment</li>
              <li className="flex items-center gap-2"><FaCheck className="text-green-600" /> Easy cancellation</li>
              <li className="flex items-center gap-2"><FaCheck className="text-green-600" /> 24/7 support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
