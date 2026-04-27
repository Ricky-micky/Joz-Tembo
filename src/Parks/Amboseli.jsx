import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Amboseli = () => {
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
    kilimanjaro: false,
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
    duration: "3-5 days recommended",
    highlights: "",
    itinerary: "",
    priceOptions: [
      { people: 2, price: 350, currency: "euro" },
      { people: 3, price: 280, currency: "euro" },
      { people: 4, price: 240, currency: "euro" },
      { people: 5, price: 200, currency: "euro" },
      { people: 6, price: 180, currency: "euro" },
      { people: 7, price: 160, currency: "euro" },
      { people: 8, price: 150, currency: "euro" },
    ],
  });

  const defaultSafariRoutes = [
    {
      id: 1,
      name: "Amboseli → Tsavo East → Tsavo West",
      description:
        "Experience the best of southern Kenya parks with diverse landscapes from savannah to volcanic terrain. This is a longer description to test the show more functionality on the card.",
      duration: "5-7 days recommended",
      highlights: ["Elephant herds", "Kilimanjaro views", "Dual Tsavo parks"],
      fullItinerary:
        "Day 1: Arrival at Amboseli, afternoon game drive with Kilimanjaro views. Day 2: Full day Amboseli with elephant tracking. Day 3: Travel to Tsavo East, afternoon game drive. Day 4: Full day Tsavo East exploring red elephants. Day 5: Travel to Tsavo West, visit Mzima Springs. Day 6: Morning game drive in Tsavo West, return journey. Day 7: Departure.",
      priceOptions: [
        { people: 2, price: 450, currency: "euro" },
        { people: 3, price: 380, currency: "euro" },
        { people: 4, price: 320, currency: "euro" },
        { people: 5, price: 280, currency: "euro" },
        { people: 6, price: 250, currency: "euro" },
        { people: 7, price: 230, currency: "euro" },
        { people: 8, price: 210, currency: "euro" },
      ],
      priceRange: { min: 210, max: 450 },
    },
    {
      id: 2,
      name: "Amboseli → Nairobi National Park",
      description:
        "Short safari combining Amboseli elephants with Nairobi convenience, perfect for limited time. Experience two iconic parks in one trip.",
      duration: "3-4 days recommended",
      highlights: ["City safari", "Elephant encounters", "Quick getaway"],
      fullItinerary:
        "Day 1: Arrival at Amboseli, Kilimanjaro sunset views. Day 2: Full day Amboseli exploration with elephant tracking. Day 3: Travel to Nairobi, afternoon Nairobi National Park with skyline views. Day 4: Morning game drive, departure.",
      priceOptions: [
        { people: 2, price: 350, currency: "euro" },
        { people: 3, price: 290, currency: "euro" },
        { people: 4, price: 250, currency: "euro" },
        { people: 5, price: 220, currency: "euro" },
        { people: 6, price: 200, currency: "euro" },
        { people: 7, price: 190, currency: "euro" },
        { people: 8, price: 180, currency: "euro" },
      ],
      priceRange: { min: 180, max: 350 },
    },
    {
      id: 3,
      name: "Amboseli Exclusive Experience",
      description:
        "Deep dive into Amboseli with extended game drives and luxury accommodation options. Perfect for photographers and wildlife enthusiasts.",
      duration: "2-4 days recommended",
      highlights: ["Luxury lodges", "Private guides", "Photography focus"],
      fullItinerary:
        "Day 1: Arrival, luxury lodge check-in, sundowner with Kilimanjaro views. Day 2: Full day private safari with picnic lunch and expert guide. Day 3: Sunrise photography session, cultural village visit. Day 4: Final game drive, farewell breakfast, departure.",
      priceOptions: [
        { people: 2, price: 750, currency: "euro" },
        { people: 3, price: 650, currency: "euro" },
        { people: 4, price: 580, currency: "euro" },
        { people: 5, price: 520, currency: "euro" },
        { people: 6, price: 480, currency: "euro" },
        { people: 7, price: 450, currency: "euro" },
        { people: 8, price: 430, currency: "euro" },
      ],
      priceRange: { min: 430, max: 750 },
    },
    {
      id: 4,
      name: "Amboseli → Lake Naivasha → Hell's Gate",
      description:
        "Combine Amboseli's elephants with the Great Rift Valley's lakes and unique hiking opportunities in Hell's Gate National Park.",
      duration: "5-6 days recommended",
      highlights: ["Boat Safari", "Walking Safari", "Geothermal Features"],
      fullItinerary:
        "Day 1: Arrival at Amboseli, evening game drive. Day 2: Full day Amboseli with Kilimanjaro views. Day 3: Travel to Lake Naivasha, afternoon boat safari. Day 4: Hell's Gate walking safari and cycling. Day 5: Morning game drive, return to Nairobi. Day 6: Departure.",
      priceOptions: [
        { people: 2, price: 520, currency: "euro" },
        { people: 3, price: 440, currency: "euro" },
        { people: 4, price: 380, currency: "euro" },
        { people: 5, price: 340, currency: "euro" },
        { people: 6, price: 310, currency: "euro" },
        { people: 7, price: 290, currency: "euro" },
        { people: 8, price: 270, currency: "euro" },
      ],
      priceRange: { min: 270, max: 520 },
    },
    {
      id: 5,
      name: "Amboseli Budget Camping Safari",
      description:
        "Affordable camping safari perfect for backpackers and budget travelers. Experience Amboseli's elephants without breaking the bank.",
      duration: "2-3 days recommended",
      highlights: ["Budget Friendly", "Camping Experience", "Great Wildlife"],
      fullItinerary:
        "Day 1: Arrival and camp setup, afternoon game drive. Day 2: Full day game drive with picnic lunch. Day 3: Sunrise game drive, then return to Nairobi.",
      priceOptions: [
        { people: 2, price: 180, currency: "euro" },
        { people: 3, price: 150, currency: "euro" },
        { people: 4, price: 130, currency: "euro" },
        { people: 5, price: 115, currency: "euro" },
        { people: 6, price: 105, currency: "euro" },
        { people: 7, price: 95, currency: "euro" },
        { people: 8, price: 85, currency: "euro" },
      ],
      priceRange: { min: 85, max: 180 },
    },
    {
      id: 6,
      name: "Amboseli Photography Safari",
      description:
        "Specialized safari for photography enthusiasts with expert guides, prime positioning for Kilimanjaro shots, and extended golden hour drives.",
      duration: "4-5 days recommended",
      highlights: [
        "Expert Photography Guide",
        "Golden Hour Drives",
        "Private Vehicle",
      ],
      fullItinerary:
        "Day 1: Arrival and photography briefing, sunset shoot. Day 2-4: Early morning and late afternoon photography sessions. Day 5: Editing workshop and farewell dinner. Day 6: Departure.",
      priceOptions: [
        { people: 2, price: 850, currency: "euro" },
        { people: 3, price: 720, currency: "euro" },
        { people: 4, price: 620, currency: "euro" },
        { people: 5, price: 550, currency: "euro" },
        { people: 6, price: 500, currency: "euro" },
      ],
      priceRange: { min: 500, max: 850 },
    },
    {
      id: 7,
      name: "Amboseli Family Safari",
      description:
        "Family-friendly safari with child-friendly accommodations, shorter game drives, and educational activities for young wildlife enthusiasts.",
      duration: "3-4 days recommended",
      highlights: ["Family Activities", "Child Friendly", "Educational"],
      fullItinerary:
        "Day 1: Arrival, family welcome, easy game drive. Day 2: Morning game drive with kids' activity booklet. Day 3: Maasai cultural visit, afternoon swim. Day 4: Farewell breakfast, departure.",
      priceOptions: [
        { people: 2, price: 420, currency: "euro" },
        { people: 3, price: 360, currency: "euro" },
        { people: 4, price: 310, currency: "euro" },
        { people: 5, price: 280, currency: "euro" },
        { people: 6, price: 260, currency: "euro" },
        { people: 7, price: 240, currency: "euro" },
        { people: 8, price: 220, currency: "euro" },
      ],
      priceRange: { min: 220, max: 420 },
    },
  ];

  const [safariRoutes, setSafariRoutes] = useState(() => {
    try {
      const savedRoutes = localStorage.getItem("amboseliPackages");
      if (savedRoutes) {
        return JSON.parse(savedRoutes);
      }
      localStorage.setItem(
        "amboseliPackages",
        JSON.stringify(defaultSafariRoutes),
      );
      return defaultSafariRoutes;
    } catch (error) {
      console.error("Error loading Amboseli packages:", error);
      return defaultSafariRoutes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("amboseliPackages", JSON.stringify(safariRoutes));
    } catch (error) {
      console.error("Error saving Amboseli packages:", error);
    }
  }, [safariRoutes]);

  const saveSafariRoutesToStorage = (routes) => {
    try {
      localStorage.setItem("amboseliPackages", JSON.stringify(routes));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      Swal.fire({
        title: "Storage Error",
        text: "Could not save safari packages. Please try again.",
        icon: "error",
        confirmButtonColor: "#d97706",
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
                    (pkg.name.toLowerCase().includes("amboseli") ||
                      pkg.name.toLowerCase().includes("kilimanjaro")),
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
                    price: basePrice.prices.pax_2_price || 350,
                    currency: "euro",
                  },
                  {
                    people: 4,
                    price: basePrice.prices.pax_4_price || 240,
                    currency: "euro",
                  },
                  {
                    people: 6,
                    price: basePrice.prices.pax_6_price || 180,
                    currency: "euro",
                  },
                  {
                    people: 8,
                    price: basePrice.prices.pax_8_price || 150,
                    currency: "euro",
                  },
                ]
              : defaultSafariRoutes[0].priceOptions,
          priceRange: {
            min:
              hasPrices && basePrice.prices
                ? Math.min(
                    basePrice.prices.pax_2_price || 350,
                    basePrice.prices.pax_4_price || 240,
                    basePrice.prices.pax_6_price || 180,
                    basePrice.prices.pax_8_price || 150,
                  )
                : 100,
            max:
              hasPrices && basePrice.prices
                ? Math.max(
                    basePrice.prices.pax_2_price || 350,
                    basePrice.prices.pax_4_price || 240,
                    basePrice.prices.pax_6_price || 180,
                    basePrice.prices.pax_8_price || 150,
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
        const bookingData = localStorage.getItem("amboseliBooking");
        if (bookingData) {
          const parsedData = JSON.parse(bookingData);
          if (
            parsedData.park &&
            parsedData.park.name === "Amboseli National Park" &&
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
    id: 1,
    name: "Amboseli National Park",
    image: "/assets/amboseli.png",
    fallbackImage: "/assets/amboseli-page.jpg",
    description:
      "Famous for its large elephant herds and stunning views of Mount Kilimanjaro, offering one of Africa's most iconic safari experiences.",
    highlights: [
      "Large elephant herds (over 1,500 elephants)",
      "Spectacular views of Mount Kilimanjaro",
      "Big Five sightings",
      "Swamp ecosystems with hippos and water birds",
      "Maasai cultural experiences",
    ],
    bestTime: "June to October & January to February",
    wildlife:
      "Elephants, Lions, Cheetahs, Buffaloes, Giraffes, Zebras, Hippos, Hyenas",
    size: "392 km² - Kenya's second most popular national park",
    specialFeature: "Iconic elephant herds with Mount Kilimanjaro backdrop",
  };

  const amboseliLodges = [
    {
      name: "Ol Tukai Lodge",
      image: "/assets/ol-tukai-lodge.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "One of the best wildlife lodges in Africa with stunning views of Kilimanjaro and abundant wildlife at its doorstep.",
      gallery: [
        "/assets/ol-tukai-1.jpg",
        "/assets/ol-tukai-2.jpg",
        "/assets/ol-tukai-3.jpg",
      ],
      priceRange: "$$$$",
      features: ["Kilimanjaro Views", "Premium Location", "Wildlife Haven"],
    },
    {
      name: "Amboseli Serena Safari Lodge",
      image: "/assets/amboseli-serena.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Maasai-inspired lodge with traditional design, swimming pool, and spectacular views of Mount Kilimanjaro.",
      gallery: [
        "/assets/amboseli-serena-1.jpg",
        "/assets/amboseli-serena-2.jpg",
        "/assets/amboseli-serena-3.jpg",
      ],
      priceRange: "$$$",
      features: ["Maasai Design", "Swimming Pool", "Cultural Experience"],
    },
    {
      name: "Tortilis Camp",
      image: "/assets/tortilis-camp.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Eco-friendly luxury tented camp named after the iconic Tortilis Acacia trees, offering privacy and exclusivity.",
      gallery: [
        "/assets/tortilis-1.jpg",
        "/assets/tortilis-2.jpg",
        "/assets/tortilis-3.jpg",
      ],
      priceRange: "$$$$$",
      features: ["Eco Luxury", "Private Tents", "Exclusive Experience"],
    },
    {
      name: "Kibo Safari Camp",
      image: "/assets/kibo-safari-camp.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Comfortable tented camp with excellent Kilimanjaro views, perfect for budget-conscious travelers.",
      gallery: [
        "/assets/kibo-1.jpg",
        "/assets/kibo-2.jpg",
        "/assets/kibo-3.jpg",
      ],
      priceRange: "$$",
      features: ["Budget Friendly", "Great Views", "Comfortable Tents"],
    },
    {
      name: "Amboseli Sopa Lodge",
      image: "/assets/amboseli-sopa.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Spacious lodge with traditional African architecture, offering comfortable accommodation and great wildlife viewing.",
      gallery: [
        "/assets/sopa-1.jpg",
        "/assets/sopa-2.jpg",
        "/assets/sopa-3.jpg",
      ],
      priceRange: "$$$",
      features: ["Traditional Architecture", "Spacious", "Family Friendly"],
    },
    {
      name: "Sentrim Amboseli Lodge",
      image: "/assets/sentrim-amboseli.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Affordable lodge with comfortable rooms and easy access to the park, perfect for all types of travelers.",
      gallery: [
        "/assets/sentrim-1.jpg",
        "/assets/sentrim-2.jpg",
        "/assets/sentrim-3.jpg",
      ],
      priceRange: "$$",
      features: ["Affordable", "Easy Access", "Comfortable"],
    },
    {
      name: "Porini Amboseli Camp",
      image: "/assets/porini-amboseli.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Eco-friendly camp in the Selenkay Conservancy, offering authentic safari experiences with minimal environmental impact.",
      gallery: [
        "/assets/porini-1.jpg",
        "/assets/porini-2.jpg",
        "/assets/porini-3.jpg",
      ],
      priceRange: "$$$$",
      features: ["Eco Camp", "Community Based", "Authentic Safari"],
    },
  ];

  const galleryImages = [
    {
      id: 1,
      src: "/assets/elepha-ambo1.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Elephants with Kilimanjaro",
      description: "Iconic view of elephants against Africa's highest peak",
      category: "wildlife",
    },
    {
      id: 2,
      src: "/assets/kilima-set.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Kilimanjaro Sunrise",
      description: "Stunning sunrise over Mount Kilimanjaro",
      category: "landscape",
    },
    {
      id: 3,
      src: "/assets/ele-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Elephant Herd",
      description: "Large herds of elephants in their natural habitat",
      category: "wildlife",
    },
    {
      id: 4,
      src: "/assets/olo-swamp.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Enkongo Narok Swamp",
      description: "Permanent swamps fed by Kilimanjaro's underground rivers",
      category: "landscape",
    },
    {
      id: 5,
      src: "/assets/lions-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Amboseli Lions",
      description: "Majestic lions resting in the shade",
      category: "wildlife",
    },
    {
      id: 6,
      src: "/assets/maasai-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Maasai Culture",
      description: "Traditional Maasai warriors in Amboseli",
      category: "culture",
    },
    {
      id: 7,
      src: "/assets/fla-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Lesser Flamingos",
      description: "Flamingos gathering in Amboseli's alkaline lakes",
      category: "birds",
    },
    {
      id: 8,
      src: "/assets/sunset-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "African Sunset",
      description: "Breathtaking sunset over the Amboseli plains",
      category: "landscape",
    },
    {
      id: 9,
      src: "/assets/cheete-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Cheetah Hunting",
      description: "Cheetahs scanning the open plains for prey",
      category: "wildlife",
    },
    {
      id: 10,
      src: "/assets/obsavation.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Observation Hill",
      description: "360-degree panoramic views of the entire park",
      category: "landscape",
    },
    {
      id: 11,
      src: "/assets/buf-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Cape Buffalo",
      description: "Large herds of African buffalo grazing",
      category: "wildlife",
    },
    {
      id: 12,
      src: "/assets/bird-ambo.png",
      fallback: "/assets/amboseli-gallery/default-gallery.jpg",
      title: "Bird Watching",
      description: "Over 400 bird species recorded in Amboseli",
      category: "birds",
    },
  ];

  const attractions = [
    {
      id: 1,
      name: "Observation Hill",
      image: "/assets/obsa-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description:
        "360-degree viewpoint overlooking the entire park with breathtaking panoramas of the Amboseli plains and Mount Kilimanjaro.",
      bestTime: "Sunrise or sunset",
      highlight: "Panoramic Kilimanjaro views",
      details:
        "Observation Hill offers the best vantage point in Amboseli. Climb to the top for 360-degree views of the park, the swamps, and on clear days, the snow-capped peak of Mount Kilimanjaro. Perfect for photography and game spotting.",
    },
    {
      id: 2,
      name: "Enkongo Narok Swamp",
      image: "/assets/swamp.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description:
        "Permanent swamp attracting elephants and hippos, fed by underground rivers from Mount Kilimanjaro.",
      bestTime: "Dry season",
      highlight: "Elephant drinking spot",
      details:
        "The Enkongo Narok Swamp is a vital water source during the dry season. Here you'll find large herds of elephants drinking and bathing, along with hippos, buffaloes, and numerous bird species.",
    },
    {
      id: 3,
      name: "Sinet Delta",
      image: "/assets/delta-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description:
        "River delta with diverse birdlife and excellent game viewing.",
      bestTime: "Year-round",
      highlight: "Bird watching paradise",
      details:
        "The Sinet Delta is a network of waterways that attracts incredible birdlife including flamingos, pelicans, and kingfishers. It's also a prime spot for spotting lions and cheetahs.",
    },
    {
      id: 4,
      name: "Kitirua Conservancy",
      image: "/assets/con-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description:
        "Community-owned conservancy bordering the park, offering authentic cultural experiences.",
      bestTime: "Year-round",
      highlight: "Cultural interactions",
      details:
        "Visit the Kitirua Conservancy to experience Maasai culture firsthand. Learn about traditional cattle herding, witness jumping dances, and support local community conservation efforts.",
    },
    {
      id: 5,
      name: "Amboseli Research Centre",
      image: "/assets/tr-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description:
        "Long-term elephant research facility studying the park's famous elephant population.",
      bestTime: "Year-round",
      highlight: "Scientific insights",
      details:
        "The Amboseli Elephant Research Project has been studying individual elephants since 1972 - the longest-running study of its kind. Learn about elephant behavior, family structures, and conservation efforts.",
    },
    {
      id: 6,
      name: "Kimana Gate Area",
      image: "/assets/kimana-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description:
        "Entry point with excellent wildlife viewing and close proximity to the park's best elephant viewing areas.",
      bestTime: "Early morning",
      highlight: "First game drive spot",
      details:
        "The Kimana Gate area is where many safaris begin. It's known for frequent elephant sightings and offers the classic Kilimanjaro backdrop for photography.",
    },
  ];

  const openAttractionModal = (attraction) => {
    setSelectedAttraction(attraction);
    setShowAttractionModal(true);
  };

  const handleEditPackage = (route) => {
    setEditingRoute(route);
    setAdminForm({
      routeName: route.name.replace("Amboseli → ", "").trim(),
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
      adminForm.routeName.includes("Amboseli") ||
      adminForm.routeName.includes("amboseli")
        ? adminForm.routeName
        : `Amboseli → ${adminForm.routeName}`;

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
      confirmButtonColor: "#d97706",
    });

    setShowEditModal(false);
    setEditingRoute(null);
  };

  const savePackageToBackend = async (packageData) => {
    try {
      setIsLoading(true);

      const routeName =
        packageData.name.includes("Amboseli") ||
        packageData.name.includes("amboseli")
          ? packageData.name
          : `Amboseli → ${packageData.name}`;

      const backendPackage = {
        name: routeName,
        description: packageData.description,
        duration: packageData.duration || "3-5 days recommended",
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
          confirmButtonColor: "#d97706",
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
        confirmButtonColor: "#d97706",
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
              (pkg.name.toLowerCase().includes("amboseli") ||
                pkg.name.toLowerCase().includes("kilimanjaro")),
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
                        price: basePrice.prices.pax_2_price || 350,
                        currency: "euro",
                      },
                      {
                        people: 4,
                        price: basePrice.prices.pax_4_price || 240,
                        currency: "euro",
                      },
                      {
                        people: 6,
                        price: basePrice.prices.pax_6_price || 180,
                        currency: "euro",
                      },
                      {
                        people: 8,
                        price: basePrice.prices.pax_8_price || 150,
                        currency: "euro",
                      },
                    ]
                  : defaultSafariRoutes[0].priceOptions,
              priceRange: {
                min:
                  hasPrices && basePrice.prices
                    ? Math.min(
                        basePrice.prices.pax_2_price || 350,
                        basePrice.prices.pax_4_price || 240,
                        basePrice.prices.pax_6_price || 180,
                        basePrice.prices.pax_8_price || 150,
                      )
                    : 100,
                max:
                  hasPrices && basePrice.prices
                    ? Math.max(
                        basePrice.prices.pax_2_price || 350,
                        basePrice.prices.pax_4_price || 240,
                        basePrice.prices.pax_6_price || 180,
                        basePrice.prices.pax_8_price || 150,
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
            text: `Loaded ${backendPackages.length} Amboseli packages from backend`,
            icon: "success",
            confirmButtonColor: "#d97706",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Sync Failed",
        text: "Could not sync with backend. Please check your connection.",
        icon: "error",
        confirmButtonColor: "#d97706",
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
        confirmButtonColor: "#d97706",
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
        confirmButtonColor: "#d97706",
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
        confirmButtonColor: "#d97706",
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
      adminForm.routeName.includes("Amboseli") ||
      adminForm.routeName.includes("amboseli")
        ? adminForm.routeName
        : `Amboseli → ${adminForm.routeName}`;

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
      confirmButtonColor: "#d97706",
    });

    setAdminForm({
      routeName: "",
      description: "",
      duration: "3-5 days recommended",
      highlights: "",
      itinerary: "",
      priceOptions: [
        { people: 2, price: 350, currency: "euro" },
        { people: 3, price: 280, currency: "euro" },
        { people: 4, price: 240, currency: "euro" },
        { people: 5, price: 200, currency: "euro" },
        { people: 6, price: 180, currency: "euro" },
        { people: 7, price: 160, currency: "euro" },
        { people: 8, price: 150, currency: "euro" },
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
      confirmButtonColor: "#d97706",
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
          confirmButtonColor: "#d97706",
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
            <p class="mb-4">To book an Amboseli safari package, you must first select your accommodation.</p>
            <div class="bg-amber-50 p-3 rounded-lg mb-4">
              <p class="font-semibold">Why select a lodge first?</p>
              <p class="text-sm">Amboseli safaris include lodge accommodation. Your chosen lodge affects pricing and itinerary planning.</p>
            </div>
            <p class="text-sm text-gray-600">You'll select from 7 premium lodges including Ol Tukai Lodge, Amboseli Serena, and Tortilis Camp.</p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#d97706",
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
        page: "Amboseli",
      };
      try {
        localStorage.setItem("amboseliBooking", JSON.stringify(bookingData));
      } catch (error) {
        console.error("Error saving lodge selection:", error);
      }

      Swal.fire({
        title: "Lodge Selected!",
        html: `<strong>${lodge.name}</strong> has been selected for your Amboseli stay.`,
        icon: "success",
        confirmButtonColor: "#d97706",
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
          `Day ${i}: Arrival at Amboseli National Park, check-in at ${
            selectedLodge?.name || "selected lodge"
          } and afternoon game drive with Kilimanjaro views`,
        );
      } else if (i === days) {
        itineraries.push(
          `Day ${i}: Sunrise game drive with Kilimanjaro backdrop, breakfast, and departure from ${route
            .split("→")
            .pop()
            .trim()}`,
        );
      } else {
        const parksInRoute = route.split("→").map((park) => park.trim());
        const currentParkIndex = Math.min(i - 2, parksInRoute.length - 1);
        if (
          parksInRoute[currentParkIndex] &&
          (parksInRoute[currentParkIndex].includes("Amboseli") ||
            parksInRoute[currentParkIndex].includes("amboseli"))
        ) {
          itineraries.push(
            `Day ${i}: Full day exploring Amboseli's swamps and plains with elephant tracking and picnic lunch. ${
              selectedLodge ? `Overnight at ${selectedLodge.name}` : ""
            }`,
          );
        } else if (parksInRoute[currentParkIndex]) {
          itineraries.push(
            `Day ${i}: Travel to ${parksInRoute[currentParkIndex]} for wildlife viewing`,
          );
        } else {
          itineraries.push(
            `Day ${i}: Game drive and wildlife viewing in Amboseli National Park`,
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
        confirmButtonColor: "#d97706",
      });
      return false;
    }
    if (!selectedRoute) {
      Swal.fire({
        title: "Safari Route Required",
        text: "Please select a safari route package.",
        icon: "warning",
        confirmButtonColor: "#d97706",
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
          confirmButtonColor: "#d97706",
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
AMBOSELI NATIONAL PARK SAFARI BOOKING DETAILS:

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

🗻 PARK HIGHLIGHTS:
${parkInfo.highlights.map((highlight) => `• ${highlight}`).join("\n")}

🐘 WILDLIFE: ${parkInfo.wildlife}

📧 This booking was made from the Amboseli National Park page.
    `.trim();

    window.open(
      `mailto:tembo4401@gmail.com?subject=Amboseli Safari Booking: ${
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
        bookingSource: "Amboseli Park Page",
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
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedLodge(null);
        try {
          localStorage.removeItem("amboseliBooking");
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
            className="w-8 h-8 text-amber-700 group-hover:text-amber-600"
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={parkInfo.image}
          alt={parkInfo.name}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, parkInfo.fallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 to-amber-800/40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              {parkInfo.name}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl">
              {parkInfo.description}
            </p>

            {selectedLodge && (
              <div className="mt-4 inline-flex flex-wrap items-center bg-amber-700/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg gap-2">
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
          <SectionHeader title="Discover Amboseli" section="parkInfo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Amboseli National Park, located in southern Kenya, is one of
                  Africa's most iconic safari destinations. Renowned for its
                  breathtaking views of Mount Kilimanjaro, Africa's highest
                  peak, the park offers unparalleled opportunities to observe
                  large herds of elephants against the stunning mountain
                  backdrop. The park's name comes from the Maasai word "Empusel"
                  meaning "salty dust."
                </p>

                <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-amber-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      Your Amboseli Accommodation
                    </h3>
                    {!selectedLodge ? (
                      <button
                        onClick={() => setShowLodgeModal(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full sm:w-auto"
                      >
                        Choose Lodge
                      </button>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setShowLodgeModal(true)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex-1 sm:flex-none"
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
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-amber-50 rounded-lg">
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
                                className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"
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
                        Choose from 7 premium lodges for your Amboseli stay
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
                          <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
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
                        Park Size
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

              <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Why Choose Amboseli?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Elephant Paradise
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Home to over 1,500 free-ranging elephants with some of
                        the largest tusks in Africa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Kilimanjaro Views
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Stunning, unobstructed views of Mount Kilimanjaro,
                        especially at sunrise and sunset.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Diverse Ecosystems
                      </h4>
                      <p className="text-gray-600 text-sm">
                        From dried lake beds to swamps and woodlands, supporting
                        varied wildlife.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Cultural Experience
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Opportunities to visit Maasai communities and learn
                        about their traditional way of life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionHeader>
        </div>

        {!selectedLodge && (
          <div className="mb-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-xl shadow-lg">
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
                className="bg-white text-amber-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors w-full sm:w-auto"
              >
                Browse Lodges
              </button>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className="mb-16">
          <SectionHeader title="Amboseli Gallery" section="gallery">
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Experience the majestic beauty of Amboseli through our collection
              of images showcasing elephants, Kilimanjaro, and the park's
              diverse wildlife.
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
                    <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => openGalleryModal(0)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                View Full Gallery ({galleryImages.length} images)
              </button>
            </div>
          </SectionHeader>
        </div>

        {/* Attractions Section */}
        <div className="mb-16">
          <SectionHeader
            title="Top Attractions in Amboseli"
            section="attractions"
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {attractions.map((attraction) => (
                <div
                  key={attraction.id}
                  onClick={() => openAttractionModal(attraction)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-200">
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
                      <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2">
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
          <SectionHeader title="Amboseli Safari Packages" section="packages">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">
                  {selectedLodge
                    ? `Packages available with your selected lodge: ${selectedLodge.name}`
                    : "Select a lodge first to view available packages"}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  📍 Only showing packages starting from Amboseli
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {backendStatus.connected && (
                  <button
                    onClick={syncWithBackend}
                    disabled={backendLoading}
                    className={`${backendLoading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700"} text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none`}
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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none"
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
                        ? `${backendStatus.packageCount} Amboseli packages in database, ${safariRoutes.length} locally`
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
                  Please select your Amboseli accommodation first. Safari
                  packages are tailored to include your chosen lodge stay.
                </p>
                <button
                  onClick={() => setShowLodgeModal(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Select Your Lodge Now
                </button>
              </div>
            ) : safariRoutes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-amber-200">
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
                  Click "Add New Package" to create your first Amboseli safari
                  package.
                </p>
                <button
                  onClick={() => setShowAdminForm(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Your First Package
                </button>
              </div>
            ) : (
              <>
                {/* Responsive Grid: 2x3 on mobile, 3x2 on desktop */}
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
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-amber-200 relative group"
                      >
                        <div className="absolute top-2 left-2 z-10 flex gap-1">
                          {route.backendId && (
                            <span className="bg-amber-600 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                              ✓ DB
                            </span>
                          )}
                          <span className="bg-purple-600 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                            Local
                          </span>
                        </div>

                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-amber-600 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                            🐘 Amboseli
                          </span>
                        </div>

                        <div className="absolute top-12 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleEditPackage(route)}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 md:p-2 rounded-full shadow-lg transition-colors"
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

                        <div className="h-24 md:h-32 bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center">
                          <div className="text-white text-center p-2">
                            <h3 className="text-xs md:text-sm font-bold mb-0.5 md:mb-1">
                              {route.name.split("→")[0].trim()}
                            </h3>
                            <div className="w-6 md:w-8 h-0.5 bg-white mx-auto mb-0.5 md:mb-1"></div>
                            <p className="text-[10px] md:text-xs text-amber-100">
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
                                className="text-amber-600 text-[9px] md:text-[10px] font-semibold mt-1 hover:underline flex items-center gap-1"
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
                                    className="bg-amber-100 text-amber-700 px-1 py-0.5 rounded text-[8px] md:text-[10px]"
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
                                  className="text-amber-600 text-[9px] md:text-[10px] font-semibold mt-1 hover:underline flex items-center gap-1"
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
                            <div className="text-amber-600 font-bold text-[10px] md:text-xs">
                              €{route.priceRange.min} - €{route.priceRange.max}
                            </div>
                            <span className="text-[8px] md:text-[10px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                              {route.duration}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRouteSelect(route)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-1 md:py-1.5 px-2 rounded-lg font-semibold text-[10px] md:text-xs transition-all duration-300"
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
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
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

        {/* Kilimanjaro Information */}
        <div className="mb-16">
          <SectionHeader
            title="Kilimanjaro & Elephant Experience"
            section="kilimanjaro"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Africa's Tallest Backdrop
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Mount Kilimanjaro, Africa's highest peak at 5,895 meters,
                    provides a dramatic backdrop to Amboseli's wildlife. The
                    best views are typically in the early morning and late
                    afternoon when clouds clear. The contrast between the
                    snow-capped peak and the African savannah creates one of the
                    continent's most iconic scenes.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Best Viewing:</strong> Early morning (6-8 AM) and
                      late afternoon (4-6 PM)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Elephant Research:</strong> Home to the Amboseli
                      Elephant Research Project
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Swamp Ecosystems:</strong> Permanent swamps fed by
                      Kilimanjaro's underground rivers
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Photography:</strong> Prime location for wildlife
                      photography with mountain backdrop
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Elephant Conservation
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded mr-3">
                        <span className="text-amber-600 font-bold">🐘</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Long-term Research
                        </p>
                        <p className="text-sm text-gray-600">
                          Continuous elephant study since 1972 - world's longest
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded mr-3">
                        <span className="text-amber-600 font-bold">📊</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Individual Recognition
                        </p>
                        <p className="text-sm text-gray-600">
                          Over 1,500 elephants identified and monitored
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded mr-3">
                        <span className="text-amber-600 font-bold">👵</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Famous Elephants
                        </p>
                        <p className="text-sm text-gray-600">
                          Home to Tim, one of Africa's largest and most famous
                          elephants
                        </p>
                      </div>
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
              Plan Your Amboseli Adventure
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200 hover:shadow-xl transition-all duration-300 group">
              <div className="relative p-4 md:p-6">
                <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl md:text-3xl">
                    1
                  </span>
                </div>
                <div className="pl-8 md:pl-10 pt-2 text-center sm:text-left">
                  <div className="mb-3 flex justify-center sm:justify-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-amber-600"
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
                    Select from 7 premium lodges for your Amboseli stay
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200 hover:shadow-xl transition-all duration-300 group">
              <div className="relative p-4 md:p-6">
                <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl md:text-3xl">
                    2
                  </span>
                </div>
                <div className="pl-8 md:pl-10 pt-2 text-center sm:text-left">
                  <div className="mb-3 flex justify-center sm:justify-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-amber-600"
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200 hover:shadow-xl transition-all duration-300 group">
              <div className="relative p-4 md:p-6">
                <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl md:text-3xl">
                    3
                  </span>
                </div>
                <div className="pl-8 md:pl-10 pt-2 text-center sm:text-left">
                  <div className="mb-3 flex justify-center sm:justify-start">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-amber-600"
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
                    <span className="bg-amber-600/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                      ⭐ {selectedAttraction.highlight}
                    </span>
                    <span className="bg-amber-700/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                      📅 Best: {selectedAttraction.bestTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
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
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <svg
                      className="w-8 h-8 text-amber-600 mx-auto mb-2"
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
                    <p className="font-semibold text-amber-600">
                      {selectedAttraction.bestTime}
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <svg
                      className="w-8 h-8 text-amber-600 mx-auto mb-2"
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
                    <p className="font-semibold text-amber-600">
                      {selectedAttraction.highlight}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAttractionModal(false)}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl font-semibold transition-all duration-300"
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
                  placeholder="e.g., 3-Day Amboseli Safari Adventure"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  "Amboseli → " will be added automatically
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  placeholder="e.g., Kilimanjaro Views, Elephant Herds, Bird Watching"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="number"
                      placeholder="Price (€)"
                      value={option.price}
                      onChange={(e) =>
                        handlePriceOptionChange(index, "price", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                >
                  + Add Price Option
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="number"
                      placeholder="Price (€)"
                      value={option.price}
                      onChange={(e) =>
                        handlePriceOptionChange(index, "price", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                >
                  + Add Price Option
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300"
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
                      className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-300"
                    >
                      <span className="font-semibold text-gray-800">
                        {option.people}{" "}
                        {option.people === 1 ? "Traveler" : "Travelers"}
                      </span>
                      <span className="text-amber-600 font-bold text-xl">
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
                Select Your Amboseli Lodge
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
                {amboseliLodges.map((lodge) => (
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
                            className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-600 font-bold">
                          {lodge.priceRange}
                        </span>
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="Any special requirements, photography interests, Kilimanjaro viewing preferences, or questions about elephant encounters..."
                ></textarea>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
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
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50"
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

export default Amboseli;
