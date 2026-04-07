import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Amboseli = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDays, setSelectedDays] = useState(3);
  const [selectedLodge, setSelectedLodge] = useState(null); // NEW: Added lodge state
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLodgeModal, setShowLodgeModal] = useState(false); // NEW: Added lodge modal
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Admin form state
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedRouteForPricing, setSelectedRouteForPricing] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelers: 1,
    message: "",
    startDate: "",
  });

  // NEW: Admin form state
  const [adminForm, setAdminForm] = useState({
    routeName: "",
    description: "",
    duration: "3-5 days recommended",
    highlights: "",
    itinerary: "",
    priceOptions: [
      { people: 1, price: 350, currency: "euro" },
      { people: 2, price: 280, currency: "euro" },
      { people: 3, price: 240, currency: "euro" },
      { people: 4, price: 200, currency: "euro" },
      { people: 5, price: 180, currency: "euro" },
      { people: 6, price: 160, currency: "euro" },
      { people: 7, price: 150, currency: "euro" },
      { people: 8, price: 140, currency: "euro" },
    ],
  });

  // DEFAULT safari routes - only used if localStorage is empty
  const defaultSafariRoutes = [
    {
      id: 1,
      name: "Amboseli → Tsavo East → Tsavo West",
      description:
        "Experience the best of southern Kenya parks with diverse landscapes from savannah to volcanic terrain.",
      duration: "5-7 days recommended",
      highlights: ["Elephant herds", "Kilimanjaro views", "Dual Tsavo parks"],
      itinerary:
        "Day 1: Arrival at Amboseli, afternoon game drive. Day 2: Full day Amboseli with elephant tracking. Day 3: Travel to Tsavo East. Day 4: Tsavo East game drives. Day 5: Tsavo West volcanic terrain. Day 6: Return journey.",
      priceOptions: [
        { people: 1, price: 450, currency: "euro" },
        { people: 2, price: 350, currency: "euro" },
        { people: 3, price: 300, currency: "euro" },
        { people: 4, price: 250, currency: "euro" },
        { people: 5, price: 220, currency: "euro" },
        { people: 6, price: 200, currency: "euro" },
        { people: 7, price: 190, currency: "euro" },
        { people: 8, price: 180, currency: "euro" },
      ],
      priceRange: { min: 180, max: 450 },
    },
    {
      id: 2,
      name: "Amboseli → Nairobi National Park",
      description:
        "Short safari combining Amboseli elephants with Nairobi convenience, perfect for limited time.",
      duration: "3-4 days recommended",
      highlights: ["City safari", "Elephant encounters", "Quick getaway"],
      itinerary:
        "Day 1: Arrival at Amboseli, Kilimanjaro sunset views. Day 2: Full day Amboseli exploration. Day 3: Travel to Nairobi, afternoon Nairobi National Park. Day 4: Morning game drive, departure.",
      priceOptions: [
        { people: 1, price: 300, currency: "euro" },
        { people: 2, price: 250, currency: "euro" },
        { people: 3, price: 220, currency: "euro" },
        { people: 4, price: 200, currency: "euro" },
        { people: 5, price: 180, currency: "euro" },
        { people: 6, price: 160, currency: "euro" },
        { people: 7, price: 150, currency: "euro" },
        { people: 8, price: 140, currency: "euro" },
      ],
      priceRange: { min: 140, max: 300 },
    },
    {
      id: 3,
      name: "Amboseli Exclusive Experience",
      description:
        "Deep dive into Amboseli with extended game drives and luxury accommodation options.",
      duration: "2-4 days recommended",
      highlights: ["Luxury lodges", "Private guides", "Photography focus"],
      itinerary:
        "Day 1: Arrival, luxury lodge check-in, sundowner with Kilimanjaro views. Day 2: Full day private safari with picnic lunch. Day 3: Sunrise photography session, cultural visit. Day 4: Final game drive, departure.",
      priceOptions: [
        { people: 1, price: 600, currency: "euro" },
        { people: 2, price: 500, currency: "euro" },
        { people: 3, price: 450, currency: "euro" },
        { people: 4, price: 400, currency: "euro" },
        { people: 5, price: 380, currency: "euro" },
        { people: 6, price: 350, currency: "euro" },
        { people: 7, price: 330, currency: "euro" },
        { people: 8, price: 320, currency: "euro" },
      ],
      priceRange: { min: 320, max: 600 },
    },
  ];

  // Load safari routes from localStorage on initial load
  const [safariRoutes, setSafariRoutes] = useState(() => {
    try {
      const savedRoutes = localStorage.getItem("amboseliPackages");
      if (savedRoutes) {
        return JSON.parse(savedRoutes);
      }
      // If no saved routes, save default routes to localStorage
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

  // NEW: Save safari routes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("amboseliPackages", JSON.stringify(safariRoutes));
    } catch (error) {
      console.error("Error saving Amboseli packages:", error);
    }
  }, [safariRoutes]);

  // NEW: Function to save safari routes to localStorage
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

  // Check for existing lodge selection from localStorage on component mount
  useEffect(() => {
    const checkExistingSelection = () => {
      try {
        const bookingData = localStorage.getItem("amboseliBooking");
        if (bookingData) {
          const parsedData = JSON.parse(bookingData);
          // Check if the saved booking is for Amboseli
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
      "Famous for its large elephant herds and stunning views of Mount Kilimanjaro.",
    highlights: [
      "Large elephant herds",
      "Spectacular views of Mount Kilimanjaro",
      "Big Five sightings",
      "Swamp ecosystems with hippos and water birds",
      "Maasai cultural experiences",
    ],
    bestTime: "June to October & January to February",
    wildlife: "Elephants, Lions, Cheetahs, Buffaloes, Giraffes, Zebras, Hippos",
    size: "392 km² - Kenya's second most popular national park",
    specialFeature: "Iconic elephant herds with Mount Kilimanjaro backdrop",
  };

  // Amboseli Lodges - NEW: Added lodges for Amboseli
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

  // Amboseli Gallery Images
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

  // Amboseli Attractions
  const attractions = [
    {
      id: 1,
      name: "Observation Hill",
      image: "/assets/obsa-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "360-degree viewpoint overlooking the entire park",
      bestTime: "Sunrise or sunset",
      highlight: "Panoramic Kilimanjaro views",
    },
    {
      id: 2,
      name: "Enkongo Narok Swamp",
      image: "/assets/swamp.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Permanent swamp attracting elephants and hippos",
      bestTime: "Dry season",
      highlight: "Elephant drinking spot",
    },
    {
      id: 3,
      name: "Sinet Delta",
      image: "/assets/delta-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "River delta with diverse birdlife",
      bestTime: "Year-round",
      highlight: "Bird watching paradise",
    },
    {
      id: 4,
      name: "Kitirua Conservancy",
      image: "/assets/con-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Community-owned conservancy bordering the park",
      bestTime: "Year-round",
      highlight: "Cultural interactions",
    },
    {
      id: 5,
      name: "Amboseli Research Centre",
      image: "/assets/tr-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Long-term elephant research facility",
      bestTime: "Year-round",
      highlight: "Scientific insights",
    },
    {
      id: 6,
      name: "Kimana Gate Area",
      image: "/assets/kimana-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Entry point with excellent wildlife viewing",
      bestTime: "Early morning",
      highlight: "First game drive spot",
    },
  ];

  // NEW: Handle admin form changes
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm({
      ...adminForm,
      [name]: value,
    });
  };

  // NEW: Handle price option changes
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

  // NEW: Add new price option
  const addPriceOption = () => {
    if (adminForm.priceOptions.length >= 8) {
      Swal.fire({
        title: "Maximum Reached",
        text: "You can only add up to 8 price options (1-8 pax).",
        icon: "warning",
        confirmButtonColor: "#d97706",
      });
      return;
    }

    // Find the next available people count
    const existingPeople = adminForm.priceOptions.map((opt) => opt.people);
    let nextPeople = 1;
    while (existingPeople.includes(nextPeople) && nextPeople <= 8) {
      nextPeople++;
    }

    if (nextPeople > 8) {
      Swal.fire({
        title: "Maximum Reached",
        text: "You can only add price options for 1-8 people.",
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

  // NEW: Remove price option
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

  // NEW: Submit admin form to create new safari route
  const handleAdminSubmit = (e) => {
    e.preventDefault();

    // Calculate min and max prices from price options
    const prices = adminForm.priceOptions.map((option) => option.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Parse highlights string into array
    const highlightsArray = adminForm.highlights
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    // Create new safari route object
    const newRoute = {
      id: Date.now(), // Use timestamp for unique ID
      name: adminForm.routeName,
      description: adminForm.description,
      duration: adminForm.duration,
      highlights: highlightsArray,
      itinerary: adminForm.itinerary,
      priceOptions: adminForm.priceOptions,
      priceRange: { min: minPrice, max: maxPrice },
    };

    // Add to safari routes and save to localStorage
    const updatedRoutes = [...safariRoutes, newRoute];
    setSafariRoutes(updatedRoutes);
    saveSafariRoutesToStorage(updatedRoutes);

    // Reset form
    setAdminForm({
      routeName: "",
      description: "",
      duration: "3-5 days recommended",
      highlights: "",
      itinerary: "",
      priceOptions: [
        { people: 1, price: 350, currency: "euro" },
        { people: 2, price: 280, currency: "euro" },
        { people: 3, price: 240, currency: "euro" },
        { people: 4, price: 200, currency: "euro" },
        { people: 5, price: 180, currency: "euro" },
        { people: 6, price: 160, currency: "euro" },
        { people: 7, price: 150, currency: "euro" },
        { people: 8, price: 140, currency: "euro" },
      ],
    });

    Swal.fire({
      title: "Safari Package Created!",
      text: "Your new Amboseli safari package has been added successfully and saved.",
      icon: "success",
      confirmButtonColor: "#d97706",
    });

    setShowAdminForm(false);
  };

  // NEW: Delete safari package - PERMANENTLY
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
        // Filter out the deleted route
        const updatedRoutes = safariRoutes.filter(
          (route) => route.id !== routeId,
        );
        setSafariRoutes(updatedRoutes);
        saveSafariRoutesToStorage(updatedRoutes);

        // If the deleted route was selected, clear the selection
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

  // FIXED: Modified handleRouteSelect to REQUIRE lodge selection
  const handleRouteSelect = async (route) => {
    // Check if lodge is selected - this is the CRITICAL FIX
    if (!selectedLodge) {
      // Show SweetAlert asking user to select a lodge first
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
        // Open lodge modal to force selection
        setShowLodgeModal(true);
      }
      return; // STOP here - don't proceed with route selection
    }

    // Only proceed if lodge is selected
    setSelectedRouteForPricing(route);
    setShowPriceModal(true);
  };

  // NEW: Handle final price selection and proceed to itinerary
  const handleFinalPriceSelect = (people, price) => {
    setSelectedRoute(selectedRouteForPricing);
    setBookingForm({
      ...bookingForm,
      travelers: people,
    });
    setShowPriceModal(false);

    // Show itinerary modal after price selection
    setTimeout(() => {
      setShowItineraryModal(true);
    }, 300);
  };

  // NEW: Handle lodge selection with SweetAlert
  const handleLodgeSelection = async (lodge) => {
    // Show loading spinner
    Swal.fire({
      title: "Selecting Lodge...",
      text: "Please wait while we save your lodge preference.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Simulate async save
    setTimeout(() => {
      setSelectedLodge(lodge);

      // Save to localStorage for persistence
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

  // NEW: Generate itinerary including lodge info
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
        if (parksInRoute[currentParkIndex] === "Amboseli") {
          itineraries.push(
            `Day ${i}: Full day exploring Amboseli's swamps and plains with elephant tracking and picnic lunch. ${
              selectedLodge ? `Overnight at ${selectedLodge.name}` : ""
            }`,
          );
        } else {
          itineraries.push(
            `Day ${i}: Travel to ${parksInRoute[currentParkIndex]} for wildlife viewing`,
          );
        }
      }
    }
    return itineraries;
  };

  // MODIFIED: calculatePrice to use manual prices
  const calculatePrice = (travelers, route) => {
    if (!route || !route.priceOptions) return 0;

    // Find the price option for the selected number of travelers
    const priceOption = route.priceOptions.find(
      (option) => option.people === travelers,
    );

    if (priceOption) {
      return priceOption.price;
    }

    // If exact match not found, find the closest option
    const sortedOptions = [...route.priceOptions].sort(
      (a, b) => a.people - b.people,
    );

    // Find the option with people >= travelers
    const higherOption = sortedOptions.find(
      (option) => option.people >= travelers,
    );
    if (higherOption) return higherOption.price;

    // Otherwise use the highest option
    return sortedOptions[sortedOptions.length - 1].price;
  };

  // NEW: Validate booking readiness
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

  // Function to handle image errors
  const handleImageError = (e, fallbackImage) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = fallbackImage;
  };

  // Function to open gallery modal
  const openGalleryModal = (index) => {
    setActiveGalleryImage(index);
    setShowGalleryModal(true);
  };

  // Function to navigate gallery
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

  // Function to send booking to backend
  const sendBookingToBackend = async (bookingData) => {
    try {
      console.log("📤 Sending Amboseli booking to backend...", bookingData);

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

  // Function to send direct email (fallback)
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

  // Main submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate booking readiness
    if (!validateBookingReadiness()) {
      return;
    }

    setIsSubmitting(true);

    const totalPrice = calculatePrice(bookingForm.travelers, selectedRoute);
    const itinerary = generateItinerary(selectedDays, selectedRoute.name);

    // Prepare booking data to match backend's expected fields
    const bookingData = {
      // REQUIRED FIELDS by backend:
      park: parkInfo.name,
      lodge: selectedLodge.name,
      days: selectedDays,
      travelers: bookingForm.travelers,
      totalPrice: totalPrice,
      fullName: bookingForm.fullName,
      email: bookingForm.email,
      phone: bookingForm.phone,

      // OPTIONAL FIELDS that backend also accepts:
      startDate: bookingForm.startDate || "Flexible",
      message: bookingForm.message || "",
      parkHighlights: parkInfo.highlights.join(", "),
      bestTime: parkInfo.bestTime,
      wildlife: parkInfo.wildlife,
      specialFeature: parkInfo.specialFeature,
      lodgeDescription: selectedLodge.description,
      itinerary: itinerary.join("\n"),

      // Additional info for tracking
      bookingSource: "Amboseli Park Page",
      route: selectedRoute.name,
      lodgeFeatures: selectedLodge.features?.join(", ") || "",
    };

    console.log("📝 Amboseli booking data:", bookingData);

    // Try to send to backend first
    const result = await sendBookingToBackend(bookingData);

    setIsSubmitting(false);

    if (result.success) {
      // Success SweetAlert
      await Swal.fire({
        icon: "success",
        title: "Booking Request Sent!",
        html: `
          <div class="text-left">
            <p class="mb-2"><strong>✅ Success!</strong></p>
            <p class="mb-2">Your Amboseli safari booking request has been submitted.</p>
            <div class="bg-amber-50 p-3 rounded-lg my-3">
              <p class="text-sm"><strong>Lodge:</strong> ${selectedLodge.name}</p>
              <p class="text-sm"><strong>Route:</strong> ${selectedRoute.name}</p>
              <p class="text-sm"><strong>Duration:</strong> ${selectedDays} days</p>
              <p class="text-sm"><strong>Travelers:</strong> ${bookingForm.travelers}</p>
              <p class="text-sm"><strong>Total:</strong> €${totalPrice}</p>
            </div>
            <p class="text-sm text-gray-600">Check your email for confirmation and further details.</p>
          </div>
        `,
        confirmButtonColor: "#d97706",
        confirmButtonText: "Great!",
      });
    } else {
      // If backend fails, ask user if they want to use fallback email
      const fallbackResult = await Swal.fire({
        icon: "warning",
        title: "Connection Issue",
        html: `
          <div class="text-left">
            <p class="mb-2">We're having trouble connecting to our booking system.</p>
            <p class="mb-4">Would you like to send your booking details via email instead?</p>
            <div class="bg-amber-50 p-3 rounded-lg">
              <p class="text-sm"><strong>Lodge:</strong> ${selectedLodge.name}</p>
              <p class="text-sm"><strong>Route:</strong> ${selectedRoute.name}</p>
              <p class="text-sm"><strong>Duration:</strong> ${selectedDays} days</p>
              <p class="text-sm"><strong>Total Price:</strong> €${totalPrice}</p>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#d97706",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, send via email",
        cancelButtonText: "Cancel",
      });

      if (fallbackResult.isConfirmed) {
        sendDirectEmail({
          ...bookingData,
          route: selectedRoute.name,
          itinerary: itinerary,
        });

        await Swal.fire({
          icon: "info",
          title: "Email Opened",
          text: "Please complete your booking by sending the pre-filled email.",
          confirmButtonColor: "#d97706",
        });
      }
    }

    // Reset form and close modals
    setShowBookingModal(false);
    setShowItineraryModal(false);
    setBookingForm({
      fullName: "",
      email: "",
      phone: "",
      travelers: 1,
      message: "",
      startDate: "",
    });
  };

  // NEW: Function to clear lodge selection
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
        // Also remove from localStorage
        try {
          localStorage.removeItem("amboseliBooking");
        } catch (error) {
          console.error("Error removing lodge selection:", error);
        }
      }
    });
  };

  // Close modals when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowItineraryModal(false);
      setShowBookingModal(false);
      setShowGalleryModal(false);
      setShowLodgeModal(false);
      setShowPriceModal(false);
      setShowAdminForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={parkInfo.image}
          alt={parkInfo.name}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, parkInfo.fallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-r "></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold mb-4 font-serif">
              {parkInfo.name}
            </h1>
            <p className="text-xl max-w-2xl">{parkInfo.description}</p>

            {/* Selected Lodge Badge */}
            {selectedLodge && (
              <div className="mt-4 inline-flex items-center bg-green-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">Lodge Selected:</span>{" "}
                {selectedLodge.name}
                <button
                  onClick={handleClearLodgeSelection}
                  className="ml-4 text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
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
        {/* Park Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 font-serif">
              Discover Amboseli
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Amboseli National Park, located in southern Kenya, is one of
              Africa's most iconic safari destinations. Renowned for its
              breathtaking views of Mount Kilimanjaro, Africa's highest peak,
              the park offers unparalleled opportunities to observe large herds
              of elephants against the stunning mountain backdrop. The park's
              name comes from the Maasai word "Empusel" meaning "salty dust."
            </p>

            {/* Lodge Selection Section - NEW */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Your Amboseli Accommodation
                </h3>
                {!selectedLodge ? (
                  <button
                    onClick={() => setShowLodgeModal(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Choose Lodge
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowLodgeModal(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={handleClearLodgeSelection}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {selectedLodge ? (
                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                  <img
                    src={selectedLodge.image}
                    alt={selectedLodge.name}
                    className="w-24 h-24 object-cover rounded-lg"
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
                    <div className="flex gap-2 mt-2">
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
                  <p className="text-gray-700 mb-3">No lodge selected yet</p>
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
                    <li key={index} className="flex items-center text-gray-700">
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
                    Home to over 1,500 free-ranging elephants with some of the
                    largest tusks in Africa.
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
                    Opportunities to visit Maasai communities and learn about
                    their traditional way of life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lodge Requirement Banner - NEW */}
        {!selectedLodge && (
          <div className="mb-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
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
                className="bg-white text-amber-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Browse Lodges
              </button>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Amboseli Gallery
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Experience the majestic beauty of Amboseli through our collection of
            images showcasing elephants, Kilimanjaro, and the park's diverse
            wildlife.
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
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
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
        </div>

        {/* Attractions Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Top Attractions in Amboseli
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-100"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => handleImageError(e, attraction.fallback)}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {attraction.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {attraction.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-amber-600 mr-2"
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
                      <span className="text-gray-700">
                        Best: {attraction.bestTime}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-amber-600 mr-2"
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
                      <span className="text-gray-700">
                        Highlight: {attraction.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safari Routes - WITH PERSISTENCE */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 font-serif mb-2">
                Amboseli Safari Packages
              </h2>
              <p className="text-gray-600">
                {selectedLodge
                  ? `Packages available with your selected lodge: ${selectedLodge.name}`
                  : "Select a lodge first to view available packages"}
              </p>
            </div>
            {/* Only showing Add New Package button */}
            <button
              onClick={() => setShowAdminForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            >
              <div className="flex items-center gap-2">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Package
              </div>
            </button>
          </div>

          {/* Storage Info */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Data Persistence Active
                  </p>
                  <p className="text-xs text-blue-600">
                    All safari packages are saved automatically. Changes persist
                    across page refreshes.
                  </p>
                </div>
              </div>
              <div className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {safariRoutes.length} package
                {safariRoutes.length !== 1 ? "s" : ""} saved
              </div>
            </div>
          </div>

          {/* Show disabled state if no lodge selected - NEW */}
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
                Please select your Amboseli accommodation first. Safari packages
                are tailored to include your chosen lodge stay.
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
                Click "Add New Package" to create your first safari package.
              </p>
              <button
                onClick={() => setShowAdminForm(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Your First Package
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safariRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-200 relative group"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePackage(route.id)}
                    className="absolute top-4 right-4 bg-amber-100 hover:bg-amber-200 text-amber-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    title="Delete Package Permanently"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  <div className="h-48 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <h3 className="text-xl font-bold mb-2">
                        {route.name.split("→")[0].trim()}
                      </h3>
                      <div className="w-12 h-1 bg-white mx-auto mb-2"></div>
                      <p className="text-amber-100">Starting Point</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {route.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{route.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Highlights:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {route.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Itinerary Preview:
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {route.itinerary.substring(0, 100)}...
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Price Options (1-8 pax):
                      </h4>
                      <div className="space-y-2">
                        {route.priceOptions.slice(0, 3).map((option, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {option.people} pax:
                            </span>
                            <span className="font-semibold text-amber-600">
                              €{option.price} per person
                            </span>
                          </div>
                        ))}
                        {route.priceOptions.length > 3 && (
                          <div className="text-center">
                            <button
                              onClick={() => handleRouteSelect(route)}
                              className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                            >
                              View all {route.priceOptions.length} options →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-amber-600 font-bold">
                        €{route.priceRange.min} - €{route.priceRange.max}
                      </div>
                      <span className="text-sm text-gray-500 bg-amber-50 px-2 py-1 rounded">
                        {route.duration}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRouteSelect(route)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                    >
                      Select Package & Choose Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kilimanjaro Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-amber-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif">
            Kilimanjaro & Elephant Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Africa's Tallest Backdrop
              </h3>
              <p className="text-gray-700 mb-4">
                Mount Kilimanjaro, Africa's highest peak at 5,895 meters,
                provides a dramatic backdrop to Amboseli's wildlife. The best
                views are typically in the early morning and late afternoon when
                clouds clear. The contrast between the snow-capped peak and the
                African savannah creates one of the continent's most iconic
                scenes.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                  <strong>Best Viewing:</strong> Early morning (6-8 AM) and late
                  afternoon (4-6 PM)
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

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-amber-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Plan Your Amboseli Adventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Choose Your Lodge
              </h3>
              <p className="text-gray-600 text-sm">
                Select from 7 premium lodges for your Amboseli accommodation.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Select Safari Package
              </h3>
              <p className="text-gray-600 text-sm">
                Choose a safari route and customize your itinerary.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Book & Confirm
              </h3>
              <p className="text-gray-600 text-sm">
                Secure your spot with our easy booking process.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAdminForm(false)
          }
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Amboseli Safari Package
                </h2>
                <button
                  onClick={() => setShowAdminForm(false)}
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

              {/* Storage Info in Modal */}
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                  <p className="text-sm text-blue-800">
                    This package will be saved automatically and persist across
                    page refreshes.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminSubmit}>
                <div className="space-y-4">
                  {/* Route Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Route Name *
                    </label>
                    <input
                      type="text"
                      name="routeName"
                      value={adminForm.routeName}
                      onChange={handleAdminFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Amboseli → Tsavo East → Tsavo West"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={adminForm.description}
                      onChange={handleAdminFormChange}
                      required
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Describe the Amboseli safari experience..."
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={adminForm.duration}
                      onChange={handleAdminFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., 3-5 days recommended"
                    />
                  </div>

                  {/* Highlights */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Highlights (comma-separated) *
                    </label>
                    <input
                      type="text"
                      name="highlights"
                      value={adminForm.highlights}
                      onChange={handleAdminFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="e.g., Kilimanjaro Views, Elephant Herds, Bird Watching"
                    />
                  </div>

                  {/* Itinerary */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Itinerary Details *
                    </label>
                    <textarea
                      name="itinerary"
                      value={adminForm.itinerary}
                      onChange={handleAdminFormChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Detailed day-by-day itinerary..."
                    />
                  </div>

                  {/* Price Options */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-gray-700 font-semibold">
                        Price Options (1-8 pax, per person) *
                      </label>
                      <button
                        type="button"
                        onClick={addPriceOption}
                        disabled={adminForm.priceOptions.length >= 8}
                        className={`text-sm px-3 py-1 rounded transition-colors ${
                          adminForm.priceOptions.length >= 8
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        Add Price Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {adminForm.priceOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1">
                              Pax (1-8)
                            </label>
                            <input
                              type="number"
                              value={option.people}
                              onChange={(e) =>
                                handlePriceOptionChange(
                                  index,
                                  "people",
                                  e.target.value,
                                )
                              }
                              min="1"
                              max="8"
                              className="w-full px-3 py-1 border border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1">
                              Price (€)
                            </label>
                            <input
                              type="number"
                              value={option.price}
                              onChange={(e) =>
                                handlePriceOptionChange(
                                  index,
                                  "price",
                                  e.target.value,
                                )
                              }
                              min="1"
                              className="w-full px-3 py-1 border border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="flex items-end">
                            <span className="text-gray-600">€ per pax</span>
                            {adminForm.priceOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removePriceOption(index)}
                                className="ml-3 text-amber-600 hover:text-amber-800"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      * Minimum 2 price options required. You can add up to 8
                      options (1-8 pax).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAdminForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Create Safari Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Price Selection Modal for Users */}
      {showPriceModal && selectedRouteForPricing && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setShowPriceModal(false)
          }
        >
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Select Number of Pax (1-8)
                </h2>
                <button
                  onClick={() => setShowPriceModal(false)}
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

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  {selectedRouteForPricing.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {selectedRouteForPricing.description}
                </p>

                <div className="space-y-3">
                  {selectedRouteForPricing.priceOptions.map((option, index) => (
                    <div
                      key={index}
                      className="border-2 border-amber-100 rounded-lg p-4 hover:border-amber-300 cursor-pointer transition-colors"
                      onClick={() =>
                        handleFinalPriceSelect(option.people, option.price)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {option.people}{" "}
                            {option.people === 1 ? "Pax" : "Pax"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Per person price
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">
                            €{option.price}
                          </div>
                          <p className="text-sm text-gray-500">per pax</p>
                        </div>
                      </div>
                      <button className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition-colors">
                        Select This Option
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowPriceModal(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Packages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Lodge Selection Modal */}
      {showLodgeModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Select Your Amboseli Lodge
                </h2>
                <button
                  onClick={() => setShowLodgeModal(false)}
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

              {selectedLodge && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">
                          Currently Selected
                        </p>
                        <p className="text-green-700">{selectedLodge.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearLodgeSelection}
                      className="text-sm text-green-700 hover:text-green-900 font-medium"
                    >
                      Change Selection
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {amboseliLodges.map((lodge, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                      selectedLodge?.name === lodge.name
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="relative">
                          <img
                            src={lodge.image}
                            alt={lodge.name}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) =>
                              handleImageError(e, lodge.fallbackImage)
                            }
                          />
                          {selectedLodge?.name === lodge.name && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              SELECTED
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {lodge.priceRange}
                          </div>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {lodge.name}
                          </h3>
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Lodge {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">
                          {lodge.description}
                        </p>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Features:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {lodge.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleLodgeSelection(lodge)}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                              selectedLodge?.name === lodge.name
                                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                            } text-white`}
                          >
                            {selectedLodge?.name === lodge.name
                              ? "✓ Selected"
                              : "Select This Lodge"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLodgeModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Back to Park
                  </button>
                  {selectedLodge && (
                    <button
                      onClick={() => {
                        setShowLodgeModal(false);
                        Swal.fire({
                          title: "Ready to Book!",
                          text: `Great! You've selected ${selectedLodge.name}. Now choose a safari package.`,
                          icon: "success",
                          confirmButtonColor: "#d97706",
                        });
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Continue to Packages
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <button
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 z-10 transition-colors"
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

            {/* Navigation Buttons */}
            <button
              onClick={prevGalleryImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 z-10 transition-colors"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 z-10 transition-colors"
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

            {/* Main Image */}
            <div className="h-[70vh] flex items-center justify-center">
              <img
                src={galleryImages[activeGalleryImage].src}
                alt={galleryImages[activeGalleryImage].title}
                className="max-h-full max-w-full object-contain rounded-lg"
                onError={(e) =>
                  handleImageError(
                    e,
                    galleryImages[activeGalleryImage].fallback,
                  )
                }
              />
            </div>

            {/* Image Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4 text-white">
              <h3 className="text-xl font-bold mb-2">
                {galleryImages[activeGalleryImage].title}
              </h3>
              <p className="mb-2">
                {galleryImages[activeGalleryImage].description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm bg-amber-600 px-3 py-1 rounded-full">
                  {galleryImages[activeGalleryImage].category}
                </span>
                <span className="text-sm">
                  {activeGalleryImage + 1} / {galleryImages.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setActiveGalleryImage(index)}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 transition-all ${
                    index === activeGalleryImage
                      ? "border-amber-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, image.fallback)}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Itinerary Modal */}
      {showItineraryModal && selectedRoute && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRoute.name}
                </h2>
                <button
                  onClick={() => setShowItineraryModal(false)}
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

              {/* Lodge Information - NEW */}
              {selectedLodge && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-green-600"
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
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Selected Lodge
                      </h4>
                      <p className="text-green-700">{selectedLodge.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Days Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Select Duration (2-9 days):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 4, 5, 6, 7, 8, 9].map((days) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDays(days)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedDays === days
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Detailed Itinerary:
                </h3>
                <div className="space-y-3">
                  {generateItinerary(selectedDays, selectedRoute.name).map(
                    (day, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-amber-50 rounded-lg border border-amber-200"
                      >
                        <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{day}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Price Estimate */}
              <div className="bg-amber-100 p-4 rounded-lg mb-6 border border-amber-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">
                    Estimated Total Price:
                  </span>
                  <span className="text-2xl font-bold text-amber-600">
                    €{calculatePrice(bookingForm.travelers, selectedRoute)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  For {bookingForm.travelers} pax × €
                  {calculatePrice(bookingForm.travelers, selectedRoute)} per pax
                </p>
              </div>

              <button
                onClick={handleBookingConfirm}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Confirm & Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Book Your Amboseli Safari
                </h2>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Number of Travelers *
                  </label>
                  <select
                    name="travelers"
                    value={bookingForm.travelers}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Traveler" : "Travelers"}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={bookingForm.message}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    placeholder="Any special requirements, photography interests, Kilimanjaro viewing preferences, or questions about elephant encounters..."
                  ></textarea>
                </div>

                {/* Booking Summary - UPDATED */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Booking Summary
                  </h3>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Lodge:</span>{" "}
                    {selectedLodge?.name || "Not selected"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Route:</span>{" "}
                    {selectedRoute?.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Duration:</span>{" "}
                    {selectedDays} days
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Travelers:</span>{" "}
                    {bookingForm.travelers} pax
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Total Price:</span> €
                    {calculatePrice(
                      bookingForm.travelers,
                      selectedRoute || { priceOptions: [] },
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    All booking details will be sent to tembo4401@gmail.com
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none mt-6 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
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

export default Amboseli;
