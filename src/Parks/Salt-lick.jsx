import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SaltLick = () => {
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
    lodgeInfo: false,
    gallery: false,
    attractions: false,
    packages: false,
    waterhole: false,
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
      { people: 2, price: 350, currency: "usd" },
      { people: 3, price: 300, currency: "usd" },
      { people: 4, price: 280, currency: "usd" },
      { people: 5, price: 260, currency: "usd" },
      { people: 6, price: 240, currency: "usd" },
      { people: 7, price: 230, currency: "usd" },
      { people: 8, price: 220, currency: "usd" },
    ],
  });

  const defaultSafariRoutes = [
    {
      id: 1,
      name: "Salt Lick → Tsavo West → Amboseli Safari",
      description:
        "Classic safari combining Salt Lick's unique waterhole viewing with Tsavo's volcanic landscapes and Amboseli's elephants. This is a longer description to test the show more functionality on the card.",
      duration: "4-7 days recommended",
      highlights: [
        "Waterhole Viewing",
        "Volcanic Landscapes",
        "Kilimanjaro Views",
      ],
      fullItinerary:
        "Day 1: Arrival at Salt Lick Safari Lodge, check-in and waterhole viewing. Day 2: Full day at Salt Lick with game drives and photography. Day 3: Transfer to Tsavo West, visit Mzima Springs and Shetani Lava Flow. Day 4: Game drives in Tsavo West exploring volcanic terrain. Day 5: Travel to Amboseli, afternoon game drive. Day 6: Amboseli game drives with Kilimanjaro views. Day 7: Departure.",
      priceOptions: [
        { people: 2, price: 450, currency: "usd" },
        { people: 3, price: 380, currency: "usd" },
        { people: 4, price: 340, currency: "usd" },
        { people: 5, price: 310, currency: "usd" },
        { people: 6, price: 290, currency: "usd" },
        { people: 7, price: 270, currency: "usd" },
        { people: 8, price: 260, currency: "usd" },
      ],
      priceRange: { min: 260, max: 450 },
    },
    {
      id: 2,
      name: "Salt Lick Exclusive Wildlife Experience",
      description:
        "Extended stay focusing on Salt Lick's unique 24-hour wildlife viewing and private game drives. Perfect for those who want to immerse themselves in the waterhole experience.",
      duration: "3-5 days recommended",
      highlights: ["24-hour Viewing", "Private Drives", "Photography Hides"],
      fullItinerary:
        "Day 1: Arrival and orientation at Salt Lick, evening waterhole viewing. Day 2: Morning game drive in Tsavo West, afternoon waterhole photography. Day 3: Full day private game drive with picnic lunch. Day 4: Bush breakfast, guided nature walk, evening sundowner. Day 5: Morning game drive and departure.",
      priceOptions: [
        { people: 2, price: 400, currency: "usd" },
        { people: 3, price: 350, currency: "usd" },
        { people: 4, price: 320, currency: "usd" },
        { people: 5, price: 300, currency: "usd" },
        { people: 6, price: 280, currency: "usd" },
        { people: 7, price: 270, currency: "usd" },
        { people: 8, price: 260, currency: "usd" },
      ],
      priceRange: { min: 260, max: 400 },
    },
    {
      id: 3,
      name: "Salt Lick Luxury Photographic Safari",
      description:
        "Premium experience for photographers with specialized hides, expert guides, and luxury accommodations. Capture the perfect waterhole wildlife shots.",
      duration: "4-6 days recommended",
      highlights: ["Photography Hides", "Expert Guides", "Luxury Package"],
      fullItinerary:
        "Day 1: Arrival and photography equipment setup, sunset waterhole shoot. Day 2: Early morning photo session at waterhole, afternoon editing workshop. Day 3: Full day photography safari with expert guide. Day 4: Specialized hide photography, night photography session. Day 5: Portfolio review, optional cultural visit. Day 6: Final game drive and departure.",
      priceOptions: [
        { people: 2, price: 550, currency: "usd" },
        { people: 3, price: 480, currency: "usd" },
        { people: 4, price: 420, currency: "usd" },
        { people: 5, price: 380, currency: "usd" },
        { people: 6, price: 350, currency: "usd" },
        { people: 7, price: 330, currency: "usd" },
        { people: 8, price: 320, currency: "usd" },
      ],
      priceRange: { min: 320, max: 550 },
    },
    {
      id: 4,
      name: "Salt Lick → Tsavo East → Taita Hills Safari",
      description:
        "Comprehensive safari covering Tsavo's red elephants, Taita Hills' unique wildlife, and Salt Lick's famous waterholes for a complete Tsavo region experience.",
      duration: "5-7 days recommended",
      highlights: ["Red Elephants", "Taita Hills", "Waterhole Spectacle"],
      fullItinerary:
        "Day 1: Arrival at Salt Lick, waterhole viewing. Day 2: Salt Lick game drives and photography. Day 3: Travel to Tsavo East, afternoon game drive. Day 4: Full day Tsavo East exploring red elephant herds. Day 5: Travel to Taita Hills Sanctuary, evening game drive. Day 6: Taita Hills exploration. Day 7: Departure.",
      priceOptions: [
        { people: 2, price: 520, currency: "usd" },
        { people: 3, price: 440, currency: "usd" },
        { people: 4, price: 390, currency: "usd" },
        { people: 5, price: 350, currency: "usd" },
        { people: 6, price: 330, currency: "usd" },
        { people: 7, price: 310, currency: "usd" },
        { people: 8, price: 290, currency: "usd" },
      ],
      priceRange: { min: 290, max: 520 },
    },
    {
      id: 5,
      name: "Salt Lick Budget Safari Experience",
      description:
        "Affordable safari package focusing on the best of Salt Lick's waterhole viewing and Tsavo West's highlights without breaking the bank.",
      duration: "2-3 days recommended",
      highlights: ["Budget Friendly", "Waterhole Focus", "Great Value"],
      fullItinerary:
        "Day 1: Arrival at Salt Lick, afternoon waterhole viewing. Day 2: Morning game drive in Tsavo West, evening waterhole photography. Day 3: Final waterhole viewing, departure.",
      priceOptions: [
        { people: 2, price: 250, currency: "usd" },
        { people: 3, price: 220, currency: "usd" },
        { people: 4, price: 200, currency: "usd" },
        { people: 5, price: 185, currency: "usd" },
        { people: 6, price: 175, currency: "usd" },
        { people: 7, price: 165, currency: "usd" },
        { people: 8, price: 155, currency: "usd" },
      ],
      priceRange: { min: 155, max: 250 },
    },
    {
      id: 6,
      name: "Salt Lick Family Adventure Safari",
      description:
        "Family-friendly safari with activities for all ages, including waterhole viewing, game drives, and educational wildlife programs for children.",
      duration: "3-4 days recommended",
      highlights: ["Family Activities", "Child Friendly", "Educational"],
      fullItinerary:
        "Day 1: Arrival, family welcome, waterhole introduction. Day 2: Morning game drive with kids' activity booklet. Day 3: Nature walk, waterhole drawing session. Day 4: Farewell breakfast, departure.",
      priceOptions: [
        { people: 2, price: 380, currency: "usd" },
        { people: 3, price: 340, currency: "usd" },
        { people: 4, price: 310, currency: "usd" },
        { people: 5, price: 290, currency: "usd" },
        { people: 6, price: 270, currency: "usd" },
        { people: 7, price: 260, currency: "usd" },
        { people: 8, price: 250, currency: "usd" },
      ],
      priceRange: { min: 250, max: 380 },
    },
    {
      id: 7,
      name: "Salt Lick Honeymoon Special",
      description:
        "Romantic safari experience with private waterhole viewing, luxury accommodations, and special surprises for newlyweds.",
      duration: "3-4 days recommended",
      highlights: ["Romantic Setup", "Private Dining", "Spa Treatment"],
      fullItinerary:
        "Day 1: Welcome champagne and flower setup, private sunset viewing. Day 2: Private game drive with picnic, couples massage. Day 3: Bush dinner under the stars, waterhole romance. Day 4: Farewell breakfast in bed, departure.",
      priceOptions: [
        { people: 2, price: 600, currency: "usd" },
        { people: 3, price: 520, currency: "usd" },
        { people: 4, price: 460, currency: "usd" },
      ],
      priceRange: { min: 460, max: 600 },
    },
  ];

  const [safariRoutes, setSafariRoutes] = useState(() => {
    try {
      const savedRoutes = localStorage.getItem("saltLickPackages");
      if (savedRoutes) {
        return JSON.parse(savedRoutes);
      }
      localStorage.setItem(
        "saltLickPackages",
        JSON.stringify(defaultSafariRoutes),
      );
      return defaultSafariRoutes;
    } catch (error) {
      console.error("Error loading Salt Lick packages:", error);
      return defaultSafariRoutes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("saltLickPackages", JSON.stringify(safariRoutes));
    } catch (error) {
      console.error("Error saving Salt Lick packages:", error);
    }
  }, [safariRoutes]);

  const saveSafariRoutesToStorage = (routes) => {
    try {
      localStorage.setItem("saltLickPackages", JSON.stringify(routes));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      Swal.fire({
        title: "Storage Error",
        text: "Could not save safari packages. Please try again.",
        icon: "error",
        confirmButtonColor: "#92400e",
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
          // Filter packages that start with "Salt Lick" or contain "Salt Lick" at the beginning
          const filteredPackages =
            packagesData.success && packagesData.data
              ? packagesData.data.filter(
                  (pkg) =>
                    pkg.name &&
                    (pkg.name.toLowerCase().startsWith("salt lick") ||
                      pkg.name.toLowerCase().startsWith("salt lick →") ||
                      pkg.name.toLowerCase().includes("salt lick")),
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
                    currency: "usd",
                  },
                  {
                    people: 4,
                    price: basePrice.prices.pax_4_price || 280,
                    currency: "usd",
                  },
                  {
                    people: 6,
                    price: basePrice.prices.pax_6_price || 240,
                    currency: "usd",
                  },
                  {
                    people: 8,
                    price: basePrice.prices.pax_8_price || 220,
                    currency: "usd",
                  },
                ]
              : defaultSafariRoutes[0].priceOptions,
          priceRange: {
            min:
              hasPrices && basePrice.prices
                ? Math.min(
                    basePrice.prices.pax_2_price || 350,
                    basePrice.prices.pax_4_price || 280,
                    basePrice.prices.pax_6_price || 240,
                    basePrice.prices.pax_8_price || 220,
                  )
                : 150,
            max:
              hasPrices && basePrice.prices
                ? Math.max(
                    basePrice.prices.pax_2_price || 350,
                    basePrice.prices.pax_4_price || 280,
                    basePrice.prices.pax_6_price || 240,
                    basePrice.prices.pax_8_price || 220,
                  )
                : 600,
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
        const bookingData = localStorage.getItem("saltLickBooking");
        if (bookingData) {
          const parsedData = JSON.parse(bookingData);
          if (
            parsedData.park &&
            parsedData.park.name === "Salt Lick Safari Lodge" &&
            parsedData.lodge
          ) {
            setSelectedLodge(parsedData.lodge);
          }
        }
      } catch (error) {
        console.error("Error loading room selection:", error);
      }
    };

    checkExistingSelection();
  }, []);

  const lodgeInfo = {
    id: 8,
    name: "Salt Lick Safari Lodge",
    tagline: "Iconic Wildlife Experience in the Heart of Tsavo West",
    mainImage: "/assets/saltlick-1.png",
    fallbackImage: "/assets/default-lodge.jpg",
    description:
      "A world-renowned safari lodge famous for its unique stilted architecture, floodlit waterholes, and unparalleled wildlife viewing at the edge of Tsavo West National Park.",
    highlights: [
      "Famous elevated stilted architecture with wildlife viewing from your room",
      "Floodlit waterholes for 24-hour game viewing",
      "Located in the private Taita Hills Wildlife Sanctuary",
      "Direct access to Tsavo West National Park",
      "Traditional Kenyan hospitality with modern amenities",
    ],
    bestTime: "Year-round destination with peak wildlife viewing June-October",
    wildlife:
      "Elephants, Lions, Leopards, Buffalo, Rhinos, Giraffes, Zebras, Wildebeest, Antelopes",
    location:
      "Taita Hills Wildlife Sanctuary, bordering Tsavo West National Park",
    specialFeature:
      "Unique treehouse-style lodge offering wildlife viewing from private balconies",
    accommodations: {
      rooms: 96,
      types: ["Standard Rooms", "Family Suites", "Executive Suites"],
      features: ["Private Balconies", "En-suite Bathrooms", "Wildlife Views"],
    },
  };

  const saltLickRooms = [
    {
      name: "Standard Room",
      image: "/assets/rooms.png",
      fallbackImage: "/assets/default-lodge.jpg",
      description:
        "Comfortable accommodation with private balcony overlooking the waterhole. Perfect for wildlife enthusiasts seeking authentic bush experience.",
      gallery: [
        "/assets/saltlick-1.png",
        "/assets/rooms.png",
        "/assets/water-hole.png",
      ],
      priceRange: "$$",
      features: ["Waterhole View", "Private Balcony", "En-suite Bathroom"],
    },
    {
      name: "Family Suite",
      image: "/assets/family-suite.jpg",
      fallbackImage: "/assets/default-lodge.jpg",
      description:
        "Spacious suite with separate bedrooms, perfect for families or small groups traveling together.",
      gallery: [
        "/assets/family-suite.jpg",
        "/assets/family-suite-2.jpg",
        "/assets/family-suite-3.jpg",
      ],
      priceRange: "$$$",
      features: ["Two Bedrooms", "Living Area", "Panoramic Views"],
    },
    {
      name: "Executive Suite",
      image: "/assets/executive-suite.jpg",
      fallbackImage: "/assets/default-lodge.jpg",
      description:
        "Luxurious suite with premium amenities and exclusive waterhole viewing area for the ultimate safari experience.",
      gallery: [
        "/assets/executive-suite.jpg",
        "/assets/executive-suite-2.jpg",
        "/assets/executive-suite-3.jpg",
      ],
      priceRange: "$$$$",
      features: ["Premium View", "Butler Service", "Luxury Amenities"],
    },
  ];

  const galleryImages = [
    {
      id: 1,
      src: "/assets/saltlick-1.png",
      fallback: "/assets/default-lodge.jpg",
      title: "Iconic Stilted Architecture",
      description: "Unique treehouse-style lodge design overlooking waterholes",
      category: "architecture",
    },
    {
      id: 2,
      src: "/assets/soil-taita.png",
      fallback: "/assets/default-lodge.jpg",
      title: "Lodge Exterior",
      description: "The famous elevated walkways connecting rooms",
      category: "architecture",
    },
    {
      id: 3,
      src: "/assets/water-hole.png",
      fallback: "/assets/default-lodge.jpg",
      title: "Floodlit Waterhole",
      description: "24-hour wildlife viewing at illuminated waterholes",
      category: "wildlife",
    },
    {
      id: 4,
      src: "/assets/rooms.png",
      fallback: "/assets/default-lodge.jpg",
      title: "Lodge Room",
      description: "Comfortable accommodation with wildlife views",
      category: "accommodation",
    },
    {
      id: 5,
      src: "/assets/restuarant.png",
      fallback: "/assets/default-lodge.jpg",
      title: "Restaurant View",
      description: "Dining with panoramic views of the sanctuary",
      category: "facilities",
    },
    {
      id: 6,
      src: "/assets/elephant-waterhole.jpg",
      fallback: "/assets/default-lodge.jpg",
      title: "Elephant Gathering",
      description: "Large herds of elephants at the waterhole",
      category: "wildlife",
    },
    {
      id: 7,
      src: "/assets/lion-waterhole.jpg",
      fallback: "/assets/default-lodge.jpg",
      title: "Lions at Night",
      description: "Predators visiting the floodlit waterhole",
      category: "wildlife",
    },
    {
      id: 8,
      src: "/assets/saltlick-sunset.jpg",
      fallback: "/assets/default-lodge.jpg",
      title: "Sunset View",
      description: "Stunning sunset views from the lodge decks",
      category: "landscape",
    },
    {
      id: 9,
      src: "/assets/saltlick-pool.jpg",
      fallback: "/assets/default-lodge.jpg",
      title: "Swimming Pool",
      description: "Refreshing pool with wildlife viewing",
      category: "facilities",
    },
    {
      id: 10,
      src: "/assets/buffalo-waterhole.jpg",
      fallback: "/assets/default-lodge.jpg",
      title: "Buffalo Herd",
      description: "Large herds of buffalo visiting the waterhole",
      category: "wildlife",
    },
    {
      id: 11,
      src: "/assets/saltlick-bar.jpg",
      fallback: "/assets/default-lodge.jpg",
      title: "Sundowner Bar",
      description: "Evening drinks with wildlife viewing",
      category: "facilities",
    },
    {
      id: 12,
      src: "/assets/rhino-waterhole.jpg",
      fallback: "/assets/default-lodge.jpg",
      title: "Rhino Sighting",
      description: "Rare rhino sightings at the waterhole",
      category: "wildlife",
    },
  ];

  const attractions = [
    {
      id: 1,
      name: "Floodlit Waterholes",
      image: "/assets/water-hole.png",
      fallback: "/assets/default-lodge.jpg",
      description:
        "Illuminated waterholes for 24-hour wildlife viewing from the comfort of the lodge.",
      bestTime: "Evening and night",
      highlight: "Nocturnal wildlife viewing",
      details:
        "Salt Lick's floodlit waterholes are the heart of the lodge experience. Animals gather throughout the day and night to drink, providing guests with continuous wildlife viewing opportunities. The strategic lighting allows for observation and photography without disturbing the natural behavior of the animals.",
    },
    {
      id: 2,
      name: "Tsavo West Game Drives",
      image: "/assets/tsavo-west.jpg",
      fallback: "/assets/default-lodge.jpg",
      description:
        "Access to Tsavo West National Park for safari drives exploring volcanic landscapes.",
      bestTime: "Early morning and late afternoon",
      highlight: "Big Five sightings",
      details:
        "Tsavo West National Park is known for its dramatic volcanic landscapes, including the Shetani Lava Flow and Mzima Springs. Game drives offer chances to see elephant herds, lions, leopards, and the rare rhino.",
    },
    {
      id: 3,
      name: "Photography Hides",
      image: "/assets/photography-hide.jpg",
      fallback: "/assets/default-lodge.jpg",
      description:
        "Specialized hides for wildlife photography at waterhole level.",
      bestTime: "Golden hour",
      highlight: "Professional photography opportunities",
      details:
        "Purpose-built photography hides bring you to waterhole level for eye-level wildlife photography. Perfect for capturing elephants drinking, birds in flight, and predators on the prowl.",
    },
    {
      id: 4,
      name: "Bush Dinners",
      image: "/assets/bush-dinner.jpg",
      fallback: "/assets/default-lodge.jpg",
      description: "Romantic dinners under the stars in the African bush.",
      bestTime: "Evening",
      highlight: "Unique dining experience",
      details:
        "Experience the magic of dining in the African wilderness. Bush dinners feature gourmet cuisine served under a canopy of stars, with the sounds of the bush as your soundtrack.",
    },
    {
      id: 5,
      name: "Nature Walks",
      image: "/assets/nature-walk.jpg",
      fallback: "/assets/default-lodge.jpg",
      description:
        "Guided walks in the Taita Hills Sanctuary with expert naturalists.",
      bestTime: "Morning",
      highlight: "Close-up nature experience",
      details:
        "Explore the smaller wonders of the bush on guided nature walks. Learn about tracks, plants, insects, and birds from expert guides who bring the ecosystem to life.",
    },
    {
      id: 6,
      name: "Campfire Evenings",
      image: "/assets/campfire.jpg",
      fallback: "/assets/default-lodge.jpg",
      description:
        "Traditional campfire gatherings with storytelling and stargazing.",
      bestTime: "Evening",
      highlight: "Cultural experience",
      details:
        "Gather around the campfire for evening storytelling, traditional Maasai songs, and stargazing. Share safari stories with fellow travelers while enjoying the warmth of the fire.",
    },
  ];

  const openAttractionModal = (attraction) => {
    setSelectedAttraction(attraction);
    setShowAttractionModal(true);
  };

  const handleEditPackage = (route) => {
    setEditingRoute(route);
    setAdminForm({
      routeName: route.name.replace("Salt Lick → ", "").trim(),
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

    const routeName = adminForm.routeName.toLowerCase().includes("salt lick")
      ? adminForm.routeName
      : `Salt Lick → ${adminForm.routeName}`;

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
            <p class="text-sm"><strong>Price Range:</strong> $${minPrice} - $${maxPrice}</p>
            <p class="text-sm"><strong>Duration:</strong> ${updatedRoute.duration}</p>
          </div>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#92400e",
    });

    setShowEditModal(false);
    setEditingRoute(null);
  };

  const savePackageToBackend = async (packageData) => {
    try {
      setIsLoading(true);

      const routeName = packageData.name.toLowerCase().includes("salt lick")
        ? packageData.name
        : `Salt Lick → ${packageData.name}`;

      const backendPackage = {
        name: routeName,
        description: packageData.description,
        duration: packageData.duration || "3-5 days recommended",
        itinerary: packageData.fullItinerary || "",
        priceOptions: packageData.priceOptions.map((option) => ({
          people: option.people,
          price: option.price,
          currency: option.currency || "usd",
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
          confirmButtonColor: "#92400e",
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
        confirmButtonColor: "#92400e",
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
          // Filter packages that start with "Salt Lick"
          const filteredPackages = packagesData.data.filter(
            (pkg) =>
              pkg.name &&
              (pkg.name.toLowerCase().startsWith("salt lick") ||
                pkg.name.toLowerCase().startsWith("salt lick →") ||
                pkg.name.toLowerCase().includes("salt lick")),
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
                        currency: "usd",
                      },
                      {
                        people: 4,
                        price: basePrice.prices.pax_4_price || 280,
                        currency: "usd",
                      },
                      {
                        people: 6,
                        price: basePrice.prices.pax_6_price || 240,
                        currency: "usd",
                      },
                      {
                        people: 8,
                        price: basePrice.prices.pax_8_price || 220,
                        currency: "usd",
                      },
                    ]
                  : defaultSafariRoutes[0].priceOptions,
              priceRange: {
                min:
                  hasPrices && basePrice.prices
                    ? Math.min(
                        basePrice.prices.pax_2_price || 350,
                        basePrice.prices.pax_4_price || 280,
                        basePrice.prices.pax_6_price || 240,
                        basePrice.prices.pax_8_price || 220,
                      )
                    : 150,
                max:
                  hasPrices && basePrice.prices
                    ? Math.max(
                        basePrice.prices.pax_2_price || 350,
                        basePrice.prices.pax_4_price || 280,
                        basePrice.prices.pax_6_price || 240,
                        basePrice.prices.pax_8_price || 220,
                      )
                    : 600,
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
            text: `Loaded ${backendPackages.length} Salt Lick packages from backend`,
            icon: "success",
            confirmButtonColor: "#92400e",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Sync Failed",
        text: "Could not sync with backend. Please check your connection.",
        icon: "error",
        confirmButtonColor: "#92400e",
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
        confirmButtonColor: "#92400e",
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
        confirmButtonColor: "#92400e",
      });
      return;
    }

    setAdminForm({
      ...adminForm,
      priceOptions: [
        ...adminForm.priceOptions,
        { people: nextPeople, price: 300, currency: "usd" },
      ],
    });
  };

  const removePriceOption = (index) => {
    if (adminForm.priceOptions.length <= 2) {
      Swal.fire({
        title: "Minimum Required",
        text: "You need at least 2 price options.",
        icon: "warning",
        confirmButtonColor: "#92400e",
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

    const routeName = adminForm.routeName.toLowerCase().includes("salt lick")
      ? adminForm.routeName
      : `Salt Lick → ${adminForm.routeName}`;

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
            <p class="text-sm"><strong>Price Range:</strong> $${minPrice} - $${maxPrice}</p>
            <p class="text-sm"><strong>Duration:</strong> ${newRoute.duration}</p>
          </div>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#92400e",
    });

    setAdminForm({
      routeName: "",
      description: "",
      duration: "3-5 days recommended",
      highlights: "",
      itinerary: "",
      priceOptions: [
        { people: 2, price: 350, currency: "usd" },
        { people: 3, price: 300, currency: "usd" },
        { people: 4, price: 280, currency: "usd" },
        { people: 5, price: 260, currency: "usd" },
        { people: 6, price: 240, currency: "usd" },
        { people: 7, price: 230, currency: "usd" },
        { people: 8, price: 220, currency: "usd" },
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
      confirmButtonColor: "#92400e",
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
          confirmButtonColor: "#92400e",
        });
      }
    });
  };

  const handleRouteSelect = async (route) => {
    if (!selectedLodge) {
      const result = await Swal.fire({
        title: "Room Selection Required",
        html: `
          <div class="text-left">
            <p class="mb-4">To book a Salt Lick safari package, you must first select your room type.</p>
            <div class="bg-amber-50 p-3 rounded-lg mb-4">
              <p class="font-semibold">Why select a room first?</p>
              <p class="text-sm">Salt Lick offers different room categories with varying views and amenities. Your chosen room affects your overall experience.</p>
            </div>
            <p class="text-sm text-gray-600">You'll select from 3 room types including Standard Rooms, Family Suites, and Executive Suites.</p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#92400e",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Choose Room Now",
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

  const handleRoomSelection = async (room) => {
    Swal.fire({
      title: "Selecting Room...",
      text: "Please wait while we save your room preference.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      setSelectedLodge(room);

      const bookingData = {
        park: lodgeInfo,
        lodge: room,
        step: "room_selected",
        timestamp: new Date().toISOString(),
        page: "SaltLick",
      };
      try {
        localStorage.setItem("saltLickBooking", JSON.stringify(bookingData));
      } catch (error) {
        console.error("Error saving room selection:", error);
      }

      Swal.fire({
        title: "Room Selected!",
        html: `<strong>${room.name}</strong> has been selected for your Salt Lick stay.`,
        icon: "success",
        confirmButtonColor: "#92400e",
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
          `Day ${i}: Arrival at Salt Lick Safari Lodge, check-in to ${
            selectedLodge?.name || "selected room"
          } and afternoon waterhole viewing`,
        );
      } else if (i === days) {
        itineraries.push(
          `Day ${i}: Final morning game drive in Tsavo West, breakfast, and departure`,
        );
      } else {
        const parksInRoute = route.split("→").map((park) => park.trim());
        const currentParkIndex = Math.min(i - 2, parksInRoute.length - 1);
        if (
          parksInRoute[currentParkIndex] &&
          (parksInRoute[currentParkIndex].includes("Salt Lick") ||
            parksInRoute[currentParkIndex].includes("Salt"))
        ) {
          itineraries.push(
            `Day ${i}: Full day at Salt Lick with waterhole photography, game drives, and lodge activities. Staying in ${selectedLodge?.name || "your room"}`,
          );
        } else if (parksInRoute[currentParkIndex]) {
          itineraries.push(
            `Day ${i}: Travel to ${parksInRoute[currentParkIndex]} for wildlife viewing and exploration`,
          );
        } else {
          itineraries.push(
            `Day ${i}: Game drive and wildlife viewing in the Taita Hills Sanctuary`,
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
        title: "Room Selection Required",
        text: "Please select a room before proceeding with booking.",
        icon: "warning",
        confirmButtonColor: "#92400e",
      });
      return false;
    }
    if (!selectedRoute) {
      Swal.fire({
        title: "Safari Route Required",
        text: "Please select a safari route package.",
        icon: "warning",
        confirmButtonColor: "#92400e",
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
          confirmButtonColor: "#92400e",
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
SALT LICK SAFARI LODGE BOOKING DETAILS:

📍 LODGE: ${bookingData.park}
🏨 ROOM TYPE: ${bookingData.lodge}
🚗 ROUTE/ITINERARY: ${bookingData.route}
📅 DURATION: ${bookingData.days} days
👥 TRAVELERS: ${bookingData.travelers} pax
💰 ESTIMATED TOTAL PRICE: $${bookingData.totalPrice}
📝 ITINERARY TYPE: ${bookingData.route}

🏨 ROOM DETAILS:
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

🌟 LODGE HIGHLIGHTS:
${lodgeInfo.highlights.map((highlight) => `• ${highlight}`).join("\n")}

🐘 WILDLIFE: ${lodgeInfo.wildlife}
📍 LOCATION: ${lodgeInfo.location}

📧 This booking was made from the Salt Lick Safari Lodge page.
    `.trim();

    window.open(
      `mailto:tembo4401@gmail.com?subject=Salt Lick Safari Lodge Booking: ${
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
        park: lodgeInfo.name,
        lodge: selectedLodge.name,
        days: selectedDays,
        travelers: bookingForm.travelers,
        totalPrice: totalPrice,
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        startDate: bookingForm.startDate || "Flexible",
        message: bookingForm.message || "",
        parkHighlights: lodgeInfo.highlights.join(", "),
        bestTime: lodgeInfo.bestTime,
        wildlife: lodgeInfo.wildlife,
        specialFeature: lodgeInfo.specialFeature,
        lodgeDescription: selectedLodge.description,
        itinerary: itinerary.join("\n"),
        bookingSource: "Salt Lick Lodge Page",
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

  const handleClearRoomSelection = () => {
    Swal.fire({
      title: "Change Room?",
      text: "Are you sure you want to change your selected room?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#92400e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedLodge(null);
        try {
          localStorage.removeItem("saltLickBooking");
        } catch (error) {
          console.error("Error removing room selection:", error);
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={lodgeInfo.mainImage}
          alt={lodgeInfo.name}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, lodgeInfo.fallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 font-serif">
              {lodgeInfo.name}
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-light">
              {lodgeInfo.tagline}
            </p>
            <p className="text-base md:text-xl max-w-2xl">
              {lodgeInfo.description}
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
                <span className="font-semibold">Room Selected:</span>
                {selectedLodge.name}
                <button
                  onClick={handleClearRoomSelection}
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
        {/* Lodge Information Section */}
        <div className="mb-16">
          <SectionHeader
            title="Discover Salt Lick Safari Lodge"
            section="lodgeInfo"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Perched on stilts overlooking a natural waterhole in the Taita
                  Hills Wildlife Sanctuary, Salt Lick Safari Lodge offers one of
                  Africa's most unique wildlife experiences. The lodge's
                  distinctive architecture allows guests to observe animals from
                  the comfort of their rooms or from the numerous viewing decks,
                  with floodlit waterholes providing 24-hour game viewing
                  opportunities.
                </p>

                <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-amber-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      Your Salt Lick Accommodation
                    </h3>
                    {!selectedLodge ? (
                      <button
                        onClick={() => setShowLodgeModal(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full sm:w-auto"
                      >
                        Choose Room
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
                          onClick={handleClearRoomSelection}
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
                      <p className="text-gray-700 mb-3">No room selected yet</p>
                      <p className="text-gray-600 text-sm">
                        Choose from 3 room types for your Salt Lick stay
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Lodge Highlights
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {lodgeInfo.highlights.map((highlight, index) => (
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
                      <p className="text-gray-700">{lodgeInfo.bestTime}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Key Wildlife
                      </h4>
                      <p className="text-gray-700">{lodgeInfo.wildlife}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Location
                      </h4>
                      <p className="text-gray-700">{lodgeInfo.location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Special Feature
                      </h4>
                      <p className="text-gray-700">
                        {lodgeInfo.specialFeature}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Why Choose Salt Lick?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        24/7 Wildlife Viewing
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Floodlit waterholes allow observation of nocturnal
                        wildlife from your room.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Unique Architecture
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Stilted design provides panoramic views and a true bush
                        experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Photographer's Paradise
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Ideal for wildlife photography with hides and perfect
                        lighting conditions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <span className="text-amber-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Family Friendly
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Safe environment with family suites and activities for
                        all ages.
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
                    Step 1: Select Your Room
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
                Browse Rooms
              </button>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className="mb-16">
          <SectionHeader title="Salt Lick Gallery" section="gallery">
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Experience the unique architecture and incredible wildlife viewing
              opportunities at Salt Lick Safari Lodge through our collection of
              images.
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
            title="Top Attractions at Salt Lick"
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
          <SectionHeader title="Salt Lick Safari Packages" section="packages">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">
                  {selectedLodge
                    ? `Packages available with your selected room: ${selectedLodge.name}`
                    : "Select a room first to view available packages"}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  📍 Only showing packages starting from Salt Lick
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
                        ? `${backendStatus.packageCount} Salt Lick packages in database, ${safariRoutes.length} locally`
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
                  Room Selection Required
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Please select your Salt Lick accommodation first. Safari
                  packages are tailored to include your chosen room stay.
                </p>
                <button
                  onClick={() => setShowLodgeModal(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Select Your Room Now
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
                  Click "Add New Package" to create your first Salt Lick safari
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
                            🦁 Salt Lick
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
                              ${route.priceRange.min} - ${route.priceRange.max}
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

        {/* Waterhole Information */}
        <div className="mb-16">
          <SectionHeader title="The Waterhole Experience" section="waterhole">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Wildlife Spectacle
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Salt Lick's floodlit waterholes are the heart of the lodge
                    experience. Animals gather throughout the day and night to
                    drink, providing guests with continuous wildlife viewing
                    opportunities. The strategic lighting allows for observation
                    and photography without disturbing the natural behavior of
                    the animals.
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Daytime:</strong> Herds of elephants, buffalo, and
                      antelopes
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Evening:</strong> Predators including lions and
                      leopards
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Night:</strong> Nocturnal species like hyenas and
                      genets
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Photography:</strong> Perfect lighting conditions
                      for wildlife shots
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Viewing Tips
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded mr-3">
                        <span className="text-amber-600 font-bold">📸</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Best Photography Times
                        </p>
                        <p className="text-sm text-gray-600">
                          Early morning and late afternoon for golden hour
                          lighting
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded mr-3">
                        <span className="text-amber-600 font-bold">🌙</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Night Viewing
                        </p>
                        <p className="text-sm text-gray-600">
                          Use lodge-provided infrared viewers for nocturnal
                          wildlife
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded mr-3">
                        <span className="text-amber-600 font-bold">🔭</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Binocular Rentals
                        </p>
                        <p className="text-sm text-gray-600">
                          High-quality binoculars available for detailed
                          observation
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
              Plan Your Salt Lick Safari
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
                    Choose Your Room
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm">
                    Select from 3 room types for your Salt Lick stay
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
                  placeholder="e.g., Salt Lick → Tsavo West → Amboseli Safari"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  "Salt Lick → " will be added automatically if not present
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
                  placeholder="e.g., Waterhole Viewing, Photography, Luxury Accommodation"
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
                      placeholder="Price ($)"
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
                      placeholder="Price ($)"
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
                        ${option.price}
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

      {/* ROOM SELECTION MODAL */}
      {showLodgeModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Select Your Salt Lick Room
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
                {saltLickRooms.map((room) => (
                  <div
                    key={room.name}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleRoomSelection(room)}
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => handleImageError(e, room.fallbackImage)}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {room.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {room.description.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {room.features.map((feature, idx) => (
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
                          {room.priceRange}
                        </span>
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors">
                          Select This Room
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
                  placeholder="Any special requirements, photography interests, preferred waterhole viewing times, or questions..."
                ></textarea>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">
                  Booking Summary
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Selected Room:</strong> {selectedLodge?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Selected Route:</strong> {selectedRoute?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Travelers:</strong> {bookingForm.travelers} pax
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Estimated Total:</strong> $
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

export default SaltLick;
