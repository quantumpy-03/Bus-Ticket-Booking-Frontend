import React, { useEffect, useState } from 'react'
import api from '../api/api'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [busesMap, setBusesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelModal, setCancelModal] = useState({ show: false, bookingId: null })
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState(null)
  const [cancelSuccess, setCancelSuccess] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        // Fetch buses first
        const busesRes = await api.get('/buses/')
        if (!mounted) return

        // Fetch bookings
        const bookingsRes = await api.get('/book/')
        if (!mounted) return

        const map = {}
        const busesData = busesRes && busesRes.data ? busesRes.data : []
        busesData.forEach(b => { map[b.id] = b })

        setBusesMap(map)
        setBookings(bookingsRes && bookingsRes.data ? bookingsRes.data : [])
      } catch (err) {
        console.error('Failed to load bookings', err)
        if (!mounted) return
        setError(err.response?.data || err.message || 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const handleCancelClick = (bookingId) => {
    setCancelModal({ show: true, bookingId })
    setCancelError(null)
  }

  const handleConfirmCancel = async () => {
    const { bookingId } = cancelModal
    setCancelling(true)
    setCancelError(null)
    setCancelSuccess(null)

    try {
      const response = await api.post(`/bookings/${bookingId}/cancel/`)
      
      // Update the booking in state with new status
      setBookings(bookings.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'CANCELLED', refund_id: response.data.refund_id, refund_amount: response.data.refund_amount }
          : b
      ))
      
      setCancelSuccess(`Booking cancelled successfully! Refund of ₹${response.data.refund_amount} initiated.`)
      setCancelModal({ show: false, bookingId: null })
      
      setTimeout(() => setCancelSuccess(null), 5000)
    } catch (err) {
      setCancelError(err.response?.data?.error || 'Failed to cancel booking')
      console.error('Cancellation error:', err)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <div className="p-6">Loading your bookings...</div>
  if (error) return <div className="p-6 text-red-600">Error: {String(error)}</div>

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h2>
      
      {cancelSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {cancelSuccess}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center">
          <p className="text-gray-600">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map(bk => (
            <div key={bk.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Bus Operator</p>
                  <p className="text-lg font-semibold">{busesMap[bk.bus]?.owner ?? `Operator #${bk.bus}`}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Bus Name</p>
                  <p className="text-lg font-semibold">{busesMap[bk.bus]?.name ?? `Bus #${bk.bus}`}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Seats Booked</p>
                  <p className="text-lg font-semibold">{bk.seats_booked}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Amount</p>
                  <p className="text-lg font-semibold text-red-600">₹{bk.amount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">From</p>
                  <p className="font-medium">{bk.start_location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">To</p>
                  <p className="font-medium">{bk.drop_location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Travel Date</p>
                  <p className="font-medium">{bk.travel_date ? new Date(bk.travel_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Booked On</p>
                  <p className="font-medium text-sm">{new Date(bk.booking_date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <p className={`font-medium ${bk.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {bk.payment_status?.toUpperCase() || 'PENDING'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Booking Status</p>
                  <p className={`font-medium ${bk.status === 'BOOKED' ? 'text-blue-600' : bk.status === 'CANCELLED' ? 'text-red-600' : 'text-green-600'}`}>
                    {bk.status || 'BOOKED'}
                  </p>
                </div>
              </div>

              {bk.status === 'CANCELLED' && bk.refund_amount && (
                <div className="bg-yellow-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-700">
                    Refund Amount: <span className="font-semibold text-green-600">₹{bk.refund_amount}</span>
                    {bk.refund_id && <span className="text-xs text-gray-600 ml-2">(ID: {bk.refund_id})</span>}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {bk.status === 'BOOKED' && bk.payment_status === 'completed' && (
                  <button
                    onClick={() => handleCancelClick(bk.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Cancel Booking</h3>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? A refund will be processed based on the cancellation time.
            </p>

            <div className="bg-blue-50 p-4 rounded mb-6">
              <p className="text-sm text-gray-700">
                <strong>Refund Policy:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• 80% refund if cancelled &gt; 24 hours before departure</li>
                <li>• 50% refund if cancelled 12-24 hours before</li>
                <li>• 25% refund if cancelled &lt; 12 hours before</li>
              </ul>
            </div>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {cancelError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal({ show: false, bookingId: null })}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center"
              >
                {cancelling ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  'Confirm Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
