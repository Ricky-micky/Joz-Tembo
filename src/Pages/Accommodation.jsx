import React, { useState } from "react";
import Swal from "sweetalert2";

const CoastalAccommodation = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    message: "",
    roomType: "Standard",
  });

  // Accommodations data with local images
  const accommodations = {
    watamu: [
      {
        id: 1,
        name: "Turtle Bay",
        type: "Resort",
        rating: 4.5,
        image: "/assets/turlebay.png",
        fallback: "/assets/turlebay2.png",
      },
      {
        id: 2,
        name: "Hemmingways Watamu",
        type: "Luxury Hotel",
        rating: 4.8,
        image: "/assets/hotel-Hemingways-Watamu2.png",
        fallback: "/assets/hotel-Hemingways-Watamu.png",
      },
      {
        id: 3,
        name: "Kirepwe Ecco Camp Watamu",
        type: "Eco Camp",
        rating: 4.2,
        image: "/assets/accommodation/kirepwe.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 4,
        name: "Temple Point",
        type: "Resort",
        rating: 4.3,
        image: "/assets/accommodation/temple-point.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 5,
        name: "Crystal Bay Resort",
        type: "Resort",
        rating: 4.4,
        image: "/assets/accommodation/crystal-bay.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 6,
        name: "Lyle Palm",
        type: "Hotel",
        rating: 4.0,
        image: "/assets/accommodation/lyle-palm.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 7,
        name: "Barakuda",
        type: "Resort",
        rating: 4.1,
        image: "/assets/accommodation/barakuda.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 8,
        name: "Aquarius",
        type: "Hotel",
        rating: 3.9,
        image: "/assets/accommodation/aquarius.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    jacarandaWatamu: [
      {
        id: 9,
        name: "The One",
        type: "Boutique Hotel",
        rating: 4.6,
        image: "/assets/accommodation/the-one.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 10,
        name: "Jacaranda Resort",
        type: "Resort",
        rating: 4.3,
        image: "/assets/accommodation/jacaranda-resort.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 11,
        name: "Jumbo",
        type: "Hotel",
        rating: 3.8,
        image: "/assets/accommodation/jumbo.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 12,
        name: "Bravo",
        type: "Hotel",
        rating: 3.9,
        image: "/assets/accommodation/bravo.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    mombasa: [
      {
        id: 13,
        name: "Severin Sea Lodge",
        type: "Luxury Resort",
        rating: 4.7,
        image: "/assets/accommodation/severin.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 14,
        name: "Sarova Whitesands Beach Resort",
        type: "Premium Resort",
        rating: 4.8,
        image: "/assets/accommodation/sarova-whitesands.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 15,
        name: "Mombasa Beach",
        type: "Resort",
        rating: 4.2,
        image: "/assets/accommodation/mombasa-beach.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 16,
        name: "Nyali Beach",
        type: "Hotel",
        rating: 4.1,
        image: "/assets/accommodation/nyali-beach.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 17,
        name: "Bamburi Beach",
        type: "Resort",
        rating: 4.0,
        image: "/assets/accommodation/bamburi.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 18,
        name: "Neptune Beach",
        type: "Resort",
        rating: 4.3,
        image: "/assets/accommodation/neptune.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 19,
        name: "White Sand Beach",
        type: "Hotel",
        rating: 3.9,
        image: "/assets/accommodation/white-sand.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    nairobi: [
      {
        id: 20,
        name: "West Lavat",
        type: "Hotel",
        rating: 4.2,
        image: "/assets/accommodation/west-lavat.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 21,
        name: "Sarova Nairobi",
        type: "Business Hotel",
        rating: 4.5,
        image: "/assets/accommodation/sarova-nairobi.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 22,
        name: "Canivo",
        type: "Hotel",
        rating: 3.8,
        image: "/assets/accommodation/canivo.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    malindi: [
      {
        id: 23,
        name: "Scorpion Villa",
        type: "Villa",
        rating: 4.6,
        image: "/assets/accommodation/scorpion-villa.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 24,
        name: "Tropical",
        type: "Resort",
        rating: 4.2,
        image: "/assets/accommodation/tropical.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 25,
        name: "Diamond Africa",
        type: "Hotel",
        rating: 4.0,
        image: "/assets/accommodation/diamond-africa.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 26,
        name: "Kilili Baharini",
        type: "Resort",
        rating: 4.4,
        image: "/assets/accommodation/kilili.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    diani: [
      {
        id: 27,
        name: "Jacaranda Indian Ocean",
        type: "Resort",
        rating: 4.5,
        image: "/assets/accommodation/jacaranda-ocean.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 28,
        name: "Baobab Beach",
        type: "Premium Resort",
        rating: 4.9,
        image: "/assets/accommodation/baobab-beach.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 29,
        name: "Thousand Palms",
        type: "Resort",
        rating: 4.4,
        image: "/assets/accommodation/thousand-palms.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 30,
        name: "Kolekole Beach",
        type: "Hotel",
        rating: 4.1,
        image: "/assets/accommodation/kolekole.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
  };

  const allAccommodations = [
    ...accommodations.watamu.map((item) => ({ ...item, category: "watamu" })),
    ...accommodations.jacarandaWatamu.map((item) => ({
      ...item,
      category: "jacarandaWatamu",
    })),
    ...accommodations.mombasa.map((item) => ({ ...item, category: "mombasa" })),
    ...accommodations.nairobi.map((item) => ({ ...item, category: "nairobi" })),
    ...accommodations.malindi.map((item) => ({ ...item, category: "malindi" })),
    ...accommodations.diani.map((item) => ({ ...item, category: "diani" })),
  ];

  const getCategoryName = (category) => {
    const names = {
      watamu: "Watamu",
      jacarandaWatamu: "Jacaranda Watamu",
      mombasa: "Mombasa",
      nairobi: "Nairobi",
      malindi: "Malindi",
      diani: "Diani",
    };
    return names[category] || category;
  };

  const filteredAccommodations =
    selectedLocation === "all"
      ? allAccommodations
      : allAccommodations.filter((item) => item.category === selectedLocation);

  const handleFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const calculateNights = () => {
    if (!bookingForm.checkIn || !bookingForm.checkOut) return 0;
    const start = new Date(bookingForm.checkIn);
    const end = new Date(bookingForm.checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const openBookingModal = (accommodation) => {
    setSelectedHotel(accommodation);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedHotel(null);
    setBookingForm({
      fullName: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      message: "",
      roomType: "Standard",
    });
  };

  const handleImageError = (e, fallbackImage) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Processing Booking...",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div class="spinner" style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          "></div>
          <p>Please wait while we process your request</p>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const sendBookingEmail = async (bookingData) => {
    setIsLoading(true);
    showLoadingAlert();

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const emailBody = `
COASTAL ACCOMMODATION BOOKING DETAILS:

🏨 ACCOMMODATION: ${bookingData.accommodation.name}
📍 LOCATION: ${getCategoryName(bookingData.accommodation.category)}
⭐ RATING: ${bookingData.accommodation.rating}/5
🏠 TYPE: ${bookingData.accommodation.type}

📅 BOOKING DATES:
- Check-in: ${bookingData.checkIn}
- Check-out: ${bookingData.checkOut}
- Duration: ${calculateNights()} nights
- Guests: ${bookingData.guests}
- Room Type: ${bookingData.roomType}

👤 GUEST INFORMATION:
- Full Name: ${bookingData.fullName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}

💬 ADDITIONAL NOTES:
${bookingData.message || "No additional notes"}

📧 This booking was made through JozTembo Tours Coastal Accommodation Portal.
      `.trim();

      // Try backend API first
      const response = await fetch("http://localhost:5000/api/send-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "accommodation",
          accommodation: bookingData.accommodation,
          bookingDetails: bookingData,
          nights: calculateNights(),
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Your booking request has been sent successfully!",
          icon: "success",
          confirmButtonText: "Great!",
          confirmButtonColor: "#3b82f6",
          background: "#ffffff",
          color: "#1f2937",
        });
      } else {
        throw new Error("Backend failed");
      }
    } catch (error) {
      console.log("Using fallback email method...");

      // Fallback to direct email
      window.open(
        `mailto:tembo4401@gmail.com?subject=Coastal Accommodation Booking: ${
          bookingData.accommodation.name
        }&body=${encodeURIComponent(emailBody)}`
      );

      Swal.fire({
        title: "Email Client Opened",
        text: "Please send the pre-filled email to complete your booking",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
        background: "#ffffff",
        color: "#1f2937",
      });
    } finally {
      setIsLoading(false);
      closeBookingModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedHotel) {
      Swal.fire({
        title: "Error!",
        text: "Please select accommodation first",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        background: "#ffffff",
        color: "#1f2937",
      });
      return;
    }

    const bookingData = {
      ...bookingForm,
      accommodation: selectedHotel,
    };

    await sendBookingEmail(bookingData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeBookingModal();
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="/assets/coastal-hero.jpg"
          alt="Coastal Accommodation"
          className="w-full h-full object-cover"
          onError={(e) =>
            handleImageError(e, "/assets/coastal-hero-fallback.jpg")
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-cyan-900/50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold mb-4 font-serif">
              Coastal Accommodation Kenya
            </h1>
            <p className="text-xl max-w-2xl">
              Experience luxury beachfront living at Kenya's finest coastal
              resorts and hotels
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Location Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Select Your Coastal Destination
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedLocation("all")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedLocation === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
              }`}
            >
              All Locations
            </button>
            {Object.keys(accommodations).map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedLocation === location
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
                }`}
              >
                {getCategoryName(location)}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAccommodations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => handleImageError(e, item.fallback)}
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {item.type}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <div className="flex items-center text-white mt-1">
                    {renderStars(item.rating)}
                    <span className="ml-2">{item.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                    {getCategoryName(item.category)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {getCategoryName(item.category)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openBookingModal(item)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-blue-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Why Book With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              <h3 className="font-semibold text-gray-800 mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600 text-sm">
                All our partner properties are carefully vetted for quality
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Our team is available round the clock for assistance
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-sm">
                Simple and secure booking process with instant confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need assistance? Contact us at{" "}
            <a
              href="mailto:tembo4401@gmail.com"
              className="text-blue-600 font-semibold hover:underline"
            >
              tembo4401@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Book {selectedHotel.name}
                </h2>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Hotel Info */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={selectedHotel.image}
                      alt={selectedHotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        handleImageError(e, selectedHotel.fallback)
                      }
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedHotel.name}
                    </h3>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Location:</span>{" "}
                      {getCategoryName(selectedHotel.category)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Type:</span>{" "}
                      {selectedHotel.type}
                    </p>
                    <div className="flex items-center mt-1">
                      {renderStars(selectedHotel.rating)}
                      <span className="ml-2 text-sm text-gray-700">
                        {selectedHotel.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingForm.fullName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Check-in *
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={bookingForm.checkIn}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Check-out *
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={bookingForm.checkOut}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={bookingForm.guests}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={bookingForm.roomType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="Standard">Standard Room</option>
                    <option value="Deluxe">Deluxe Room</option>
                    <option value="Suite">Suite</option>
                    <option value="Beachfront">Beachfront Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="message"
                    value={bookingForm.message}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Any special requirements or requests..."
                  ></textarea>
                </div>

                {/* Nights Summary */}
                {bookingForm.checkIn && bookingForm.checkOut && (
                  <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Booking Summary
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">
                          {bookingForm.checkIn}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">
                          {bookingForm.checkOut}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span className="font-medium">{calculateNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span className="font-medium">
                          {bookingForm.guests}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room Type:</span>
                        <span className="font-medium">
                          {bookingForm.roomType}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Booking Request
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your booking details will be sent to tembo4401@gmail.com
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoastalAccommodation;
