import React, { useState, useRef } from "react";


function PrivacyPolicy() {

  const initialState = {
    name: "",
    email: "",
    dob: "",
    timeOfBirth: "",
    place: "",
    country: "",
    whatsapp: "",
    purpose: "",
    profession: "",
    lastGem: "",
    comment: "",
    captcha: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 VALIDATION
  const validate = () => {
    let err = {};

    if (!formData.name.trim()) err.name = "Name is required";
    if (!formData.email.includes("@")) err.email = "Valid email required";
    if (!formData.whatsapp) err.whatsapp = "Phone number required";
    if (!formData.purpose) err.purpose = "Purpose required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/privacy-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Form submitted successfully ✅");

        setFormData(initialState);
        setErrors({});

      } else {
        alert(data.message || "Something went wrong");
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* TITLE */}
      <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
      {/* CONTENT */}
      <p className="text-gray-600 mb-4 text-md leading-8">
        At <strong>Swati Gemz</strong>, we value your privacy and are fully
        committed to protecting your personal information. Maintaining trust,
        transparency, and respect with our customers is one of our highest
        priorities, and we believe that safeguarding your data is essential
        for building strong and long-term relationships with our community.
        Whether you are browsing our gemstone collections, requesting gemstone
        consultations, placing an order, or contacting us through our website,
        we ensure that your information is handled securely and responsibly.
        Any personal details you provide, including your name, email address,
        WhatsApp number, birth details, consultation information, or purchase
        history, are collected only for improving our services, providing
        personalized gemstone recommendations, processing orders, and enhancing
        your overall experience with Swati Gemz. We use modern security
        technologies, secure servers, SSL encryption, and trusted protection
        systems to help keep your information safe from unauthorized access,
        misuse, or disclosure.
      </p>
      <p className="text-gray-600 mb-4 text-md">
        By using this website, mobile application, or any services provided by Swati Gemz, you agree to this Privacy Policy. We may update this policy at any time, and continued use of our services means you accept those updates.
      </p>
      <h3 className="font-bold mt-6 text-lg">Why we collect information:</h3>
      <p className="text-gray-600 text-md">
        We collect information to better understand your needs, improve our services, and provide a personalized experience to our customers.
      </p>
      <h3 className="font-bold mt-6 text-lg">How we protect your information:</h3>
      <p className="text-gray-600 text-md">
        We use secure servers, SSL encryption technologies,
        authentication systems, and modern security practices to help
        protect your personal information. All sensitive information
        submitted through our website is securely processed and stored.
      </p>
      <h3 className="font-bold mt-6 text-lg">
        Use of your personal information:
      </h3>
      <ul className="list-disc pl-6 text-gray-600 text-md space-y-1">
        <li>Provide and deliver products and services</li>
        <li>Respond to your inquiries and consultation requests</li>
        <li>Send invoices, updates, confirmations, and notifications</li>
        <li>Provide customer support and assistance</li>
        <li>Improve website performance and customer experience</li>
        <li>Prevent fraud, abuse, and unauthorized activity</li>
        <li>Identify your product and service preferences</li>
      </ul>
      <h3 className="font-bold mt-6 text-lg">Policy Changes:</h3>
      <p className="text-gray-600 pb-8 text-md">
        Swati Gemz may update this Privacy Policy from time to time. Any changes will be reflected on this page.
      </p>
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 outline-none rounded-xl p-6 shadow-lg space-y-6"
      >

        <div className="grid grid-cols-2 gap-4">

          {/* NAME */}
          <div>
            <input
              name="name"
              value={formData.name}
              placeholder="Full Name *"
              onChange={handleChange}
              className="input  "
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <input
              name="email"
              value={formData.email}
              placeholder="Email *"
              onChange={handleChange}
              className="input"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* DOB */}
          <input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="input"
          />

          {/* TIME */}
          <input
            name="timeOfBirth"
            value={formData.timeOfBirth}
            placeholder="Time of Birth"
            onChange={handleChange}
            className="input"
          />

          {/* PLACE */}
          <input
            name="place"
            value={formData.place}
            placeholder="Place of Birth"
            onChange={handleChange}
            className="col-span-2 input"
          />

          {/* COUNTRY */}
          <input
            name="country"
            value={formData.country}
            placeholder="Country"
            onChange={handleChange}
            className="col-span-2 input"
          />

          {/* WHATSAPP */}
          <div className="col-span-2">
            <input
              name="whatsapp"
              value={formData.whatsapp}
              placeholder="WhatsApp Number *"
              onChange={handleChange}
              className="input"
            />
            {errors.whatsapp && <p className="error">{errors.whatsapp}</p>}
          </div>

          {/* PURPOSE */}
          <div className="col-span-2">
            <textarea
              name="purpose"
              value={formData.purpose}
              placeholder="Purpose to wear gemstone *"
              onChange={handleChange}
              className="input h-24"
            />
            {errors.purpose && <p className="error">{errors.purpose}</p>}
          </div>

          {/* PROFESSION */}
          <input
            name="profession"
            value={formData.profession}
            placeholder="Profession"
            onChange={handleChange}
            className="input"
          />

          {/* LAST GEM */}
          <input
            name="lastGem"
            value={formData.lastGem}
            placeholder="Last Gemstone"
            onChange={handleChange}
            className="input"
          />

          {/* COMMENT */}
          <textarea
            name="comment"
            value={formData.comment}
            placeholder="Any Comment"
            onChange={handleChange}
            className="col-span-2 input h-20"
          />

        </div>

       

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-[#224225] text-white py-3 rounded-lg hover:bg-[#092805] transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>

      {/* 🔥 INLINE CSS */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            outline: none;
            transition: 0.3s;
          }

          .input:focus {
          border:none;
            box-shadow: 0 0 0 2px rgba(34,66,37,0.2);
            outline:none;
          }

          .error {
            color: red;
            font-size: 12px;
            margin-top: 4px;
          }
        `}
      </style>

    </div>
  );
}

export default PrivacyPolicy;