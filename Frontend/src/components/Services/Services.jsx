import React from "react";
import {
  FaGem,
  FaRing,
  FaCertificate,
  FaCogs,
  FaShippingFast,
  FaHeadset,
  FaCheckCircle,
  FaChartLine ,FaShieldAlt  // ✅ ADD THIS
} from "react-icons/fa";

function Services() {
    const points = [
    {
      icon: <FaGem />,
      title: "Rare & Natural Stones",
      text: "We specialize in natural and rare gemstones selected for their scarcity, beauty, and market demand.",
    },
    {
      icon: <FaChartLine />,
      title: "Long-Term Value",
      text: "Investment-grade gemstones offer stability, value retention, and appreciation over time.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Certified & Secure",
      text: "Each gemstone is professionally certified, ensuring authenticity, transparency, and buyer confidence.",
    },
  ];
  const services = [
    {
      icon: <FaGem />,
      title: "Natural & Rare Gemstones",
      description:
        "We provide an exclusive selection of natural and rare gemstones, ethically sourced and carefully examined for clarity, color, and brilliance. Each stone is chosen to meet the highest standards of luxury and value.",
    },
    {
      icon: <FaRing />,
      title: "Bespoke Jewelry Design",
      description:
        "Our custom jewelry service transforms your vision into refined elegance. From concept to creation, every detail is handcrafted to reflect timeless beauty and personal expression.",
    },
    {
      icon: <FaCertificate />,
      title: "Certified Authenticity",
      description:
        "Every gemstone is professionally tested and certified, ensuring complete transparency, authenticity, and confidence in your purchase.",
    },
    {
      icon: <FaCogs />,
      title: "Precision Cutting & Polishing",
      description:
        "Advanced cutting techniques and expert polishing maximize brilliance, symmetry, and long-term durability, enhancing the natural beauty of each gemstone.",
    },
    {
      icon: <FaShippingFast />,
      title: "Secure Delivery",
      description:
        "We offer insured, discreet, and secure global shipping with premium packaging to protect your investment from dispatch to delivery.",
    },
    {
      icon: <FaHeadset />,
      title: "Personal Consultation",
      description:
        "Our gemstone specialists provide personalized guidance, helping you select the ideal stone based on purpose, design, and investment value.",
    },
  ];

  const highlights = [
    "Ethically sourced, natural gemstones",
    "Certified quality & authenticity",
    "Luxury craftsmanship standards",
    "Secure global delivery",
    "Personalized expert consultation",
  ];

  return (
    <>
    <section className=" bg-gray-50 pt-24 pb-8 ">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
            Our Services
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">
            At GemzStone, we deliver refined gemstone services rooted in
            craftsmanship, authenticity, and timeless luxury. Each service is
            designed to provide confidence, elegance, and lasting value.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 mb-24">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-gray-200
              hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl
                              bg-[#C9A24D]/10 text-[#C9A24D] text-2xl">
                {service.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {service.title}
              </h3>

              <p className="text-gray-600 text-lg leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 h-[2px] w-10 bg-gradient-to-r from-[#C9A24D] to-transparent group-hover:w-16 transition-all" />
            </div>
          ))}
        </div>

        {/* WHY CHOOSE US */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Why Choose GemzStone
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our commitment goes beyond selling gemstones. We focus on trust,
              transparency, and craftsmanship, ensuring every client receives
              unmatched quality and service excellence.
            </p>

            <ul className="space-y-4">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-[#C9A24D]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* INFO CARD */}
          <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">
              Our Commitment to Excellence
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Every gemstone we offer reflects our dedication to ethical
              sourcing, superior craftsmanship, and transparent certification.
              From consultation to delivery, we ensure a seamless luxury
              experience tailored to your expectations.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">
            Begin Your Luxury Journey
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Whether you are seeking a rare gemstone, a custom jewelry piece, or
            professional guidance, GemzStone is here to assist you every step of
            the way.
          </p>

          <button className="px-10 py-4 rounded-xl font-semibold text-xl
                             bg-[#C9A24D] text-white hover:bg-[#b8923f]
                             transition">
            {/* Book a Consultation */}
            Comming Soon 
          </button>
        </div>
      </div>
    </section>
     <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Investment Gemstones
          </h2>
          <p className="mt-5 max-w-3xl mx-auto text-gray-600 text-lg">
            Gemstones are more than adornments — they are tangible assets.
            Our investment gemstone services are designed for collectors,
            investors, and connoisseurs seeking long-term value.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {points.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-200
                         shadow-sm hover:shadow-lg hover:-translate-y-1
                         transition-all duration-300"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl
                              bg-[#C9A24D]/10 text-[#C9A24D] text-2xl">
                {item.icon}
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600 text-lg leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="px-10 py-4 rounded-xl font-semibold
                             bg-[#C9A24D] text-white text-lg hover:bg-[#b8923f]
                             transition">
            Speak With an Expert
          </button>
        </div>
      </div>
    </section>
              </>
  );
}

export default Services;
