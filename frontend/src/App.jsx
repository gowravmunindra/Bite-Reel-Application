import { useState } from 'react'
import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      color: 'var(--text)'
    }}>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App;
