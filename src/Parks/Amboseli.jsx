import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Backend API base URL
const API_BASE_URL = "https://joz-tours-backend-2026.onrender.com/api";

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
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [showAttractionModal, setShowAttractionModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [filteredSafariRoutes, setFilteredSafariRoutes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedRouteForPricing, setSelectedRouteForPricing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPackageDetailModal, setShowPackageDetailModal] = useState(false);
  const [selectedPackageForDetail, setSelectedPackageForDetail] =
    useState(null);

  const [collapsedSections, setCollapsedSections] = useState({
    parkInfo: false,
    gallery: false,
    attractions: false,
    packages: false,
    kilimanjaro: false,
  });

  const toggleSection = (section) =>
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  const toggleCardExpand = (cardId) =>
    setExpandedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));

  const [safariRoutes, setSafariRoutes] = useState([]);

  // ============ FETCH PACKAGES - SIMPLE ITINERARY ============
  const fetchPackagesFromDatabase = async (showNotification = false) => {
    setLoadingPackages(true);
    try {
      const response = await fetch(`${API_BASE_URL}/safari-cards`);
      if (response.ok) {
        const data = await response.json();
        console.log("📦 Raw backend response:", data);

        if (data.success && data.data) {
          const amboseliPackages = data.data.filter(
            (pkg) => pkg.name && pkg.name.toLowerCase().includes("amboseli"),
          );

          const formattedPackages = amboseliPackages.map((pkg) => {
            // ===== PRICE OPTIONS =====
            let priceOptions = [];
            if (
              pkg.prices &&
              Array.isArray(pkg.prices) &&
              pkg.prices.length > 0
            ) {
              pkg.prices.forEach((priceObj) => {
                const priceMap = priceObj.prices || {};
                Object.entries(priceMap).forEach(([key, value]) => {
                  if (value && parseFloat(value) > 0) {
                    const people = parseInt(key.replace("pax_", "")) || 2;
                    if (!priceOptions.find((o) => o.people === people)) {
                      priceOptions.push({
                        people: people,
                        price: parseFloat(value),
                        currency: "euro",
                      });
                    }
                  }
                });
              });
            }
            priceOptions.sort((a, b) => a.people - b.people);

            // ===== HIGHLIGHTS =====
            let highlights = [];
            if (pkg.highlights) {
              highlights = Array.isArray(pkg.highlights)
                ? pkg.highlights
                : typeof pkg.highlights === "string"
                  ? pkg.highlights
                      .split(",")
                      .map((h) => h.trim())
                      .filter((h) => h)
                  : [];
            }
            if (
              highlights.length === 0 &&
              pkg.days &&
              Array.isArray(pkg.days)
            ) {
              highlights = pkg.days
                .map((day) => day.title || `Day ${day.day_number}`)
                .filter(Boolean);
            }

            // ===== ITINERARY - JUST RAW TEXT, NOTHING ADDED =====
            let fullItinerary = "";
            if (pkg.fullitinerary && pkg.fullitinerary.trim()) {
              // Use the exact text stored in fullitinerary field
              fullItinerary = pkg.fullitinerary;
            } else if (
              pkg.days &&
              Array.isArray(pkg.days) &&
              pkg.days.length > 0
            ) {
              // Fallback: only day number, title, and description - no extras
              fullItinerary = pkg.days
                .map((day) => {
                  let text = `Day ${day.day_number}: ${day.title || ""}`;
                  if (day.description && day.description.trim()) {
                    text += `\n${day.description}`;
                  }
                  return text;
                })
                .join("\n\n");
            }

            // ===== INCLUDES / EXCLUDES =====
            let includes = [];
            let excludes = [];
            if (
              pkg.prices &&
              Array.isArray(pkg.prices) &&
              pkg.prices.length > 0
            ) {
              const firstPrice = pkg.prices[0];
              includes = Array.isArray(firstPrice.includes)
                ? firstPrice.includes
                : [];
              excludes = Array.isArray(firstPrice.excludes)
                ? firstPrice.excludes
                : [];
            }
            if (includes.length === 0 && pkg.includes) {
              includes = Array.isArray(pkg.includes) ? pkg.includes : [];
            }
            if (excludes.length === 0 && pkg.excludes) {
              excludes = Array.isArray(pkg.excludes) ? pkg.excludes : [];
            }

            return {
              id: pkg.id,
              name: pkg.name,
              description: pkg.description || "",
              duration: `${pkg.total_days || 3} days`,
              total_days: pkg.total_days || 3,
              highlights: highlights,
              fullItinerary: fullItinerary,
              priceOptions: priceOptions,
              includes: includes,
              excludes: excludes,
              created_at: pkg.created_at,
              updated_at: pkg.updated_at,
              rawData: pkg,
            };
          });

          setSafariRoutes(formattedPackages);

          if (
            showNotification &&
            isAuthenticated &&
            formattedPackages.length > 0
          ) {
            Swal.fire({
              icon: "success",
              title: "Packages Loaded!",
              text: `Successfully loaded ${formattedPackages.length} Amboseli packages.`,
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              toast: true,
              position: "top-end",
            });
          }
        }
      } else {
        throw new Error("Failed to fetch packages");
      }
    } catch (error) {
      console.error("❌ Error fetching packages:", error);
      if (isAuthenticated && showNotification) {
        Swal.fire({
          title: "⚠️ Connection Error",
          text: "Could not fetch packages from the database.",
          icon: "error",
          confirmButtonColor: "#d97706",
          confirmButtonText: "Try Again",
        }).then(() => {
          fetchPackagesFromDatabase(true);
        });
      }
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchPackagesFromDatabase(false);
  }, []);

  useEffect(() => {
    const filtered = safariRoutes.filter(
      (route) => route.name && route.name.toLowerCase().includes("amboseli"),
    );
    setFilteredSafariRoutes(filtered);
    setShowAllPackages(false);
  }, [safariRoutes]);

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
    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    try {
      const bookingData = localStorage.getItem("amboseliBooking");
      if (bookingData) {
        const parsedData = JSON.parse(bookingData);
        if (
          parsedData.park?.name === "Amboseli National Park" &&
          parsedData.lodge
        ) {
          setSelectedLodge(parsedData.lodge);
        }
      }
    } catch (error) {
      console.error("Error loading lodge selection:", error);
    }
  }, []);

  // ============ PARK INFO ============
  const parkInfo = {
    id: 1,
    name: "Amboseli National Park",
    image: "/assets/amboseli.png",
    fallbackImage: "/assets/amboseli-page.jpg",
    description:
      "Famous for its large elephant herds and stunning views of Mount Kilimanjaro.",
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
        "One of the best wildlife lodges in Africa with stunning views of Kilimanjaro.",
      priceRange: "$$$$",
      features: ["Kilimanjaro Views", "Premium Location", "Wildlife Haven"],
    },
    {
      name: "Amboseli Serena Safari Lodge",
      image: "/assets/amboseli-serena.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Maasai-inspired lodge with traditional design and swimming pool.",
      priceRange: "$$$",
      features: ["Maasai Design", "Swimming Pool", "Cultural Experience"],
    },
    {
      name: "Tortilis Camp",
      image: "/assets/tortilis-camp.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Eco-friendly luxury tented camp offering privacy and exclusivity.",
      priceRange: "$$$$$",
      features: ["Eco Luxury", "Private Tents", "Exclusive Experience"],
    },
    {
      name: "Kibo Safari Camp",
      image: "/assets/kibo-safari-camp.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description: "Comfortable tented camp with excellent Kilimanjaro views.",
      priceRange: "$$",
      features: ["Budget Friendly", "Great Views", "Comfortable Tents"],
    },
    {
      name: "Amboseli Sopa Lodge",
      image: "/assets/amboseli-sopa.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description: "Spacious lodge with traditional African architecture.",
      priceRange: "$$$",
      features: ["Traditional Architecture", "Spacious", "Family Friendly"],
    },
    {
      name: "Sentrim Amboseli Lodge",
      image: "/assets/sentrim-amboseli.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description:
        "Affordable lodge with comfortable rooms and easy park access.",
      priceRange: "$$",
      features: ["Affordable", "Easy Access", "Comfortable"],
    },
    {
      name: "Porini Amboseli Camp",
      image: "/assets/porini-amboseli.jpg",
      fallbackImage: "/assets/lodges/default-lodge.jpg",
      description: "Eco-friendly camp offering authentic safari experiences.",
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
      description: "360-degree viewpoint overlooking the entire park.",
      bestTime: "Sunrise or sunset",
      highlight: "Panoramic Kilimanjaro views",
      details: "Observation Hill offers the best vantage point in Amboseli.",
    },
    {
      id: 2,
      name: "Enkongo Narok Swamp",
      image: "/assets/swamp.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Permanent swamp attracting elephants and hippos.",
      bestTime: "Dry season",
      highlight: "Elephant drinking spot",
      details: "Vital water source during the dry season.",
    },
    {
      id: 3,
      name: "Sinet Delta",
      image: "/assets/delta-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "River delta with diverse birdlife.",
      bestTime: "Year-round",
      highlight: "Bird watching paradise",
      details: "Attracts flamingos, pelicans, and kingfishers.",
    },
    {
      id: 4,
      name: "Kitirua Conservancy",
      image: "/assets/con-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Community-owned conservancy.",
      bestTime: "Year-round",
      highlight: "Cultural interactions",
      details: "Experience Maasai culture firsthand.",
    },
    {
      id: 5,
      name: "Amboseli Research Centre",
      image: "/assets/tr-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Long-term elephant research facility.",
      bestTime: "Year-round",
      highlight: "Scientific insights",
      details: "Studying elephants since 1972.",
    },
    {
      id: 6,
      name: "Kimana Gate Area",
      image: "/assets/kimana-ambo.png",
      fallback: "/assets/amboseli-attractions/default-attraction.jpg",
      description: "Entry point with excellent wildlife viewing.",
      bestTime: "Early morning",
      highlight: "First game drive spot",
      details: "Known for frequent elephant sightings.",
    },
  ];

  const [adminForm, setAdminForm] = useState({
    routeName: "",
    description: "",
    duration: "3",
    highlights: "",
    itinerary: "",
    priceOptions: [],
    includes: "",
    excludes: "",
  });

  const openPackageDetailModal = (route) => {
    setSelectedPackageForDetail(route);
    setShowPackageDetailModal(true);
  };

  // ============ ADMIN FUNCTIONS ============
  const showLoadingSpinner = (message = "Please wait...") => {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const showErrorNotification = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: "error",
      confirmButtonColor: "#d97706",
      confirmButtonText: "OK",
    });
  };

  const handleEditPackage = (route) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "🔒 Access Denied",
        text: "Only administrators can edit packages.",
        icon: "error",
        confirmButtonColor: "#d97706",
        confirmButtonText: "OK",
      });
      return;
    }
    setEditingRoute(route);
    setAdminForm({
      routeName: route.name
        .replace("Amboseli → ", "")
        .replace("Amboseli ", "")
        .trim(),
      description: route.description,
      duration: String(route.total_days || 3),
      highlights: route.highlights ? route.highlights.join(", ") : "",
      itinerary: route.fullItinerary || "",
      priceOptions: route.priceOptions ? [...route.priceOptions] : [],
      includes: route.includes ? route.includes.join(", ") : "",
      excludes: route.excludes ? route.excludes.join(", ") : "",
    });
    setShowEditModal(true);
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    const routeName = adminForm.routeName.toLowerCase().startsWith("amboseli")
      ? adminForm.routeName
      : `Amboseli → ${adminForm.routeName}`;
    if (!routeName.toLowerCase().includes("amboseli")) {
      showErrorNotification(
        "⚠️ Invalid Package Name",
        "Package name must include 'Amboseli'.",
      );
      return;
    }
    const validPriceOptions = adminForm.priceOptions.filter(
      (opt) => opt.people > 0 && opt.price > 0,
    );
    if (validPriceOptions.length === 0) {
      showErrorNotification("⚠️ Invalid Prices", "Please enter valid prices.");
      return;
    }
    showLoadingSpinner("⏳ Updating package...");
    const totalDays = parseInt(adminForm.duration) || 3;
    const updatedPackage = {
      name: routeName,
      description: adminForm.description,
      total_days: totalDays,
      total_nights: totalDays - 1,
      highlights: adminForm.highlights
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
      fullitinerary: adminForm.itinerary,
      priceOptions: validPriceOptions,
      includes: adminForm.includes
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0),
      excludes: adminForm.excludes
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0),
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/safari-cards/${editingRoute.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(updatedPackage),
        },
      );
      const result = await response.json();
      if (response.ok && result.success) {
        Swal.close();
        Swal.fire({
          title: "✅ Package Updated Successfully!",
          html: `<div style="text-align: left; padding: 10px;"><p style="font-size: 18px; font-weight: bold; color: #166534;">${routeName}</p></div>`,
          icon: "success",
          confirmButtonColor: "#d97706",
          timer: 4000,
        });
        await fetchPackagesFromDatabase(true);
        setShowEditModal(false);
        setEditingRoute(null);
      } else {
        throw new Error(result.error || "Failed to update package");
      }
    } catch (error) {
      Swal.close();
      showErrorNotification(
        "❌ Update Failed",
        "Could not update the package.",
      );
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const routeName = adminForm.routeName.toLowerCase().startsWith("amboseli")
      ? adminForm.routeName
      : `Amboseli → ${adminForm.routeName}`;
    if (!routeName.toLowerCase().includes("amboseli")) {
      showErrorNotification(
        "⚠️ Invalid Package Name",
        "Package name must include 'Amboseli'.",
      );
      return;
    }
    if (adminForm.priceOptions.length === 0) {
      showErrorNotification(
        "⚠️ No Prices Set",
        "Please add at least one price option.",
      );
      return;
    }
    const validPriceOptions = adminForm.priceOptions.filter(
      (opt) => opt.people > 0 && opt.price > 0,
    );
    if (validPriceOptions.length === 0) {
      showErrorNotification("⚠️ Invalid Prices", "Please enter valid prices.");
      return;
    }
    showLoadingSpinner("⏳ Creating your safari package...");
    const totalDays = parseInt(adminForm.duration) || 3;
    const newPackage = {
      name: routeName,
      description: adminForm.description,
      total_days: totalDays,
      total_nights: totalDays - 1,
      highlights: adminForm.highlights
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
      fullitinerary: adminForm.itinerary,
      priceOptions: validPriceOptions,
      includes: adminForm.includes
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0),
      excludes: adminForm.excludes
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0),
    };
    try {
      const response = await fetch(`${API_BASE_URL}/safari-cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(newPackage),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        Swal.close();
        Swal.fire({
          title: "🎉 Package Created Successfully!",
          html: `<div style="text-align: left; padding: 10px;"><p style="font-size: 20px; font-weight: bold; color: #92400e;">🐘 ${routeName}</p><p><strong>📅 Duration:</strong> ${totalDays} days</p></div>`,
          icon: "success",
          confirmButtonColor: "#d97706",
          confirmButtonText: "✨ View Package",
          showCancelButton: true,
          cancelButtonText: "Create Another",
        }).then((result) => {
          if (result.isConfirmed) {
            setShowAllPackages(true);
          }
          fetchPackagesFromDatabase(true);
        });
        setAdminForm({
          routeName: "",
          description: "",
          duration: "3",
          highlights: "",
          itinerary: "",
          priceOptions: [],
          includes: "",
          excludes: "",
        });
        setShowAdminForm(false);
      } else {
        throw new Error(result.error || "Failed to create package");
      }
    } catch (error) {
      Swal.close();
      showErrorNotification(
        "❌ Creation Failed",
        "Could not save the package.",
      );
    }
  };

  const handleDeletePackage = async (routeId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "🔒 Access Denied",
        text: "Only administrators can delete packages.",
        icon: "error",
        confirmButtonColor: "#d97706",
      });
      return;
    }
    const packageToDelete = safariRoutes.find((r) => r.id === routeId);
    const packageName = packageToDelete?.name || "this package";
    Swal.fire({
      title: "⚠️ Delete Package?",
      html: `<div><p>You are about to permanently delete:</p><div style="background: #fee2e2; padding: 15px; border-radius: 8px;"><p style="font-weight: bold; color: #991b1b;">${packageName}</p></div></div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "🗑️ Yes, Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        showLoadingSpinner("⏳ Deleting package...");
        try {
          const response = await fetch(
            `${API_BASE_URL}/safari-cards/${routeId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            },
          );
          if (response.ok) {
            Swal.close();
            Swal.fire({
              title: "🗑️ Package Deleted Successfully!",
              icon: "success",
              confirmButtonColor: "#d97706",
              timer: 3000,
            });
            await fetchPackagesFromDatabase(true);
            if (selectedRoute?.id === routeId) setSelectedRoute(null);
          } else {
            throw new Error("Failed to delete package");
          }
        } catch (error) {
          Swal.close();
          showErrorNotification(
            "❌ Delete Failed",
            "Could not delete the package.",
          );
        }
      }
    });
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
    const existing = adminForm.priceOptions.map((o) => o.people);
    let next = 2;
    while (existing.includes(next) && next <= 10) next++;
    if (next > 10) {
      Swal.fire({
        title: "⚠️ Maximum Reached",
        text: "You can only add price options for up to 10 people.",
        icon: "warning",
        confirmButtonColor: "#d97706",
        timer: 2000,
      });
      return;
    }
    setAdminForm({
      ...adminForm,
      priceOptions: [
        ...adminForm.priceOptions,
        { people: next, price: 0, currency: "euro" },
      ],
    });
  };

  const removePriceOption = (index) => {
    if (adminForm.priceOptions.length <= 1) {
      Swal.fire({
        title: "⚠️ Minimum Required",
        text: "You need at least 1 price option.",
        icon: "warning",
        confirmButtonColor: "#d97706",
        timer: 2000,
      });
      return;
    }
    setAdminForm({
      ...adminForm,
      priceOptions: adminForm.priceOptions.filter((_, i) => i !== index),
    });
  };

  // ============ BOOKING FUNCTIONS ============
  const handleRouteSelect = async (route) => {
    if (!selectedLodge) {
      const result = await Swal.fire({
        title: "🏨 Lodge Required",
        html: `<div><p>Please select your accommodation first.</p></div>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#d97706",
        confirmButtonText: "🏨 Choose Lodge",
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
      title: "🏨 Selecting Lodge...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setTimeout(() => {
      setSelectedLodge(lodge);
      localStorage.setItem(
        "amboseliBooking",
        JSON.stringify({
          park: parkInfo,
          lodge,
          step: "lodge_selected",
          timestamp: new Date().toISOString(),
          page: "Amboseli",
        }),
      );
      Swal.close();
      Swal.fire({
        title: "✅ Lodge Selected!",
        html: `<div><p style="font-size: 18px; font-weight: bold; color: #166534;">${lodge.name}</p></div>`,
        icon: "success",
        confirmButtonColor: "#d97706",
        timer: 2500,
      });
      setShowLodgeModal(false);
    }, 1000);
  };

  const generateItinerary = (days) => {
    const itineraries = [];
    for (let i = 1; i <= days; i++) {
      if (i === 1)
        itineraries.push(
          `Day ${i}: Arrival at Amboseli, check-in at ${selectedLodge?.name || "lodge"} and afternoon game drive.`,
        );
      else if (i === days)
        itineraries.push(
          `Day ${i}: Sunrise game drive with Kilimanjaro backdrop, breakfast, and departure.`,
        );
      else
        itineraries.push(
          `Day ${i}: Full day exploring Amboseli's swamps and plains. ${selectedLodge ? `Overnight at ${selectedLodge.name}.` : ""}`,
        );
    }
    return itineraries;
  };

  const calculatePrice = (travelers, route) => {
    if (!route?.priceOptions || route.priceOptions.length === 0) return 0;
    const exact = route.priceOptions.find((o) => o.people === travelers);
    if (exact) return exact.price;
    const sorted = [...route.priceOptions].sort((a, b) => a.people - b.people);
    const higher = sorted.find((o) => o.people >= travelers);
    return higher ? higher.price : sorted[sorted.length - 1].price;
  };

  const validateBookingReadiness = () => {
    if (!selectedLodge) {
      Swal.fire({
        title: "🏨 Accommodation Required",
        text: "Please select a lodge before booking.",
        icon: "warning",
        confirmButtonColor: "#d97706",
      });
      return false;
    }
    if (!selectedRoute) {
      Swal.fire({
        title: "🗺️ Safari Route Required",
        text: "Please select a safari package.",
        icon: "warning",
        confirmButtonColor: "#d97706",
      });
      return false;
    }
    if (
      !selectedRoute.priceOptions ||
      selectedRoute.priceOptions.length === 0
    ) {
      Swal.fire({
        title: "💰 No Prices Available",
        text: "This package has no prices set yet.",
        icon: "warning",
        confirmButtonColor: "#d97706",
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
          title: "✅ Booking Sent Successfully!",
          icon: "success",
          confirmButtonColor: "#d97706",
        });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const sendDirectEmail = (bookingData) => {
    const body = `AMBOSELI SAFARI BOOKING:\n\n📍 ${bookingData.park}\n🏨 ${bookingData.lodge}\n🚗 ${bookingData.route}\n📅 ${bookingData.days} days\n👥 ${bookingData.travelers} pax\n💰 €${bookingData.totalPrice}\n\n👤 ${bookingData.fullName}\n📧 ${bookingData.email}\n📞 ${bookingData.phone}\n\n💬 ${bookingData.message || "None"}`;
    window.open(
      `mailto:tembo4401@gmail.com?subject=Amboseli Booking: ${bookingData.route} - ${bookingData.fullName}&body=${encodeURIComponent(body)}`,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateBookingReadiness()) return;
    setIsLoading(true);
    showLoadingSpinner("⏳ Processing your booking...");
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
        itinerary: itinerary.join("\n"),
        bookingSource: "Amboseli Park Page",
        route: selectedRoute.name,
        lodgeFeatures: selectedLodge.features?.join(", ") || "",
      };
      const result = await sendBookingToBackend(bookingData);
      if (!result.success) {
        Swal.close();
        Swal.fire({
          title: "⚠️ Email Service Issue",
          text: "A fallback email option will open.",
          icon: "warning",
          confirmButtonColor: "#d97706",
        }).then(() => {
          sendDirectEmail({ ...bookingData, itinerary });
        });
      }
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
      title: "🔄 Change Lodge?",
      text: "Are you sure you want to change your selected lodge?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedLodge(null);
        localStorage.removeItem("amboseliBooking");
        Swal.fire({
          title: "✅ Lodge Cleared",
          icon: "success",
          timer: 1500,
          toast: true,
          position: "top-end",
        });
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
      setShowPackageDetailModal(false);
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

  // ============ RENDER ============
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
                <span className="font-semibold">
                  🏨 Lodge: {selectedLodge.name}
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
          <SectionHeader title="Discover Amboseli" section="parkInfo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-gray-700 text-lg mb-6">
                  Amboseli National Park is one of Africa's most iconic safari
                  destinations.
                </p>
                <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-amber-200">
                  <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
                    <h3 className="text-xl font-bold">
                      Your Amboseli Accommodation
                    </h3>
                    {!selectedLodge ? (
                      <button
                        onClick={() => setShowLodgeModal(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                      >
                        🏨 Choose Lodge
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowLodgeModal(true)}
                          className="bg-amber-600 text-white px-4 py-2 rounded-lg"
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
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
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
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Why Choose Amboseli?
                </h3>
                <div className="space-y-4">
                  {[
                    "🐘 Elephant Paradise",
                    "🏔️ Kilimanjaro Views",
                    "🌿 Diverse Ecosystems",
                    "🎭 Cultural Experience",
                  ].map((title, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <span className="text-amber-600 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-gray-600 text-sm">
                          {
                            [
                              "Over 1,500 free-ranging elephants",
                              "Stunning views at sunrise/sunset",
                              "Lake beds, swamps & woodlands",
                              "Visit Maasai communities",
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
          <div className="mb-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-xl shadow-lg">
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
                className="bg-white text-amber-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Browse Lodges
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        <div className="mb-16">
          <SectionHeader title="Amboseli Gallery" section="gallery">
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
                    <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                      {img.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => openGalleryModal(0)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                🖼️ View Full Gallery ({galleryImages.length} images)
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
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-amber-200">
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
                      <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-amber-600">
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
          <SectionHeader title="Amboseli Safari Packages" section="packages">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">
                  {selectedLodge
                    ? `🏨 Packages with ${selectedLodge.name}`
                    : "Select a lodge first"}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  📍 {filteredSafariRoutes.length} Amboseli packages
                  {loadingPackages && " (loading...)"}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => fetchPackagesFromDatabase(true)}
                      disabled={loadingPackages}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                    >
                      {loadingPackages ? "⏳ Loading..." : "🔄 Refresh"}
                    </button>
                    <button
                      onClick={() => setShowAdminForm(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      ✨ + Add New Package
                    </button>
                  </>
                )}
              </div>
            </div>
            {!selectedLodge ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3">
                  🏨 Lodge Selection Required
                </h3>
                <p className="text-gray-600 mb-4">
                  Please select a lodge first.
                </p>
                <button
                  onClick={() => setShowLodgeModal(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Select Your Lodge Now
                </button>
              </div>
            ) : filteredSafariRoutes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-2">
                  📦 No Packages Available
                </h3>
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowAdminForm(true)}
                    className="bg-amber-600 text-white px-6 py-3 rounded-lg"
                  >
                    ✨ Create Package
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
                  ).map((route) => (
                    <div
                      key={route.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-amber-200 relative group cursor-pointer"
                      onClick={() => openPackageDetailModal(route)}
                    >
                      <div className="absolute top-2 right-2">
                        <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                          🐘 Amboseli
                        </span>
                      </div>
                      {isAuthenticated && (
                        <div className="absolute top-12 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPackage(route);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePackage(route.id);
                            }}
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
                      <div className="h-24 md:h-32 bg-gradient-to-r from-amber-600 to-amber-700 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h3 className="text-xs md:text-sm font-bold">
                            {route.name.split("→")[0].trim()}
                          </h3>
                          <p className="text-xs text-amber-100">
                            Click to view details
                          </p>
                        </div>
                      </div>
                      <div className="p-2 md:p-3">
                        <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1 truncate">
                          {route.name}
                        </h3>
                        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                          {route.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {route.highlights?.slice(0, 2).map((h, i) => (
                            <span
                              key={i}
                              className="bg-amber-100 text-amber-700 text-xs px-1 py-0.5 rounded"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-amber-600 font-bold text-xs">
                            {route.priceOptions &&
                            route.priceOptions.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {route.priceOptions.map((opt, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-amber-50 px-1.5 py-0.5 rounded"
                                  >
                                    {opt.people}pax: €{opt.price}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "No prices set"
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {route.duration}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPackageDetailModal(route);
                            }}
                            className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 py-1.5 px-2 rounded-lg font-semibold text-xs transition-all"
                          >
                            📖 View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRouteSelect(route);
                            }}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-2 rounded-lg font-semibold text-xs transition-all"
                          >
                            🗺️ Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredSafariRoutes.length > 6 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowAllPackages(!showAllPackages)}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-semibold"
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

        {/* Kilimanjaro Info */}
        <div className="mb-16">
          <SectionHeader
            title="Kilimanjaro & Elephant Experience"
            section="kilimanjaro"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    🏔️ Africa's Tallest Backdrop
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Mount Kilimanjaro (5,895m) provides a dramatic backdrop.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Best Viewing:</strong> Early morning (6-8 AM)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                      <strong>Elephant Research:</strong> Since 1972
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    🐘 Elephant Conservation
                  </h4>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded mr-3">
                      <span>🐘</span>
                    </div>
                    <div>
                      <p className="font-medium">Long-term Research</p>
                      <p className="text-sm text-gray-600">
                        Continuous study since 1972
                      </p>
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
            📋 Plan Your Amboseli Adventure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                step: 1,
                title: "Choose Your Lodge",
                desc: "Select from 7 premium lodges",
                emoji: "🏨",
              },
              {
                step: 2,
                title: "Select Safari Package",
                desc: "Choose a safari route",
                emoji: "🗺️",
              },
              {
                step: 3,
                title: "Book & Confirm",
                desc: "Secure your spot",
                emoji: "✅",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200 hover:shadow-xl transition-all group"
              >
                <div className="relative p-4 md:p-6">
                  <div className="absolute -top-3 -left-3 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl md:text-3xl">
                      {s.step}
                    </span>
                  </div>
                  <div className="pl-8 md:pl-10 pt-2">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                      {s.emoji} {s.title}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ PACKAGE DETAIL MODAL ============ */}
      {showPackageDetailModal && selectedPackageForDetail && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 flex justify-between items-center border-b">
              <h2 className="text-2xl font-bold">📋 Package Details</h2>
              <button
                onClick={() => setShowPackageDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-xl mb-6">
                <h3 className="text-2xl font-bold">
                  {selectedPackageForDetail.name}
                </h3>
                <p className="text-amber-100 mt-2">
                  {selectedPackageForDetail.duration} •{" "}
                  {selectedPackageForDetail.total_days} Days Safari
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  📝 Description
                </h4>
                <p className="text-gray-700">
                  {selectedPackageForDetail.description}
                </p>
              </div>
              {selectedPackageForDetail.highlights &&
                selectedPackageForDetail.highlights.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      ⭐ Highlights
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedPackageForDetail.highlights.map((h, i) => (
                        <li key={i} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {selectedPackageForDetail.fullItinerary && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    🗺️ Itinerary
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans">
                      {selectedPackageForDetail.fullItinerary}
                    </pre>
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  💰 Price Options
                </h4>
                {selectedPackageForDetail.priceOptions &&
                selectedPackageForDetail.priceOptions.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedPackageForDetail.priceOptions.map((o, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50 p-3 rounded-lg text-center border border-amber-200"
                      >
                        <p className="text-sm text-gray-600">
                          {o.people} Travelers
                        </p>
                        <p className="text-xl font-bold text-amber-600">
                          €{o.price}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-amber-600 font-semibold text-center py-4 border border-amber-200 rounded-lg">
                    No prices set for this package
                  </div>
                )}
              </div>
              {selectedPackageForDetail.includes &&
                selectedPackageForDetail.includes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      ✅ Includes
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 bg-green-50 p-4 rounded-lg">
                      {selectedPackageForDetail.includes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              {selectedPackageForDetail.excludes &&
                selectedPackageForDetail.excludes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      ❌ Excludes
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 bg-red-50 p-4 rounded-lg">
                      {selectedPackageForDetail.excludes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowPackageDetailModal(false);
                    handleRouteSelect(selectedPackageForDetail);
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold"
                >
                  🗺️ Book This Package
                </button>
                <button
                  onClick={() => setShowPackageDetailModal(false)}
                  className="flex-1 bg-gray-300 py-3 rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <span className="bg-amber-600/80 text-white text-sm px-3 py-1 rounded-full">
                    ⭐ {selectedAttraction.highlight}
                  </span>
                  <span className="bg-amber-700/80 text-white text-sm px-3 py-1 rounded-full">
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
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold mt-4"
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
              💰 Select Travelers & Price
            </h2>
            <p className="text-gray-600 mb-6">{selectedRouteForPricing.name}</p>
            {selectedRouteForPricing.priceOptions &&
            selectedRouteForPricing.priceOptions.length > 0 ? (
              <div className="space-y-3 mb-6">
                {selectedRouteForPricing.priceOptions.map((o) => (
                  <button
                    key={o.people}
                    onClick={() => handleFinalPriceSelect(o.people)}
                    className="w-full flex justify-between items-center p-4 border rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all"
                  >
                    <span className="font-semibold">{o.people} Travelers</span>
                    <span className="text-amber-600 font-bold text-xl">
                      €{o.price}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-amber-600 font-semibold">
                No price options available
              </div>
            )}
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
                🏨 Select Your Amboseli Lodge
              </h2>
              <button
                onClick={() => setShowLodgeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {amboseliLodges.map((lodge) => (
                <div
                  key={lodge.name}
                  className="border rounded-xl overflow-hidden hover:shadow-xl cursor-pointer transition-all hover:border-amber-400"
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
                          className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-600 font-bold">
                        {lodge.priceRange}
                      </span>
                      <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-all">
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
              <h2 className="text-2xl font-bold">📋 Complete Your Booking</h2>
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
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
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingForm.startDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
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
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">📊 Booking Summary</h3>
                <p className="text-sm">
                  <strong>🏨 Lodge:</strong> {selectedLodge?.name}
                </p>
                <p className="text-sm">
                  <strong>🗺️ Route:</strong> {selectedRoute?.name}
                </p>
                <p className="text-sm">
                  <strong>👥 Travelers:</strong> {bookingForm.travelers} pax
                </p>
                <p className="text-sm">
                  <strong>💰 Total:</strong> €
                  {calculatePrice(bookingForm.travelers, selectedRoute)}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {isLoading ? "⏳ Processing..." : "✅ Confirm Booking"}
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
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
              >
                ←
              </button>
              <button
                onClick={nextGalleryImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
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
              <h2 className="text-2xl font-bold">
                ✨ Create New Safari Package
              </h2>
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
                  placeholder="e.g., 3-Day Amboseli Safari"
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                  required
                />
                <p className="text-xs text-amber-600 mt-1">
                  🐘 "Amboseli → " will be added automatically
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
                  placeholder="Describe the safari experience..."
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={adminForm.duration}
                  onChange={handleAdminFormChange}
                  min="1"
                  max="30"
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                  required
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
                  placeholder="e.g., Elephant herds, Kilimanjaro views"
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Itinerary</label>
                <textarea
                  name="itinerary"
                  value={adminForm.itinerary}
                  onChange={handleAdminFormChange}
                  rows="6"
                  placeholder="Type your itinerary here exactly as you want it displayed..."
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500 font-mono text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  💰 Price Options
                </label>
                {adminForm.priceOptions.length === 0 ? (
                  <div className="text-gray-500 text-sm mb-3">
                    No price options added yet.
                  </div>
                ) : (
                  adminForm.priceOptions.map((o, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="People"
                        value={o.people}
                        onChange={(e) =>
                          handlePriceOptionChange(i, "people", e.target.value)
                        }
                        className="w-1/3 px-3 py-2 border rounded-lg"
                        min="1"
                      />
                      <input
                        type="number"
                        placeholder="Price (€)"
                        value={o.price}
                        onChange={(e) =>
                          handlePriceOptionChange(i, "price", e.target.value)
                        }
                        className="w-1/3 px-3 py-2 border rounded-lg"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => removePriceOption(i)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
                <button
                  type="button"
                  onClick={addPriceOption}
                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                >
                  + Add Price Option
                </button>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  ✅ Includes (comma separated)
                </label>
                <input
                  type="text"
                  name="includes"
                  value={adminForm.includes}
                  onChange={handleAdminFormChange}
                  placeholder="e.g., Park fees, Game drives, Accommodation"
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  ❌ Excludes (comma separated)
                </label>
                <input
                  type="text"
                  name="excludes"
                  value={adminForm.excludes}
                  onChange={handleAdminFormChange}
                  placeholder="e.g., International flights, Tips"
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold"
                >
                  ✨ Create Package
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
              <h2 className="text-2xl font-bold">✏️ Edit Safari Package</h2>
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
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
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
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={adminForm.duration}
                  onChange={handleAdminFormChange}
                  min="1"
                  max="30"
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Highlights</label>
                <input
                  type="text"
                  name="highlights"
                  value={adminForm.highlights}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Itinerary</label>
                <textarea
                  name="itinerary"
                  value={adminForm.itinerary}
                  onChange={handleAdminFormChange}
                  rows="6"
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500 font-mono text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  💰 Price Options
                </label>
                {adminForm.priceOptions.length === 0 ? (
                  <div className="text-gray-500 text-sm mb-3">
                    No price options added yet.
                  </div>
                ) : (
                  adminForm.priceOptions.map((o, i) => (
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
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
                <button
                  type="button"
                  onClick={addPriceOption}
                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                >
                  + Add Price Option
                </button>
              </div>
              <div>
                <label className="block font-semibold mb-2">✅ Includes</label>
                <input
                  type="text"
                  name="includes"
                  value={adminForm.includes}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">❌ Excludes</label>
                <input
                  type="text"
                  name="excludes"
                  value={adminForm.excludes}
                  onChange={handleAdminFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:border-amber-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold"
                >
                  💾 Update Package
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
    </div>
  );
};

export default Amboseli;
