import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import React from 'react'
import Navbar from './src/components/Navbar/Navbar'
import Footer from './src/components/Footer/Footer'


function Layout() {

  const location = useLocation();
    const { pathname } = useLocation();

useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  // ✅ Check if admin route
  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <>
      {/* Hide Navbar on admin pages */}
      {!isAdminPage && <Navbar />}
   
      <Outlet />
        {!isAdminPage && <Footer />}
     
    </>
  )
}

export default Layout