import React from "react";
import { motion } from "framer-motion";
import {
  FaGem,
  FaAward,
  FaGlobeAsia,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";



const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  return (
    <div className="bg-[#F8F5EF] text-[#1F2937] overflow-hidden">

      {/* ================= HERO ================= */}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        <img
          src="/images/AboutUs_banner.png"
          alt="Luxury Gemstones"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-white/70"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-5xl px-6"
        >

          <p className="uppercase tracking-[8px] text-[#D4AF37] text-md font-semibold">
            Swati Gemz
          </p>

          <h1
            className="
              mt-8
              text-5xl
              md:text-7xl
              font-bold
              leading-tight
            "
            style={{
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Timeless Elegance
            <br />
            Authentic Gemstones
          </h1>

          <p className="mt-8 text-gray-600 max-w-2xl mx-auto text-lg">
            Discover rare gemstones and handcrafted jewellery
            curated with precision, authenticity, and luxury.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <button
              className="
                bg-[#D4AF37]
                text-white
                px-8
                py-4
                rounded-full
                font-semibold
                hover:scale-105
                transition
              "
            >
              Explore Collection
            </button>

            <button
              className="
                border
                border-[#D4AF37]
                text-[#D4AF37]
                px-8
                py-4
                rounded-full
                font-semibold
                hover:bg-[#D4AF37]
                hover:text-white
                transition
              "
            >
              Our Story
            </button>

          </div>

        </motion.div>

      </section>

      {/* ================= BRAND STORY ================= */}

      <section className="py-28 max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-20 items-center">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >

            <img
              src="/images/Discovery_Luxury.png"
              alt="Brand Story"
              className="
                rounded-[40px]
                shadow-2xl
                w-full
                object-cover
              "
            />

          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >

            <p className="uppercase tracking-[6px] text-[#D4AF37] text-md">
              Our Story
            </p>

            <h2
              className="text-5xl font-bold mt-6"
              style={{
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Luxury Crafted
              <br />
              With Trust
            </h2>

            <p className="mt-8 text-gray-600 leading-8">
              Swati Gemz is dedicated to providing authentic
              gemstones and premium jewellery for collectors,
              investors, and luxury enthusiasts around the world.
            </p>

            <p className="mt-5 text-gray-600 leading-8">
              Every gemstone is carefully selected, verified,
              and presented with transparency and excellence.
            </p>

          </motion.div>

        </div>

      </section>

      {/* ================= PREMIUM STATS ================= */}

      <section className="py-20 px-6">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">

          {[
            {
              value: "15+",
              label: "Years Experience",
            },
            {
              value: "7000+",
              label: "Happy Clients",
            },
            {
              value: "120+",
              label: "Exclusive Designs",
            },
            {
              value: "100%",
              label: "Certified Stones",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              className="
                bg-white
                rounded-3xl
                shadow-xl
                border
                border-[#D4AF37]/20
                p-10
                text-center
              "
            >

              <h3 className="text-5xl font-bold text-[#D4AF37]">
                {item.value}
              </h3>

              <p className="mt-4 text-gray-600">
                {item.label}
              </p>

            </motion.div>
          ))}

        </div>

      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="py-28 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            className="text-center"
          >

            <p className="uppercase tracking-[6px] text-[#D4AF37]">
              Why Choose Us
            </p>

            <h2
              className="text-5xl font-bold mt-5"
              style={{
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Excellence In Every Detail
            </h2>

          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mt-20">

            {[
              {
                icon: <FaGem />,
                title: "Authentic Stones",
              },
              {
                icon: <FaAward />,
                title: "Certified Quality",
              },
              {
                icon: <FaGlobeAsia />,
                title: "Worldwide Reach",
              },
              {
                icon: <FaShieldAlt />,
                title: "Trusted Service",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                className="
                  bg-[#F8F5EF]
                  rounded-3xl
                  p-10
                  text-center
                  shadow-lg
                "
              >

                <div className="text-5xl text-[#D4AF37] flex justify-center">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600">
                  Delivering luxury and authenticity
                  with every gemstone.
                </p>

              </motion.div>
            ))}

          </div>

        </div>

      </section>

            {/* ================= CERTIFICATIONS ================= */}

      <section className="py-28 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <p className="uppercase tracking-[6px] text-[#D4AF37]">
              Trust & Certifications
            </p>

            <h2
              className="text-5xl font-bold mt-5"
              style={{
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Trusted By Thousands
            </h2>

          </div>

          <div className="grid md:grid-cols-4 gap-8 mt-20">

            {[
              "Authentic Gemstones",
              "Lab Certified",
              "Secure Payments",
              "Easy Returns",
            ].map((item, index) => (

              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                className="
                  bg-white
                  p-10
                  rounded-3xl
                  text-center
                  shadow-lg
                  border
                  border-[#D4AF37]/20
                "
              >

                <div className="text-5xl text-[#D4AF37]">
                  ✓
                </div>

                <h3 className="mt-5 font-semibold text-lg">
                  {item}
                </h3>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= TESTIMONIALS ================= */}

     
      {/* ================= CTA ================= */}

      <section className="py-32 bg-[#111827] text-white px-6">

        <div className="max-w-5xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-[#D4AF37]">
            Discover Luxury
          </p>

          <h2
            className="text-5xl md:text-6xl font-bold mt-6"
            style={{
              fontFamily: '"Playfair Display", serif',
            }}
          >
            Experience Authentic
            <br />
            Gemstone Excellence
          </h2>

          <p className="mt-8 text-gray-300 max-w-2xl mx-auto">
            Explore our carefully curated collection of premium
            gemstones and luxury jewellery.
          </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">

  <Link to="/Stone">
    <button
      className="
        bg-[#D4AF37]
        text-white
        px-10
        py-4
        rounded-full
        font-semibold
        hover:scale-105
        transition
      "
    >
      Shop Collection
    </button>
  </Link>

  <Link to="/ContactUs">
    <button
      className="
        border
        border-[#D4AF37]
        text-[#D4AF37]
        px-10
        py-4
        rounded-full
        font-semibold
        hover:bg-[#D4AF37]
        hover:text-white
        transition
      "
    >
      Contact Us
    </button>
  </Link>

</div>

        </div>

      </section>

    </div>
  );
};

export default AboutUs;