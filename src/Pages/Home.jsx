import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  const [selectedPark, setSelectedPark] = useState(null);
  const [selectedLodge, setSelectedLodge] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [showParkModal, setShowParkModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedLodgeGallery, setSelectedLodgeGallery] = useState([]);
  const [selectedGalleryLodgeName, setSelectedGalleryLodgeName] = useState("");
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileParkFilter, setShowMobileParkFilter] = useState(false);
  const [selectedParkFilter, setSelectedParkFilter] = useState("all");
  const [showAllParks, setShowAllParks] = useState(false);
  const [expandedLodgeMobile, setExpandedLodgeMobile] = useState(null);
  const navigate = useNavigate();

  // Enhanced slideshow images
  const slides = [
    {
      id: 1,
      image: "/assets/kilima-slideshow.jpg",
      fallbackImage:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Discover Kenya's Wildlife Wonders",
      subtitle:
        "Experience the vast plains and incredible wildlife of Kenya's most famous parks",
      textColor: "text-white",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
    },
    {
      id: 2,
      image: "/assets/wildebeestslideshow.png",
      fallbackImage:
        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Witness the Great Migration",
      subtitle:
        "Marvel at the spectacular wildebeest river crossings in Maasai Mara",
      textColor: "text-white",
      buttonColor: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      id: 3,
      image: "/assets/lionessslide show.jpg",
      fallbackImage:
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Meet Africa's Big Cats",
      subtitle:
        "Encounter majestic leopards, lions, and cheetahs in their natural habitat",
      textColor: "text-white",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: 4,
      image: "/assets/leopard-slideshow.jpg",
      fallbackImage:
        "https://images.unsplash.com/photo-1571835782488-7f6e3b4440e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Unforgettable Safari Moments",
      subtitle:
        "Create memories that last a lifetime on your African adventure",
      textColor: "text-white",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
    },
    {
      id: 5,
      image: "/assets/maasai-slide.png",
      fallbackImage:
        "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Maasai Culture and Traditions",
      subtitle: "Keeping culture and traditions alive",
      textColor: "text-white",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
  ];

  useEffect(() => {
    const preloadImages = async () => {
      setIsLoading(true);
      const imagePromises = slides.map((slide) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = slide.image;
          img.onload = () => {
            resolve({ id: slide.id, loaded: true, src: slide.image });
          };
          img.onerror = () => {
            const fallbackImg = new Image();
            fallbackImg.src = slide.fallbackImage;
            fallbackImg.onload = () =>
              resolve({ id: slide.id, loaded: true, src: slide.fallbackImage });
            fallbackImg.onerror = () =>
              resolve({ id: slide.id, loaded: false, src: "" });
          };
        });
      });

      const [slideResults] = await Promise.all([Promise.all(imagePromises)]);

      const loadedSlides = slideResults.filter((r) => r.loaded);
      setLoadedImages(loadedSlides.map((r) => ({ id: r.id, src: r.src })));
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const scrollToParks = () => {
    const parksSection = document.getElementById("parks-section");
    if (parksSection) {
      parksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const parks = [
    {
      id: 1,
      name: "Maasai Mara",
      slug: "maasai-mara",
      path: "/masaimara",
      image: "/assets/Maasaimara.jpg",
      fallbackImage: "/assets/parks/default-park.jpg",
      description: "Witness the Great Wildebeest Migration",
      details:
        "The Maasai Mara National Reserve is one of Africa's most famous wildlife conservation areas.",
      bestTime: "July to October",
      highlights: [
        "Great Migration",
        "Big Five",
        "Maasai Culture",
        "Balloon Safaris",
      ],
      wildlife: "Lions, Cheetahs, Leopards, Elephants, Rhinos, Buffaloes",
      specialFeature: "Annual Great Migration of over 1.5 million wildebeest",
      lodges: [
        {
          name: "Sweet Acacia Camp",
          image: "/assets/Sweet-Acacia-Camp-maara.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Luxurious tented camp offering intimate wildlife experiences with stunning Mara River views.",
          gallery: [
            "/assets/sweet-acaciamaara1.png",
            "/assets/sweet-acaciamaara2.png",
            "/assets/sweet-acaciamaara3.png",
          ],
        },
        {
          name: "AA Lodge Mara",
          image: "/assets/AA-maara.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Family-friendly lodge with spacious accommodations and prime location for migration viewing.",
          gallery: [
            "/assets/AA-maara2.png",
            "/assets/AA-maara3.png",
            "/assets/AA-maara4.png",
          ],
        },
        {
          name: "Mara Serena Safari Lodge",
          image: "/assets/maaraserena.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Award-winning lodge built on a hill with panoramic views.",
          gallery: [
            "/assets/maaraserena2.png",
            "/assets/maaraserena3.png",
            "/assets/maara-serena4.png",
          ],
        },
        {
          name: "La Maison Mara",
          image: "/assets/lamaison-mara.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Boutique luxury camp offering French-inspired elegance.",
          gallery: [
            "/assets/lamaison-mara1.jpg",
            "/assets/lamaison-mara2.jpg",
            "/assets/lamaison-mara3.jpg",
          ],
        },
        {
          name: "Mara Sopa Lodge",
          image: "/assets/marasopa.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Traditional African-style lodge offering comfortable accommodations.",
          gallery: [
            "/assets/marasopa1.jpg",
            "/assets/marasopa2.jpg",
            "/assets/marasopa3.jpg",
          ],
        },
        {
          name: "Sarova Mara Game Camp",
          image: "/assets/sarovamara.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description: "Premium tented camp with luxurious amenities.",
          gallery: [
            "/assets/sarovamara1.jpg",
            "/assets/sarovamara2.jpg",
            "/assets/sarovamara3.jpg",
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Lake Nakuru National Park",
      slug: "lake-nakuru",
      path: "/lakenakuru",
      image: "/assets/nakuru-home.jpg",
      fallbackImage: "/assets/parks/default-park.jpg",
      description: "Famous for flamingos and rhino sanctuary",
      details:
        "Lake Nakuru National Park is known for its incredible birdlife.",
      bestTime: "June to March",
      wildlife: "Flamingos, Rhinos, Lions, Leopards",
      specialFeature:
        "Sometimes over a million flamingos coloring the lake pink",
      highlights: [
        "Flamingos",
        "Rhino Sanctuary",
        "Bird Watching",
        "Baboon Cliff",
      ],
      lodges: [
        {
          name: "Lake Elementaita Lodge",
          image: "/assets/elementaita.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Scenic lodge overlooking Lake Elementaita with stunning views.",
          gallery: [
            "/assets/elementaita1.jpg",
            "/assets/elementaita2.jpg",
            "/assets/elementaita3.jpg",
          ],
        },
        {
          name: "Lake Nakuru Lodge",
          image: "/assets/lake-nakurulodge.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Modern lodge with stunning lake views and swimming pool.",
          gallery: [
            "/assets/nakurulodge2.png",
            "/assets/nakurulodge3.png",
            "/assets/nakurulodge4.png",
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Tsavo East",
      slug: "tsavo-east",
      path: "/tsavoeast",
      image: "/assets/Tsavoeast-home.jpg",
      fallbackImage: "/assets/parks/default-park.jpg",
      description: "Vast wilderness with red elephants",
      details:
        "Tsavo East National Park is one of the oldest and largest parks in Kenya.",
      bestTime: "April to October",
      wildlife: "Red Elephants, Lions, Buffaloes, Giraffes",
      specialFeature: "Famous 'red elephants' dusted in red volcanic soil",
      highlights: [
        "Red Elephants",
        "Mudanda Rock",
        "Lugard Falls",
        "Wilderness",
      ],
      lodges: [
        {
          name: "Voi Safari Lodge",
          image: "/assets/voisafari.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description: "Strategically located lodge overlooking a waterhole.",
          gallery: [
            "/assets/voisafari2.png",
            "/assets/voisafari3.png",
            "/assets/voisafari4.png",
          ],
        },
        {
          name: "Voi Wildlife Lodge",
          image: "/assets/voiwildlife4.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description: "Eco-friendly lodge with stunning views of the park.",
          gallery: [
            "/assets/voiwildlife.png",
            "/assets/voiwildlife1.png",
            "/assets/voiwildlife2.png",
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Tsavo West",
      slug: "tsavo-west",
      path: "/tsavowest",
      image: "/assets/Tsavoweast-home.jpg",
      fallbackImage: "/assets/parks/default-park.jpg",
      description: "Diverse landscapes and Mzima Springs",
      details: "Tsavo West National Park features more diverse scenery.",
      bestTime: "April to October",
      wildlife: "Hippos, Crocodiles, Rhinos, Elephants",
      specialFeature: "Mzima Springs with underwater hippo viewing",
      highlights: [
        "Mzima Springs",
        "Rhino Sanctuary",
        "Volcanic Cones",
        "Hippo Viewing",
      ],
      lodges: [
        {
          name: "Ngulia Safari Lodge",
          image: "/assets/ngulia4.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description: "Lodge perched on the edge of the Rift Valley.",
          gallery: [
            "/assets/ngulia.png",
            "/assets/ngulia1.png",
            "/assets/ngulia2.png",
          ],
        },
        {
          name: "Kilaguni Serena Lodge",
          image: "/assets/kilaguni.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description: "First lodge built in a Kenyan national park.",
          gallery: [
            "/assets/kilaguni1.png",
            "/assets/kilaguni2.png",
            "/assets/kilaguni3.png",
          ],
        },
      ],
    },
    {
      id: 5,
      name: "Amboseli",
      slug: "amboseli",
      path: "/amboseli",
      image: "/assets/elephant-amboseli.jpg",
      fallbackImage: "/assets/parks/default-park.jpg",
      description: "Elephants with Mount Kilimanjaro backdrop",
      details: "Amboseli National Park is famous for its large elephant herds.",
      bestTime: "June to October",
      wildlife: "Elephants, Lions, Cheetahs, Buffaloes",
      specialFeature: "Large elephant herds with Kilimanjaro backdrop",
      highlights: [
        "Elephant Herds",
        "Mount Kilimanjaro",
        "Big Five",
        "Swamp Ecosystems",
      ],
      lodges: [
        {
          name: "Penety House",
          image: "/assets/penety-Ambo.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Intimate lodge with excellent views of Mount Kilimanjaro.",
          gallery: [
            "/assets/penety-Ambo1.png",
            "/assets/penety-Ambo2.png",
            "/assets/penety-Ambo3.png",
          ],
        },
        {
          name: "Hunters Manor",
          image: "/assets/huntusr-amboli.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Exclusive boutique lodge with stunning Kilimanjaro views.",
          gallery: [
            "/assets/hintursambo1.png",
            "/assets/hintursambo2.png",
            "/assets/hintursambo3.png",
          ],
        },
      ],
    },
    {
      id: 6,
      name: "Taita Hills",
      slug: "taita-hills",
      path: "/taita-hills",
      image: "/assets/taita-home.jpg",
      fallbackImage: "/assets/parks/default-park.jpg",
      description: "Lush green hills and unique ecosystem",
      details: "The Taita Hills Wildlife Sanctuary offers a unique ecosystem.",
      bestTime: "All year round",
      wildlife: "Elephants, Buffaloes, Antelopes",
      specialFeature: "Lush green hills serving as wildlife corridor",
      highlights: [
        "Mountain Views",
        "Unique Ecosystem",
        "Bird Watching",
        "Hiking",
      ],
      lodges: [
        {
          name: "Taita Hills Safari Resort",
          image: "/assets/taitaweast.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Luxurious resort with stunning views of the Taita Hills.",
          gallery: [
            "/assets/taitaweast1.png",
            "/assets/taitaweast2.png",
            "/assets/taitaweast3.png",
          ],
        },
      ],
    },
    {
      id: 7,
      name: "Salt Lick Sanctuary",
      slug: "salt-lick",
      path: "/salt-lick",
      image: "/assets/salt-lick.jpg",
      fallbackImage: "/assets/parks/default-park.jpg",
      description: "Famous tree-top lodge and wildlife",
      details: "Salt Lick Sanctuary is renowned for its unique tree-top lodge.",
      bestTime: "All year round",
      wildlife: "Elephants, Buffaloes, Antelopes",
      specialFeature: "Iconic tree-top lodge overlooking salt licks",
      highlights: [
        "Tree-top Lodge",
        "Salt Licks",
        "Night Game Drives",
        "Wildlife Photography",
      ],
      lodges: [
        {
          name: "Salt Lick Safari Lodge",
          image: "/assets/salt.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description: "Iconic tree-top lodge offering unique elevated views.",
          gallery: [
            "/assets/salt1.png",
            "/assets/salt2.png",
            "/assets/salt3.png",
            "/assets/salt4.png",
          ],
        },
      ],
    },
  ];

  const parkCategories = [
    "All Parks",
    "Maasai Mara",
    "Rift Valley",
    "Tsavo",
    "Amboseli",
    "Others",
  ];

  const getParkCategory = (parkName) => {
    if (parkName === "Maasai Mara") return "Maasai Mara";
    if (parkName === "Lake Nakuru National Park") return "Rift Valley";
    if (parkName === "Tsavo East" || parkName === "Tsavo West") return "Tsavo";
    if (parkName === "Amboseli") return "Amboseli";
    return "Others";
  };

  const filteredParks =
    selectedParkFilter === "all"
      ? parks
      : parks.filter(
          (park) => getParkCategory(park.name) === selectedParkFilter,
        );

  const handleParkClick = (park) => {
    setSelectedPark(park);
    setSelectedLodge(null);
    setExpandedLodgeMobile(null);
    setShowLodgeModal(true);
  };

  const handleShowParkDetails = (park) => {
    setSelectedPark(park);
    setShowParkModal(true);
  };

  const handleExplorePark = async (parkPath) => {
    if (!selectedPark || !selectedLodge) {
      await Swal.fire({
        title: "Select a Lodge First",
        text: "Please select a lodge before exploring the park details.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        cancelButtonText: "Cancel",
        confirmButtonText: "Choose Lodge",
      }).then((result) => {
        if (result.isConfirmed) {
          setShowLodgeModal(true);
        }
      });
      return;
    }

    const bookingData = {
      park: selectedPark,
      lodge: selectedLodge,
      step: "lodge_selected",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("safariBooking", JSON.stringify(bookingData));
    navigate(parkPath);
  };

  const handleSelectLodge = async (lodge) => {
    setSelectedLodge(lodge);
    setExpandedLodgeMobile(null);

    Swal.fire({
      title: "Saving Your Selection...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      const bookingData = {
        park: selectedPark,
        lodge: lodge,
        step: "lodge_selected",
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("safariBooking", JSON.stringify(bookingData));

      Swal.fire({
        title: "Lodge Selected!",
        text: `${lodge.name} has been selected for your ${selectedPark.name} safari.`,
        icon: "success",
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "Explore Park",
      }).then(() => {
        navigate(selectedPark.path);
        setShowLodgeModal(false);
      });
    }, 1000);
  };

  const closeModal = () => {
    setShowLodgeModal(false);
    setSelectedPark(null);
    setSelectedLodge(null);
    setExpandedLodgeMobile(null);
  };

  const closeParkModal = () => {
    setShowParkModal(false);
    setSelectedPark(null);
    setSelectedLodge(null);
  };

  const handleOpenGallery = (lodge) => {
    setSelectedLodgeGallery(lodge.gallery || []);
    setSelectedGalleryLodgeName(lodge.name);
    setCurrentGalleryIndex(0);
    setShowGalleryModal(true);
  };

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) =>
      prev === selectedLodgeGallery.length - 1 ? 0 : prev + 1,
    );
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) =>
      prev === 0 ? selectedLodgeGallery.length - 1 : prev - 1,
    );
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedLodgeGallery([]);
    setSelectedGalleryLodgeName("");
  };

  const sendLodgeInquiry = async (lodge) => {
    if (!lodge) {
      await Swal.fire({
        title: "No Lodge Selected",
        text: "Please select a lodge first.",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Send Email Inquiry?",
      html: `Are you sure you want to send an inquiry about <strong>${lodge.name}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Yes, Send Email",
    });

    if (result.isConfirmed) {
      const subject = `Inquiry about ${lodge.name} in ${selectedPark.name}`;
      const body = `Dear Joztembo Tours,\n\nI am interested in ${lodge.name} located in ${selectedPark.name}.\n\nPlease send me more information.`;
      window.open(
        `mailto:tembo4401@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
      Swal.fire({
        title: "Email Ready!",
        text: "Your email client should open.",
        icon: "success",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  const isLodgeSelectedForPark = () => {
    const bookingData = localStorage.getItem("safariBooking");
    if (bookingData) {
      const parsedData = JSON.parse(bookingData);
      return parsedData.park && parsedData.park.id === selectedPark?.id;
    }
    return false;
  };

  const handleImageError = (e, fallbackImage) => {
    e.target.onerror = null;
    e.target.src = fallbackImage || "/assets/parks/default-park.jpg";
  };

  const toggleLodgeDetails = (lodgeName) => {
    if (expandedLodgeMobile === lodgeName) {
      setExpandedLodgeMobile(null);
    } else {
      setExpandedLodgeMobile(lodgeName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white overflow-x-hidden">
      {/* Slideshow Section */}
      <div className="w-full overflow-x-hidden">
        <div className="relative w-full h-[400px] md:h-[650px] lg:h-[750px] overflow-hidden mb-16 group">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-lg font-semibold">
                  Loading Safari Wonders...
                </p>
              </div>
            </div>
          )}

          <div className="relative w-full h-full">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              const slideImage =
                loadedImages.find((img) => img.id === slide.id)?.src ||
                slide.fallbackImage;

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={slideImage}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 30%, transparent 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full px-4 md:px-8 pb-8 md:pb-16">
                      <div
                        className={`max-w-3xl transition-all duration-1000 transform ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                      >
                        <h2
                          className={`text-3xl md:text-7xl font-bold mb-4 leading-tight drop-shadow-2xl ${slide.textColor}`}
                        >
                          {slide.title}
                        </h2>
                        <p className="text-base md:text-3xl text-amber-100 mb-8 drop-shadow-lg">
                          {slide.subtitle}
                        </p>
                        <button
                          onClick={scrollToParks}
                          className={`px-6 md:px-8 py-3 md:py-4 text-white font-bold text-base md:text-lg rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${slide.buttonColor}`}
                        >
                          Explore Safaris →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full z-20"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full z-20"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-amber-400 scale-125" : "bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Parks Section */}
      <div className="container mx-auto px-4 overflow-x-hidden">
        <section id="parks-section" className="py-8 scroll-mt-20">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold">
                PREMIER SAFARI DESTINATIONS
              </span>
            </div>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Explore Kenya's Wildlife Sanctuaries
            </h2>
            <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
              From the Great Migration to the flamingo-filled shores, discover
              Africa's most spectacular wildlife encounters.
            </p>
          </div>

          {/* Desktop Filter */}
          <div className="hidden md:flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedParkFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedParkFilter === "all"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              All Parks
            </button>
            {parkCategories
              .filter((cat) => cat !== "All Parks")
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedParkFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedParkFilter === cat
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>

          {/* Mobile Filter Dropdown */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowMobileParkFilter(!showMobileParkFilter)}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
            >
              <span className="text-gray-700 font-medium">
                {selectedParkFilter === "all"
                  ? "All Parks"
                  : selectedParkFilter}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${showMobileParkFilter ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showMobileParkFilter && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setSelectedParkFilter("all");
                    setShowMobileParkFilter(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm ${selectedParkFilter === "all" ? "bg-amber-50 text-amber-600 font-medium" : "text-gray-700"}`}
                >
                  All Parks
                </button>
                {parkCategories
                  .filter((cat) => cat !== "All Parks")
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedParkFilter(cat);
                        setShowMobileParkFilter(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm border-t border-gray-100 ${selectedParkFilter === cat ? "bg-amber-50 text-amber-600 font-medium" : "text-gray-700"}`}
                    >
                      {cat}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Parks Grid - 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {(showAllParks ? filteredParks : filteredParks.slice(0, 8)).map(
              (park) => (
                <div
                  key={park.id}
                  className="group bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
                >
                  <div
                    className="relative h-32 sm:h-40 md:h-48 overflow-hidden"
                    onClick={() => handleParkClick(park)}
                  >
                    <img
                      src={park.image}
                      alt={park.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => handleImageError(e, park.fallbackImage)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 backdrop-blur-sm text-amber-700 px-1.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold">
                        {park.lodges.length}{" "}
                        {park.lodges.length === 1 ? "Lodge" : "Lodges"}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        {park.name}
                      </h3>
                      <p className="text-[10px] text-amber-200 truncate">
                        {park.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowParkDetails(park);
                        }}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-1.5 rounded-lg font-semibold text-[10px] md:text-sm"
                      >
                        Details
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          setSelectedPark(park);
                          setShowLodgeModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-gray-800 to-black text-white py-1.5 rounded-lg font-semibold text-[10px] md:text-sm"
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {filteredParks.length > 8 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => setShowAllParks(!showAllParks)}
                className="flex items-center gap-2 px-6 py-2 bg-white border-2 border-amber-200 rounded-full"
              >
                <span className="text-amber-700 font-semibold">
                  {showAllParks
                    ? "▲ Show less"
                    : `▼ Show all (${filteredParks.length - 8} more)`}
                </span>
              </button>
            </div>
          )}
        </section>
      </div>

      {/* LODGE SELECTION MODAL - WITH 2 COLUMN GRID ON MOBILE */}
      {showLodgeModal && selectedPark && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-40 md:h-64">
              <img
                src={selectedPark.image}
                alt={selectedPark.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, selectedPark.fallbackImage)}
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg"
              >
                <svg
                  className="w-5 h-5 text-gray-800"
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
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-xl md:text-3xl font-bold">
                  {selectedPark.name} Lodges
                </h2>
                <p className="text-amber-200 text-sm">
                  Select your perfect accommodation
                </p>
                {selectedLodge && (
                  <div className="mt-2 bg-green-500/80 text-white px-2 py-1 rounded-lg text-xs">
                    <span className="font-bold">Selected:</span>{" "}
                    {selectedLodge.name}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* Selected Lodge Banner */}
              {selectedLodge && (
                <div className="mb-6 p-3 bg-green-50 rounded-xl border border-green-300">
                  <div className="flex flex-col md:flex-row justify-between gap-2">
                    <div>
                      <h3 className="text-sm md:text-lg font-bold text-green-800">
                        ✅ Lodge Selected
                      </h3>
                      <p className="text-xs md:text-sm text-green-700">
                        You selected <strong>{selectedLodge.name}</strong> for{" "}
                        {selectedPark.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLodge(null)}
                      className="text-green-700 text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* LODGES GRID - 2 COLUMNS ON MOBILE, 1 COLUMN ON DESKTOP */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6">
                {selectedPark.lodges.map((lodge, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedLodge?.name === lodge.name
                        ? "border-green-500 border-4"
                        : "border-amber-200"
                    }`}
                  >
                    {/* Lodge Card - Always visible (Name + Photo) */}
                    <div
                      className="p-3 md:p-6 cursor-pointer md:cursor-default"
                      onClick={() => toggleLodgeDetails(lodge.name)}
                    >
                      <div className="flex flex-row gap-3 md:gap-6">
                        {/* Photo - Left side */}
                        <div className="w-1/3 md:w-2/5">
                          <div className="relative">
                            <img
                              src={lodge.image}
                              alt={lodge.name}
                              className="w-full h-24 md:h-48 object-cover rounded-lg shadow-md"
                              onError={(e) =>
                                handleImageError(e, lodge.fallbackImage)
                              }
                            />
                            {selectedLodge?.name === lodge.name && (
                              <div className="absolute top-1 right-1 bg-green-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                                SELECTED
                              </div>
                            )}
                            {/* Mobile expand indicator */}
                            <div className="md:hidden absolute bottom-1 right-1 bg-black/50 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                              {expandedLodgeMobile === lodge.name ? "▲" : "▼"}
                            </div>
                          </div>
                        </div>

                        {/* Name and basic info - Right side */}
                        <div className="w-2/3 md:w-3/5">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm md:text-2xl font-bold text-gray-900">
                              {lodge.name}
                            </h4>
                            <span className="bg-amber-100 text-amber-800 px-1.5 md:px-3 py-0.5 rounded-full text-[10px] md:text-sm font-semibold ml-2 whitespace-nowrap">
                              #{index + 1}
                            </span>
                          </div>
                          {/* Short description on mobile, full on desktop */}
                          <p className="text-gray-600 text-xs md:text-base mt-1">
                            {lodge.description.length > 60 &&
                            expandedLodgeMobile !== lodge.name ? (
                              <span className="md:hidden">
                                {lodge.description.substring(0, 50)}...
                                <span className="text-amber-600 ml-1 text-[10px]">
                                  tap to expand
                                </span>
                              </span>
                            ) : (
                              <span className="hidden md:inline">
                                {lodge.description}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details - Shows on mobile when clicked, always on desktop */}
                    <div
                      className={`${expandedLodgeMobile === lodge.name ? "block" : "hidden md:block"} p-3 md:p-6 pt-0 md:pt-0 border-t border-amber-100`}
                    >
                      {/* Full description for mobile */}
                      <p className="text-gray-700 text-xs md:hidden mb-3">
                        {lodge.description}
                      </p>

                      {/* Gallery */}
                      {lodge.gallery && lodge.gallery.length > 0 && (
                        <div className="mb-3 md:mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1 text-xs md:text-base">
                            <svg
                              className="w-3 h-3 md:w-5 md:h-5 text-amber-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Gallery
                          </h4>
                          <div className="grid grid-cols-3 gap-1 md:gap-2">
                            {lodge.gallery.slice(0, 3).map((img, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => handleOpenGallery(lodge)}
                              >
                                <img
                                  src={img}
                                  alt="Gallery"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          {lodge.gallery.length > 3 && (
                            <button
                              onClick={() => handleOpenGallery(lodge)}
                              className="mt-1 text-xs text-amber-600"
                            >
                              View all {lodge.gallery.length} photos →
                            </button>
                          )}
                        </div>
                      )}

                      {/* Premium Badge */}
                      <div className="text-center my-2 md:my-3">
                        <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                          Premium Accommodation
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-2 md:mt-3">
                        <button
                          onClick={() => handleSelectLodge(lodge)}
                          className={`flex-1 px-3 md:px-4 py-1.5 md:py-3 rounded-lg font-bold text-xs md:text-base transition-all ${
                            selectedLodge?.name === lodge.name
                              ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                              : "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
                          }`}
                        >
                          {selectedLodge?.name === lodge.name
                            ? "✓ Selected"
                            : "Select This Lodge"}
                        </button>
                        <button
                          onClick={() => sendLodgeInquiry(lodge)}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 md:px-4 py-1.5 md:py-3 rounded-lg font-bold text-xs md:text-base flex items-center justify-center gap-1"
                        >
                          <svg
                            className="w-3 h-3 md:w-4 md:h-4"
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
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Action Buttons */}
              <div className="mt-6 pt-4 border-t border-amber-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-bold text-sm"
                  >
                    Back to Parks
                  </button>
                  <button
                    onClick={() => handleExplorePark(selectedPark.path)}
                    disabled={!selectedLodge}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                  >
                    {selectedLodge
                      ? `Explore ${selectedPark.name}`
                      : "Select a Lodge First"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Park Details Modal */}
      {showParkModal && selectedPark && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-40 md:h-64">
              <img
                src={selectedPark.image}
                alt={selectedPark.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeParkModal}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-xl md:text-3xl font-bold">
                  {selectedPark.name}
                </h2>
                <p className="text-amber-200 text-sm">
                  {selectedPark.description}
                </p>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-gray-700 text-sm md:text-base mb-4">
                {selectedPark.details}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="font-bold text-sm">Best Time</h4>
                  <p className="text-amber-700 font-semibold text-sm">
                    {selectedPark.bestTime}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="font-bold text-sm">Key Wildlife</h4>
                  <p className="text-sm">{selectedPark.wildlife}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeParkModal}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setShowParkModal(false);
                    setShowLodgeModal(true);
                  }}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm"
                >
                  View Lodges
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && selectedLodgeGallery.length > 0 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeGalleryModal}
              className="absolute top-2 right-2 bg-white/10 text-white rounded-full p-2 z-10"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative h-[60vh]">
              <img
                src={selectedLodgeGallery[currentGalleryIndex]}
                alt="Gallery"
                className="w-full h-full object-contain"
              />
              {selectedLodgeGallery.length > 1 && (
                <>
                  <button
                    onClick={prevGalleryImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextGalleryImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2"
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <p className="text-white text-center mt-2 text-sm">
              {currentGalleryIndex + 1} / {selectedLodgeGallery.length}
            </p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-amber-700 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Begin Your Safari Adventure
          </h2>
          <p className="text-sm md:text-lg mb-6 max-w-2xl mx-auto">
            Contact us to book your perfect Kenyan safari experience.
          </p>
          
        </div>
      </section>
    </div>
  );
}
