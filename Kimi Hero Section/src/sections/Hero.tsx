import { ArrowRight } from 'lucide-react';

const teamImages = [
  '/team-1.jpg',
  '/team-2.jpg',
  '/team-3.jpg',
  '/team-4.jpg',
  '/team-5.jpg',
  '/team-6.jpg',
  '/team-7.jpg',
  '/team-8.jpg',
];

// Duplicate images for seamless infinite scroll
const allImages = [...teamImages, ...teamImages];

export default function Hero() {
  return (
    <section className="min-h-screen bg-cream-100 overflow-hidden flex flex-col justify-center">
      {/* Main Content */}
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline */}
          <h1 className="mb-4">
            <span className="block font-serif italic text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-1">
              Streamline Your Team,
            </span>
            <span className="block font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900">
              Supercharge Your Workflow
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-8">
            All-in-one platform to plan, collaborate, and deliver — faster and smarter.
          </p>

          {/* CTA Button */}
          <button className="group inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors">
            Get started for Free
            <span className="btn-arrow inline-flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>

      {/* 3D Carousel Section - Larger */}
      <div className="relative py-12 overflow-hidden flex-1 flex items-center">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 lg:w-64 bg-gradient-to-r from-cream-100 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 lg:w-64 bg-gradient-to-l from-cream-100 to-transparent z-10 pointer-events-none" />

        {/* Carousel Container */}
        <div className="carousel-container relative w-full">
          <div className="carousel-track flex gap-6 sm:gap-8 lg:gap-10 animate-carousel-scroll">
            {allImages.map((src, index) => {
              // Calculate rotation based on position for 3D effect
              const position = index % teamImages.length;
              const centerIndex = teamImages.length / 2;
              const offset = position - centerIndex + 0.5;
              const rotation = offset * 8; // Rotation angle
              const translateZ = Math.abs(offset) * -30; // Depth effect
              const scale = 1 - Math.abs(offset) * 0.05; // Scale effect

              return (
                <div
                  key={index}
                  className="carousel-item flex-shrink-0"
                  style={{
                    transform: `perspective(1000px) rotateY(${rotation}deg) translateZ(${translateZ}px) scale(${scale})`,
                  }}
                >
                  <div className="relative w-48 h-64 sm:w-64 sm:h-80 lg:w-80 lg:h-[28rem] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={src}
                      alt={`Team member ${(position % teamImages.length) + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
