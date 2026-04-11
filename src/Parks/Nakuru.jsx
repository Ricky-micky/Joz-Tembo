/**
 * Copyright (c) 2024 Safari Booking System. All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is prohibited.
 */

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Nakuru = () => {
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

  // Backend loading state
  const [backendLoading, setBackendLoading] = useState(false);

  // Backend connection state
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    packageCount: 0,
  });

  // Admin form state
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedRouteForPricing, setSelectedRouteForPricing] = useState(null);
  
  // NEW: Edit mode states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  
  const [adminForm, setAdminForm] = useState({
    routeName: "",
    description: "",
    duration: "3-5 days recommended",
    highlights: "",
    itinerary: "",
    priceOptions: [
      { people: 2, price: 320, currency: "euro" },
      { people: 3, price: 280, currency: "euro" },
      { people: 4, price: 240, currency: "euro" },
      { people: 5, price: 220, currency: "euro" },
      { people: 6, price: 200, currency: "euro" },
      { people: 7, price: 190, currency: "euro" },
      { people: 8, price: 180, currency: "euro" },
    ],
  });

  // DEFAULT safari routes - only used if localStorage is empty
  const defaultSafariRoutes = [
    {
      id: 1,
      name: "Lake Nakuru → Lake Naivasha → Nairobi",
      description:
        "Bird watching paradise combined with boat rides and scenic landscapes in the Rift Valley.",
      duration: "3-5 days recommended",
      highlights: ["Flamingo Spectacle", "Rhino Sanctuary", "Boat Safari"],
      itinerary:
        "Day 1: Arrival at Lake Nakuru, flamingo viewing. Day 2: Full day Nakuru with rhino tracking. Day 3: Travel to Lake Naivasha for boat ride. Day 4: Hell's Gate cycling. Day 5: Return to Nairobi.",
      priceOptions: [
        { people: 2, price: 320, currency: "euro" },
        { people: 3, price: 280, currency: "euro" },
        { people: 4, price: 240, currency: "euro" },
        { people: 5, price: 220, currency: "euro" },
        { people: 6, price: 200, currency: "euro" },
        { people: 7, price: 190, currency: "euro" },
        { people: 8, price: 180, currency: "euro" },
      ],
      priceRange: { min: 180, max: 320 },
    },
    {
      id: 2,
      name: "Lake Nakuru Birding Special",
      description:
        "Focused bird watching experience with expert guides and extended lake viewing.",
      duration: "2-3 days recommended",
      highlights: ["Bird Watching", "Flamingo Spectacle", "Lake Views"],
      itinerary:
        "Day 1: Arrival, afternoon flamingo viewing at lake shore. Day 2: Full day bird watching with expert guide, baboon cliff visit. Day 3: Morning rhino sanctuary visit, departure.",
      priceOptions: [
        { people: 2, price: 250, currency: "euro" },
        { people: 3, price: 220, currency: "euro" },
        { people: 4, price: 200, currency: "euro" },
        { people: 5, price: 180, currency: "euro" },
        { people: 6, price: 170, currency: "euro" },
        { people: 7, price: 160, currency: "euro" },
        { people: 8, price: 150, currency: "euro" },
      ],
      priceRange: { min: 150, max: 250 },
    },
    {
      id: 3,
      name: "Lake Nakuru Luxury Safari",
      description:
        "Premium experience with luxury accommodations, private bird watching, and exclusive rhino tracking.",
      duration: "3-4 days recommended",
      highlights: ["Luxury Lodge", "Private Guide", "Rhino Tracking"],
      itinerary:
        "Day 1: Luxury lodge check-in. Day 2: Private bird watching tour. Day 3: Exclusive rhino tracking with conservation experts. Day 4: Departure.",
      priceOptions: [
        { people: 2, price: 450, currency: "euro" },
        { people: 3, price: 400, currency: "euro" },
        { people: 4, price: 380, currency: "euro" },
        { people: 5, price: 350, currency: "euro" },
        { people: 6, price: 330, currency: "euro" },
        { people: 7, price: 310, currency: "euro" },
        { people: 8, price: 300, currency: "euro" },
      ],
      priceRange: { min: 300, max: 450 },
    },
  ];

  // Load safari routes from localStorage on initial load
  const [safariRoutes, setSafariRoutes] = useState(() => {
    try {
      const savedRoutes = localStorage.getItem("nakuruPackages");
      if (savedRoutes) {
        return JSON.parse(savedRoutes);
      }
      localStorage.setItem(
        "nakuruPackages",
        JSON.stringify(defaultSafariRoutes),
      );
      return defaultSafariRoutes;
    } catch (error) {
      console.error("Error loading safari packages:", error);
      return defaultSafariRoutes;
    }
  });

  // Save safari routes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("nakuruPackages", JSON.stringify(safariRoutes));
    } catch (error) {
      console.error("Error saving safari packages:", error);
    }
  }, [safariRoutes]);

  // Function to save safari routes to localStorage
  const saveSafariRoutesToStorage = (routes) => {
    try {
      localStorage.setItem("nakuruPackages", JSON.stringify(routes));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      Swal.fire({
        title: "Storage Error",
        text: "Could not save safari packages. Please try again.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // Check backend connection on mount
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
                    pkg.name && pkg.name.toLowerCase().includes("lake nakuru"),
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

  // Load packages from backend and merge with local
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
          duration: `${pkg.total_days || 3}-${(pkg.total_days || 3) + 2} days recommended`,
          highlights: pkg.highlights || [],
          itinerary: pkg.description || "",
          priceOptions:
            hasPrices && basePrice.prices
              ? [
                  {
                    people: 2,
                    price: basePrice.prices.pax_2_price || 320,
                    currency: "euro",
                  },
                  {
                    people: 4,
                    price: basePrice.prices.pax_4_price || 240,
                    currency: "euro",
                  },
                  {
                    people: 6,
                    price: basePrice.prices.pax_6_price || 200,
                    currency: "euro",
                  },
                  {
                    people: 8,
                    price: basePrice.prices.pax_8_price || 180,
                    currency: "euro",
                  },
                ]
              : defaultSafariRoutes[0].priceOptions,
          priceRange: {
            min:
              hasPrices && basePrice.prices
                ? Math.min(
                    basePrice.prices.pax_2_price || 320,
                    basePrice.prices.pax_4_price || 240,
                    basePrice.prices.pax_6_price || 200,
                    basePrice.prices.pax_8_price || 180,
                  )
                : 100,
            max:
              hasPrices && basePrice.prices
                ? Math.max(
                    basePrice.prices.pax_2_price || 320,
                    basePrice.prices.pax_4_price || 240,
                    basePrice.prices.pax_6_price || 200,
                    basePrice.prices.pax_8_price || 180,
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

  // Check for existing lodge selection from localStorage on component mount
  useEffect(() => {
    const checkExistingSelection = () => {
      try {
        const bookingData = localStorage.getItem("nakuruBooking");
        if (bookingData) {
          const parsedData = JSON.parse(bookingData);
          if (
            parsedData.park &&
            parsedData.park.name === "Lake Nakuru National Park" &&
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
    id: 6,
    name: "Lake Nakuru National Park",
    image: "/assets/parks/lake-nakuru.jpg",
    fallbackImage: "/assets/nakuru-page.jpg",
    description:
      "Famous for its flamingo populations, rhino sanctuary, and diverse birdlife in the Great Rift Valley.",
    highlights: [
      "Millions of flamingos painting the lake pink",
      "Rhino sanctuary with both black and white rhinos",
      "Baboon cliff viewpoints",
      "Over 450 bird species recorded",
      "Rothschild giraffe conservation",
    ],
    bestTime: "Year-round, but June-March for bird watching",
    wildlife:
      "Flamingos, Pelicans, Rhinos, Rothschild Giraffes, Lions, Leopards, Baboons",
    size: "188 km² - Compact park with diverse ecosystems",
    specialFeature:
      "World's greatest bird spectacle with millions of flamingos",
  };

  // Lake Nakuru Lodges
  const lakeNakuruLodges = [
    {
      name: "Lake Nakuru Lodge",
      image: "/assets/lodges/nakuru-lodge.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Located inside the park with stunning lake views, offering comfortable accommodations and excellent bird watching opportunities.",
      gallery: [
        "/assets/lodges/nakuru-lodge-1.jpg",
        "/assets/lodges/nakuru-lodge-2.jpg",
        "/assets/lodges/nakuru-lodge-3.jpg",
      ],
      priceRange: "$$$",
      features: ["Lake View", "Inside Park", "Bird Watching"],
    },
    {
      name: "Sarova Lion Hill Game Lodge",
      image: "/assets/lodges/sarova-lion-hill.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Luxury lodge perched on Lion Hill with panoramic views of Lake Nakuru, offering premium amenities and services.",
      gallery: [
        "/assets/lodges/sarova-1.jpg",
        "/assets/lodges/sarova-2.jpg",
        "/assets/lodges/sarova-3.jpg",
      ],
      priceRange: "$$$$",
      features: ["Panoramic Views", "Luxury", "Swimming Pool"],
    },
    {
      name: "Mbweha Camp",
      image: "/assets/lodges/mbweha-camp.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Eco-friendly camp with thatched cottages, offering intimate wildlife experiences and personalized service.",
      gallery: [
        "/assets/lodges/mbweha-1.jpg",
        "/assets/lodges/mbweha-2.jpg",
        "/assets/lodges/mbweha-3.jpg",
      ],
      priceRange: "$$$$",
      features: ["Eco Friendly", "Intimate", "Thatched Cottages"],
    },
    {
      name: "Flamingo Hill Camp",
      image: "/assets/lodges/flamingo-hill.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Tented camp located near the lake shore, offering close proximity to flamingo viewing areas.",
      gallery: [
        "/assets/lodges/flamingo-1.jpg",
        "/assets/lodges/flamingo-2.jpg",
        "/assets/lodges/flamingo-3.jpg",
      ],
      priceRange: "$$$",
      features: ["Lake Proximity", "Tented Camp", "Flamingo Views"],
    },
    {
      name: "Maili Saba Camp",
      image: "/assets/lodges/maili-saba.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Boutique camp offering luxury tented accommodation with modern amenities and excellent service.",
      gallery: [
        "/assets/lodges/maili-1.jpg",
        "/assets/lodges/maili-2.jpg",
        "/assets/lodges/maili-3.jpg",
      ],
      priceRange: "$$$$",
      features: ["Boutique", "Luxury Tents", "Modern Amenities"],
    },
    {
      name: "Ziwa Bush Lodge",
      image: "/assets/lodges/ziwa-bush.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Family-friendly lodge with spacious rooms and excellent facilities for bird watching enthusiasts.",
      gallery: [
        "/assets/lodges/ziwa-1.jpg",
        "/assets/lodges/ziwa-2.jpg",
        "/assets/lodges/ziwa-3.jpg",
      ],
      priceRange: "$$",
      features: ["Family Friendly", "Bird Watching", "Spacious"],
    },
    {
      name: "The Cliff Nakuru",
      image: "/assets/lodges/cliff-nakuru.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Premium accommodation with cliff-top views, offering luxury suites and exceptional dining experiences.",
      gallery: [
        "/assets/lodges/cliff-1.jpg",
        "/assets/lodges/cliff-2.jpg",
        "/assets/lodges/cliff-3.jpg",
      ],
      priceRange: "$$$$$",
      features: ["Cliff Views", "Premium", "Fine Dining"],
    },
  ];

  // Lake Nakuru Gallery Images
  const galleryImages = [
    {
      id: 1,
      src: "/assets/gallery/nakuru-flamingos.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Pink Flamingo Sea",
      description:
        "Millions of flamingos creating a pink ribbon around the lake",
      category: "birds",
    },
    {
      id: 2,
      src: "/assets/gallery/nakuru-rhino.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Black Rhino",
      description: "Endangered black rhino in the protected sanctuary",
      category: "wildlife",
    },
    {
      id: 3,
      src: "/assets/gallery/nakuru-cliff.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Baboon Cliff View",
      description: "Panoramic views from the famous Baboon Cliff",
      category: "landscape",
    },
    {
      id: 4,
      src: "/assets/gallery/nakuru-pelicans.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Great White Pelicans",
      description: "Large flocks of pelicans fishing in the lake",
      category: "birds",
    },
    {
      id: 5,
      src: "/assets/gallery/nakuru-giraffe.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Rothschild's Giraffe",
      description: "Endangered giraffe species found in the park",
      category: "wildlife",
    },
    {
      id: 6,
      src: "/assets/gallery/nakuru-waterfall.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Makalia Falls",
      description: "Beautiful waterfall within the park",
      category: "landscape",
    },
    {
      id: 7,
      src: "/assets/gallery/nakuru-lions.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Tree-Climbing Lions",
      description: "Lions resting in acacia trees",
      category: "wildlife",
    },
    {
      id: 8,
      src: "/assets/gallery/nakuru-sunset.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Lake Sunset",
      description: "Stunning sunset over Lake Nakuru",
      category: "landscape",
    },
    {
      id: 9,
      src: "/assets/gallery/nakuru-birding.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Bird Watching",
      description: "Over 450 bird species recorded in the park",
      category: "birds",
    },
    {
      id: 10,
      src: "/assets/gallery/nakuru-white-rhino.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "White Rhino",
      description: "White rhino grazing in the sanctuary",
      category: "wildlife",
    },
    {
      id: 11,
      src: "/assets/gallery/nakuru-rift-valley.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Rift Valley View",
      description: "Spectacular views of the Great Rift Valley",
      category: "landscape",
    },
    {
      id: 12,
      src: "/assets/gallery/nakuru-leopard.jpg",
      fallback: "/assets/gallery/default-nakuru.jpg",
      title: "Leopard Sighting",
      description: "Elusive leopard in the acacia woodlands",
      category: "wildlife",
    },
  ];

  // Lake Nakuru Attractions
  const attractions = [
    {
      id: 1,
      name: "Baboon Cliff",
      image: "/assets/attractions/baboon-cliff.jpg",
      fallback: "/assets/attractions/default-attraction.jpg",
      description: "Spectacular viewpoint overlooking the entire lake",
      bestTime: "Sunrise or sunset",
      highlight: "Panoramic lake views",
    },
    {
      id: 2,
      name: "Makalia Falls",
      image: "/assets/attractions/makalia-falls.jpg",
      fallback: "/assets/attractions/default-attraction.jpg",
      description: "Beautiful waterfall in the southern part of the park",
      bestTime: "After rainy season",
      highlight: "Refreshing waterfall",
    },
    {
      id: 3,
      name: "Rhino Sanctuary",
      image: "/assets/attractions/rhino-sanctuary.jpg",
      fallback: "/assets/attractions/default-attraction.jpg",
      description: "Protected area for both black and white rhinos",
      bestTime: "Early morning or late afternoon",
      highlight: "Rhino conservation",
    },
    {
      id: 4,
      name: "Lion Hill",
      image: "/assets/attractions/lion-hill.jpg",
      fallback: "/assets/attractions/default-attraction.jpg",
      description: "Viewpoint with excellent game viewing opportunities",
      bestTime: "Morning",
      highlight: "Predator sightings",
    },
    {
      id: 5,
      name: "Lake Shore Drive",
      image: "/assets/attractions/lake-shore.jpg",
      fallback: "/assets/attractions/default-attraction.jpg",
      description: "Scenic drive along the flamingo-filled shoreline",
      bestTime: "Any time of day",
      highlight: "Flamingo congregations",
    },
    {
      id: 6,
      name: "Out of Africa Lookout",
      image: "/assets/attractions/out-of-africa.jpg",
      fallback: "/assets/attractions/default-attraction.jpg",
      description: "Historic viewpoint made famous by the movie",
      bestTime: "Morning",
      highlight: "Cinematic views",
    },
  ];

  // NEW: Edit safari package
  const handleEditPackage = (route) => {
    setEditingRoute(route);
    setAdminForm({
      routeName: route.name.replace("Lake Nakuru → ", "").trim(),
      description: route.description,
      duration: route.duration,
      highlights: route.highlights.join(", "),
      itinerary: route.itinerary,
      priceOptions: [...route.priceOptions],
    });
    setShowEditModal(true);
  };

  // NEW: Update existing safari package
  const handleUpdatePackage = async (e) => {
    e.preventDefault();

    // Ensure route name contains "Lake Nakuru"
    const routeName = adminForm.routeName.includes("Lake Nakuru")
      ? adminForm.routeName
      : `Lake Nakuru → ${adminForm.routeName}`;

    // Calculate min and max prices
    const prices = adminForm.priceOptions.map((option) => option.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Parse highlights string into array
    const highlightsArray = adminForm.highlights
      .split(",")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    // Create updated route object
    const updatedRoute = {
      ...editingRoute,
      name: routeName,
      description: adminForm.description,
      duration: adminForm.duration,
      highlights: highlightsArray,
      itinerary: adminForm.itinerary,
      priceOptions: adminForm.priceOptions,
      priceRange: { min: minPrice, max: maxPrice },
    };

    // Update the routes array
    const updatedRoutes = safariRoutes.map((route) =>
      route.id === editingRoute.id ? updatedRoute : route
    );

    setSafariRoutes(updatedRoutes);
    saveSafariRoutesToStorage(updatedRoutes);

    // If the edited route was selected, update selection
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
      confirmButtonColor: "#2563eb",
    });

    setShowEditModal(false);
    setEditingRoute(null);
  };

  // Save package to backend
  const savePackageToBackend = async (packageData) => {
    try {
      setIsLoading(true);

      const routeName = packageData.name.includes("Lake Nakuru")
        ? packageData.name
        : `Lake Nakuru → ${packageData.name}`;

      const backendPackage = {
        name: routeName,
        description: packageData.description,
        duration: packageData.duration || "3-5 days recommended",
        itinerary: packageData.itinerary || "",
        priceOptions: packageData.priceOptions.map((option) => ({
          people: option.people,
          price: option.price,
          currency: option.currency || "euro",
        })),
      };

      console.log("📤 Sending to backend:", backendPackage);

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
          confirmButtonColor: "#2563eb",
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
      console.error("❌ Error saving to backend:", error);
      Swal.fire({
        title: "Backend Error",
        text: "Could not save to database. Saved locally instead.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Sync local packages with backend
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
            (pkg) => pkg.name && pkg.name.toLowerCase().includes("lake nakuru"),
          );

          const backendPackages = filteredPackages.map((pkg) => {
            const hasPrices = pkg.prices && pkg.prices.length > 0;
            const basePrice = hasPrices ? pkg.prices[0] : null;

            return {
              id: `backend_${pkg.id}`,
              backendId: pkg.id,
              name: pkg.name,
              description: pkg.description || "",
              duration: `${pkg.total_days || 3}-${(pkg.total_days || 3) + 2} days recommended`,
              highlights: pkg.highlights || [],
              itinerary: pkg.description || "",
              priceOptions:
                hasPrices && basePrice.prices
                  ? [
                      {
                        people: 2,
                        price: basePrice.prices.pax_2_price || 320,
                        currency: "euro",
                      },
                      {
                        people: 4,
                        price: basePrice.prices.pax_4_price || 240,
                        currency: "euro",
                      },
                      {
                        people: 6,
                        price: basePrice.prices.pax_6_price || 200,
                        currency: "euro",
                      },
                      {
                        people: 8,
                        price: basePrice.prices.pax_8_price || 180,
                        currency: "euro",
                      },
                    ]
                  : defaultSafariRoutes[0].priceOptions,
              priceRange: {
                min:
                  hasPrices && basePrice.prices
                    ? Math.min(
                        basePrice.prices.pax_2_price || 320,
                        basePrice.prices.pax_4_price || 240,
                        basePrice.prices.pax_6_price || 200,
                        basePrice.prices.pax_8_price || 180,
                      )
                    : 100,
                max:
                  hasPrices && basePrice.prices
                    ? Math.max(
                        basePrice.prices.pax_2_price || 320,
                        basePrice.prices.pax_4_price || 240,
                        basePrice.prices.pax_6_price || 200,
                        basePrice.prices.pax_8_price || 180,
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
            text: `Loaded ${backendPackages.length} Lake Nakuru packages from backend`,
            icon: "success",
            confirmButtonColor: "#2563eb",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Sync Failed",
        text: "Could not sync with backend. Please check your connection.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setBackendLoading(false);
    }
  };

  // Handle admin form changes
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm({
      ...adminForm,
      [name]: value,
    });
  };

  // Handle price option changes
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

  // Add new price option
  const addPriceOption = () => {
    if (adminForm.priceOptions.length >= 7) {
      Swal.fire({
        title: "Maximum Reached",
        text: "You can only add up to 7 price options (2-8 pax).",
        icon: "warning",
        confirmButtonColor: "#2563eb",
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
        confirmButtonColor: "#2563eb",
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

  // Remove price option
  const removePriceOption = (index) => {
    if (adminForm.priceOptions.length <= 2) {
      Swal.fire({
        title: "Minimum Required",
        text: "You need at least 2 price options.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
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

  // Submit admin form to create new safari route
  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    const routeName = adminForm.routeName.includes("Lake Nakuru")
      ? adminForm.routeName
      : `Lake Nakuru → ${adminForm.routeName}`;

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
      itinerary: adminForm.itinerary,
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
            <p class="text-sm"><strong>Park:</strong> Lake Nakuru National Park</p>
          </div>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#2563eb",
    });

    setAdminForm({
      routeName: "",
      description: "",
      duration: "3-5 days recommended",
      highlights: "",
      itinerary: "",
      priceOptions: [
        { people: 2, price: 320, currency: "euro" },
        { people: 3, price: 280, currency: "euro" },
        { people: 4, price: 240, currency: "euro" },
        { people: 5, price: 220, currency: "euro" },
        { people: 6, price: 200, currency: "euro" },
        { people: 7, price: 190, currency: "euro" },
        { people: 8, price: 180, currency: "euro" },
      ],
    });
    setShowAdminForm(false);
  };

  // Delete safari package
  const handleDeletePackage = (routeId) => {
    Swal.fire({
      title: "Delete Safari Package?",
      text: "Are you sure you want to permanently delete this safari package? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
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
          confirmButtonColor: "#2563eb",
        });
      }
    });
  };

  // Modified handleRouteSelect to REQUIRE lodge selection
  const handleRouteSelect = async (route) => {
    if (!selectedLodge) {
      const result = await Swal.fire({
        title: "Lodge Required",
        html: `
          <div class="text-left">
            <p class="mb-4">To book a Lake Nakuru safari package, you must first select your accommodation.</p>
            <div class="bg-blue-50 p-3 rounded-lg mb-4">
              <p class="font-semibold">Why select a lodge first?</p>
              <p class="text-sm">Lake Nakuru safaris include lodge accommodation. Your chosen lodge affects pricing and itinerary planning.</p>
            </div>
            <p class="text-sm text-gray-600">You'll select from 7 premium lodges including Lake Nakuru Lodge, Sarova Lion Hill, and Mbweha Camp.</p>
          </div>
        `,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
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

  // Handle final price selection
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

  // Handle lodge selection
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
        page: "Nakuru",
      };
      try {
        localStorage.setItem("nakuruBooking", JSON.stringify(bookingData));
      } catch (error) {
        console.error("Error saving lodge selection:", error);
      }

      Swal.fire({
        title: "Lodge Selected!",
        html: `<strong>${lodge.name}</strong> has been selected for your Lake Nakuru stay.`,
        icon: "success",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Continue",
      });

      setShowLodgeModal(false);
    }, 1000);
  };

  // Generate itinerary
  const generateItinerary = (days, route) => {
    const itineraries = [];

    for (let i = 1; i <= days; i++) {
      if (i === 1) {
        itineraries.push(
          `Day ${i}: Arrival at Lake Nakuru National Park, check-in at ${
            selectedLodge?.name || "selected lodge"
          } and afternoon flamingo viewing at the lake shore`,
        );
      } else if (i === days) {
        itineraries.push(
          `Day ${i}: Morning rhino sanctuary visit, breakfast, and departure from ${route
            .split("→")
            .pop()
            .trim()}`,
        );
      } else {
        const parksInRoute = route.split("→").map((park) => park.trim());
        const currentParkIndex = Math.min(i - 2, parksInRoute.length - 1);
        if (parksInRoute[currentParkIndex].includes("Nakuru")) {
          itineraries.push(
            `Day ${i}: Full day in Lake Nakuru with bird watching, rhino tracking, and baboon cliff visit. ${
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

  // Calculate price
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

  // Validate booking readiness
  const validateBookingReadiness = () => {
    if (!selectedLodge) {
      Swal.fire({
        title: "Accommodation Required",
        text: "Please select a lodge before proceeding with booking.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });
      return false;
    }
    if (!selectedRoute) {
      Swal.fire({
        title: "Safari Route Required",
        text: "Please select a safari route package.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
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
    e.target.onerror = null;
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
      console.log("📤 Sending Lake Nakuru booking to backend...", bookingData);

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
          confirmButtonColor: "#2563eb",
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

  // Function to send direct email (fallback)
  const sendDirectEmail = (bookingData) => {
    const emailBody = `
LAKE NAKURU NATIONAL PARK SAFARI BOOKING DETAILS:

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

📧 This booking was made from the Lake Nakuru National Park page.
    `.trim();

    window.open(
      `mailto:tembo4401@gmail.com?subject=Lake Nakuru Safari Booking: ${
        bookingData.route
      } - ${bookingData.fullName}&body=${encodeURIComponent(emailBody)}`,
    );
  };

  // Main submit function
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
        bookingSource: "Lake Nakuru Park Page",
        route: selectedRoute.name,
        lodgeFeatures: selectedLodge.features?.join(", ") || "",
      };

      console.log("📝 Lake Nakuru booking data:", bookingData);

      const result = await sendBookingToBackend(bookingData);

      if (!result.success) {
        console.log("⚠️ Backend failed, using fallback email...");
        sendDirectEmail({
          ...bookingData,
          route: selectedRoute.name,
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

  // Function to clear lodge selection
  const handleClearLodgeSelection = () => {
    Swal.fire({
      title: "Change Lodge?",
      text: "Are you sure you want to change your selected lodge?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedLodge(null);
        try {
          localStorage.removeItem("nakuruBooking");
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
      setShowEditModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={parkInfo.image}
          alt={parkInfo.name}
          className="w-full h-full object-cover"
          onError={(e) => handleImageError(e, parkInfo.fallbackImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold mb-4 font-serif">
              {parkInfo.name}
            </h1>
            <p className="text-xl max-w-2xl">{parkInfo.description}</p>

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
              Discover Lake Nakuru
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Lake Nakuru National Park, located in the Great Rift Valley, is
              world-renowned for its spectacular birdlife, particularly the
              millions of flamingos that gather along its shores. The alkaline
              lake creates the perfect environment for algae, which attracts
              vast numbers of lesser and greater flamingos, creating a stunning
              pink ribbon around the lake. The park is also a key rhino
              sanctuary and home to the endangered Rothschild's giraffe.
            </p>

            {/* Lodge Selection Section */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Your Lake Nakuru Accommodation
                </h3>
                {!selectedLodge ? (
                  <button
                    onClick={() => setShowLodgeModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Choose Lodge
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowLodgeModal(true)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
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
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-cyan-50 rounded-lg border border-cyan-200">
                  <svg
                    className="w-12 h-12 text-cyan-500 mx-auto mb-3"
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
                    Choose from 7 premium lodges for your Lake Nakuru stay
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
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
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

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Why Choose Lake Nakuru?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Flamingo Spectacle
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Witness millions of flamingos creating a pink ribbon around
                    the lake.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Rhino Sanctuary
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Excellent rhino viewing with both black and white rhino
                    species in a protected sanctuary.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Bird Paradise</h4>
                  <p className="text-gray-600 text-sm">
                    Over 450 bird species including pelicans, rare migrants, and
                    endemic species.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Compact & Diverse
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Easy to explore with varied landscapes from lake to
                    woodland, cliff viewpoints to waterfalls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lodge Requirement Banner */}
        {!selectedLodge && (
          <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
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
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Browse Lodges
              </button>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Lake Nakuru Gallery
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Explore the breathtaking beauty and wildlife of Lake Nakuru through
            our collection of images showcasing the park's most spectacular
            moments.
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
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => openGalleryModal(0)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              View Full Gallery ({galleryImages.length} images)
            </button>
          </div>
        </div>

        {/* Attractions Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Top Attractions in Lake Nakuru
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100"
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
                        className="w-4 h-4 text-blue-600 mr-2"
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
                        className="w-4 h-4 text-blue-600 mr-2"
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

        {/* Safari Routes - WITH PERSISTENCE AND EDITING */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 font-serif mb-2">
                Lake Nakuru Safari Packages
              </h2>
              <p className="text-gray-600">
                {selectedLodge
                  ? `Packages available with your selected lodge: ${selectedLodge.name}`
                  : "Select a lodge first to view available packages"}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                📍 Only showing packages starting from Lake Nakuru
              </p>
            </div>
            <div className="flex gap-2">
              {backendStatus.connected && (
                <button
                  onClick={syncWithBackend}
                  disabled={backendLoading}
                  className={`${backendLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300`}
                >
                  <div className="flex items-center gap-2">
                    {backendLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Syncing...
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Sync Lake Nakuru Packages
                      </>
                    )}
                  </div>
                </button>
              )}
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
          </div>

          {/* Storage Info */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
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
                      ? `${backendStatus.packageCount} Lake Nakuru packages in database, ${safariRoutes.length} locally`
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

          {/* Show disabled state if no lodge selected */}
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
                Please select your Lake Nakuru accommodation first. Safari
                packages are tailored to include your chosen lodge stay.
              </p>
              <button
                onClick={() => setShowLodgeModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Select Your Lodge Now
              </button>
            </div>
          ) : safariRoutes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-blue-200">
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
                Click "Add New Package" to create your first Lake Nakuru safari
                package.
              </p>
              <button
                onClick={() => setShowAdminForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Your First Package
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safariRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-blue-200 relative group"
                >
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    {route.backendId && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Database
                      </span>
                    )}
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Local
                    </span>
                  </div>

                  {/* Lake Nakuru Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      🦩 Lake Nakuru
                    </span>
                  </div>

                  {/* Action Buttons - Edit & Delete */}
                  <div className="absolute top-12 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEditPackage(route)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      title="Edit Package"
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
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      title="Delete Package"
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

                  <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <h3 className="text-xl font-bold mb-2">
                        {route.name.split("→")[0].trim()}
                      </h3>
                      <div className="w-12 h-1 bg-white mx-auto mb-2"></div>
                      <p className="text-blue-100">Starting Point</p>
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
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
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
                        Price Options (2-8 pax):
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
                            <span className="font-semibold text-blue-600">
                              €{option.price} per person
                            </span>
                          </div>
                        ))}
                        {route.priceOptions.length > 3 && (
                          <div className="text-center">
                            <button
                              onClick={() => handleRouteSelect(route)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View all {route.priceOptions.length} options →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-blue-600 font-bold">
                        €{route.priceRange.min} - €{route.priceRange.max}
                      </div>
                      <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded">
                        {route.duration}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRouteSelect(route)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                    >
                      Select Package & Choose Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flamingo & Rhino Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-blue-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif">
            Flamingo Spectacle & Rhino Conservation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                The Pink Lake
              </h3>
              <p className="text-gray-700 mb-4">
                Lake Nakuru's alkaline waters support massive blooms of
                blue-green algae, which attract up to 1.5 million lesser
                flamingos. When conditions are right, the lake surface appears
                pink as far as the eye can see. The flamingo population
                fluctuates based on water levels and algae availability,
                creating a dynamic and ever-changing spectacle.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <strong>Lesser Flamingos:</strong> 1-1.5 million during peak
                  season
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <strong>Greater Flamingos:</strong> Thousands feed alongside
                  their smaller cousins
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <strong>Best Viewing:</strong> Southern and eastern shores of
                  the lake
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <strong>Water Levels:</strong> Fluctuating levels affect
                  flamingo numbers
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">
                Rhino Sanctuary Success
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded mr-3">
                    <span className="text-blue-600 font-bold">🦏</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Both Species Protected
                    </p>
                    <p className="text-sm text-gray-600">
                      Home to both endangered black rhinos and white rhinos
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded mr-3">
                    <span className="text-blue-600 font-bold">📈</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Conservation Success
                    </p>
                    <p className="text-sm text-gray-600">
                      Rhino population steadily increasing through protection
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded mr-3">
                    <span className="text-blue-600 font-bold">🌳</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Giraffe Conservation
                    </p>
                    <p className="text-sm text-gray-600">
                      Important sanctuary for endangered Rothschild's giraffe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-blue-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 font-serif">
            Plan Your Lake Nakuru Adventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Choose Your Lodge
              </h3>
              <p className="text-gray-600 text-sm">
                Select from 7 premium lodges for your Lake Nakuru accommodation.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Select Safari Package
              </h3>
              <p className="text-gray-600 text-sm">
                Choose a Lake Nakuru safari route and customize your itinerary.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
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

      {/* Edit Modal */}
      {showEditModal && editingRoute && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setShowEditModal(false)
          }
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Safari Package
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
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

              {/* Edit Notice */}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <p className="text-sm text-blue-800">
                    Editing package: <strong>{editingRoute.name}</strong>
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdatePackage}>
                <div className="space-y-4">
                  {/* Route Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Route Name *
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-bold">
                        Lake Nakuru →
                      </span>
                      <span className="text-sm text-gray-500">
                        (auto-added)
                      </span>
                    </div>
                    <input
                      type="text"
                      name="routeName"
                      value={adminForm.routeName}
                      onChange={handleAdminFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter the rest of the route (e.g., Lake Naivasha → Nairobi)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Full route will be:{" "}
                      <strong>
                        Lake Nakuru → {adminForm.routeName || "[your route]"}
                      </strong>
                    </p>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the Lake Nakuru safari experience..."
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Flamingo Spectacle, Rhino Sanctuary, Bird Watching"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed day-by-day itinerary starting from Lake Nakuru..."
                    />
                  </div>

                  {/* Price Options */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-gray-700 font-semibold">
                        Price Options (2-8 pax, per person) *
                      </label>
                      <button
                        type="button"
                        onClick={addPriceOption}
                        disabled={adminForm.priceOptions.length >= 7}
                        className={`text-sm px-3 py-1 rounded transition-colors ${
                          adminForm.priceOptions.length >= 7
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
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1">
                              Pax (2-8)
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
                              min="2"
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
                                className="ml-3 text-blue-600 hover:text-blue-800"
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
                      * Minimum 2 price options required. You can add up to 7
                      options (2-8 pax).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Update Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  Create New Lake Nakuru Safari Package
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

              {/* Park Specific Notice */}
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> All packages will automatically
                    include "Lake Nakuru" in the route name. This ensures they
                    appear in the Lake Nakuru packages list.
                  </p>
                </div>
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
                    {backendStatus.connected
                      ? "This package will be saved to both local storage and database."
                      : "Backend offline. Package will be saved locally only."}
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-bold">
                        Lake Nakuru →
                      </span>
                      <span className="text-sm text-gray-500">
                        (auto-added)
                      </span>
                    </div>
                    <input
                      type="text"
                      name="routeName"
                      value={adminForm.routeName}
                      onChange={handleAdminFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter the rest of the route (e.g., Lake Naivasha → Nairobi)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Full route will be:{" "}
                      <strong>
                        Lake Nakuru → {adminForm.routeName || "[your route]"}
                      </strong>
                    </p>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the Lake Nakuru safari experience..."
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Flamingo Spectacle, Rhino Sanctuary, Bird Watching"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed day-by-day itinerary starting from Lake Nakuru..."
                    />
                  </div>

                  {/* Price Options */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-gray-700 font-semibold">
                        Price Options (2-8 pax, per person) *
                      </label>
                      <button
                        type="button"
                        onClick={addPriceOption}
                        disabled={adminForm.priceOptions.length >= 7}
                        className={`text-sm px-3 py-1 rounded transition-colors ${
                          adminForm.priceOptions.length >= 7
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
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1">
                              Pax (2-8)
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
                              min="2"
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
                                className="ml-3 text-blue-600 hover:text-blue-800"
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
                      * Minimum 2 price options required. You can add up to 7
                      options (2-8 pax).
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
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Create Lake Nakuru Package
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
                  Select Number of Pax (2-8)
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
                      className="border-2 border-blue-100 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
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
                          <div className="text-2xl font-bold text-blue-600">
                            €{option.price}
                          </div>
                          <p className="text-sm text-gray-500">per pax</p>
                        </div>
                      </div>
                      <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">
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

      {/* Lodge Selection Modal */}
      {showLodgeModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Select Your Lake Nakuru Lodge
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
                {lakeNakuruLodges.map((lodge, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                      selectedLodge?.name === lodge.name
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-blue-300"
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
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
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
                                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
                          confirmButtonColor: "#2563eb",
                        });
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white py-3 rounded-lg font-semibold transition-colors"
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
                <span className="text-sm bg-blue-600 px-3 py-1 rounded-full">
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
                      ? "border-blue-500"
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

              {/* Lodge Information */}
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
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
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
                        className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{day}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Price Estimate */}
              <div className="bg-blue-100 p-4 rounded-lg mb-6 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">
                    Estimated Total Price:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
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
                  Book Your Lake Nakuru Safari
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

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Number of Pax (2-8) *
                  </label>
                  <select
                    name="travelers"
                    value={bookingForm.travelers}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Pax
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select number of people (2-8 pax)
                  </p>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Any special requirements, bird watching interests, photography preferences, or questions about flamingo viewing..."
                  ></textarea>
                </div>

                {/* Booking Summary */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Booking Summary
                  </h3>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Route:</span>{" "}
                    {selectedRoute?.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Lodge:</span>{" "}
                    {selectedLodge?.name || "Not selected"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Duration:</span>{" "}
                    {selectedDays} days
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Pax:</span>{" "}
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
                disabled={isLoading}
                className={`w-full ${
                  isLoading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                } text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 mt-6 flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

export default Nakuru;