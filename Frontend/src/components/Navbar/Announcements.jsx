import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const announcements = [

  "Free Delivery Across Pakistan on Orders Above Rs. 10,000",

  "Premium Natural Gemstones & Jewelry Collection Available",
];

const AnnouncementBar = () => {

  const [current, setCurrent] = useState(0);

  /* AUTO SLIDE */
useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) =>
      prev === announcements.length - 1
        ? 0
        : prev + 1
    );
  }, 3000);

  return () => clearInterval(interval);
}, []);

  /* NEXT */
  const nextSlide = () => {

    setCurrent((prev) =>
      prev === announcements.length - 1
        ? 1
        : prev + 1
    );

  };

  /* PREV */
  const prevSlide = () => {

    setCurrent((prev) =>
      prev === 0
        ? announcements.length - 1
        : prev - 1
    );

  };

  return (

    <div
      className="
        w-full
        bg-gradient-to-r
        from-[#0b2d0b]
        to-[#224225]
        text-white
        h-[38px]
        flex
        items-center
        justify-center
        relative
        overflow-hidden
        border-b
        border-[#355835]
      "
    >

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="
          absolute
          left-3
          opacity-80
          hover:opacity-100
          transition
        "
      >
        <ChevronLeft size={18} />
      </button>

      {/* TEXT */}
      <div className="w-full text-center px-10">

        <p
          className="
            text-[12px]
            md:text-[15px]
            font-medium
            tracking-wide
            transition-all
            duration-500
          "
        >
          {announcements[current]}
        </p>

      </div>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="
          absolute
          right-3
          opacity-80
          hover:opacity-100
          transition
        "
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
};

export default AnnouncementBar;