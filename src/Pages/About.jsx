import React from "react";
import { motion } from "framer-motion";

const About = () => {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Partnership data - EDIT YOUR IMAGES AND LINKS HERE
  const partners = [
    {
      id: 1,
      name: "Cimo Services",
      imageUrl: "/assets/cimo-service.png", // Update with your image path
      story:
        "Since 2010, Cimo Services has been our trusted transportation partner, providing reliable and comfortable vehicles for all our safari adventures across Kenya.",
      link: "https://cimoservices.co.ke", // Update with actual URL
    },
    {
      id: 2,
      name: "Kenya Safari Lodges",
      imageUrl: "/assets/kenya-safari-lodges.png", // Update with your image path
      story:
        "Our partnership with Kenya Safari Lodges ensures our guests experience the finest accommodations in the most breathtaking locations throughout the country.",
      link: "https://kenyasafarilodges.com", // Update with actual URL
    },
    {
      id: 3,
      name: "Ashnil",
      imageUrl: "/assets/ashnil.png", // Update with your image path
      story:
        "Ashnil's luxurious camps offer unparalleled wildlife viewing experiences, making every safari a memorable journey into the wild.",
      link: "https://ashnilhotels.com", // Update with actual URL
    },
    {
      id: 4,
      name: "Salt Lick",
      imageUrl: "/assets/salt-lick.png", // Update with your image path
      story:
        "The iconic Salt Lick Lodge provides a unique vantage point for wildlife viewing, and our collaboration brings exclusive packages to our clients.",
      link: "https://saltlick.co.ke", // Update with actual URL
    },
    {
      id: 5,
      name: "KWS",
      imageUrl: "/assets/kws.png", // Update with your image path
      story:
        "Working hand in hand with Kenya Wildlife Service, we support conservation efforts while providing ethical and responsible safari experiences.",
      link: "https://kws.go.ke", // Update with actual URL
    },
    {
      id: 6,
      name: "Sarova",
      imageUrl: "/assets/sarova.png", // Update with your image path
      story:
        "Sarova Hotels and Lodges bring comfort and elegance to the wilderness, and our partnership ensures premium stays for our safari guests.",
      link: "https://sarovahotels.com", // Update with actual URL
    },
    {
      id: 7,
      name: "Tulia",
      imageUrl: "/assets/tulia.png", // Update with your image path
      story:
        "Tulia's boutique safari experiences complement our bespoke tour packages, creating unforgettable journeys for discerning travelers.",
      link: "https://tulia.com", // Update with actual URL
    },
    {
      id: 8,
      name: "Turtle Bay",
      imageUrl: "/assets/turtle-bay.png", // Update with your image path
      story:
        "Our collaboration with Turtle Bay Beach Resort offers guests the perfect coastal retreat after their safari adventure.",
      link: "https://turtlebay.co.ke", // Update with actual URL
    },
  ];

  // Handle follow-up button click - opens link in new tab
  const handleFollowUp = (link) => {
    if (link && link.trim() !== "") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Header Section */}
      <header
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Jozz Tembo Tours and Safari
            </h1>
            <p className="text-xl md:text-2xl mb-4">Malindi, Lamu Road</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-6"
            >
              <p className="text-2xl md:text-3xl italic font-light bg-amber-600 bg-opacity-80 inline-block px-6 py-3 rounded-lg">
                Driven by passion, guided by experience
              </p>
            </motion.div>
            <div className="bg-amber-600 bg-opacity-80 inline-block px-6 py-2 rounded-lg">
              <p className="text-lg">In cooperation with Cimo Service</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Experience Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-amber-800 text-white rounded-2xl p-8 mb-16 text-center shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Over 30 Years of Excellence
            </h2>
            <p className="text-xl opacity-90 mb-4">
              Trusted safari experiences across Africa since 1993
            </p>
            <div className="border-t border-amber-400 pt-4">
              <p className="text-2xl italic font-light text-amber-200">
                "Driven by passion, guided by experience"
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 opacity-90"></div>
        </motion.section>

        {/* Mission & Values Section */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          {/* Mission Statement */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-lg relative"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded-t-2xl"></div>
            <h2 className="text-3xl font-bold text-amber-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              To provide unforgettable safari experiences, promote Kenyan
              culture, and offer world-class tour services across Africa. We are
              committed to creating memories that last a lifetime while
              preserving the natural beauty of our continent.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <p className="text-amber-800 italic font-medium">
                "Driven by passion, guided by experience" - Our Promise to You
              </p>
            </div>
          </motion.div>

          {/* Core Values */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-lg relative"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded-t-2xl"></div>
            <h2 className="text-3xl font-bold text-amber-900 mb-6">
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
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-amber-800 text-lg">
                      {value.name}
                    </h3>
                    <p className="text-gray-600">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Background Story */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="md:flex">
              <div className="md:w-2/3 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-amber-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Jozz Tembo Tours and Safari began its journey in the
                    beautiful coastal town of Malindi, nestled along the
                    historic Lamu Road. What started as a small family venture{" "}
                    <span className="text-amber-700 font-semibold">
                      driven by passion
                    </span>{" "}
                    for Kenya's incredible wildlife and rich cultural heritage
                    has grown into one of the nation's most trusted safari
                    operators.
                  </p>
                  <p>
                    Through three decades of dedication and unwavering
                    commitment to excellence, we have built lasting
                    relationships with travelers from around the world. Our deep
                    understanding of African landscapes, combined with local
                    expertise
                    <span className="text-amber-700 font-semibold">
                      {" "}
                      guided by experience
                    </span>
                    , allows us to craft unique experiences that go beyond
                    ordinary tourism.
                  </p>
                  <p>
                    Today, we stand proud as a testament to Kenyan hospitality,
                    offering meticulously planned safaris that showcase the very
                    best of Africa while maintaining the highest standards of
                    safety, comfort, and environmental responsibility.
                  </p>
                </div>
                <div className="mt-8 p-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg border-l-4 border-amber-600">
                  <p className="text-amber-900 text-center text-xl font-semibold italic">
                    "Driven by passion, guided by experience" - The Jozz Tembo
                    Way
                  </p>
                </div>
              </div>
              <div
                className="md:w-1/3 bg-cover bg-center min-h-64 md:min-h-full"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                }}
              ></div>
            </div>
          </motion.div>
        </motion.section>

        {/* ========== PARTNERSHIP SECTION ========== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-4xl font-bold text-amber-900 mb-3">
              Our Trusted Partners
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We proudly collaborate with these esteemed organizations to
              deliver exceptional safari experiences across Kenya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col"
              >
                {/* Image area */}
                <div className="h-40 bg-amber-100 relative overflow-hidden">
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Image+Coming+Soon";
                    }}
                  />
                </div>

                {/* Content area */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                    {partner.story}
                  </p>

                  {/* Follow-up button */}
                  <button
                    onClick={() => handleFollowUp(partner.link)}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🔗</span>
                    Follow Up
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              title: "Driven by Passion",
              desc: "Our love for Africa fuels every journey we create",
              icon: "❤️",
            },
            {
              title: "Guided by Experience",
              desc: "30 years of expertise in African safari tours",
              icon: "🧭",
            },
            {
              title: "Custom Experiences",
              desc: "Tailored adventures for every traveler",
              icon: "🌟",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-amber-500"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-12 text-white shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Adventure?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Let us create your perfect African safari experience
          </p>
          <div className="bg-white bg-opacity-20 inline-block px-8 py-4 rounded-lg backdrop-blur-sm">
            <p className="text-2xl italic font-light">
              Driven by passion, guided by experience
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default About;
