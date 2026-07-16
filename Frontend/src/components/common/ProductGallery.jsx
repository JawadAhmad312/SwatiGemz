import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const dedupeImages = (images) =>
  Array.from(
    new Set(
      (images || [])
        .filter(Boolean)
        .map((image) => String(image).trim())
        .filter(Boolean)
    )
  );

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.98,
  }),
};

const swipeConfidenceThreshold = 45;
const swipeVelocityThreshold = 500;

const ProductGallery = ({ images = [], alt = "Product image" }) => {
  const galleryImages = useMemo(() => dedupeImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const galleryKey = galleryImages.join("|");

  useEffect(() => {
    if (activeIndex >= galleryImages.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, galleryImages.length]);

  useEffect(() => {
    setActiveIndex(0);
    setDirection(0);
  }, [galleryKey]);

  if (galleryImages.length === 0) {
    return null;
  }

  const activeImage = galleryImages[activeIndex];

  const goToIndex = (nextIndex) => {
    if (nextIndex === activeIndex) {
      return;
    }

    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  const goNext = () => {
    if (galleryImages.length <= 1) {
      return;
    }

    const nextIndex = (activeIndex + 1) % galleryImages.length;
    setDirection(1);
    setActiveIndex(nextIndex);
  };

  const goPrevious = () => {
    if (galleryImages.length <= 1) {
      return;
    }

    const nextIndex =
      (activeIndex - 1 + galleryImages.length) % galleryImages.length;
    setDirection(-1);
    setActiveIndex(nextIndex);
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (
      offset < -swipeConfidenceThreshold ||
      velocity < -swipeVelocityThreshold
    ) {
      goNext();
      return;
    }

    if (
      offset > swipeConfidenceThreshold ||
      velocity > swipeVelocityThreshold
    ) {
      goPrevious();
    }
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <div className="relative flex aspect-square w-full items-center justify-center bg-gradient-to-br from-white to-gray-50 px-4 py-6 sm:px-6">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={alt}
              draggable={false}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 320, damping: 32 },
                opacity: { duration: 0.2 },
              }}
              drag={galleryImages.length > 1 ? "x" : false}
              dragElastic={0.12}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="max-h-full max-w-full select-none object-contain"
            />
          </AnimatePresence>
        </div>

        {galleryImages.length > 1 && (
          <div className="border-t border-gray-100 bg-white px-3 py-4 sm:px-4">
            <div className="flex gap-3 overflow-x-auto pb-1 sm:justify-center">
              {galleryImages.map((image, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => goToIndex(index)}
                    className={`group flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl border bg-white p-1 transition focus:outline-none focus:ring-2 focus:ring-[#224225] focus:ring-offset-2 sm:h-24 sm:w-24 ${
                      isActive
                        ? "border-[#224225] shadow-lg ring-2 ring-[#224225]/20"
                        : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${alt} thumbnail ${index + 1}`}
                      className={`h-full w-full object-contain transition duration-300 group-hover:scale-105 ${
                        isActive ? "scale-105" : "scale-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
