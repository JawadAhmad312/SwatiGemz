import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

/* ---------------- ANIMATION ---------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/* ---------------- SKELETON ---------------- */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ContactUs = () => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const formRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- FORM SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("");

    try {
      await emailjs.sendForm(
        "service_indrh5c",     // 🔴 replace
        "template_j2y4ydm",    // 🔴 replace
        formRef.current,
        "lkTYTAD2kscJLOWbA"      // 🔴 replace
      );

      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#fafafa] text-[#386855] bottom-0 overflow-hidden">

      {/* ================= HERO ================= */}
     <section className="relative min-h-[40vh] flex  items-center justify-center px-4 overflow-hidden">

  {/* Dark Overlay for Text Readability */}
  <div className="absolute inset-0 "></div>

  {/* Content */}
  <motion.div
    className="relative z-10 text-center max-w-3xl text-white"
    initial="hidden"
    whileInView="visible"
    variants={fadeUp}
    transition={{ duration: 0.6 }}
  >
    <h1 className="text-3xl text-[#c9a44c] sm:text-4xl md:text-7xl font-serif font-bold">
      Get in Touch
    </h1>

    <p className="mt-4 text-[#c9a44c] text-sm sm:text-2xl ">
      We’re here to assist you with gemstone inquiries, orders, and expert guidance.
    </p>
  </motion.div>

</section>

      {/* ================= CONTACT INFO + FORM ================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-14 items-start">

          {/* CONTACT INFO (UNCHANGED) */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp}>
            <h2 className="text-2xl sm:text-5xl font-bold text-[#386855]">
              Contact Information
            </h2>

            <p className="mt-4 text-gray-600 text-[22px]">
              SwatiGemzStone is always happy to help.
            </p>

            <div className="mt-8 text-[18px] space-y-4">
              <p>📍 Main Bazar Raiz Market Kathera,<br></br> Mingora Swat, Pakistan.</p>
              <p>📞 +92 347 5236461</p>
              <p>✉ mislamkhan503@gmail.com</p>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-5"
            >
              <input type="hidden" name="to_email" value="info@swatigemzstone.com" />

              <div>
                <label className="text-lg">Your Name</label>
                <input
                  name="user_name"
                  required
                  className="mt-1 w-full outline-none border border-gray-400 rounded-md px-4 py-3"
                />
              </div>

              <div>
                <label className="text-lg">Email Address</label>
                <input
                  type="email"
                  name="user_email"
                  required
                  className="mt-1 w-full outline-none border border-gray-400 rounded-md px-4 py-3"
                />
              </div>

              <div>
                <label className="text-lg">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="mt-1 w-full outline-none border border-gray-400 rounded-md px-4 py-3"
                />
              </div>

              <button
                disabled={sending}
                className="w-full py-3 bg-[#c9a44c] text-white rounded-md text-[18px] font-medium"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>

              {/* STATUS MESSAGE */}
              {status === "success" && (
                <p className="text-green-600 text-lg text-center">
                  Message sent successfully ✅
                </p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-lg text-center">
                  Failed to send message ❌
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
