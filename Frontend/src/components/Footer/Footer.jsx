import React from "react";
import {
  FaFacebookF, FaInstagram, FaTiktok, FaYoutube,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaComments
} from "react-icons/fa";
import { Link } from "react-router-dom";




export default function Footer() {
  return (
    <div className="relative mt-[5rem]">

      {/* 🔥 Animated Gradient Border */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient" />

      {/* MAIN FOOTER */}
      <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 justify=between">

        <div className="
          max-w-7xl mx-auto px-4  justify-between
          grid 
          lg:grid-cols-4 
          md:grid-cols-3 
          sm:grid-cols-2 
          grid-cols-1
          gap-8
        ">

          {/* Brand */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">GemzStone</h2>
            <p className="mt-3 text-xs md:text-sm leading-6">
              Premium, certified gemstones with unmatched shine and purity.
            </p>

            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white text-lg md:text-xl"><FaFacebookF /></a>
              <a href="#" className="hover:text-white text-lg md:text-xl"><FaInstagram /></a>
              <a href="#" className="hover:text-white text-lg md:text-xl"><FaTiktok /></a>
              <a href="#" className="hover:text-white text-lg md:text-xl"><FaYoutube /></a>
            </div>
          </div>

          {/* Categories */}

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/pages/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/AboutUs" className="hover:text-white">About Us</a></li>
              <li><a href="/ContactUs" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <FaMapMarkerAlt className="text-blue-400 text-lg" />
                Lahore, Pakistan
              </li>

              <li className="flex gap-3">
                <FaPhoneAlt className="text-blue-400 text-lg" />
                <a href="tel:+923001234567" className="hover:text-white">
                  +92 300 1234567
                </a>
              </li>

              <li className="flex gap-3">
                <FaEnvelope className="text-blue-400 text-lg" />
                <a href="mailto:info@gemzstone.com" className="hover:text-white">
                  info@gemzstone.com
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <h4 className="font-semibold text-white mb-1">Store Hours</h4>
              <p className="text-sm">Mon–Sat: 10AM – 9PM</p>
              <p className="text-sm">Sunday: Closed</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Stay Updated</h3>
            <p className="text-sm mb-3">
              Get exclusive gemstone offers & new arrivals.
            </p>

            <div className="flex w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  w-full px-3 py-2 
                  text-sm rounded-l-md 
                  focus:outline-none
                  border-t
    border-l
    border-b border-gray-700
                "
              />
              <button className="
                px-3 py-2 
                bg-blue-600 text-white text-sm 
                rounded-r-md 
                hover:bg-blue-700
              ">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="
          border-t border-gray-700 mt-10 pt-4 
          flex flex-col md:flex-row justify-between items-center 
          text-xs md:text-sm 
          px-4 max-w-7xl mx-auto
        ">
          <p>© {new Date().getFullYear()} GemzStone. All Rights Reserved.</p>

          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="/pages/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms & Conditions</a>
          </div>
        </div>
      </footer>

      {/* 💚 WhatsApp Button (Adjusted for Mobile) */}
      <a
        href="https://wa.me/+923417112368"
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed 
          bottom-20 right-4 
          sm:bottom-20 sm:right-6 
          bg-green-500 text-white 
          p-3 sm:p-4 
          rounded-full shadow-xl 
          hover:bg-green-600 
          transition z-50 
          text-xl sm:text-2xl
        "
      >
        <FaWhatsapp />
      </a>

      {/* 💬 Live Chat Button */}
      <button
        className="
          fixed 
          bottom-36 right-4 
          sm:bottom-36 sm:right-6 
          bg-blue-600 text-white 
          p-3 sm:p-4 
          rounded-full shadow-xl 
          hover:bg-blue-700 
          transition z-50 
          text-xl sm:text-2xl
        "
        onClick={() => alert('Live Chat Coming Soon!')}
      >
        <FaComments />
      </button>
    </div>
  );
}
