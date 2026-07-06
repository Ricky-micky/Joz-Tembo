import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// ✅ Backend API base URL – update this to point to your live backend
const API_BASE_URL = "https://joz-tours-backend-2026.onrender.com/api";

const Maasaimara = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDays, setSelectedDays] = useState(3);
  const [selectedLodge, setSelectedLodge] = useState(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelers: 2,
    message: "",
    startDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // State for attraction modal
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [showAttractionModal, setShowAttractionModal] = useState(false);

  // State for expanded cards - each card independently
  const [expandedCards, setExpandedCards] = useState({});

  // State for showing all packages (dropdown functionality)
  const [showAllPackages, setShowAllPackages] = useState(false);

  // State for filtered packages (only those starting with Maasai Mara)
  const [filteredSafariRoutes, setFilteredSafariRoutes] = useState([]);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Backend loading state
  const [backendLoading, setBackendLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    packageCount: 0,
  });

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedRouteForPricing, setSelectedRouteForPricing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const [adminForm, setAdminForm] = useState({
    routeName: "",
    description: "",
    duration: "5-7 days recommended",
    highlights: "",
    itinerary: "",
    priceOptions: [
      { people: 2, price: 359, currency: "euro" },
      { people: 3, price: 290, currency: "euro" },
      { people: 4, price: 150, currency: "euro" },
      { people: 5, price: 140, currency: "euro" },
      { people: 6, price: 130, currency: "euro" },
      { people: 7, price: 120, currency: "euro" },
      { people: 8, price: 110, currency: "euro" },
    ],
  });

  // ============ PACKAGES WITH LOCALSTORAGE PERSISTENCE ============
  const [safariRoutes, setSafariRoutes] = useState(() => {
    const savedPackages = localStorage.getItem("maasaiMaraPackages");
    if (savedPackages) {
      try {
        return JSON.parse(savedPackages);
      } catch (error) {
        console.error("Error loading saved packages:", error);
      }
    }
    // Default packages
    return [
      {
        id: 1,
        name: "Maasai Mara → 3-Day Great Migration Safari",
        description:
          "Experience the spectacular Great Migration with river crossings and big cat sightings.",
        duration: "3-5 days recommended",
        highlights: ["Great Migration", "River Crossings", "Big Cats"],
        fullItinerary:
          "Day 1: Arrival and afternoon game drive. Day 2: Full day exploring the Mara plains. Day 3: Sunrise game drive and departure.",
        priceOptions: [
          { people: 2, price: 359, currency: "euro" },
          { people: 4, price: 150, currency: "euro" },
          { people: 6, price: 130, currency: "euro" },
          { people: 8, price: 110, currency: "euro" },
        ],
        priceRange: { min: 110, max: 359 },
      },
      {
        id: 2,
        name: "Maasai Mara → 5-Day Ultimate Wildlife Safari",
        description:
          "Extended safari with premium wildlife viewing, hot air balloon rides, and cultural experiences.",
        duration: "5-7 days recommended",
        highlights: ["Balloon Safari", "Maasai Culture", "Photography"],
        fullItinerary:
          "Day 1: Arrival and sunset views. Day 2-4: Game drives exploring different ecosystems. Day 5: Hot air balloon safari and departure.",
        priceOptions: [
          { people: 2, price: 580, currency: "euro" },
          { people: 4, price: 420, currency: "euro" },
          { people: 6, price: 320, currency: "euro" },
          { people: 8, price: 260, currency: "euro" },
        ],
        priceRange: { min: 260, max: 580 },
      },
    ];
  });

  // Save to localStorage whenever packages change
  useEffect(() => {
    localStorage.setItem("maasaiMaraPackages", JSON.stringify(safariRoutes));
  }, [safariRoutes]);

  // Helper function to check if package starts with Maasai Mara
  const startsWithMaasaiMara = (packageName) => {
    if (!packageName) return false;
    const trimmedLower = packageName.toLowerCase().trim();
    return trimmedLower.startsWith("maasai mara");
  };

  // Check authentication on mount and listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("user");
      if (token && user) {
        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(user));
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Listen for auth changes from footer
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Filter packages to only show those starting with "Maasai Mara"
  useEffect(() => {
    const filtered = safariRoutes.filter((route) =>
      startsWithMaasaiMara(route.name),
    );
    setFilteredSafariRoutes(filtered);
    setShowAllPackages(false);
  }, [safariRoutes]);

  // Check for existing lodge selection from localStorage (only for booking data)
  useEffect(() => {
    const checkExistingSelection = () => {
      try {
        const bookingData = localStorage.getItem("maasaiMaraBooking");
        if (bookingData) {
          const parsedData = JSON.parse(bookingData);
          if (
            parsedData.park &&
            parsedData.park.name === "Maasai Mara National Reserve" &&
            parsedData.lodge
          ) {
            setSelectedLodge(parsedData.lodge);
          }
        }
      } catch (error) {
        console.error("Error loading lodge selection:", error);
      }
    };

    checkExistingSelection();
  }, []);

  const parkInfo = {
    id: 4,
    name: "Maasai Mara National Reserve",
    image: "/assets/parks/maasai-mara.jpg",
    fallbackImage: "/assets/maasaimara-page.jpg",
    description:
      "Home to the Great Migration and abundant big cat populations, offering Africa's most spectacular wildlife spectacle.",
    highlights: [
      "The Great Wildebeest Migration",
      "Big Five sightings",
      "Maasai cultural experiences",
      "Hot air balloon safaris",
      "River crossings at Mara River",
    ],
    bestTime: "July to October for Migration, Year-round for wildlife",
    wildlife:
      "Lions, Cheetahs, Leopards, Elephants, Rhinos, Buffaloes, Wildebeest, Zebras",
    size: "1,510 km² - World's most famous wildlife reserve",
    specialFeature: "Annual Great Migration of over 1.5 million wildebeest",
  };

  const maasaiMaraLodges = [
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
      priceRange: "$$$$",
      features: ["River View", "Luxury Tents", "Personalized Service"],
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
      priceRange: "$$$",
      features: ["Family Friendly", "Great Location", "Swimming Pool"],
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
      priceRange: "$$$$",
      features: ["Panoramic Views", "Award Winning", "Luxury Accommodation"],
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
      priceRange: "$$$$$",
      features: ["Boutique Luxury", "French Elegance", "Exceptional Service"],
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
      priceRange: "$$",
      features: ["African Style", "Comfortable", "Great Value"],
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
      priceRange: "$$$$",
      features: ["Premium Tents", "Swimming Pool", "Fine Dining"],
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
      priceRange: "$$",
      features: ["Eco Friendly", "Maasai Culture", "Authentic Experience"],
    },
  ];

  const galleryImages = [
    {
      id: 1,
      src: "/assets/wildbeast-maraa.jpg",
      fallback: "/assets/wildbeast-maraa2.jpg",
      title: "Great Wildebeest Migration",
      description: "Over 1.5 million wildebeest crossing the Mara River",
      category: "wildlife",
    },
    {
      id: 2,
      src: "/assets/lionpride-mara.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Lion Pride",
      description: "Maasai Mara has one of Africa's highest lion densities",
      category: "wildlife",
    },
    {
      id: 3,
      src: "/assets/hot-air-ballooning-maara.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Hot Air Balloon Safari",
      description: "Spectacular sunrise views over the savannah",
      category: "activities",
    },
    {
      id: 4,
      src: "/assets/maasai-tribe-mara.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Maasai Village Visit",
      description: "Experience traditional Maasai culture and traditions",
      category: "culture",
    },
    {
      id: 5,
      src: "/assets/cheetah-gallary-maara.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Cheetah Hunting",
      description: "Witness the world's fastest land animal in action",
      category: "wildlife",
    },
    {
      id: 6,
      src: "/assets/maara-river.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Mara River",
      description: "Famous for dramatic wildebeest river crossings",
      category: "landscape",
    },
    {
      id: 7,
      src: "/assets/leopard-mara-accasia.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Leopard in Acacia Tree",
      description: "Spot leopards resting in tree branches",
      category: "wildlife",
    },
    {
      id: 8,
      src: "/assets/sunset-maara.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "African Sunset",
      description: "Breathtaking sunsets over the Mara plains",
      category: "landscape",
    },
    {
      id: 9,
      src: "/assets/elephants-maara.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Elephant Herd",
      description: "Large herds of African elephants roaming freely",
      category: "wildlife",
    },
    {
      id: 10,
      src: "/assets/Nile-crocodile.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Nile Crocodiles",
      description: "Giant crocodiles waiting at river crossings",
      category: "wildlife",
    },
    {
      id: 11,
      src: "/assets/rhino-maara.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Black Rhino",
      description: "Rare sightings of endangered black rhinos",
      category: "wildlife",
    },
    {
      id: 12,
      src: "/assets/maasai-worio.jpg",
      fallback: "/assets/mara-gallery/default-gallery.jpg",
      title: "Maasai Warriors Dance",
      description: "Traditional jumping dance (Adumu) performances",
      category: "culture",
    },
  ];

  const attractions = [
    {
      id: 1,
      name: "Mara River Crossings",
      image: "/assets/wildebeest-migration-maara.jpg",
      fallback: "/assets/mara-attractions/default-attraction.jpg",
      description:
        "Witness the most dramatic event of the Great Migration where thousands of wildebeest and zebras cross the crocodile-infested Mara River.",
      bestTime: "July to October",
      highlight: "Nature's greatest spectacle",
      details:
        "The Mara River crossings are the highlight of the Great Migration. Watch as herds of wildebeest gather at the riverbanks, hesitating before plunging into the water. Crocodiles lie in wait, creating dramatic scenes of survival.",
    },
    {
      id: 2,
      name: "Maasai Cultural Village",
      image: "/assets/tribe-maara2.png",
      fallback: "/assets/mara-attractions/default-attraction.jpg",
      description:
        "Visit authentic Maasai manyattas and learn about their rich traditions, jumping dances, and ancient way of life.",
      bestTime: "Year-round",
      highlight: "Cultural immersion",
      details:
        "Experience the vibrant culture of the Maasai people, known for their distinctive red shukas and intricate beadwork. Participate in the traditional jumping dance (Adumu).",
    },
    {
      id: 3,
      name: "Hot Air Balloon Safari",
      image: "/assets/Hor-baloon.png",
      fallback: "/assets/mara-attractions/default-attraction.jpg",
      description:
        "Sunrise balloon ride offering breathtaking aerial views of the savannah, wildlife herds, and the endless plains.",
      bestTime: "Year-round (weather permitting)",
      highlight: "Aerial views of wildlife",
      details:
        "Float silently above the savannah as the sun rises over the Mara, painting the sky in brilliant oranges and golds.",
    },
    {
      id: 4,
      name: "Oloololo Escarpment",
      image: "/assets/Oloololo Escarpment.png",
      fallback: "/assets/mara-attractions/default-attraction.jpg",
      description:
        "Spectacular viewpoints offering panoramic vistas over the entire Maasai Mara ecosystem.",
      bestTime: "Year-round",
      highlight: "Panoramic vistas",
      details:
        "Also known as the Siria Escarpment, this dramatic geological feature offers the most breathtaking views of the Maasai Mara.",
    },
    {
      id: 5,
      name: "Mara Triangle",
      image: "/assets/Mara Triangle .png",
      fallback: "/assets/mara-attractions/default-attraction.jpg",
      description:
        "Less crowded area of the reserve with excellent wildlife viewing, managed for sustainable tourism.",
      bestTime: "July to October",
      highlight: "Premium game viewing",
      details:
        "The Mara Triangle is known for its exceptional wildlife density and fewer vehicles. Offers some of the best lion and cheetah sightings.",
    },
    {
      id: 6,
      name: "Sand River",
      image: "/assets/sand river.png",
      fallback: "/assets/mara-attractions/default-attraction.jpg",
      description:
        "Seasonal river known for excellent predator sightings, including lions, leopards, and cheetahs.",
      bestTime: "Year-round",
      highlight: "Lion and leopard territory",
      details:
        "The Sand River area is renowned for its resident lion prides and frequent leopard sightings.",
    },
  ];

  const [collapsedSections, setCollapsedSections] = useState({
    parkInfo: false,
    gallery: false,
    attractions: false,
    packages: false,
    migration: false,
  });

  const toggleSection = (section) =>
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  const toggleCardExpand = (cardId) =>
    setExpandedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));

  // ============ ADMIN CRUD FUNCTIONS ============
  const handleEditPackage = (route) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Access Denied",
        text: "Only administrators can edit packages.",
        icon: "error",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }
    setEditingRoute(route);
    setAdminForm({
      routeName: route.name
        .replace("Maasai Mara → ", "")
        .replace("Maasai Mara ", "")
        .trim(),
      description: route.description,
      duration: route.duration,
      highlights: route.highlights.join(", "),
      itinerary: route.fullItinerary || "",
      priceOptions: [...route.priceOptions],
    });
    setShowEditModal(true);
  };

  const handleUpdatePackage = (e) => {
    e.preventDefault();
    const routeName = adminForm.routeName
      .toLowerCase()
      .startsWith("maasai mara")
      ? adminForm.routeName
      : `Maasai Mara → ${adminForm.routeName}`;
    if (!startsWithMaasaiMara(routeName)) {
      Swal.fire({
        title: "Invalid Package Name",
        text: "Must start with 'Maasai Mara'.",
        icon: "error",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }
    const prices = adminForm.priceOptions.map((o) => o.price);
    const highlightsArray = adminForm.highlights
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);
    setSafariRoutes((prev) =>
      prev.map((route) =>
        route.id === editingRoute.id
          ? {
              ...route,
              name: routeName,
              description: adminForm.description,
              duration: adminForm.duration,
              highlights: highlightsArray,
              fullItinerary: adminForm.itinerary,
              priceOptions: [...adminForm.priceOptions],
              priceRange: {
                min: Math.min(...prices),
                max: Math.max(...prices),
              },
            }
          : route,
      ),
    );
    Swal.fire({
      title: "✅ Package Updated!",
      html: `<p><strong>${routeName}</strong> updated successfully.</p>`,
      icon: "success",
      confirmButtonColor: "#2D6A4F",
    });
    setShowEditModal(false);
    setEditingRoute(null);
  };

  const handleAdminFormChange = (e) =>
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });

  const handlePriceOptionChange = (index, field, value) => {
    const updated = [...adminForm.priceOptions];
    updated[index] = {
      ...updated[index],
      [field]:
        field === "people" || field === "price" ? parseInt(value) || 0 : value,
    };
    setAdminForm({ ...adminForm, priceOptions: updated });
  };

  const addPriceOption = () => {
    if (adminForm.priceOptions.length >= 7) {
      Swal.fire({
        title: "Maximum Reached",
        text: "Max 7 price options.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }
    const existing = adminForm.priceOptions.map((o) => o.people);
    let next = 2;
    while (existing.includes(next) && next <= 8) next++;
    if (next > 8) {
      Swal.fire({
        title: "Maximum Reached",
        text: "Max 8 people.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }
    setAdminForm({
      ...adminForm,
      priceOptions: [
        ...adminForm.priceOptions,
        { people: next, price: 300, currency: "euro" },
      ],
    });
  };

  const removePriceOption = (index) => {
    if (adminForm.priceOptions.length <= 2) {
      Swal.fire({
        title: "Minimum Required",
        text: "Need at least 2 options.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }
    setAdminForm({
      ...adminForm,
      priceOptions: adminForm.priceOptions.filter((_, i) => i !== index),
    });
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const routeName = adminForm.routeName
      .toLowerCase()
      .startsWith("maasai mara")
      ? adminForm.routeName
      : `Maasai Mara → ${adminForm.routeName}`;
    if (!startsWithMaasaiMara(routeName)) {
      Swal.fire({
        title: "Invalid",
        text: "Must start with 'Maasai Mara'.",
        icon: "error",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }
    const prices = adminForm.priceOptions.map((o) => o.price);
    const highlightsArray = adminForm.highlights
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);
    const newRoute = {
      id: Date.now(),
      name: routeName,
      description: adminForm.description,
      duration: adminForm.duration,
      highlights: highlightsArray,
      fullItinerary: adminForm.itinerary,
      priceOptions: [...adminForm.priceOptions],
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    };
    setSafariRoutes((prev) => [...prev, newRoute]);
    Swal.fire({
      title: "✅ Package Created!",
      html: `<p><strong>${newRoute.name}</strong> created with prices €${Math.min(...prices)} - €${Math.max(...prices)}.</p>`,
      icon: "success",
      confirmButtonColor: "#2D6A4F",
    });
    setAdminForm({
      routeName: "",
      description: "",
      duration: "5-7 days recommended",
      highlights: "",
      itinerary: "",
      priceOptions: [
        { people: 2, price: 359, currency: "euro" },
        { people: 3, price: 290, currency: "euro" },
        { people: 4, price: 150, currency: "euro" },
        { people: 5, price: 140, currency: "euro" },
        { people: 6, price: 130, currency: "euro" },
        { people: 7, price: 120, currency: "euro" },
        { people: 8, price: 110, currency: "euro" },
      ],
    });
    setShowAdminForm(false);
  };

  const handleDeletePackage = (routeId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Access Denied",
        text: "Only admins can delete.",
        icon: "error",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }
    Swal.fire({
      title: "Delete Package?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2D6A4F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        setSafariRoutes((prev) => prev.filter((route) => route.id !== routeId));
        if (selectedRoute?.id === routeId) setSelectedRoute(null);
        Swal.fire({
          title: "Deleted!",
          text: "Package removed.",
          icon: "success",
          confirmButtonColor: "#2D6A4F",
        });
      }
    });
  };

  // ============ BOOKING FUNCTIONS ============
  const handleRouteSelect = async (route) => {
    if (!selectedLodge) {
      const result = await Swal.fire({
        title: "Lodge Required",
        text: "Select accommodation first.",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#2D6A4F",
        confirmButtonText: "Choose Lodge",
        cancelButtonText: "Maybe Later",
      });
      if (result.isConfirmed) setShowLodgeModal(true);
      return;
    }
    setSelectedRouteForPricing(route);
    setShowPriceModal(true);
  };

  const handleFinalPriceSelect = (people) => {
    setSelectedRoute(selectedRouteForPricing);
    setBookingForm((prev) => ({ ...prev, travelers: people }));
    setShowPriceModal(false);
    setTimeout(() => setShowBookingModal(true), 300);
  };

  const handleLodgeSelection = (lodge) => {
    Swal.fire({
      title: "Selecting...",
      text: "Saving preference.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    setTimeout(() => {
      setSelectedLodge(lodge);
      localStorage.setItem(
        "maasaiMaraBooking",
        JSON.stringify({
          park: parkInfo,
          lodge,
          step: "lodge_selected",
          timestamp: new Date().toISOString(),
          page: "MaasaiMara",
        }),
      );
      Swal.fire({
        title: "Lodge Selected!",
        html: `<strong>${lodge.name}</strong> selected.`,
        icon: "success",
        confirmButtonColor: "#2D6A4F",
      });
      setShowLodgeModal(false);
    }, 1000);
  };

  const generateItinerary = (days) => {
    const itineraries = [];
    for (let i = 1; i <= days; i++) {
      if (i === 1)
        itineraries.push(
          `Day ${i}: Arrival at Maasai Mara, check-in at ${selectedLodge?.name || "lodge"} and afternoon game drive.`,
        );
      else if (i === days)
        itineraries.push(
          `Day ${i}: Sunrise game drive, breakfast, and departure.`,
        );
      else
        itineraries.push(
          `Day ${i}: Full day exploring Maasai Mara's plains and river crossings. ${selectedLodge ? `Overnight at ${selectedLodge.name}.` : ""}`,
        );
    }
    return itineraries;
  };

  const calculatePrice = (travelers, route) => {
    if (!route?.priceOptions) return 0;
    const exact = route.priceOptions.find((o) => o.people === travelers);
    if (exact) return exact.price;
    const sorted = [...route.priceOptions].sort((a, b) => a.people - b.people);
    const higher = sorted.find((o) => o.people >= travelers);
    return higher ? higher.price : sorted[sorted.length - 1].price;
  };

  const validateBookingReadiness = () => {
    if (!selectedLodge) {
      Swal.fire({
        title: "Accommodation Required",
        text: "Select a lodge first.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return false;
    }
    if (!selectedRoute) {
      Swal.fire({
        title: "Safari Route Required",
        text: "Select a package.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return false;
    }
    return true;
  };

  const handleFormChange = (e) =>
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  const handleImageError = (e, fallback) => {
    e.target.onerror = null;
    e.target.src = fallback;
  };
  const openGalleryModal = (index) => {
    setActiveGalleryImage(index);
    setShowGalleryModal(true);
  };
  const nextGalleryImage = () =>
    setActiveGalleryImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  const prevGalleryImage = () =>
    setActiveGalleryImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );

  // Backend booking API
  const sendBookingToBackend = async (bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        Swal.fire({
          title: "✅ Booking Sent!",
          text: "Check your email for confirmation.",
          icon: "success",
          confirmButtonColor: "#2D6A4F",
        });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Fallback email
  const sendDirectEmail = (bookingData) => {
    const body = `MAASAI MARA SAFARI BOOKING:\n\n📍 ${bookingData.park}\n🏨 ${bookingData.lodge}\n🚗 ${bookingData.route}\n📅 ${bookingData.days} days\n👥 ${bookingData.travelers} pax\n💰 €${bookingData.totalPrice}\n\n👤 ${bookingData.fullName}\n📧 ${bookingData.email}\n📞 ${bookingData.phone}\n📅 Start: ${bookingData.startDate || "Flexible"}\n\n💬 ${bookingData.message || "None"}`;
    window.open(
      `mailto:tembo4401@gmail.com?subject=Maasai Mara Booking: ${bookingData.route} - ${bookingData.fullName}&body=${encodeURIComponent(body)}`,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateBookingReadiness()) return;
    setIsLoading(true);
    Swal.fire({
      title: "Processing...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    setTimeout(async () => {
      const totalPrice = calculatePrice(bookingForm.travelers, selectedRoute);
      const itinerary = generateItinerary(selectedDays);
      const bookingData = {
        park: parkInfo.name,
        lodge: selectedLodge.name,
        days: selectedDays,
        travelers: bookingForm.travelers,
        totalPrice,
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        startDate: bookingForm.startDate || "Flexible",
        message: bookingForm.message || "",
        parkHighlights: parkInfo.highlights.join(", "),
        bestTime: parkInfo.bestTime,
        wildlife: parkInfo.wildlife,
        specialFeature: parkInfo.specialFeature,
        lodgeDescription: selectedLodge.description,
        itinerary: itinerary.join("\n"),
        bookingSource: "Maasai Mara Park Page",
        route: selectedRoute.name,
        lodgeFeatures: selectedLodge.features?.join(", ") || "",
      };

      // Try backend first, fallback to email
      const result = await sendBookingToBackend(bookingData);
      if (!result.success) sendDirectEmail({ ...bookingData, itinerary });

      setShowBookingModal(false);
      setBookingForm({
        fullName: "",
        email: "",
        phone: "",
        travelers: 2,
        message: "",
        startDate: "",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleClearLodgeSelection = () => {
    Swal.fire({
      title: "Change Lodge?",
      text: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2D6A4F",
      confirmButtonText: "Yes, Change",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedLodge(null);
        localStorage.removeItem("maasaiMaraBooking");
      }
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowItineraryModal(false);
      setShowBookingModal(false);
      setShowGalleryModal(false);
      setShowLodgeModal(false);
      setShowPriceModal(false);
      setShowAdminForm(false);
      setShowEditModal(false);
      setShowAttractionModal(false);
    }
  };

  const SectionHeader = ({ title, section, children }) => (
    <div className="mb-6">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex justify-between items-center group"
      >
        <h2 className="text-3xl font-bold text-gray-800 font-serif">{title}</h2>
        <div
          className={`transform transition-transform duration-300 ${collapsedSections[section] ? "rotate-180" : ""}`}
        >
          <svg
            className="w-8 h-8 text-green-700 group-hover:text-green-600"
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
        </div>
      </button>
      <div
        className={`collapsible-content ${collapsedSections[section] ? "" : "open"}`}
      >
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0E8] to-[#E8E0D5] overflow-x-hidden">
      {/* Hero */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={parkInfo.image}
          alt={parkInfo.name}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, parkInfo.fallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2B1F]/80 to-[#5C3A21]/60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              {parkInfo.name}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl">
              {parkInfo.description}
            </p>
            {selectedLodge && (
              <div className="mt-4 inline-flex flex-wrap items-center bg-[#2D6A4F]/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg gap-2">
                <span className="font-semibold">
                  Lodge: {selectedLodge.name}
                </span>
                <button
                  onClick={handleClearLodgeSelection}
                  className="text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Park Info */}
        <div className="mb-16">
          <SectionHeader title="Discover Maasai Mara" section="parkInfo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-700 text-lg mb-6">
                  The Maasai Mara National Reserve is Kenya's most famous
                  wildlife sanctuary. Famous for the annual Great Migration,
                  where over 1.5 million wildebeest, zebras, and antelopes cross
                  from the Serengeti, the Mara offers unparalleled game viewing.
                  The reserve is also home to the Maasai people, known for their
                  distinctive red dress and rich cultural heritage.
                </p>
                <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-[#2D6A4F]/20">
                  <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
                    <h3 className="text-xl font-bold">
                      Your Maasai Mara Accommodation
                    </h3>
                    {!selectedLodge ? (
                      <button
                        onClick={() => setShowLodgeModal(true)}
                        className="bg-[#5C3A21] hover:bg-[#4A2E1A] text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Choose Lodge
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowLodgeModal(true)}
                          className="bg-[#8B6914] text-white px-4 py-2 rounded-lg"
                        >
                          View Details
                        </button>
                        <button
                          onClick={handleClearLodgeSelection}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedLodge ? (
                    <div className="flex items-center gap-4 p-4 bg-[#2D6A4F]/10 rounded-lg">
                      <img
                        src={selectedLodge.image}
                        alt={selectedLodge.name}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-bold text-lg">
                          {selectedLodge.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {selectedLodge.description?.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-amber-50 rounded-lg">
                      <p className="text-gray-700">No lodge selected yet</p>
                      <p className="text-gray-600 text-sm">
                        Choose from 7 premium lodges
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Park Highlights
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {parkInfo.highlights.map((h, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-[#2D6A4F] rounded-full mr-3"></span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#2D6A4F]/20">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Why Choose Maasai Mara?
                </h3>
                <div className="space-y-4">
                  {[
                    "The Great Migration",
                    "Big Cat Capital",
                    "Cultural Experience",
                    "Balloon Safaris",
                  ].map((title, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="bg-[#2D6A4F]/20 p-3 rounded-lg">
                        <span className="text-[#2D6A4F] font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-gray-600 text-sm">
                          {
                            [
                              "One of nature's greatest spectacles",
                              "Highest density of big cats in Africa",
                              "Visit Maasai communities",
                              "Spectacular sunrise rides",
                            ][i]
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionHeader>
        </div>

        {/* Lodge Step */}
        {!selectedLodge && (
          <div className="mb-8 bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    Step 1: Select Your Lodge
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowLodgeModal(true)}
                className="bg-white text-[#5C3A21] px-4 py-2 rounded-lg font-semibold"
              >
                Browse Lodges
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        <div className="mb-16">
          <SectionHeader title="Maasai Mara Gallery" section="gallery">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {galleryImages.slice(0, 8).map((img, i) => (
                <div
                  key={img.id}
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
                  onClick={() => openGalleryModal(i)}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => handleImageError(e, img.fallback)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-3 text-white">
                      <h4 className="font-semibold text-sm">{img.title}</h4>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-[#2D6A4F] text-white text-xs px-2 py-1 rounded-full">
                      {img.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => openGalleryModal(0)}
                className="bg-[#5C3A21] hover:bg-[#4A2E1A] text-white px-6 py-3 rounded-lg font-semibold"
              >
                View Full Gallery ({galleryImages.length} images)
              </button>
            </div>
          </SectionHeader>
        </div>

        {/* Attractions */}
        <div className="mb-16">
          <SectionHeader title="Top Attractions" section="attractions">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {attractions.map((attr) => (
                <div
                  key={attr.id}
                  onClick={() => {
                    setSelectedAttraction(attr);
                    setShowAttractionModal(true);
                  }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-[#2D6A4F]/20">
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={attr.image}
                        alt={attr.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center">
                        <span className="text-white text-sm font-semibold p-3">
                          Click to view details
                        </span>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-[#2D6A4F]">
                        {attr.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionHeader>
        </div>

        {/* Safari Packages */}
        <div className="mb-16">
          <SectionHeader title="Maasai Mara Safari Packages" section="packages">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">
                  {selectedLodge
                    ? `Packages with ${selectedLodge.name}`
                    : "Select a lodge first"}
                </p>
                <p className="text-sm text-[#2D6A4F] mt-1">
                  📍 {filteredSafariRoutes.length} Maasai Mara packages
                </p>
              </div>
              <div className="flex gap-2">
                {isAuthenticated && (
                  <button
                    onClick={() => setShowAdminForm(true)}
                    className="bg-[#8B6914] hover:bg-[#6B4F10] text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    + Add New Package
                  </button>
                )}
              </div>
            </div>
            {!selectedLodge ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3">
                  Lodge Selection Required
                </h3>
                <button
                  onClick={() => setShowLodgeModal(true)}
                  className="bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Select Your Lodge Now
                </button>
              </div>
            ) : filteredSafariRoutes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-2">
                  No Packages Available
                </h3>
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowAdminForm(true)}
                    className="bg-[#5C3A21] text-white px-6 py-3 rounded-lg"
                  >
                    Create Package
                  </button>
                ) : (
                  <p className="text-gray-600">
                    Sign in as admin to add packages.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {(showAllPackages
                    ? filteredSafariRoutes
                    : filteredSafariRoutes.slice(0, 6)
                  ).map((route) => {
                    const isExpanded = expandedCards[route.id] || false;
                    const displayDesc =
                      isExpanded ||
                      !route.description ||
                      route.description.length <= 100
                        ? route.description
                        : route.description.substring(0, 100) + "...";
                    return (
                      <div
                        key={route.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-[#2D6A4F]/20 relative group"
                      >
                        <div className="absolute top-2 right-2">
                          <span className="bg-[#5C3A21] text-white text-xs px-2 py-1 rounded-full">
                            🦁 Maasai Mara
                          </span>
                        </div>
                        {isAuthenticated && (
                          <div className="absolute top-12 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditPackage(route)}
                              className="bg-[#8B6914] hover:bg-[#6B4F10] text-white p-2 rounded-full"
                              title="Edit"
                            >
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeletePackage(route.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                              title="Delete"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        <div className="h-24 md:h-32 bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] flex items-center justify-center">
                          <div className="text-white text-center">
                            <h3 className="text-xs md:text-sm font-bold">
                              {route.name.split("→")[0].trim()}
                            </h3>
                            <p className="text-xs text-amber-100">
                              Starting Point
                            </p>
                          </div>
                        </div>
                        <div className="p-2 md:p-3">
                          <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 truncate">
                            {route.name}
                          </h3>
                          <p className="text-gray-600 text-xs mb-2">
                            {displayDesc}
                          </p>
                          {route.description?.length > 100 && (
                            <button
                              onClick={() => toggleCardExpand(route.id)}
                              className="text-[#2D6A4F] text-xs font-semibold"
                            >
                              {isExpanded ? "Show Less" : "Show More"}
                            </button>
                          )}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {route.highlights?.slice(0, 2).map((h, i) => (
                              <span
                                key={i}
                                className="bg-[#2D6A4F]/20 text-[#2D6A4F] text-xs px-1 py-0.5 rounded"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-[#2D6A4F] font-bold text-xs">
                              €{route.priceRange.min} - €{route.priceRange.max}
                            </div>
                            <span className="text-xs text-gray-500">
                              {route.duration}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRouteSelect(route)}
                            className="w-full bg-[#5C3A21] hover:bg-[#4A2E1A] text-white py-1.5 px-2 rounded-lg font-semibold text-xs transition-all"
                          >
                            Select Package
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredSafariRoutes.length > 6 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowAllPackages(!showAllPackages)}
                      className="bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      {showAllPackages
                        ? "Show Less"
                        : `Show More (${filteredSafariRoutes.length - 6} more)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </SectionHeader>
        </div>

        {/* Migration Info */}
        <div className="mb-16">
          <SectionHeader title="The Great Migration" section="migration">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-[#2D6A4F]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Nature's Greatest Spectacle
                  </h3>
                  <p className="text-gray-700 mb-4">
                    The Great Migration is a continuous, clockwise movement of
                    over 1.5 million wildebeest, 200,000 zebras, and 300,000
                    Thomson's gazelles across the Serengeti-Mara ecosystem.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#2D6A4F] rounded-full mr-3"></span>
                      <strong>July-October:</strong> Migration in Maasai Mara
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#2D6A4F] rounded-full mr-3"></span>
                      <strong>River Crossings:</strong> Most dramatic at Mara
                      River
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#2D6A4F] rounded-full mr-3"></span>
                      <strong>Predator Action:</strong> Lions and crocodiles
                      follow the herds
                    </li>
                  </ul>
                </div>
                <div className="bg-[#2D6A4F]/10 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Migration Calendar</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Jan-Feb:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Calving Season
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jun-Jul:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Mara River Crossing
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aug-Oct:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Peak in Maasai Mara
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nov-Dec:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Return to Serengeti
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionHeader>
        </div>

        {/* Plan Your Adventure */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif mb-6">
            Plan Your Maasai Mara Adventure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                step: 1,
                title: "Choose Your Lodge",
                desc: "Select from 7 premium lodges",
              },
              {
                step: 2,
                title: "Select Safari Package",
                desc: "Choose a safari route",
              },
              { step: 3, title: "Book & Confirm", desc: "Secure your spot" },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#2D6A4F]/20 hover:shadow-xl transition-all group"
              >
                <div className="relative p-4 md:p-6">
                  <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#5C3A21] to-[#3D2B1F] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl md:text-3xl">
                      {s.step}
                    </span>
                  </div>
                  <div className="pl-8 md:pl-10 pt-2">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                      {s.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* Attraction Modal */}
      {showAttractionModal && selectedAttraction && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
              <img
                src={selectedAttraction.image}
                alt={selectedAttraction.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowAttractionModal(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {selectedAttraction.name}
                </h2>
                <div className="flex gap-3 mt-2">
                  <span className="bg-[#2D6A4F]/80 text-white text-sm px-3 py-1 rounded-full">
                    ⭐ {selectedAttraction.highlight}
                  </span>
                  <span className="bg-[#5C3A21]/80 text-white text-sm px-3 py-1 rounded-full">
                    📅 {selectedAttraction.bestTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700">
                {selectedAttraction.details || selectedAttraction.description}
              </p>
              <button
                onClick={() => setShowAttractionModal(false)}
                className="w-full bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] text-white py-3 rounded-xl font-semibold mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Modal */}
      {showPriceModal && selectedRouteForPricing && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              Select Travelers & Price
            </h2>
            <p className="text-gray-600 mb-6">{selectedRouteForPricing.name}</p>
            <div className="space-y-3 mb-6">
              {selectedRouteForPricing.priceOptions?.map((o) => (
                <button
                  key={o.people}
                  onClick={() => handleFinalPriceSelect(o.people)}
                  className="w-full flex justify-between items-center p-4 border rounded-lg hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5"
                >
                  <span className="font-semibold">{o.people} Travelers</span>
                  <span className="text-[#2D6A4F] font-bold text-xl">
                    €{o.price}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPriceModal(false)}
              className="w-full bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lodge Modal */}
      {showLodgeModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 flex justify-between items-center border-b">
              <h2 className="text-2xl font-bold">
                Select Your Maasai Mara Lodge
              </h2>
              <button
                onClick={() => setShowLodgeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {maasaiMaraLodges.map((lodge) => (
                <div
                  key={lodge.name}
                  className="border rounded-xl overflow-hidden hover:shadow-xl cursor-pointer"
                  onClick={() => handleLodgeSelection(lodge)}
                >
                  <img
                    src={lodge.image}
                    alt={lodge.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => handleImageError(e, lodge.fallbackImage)}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{lodge.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {lodge.description?.substring(0, 100)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {lodge.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-xs bg-[#2D6A4F]/20 text-[#2D6A4F] px-2 py-1 rounded"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#2D6A4F] font-bold">
                        {lodge.priceRange}
                      </span>
                      <button className="bg-[#5C3A21] text-white px-4 py-2 rounded-lg text-sm">
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 flex justify-between items-center border-b">
              <h2 className="text-2xl font-bold">Complete Your Booking</h2>
              <button onClick={() => setShowBookingModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingForm.fullName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingForm.startDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={bookingForm.message}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                ></textarea>
              </div>
              <div className="bg-[#2D6A4F]/10 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Booking Summary</h3>
                <p className="text-sm">
                  <strong>Lodge:</strong> {selectedLodge?.name}
                </p>
                <p className="text-sm">
                  <strong>Route:</strong> {selectedRoute?.name}
                </p>
                <p className="text-sm">
                  <strong>Travelers:</strong> {bookingForm.travelers} pax
                </p>
                <p className="text-sm">
                  <strong>Total:</strong> €
                  {calculatePrice(bookingForm.travelers, selectedRoute)}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white py-3 rounded-xl font-semibold"
                >
                  {isLoading ? "Processing..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-300 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="relative w-full max-w-5xl mx-4">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute -top-12 right-0 text-white"
            >
              ✕
            </button>
            <div className="relative">
              <img
                src={galleryImages[activeGalleryImage].src}
                alt={galleryImages[activeGalleryImage].title}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              <button
                onClick={prevGalleryImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                ←
              </button>
              <button
                onClick={nextGalleryImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                →
              </button>
            </div>
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold">
                {galleryImages[activeGalleryImage].title}
              </h3>
              <p className="text-gray-300">
                {galleryImages[activeGalleryImage].description}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {activeGalleryImage + 1} of {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Create Form Modal */}
      {showAdminForm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-6 flex justify-between items-center border-b">
              <h2 className="text-2xl font-bold">Create New Safari Package</h2>
              <button onClick={() => setShowAdminForm(false)}>✕</button>
            </div>
            <form onSubmit={handleAdminSubmit} className="p-6 space-y-6">
              <div>
                <label className="block font-semibold mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="routeName"
                  value={adminForm.routeName}
                  onChange={handleAdminFormChange}
                  placeholder="e.g., 3-Day Mara Safari Adventure"
                  className="w-full px-4 py-2 border rounded-lg focus:border-[#2D6A4F]"
                  required
                />
                <p className="text-xs text-[#2D6A4F] mt-1">
                  🦁 "Maasai Mara → " will be added automatically
                </p>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={adminForm.description}
                  onChange={handleAdminFormChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={adminForm.duration}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  name="highlights"
                  value={adminForm.highlights}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Itinerary</label>
                <textarea
                  name="itinerary"
                  value={adminForm.itinerary}
                  onChange={handleAdminFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Price Options
                </label>
                {adminForm.priceOptions.map((o, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="People"
                      value={o.people}
                      onChange={(e) =>
                        handlePriceOptionChange(i, "people", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Price (€)"
                      value={o.price}
                      onChange={(e) =>
                        handlePriceOptionChange(i, "price", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePriceOption(i)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPriceOption}
                  className="mt-2 bg-[#2D6A4F] text-white px-4 py-2 rounded-lg"
                >
                  + Add Price Option
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white py-3 rounded-xl font-semibold"
                >
                  Create Package
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminForm(false)}
                  className="flex-1 bg-gray-300 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditModal && editingRoute && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-6 flex justify-between items-center border-b">
              <h2 className="text-2xl font-bold">Edit Safari Package</h2>
              <button onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUpdatePackage} className="p-6 space-y-6">
              <div>
                <label className="block font-semibold mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="routeName"
                  value={adminForm.routeName}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={adminForm.description}
                  onChange={handleAdminFormChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={adminForm.duration}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Highlights</label>
                <input
                  type="text"
                  name="highlights"
                  value={adminForm.highlights}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Itinerary</label>
                <textarea
                  name="itinerary"
                  value={adminForm.itinerary}
                  onChange={handleAdminFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Price Options
                </label>
                {adminForm.priceOptions.map((o, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="People"
                      value={o.people}
                      onChange={(e) =>
                        handlePriceOptionChange(i, "people", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Price (€)"
                      value={o.price}
                      onChange={(e) =>
                        handlePriceOptionChange(i, "price", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePriceOption(i)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPriceOption}
                  className="mt-2 bg-[#2D6A4F] text-white px-4 py-2 rounded-lg"
                >
                  + Add Price Option
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white py-3 rounded-xl font-semibold"
                >
                  Update Package
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .collapsible-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease-out;
        }
        .collapsible-content.open {
          max-height: 5000px;
          transition: max-height 0.7s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Maasaimara;
