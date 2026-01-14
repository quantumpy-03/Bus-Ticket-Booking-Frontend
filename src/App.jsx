import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

function App() {
  return (
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <main className="grow max-w-7xl mx-auto p-2 sm:p-4 md:p-6 w-full">
          <Outlet /> 
        </main>
        <Footer />
      </div>
  )
}

export default App
