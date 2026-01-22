import React from 'react';
import { Link } from 'react-router-dom';
import { FaBus, FaShieldAlt, FaTags, FaUsers } from 'react-icons/fa';

const Home = () => {
  return (
    <div className='space-y-16'>
      {/* Hero Section */}
      <section
        className='rounded-lg shadow-xl text-white flex items-center'
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url('/images/landing.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '500px'
        }}
      >
        <div className="p-12 md:w-2/3">
          <h1 className='text-5xl font-bold mb-4'>Book Your Bus Tickets Easily!</h1>
          <p className='text-xl mb-8'>Find the best routes and deals for your journey.</p>
          <Link to="/booking" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition">
            Book Now
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <section>
        <h2 className='text-4xl font-bold mb-8 text-center text-gray-800'>Popular Destinations</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            { name: 'New York', image: '/images/popular/newyork.jpg' },
            { name: 'Los Angeles', image: '/images/popular/losangeles.jpg' },
            { name: 'Chicago', image: '/images/popular/chicago.jpg' },
            { name: 'Las Vegas', image: '/images/popular/lasvegas.jpg' },
          ].map((dest, i) => (
            <div key={i} className='relative rounded-lg shadow-lg overflow-hidden h-64 group hover:cursor-pointer'>
              <img src={dest.image} alt={dest.name} className='w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 ' />
              <div className='absolute inset-0 bg-opacity-40 flex items-end'>
                 <h3 className='text-white text-2xl font-extrabold bg-blue-600 w-full px-4 py-2'>{dest.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className='p-4 lg:p-8 bg-blue-50 rounded-lg'>
        <h2 className='text-4xl font-bold mb-8 text-center text-gray-800'>How It Works</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 text-center'>
          {[
            { title: 'Search & Select', desc: 'Choose your route and bus from the options available.' },
            { title: 'Book Your Ticket', desc: 'Secure your seat with easy online booking.' },
            { title: 'Enjoy Your Trip', desc: 'Travel comfortably to your destination.' },
          ].map((item, i) => (
            <div key={i} className='bg-white p-6 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl active:scale-105 active:shadow-xl hover:cursor-default'>
              <h3 className='font-bold text-xl text-gray-800 mb-2'>{item.title}</h3>
              <p className='text-gray-600'>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best Deals & Offers */}
      <section>
        <h2 className='text-4xl font-bold mb-8 text-center text-gray-800'>Best Deals & Offers</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className="relative rounded-lg shadow-lg overflow-hidden text-white p-8 flex flex-col justify-end h-80" style={{ backgroundImage: `url('/images/best_deals/Weekend_Gateway.jpg')`, backgroundSize: 'cover' }}>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-shadow-black">Weekend Getaway</h3>
              <p className="text-xl mb-4 text-shadow-black">Up to <span className="font-bold text-orange-400">30% Off</span></p>
              <Link to="/booking" className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600">View Offers</Link>
            </div>
          </div>
          <div className="relative rounded-lg shadow-lg overflow-hidden text-white p-8 flex flex-col justify-end h-80" style={{ backgroundImage: `url('/images/best_deals/City_Break_Special.jpg')`, backgroundSize: 'cover' }}>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-shadow-black">City Break Specials</h3>
              <p className="text-xl mb-4 text-shadow-black">Save up to <span className="font-bold text-orange-400">25%</span></p>
              <Link to="/booking" className="bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600">View Deals</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Busline? */}
      <section className='p-2 sm:p-4 lg:p-8 mb-4 bg-blue-50 rounded-lg '>
        <h2 className='text-4xl font-bold mb-10 text-center text-gray-800'>Why Choose Busline?</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center'>
          {[
            { icon: <FaTags />, title: 'Affordable Prices', desc: 'Best fares guaranteed.' },
            { icon: <FaBus />, title: 'Comfortable Rides', desc: 'Modern & safe buses.' },
            { icon: <FaUsers />, title: '24/7 Customer Support', desc: 'We\'re here to help anytime.' },
            { icon: <FaShieldAlt />, title: 'Easy Booking', desc: 'Simple & fast reservations.' },
          ].map((feature, i) => (
            <div key={i} className='flex flex-col items-center'>
              <div className='text-5xl mb-4 text-blue-600'>{feature.icon}</div>
              <h3 className='text-xl font-bold mb-2 text-gray-800'>{feature.title}</h3>
              <p className='text-gray-600'>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home