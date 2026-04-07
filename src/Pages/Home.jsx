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
  const navigate = useNavigate();

  // Enhanced slideshow images with better visibility
  const slides = [
    {
      id: 1,
      image: "/assets/kilima-slideshow.jpg",
      fallbackImage:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      title: "Discover Kenya's Wildlife Wonders",
      subtitle:
        "Experience the vast plains and incredible wildlife of Kenya's most famous parks",
      overlay: "rgba(0, 0, 0, 0.25)",
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
      overlay: "rgba(0, 0, 0, 0.2)",
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
      overlay: "rgba(0, 0, 0, 0.3)",
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
      overlay: "rgba(0, 0, 0, 0.25)",
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
      overlay: "rgba(0, 0, 0, 0.2)",
      textColor: "text-white",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
  ];

  // Preload images for better performance
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

      // Also preload park images
      const parkImagePromises = parks.map((park) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = park.image;
          img.onload = () =>
            resolve({ type: "park", id: park.id, loaded: true });
          img.onerror = () =>
            resolve({ type: "park", id: park.id, loaded: false });
        });
      });

      const [slideResults, parkResults] = await Promise.all([
        Promise.all(imagePromises),
        Promise.all(parkImagePromises),
      ]);

      const loadedSlides = slideResults.filter((r) => r.loaded);
      setLoadedImages(loadedSlides.map((r) => ({ id: r.id, src: r.src })));
      setIsLoading(false);
    };

    preloadImages();
  }, []);

  // Auto-slide with longer interval for better viewing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigate slides manually
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

  // Updated Parks data with ALL lodges
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
        "The Maasai Mara National Reserve is one of Africa's most famous wildlife conservation areas. Known for its exceptional population of lions, leopards, and cheetahs, and the annual migration of zebra, Thomson's gazelle, and wildebeest.",
      bestTime: "July to October",
      highlights: [
        "Great Migration",
        "Big Five",
        "Maasai Culture",
        "Balloon Safaris",
      ],
      wildlife:
        "Lions, Cheetahs, Leopards, Elephants, Rhinos, Buffaloes, Wildebeest, Zebras",
      specialFeature: "Annual Great Migration of over 1.5 million wildebeest",
      lodges: [
        {
          name: "Sweet Acacia Camp",
          image: "/assets/Sweet-Acacia-Camp-maara.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Luxurious tented camp offering intimate wildlife experiences with personalized service and stunning Mara River views.",
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
            "Family-friendly lodge with spacious accommodations, excellent dining, and prime location for migration viewing.",
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
            "Award-winning lodge built on a hill with panoramic views, offering luxury accommodations and world-class service.",
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
            "Boutique luxury camp offering French-inspired elegance and exceptional wildlife viewing opportunities.",
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
            "Traditional African-style lodge offering comfortable accommodations and excellent game viewing facilities.",
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
          description:
            "Premium tented camp with luxurious amenities, swimming pool, and exceptional dining experiences.",
          gallery: [
            "/assets/sarovamara1.jpg",
            "/assets/sarovamara2.jpg",
            "/assets/sarovamara3.jpg",
          ],
        },
        {
          name: "Elengata Camp",
          image: "/assets/elengata.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Eco-friendly camp offering authentic Maasai cultural experiences and close wildlife encounters.",
          gallery: [
            "/assets/elengata1.jpg",
            "/assets/elengata2.jpg",
            "/assets/elengata3.jpg",
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
        "Lake Nakuru National Park is known for its incredible birdlife, including flocks of flamingos that color the lake pink. The park also hosts one of Kenya's largest rhino sanctuaries and supports a wide variety of wildlife.",
      bestTime: "June to March",
      wildlife: "Flamingos, Rhinos, Lions, Leopards, Waterbucks, Giraffes",
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
            "Scenic lodge overlooking Lake Elementaita with stunning views, luxury accommodations, and spa facilities.",
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
            "Modern lodge with stunning lake views, swimming pool, and easy access to the rhino sanctuary and flamingo colonies.",
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
        "Tsavo East National Park is one of the oldest and largest parks in Kenya. Famous for its 'red' elephants that dust-bathe in the red volcanic soil, the park offers vast wilderness experiences and diverse wildlife.",
      bestTime: "April to October & January to February",
      wildlife:
        "Red Elephants, Lions, Buffaloes, Giraffes, Antelopes, Bird Species",
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
          description:
            "Strategically located lodge overlooking a waterhole, offering excellent game viewing opportunities and comfortable accommodations.",
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
          description:
            "Eco-friendly lodge with stunning views of the park, offering guided walks and excellent bird watching opportunities.",
          gallery: [
            "/assets/voiwildlife.png",
            "/assets/voiwildlife1.png",
            "/assets/voiwildlife2.png",
            "/assets/voiwildlife3.png",
            "/assets/voiwildlife5.png",
          ],
        },
        {
          name: "Manyatta Camp",
          image: "/assets/manyatta.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Traditional-style camp offering authentic safari experiences with comfortable tented accommodations.",
          gallery: [
            "/assets/manyatta1.jpg",
            "/assets/manyatta2.jpg",
            "/assets/manyatta3.jpg",
          ],
        },
        {
          name: "Ashnill Aruba Lodge",
          image: "/assets/ashnillaruba.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Modern lodge with excellent facilities, swimming pool, and prime location for wildlife photography.",
          gallery: [
            "/assets/ashnillaruba1.jpg",
            "/assets/ashnillaruba2.jpg",
            "/assets/ashnillaruba3.jpg",
          ],
        },
        {
          name: "Maneaters Lodge",
          image: "/assets/maneaters.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Historical lodge named after the famous Tsavo man-eating lions, offering comfortable accommodations and rich history.",
          gallery: [
            "/assets/maneaters1.jpg",
            "/assets/maneaters2.jpg",
            "/assets/maneaters3.jpg",
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
      details:
        "Tsavo West National Park features more diverse scenery and volcanic landscapes than its eastern counterpart. Famous for Mzima Springs, underwater hippo viewing, and the Ngulia Rhino Sanctuary.",
      bestTime: "April to October & January to February",
      wildlife: "Hippos, Crocodiles, Rhinos, Elephants, Lions, Leopards",
      specialFeature: "Mzima Springs with underwater hippo and fish viewing",
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
          description:
            "Lodge perched on the edge of the Rift Valley with spectacular views and excellent rhino viewing opportunities.",
          gallery: [
            "/assets/ngulia.png",
            "/assets/ngulia1.png",
            "/assets/ngulia2.png",
            "/assets/ngulia3.png",
          ],
        },
        {
          name: "Kilaguni Serena Lodge",
          image: "/assets/kilaguni.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "First lodge to be built in a Kenyan national park, offering stunning views of Mount Kilimanjaro and waterhole game viewing.",
          gallery: [
            "/assets/kilaguni1.png",
            "/assets/kilaguni2.png",
            "/assets/kilaguni3.png",
          ],
        },
        {
          name: "Severin Safari Camp",
          image: "/assets/severin.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Luxury tented camp with a unique blend of African and Arabic architecture, offering exceptional service and comfort.",
          gallery: [
            "/assets/severin1.jpg",
            "/assets/severin2.jpg",
            "/assets/severin3.jpg",
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
      details:
        "Amboseli National Park is famous for its large elephant herds and spectacular views of Mount Kilimanjaro. The park offers some of the best opportunities to see African wildlife against the backdrop of the continent's highest peak.",
      bestTime: "June to October & January to February",
      wildlife:
        "Elephants, Lions, Cheetahs, Buffaloes, Hippos, Giraffes, Zebras",
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
            "Intimate lodge offering personalized service with excellent views of Mount Kilimanjaro and guided nature walks.",
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
            "Exclusive boutique lodge offering personalized service with stunning Kilimanjaro views and luxury accommodations.",
          gallery: [
            "/assets/hintursambo1.png",
            "/assets/hintursambo2.png",
            "/assets/hintursambo3.png",
          ],
        },
        {
          name: "Sentrim Amboseli Lodge",
          image: "/assets/sentrim.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Comfortable lodge with traditional African decor, offering great value and excellent Kilimanjaro views.",
          gallery: [
            "/assets/sentrim1.jpg",
            "/assets/sentrim2.jpg",
            "/assets/sentrim3.jpg",
          ],
        },
        {
          name: "AA Lodge Amboseli",
          image: "/assets/AA-ambo.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Comfortable family lodge with excellent facilities, perfect for both first-time and experienced safari-goers.",
          gallery: [
            "/assets/AA-ambo1.png",
            "/assets/AA-ambo2.png",
            "/assets/AA-ambo3.png",
          ],
        },
        {
          name: "Amboseli Serena Safari Lodge",
          image: "/assets/amboserena.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Award-winning lodge with Maasai-inspired design, offering luxury accommodations and exceptional wildlife viewing.",
          gallery: [
            "/assets/amboserena1.jpg",
            "/assets/amboserena2.jpg",
            "/assets/amboserena3.jpg",
          ],
        },
        {
          name: "Amboseli Sopa Lodge",
          image: "/assets/amboseli-sopa.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Spacious lodge set in extensive grounds with traditional African architecture and excellent amenities.",
          gallery: [
            "/assets/amboseli-sopa1.jpg",
            "/assets/amboseli-sopa2.jpg",
            "/assets/amboseli-sopa3.jpg",
          ],
        },
        {
          name: "Kilima Safari Camp",
          image: "/assets/kiliambo.png",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Eco-friendly camp nestled at the foot of Kilimanjaro, offering authentic safari experiences with modern comforts.",
          gallery: [
            "/assets/kiliambo1.png",
            "/assets/kiliambo2.png",
            "/assets/kiliambo3.png",
          ],
        },
        {
          name: "Kibo Safari Camp",
          image: "/assets/kibo.jpg",
          fallbackImage: "/assets/lodges/default-lodge.jpg",
          description:
            "Classic tented camp offering direct views of Mount Kilimanjaro and comfortable accommodations in a natural setting.",
          gallery: [
            "/assets/kibo1.jpg",
            "/assets/kibo2.jpg",
            "/assets/kibo3.jpg",
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
      details:
        "The Taita Hills Wildlife Sanctuary offers a unique ecosystem with lush green hills, diverse wildlife, and stunning landscapes. It serves as a corridor for wildlife moving between Tsavo East and West National Parks.",
      bestTime: "All year round",
      wildlife: "Elephants, Buffaloes, Antelopes, Bird Species",
      specialFeature:
        "Lush green hills serving as wildlife corridor between Tsavo parks",
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
            "Luxurious resort with stunning views of the Taita Hills, offering comfortable accommodations and excellent game viewing.",
          gallery: [
            "/assets/taitaweast1.png",
            "/assets/taitaweast2.png",
            "/assets/taitaweast3.png",
            "/assets/taitaweast4.png",
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
      details:
        "Salt Lick Sanctuary is renowned for its unique tree-top lodge and abundant wildlife that gathers at the natural salt licks. The sanctuary offers incredible opportunities for wildlife photography and close animal encounters.",
      bestTime: "All year round",
      wildlife: "Elephants, Buffaloes, Antelopes, Bird Species",
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
          description:
            "Iconic tree-top lodge offering unique elevated views of wildlife at the salt licks and waterholes.",
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

  // Park functions
  const handleParkClick = (park) => {
    setSelectedPark(park);
    setSelectedLodge(null);
    setShowLodgeModal(true);
  };

  const handleShowParkDetails = (park) => {
    setSelectedPark(park);
    setShowParkModal(true);
  };

  // UPDATED: Navigate to the park page (e.g., /masaimara, /lakenakuru, etc.)
  const handleExplorePark = async (parkPath) => {
    if (!selectedPark || !selectedLodge) {
      // Show SweetAlert to select a lodge first
      await Swal.fire({
        title: "Select a Lodge First",
        text: "Please select a lodge before exploring the park details.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Choose Lodge",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setShowLodgeModal(true);
        }
      });
      return;
    }

    // Save to localStorage
    const bookingData = {
      park: selectedPark,
      lodge: selectedLodge,
      step: "lodge_selected",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("safariBooking", JSON.stringify(bookingData));

    // Navigate to the park page (e.g., /masaimara, /lakenakuru, etc.)
    navigate(parkPath);
  };

  // UPDATED: Handle lodge selection and navigate to park page
  const handleSelectLodge = async (lodge) => {
    setSelectedLodge(lodge);

    // Show loading spinner
    Swal.fire({
      title: "Saving Your Selection...",
      text: "Please wait while we save your lodge preference.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Simulate async save
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
        // Navigate to the park page (e.g., /masaimara)
        navigate(selectedPark.path);
        setShowLodgeModal(false);
      });
    }, 1000);
  };

  const closeModal = () => {
    setShowLodgeModal(false);
    setSelectedPark(null);
    setSelectedLodge(null);
  };

  const closeParkModal = () => {
    setShowParkModal(false);
    setSelectedPark(null);
    setSelectedLodge(null);
  };

  // Gallery functions
  const handleOpenGallery = (lodge) => {
    setSelectedLodgeGallery(lodge.gallery || []);
    setSelectedGalleryLodgeName(lodge.name);
    setCurrentGalleryIndex(0);
    setShowGalleryModal(true);
  };

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) =>
      prev === selectedLodgeGallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) =>
      prev === 0 ? selectedLodgeGallery.length - 1 : prev - 1
    );
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedLodgeGallery([]);
    setSelectedGalleryLodgeName("");
  };

  // Updated sendLodgeInquiry with SweetAlert
  const sendLodgeInquiry = async (lodge) => {
    // Check if lodge is selected
    if (!lodge) {
      await Swal.fire({
        title: "No Lodge Selected",
        text: "Please select a lodge first before sending an inquiry.",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        confirmButtonText: "OK",
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Send Email Inquiry?",
      html: `Are you sure you want to send an inquiry about <strong>${lodge.name}</strong> in <strong>${selectedPark.name}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Send Email",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const subject = `Inquiry about ${lodge.name} in ${selectedPark.name}`;
      const body = `Dear Joztembo Tours,

I am interested in ${lodge.name} located in ${selectedPark.name}.

Park Information:
- Park: ${selectedPark.name}
- Best Time to Visit: ${selectedPark.bestTime}
- Highlights: ${selectedPark.highlights.join(", ")}

Lodge Details:
- Lodge Name: ${lodge.name}
- Description: ${lodge.description}

Please send me more information about availability, pricing, and booking options for this lodge.

Thank you,
[Your Name]`;

      window.open(
        `mailto:tembo4401@gmail.com?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`
      );

      // Show success message
      Swal.fire({
        title: "Email Ready!",
        text: "Your email client should open with a pre-filled inquiry. If not, please email tembo4401@gmail.com",
        icon: "success",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  // Function to check if lodge is selected for this park
  const isLodgeSelectedForPark = () => {
    const bookingData = localStorage.getItem("safariBooking");
    if (bookingData) {
      const parsedData = JSON.parse(bookingData);
      return parsedData.park && parsedData.park.id === selectedPark?.id;
    }
    return false;
  };

  // Helper function to handle image errors
  const handleImageError = (e, fallbackImage) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = fallbackImage || "/assets/parks/default-park.jpg";
  };

  // Get current slide image source
  const getCurrentSlideImage = () => {
    const currentSlideData = slides[currentSlide];
    const loadedSlide = loadedImages.find(
      (img) => img.id === currentSlideData.id
    );
    return loadedSlide?.src || currentSlideData.fallbackImage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Container with NO padding around slideshow */}
      <div className="w-full">
        {/* Enhanced Slideshow - Reduced spacing to nearly 0 */}
        <div className="relative w-full h-[400px] md:h-[650px] lg:h-[750px] overflow-hidden mb-16 group">
          {/* Loading State */}
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

          {/* Slide Container */}
          <div className="relative w-full h-full">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              const slideImage =
                loadedImages.find((img) => img.id === slide.id)?.src ||
                slide.fallbackImage;

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {/* Background Image Container - Full width */}
                  <div className="absolute inset-0">
                    <img
                      src={slideImage}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: "brightness(1.05) contrast(1.1) saturate(1.2)",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = slide.fallbackImage;
                      }}
                    />
                  </div>

                  {/* Gradient Overlay - Lighter for better image visibility */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, 
                        rgba(0, 0, 0, 0.7) 0%, 
                        rgba(0, 0, 0, 0.4) 30%, 
                        rgba(0, 0, 0, 0.2) 60%, 
                        transparent 100%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full px-4 md:px-8 pb-8 md:pb-12 lg:pb-16">
                      <div
                        className={`max-w-3xl transition-all duration-1000 transform ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                      >
                        <h2
                          className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-2xl ${slide.textColor}`}
                        >
                          {slide.title}
                        </h2>
                        <p className="text-xl md:text-2xl lg:text-3xl text-amber-100 mb-8 drop-shadow-lg max-w-2xl">
                          {slide.subtitle}
                        </p>
                        <button
                          onClick={scrollToParks}
                          className={`px-8 py-4 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-3xl ${slide.buttonColor}`}
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

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-300 z-20 hover:scale-110"
            aria-label="Previous slide"
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
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/40 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-300 z-20 hover:scale-110"
            aria-label="Next slide"
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

          {/* Slide Indicators */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 transform hover:scale-150 ${
                  index === currentSlide
                    ? "bg-amber-400 scale-125 shadow-lg"
                    : "bg-white/70 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000 ease-linear"
              style={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
              }}
            />
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-20">
            <span className="font-bold">{currentSlide + 1}</span>
            <span className="mx-1 text-white/70">/</span>
            <span>{slides.length}</span>
          </div>
        </div>
      </div>

      {/* Rest of the content with container */}
      <div className="container mx-auto px-4">
        {/* Featured Parks Section */}
        <section id="parks-section" className="py-8 scroll-mt-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                PREMIER SAFARI DESTINATIONS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
              Explore Kenya's Wildlife Sanctuaries
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From the Great Migration in Maasai Mara to the flamingo-filled
              shores of Lake Nakuru, discover Africa's most spectacular wildlife
              encounters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {parks.map((park) => (
              <div
                key={park.id}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 border border-amber-100 hover:border-amber-300 hover:shadow-2xl"
              >
                {/* Card click area - shows lodges */}
                <div
                  className="relative h-80 overflow-hidden"
                  onClick={() => handleParkClick(park)}
                >
                  <img
                    src={park.image}
                    alt={park.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => handleImageError(e, park.fallbackImage)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-amber-300 transition-colors duration-300">
                      {park.name}
                    </h3>
                    <p className="text-amber-200 font-medium">
                      {park.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {park.lodges.length}{" "}
                      {park.lodges.length === 1 ? "Lodge" : "Lodges"}
                    </span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowParkDetails(park);
                    }}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    View Details
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      setSelectedPark(park);

                      // Check if a lodge is already selected for this park
                      if (isLodgeSelectedForPark()) {
                        const result = await Swal.fire({
                          title: "Lodge Already Selected",
                          text: "You have already selected a lodge for this park. Would you like to choose a different one?",
                          icon: "question",
                          showCancelButton: true,
                          confirmButtonColor: "#f59e0b",
                          cancelButtonColor: "#6b7280",
                          confirmButtonText: "Choose Different Lodge",
                          cancelButtonText: "Continue with Selected",
                        });

                        if (result.isConfirmed) {
                          setShowLodgeModal(true);
                        } else {
                          handleExplorePark(park.path);
                        }
                      } else {
                        // Show lodge selection modal
                        setShowLodgeModal(true);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Others Section */}
          <div className="mt-20 bg-gradient-to-br from-white via-amber-50 to-white rounded-3xl shadow-2xl p-10 border border-amber-200">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                <h3 className="text-3xl font-serif font-bold text-gray-900">
                  More Amazing Destinations
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
                Beyond these iconic parks, Kenya offers diverse landscapes and
                unique wildlife experiences in private conservancies and
                lesser-known gems.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  { name: "Samburu", color: "from-red-500 to-red-600" },
                  { name: "Meru", color: "from-green-500 to-green-600" },
                  { name: "Laikipia", color: "from-blue-500 to-blue-600" },
                  { name: "Aberdare", color: "from-purple-500 to-purple-600" },
                  {
                    name: "Private Conservancies",
                    color: "from-teal-500 to-teal-600",
                  },
                ].map((destination) => (
                  <span
                    key={destination.name}
                    className={`bg-gradient-to-r ${destination.color} text-white px-5 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    {destination.name}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 italic">
                Each destination offers unique wildlife, landscapes, and
                cultural experiences
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Lodge Selection Modal with Gallery */}
      {showLodgeModal && selectedPark && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-80">
              <img
                src={selectedPark.image}
                alt={selectedPark.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, selectedPark.fallbackImage)}
              />
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-3 hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
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
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-4xl font-bold mb-2">
                  {selectedPark.name} Lodges
                </h2>
                <p className="text-amber-200 text-xl">
                  Select your perfect accommodation
                </p>
                {selectedLodge && (
                  <div className="mt-2 bg-green-500/80 text-white px-4 py-2 rounded-lg inline-block">
                    <span className="font-bold">Selected:</span>{" "}
                    {selectedLodge.name}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Content - Enhanced with Gallery */}
            <div className="p-8">
              {/* Selected Lodge Banner */}
              {selectedLodge && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl border border-green-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-green-800">
                        ✅ Lodge Selected
                      </h3>
                      <p className="text-green-700">
                        You have selected <strong>{selectedLodge.name}</strong>{" "}
                        for your {selectedPark.name} safari.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLodge(null)}
                      className="text-green-700 hover:text-green-900 font-medium"
                    >
                      Change Selection
                    </button>
                  </div>
                </div>
              )}

              {/* Lodges Section */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Available Lodges in {selectedPark.name}
                  </h3>
                  <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
                </div>
                <div className="space-y-12">
                  {selectedPark.lodges.map((lodge, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-2xl p-8 bg-gradient-to-br from-white to-amber-50 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                        selectedLodge?.name === lodge.name
                          ? "border-green-500 border-4"
                          : "border-amber-100 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/5">
                          <div className="relative">
                            <img
                              src={lodge.image}
                              alt={lodge.name}
                              className="w-full h-64 object-cover rounded-xl mb-4 shadow-lg"
                              onError={(e) =>
                                handleImageError(e, lodge.fallbackImage)
                              }
                            />
                            {selectedLodge?.name === lodge.name && (
                              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                                SELECTED
                              </div>
                            )}
                          </div>

                          {/* GALLERY SECTION - ADDED HERE */}
                          {lodge.gallery && lodge.gallery.length > 0 && (
                            <div className="mt-6">
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-amber-600"
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
                                Lodge Gallery
                              </h4>
                              <div className="grid grid-cols-3 gap-3">
                                {lodge.gallery.map((galleryImage, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                                    onClick={() => handleOpenGallery(lodge)}
                                  >
                                    <img
                                      src={galleryImage}
                                      alt={`${lodge.name} - Image ${
                                        imgIndex + 1
                                      }`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = lodge.fallbackImage;
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                      <svg
                                        className="w-6 h-6 text-white/0 group-hover:text-white/80 transition-all duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => handleOpenGallery(lodge)}
                                className="mt-3 text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
                              >
                                View Full Gallery
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}

                          <div className="text-center mt-4">
                            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                              Premium Accommodation
                            </span>
                          </div>
                        </div>

                        <div className="lg:w-3/5">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="text-2xl font-bold text-gray-900">
                              {lodge.name}
                            </h4>
                            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                              Lodge {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                            {lodge.description}
                          </p>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              onClick={() => handleSelectLodge(lodge)}
                              className={`flex-1 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                                selectedLodge?.name === lodge.name
                                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                  : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                              } text-white`}
                            >
                              {selectedLodge?.name === lodge.name
                                ? "✓ Selected - Explore Park"
                                : "Select This Lodge"}
                            </button>

                            <button
                              onClick={() => sendLodgeInquiry(lodge)}
                              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
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
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              Email Inquiry
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 pt-8 border-t border-amber-200">
                <div className="flex flex-col sm:flex-row gap-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Back to Parks
                  </button>
                  <button
                    onClick={() => handleExplorePark(selectedPark.path)}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedLodge}
                  >
                    {selectedLodge
                      ? `Explore ${selectedPark.name} with ${selectedLodge.name}`
                      : `Select a Lodge to Explore ${selectedPark.name}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Park Details Modal */}
      {showParkModal && selectedPark && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-80">
              <img
                src={selectedPark.image}
                alt={selectedPark.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, selectedPark.fallbackImage)}
              />
              <button
                onClick={closeParkModal}
                className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-full p-3 hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
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
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-4xl font-bold mb-2">{selectedPark.name}</h2>
                <p className="text-amber-200 text-xl">
                  {selectedPark.description}
                </p>
                {selectedLodge && (
                  <div className="mt-2 bg-green-500/80 text-white px-4 py-2 rounded-lg inline-block">
                    <span className="font-bold">Selected Lodge:</span>{" "}
                    {selectedLodge.name}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              {/* Park Information */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    About {selectedPark.name}
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  {selectedPark.details}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100">
                    <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-amber-600"
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
                      Park Highlights
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedPark.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100">
                    <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-amber-600"
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
                      Best Time to Visit
                    </h4>
                    <p className="text-amber-700 text-xl font-bold">
                      {selectedPark.bestTime}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Optimal wildlife viewing season
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100">
                    <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Key Wildlife
                    </h4>
                    <p className="text-gray-800 text-lg font-semibold">
                      {selectedPark.wildlife}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100">
                    <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-amber-600"
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
                      Special Feature
                    </h4>
                    <p className="text-gray-800 text-lg">
                      {selectedPark.specialFeature}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Lodges Preview */}
              {selectedPark.lodges && selectedPark.lodges.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      Available Lodges in {selectedPark.name}
                    </h3>
                    <div className="w-8 h-1 bg-amber-500 rounded-full"></div>
                  </div>
                  <div className="space-y-6">
                    {selectedPark.lodges.slice(0, 2).map((lodge, index) => (
                      <div
                        key={index}
                        className={`border rounded-2xl p-6 bg-gradient-to-r from-white to-amber-50 hover:from-amber-50 hover:to-white transition-all duration-300 hover:shadow-lg ${
                          selectedLodge?.name === lodge.name
                            ? "border-green-500 border-2"
                            : "border-amber-200"
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <img
                            src={lodge.image}
                            alt={lodge.name}
                            className="w-32 h-32 object-cover rounded-xl shadow-md"
                            onError={(e) =>
                              handleImageError(e, lodge.fallbackImage)
                            }
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-xl font-bold text-gray-900">
                                {lodge.name}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  selectedLodge?.name === lodge.name
                                    ? "bg-green-100 text-green-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {selectedLodge?.name === lodge.name
                                  ? "Selected"
                                  : "Premium"}
                              </span>
                            </div>
                            <p className="text-gray-700">
                              {lodge.description.substring(0, 120)}...
                            </p>
                            {selectedLodge?.name === lodge.name && (
                              <button
                                onClick={() =>
                                  handleExplorePark(selectedPark.path)
                                }
                                className="mt-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-lg font-medium"
                              >
                                Explore Park with this Lodge →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedPark.lodges.length > 2 && (
                      <div className="text-center">
                        <p className="text-amber-700 font-bold text-lg">
                          + {selectedPark.lodges.length - 2} more premium lodges
                          available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={closeParkModal}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
                >
                  Back to Parks
                </button>
                <button
                  onClick={() => {
                    if (selectedLodge) {
                      handleExplorePark(selectedPark.path);
                    } else {
                      setShowLodgeModal(true);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
                >
                  {selectedLodge
                    ? "Explore Park with Selected Lodge"
                    : "Select a Lodge First"}
                </button>
                <button
                  onClick={() => handleExplorePark(selectedPark.path)}
                  className="flex-1 bg-gradient-to-r from-amber-800 to-black hover:from-black hover:to-amber-900 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl"
                >
                  Explore Park Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && selectedLodgeGallery.length > 0 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] backdrop-blur-md">
          <div className="relative max-w-7xl w-full max-h-[90vh]">
            <button
              onClick={closeGalleryModal}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 z-10 backdrop-blur-sm"
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

            <div className="relative h-[80vh]">
              <img
                src={selectedLodgeGallery[currentGalleryIndex]}
                alt={`${selectedGalleryLodgeName} gallery ${
                  currentGalleryIndex + 1
                }`}
                className="w-full h-full object-contain rounded-lg"
              />

              {selectedLodgeGallery.length > 1 && (
                <>
                  <button
                    onClick={prevGalleryImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 backdrop-blur-sm"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextGalleryImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 backdrop-blur-sm"
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 text-white text-center">
              <h3 className="text-xl font-bold mb-2">
                {selectedGalleryLodgeName}
              </h3>
              <p className="text-gray-300">
                Image {currentGalleryIndex + 1} of {selectedLodgeGallery.length}
              </p>

              {selectedLodgeGallery.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {selectedLodgeGallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentGalleryIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentGalleryIndex
                          ? "bg-white"
                          : "bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8 font-serif leading-tight">
              Begin Your Unforgettable Safari Adventure
            </h2>
            <p className="text-xl mb-12 leading-relaxed opacity-95">
              Contact us to book your perfect Kenyan safari experience. We'll
              create a custom itinerary tailored to your preferences, schedule,
              and wildlife interests.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="mailto:tembo4401@gmail.com"
                className="group bg-white hover:bg-amber-50 text-amber-700 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:-translate-y-2 shadow-2xl hover:shadow-3xl flex items-center gap-4"
              >
                <svg
                  className="w-8 h-8 group-hover:animate-bounce"
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
                Contact Us via Email
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group border-2 border-white/30 hover:border-white text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-sm hover:backdrop-blur"
              >
                <span className="flex items-center gap-3">
                  Explore More
                  <svg
                    className="w-6 h-6 group-hover:translate-y-1 transition-transform"
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
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
