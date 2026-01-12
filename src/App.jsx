import { Outlet } from 'react-router-dom'
import { DataProvider } from '../Context/DataContext'
import './App.css'
import Navbar from '../Components/Navbar'

function App() {
  return (
    <DataProvider>
      <div className='min-h-screen'>
        <Navbar />
        <main className="max-w-6xl mx-auto p-6">
          <Outlet /> 
        </main>
      </div>
    </DataProvider>
  )
}

export default App
