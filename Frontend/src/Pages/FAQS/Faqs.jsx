import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqSections = [
  {
    title: "Ordering & Shipping",
    faqs: [
      {
        question: "Do you offer nationwide delivery?",
        answer:
          "Yes, we provide secure nationwide delivery across Pakistan using trusted courier services."
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery usually takes 3–5 business days depending on your location."
      }
    ]
  },
  {
    title: "Customization",
    faqs: [
      {
        question: "Can I customize my ring or jewelry?",
        answer:
          "Yes! We offer customization options including stone selection, size adjustments, and bespoke designs."
      },
      {
        question: "How do I request a custom order?",
        answer:
          "You can contact us directly via WhatsApp or our Contact Us page to discuss your custom requirements."
      }
    ]
  },
  {
    title: "Payments",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept bank transfer, cash on delivery, and online payment methods where applicable."
      },
      {
        question: "Is online payment secure?",
        answer:
          "Yes, all online transactions are processed through secure and encrypted payment gateways."
      }
    ]
  },
  {
    title: "Care & Authenticity",
    faqs: [
      {
        question: "Are your gemstones natural and certified?",
        answer:
          "All our gemstones are 100% natural and carefully sourced. Certification is available upon request."
      },
      {
        question: "How do I care for my gemstone jewelry?",
        answer:
          "Avoid harsh chemicals, clean with a soft cloth, and store your jewelry separately to maintain brilliance."
      }
    ]
  }
];

const FAQ = () => {
  const [active, setActive] = useState(null);

  const toggle = (key) => {
    setActive(active === key ? null : key);
  };

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-8 md:px-16">

      {/* PAGE HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-gray-600 text-sm sm:text-lg">
          Clear answers to help you shop gemstones with confidence
        </p>
      </div>

      {/* FAQ SECTIONS */}
      <div className="max-w-4xl mx-auto space-y-12">
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-xl sm:text-3xl font-semibold text-gray-800 mb-6">
              {section.title}
            </h2>

            <div className="space-y-4">
              {section.faqs.map((faq, faqIndex) => {
                const key = `${sectionIndex}-${faqIndex}`;
                return (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex justify-between items-center px-5 py-4 text-left"
                    >
                      <span className="text-gray-800 font-semibold text-sm sm:text-xl">
                        {faq.question}
                      </span>
                      <span className="text-3xl text-gray-500">
                        {active === key ? "−" : "+"}
                      </span>
                    </button>

                    {active === key && (
                      <div className="px-5 pb-4 text-gray-600 text-sm sm:text-lg leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* TRUST SECTION */}
      <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-800 text-xl">Certified Gemstones</h3>
          <p className="mt-2 text-sm sm:text-[16px] text-gray-600">
            Authentic, natural, and ethically sourced stones
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-800 text-xl">Secure Payments</h3>
          <p className="mt-2 text-sm text-gray-600 sm:text-[16px]">
            Safe and encrypted transactions
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-800 text-xl">Nationwide Delivery</h3>
          <p className="mt-2 text-sm text-gray-600 sm:text-[16px]">
            Reliable shipping across Pakistan
          </p>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <h2 className="text-2xl sm:text-4xl font-semibold text-gray-800">
          Still Have Questions?
        </h2>
        <p className="mt-3 text-gray-600 text-sm sm:text-lg">
          Our team is here to help you choose the perfect gemstone.
        </p>

        <Link
          to="/ContactUs"
          className="inline-block mt-6 text-xl px-8 py-3 rounded-full bg-emerald-600 text-white font-mediumbold hover:bg-emerald-700 transition"
        >
          Contact Us
        </Link>
      </div>

    </div>
  );
};

export default FAQ;
