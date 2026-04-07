import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPaperPlane,
  FaWhatsapp,
  FaDirections,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email form submission
    console.log("Form submitted:", formData);

    // Construct email body
    const emailBody = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0ASubject: ${formData.subject}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;

    // Open default email client
    window.open(
      `mailto:tembo4401@gmail.com?subject=${formData.subject}&body=${emailBody}`,
      "_blank"
    );

    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const openWhatsAppDirect = () => {
    const phoneNumber = "254722266955";
    const defaultMessage =
      "Hello Jozz Tembo Tours! I'm interested in your safari packages and would like more information.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      defaultMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const openGoogleMaps = () => {
    const mapsUrl =
      "https://www.google.com/maps/place/Joss+%26+Tembo+Tours+%26+Safaris/@-3.2288873,40.0715636,13z/data=!4m14!1m7!3m6!1s0x18158fb3cbf5d3cb:0x149738b4de67d28f!2sJoss+%26+Tembo+Tours+%26+Safaris!8m2!3d-3.2114991!4d40.1174632!16s%2Fg%2F1q5bllrc8!3m5!1s0x18158fb3cbf5d3cb:0x149738b4de67d28f!8m2!3d-3.2114991!4d40.1174632!16s%2Fg%2F1q5bllrc8?entry=ttu&g_ep=EgoyMDI1MTEwOS4wIKXMDSoASAFQAw%3D%3D";
    window.open(mapsUrl, "_blank");
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-blue-50 pt-20">
      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Ready for your African adventure? Get in touch with JozTembo Tours
            and Safari
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Contact Information */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-amber-900 mb-6">
                Get In Touch
              </h2>
              <p className="text-gray-700 text-lg mb-8">
                Have questions about our safari packages? Ready to book your
                adventure? Our team is here to help you plan the perfect African
                experience.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-amber-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Our Location
                  </h3>
                  <p className="text-gray-600">Malindi, Lamu Road</p>
                  <p className="text-gray-600">Kenya</p>
                  <button
                    onClick={openGoogleMaps}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-2 flex items-center space-x-1"
                  >
                    <FaDirections className="text-xs" />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FaPhone className="text-amber-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Call Us
                  </h3>
                  <p className="text-gray-600">+254 722 266 955</p>
                  <p className="text-gray-600">+254 734 400 077</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaWhatsapp className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    WhatsApp
                  </h3>
                  <p className="text-gray-600">+254 722 266 955</p>
                  <p className="text-green-600 text-sm font-medium">
                    Quick responses
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FaEnvelope className="text-amber-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Email Us
                  </h3>
                  <p className="text-gray-600">tembo4401@gmail.com</p>
                  <p className="text-gray-600">info@jozztembotours.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FaClock className="text-amber-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Sunday: 6:00 AM - 10:00 PM
                  </p>
                  <p className="text-gray-600">
                    24/7 Emergency Support Available
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="p-6 bg-amber-800 text-white rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                Follow Our Adventures
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/joztembotours/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a
                  href="#"
                  className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href="#"
                  className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a
                  onClick={openWhatsAppDirect}
                  className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300 cursor-pointer"
                >
                  <FaWhatsapp className="text-xl" />
                </a>
              </div>
            </div>

            {/* Partnership Badge */}
            <div className="p-4 bg-gray-100 rounded-lg border-l-4 border-amber-600">
              <p className="text-gray-700">
                <strong className="text-amber-800">Partnership:</strong> In
                cooperation with{" "}
                <span className="font-semibold">Cimo Service</span>
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-amber-900 mb-2">
              Send us a Message
            </h2>
            <p className="text-gray-600 mb-8">
              We typically respond within 2 hours
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="safari-booking">Safari Booking</option>
                    <option value="beach-tour">Beach Tour</option>
                    <option value="custom-package">Custom Package</option>
                    <option value="airport-transfer">Airport Transfer</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tell us about your dream African adventure..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg bg-amber-600 text-white hover:bg-amber-700 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Send Message via Email</span>
                <FaEnvelope />
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 text-sm font-medium">
                      Email Message
                    </p>
                    <p className="text-blue-700 text-sm">
                      Your message will be sent to{" "}
                      <strong>tembo4401@gmail.com</strong> via your default
                      email client.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-500 text-sm">
                * Required fields. We respect your privacy and will never share
                your information.
              </p>
            </form>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-amber-900">
                  Find Us in Malindi
                </h2>
                <p className="text-gray-600 mt-2">
                  Visit our office along Lamu Road
                </p>
              </div>
              <button
                onClick={openGoogleMaps}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 flex items-center space-x-2 mt-4 md:mt-0"
              >
                <FaDirections />
                <span>Get Directions</span>
              </button>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.228885599999!2d40.1148882745991!3d-3.211499096661246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18158fb3cbf5d3cb%3A0x149738b4de67d28f!2sJoss%20%26%20Tembo%20Tours%20%26%20Safaris!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jozz Tembo Tours and Safari Location"
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-amber-50 rounded-lg">
                <FaMapMarkerAlt className="text-amber-600 text-xl mx-auto mb-2" />
                <p className="font-semibold text-amber-800">Location</p>
                <p className="text-gray-600 text-sm">Malindi, Lamu Road</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <FaClock className="text-amber-600 text-xl mx-auto mb-2" />
                <p className="font-semibold text-amber-800">Open Hours</p>
                <p className="text-gray-600 text-sm">6:00 AM - 10:00 PM</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <FaPhone className="text-amber-600 text-xl mx-auto mb-2" />
                <p className="font-semibold text-amber-800">Call Ahead</p>
                <p className="text-gray-600 text-sm">+254 722 266 955</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16 bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Contact us today and let's plan your unforgettable African safari
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254722266955"
              className="bg-white text-amber-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-all duration-300"
            >
              Call Now: +254 722 266 955
            </a>
            <button
              onClick={openWhatsAppDirect}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FaWhatsapp />
              <span>Chat on WhatsApp</span>
            </button>
            <button
              onClick={openGoogleMaps}
              className="bg-amber-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-800 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FaDirections />
              <span>Get Directions</span>
            </button>
          </div>
        </motion.section>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={openWhatsAppDirect}
          className="bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all duration-300 hover:scale-110"
        >
          <FaWhatsapp className="text-2xl" />
        </motion.button>
      </div>
    </div>
  );
};

export default Contact;
