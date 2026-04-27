import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

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

  const toggleCardExpand = (cardId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    parkInfo: false,
    gallery: false,
    attractions: false,
    packages: false,
    migration: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  const defaultSafariRoutes = [
    {
      id: 1,
      name: "Maasai Mara → Lake Nakuru → Nairobi",
      description:
        "Classic safari combining the Mara's big cats with Lake Nakuru's flamingos and rhinos. This is a longer description to test the show more functionality on the card.",
      duration: "5-7 days recommended",
      highlights: ["Great Migration", "Big Cats", "Flamingo Lake"],
      fullItinerary:
        "Day 1: Arrival at Maasai Mara National Reserve, afternoon game drive. Day 2: Full day game drive in Maasai Mara searching for big cats. Day 3: Morning game drive then travel to Lake Nakuru. Day 4: Flamingo viewing and rhino tracking at Lake Nakuru. Day 5: Morning game drive then return to Nairobi.",
      priceOptions: [
        { people: 2, price: 359, currency: "euro" },
        { people: 3, price: 290, currency: "euro" },
        { people: 4, price: 150, currency: "euro" },
        { people: 5, price: 140, currency: "euro" },
        { people: 6, price: 130, currency: "euro" },
        { people: 7, price: 120, currency: "euro" },
        { people: 8, price: 110, currency: "euro" },
      ],
      priceRange: { min: 110, max: 359 },
    },
    {
      id: 2,
      name: "Maasai Mara Great Migration Special",
      description:
        "Focused experience during migration season with extended Mara stays for river crossings. Witness the greatest wildlife spectacle on earth.",
      duration: "4-6 days recommended",
      highlights: ["River Crossings", "Predator Action", "Migration Herds"],
      fullItinerary:
        "Day 1: Arrival at Mara River camp. Day 2: Full day at Mara River waiting for crossings. Day 3: Early morning game drive to witness predator action. Day 4: Migration herd tracking. Day 5: Maasai cultural visit. Day 6: Departure.",
      priceOptions: [
        { people: 2, price: 450, currency: "euro" },
        { people: 3, price: 380, currency: "euro" },
        { people: 4, price: 280, currency: "euro" },
        { people: 5, price: 220, currency: "euro" },
        { people: 6, price: 200, currency: "euro" },
        { people: 7, price: 180, currency: "euro" },
        { people: 8, price: 160, currency: "euro" },
      ],
      priceRange: { min: 160, max: 450 },
    },
    {
      id: 3,
      name: "Maasai Mara Luxury Safari",
      description:
        "Premium experience with luxury accommodations, hot air balloon rides, and private guides for an unforgettable adventure.",
      duration: "4-7 days recommended",
      highlights: ["Balloon Safari", "Luxury Lodges", "Private Guides"],
      fullItinerary:
        "Day 1: Luxury lodge check-in with spa treatment. Day 2: Hot air balloon safari at sunrise. Day 3-5: Private game drives with expert guides. Day 6: Bush dinner under the stars. Day 7: Relaxation and departure.",
      priceOptions: [
        { people: 2, price: 750, currency: "euro" },
        { people: 3, price: 650, currency: "euro" },
        { people: 4, price: 550, currency: "euro" },
        { people: 5, price: 500, currency: "euro" },
        { people: 6, price: 450, currency: "euro" },
        { people: 7, price: 420, currency: "euro" },
        { people: 8, price: 400, currency: "euro" },
      ],
      priceRange: { min: 400, max: 750 },
    },
    {
      id: 4,
      name: "Maasai Mara → Amboseli → Tsavo",
      description:
        "Extended safari adventure covering three of Kenya's most iconic parks. Experience the Mara's big cats, Amboseli's elephants with Kilimanjaro backdrop, and Tsavo's red elephants.",
      duration: "7-10 days recommended",
      highlights: ["Kilimanjaro Views", "Red Elephants", "Big Five"],
      fullItinerary:
        "Day 1-2: Maasai Mara game drives. Day 3-4: Travel to Amboseli for elephant viewing. Day 5-7: Tsavo East and West exploration. Day 8-9: Return journey with game drives. Day 10: Departure.",
      priceOptions: [
        { people: 2, price: 890, currency: "euro" },
        { people: 3, price: 750, currency: "euro" },
        { people: 4, price: 620, currency: "euro" },
        { people: 5, price: 550, currency: "euro" },
        { people: 6, price: 500, currency: "euro" },
        { people: 7, price: 460, currency: "euro" },
        { people: 8, price: 430, currency: "euro" },
      ],
      priceRange: { min: 430, max: 890 },
    },
    {
      id: 5,
      name: "Maasai Mara Budget Camping Safari",
      description:
        "Affordable camping safari perfect for backpackers and budget travelers. Experience the magic of the Mara without breaking the bank.",
      duration: "3-4 days recommended",
      highlights: ["Budget Friendly", "Camping Experience", "Great Wildlife"],
      fullItinerary:
        "Day 1: Arrival and camp setup, afternoon game drive. Day 2: Full day game drive with picnic lunch. Day 3: Morning game drive, then return to Nairobi.",
      priceOptions: [
        { people: 2, price: 180, currency: "euro" },
        { people: 3, price: 150, currency: "euro" },
        { people: 4, price: 120, currency: "euro" },
        { people: 5, price: 100, currency: "euro" },
        { people: 6, price: 90, currency: "euro" },
        { people: 7, price: 85, currency: "euro" },
        { people: 8, price: 80, currency: "euro" },
      ],
      priceRange: { min: 80, max: 180 },
    },
    {
      id: 6,
      name: "Maasai Mara Photography Safari",
      description:
        "Specialized safari for photography enthusiasts with expert guides, prime positioning, and extended game drives during golden hours.",
      duration: "5-7 days recommended",
      highlights: [
        "Expert Photography Guide",
        "Golden Hour Drives",
        "Private Vehicle",
      ],
      fullItinerary:
        "Day 1: Arrival and photography briefing. Day 2-5: Early morning and late afternoon photography sessions. Day 6: Editing workshop and farewell dinner. Day 7: Departure.",
      priceOptions: [
        { people: 2, price: 1200, currency: "euro" },
        { people: 3, price: 950, currency: "euro" },
        { people: 4, price: 800, currency: "euro" },
        { people: 5, price: 700, currency: "euro" },
        { people: 6, price: 650, currency: "euro" },
      ],
      priceRange: { min: 650, max: 1200 },
    },
    {
      id: 7,
      name: "Maasai Mara Honeymoon Special",
      description:
        "Romantic safari experience with luxury accommodations, private dining, and special surprises for newlyweds celebrating their love.",
      duration: "5-7 days recommended",
      highlights: ["Romantic Setup", "Private Dining", "Spa Treatment"],
      fullItinerary:
        "Day 1: Welcome champagne and flower setup. Day 2-5: Private game drives with picnic. Day 6: Couples spa treatment and bush dinner. Day 7: Farewell breakfast in bed.",
      priceOptions: [
        { people: 2, price: 1500, currency: "euro" },
        { people: 3, price: 1200, currency: "euro" },
        { people: 4, price: 1000, currency: "euro" },
      ],
      priceRange: { min: 1000, max: 1500 },
    },
  ];

  const [safariRoutes, setSafariRoutes] = useState(() => {
    try {
      const savedRoutes = localStorage.getItem("maasaiMaraPackages");
      if (savedRoutes) {
        return JSON.parse(savedRoutes);
      }
      localStorage.setItem(
        "maasaiMaraPackages",
        JSON.stringify(defaultSafariRoutes),
      );
      return defaultSafariRoutes;
    } catch (error) {
      console.error("Error loading safari packages:", error);
      return defaultSafariRoutes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("maasaiMaraPackages", JSON.stringify(safariRoutes));
    } catch (error) {
      console.error("Error saving safari packages:", error);
    }
  }, [safariRoutes]);

  const saveSafariRoutesToStorage = (routes) => {
    try {
      localStorage.setItem("maasaiMaraPackages", JSON.stringify(routes));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      Swal.fire({
        title: "Storage Error",
        text: "Could not save safari packages. Please try again.",
        icon: "error",
        confirmButtonColor: "#2D6A4F",
      });
    }
  };

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const packagesResponse = await fetch(
          "http://localhost:5000/api/safari-cards",
        );
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          const filteredPackages =
            packagesData.success && packagesData.data
              ? packagesData.data.filter(
                  (pkg) =>
                    pkg.name &&
                    (pkg.name.toLowerCase().includes("maasai mara") ||
                      pkg.name.toLowerCase().includes("masai mara") ||
                      pkg.name.toLowerCase().includes("mara")),
                )
              : [];

          setBackendStatus({
            connected: true,
            packageCount: filteredPackages.length,
          });

          if (filteredPackages.length > 0) {
            loadPackagesFromBackend(filteredPackages);
          }
        }
      } catch (error) {
        console.log("Backend not connected, using local storage only");
        setBackendStatus({
          connected: false,
          packageCount: 0,
        });
      }
    };

    checkBackendConnection();
  }, []);

  const loadPackagesFromBackend = (backendPackages) => {
    try {
      const convertedPackages = backendPackages.map((pkg) => {
        const hasPrices = pkg.prices && pkg.prices.length > 0;
        const basePrice = hasPrices ? pkg.prices[0] : null;

        return {
          id: `backend_${pkg.id}`,
          backendId: pkg.id,
          name: pkg.name,
          description: pkg.description || "",
          duration: `${pkg.total_days || 5}-${(pkg.total_days || 5) + 2} days recommended`,
          highlights: pkg.highlights || [],
          fullItinerary: pkg.description || "",
          priceOptions:
            hasPrices && basePrice.prices
              ? [
                  {
                    people: 2,
                    price: basePrice.prices.pax_2_price || 359,
                    currency: "euro",
                  },
                  {
                    people: 4,
                    price: basePrice.prices.pax_4_price || 150,
                    currency: "euro",
                  },
                  {
                    people: 6,
                    price: basePrice.prices.pax_6_price || 130,
                    currency: "euro",
                  },
                  {
                    people: 8,
                    price: basePrice.prices.pax_8_price || 110,
                    currency: "euro",
                  },
                ]
              : defaultSafariRoutes[0].priceOptions,
          priceRange: {
            min:
              hasPrices && basePrice.prices
                ? Math.min(
                    basePrice.prices.pax_2_price || 359,
                    basePrice.prices.pax_4_price || 150,
                    basePrice.prices.pax_6_price || 130,
                    basePrice.prices.pax_8_price || 110,
                  )
                : 100,
            max:
              hasPrices && basePrice.prices
                ? Math.max(
                    basePrice.prices.pax_2_price || 359,
                    basePrice.prices.pax_4_price || 150,
                    basePrice.prices.pax_6_price || 130,
                    basePrice.prices.pax_8_price || 110,
                  )
                : 500,
          },
        };
      });

      const allPackages = [...safariRoutes.filter((pkg) => !pkg.backendId)];
      convertedPackages.forEach((backendPkg) => {
        const exists = allPackages.some(
          (localPkg) =>
            localPkg.backendId === backendPkg.backendId ||
            localPkg.name === backendPkg.name,
        );
        if (!exists) {
          allPackages.push(backendPkg);
        }
      });

      setSafariRoutes(allPackages);
      saveSafariRoutesToStorage(allPackages);
    } catch (error) {
      console.error("Error loading packages from backend:", error);
    }
  };

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

  const openAttractionModal = (attraction) => {
    setSelectedAttraction(attraction);
    setShowAttractionModal(true);
  };

  const handleEditPackage = (route) => {
    setEditingRoute(route);
    setAdminForm({
      routeName: route.name.replace("Maasai Mara → ", "").trim(),
      description: route.description,
      duration: route.duration,
      highlights: route.highlights.join(", "),
      itinerary: route.fullItinerary || route.itinerary || "",
      priceOptions: [...route.priceOptions],
    });
    setShowEditModal(true);
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();

    const routeName =
      adminForm.routeName.includes("Maasai Mara") ||
      adminForm.routeName.includes("Masai Mara") ||
      adminForm.routeName.includes("Mara")
        ? adminForm.routeName
        : `Maasai Mara → ${adminForm.routeName}`;

    const prices = adminForm.priceOptions.map((option) => option.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const highlightsArray = adminForm.highlights
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const updatedRoute = {
      ...editingRoute,
      name: routeName,
      description: adminForm.description,
      duration: adminForm.duration,
      highlights: highlightsArray,
      fullItinerary: adminForm.itinerary,
      priceOptions: adminForm.priceOptions,
      priceRange: { min: minPrice, max: maxPrice },
    };

    const updatedRoutes = safariRoutes.map((route) =>
      route.id === editingRoute.id ? updatedRoute : route,
    );

    setSafariRoutes(updatedRoutes);
    saveSafariRoutesToStorage(updatedRoutes);

    if (selectedRoute && selectedRoute.id === editingRoute.id) {
      setSelectedRoute(updatedRoute);
    }

    Swal.fire({
      title: "✅ Package Updated!",
      html: `
        <div class="text-left">
          <p><strong>${updatedRoute.name}</strong> has been updated successfully.</p>
          <div class="mt-4 p-3 bg-gray-50 rounded">
            <p class="text-sm"><strong>Price Range:</strong> €${minPrice} - €${maxPrice}</p>
            <p class="text-sm"><strong>Duration:</strong> ${updatedRoute.duration}</p>
          </div>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#2D6A4F",
    });

    setShowEditModal(false);
    setEditingRoute(null);
  };

  const savePackageToBackend = async (packageData) => {
    try {
      setIsLoading(true);

      const routeName =
        packageData.name.includes("Maasai Mara") ||
        packageData.name.includes("Masai Mara") ||
        packageData.name.includes("Mara")
          ? packageData.name
          : `Maasai Mara → ${packageData.name}`;

      const backendPackage = {
        name: routeName,
        description: packageData.description,
        duration: packageData.duration || "5-7 days recommended",
        itinerary: packageData.fullItinerary || "",
        priceOptions: packageData.priceOptions.map((option) => ({
          people: option.people,
          price: option.price,
          currency: option.currency || "euro",
        })),
      };

      const response = await fetch("http://localhost:5000/api/safari-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendPackage),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          title: "✅ Success!",
          text: "Safari package saved to database successfully",
          icon: "success",
          confirmButtonColor: "#2D6A4F",
        });

        return {
          success: true,
          data: result,
          backendId: result.package_id,
        };
      } else {
        throw new Error(result.error || "Failed to save package");
      }
    } catch (error) {
      console.error("Error saving to backend:", error);
      Swal.fire({
        title: "Backend Error",
        text: "Could not save to database. Saved locally instead.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithBackend = async () => {
    setBackendLoading(true);
    Swal.fire({
      title: "Syncing...",
      text: "Please wait while we sync with the database",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch("http://localhost:5000/api/safari-cards");
      if (response.ok) {
        const packagesData = await response.json();

        if (packagesData.success) {
          const filteredPackages = packagesData.data.filter(
            (pkg) =>
              pkg.name &&
              (pkg.name.toLowerCase().includes("maasai mara") ||
                pkg.name.toLowerCase().includes("masai mara") ||
                pkg.name.toLowerCase().includes("mara")),
          );

          const backendPackages = filteredPackages.map((pkg) => {
            const hasPrices = pkg.prices && pkg.prices.length > 0;
            const basePrice = hasPrices ? pkg.prices[0] : null;

            return {
              id: `backend_${pkg.id}`,
              backendId: pkg.id,
              name: pkg.name,
              description: pkg.description || "",
              duration: `${pkg.total_days || 5}-${(pkg.total_days || 5) + 2} days recommended`,
              highlights: pkg.highlights || [],
              fullItinerary: pkg.description || "",
              priceOptions:
                hasPrices && basePrice.prices
                  ? [
                      {
                        people: 2,
                        price: basePrice.prices.pax_2_price || 359,
                        currency: "euro",
                      },
                      {
                        people: 4,
                        price: basePrice.prices.pax_4_price || 150,
                        currency: "euro",
                      },
                      {
                        people: 6,
                        price: basePrice.prices.pax_6_price || 130,
                        currency: "euro",
                      },
                      {
                        people: 8,
                        price: basePrice.prices.pax_8_price || 110,
                        currency: "euro",
                      },
                    ]
                  : defaultSafariRoutes[0].priceOptions,
              priceRange: {
                min:
                  hasPrices && basePrice.prices
                    ? Math.min(
                        basePrice.prices.pax_2_price || 359,
                        basePrice.prices.pax_4_price || 150,
                        basePrice.prices.pax_6_price || 130,
                        basePrice.prices.pax_8_price || 110,
                      )
                    : 100,
                max:
                  hasPrices && basePrice.prices
                    ? Math.max(
                        basePrice.prices.pax_2_price || 359,
                        basePrice.prices.pax_4_price || 150,
                        basePrice.prices.pax_6_price || 130,
                        basePrice.prices.pax_8_price || 110,
                      )
                    : 500,
              },
            };
          });

          const localPackages = safariRoutes.filter((pkg) => !pkg.backendId);
          const allPackages = [...localPackages, ...backendPackages];

          setSafariRoutes(allPackages);
          saveSafariRoutesToStorage(allPackages);

          setBackendStatus((prev) => ({
            ...prev,
            packageCount: backendPackages.length,
          }));

          Swal.fire({
            title: "✅ Sync Complete!",
            text: `Loaded ${backendPackages.length} Maasai Mara packages from backend`,
            icon: "success",
            confirmButtonColor: "#2D6A4F",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Sync Failed",
        text: "Could not sync with backend. Please check your connection.",
        icon: "error",
        confirmButtonColor: "#2D6A4F",
      });
    } finally {
      setBackendLoading(false);
    }
  };

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm({
      ...adminForm,
      [name]: value,
    });
  };

  const handlePriceOptionChange = (index, field, value) => {
    const updatedPriceOptions = [...adminForm.priceOptions];
    updatedPriceOptions[index] = {
      ...updatedPriceOptions[index],
      [field]:
        field === "people" || field === "price" ? parseInt(value) : value,
    };

    setAdminForm({
      ...adminForm,
      priceOptions: updatedPriceOptions,
    });
  };

  const addPriceOption = () => {
    if (adminForm.priceOptions.length >= 7) {
      Swal.fire({
        title: "Maximum Reached",
        text: "You can only add up to 7 price options (2-8 pax).",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }

    const existingPeople = adminForm.priceOptions.map((opt) => opt.people);
    let nextPeople = 2;
    while (existingPeople.includes(nextPeople) && nextPeople <= 8) {
      nextPeople++;
    }

    if (nextPeople > 8) {
      Swal.fire({
        title: "Maximum Reached",
        text: "You can only add price options for 2-8 people.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }

    setAdminForm({
      ...adminForm,
      priceOptions: [
        ...adminForm.priceOptions,
        { people: nextPeople, price: 300, currency: "euro" },
      ],
    });
  };

  const removePriceOption = (index) => {
    if (adminForm.priceOptions.length <= 2) {
      Swal.fire({
        title: "Minimum Required",
        text: "You need at least 2 price options.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return;
    }

    const updatedPriceOptions = adminForm.priceOptions.filter(
      (_, i) => i !== index,
    );
    setAdminForm({
      ...adminForm,
      priceOptions: updatedPriceOptions,
    });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    const routeName =
      adminForm.routeName.includes("Maasai Mara") ||
      adminForm.routeName.includes("Masai Mara") ||
      adminForm.routeName.includes("Mara")
        ? adminForm.routeName
        : `Maasai Mara → ${adminForm.routeName}`;

    const prices = adminForm.priceOptions.map((option) => option.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

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
      priceOptions: adminForm.priceOptions,
      priceRange: { min: minPrice, max: maxPrice },
    };

    let backendResult = null;
    if (backendStatus.connected) {
      backendResult = await savePackageToBackend(newRoute);

      if (backendResult.success && backendResult.backendId) {
        newRoute.backendId = backendResult.backendId;
        newRoute.id = `backend_${backendResult.backendId}`;
      }
    }

    const updatedRoutes = [...safariRoutes, newRoute];
    setSafariRoutes(updatedRoutes);
    saveSafariRoutesToStorage(updatedRoutes);

    Swal.fire({
      title: "✅ Package Created!",
      html: `
        <div class="text-left">
          <p><strong>${newRoute.name}</strong> has been created successfully.</p>
          <div class="mt-4 p-3 bg-gray-50 rounded">
            <p class="text-sm"><strong>Status:</strong> ${backendStatus.connected && backendResult?.success ? "Saved to Database ✓" : "Saved Locally Only"}</p>
            <p class="text-sm"><strong>Price Range:</strong> €${minPrice} - €${maxPrice}</p>
            <p class="text-sm"><strong>Duration:</strong> ${newRoute.duration}</p>
          </div>
        </div>
      `,
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
    Swal.fire({
      title: "Delete Safari Package?",
      text: "Are you sure you want to permanently delete this safari package? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2D6A4F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete permanently!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRoutes = safariRoutes.filter(
          (route) => route.id !== routeId,
        );
        setSafariRoutes(updatedRoutes);
        saveSafariRoutesToStorage(updatedRoutes);

        if (selectedRoute && selectedRoute.id === routeId) {
          setSelectedRoute(null);
        }

        Swal.fire({
          title: "Deleted Permanently!",
          text: "The safari package has been permanently deleted and removed from storage.",
          icon: "success",
          confirmButtonColor: "#2D6A4F",
        });
      }
    });
  };

  const handleRouteSelect = async (route) => {
    if (!selectedLodge) {
      const result = await Swal.fire({
        title: "Lodge Required",
        html: `
          <div class="text-left">
            <p class="mb-4">To book a Maasai Mara safari package, you must first select your accommodation.</p>
            <div class="bg-amber-50 p-3 rounded-lg mb-4">
              <p class="font-semibold">Why select a lodge first?</p>
              <p class="text-sm">Maasai Mara safaris include lodge accommodation. Your chosen lodge affects pricing and itinerary planning.</p>
            </div>
            <p class="text-sm text-gray-600">You'll select from 7 premium lodges including Sweet Acacia Camp, AA Lodge Mara, and Mara Serena Safari Lodge.</p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#2D6A4F",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Choose Lodge Now",
        cancelButtonText: "Maybe Later",
        customClass: {
          popup: "rounded-lg",
        },
      });

      if (result.isConfirmed) {
        setShowLodgeModal(true);
      }
      return;
    }

    setSelectedRouteForPricing(route);
    setShowPriceModal(true);
  };

  const handleFinalPriceSelect = (people, price) => {
    setSelectedRoute(selectedRouteForPricing);
    setBookingForm({
      ...bookingForm,
      travelers: people,
    });
    setShowPriceModal(false);

    setTimeout(() => {
      setShowBookingModal(true);
    }, 300);
  };

  const handleLodgeSelection = async (lodge) => {
    Swal.fire({
      title: "Selecting Lodge...",
      text: "Please wait while we save your lodge preference.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      setSelectedLodge(lodge);

      const bookingData = {
        park: parkInfo,
        lodge: lodge,
        step: "lodge_selected",
        timestamp: new Date().toISOString(),
        page: "MaasaiMara",
      };
      try {
        localStorage.setItem("maasaiMaraBooking", JSON.stringify(bookingData));
      } catch (error) {
        console.error("Error saving lodge selection:", error);
      }

      Swal.fire({
        title: "Lodge Selected!",
        html: `<strong>${lodge.name}</strong> has been selected for your Maasai Mara stay.`,
        icon: "success",
        confirmButtonColor: "#2D6A4F",
        confirmButtonText: "Continue",
      });

      setShowLodgeModal(false);
    }, 1000);
  };

  const generateItinerary = (days, route) => {
    const itineraries = [];

    for (let i = 1; i <= days; i++) {
      if (i === 1) {
        itineraries.push(
          `Day ${i}: Arrival at Maasai Mara National Reserve, check-in at ${
            selectedLodge?.name || "selected lodge"
          } and afternoon game drive in search of big cats`,
        );
      } else if (i === days) {
        itineraries.push(
          `Day ${i}: Final morning game drive, breakfast, and departure from ${route
            .split("→")
            .pop()
            .trim()}`,
        );
      } else {
        const parksInRoute = route.split("→").map((park) => park.trim());
        const currentParkIndex = Math.min(i - 2, parksInRoute.length - 1);
        if (
          parksInRoute[currentParkIndex] &&
          (parksInRoute[currentParkIndex].includes("Maasai Mara") ||
            parksInRoute[currentParkIndex].includes("Mara"))
        ) {
          itineraries.push(
            `Day ${i}: Full day in Maasai Mara with picnic lunch, searching for the Great Migration. ${
              selectedLodge ? `Overnight at ${selectedLodge.name}` : ""
            }`,
          );
        } else if (parksInRoute[currentParkIndex]) {
          itineraries.push(
            `Day ${i}: Travel to ${parksInRoute[currentParkIndex]} for wildlife viewing`,
          );
        } else {
          itineraries.push(
            `Day ${i}: Game drive and wildlife viewing in Maasai Mara`,
          );
        }
      }
    }
    return itineraries;
  };

  const calculatePrice = (travelers, route) => {
    if (!route || !route.priceOptions) return 0;

    const priceOption = route.priceOptions.find(
      (option) => option.people === travelers,
    );

    if (priceOption) {
      return priceOption.price;
    }

    const sortedOptions = [...route.priceOptions].sort(
      (a, b) => a.people - b.people,
    );

    const higherOption = sortedOptions.find(
      (option) => option.people >= travelers,
    );
    if (higherOption) return higherOption.price;

    return sortedOptions[sortedOptions.length - 1].price;
  };

  const validateBookingReadiness = () => {
    if (!selectedLodge) {
      Swal.fire({
        title: "Accommodation Required",
        text: "Please select a lodge before proceeding with booking.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return false;
    }
    if (!selectedRoute) {
      Swal.fire({
        title: "Safari Route Required",
        text: "Please select a safari route package.",
        icon: "warning",
        confirmButtonColor: "#2D6A4F",
      });
      return false;
    }
    return true;
  };

  const handleBookingConfirm = () => {
    if (!validateBookingReadiness()) {
      return;
    }
    setShowItineraryModal(false);
    setShowBookingModal(true);
  };

  const handleFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageError = (e, fallbackImage) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
  };

  const openGalleryModal = (index) => {
    setActiveGalleryImage(index);
    setShowGalleryModal(true);
  };

  const nextGalleryImage = () => {
    setActiveGalleryImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevGalleryImage = () => {
    setActiveGalleryImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  };

  const sendBookingToBackend = async (bookingData) => {
    try {
      const response = await fetch("http://localhost:5000/api/send-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.status === 400) {
        console.error("Backend validation error:", result);
        return { success: false, error: result.error };
      }

      if (result.success) {
        Swal.fire({
          title: "✅ Booking Sent!",
          text: "Check your email for confirmation.",
          icon: "success",
          confirmButtonColor: "#2D6A4F",
        });
        return { success: true, data: result };
      } else {
        console.error("Backend error:", result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error sending to backend:", error);
      return { success: false, error: error.message };
    }
  };

  const sendDirectEmail = (bookingData) => {
    const emailBody = `
MAASAI MARA NATIONAL RESERVE SAFARI BOOKING DETAILS:

📍 PARK: ${bookingData.park}
🏨 LODGE: ${bookingData.lodge}
🚗 ROUTE/ITINERARY: ${bookingData.route}
📅 DURATION: ${bookingData.days} days
👥 TRAVELERS: ${bookingData.travelers} pax
💰 ESTIMATED TOTAL PRICE: €${bookingData.totalPrice}
📝 ITINERARY TYPE: ${bookingData.route}

🏨 LODGE DETAILS:
- Name: ${selectedLodge?.name || "Not selected"}
- Description: ${selectedLodge?.description || "Not available"}
- Features: ${selectedLodge?.features?.join(", ") || "Not available"}

📋 ITINERARY:
${bookingData.itinerary.map((day, index) => `${index + 1}. ${day}`).join("\n")}

👤 PERSONAL INFORMATION:
- Full Name: ${bookingData.fullName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}
- Start Date: ${bookingData.startDate || "Flexible"}

💬 ADDITIONAL MESSAGE:
${bookingData.message || "No additional message"}

📧 This booking was made from the Maasai Mara National Reserve page.
    `.trim();

    window.open(
      `mailto:tembo4401@gmail.com?subject=Maasai Mara Safari Booking: ${
        bookingData.route
      } - ${bookingData.fullName}&body=${encodeURIComponent(emailBody)}`,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBookingReadiness()) {
      return;
    }

    setIsLoading(true);

    Swal.fire({
      title: "Processing Booking...",
      text: "Please wait while we process your booking request.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(async () => {
      const totalPrice = calculatePrice(bookingForm.travelers, selectedRoute);
      const itinerary = generateItinerary(selectedDays, selectedRoute.name);

      const bookingData = {
        park: parkInfo.name,
        lodge: selectedLodge.name,
        days: selectedDays,
        travelers: bookingForm.travelers,
        totalPrice: totalPrice,
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

      const result = await sendBookingToBackend(bookingData);

      if (!result.success) {
        sendDirectEmail({
          ...bookingData,
          route: selectedRoute.name,
          itinerary: itinerary,
        });
      }

      setShowBookingModal(false);
      setShowItineraryModal(false);
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
      text: "Are you sure you want to change your selected lodge?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2D6A4F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedLodge(null);
        try {
          localStorage.removeItem("maasaiMaraBooking");
        } catch (error) {
          console.error("Error removing lodge selection:", error);
        }
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
      {/* Hero Section */}
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">Lodge Selected:</span>
                {selectedLodge.name}
                <button
                  onClick={handleClearLodgeSelection}
                  className="text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Park Information Section */}
        <div className="mb-16">
          <SectionHeader title="Discover Maasai Mara" section="parkInfo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  The Maasai Mara National Reserve is Kenya's most famous
                  wildlife sanctuary. Famous for the annual Great Migration,
                  where over 1.5 million wildebeest, zebras, and antelopes cross
                  from the Serengeti, the Mara offers unparalleled game viewing.
                  The reserve is also home to the Maasai people, known for their
                  distinctive red dress and rich cultural heritage.
                </p>

                <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-[#2D6A4F]/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      Your Maasai Mara Accommodation
                    </h3>
                    {!selectedLodge ? (
                      <button
                        onClick={() => setShowLodgeModal(true)}
                        className="bg-[#5C3A21] hover:bg-[#4A2E1A] text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full sm:w-auto"
                      >
                        Choose Lodge
                      </button>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setShowLodgeModal(true)}
                          className="bg-[#8B6914] hover:bg-[#6B4F10] text-white px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-none"
                        >
                          View Details
                        </button>
                        <button
                          onClick={handleClearLodgeSelection}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-none"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>

                  {selectedLodge ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#2D6A4F]/10 rounded-lg">
                      <img
                        src={selectedLodge.image}
                        alt={selectedLodge.name}
                        className="w-32 h-24 object-cover rounded-lg"
                        onError={(e) =>
                          handleImageError(e, selectedLodge.fallbackImage)
                        }
                      />
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">
                          {selectedLodge.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {selectedLodge.description.substring(0, 100)}...
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedLodge.features
                            ?.slice(0, 2)
                            .map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-[#2D6A4F]/20 text-[#2D6A4F] px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
                      <svg
                        className="w-12 h-12 text-amber-500 mx-auto mb-3"
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
                      <p className="text-gray-700 mb-3">
                        No lodge selected yet
                      </p>
                      <p className="text-gray-600 text-sm">
                        Choose from 7 premium lodges for your Maasai Mara stay
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Park Highlights
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {parkInfo.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-700"
                        >
                          <span className="w-2 h-2 bg-[#2D6A4F] rounded-full mr-3"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Best Time to Visit
                      </h4>
                      <p className="text-gray-700">{parkInfo.bestTime}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Key Wildlife
                      </h4>
                      <p className="text-gray-700">{parkInfo.wildlife}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Reserve Size
                      </h4>
                      <p className="text-gray-700">{parkInfo.size}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Special Feature
                      </h4>
                      <p className="text-gray-700">{parkInfo.specialFeature}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-[#2D6A4F]/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Why Choose Maasai Mara?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#2D6A4F]/20 p-3 rounded-lg">
                      <span className="text-[#2D6A4F] font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        The Great Migration
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Witness one of nature's greatest spectacles with river
                        crossings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#2D6A4F]/20 p-3 rounded-lg">
                      <span className="text-[#2D6A4F] font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Big Cat Capital
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Highest density of lions, cheetahs, and leopards in
                        Africa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#2D6A4F]/20 p-3 rounded-lg">
                      <span className="text-[#2D6A4F] font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Cultural Experience
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Visit Maasai villages and learn about traditional
                        culture.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#2D6A4F]/20 p-3 rounded-lg">
                      <span className="text-[#2D6A4F] font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Balloon Safaris
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Spectacular hot air balloon rides over the savannah at
                        sunrise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionHeader>
        </div>

        {!selectedLodge && (
          <div className="mb-8 bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] text-white p-4 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                  <p className="text-sm opacity-90">
                    Choose accommodation before selecting safari packages
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLodgeModal(true)}
                className="bg-white text-[#5C3A21] hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors w-full sm:w-auto"
              >
                Browse Lodges
              </button>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className="mb-16">
          <SectionHeader title="Maasai Mara Gallery" section="gallery">
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Explore the breathtaking beauty and wildlife of Maasai Mara
              through our collection of images showcasing the park's most
              spectacular moments.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {galleryImages.slice(0, 8).map((image, index) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
                  onClick={() => openGalleryModal(index)}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => handleImageError(e, image.fallback)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-3 text-white">
                      <h4 className="font-semibold text-sm">{image.title}</h4>
                      <p className="text-xs opacity-90">{image.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-[#2D6A4F] text-white text-xs px-2 py-1 rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => openGalleryModal(0)}
                className="bg-[#5C3A21] hover:bg-[#4A2E1A] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                View Full Gallery ({galleryImages.length} images)
              </button>
            </div>
          </SectionHeader>
        </div>

        {/* Attractions Section */}
        <div className="mb-16">
          <SectionHeader
            title="Top Attractions in Maasai Mara"
            section="attractions"
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {attractions.map((attraction) => (
                <div
                  key={attraction.id}
                  onClick={() => openAttractionModal(attraction)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#2D6A4F]/20">
                    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) =>
                          handleImageError(e, attraction.fallback)
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                        <div className="p-3 md:p-4 text-white text-center w-full bg-black/50 backdrop-blur-sm">
                          <svg
                            className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span className="text-xs md:text-sm font-semibold">
                            Click to view details
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 text-center">
                      <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-[#2D6A4F] transition-colors line-clamp-2">
                        {attraction.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionHeader>
        </div>

        {/* Safari Packages Section with Responsive Grid and Dropdown */}
        <div className="mb-16">
          <SectionHeader title="Maasai Mara Safari Packages" section="packages">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">
                  {selectedLodge
                    ? `Packages available with your selected lodge: ${selectedLodge.name}`
                    : "Select a lodge first to view available packages"}
                </p>
                <p className="text-sm text-[#2D6A4F] mt-1">
                  📍 Only showing packages starting from Maasai Mara
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {backendStatus.connected && (
                  <button
                    onClick={syncWithBackend}
                    disabled={backendLoading}
                    className={`${backendLoading ? "bg-gray-400" : "bg-[#2D6A4F] hover:bg-[#1B4D3E]"} text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {backendLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Syncing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Sync
                        </>
                      )}
                    </div>
                  </button>
                )}
                <button
                  onClick={() => setShowAdminForm(true)}
                  className="bg-[#8B6914] hover:bg-[#6B4F10] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add New Package
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${backendStatus.connected ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      {backendStatus.connected
                        ? "Backend Database Connected"
                        : "Local Storage Only (Backend Offline)"}
                    </p>
                    <p className="text-xs text-blue-600">
                      {backendStatus.connected
                        ? `${backendStatus.packageCount} Maasai Mara packages in database, ${safariRoutes.length} locally`
                        : "All data stored locally in browser"}
                    </p>
                  </div>
                </div>
                {backendStatus.connected ? (
                  <div className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Database Active
                  </div>
                ) : (
                  <div className="text-xs text-red-700 bg-red-100 px-3 py-1 rounded-full">
                    Offline Mode
                  </div>
                )}
              </div>
            </div>

            {!selectedLodge ? (
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-8 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  Lodge Selection Required
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Please select your Maasai Mara accommodation first. Safari
                  packages are tailored to include your chosen lodge stay.
                </p>
                <button
                  onClick={() => setShowLodgeModal(true)}
                  className="bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] hover:from-[#4A2E1A] hover:to-[#3D2B1F] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Select Your Lodge Now
                </button>
              </div>
            ) : safariRoutes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-[#2D6A4F]/20">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Safari Packages Available
                </h3>
                <p className="text-gray-600 mb-6">
                  Click "Add New Package" to create your first Maasai Mara
                  safari package.
                </p>
                <button
                  onClick={() => setShowAdminForm(true)}
                  className="bg-[#5C3A21] hover:bg-[#4A2E1A] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Your First Package
                </button>
              </div>
            ) : (
              <>
                {/* Responsive Grid: 2x3 on mobile (2 columns, 3 rows = 6 items), 3x2 on desktop (3 columns, 2 rows = 6 items) */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {(showAllPackages
                    ? safariRoutes
                    : safariRoutes.slice(0, 6)
                  ).map((route) => {
                    const isExpanded = expandedCards[route.id] || false;
                    const shouldTruncate =
                      route.description && route.description.length > 100;
                    const displayDescription =
                      isExpanded || !shouldTruncate
                        ? route.description
                        : route.description.substring(0, 100) + "...";

                    const shouldTruncateItinerary =
                      route.fullItinerary && route.fullItinerary.length > 80;
                    const displayItinerary =
                      isExpanded || !shouldTruncateItinerary
                        ? route.fullItinerary
                        : route.fullItinerary.substring(0, 80) + "...";

                    return (
                      <div
                        key={route.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#2D6A4F]/20 relative group"
                      >
                        <div className="absolute top-2 left-2 z-10 flex gap-1">
                          {route.backendId && (
                            <span className="bg-[#2D6A4F] text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                              ✓ DB
                            </span>
                          )}
                          <span className="bg-[#8B6914] text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                            Local
                          </span>
                        </div>

                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-[#5C3A21] text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                            🦁 Mara
                          </span>
                        </div>

                        <div className="absolute top-12 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleEditPackage(route)}
                            className="bg-[#8B6914] hover:bg-[#6B4F10] text-white p-1.5 md:p-2 rounded-full shadow-lg transition-colors"
                            title="Edit Package"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePackage(route.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 md:p-2 rounded-full shadow-lg transition-colors"
                            title="Delete Package"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="h-24 md:h-32 bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] flex items-center justify-center">
                          <div className="text-white text-center p-2">
                            <h3 className="text-xs md:text-sm font-bold mb-0.5 md:mb-1">
                              {route.name.split("→")[0].trim()}
                            </h3>
                            <div className="w-6 md:w-8 h-0.5 bg-white mx-auto mb-0.5 md:mb-1"></div>
                            <p className="text-[10px] md:text-xs text-red-100">
                              Starting Point
                            </p>
                          </div>
                        </div>
                        <div className="p-2 md:p-3">
                          <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 line-clamp-1">
                            {route.name}
                          </h3>

                          {/* Description with Show More/Less */}
                          <div className="mb-2">
                            <p className="text-gray-600 text-[10px] md:text-xs">
                              {displayDescription}
                            </p>
                            {shouldTruncate && (
                              <button
                                onClick={() => toggleCardExpand(route.id)}
                                className="text-[#2D6A4F] text-[9px] md:text-[10px] font-semibold mt-1 hover:underline flex items-center gap-1"
                              >
                                {isExpanded ? (
                                  <>
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 15l7-7 7 7"
                                      />
                                    </svg>
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="w-3 h-3"
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
                                    Show More
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          <div className="mb-2">
                            <div className="flex flex-wrap gap-1">
                              {route.highlights
                                .slice(0, 2)
                                .map((highlight, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-[#2D6A4F]/20 text-[#2D6A4F] px-1 py-0.5 rounded text-[8px] md:text-[10px]"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                            </div>
                          </div>

                          {/* Itinerary with Show More/Less */}
                          {route.fullItinerary && (
                            <div className="mb-2">
                              <p className="text-gray-500 text-[9px] md:text-[10px] italic">
                                {displayItinerary}
                              </p>
                              {shouldTruncateItinerary && !shouldTruncate && (
                                <button
                                  onClick={() => toggleCardExpand(route.id)}
                                  className="text-[#2D6A4F] text-[9px] md:text-[10px] font-semibold mt-1 hover:underline flex items-center gap-1"
                                >
                                  {isExpanded ? (
                                    <>
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 15l7-7 7 7"
                                        />
                                      </svg>
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        className="w-3 h-3"
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
                                      Show More
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center mb-2">
                            <div className="text-[#2D6A4F] font-bold text-[10px] md:text-xs">
                              €{route.priceRange.min} - €{route.priceRange.max}
                            </div>
                            <span className="text-[8px] md:text-[10px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                              {route.duration}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRouteSelect(route)}
                            className="w-full bg-[#5C3A21] hover:bg-[#4A2E1A] text-white py-1 md:py-1.5 px-2 rounded-lg font-semibold text-[10px] md:text-xs transition-all duration-300"
                          >
                            Select Package
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dropdown Button - Show More/Less Packages */}
                {safariRoutes.length > 6 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowAllPackages(!showAllPackages)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] hover:from-[#1B4D3E] hover:to-[#143D31] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-300 ${showAllPackages ? "rotate-180" : ""}`}
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
                      {showAllPackages
                        ? `Show Less Packages (${safariRoutes.length - 6} hidden)`
                        : `Show More Packages (${safariRoutes.length - 6} more)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </SectionHeader>
        </div>

        {/* Migration Information */}
        <div className="mb-16">
          <SectionHeader title="The Great Migration" section="migration">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-[#2D6A4F]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Nature's Greatest Spectacle
                  </h3>
                  <p className="text-gray-700 mb-4">
                    The Great Migration is a continuous, clockwise movement of
                    over 1.5 million wildebeest, 200,000 zebras, and 300,000
                    Thomson's gazelles across the Serengeti-Mara ecosystem.
                  </p>
                  <ul className="space-y-2 text-gray-700">
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
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-[#2D6A4F] rounded-full mr-3"></span>
                      <strong>Calving Season:</strong> January-February in
                      Southern Serengeti
                    </li>
                  </ul>
                </div>
                <div className="bg-[#2D6A4F]/10 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Migration Calendar
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between flex-wrap gap-2">
                      <span>Jan-Feb:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Calving Season
                      </span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                      <span>Mar-May:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Long Rains Movement
                      </span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                      <span>Jun-Jul:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Mara River Crossing
                      </span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
                      <span>Aug-Oct:</span>
                      <span className="text-[#2D6A4F] font-semibold">
                        Peak in Maasai Mara
                      </span>
                    </div>
                    <div className="flex justify-between flex-wrap gap-2">
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

        {/* Plan Your Adventure - NO DROPDOWN */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">
              Plan Your Maasai Mara Adventure
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#2D6A4F]/20 hover:shadow-xl transition-all duration-300 group">
              <div className="relative p-4 md:p-6">
                <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#5C3A21] to-[#3D2B1F] rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl md:text-3xl">
                    1
                  </span>
                </div>
                <div className="pl-8 md:pl-10 pt-2 text-center sm:text-left">
                  <div className="mb-3 flex justify-center sm:justify-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center group-hover:bg-[#2D6A4F]/20 transition-colors">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-[#2D6A4F]"
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
                  </div>
                  <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1 md:mb-2">
                    Choose Your Lodge
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm">
                    Select from 7 premium lodges for your Maasai Mara stay
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#2D6A4F]/20 hover:shadow-xl transition-all duration-300 group">
              <div className="relative p-4 md:p-6">
                <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#5C3A21] to-[#3D2B1F] rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl md:text-3xl">
                    2
                  </span>
                </div>
                <div className="pl-8 md:pl-10 pt-2 text-center sm:text-left">
                  <div className="mb-3 flex justify-center sm:justify-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center group-hover:bg-[#2D6A4F]/20 transition-colors">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-[#2D6A4F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1 md:mb-2">
                    Select Safari Package
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm">
                    Choose a safari route and customize your itinerary
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#2D6A4F]/20 hover:shadow-xl transition-all duration-300 group">
              <div className="relative p-4 md:p-6">
                <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#5C3A21] to-[#3D2B1F] rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl md:text-3xl">
                    3
                  </span>
                </div>
                <div className="pl-8 md:pl-10 pt-2 text-center sm:text-left">
                  <div className="mb-3 flex justify-center sm:justify-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center group-hover:bg-[#2D6A4F]/20 transition-colors">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-[#2D6A4F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1 md:mb-2">
                    Book & Confirm
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm">
                    Secure your spot with our easy booking process
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attraction Details Modal */}
      {showAttractionModal && selectedAttraction && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fadeIn">
            <div className="relative">
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedAttraction.image}
                  alt={selectedAttraction.name}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    handleImageError(e, selectedAttraction.fallback)
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <button
                  onClick={() => setShowAttractionModal(false)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 z-10"
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
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {selectedAttraction.name}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-[#2D6A4F]/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                      ⭐ {selectedAttraction.highlight}
                    </span>
                    <span className="bg-[#5C3A21]/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                      📅 Best: {selectedAttraction.bestTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-[#2D6A4F]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    About This Attraction
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedAttraction.details ||
                      selectedAttraction.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#2D6A4F]/10 rounded-lg p-4 text-center">
                    <svg
                      className="w-8 h-8 text-[#2D6A4F] mx-auto mb-2"
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
                    <p className="text-sm text-gray-600">Best Time</p>
                    <p className="font-semibold text-[#2D6A4F]">
                      {selectedAttraction.bestTime}
                    </p>
                  </div>
                  <div className="bg-[#2D6A4F]/10 rounded-lg p-4 text-center">
                    <svg
                      className="w-8 h-8 text-[#2D6A4F] mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">Highlight</p>
                    <p className="font-semibold text-[#2D6A4F]">
                      {selectedAttraction.highlight}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAttractionModal(false)}
                  className="w-full bg-gradient-to-r from-[#5C3A21] to-[#4A2E1A] hover:from-[#4A2E1A] hover:to-[#3D2B1F] text-white py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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

      {/* CREATE PACKAGE ADMIN FORM MODAL */}
      {showAdminForm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Safari Package
              </h2>
              <button
                onClick={() => setShowAdminForm(false)}
                className="text-gray-500 hover:text-gray-700"
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

            <form onSubmit={handleAdminSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="routeName"
                  value={adminForm.routeName}
                  onChange={handleAdminFormChange}
                  placeholder="e.g., 3-Day Mara Safari Adventure"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  "Maasai Mara → " will be added automatically
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={adminForm.description}
                  onChange={handleAdminFormChange}
                  rows="3"
                  placeholder="Describe the safari experience, key features, and what makes it special..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={adminForm.duration}
                  onChange={handleAdminFormChange}
                  placeholder="e.g., 3-5 days recommended"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  name="highlights"
                  value={adminForm.highlights}
                  onChange={handleAdminFormChange}
                  placeholder="e.g., Great Migration, Big Cats, Balloon Safari"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Itinerary
                </label>
                <textarea
                  name="itinerary"
                  value={adminForm.itinerary}
                  onChange={handleAdminFormChange}
                  rows="4"
                  placeholder="Day by day itinerary details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Price Options
                </label>
                {adminForm.priceOptions.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="People"
                      value={option.people}
                      onChange={(e) =>
                        handlePriceOptionChange(index, "people", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                    />
                    <input
                      type="number"
                      placeholder="Price (€)"
                      value={option.price}
                      onChange={(e) =>
                        handlePriceOptionChange(index, "price", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                    />
                    <button
                      type="button"
                      onClick={() => removePriceOption(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPriceOption}
                  className="mt-2 bg-[#2D6A4F] text-white px-4 py-2 rounded-lg hover:bg-[#1B4D3E]"
                >
                  + Add Price Option
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white py-3 rounded-xl font-semibold hover:from-[#1B4D3E] hover:to-[#143D31] transition-all duration-300"
                >
                  Create Package
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PACKAGE MODAL */}
      {showEditModal && editingRoute && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit Safari Package
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
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

            <form onSubmit={handleUpdatePackage} className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="routeName"
                  value={adminForm.routeName}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={adminForm.description}
                  onChange={handleAdminFormChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={adminForm.duration}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  name="highlights"
                  value={adminForm.highlights}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Itinerary
                </label>
                <textarea
                  name="itinerary"
                  value={adminForm.itinerary}
                  onChange={handleAdminFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Price Options
                </label>
                {adminForm.priceOptions.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="People"
                      value={option.people}
                      onChange={(e) =>
                        handlePriceOptionChange(index, "people", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                    />
                    <input
                      type="number"
                      placeholder="Price (€)"
                      value={option.price}
                      onChange={(e) =>
                        handlePriceOptionChange(index, "price", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                    />
                    <button
                      type="button"
                      onClick={() => removePriceOption(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPriceOption}
                  className="mt-2 bg-[#2D6A4F] text-white px-4 py-2 rounded-lg hover:bg-[#1B4D3E]"
                >
                  + Add Price Option
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white py-3 rounded-xl font-semibold hover:from-[#1B4D3E] hover:to-[#143D31] transition-all duration-300"
                >
                  Update Package
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRICE SELECTION MODAL */}
      {showPriceModal && selectedRouteForPricing && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-md w-full animate-fadeIn">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Select Travelers & Price
              </h2>
              <p className="text-gray-600 mb-6">
                Choose the number of travelers for{" "}
                {selectedRouteForPricing.name}
              </p>

              <div className="space-y-3 mb-6">
                {selectedRouteForPricing.priceOptions &&
                selectedRouteForPricing.priceOptions.length > 0 ? (
                  selectedRouteForPricing.priceOptions.map((option) => (
                    <button
                      key={option.people}
                      onClick={() =>
                        handleFinalPriceSelect(option.people, option.price)
                      }
                      className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-all duration-300"
                    >
                      <span className="font-semibold text-gray-800">
                        {option.people}{" "}
                        {option.people === 1 ? "Traveler" : "Travelers"}
                      </span>
                      <span className="text-[#2D6A4F] font-bold text-xl">
                        €{option.price}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No price options available for this package.
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowPriceModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LODGE SELECTION MODAL */}
      {showLodgeModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Select Your Maasai Mara Lodge
              </h2>
              <button
                onClick={() => setShowLodgeModal(false)}
                className="text-gray-500 hover:text-gray-700"
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

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {maasaiMaraLodges.map((lodge) => (
                  <div
                    key={lodge.name}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleLodgeSelection(lodge)}
                  >
                    <img
                      src={lodge.image}
                      alt={lodge.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => handleImageError(e, lodge.fallbackImage)}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {lodge.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {lodge.description.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {lodge.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#2D6A4F]/20 text-[#2D6A4F] px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#2D6A4F] font-bold">
                          {lodge.priceRange}
                        </span>
                        <button className="bg-[#5C3A21] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4A2E1A] transition-colors">
                          Select This Lodge
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Complete Your Booking
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
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

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingForm.startDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Additional Message / Special Requests
                </label>
                <textarea
                  name="message"
                  value={bookingForm.message}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2D6A4F]"
                ></textarea>
              </div>

              <div className="bg-[#2D6A4F]/10 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">
                  Booking Summary
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Selected Lodge:</strong> {selectedLodge?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Selected Route:</strong> {selectedRoute?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Travelers:</strong> {bookingForm.travelers} pax
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Estimated Total:</strong> €
                  {calculatePrice(bookingForm.travelers, selectedRoute)}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#2D6A4F] to-[#1B4D3E] text-white py-3 rounded-xl font-semibold hover:from-[#1B4D3E] hover:to-[#143D31] transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="relative w-full max-w-5xl mx-4">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-8 h-8"
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

            <div className="relative">
              <img
                src={galleryImages[activeGalleryImage].src}
                alt={galleryImages[activeGalleryImage].title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                onError={(e) =>
                  handleImageError(
                    e,
                    galleryImages[activeGalleryImage].fallback,
                  )
                }
              />

              <button
                onClick={prevGalleryImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
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
    </div>
  );
};

export default Maasaimara;
