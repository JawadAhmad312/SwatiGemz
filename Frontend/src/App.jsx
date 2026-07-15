import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import AdminRoutes from "./admin/AdminRoutes"


function App() {
  return (
   <>

   <Navbar/>
    <AdminRoutes />
   </>
  )
}

export default App
