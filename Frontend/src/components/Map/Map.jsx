import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 31.5204,
  lng: 74.3587, // Your location
};

function Map() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0b1120] py-20 px-4 md:px-10">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#1d4d3a]/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#3b82f6]/20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* ================= LEFT CONTENT ================= */}
        <div>

          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8">

            <span className="w-2 h-2 rounded-full bg-green-400"></span>

            <span className="text-sm tracking-[3px] text-gray-200 uppercase">
              Get In Touch
            </span>

          </div>

          {/* Heading */}
          <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">

            Visit
            <span className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">
              {" "}SWATI Gemz
            </span>

            <br />

            In Mingora Swat

          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-8 mb-12 max-w-xl">
            Explore premium gemstones, handcrafted jewelry,
            and authentic Swat stones with elegance, trust,
            and timeless beauty.
          </p>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Phone */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 hover:border-[#22c55e]/40 transition duration-300">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0f3b2e] to-[#1d6b4f] flex items-center justify-center mb-5">

                <i className="fa-solid fa-phone text-white text-lg"></i>

              </div>

              <h3 className="text-white text-2xl font-semibold mb-4">
                Phone
              </h3>

              <p className="text-gray-300 mb-2">
                <span className="font-semibold text-white">
                  Call:
                </span>{" "}
                +92 347 5236461
              </p>

              <p className="text-gray-300">
                <span className="font-semibold text-white">
                  WhatsApp:
                </span>{" "}
                +92 347 5236461
              </p>

            </div>

            {/* Email */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 hover:border-[#22c55e]/40 transition duration-300">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0f3b2e] to-[#1d6b4f] flex items-center justify-center mb-5">

                <i className="fa-solid fa-envelope text-white text-lg"></i>

              </div>

              <h3 className="text-white text-2xl font-semibold mb-4">
                Email
              </h3>

              <p className="text-gray-300 break-all">
                mislamkhan503@gmail.com
              </p>

            </div>

            {/* Address */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 hover:border-[#22c55e]/40 transition duration-300">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0f3b2e] to-[#1d6b4f] flex items-center justify-center mb-5">

                <i className="fa-solid fa-location-dot text-white text-lg"></i>

              </div>

              <h3 className="text-white text-2xl font-semibold mb-4">
                Address
              </h3>

              <p className="text-gray-300 leading-7">
                Main Bazar Raiz Market Kathera,
                Mingora Swat, Pakistan.
              </p>

            </div>

            {/* Hours */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 hover:border-[#22c55e]/40 transition duration-300">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0f3b2e] to-[#1d6b4f] flex items-center justify-center mb-5">

                <i className="fa-regular fa-clock text-white text-lg"></i>

              </div>

              <h3 className="text-white text-2xl font-semibold mb-4">
                Working Hours
              </h3>

              <p className="text-gray-300">
                Mon – Sat
              </p>

              <p className="text-white font-semibold mt-1">
                10:00 AM – 09:00 PM
              </p>

            </div>

          </div>
        </div>

        {/* ================= RIGHT MAP ================= */}
        <div className="relative">

          {/* Floating Badge */}
          <div className="absolute top-6 left-6 z-20 bg-white shadow-2xl rounded-2xl px-5 py-4 max-w-xs">

            <h4 className="text-xl font-bold text-gray-800 mb-2">
              SWATI GEMZ
            </h4>

            <p className="text-gray-600 text-sm leading-6">
              Main Bazar Raiz Market Kathera,
              Mingora Swat, Pakistan.
            </p>

            <div className="flex items-center gap-2 mt-3">

              <span className="text-yellow-500">
                ★★★★★
              </span>

              <span className="text-sm text-gray-600">
                Trusted Gemstone Shop
              </span>

            </div>
          </div>

          {/* Map Container */}
          <div className="w-full h-[480px] md:h-[650px] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3272.509624920865!2d72.3578036!3d34.7741937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dc22c679da9e13%3A0xe2161d5b6ec53bb!2sMain%20Bazar%20near%20Sarafa%20Bazar%2C%20Mingora%2C%20Swat%2C%20Pakistan!5e0!3m2!1sen!2s!4v1733720000000"
              allowFullScreen=""
              loading="lazy"
              className="w-full h-full"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Map;