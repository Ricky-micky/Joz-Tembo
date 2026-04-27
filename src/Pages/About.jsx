import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const About = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Partnership data
  const partners = [
    {
      id: 1,
      name: "Cimo Services",
      imageUrl: "/assets/Cimo.png",
      story:
        "Since 2010, Cimo Services has been our trusted transportation partner, providing reliable and comfortable vehicles for all our safari adventures across Kenya. Their fleet of well-maintained vehicles and professional drivers ensure safe and comfortable journeys through Kenya's diverse landscapes.",
      established: "2010",
      location: "Nairobi, Kenya",
      specialty: "Transportation & Logistics",
    },
    {
      id: 2,
      name: "Kenya Safari Lodges",
      imageUrl: "/assets/ken-safa.png",
      story:
        "Our partnership with Kenya Safari Lodges ensures our guests experience the finest accommodations in the most breathtaking locations throughout the country. From luxury tented camps to exclusive lodges, each property offers unique perspectives of Kenya's incredible wildlife.",
      established: "1985",
      location: "Multiple Locations",
      specialty: "Luxury Accommodations",
    },
    {
      id: 3,
      name: "Ashnil",
      imageUrl: "/assets/ash.png",
      story:
        "Ashnil's luxurious camps offer unparalleled wildlife viewing experiences, making every safari a memorable journey into the wild. Their properties in key national parks provide exceptional comfort while maintaining an authentic safari atmosphere.",
      established: "2005",
      location: "Maasai Mara & Tsavo",
      specialty: "Luxury Safari Camps",
    },
    {
      id: 4,
      name: "Salt Lick",
      imageUrl: "/assets/sallick.png",
      story:
        "The iconic Salt Lick Lodge provides a unique vantage point for wildlife viewing, and our collaboration brings exclusive packages to our clients. Built on stilts overlooking a waterhole, it offers 24/7 wildlife viewing from the comfort of your room.",
      established: "1990",
      location: "Taita Hills",
      specialty: "Unique Wildlife Viewing",
    },
    {
      id: 5,
      name: "KWS",
      imageUrl: "/assets/KWS.png",
      story:
        "Working hand in hand with Kenya Wildlife Service, we support conservation efforts while providing ethical and responsible safari experiences. This partnership ensures our operations align with national conservation goals and sustainable tourism practices.",
      established: "1989",
      location: "Nationwide, Kenya",
      specialty: "Conservation & Wildlife Protection",
    },
    {
      id: 6,
      name: "Sarova",
      imageUrl: "/assets/saro.png",
      story:
        "Sarova Hotels and Lodges bring comfort and elegance to the wilderness, and our partnership ensures premium stays for our safari guests. Their properties combine modern amenities with traditional African hospitality.",
      established: "1974",
      location: "Multiple Locations",
      specialty: "Premium Hospitality",
    },
    {
      id: 7,
      name: "Tulia",
      imageUrl: "/assets/tulia .png",
      story:
        "Tulia's boutique safari experiences complement our bespoke tour packages, creating unforgettable journeys for discerning travelers. Their intimate camps offer personalized service and exclusive access to prime wildlife areas.",
      established: "2012",
      location: "Maasai Mara",
      specialty: "Boutique Safari Experiences",
    },
    {
      id: 8,
      name: "Turtle Bay",
      imageUrl: "/assets/tbay.png",
      story:
        "Our collaboration with Turtle Bay Beach Resort offers guests the perfect coastal retreat after their safari adventure. Located on the pristine shores of Watamu, it combines beach relaxation with marine conservation experiences.",
      established: "1995",
      location: "Watamu, Coast",
      specialty: "Beach & Marine Experiences",
    },
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedPartner) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPartner]);

  // Modal component
  const PartnerModal = ({ partner, onClose }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-64 bg-amber-100">
            <img
              src={partner.imageUrl}
              alt={partner.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Partner+Image";
              }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              {partner.name}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-600 font-semibold">
                  Established
                </p>
                <p className="text-lg text-gray-800">{partner.established}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-600 font-semibold">Location</p>
                <p className="text-lg text-gray-800">{partner.location}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg col-span-2">
                <p className="text-sm text-amber-600 font-semibold">
                  Specialty
                </p>
                <p className="text-lg text-gray-800">{partner.specialty}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold text-amber-800 mb-3">
                Our Partnership Story
              </h3>
              <p className="text-gray-700 leading-relaxed">{partner.story}</p>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
              <p className="text-amber-800 text-center italic">
                "Trusted partners in creating unforgettable African adventures"
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <header className="relative h-screen max-h-[800px] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Safari landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center text-white max-w-5xl"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="text-amber-400 text-lg font-semibold tracking-wider">
                EST. 1993
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Jozz Tembo
              <br />
              <span className="text-amber-300">Tours & Safari</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Malindi, Lamu Road
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="bg-white/10 backdrop-blur-md inline-block px-8 py-4 rounded-full border border-white/20">
                <p className="text-2xl md:text-3xl italic font-light">
                  "Driven by passion, guided by experience"
                </p>
              </div>
              <div>
                <p className="text-lg text-amber-200">
                  In cooperation with Cimo Service
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Experience Banner - Redesigned */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-20"
        >
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-12 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
            </div>
            <div className="relative z-10 text-center text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                <span className="text-amber-100 font-semibold">
                  ✦ 30+ Years of Excellence ✦
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Crafting Unforgettable African Journeys
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Trusted safari experiences across Kenya since 1993, combining
                local expertise with world-class service
              </p>
            </div>
          </div>
        </motion.section>

        {/* Mission & Values - Modern Grid Layout */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <motion.div variants={fadeInUp} className="group">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full border border-amber-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                To provide unforgettable safari experiences, promote Kenyan
                culture, and offer world-class tour services across Africa with
                unwavering commitment to excellence and sustainability.
              </p>
              <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                <p className="text-amber-800 italic text-lg">
                  "Creating memories that last a lifetime while preserving
                  Africa's natural heritage"
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="group">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full border border-amber-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Core Values
              </h2>
              <div className="space-y-4">
                {[
                  {
                    name: "Professionalism",
                    desc: "Expert guides and seamless service delivery",
                  },
                  {
                    name: "Integrity",
                    desc: "Honest and transparent in all our dealings",
                  },
                  {
                    name: "Customer Satisfaction",
                    desc: "Your happiness is our ultimate goal",
                  },
                  {
                    name: "Sustainability",
                    desc: "Eco-friendly practices and community support",
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-3 rounded-xl hover:bg-amber-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {value.name}
                      </h3>
                      <p className="text-gray-600">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Background Story - Modern Card */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 p-8 md:p-12">
                <span className="text-amber-600 font-semibold tracking-wider text-sm">
                  OUR JOURNEY
                </span>
                <h2 className="text-4xl font-bold text-gray-800 mt-2 mb-6">
                  The Jozz Tembo Story
                </h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <p>
                    From humble beginnings in the coastal town of Malindi, Jozz
                    Tembo Tours and Safari has grown into one of Kenya's most
                    trusted safari operators. What started as a family passion
                    for wildlife and culture has blossomed into three decades of
                    creating extraordinary African adventures.
                  </p>
                  <p>
                    Our deep roots in Kenya's tourism landscape, combined with
                    international standards of service, allow us to offer
                    experiences that are both authentic and exceptional. Every
                    journey we craft is infused with local knowledge, genuine
                    hospitality, and an unwavering commitment to conservation.
                  </p>
                </div>
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                  <p className="text-gray-700 text-center text-xl font-medium">
                    <span className="text-amber-700">
                      "Driven by passion, guided by experience"
                    </span>
                    <br />
                    <span className="text-sm text-gray-500">
                      — The Jozz Tembo Promise
                    </span>
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 relative min-h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="African landscape"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========== PARTNERSHIP SECTION - CONTAINED MARQUEE ========== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-wider text-sm">
              OUR NETWORK
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
              Trusted Partners
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Proudly collaborating with Kenya's finest organizations to deliver
              exceptional safari experiences
            </p>
          </div>

          <style jsx>{`
            .marquee-container {
              position: relative;
              width: 100%;
              overflow-x: hidden;
            }

            .marquee-track {
              display: flex;
              gap: 1.5rem;
              width: fit-content;
              animation: marquee 40s linear infinite;
            }

            .marquee-track:hover {
              animation-play-state: paused;
            }

            .partner-card {
              flex-shrink: 0;
              width: 16rem;
              cursor: pointer;
              transition: transform 0.3s ease;
            }

            .partner-card:hover {
              transform: scale(1.05) translateY(-5px);
            }

            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            @media (max-width: 640px) {
              .partner-card {
                width: 12rem;
              }

              .marquee-track {
                animation: marquee 30s linear infinite;
              }
            }
          `}</style>

          <div className="marquee-container py-8">
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none"></div>

            <div className="marquee-track">
              {/* Triple the partners array for smooth looping */}
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="partner-card"
                  onClick={() => setSelectedPartner(partner)}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-100 h-full">
                    <div className="h-32 md:h-40 bg-amber-50 relative overflow-hidden">
                      <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable="false"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=" +
                            partner.name;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">
                        {partner.name}
                      </h3>
                      <div className="flex items-center text-amber-600">
                        <span className="text-xs md:text-sm">
                          Click to learn more
                        </span>
                        <svg
                          className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-gray-500 text-xs md:text-sm mt-4 md:mt-6 px-4">
            Hover to pause • Click any partner to learn more
          </p>
        </motion.section>

        {/* Features Grid - Modern Cards */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-20"
        >
          {[
            {
              title: "Driven by Passion",
              desc: "Our love for Africa fuels every journey we create",
              icon: "🔥",
            },
            {
              title: "Guided by Experience",
              desc: "30 years of expertise in African safari tours",
              icon: "🎯",
            },
            {
              title: "Custom Experiences",
              desc: "Tailored adventures for every traveler",
              icon: "✨",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp} className="group">
              <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 h-full">
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA Section - Modern Gradient */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-8 md:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Ready for Your African Adventure?
              </h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-95 max-w-2xl mx-auto px-4">
                Let our three decades of expertise guide you through the wild
                heart of Kenya
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 md:px-8 py-3 md:py-4 rounded-full">
                <p className="text-xl md:text-2xl italic font-light">
                  Driven by passion, guided by experience
                </p>
              </div>
              
            </div>
          </div>
        </motion.section>
      </main>

      {/* Partner Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <PartnerModal
            partner={selectedPartner}
            onClose={() => setSelectedPartner(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
