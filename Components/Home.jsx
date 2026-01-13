import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import DataContext from '../Context/DataContext'
import { FaBolt, FaLock, FaCheck } from 'react-icons/fa'

const Home = () => {
  const { isAuthenticated } = useContext(DataContext)

  return (
    <div className='space-y-12'>
      {/* Hero Section - RedBus Style */}
      <section className='bg-linear-to-r from-red-600 to-red-500 rounded-lg shadow-xl p-12 text-white'>
        <h1 className='text-5xl font-bold mb-4'>Your Journey Starts Here</h1>
        <p className='text-xl mb-8 text-red-50'>Book bus tickets safely & easily at the best prices</p>
        {!isAuthenticated ? (
          <div className='flex gap-4'>
            <Link to="/signup" className='bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md'>Get Started</Link>
            <Link to="/login" className='border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition'>Login</Link>
          </div>
        ) : (
          <Link to="/booking" className='inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md'>Book Now</Link>
        )}
      </section>

      {/* Features Section */}
      <section>
        <h2 className='text-4xl font-bold mb-10 text-center text-gray-800'>Why Choose PickBus?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            { 
              icon: <FaBolt />, 
              title: 'Lightning Fast', 
              description: 'Book your tickets in seconds with our streamlined booking process' 
            },
            { 
              icon: <FaLock />, 
              title: 'Secure Payments', 
              description: 'Industry-leading encryption keeps your payment information safe' 
            },
            { 
              icon: <FaCheck />, 
              title: 'Best Prices', 
              description: 'Compare and get the best deals on bus tickets across operators' 
            },
          ].map((feature, i) => (
            <div key={i} className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-red-600'>
              <div className='text-4xl mb-3 text-red-600'>{feature.icon}</div>
              <h3 className='text-2xl font-bold mb-2 text-gray-800'>{feature.title}</h3>
              <p className='text-gray-600'>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className='bg-gray-50 rounded-lg p-8'>
        <h2 className='text-3xl font-bold mb-8 text-center text-gray-800'>How It Works</h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {[
            { step: '1', title: 'Search', desc: 'Find your route' },
            { step: '2', title: 'Select', desc: 'Choose a bus' },
            { step: '3', title: 'Pay', desc: 'Secure payment' },
            { step: '4', title: 'Travel', desc: 'Enjoy your trip' },
          ].map((item, i) => (
            <div key={i} className='text-center'>
              <div className='bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mx-auto mb-3'>
                {item.step}
              </div>
              <h3 className='font-bold text-gray-800 mb-1'>{item.title}</h3>
              <p className='text-gray-600 text-sm'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      {isAuthenticated && (
        <section className='bg-linear-to-r from-red-600 to-red-500 rounded-lg p-12 text-white text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready for Your Next Adventure?</h2>
          <p className='text-lg mb-8 text-red-50'>Thousands of buses waiting for you</p>
          <Link to="/booking" className='inline-block bg-white text-red-600 px-12 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-md text-lg'>
            Book Your Ticket Now
          </Link>
        </section>
      )}

      {/* Testimonials Section */}
      <section>
        <h2 className='text-3xl font-bold mb-8 text-center text-gray-800'>What Our Customers Say</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            { name: 'Ramesh Kumar', text: 'Amazing service! Booked tickets for my family in seconds.' },
            { name: 'Priya Singh', text: 'Best prices I found anywhere. Highly recommended!' },
            { name: 'Ankit Patel', text: 'Safe and secure. Will definitely book again.' },
          ].map((testimonial, i) => (
            <div key={i} className='bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600'>
              <p className='text-gray-600 mb-3 italic'>"{testimonial.text}"</p>
              <p className='font-bold text-gray-800'>— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
