import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// API Configuration
const API_BASE_URL = "http://localhost:5000";

const CoastalAccommodation = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLodgeDetailModal, setShowLodgeDetailModal] = useState(false);
  const [showCoastalDetailModal, setShowCoastalDetailModal] = useState(false);
  const [selectedLodge, setSelectedLodge] = useState(null);
  const [selectedCoastal, setSelectedCoastal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllCoastal, setShowAllCoastal] = useState(false);
  const [showAllSafari, setShowAllSafari] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
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

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        setBackendStatus(data.status === "healthy" ? "connected" : "error");
        console.log("Backend connection:", data);
      } catch (error) {
        setBackendStatus("offline");
        console.warn("Backend server might be offline:", error.message);
      }
    };

    checkBackendHealth();
  }, []);

  // Complete Safari Camps & Lodges Data
  const safariLodges = [
    {
      id: 1,
      name: "Galdesa Camp",
      park: "Tsavo East National Park",
      category: "Tsavo East",
      image: "/assets/galdessa .png",
      type: "Camp",
      fullDescription: `Galdesa Camp is a luxurious tented camp located in the heart of Tsavo East National Park. The camp offers an authentic safari experience with modern comforts, situated along the Galana River.`,
      accommodation: `The camp features spacious tents with en-suite bathrooms, private verandas overlooking the river, and comfortable bedding. Each tent is designed to blend with the natural environment.`,
      facilities: `Facilities include a restaurant, bar, swimming pool, game drives, bird watching, and guided nature walks.`,
    },
    {
      id: 2,
      name: "Voi Wildlife Lodge",
      park: "Tsavo East National Park",
      category: "Tsavo East",
      image: "/assets/voi wilde.png",
      type: "Lodge",
      fullDescription: `Voi Wildlife Lodge is situated on a 25-acre site on the boundary of Tsavo East National Park, one of Kenya's largest game parks with spectacular views of nearby volcanic outcrops, such as the Kasigau, Sagalla and Mwakingali Hills. Designed to blend unassumingly into the surrounding environment, the lodge boasts a natural waterhole often attracting big game, including elephant, lion, cheetah, buffalo as well as a rich variety of birdlife.

Voi Wildlife Lodge is ideally placed for visitors wishing to combine a 'bush' and 'beach' safari holiday in Kenya with its accessibility to Tsavo National Park and its close proximity to the coast. With temperatures in the day average 25 degrees Celsius and cooler nights, Tsavo East offers an ideal climate in which to relax, indulge in the many facilities on offer at the lodge and enjoy one of the world's leading biodiversity strongholds.`,
      accommodation: `Accommodating up to 300 guests, all rooms have spacious en-suite bathrooms and are furnished in African decor that is replicated throughout the lodge. The luxury rooms comprise two four-poster beds and views of the Savannah, which one can enjoy from the comfort of one's balcony or terrace.

Voi Wildlife Lodge also has tents, with en-suite bathrooms. Each tent accommodates two beds and gives you the feeling of camping in the wild. There are a number of rooms specifically designed to cater for disabled guests close to the reception. Paved paths, lit by night, lead from one's room to the reception and restaurant areas. Laundry and babysitting services are available on request.`,
      facilities: `Voi Wildlife Lodge offers a variety of activities for families, including a children's outdoor recreation area, swimming pool and jacuzzi, two badminton courts, a volleyball court as well as table tennis and a pool table. There is also a Discovery Area complete with a mini-library, TV and DVD facilities.`,
    },
    {
      id: 3,
      name: "Ashnil Aruba Lodge",
      park: "Tsavo East National Park",
      category: "Tsavo East",
      image: "/assets/Ashnil aruba.png",
      type: "Lodge",
      fullDescription: `Ashnil Aruba Lodge is located in Tsavo East National Park, overlooking the famous Aruba Dam. The lodge offers stunning views of wildlife gathering at the dam.`,
      accommodation: `The lodge features 40 rooms with en-suite bathrooms, private balconies, and views of the dam and savannah.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, game drives, and bird watching platforms.`,
    },
    {
      id: 4,
      name: "Voi Safari Lodge",
      park: "Tsavo East National Park",
      category: "Tsavo East",
      image: "/assets/safari lodge.png",
      type: "Lodge",
      fullDescription: `Voi Safari Lodge is perched on a vantage point overlooking the vast Tsavo East plains. The lodge offers spectacular views of the surrounding landscape and wildlife.`,
      accommodation: `The lodge has 52 rooms all with en-suite bathrooms and private balconies offering panoramic views.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, souvenir shop, and game viewing decks.`,
    },
    {
      id: 5,
      name: "Sentrim Tsavo Camp",
      park: "Tsavo East National Park",
      category: "Tsavo East",
      image: "/assets/sentrim tsavo.png",
      type: "Camp",
      fullDescription: `Sentrim Tsavo Camp is a luxury tented camp located in Tsavo East, offering comfortable accommodation close to the park's main attractions.`,
      accommodation: `The camp features 60 luxury tents with en-suite bathrooms, hot showers, and comfortable beds.`,
      facilities: `Facilities include a restaurant, bonfire area, swimming pool, and game drive vehicles.`,
    },
    {
      id: 6,
      name: "Ngutuni Lodge",
      park: "Tsavo East National Park",
      category: "Tsavo East",
      image: "/assets/ngutuni east.png",
      type: "Lodge",
      fullDescription: `Ngutuni Lodge is a private sanctuary within Tsavo East, offering exclusive wildlife viewing experiences on a 10,000-acre private game sanctuary.`,
      accommodation: `The lodge features 30 rooms with en-suite bathrooms, private verandas, and beautiful garden views.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, night game drives, and bush dinners.`,
    },
    {
      id: 7,
      name: "Lion Hill Lodge",
      park: "Tsavo East National Park",
      category: "Tsavo East",
      image: "/assets/lion hill.png",
      type: "Lodge",
      fullDescription: `Lion Hill Lodge offers comfortable accommodation with stunning views of the Tsavo East plains and the Yatta Plateau.`,
      accommodation: `The lodge has 40 rooms with en-suite bathrooms and private balconies.`,
      facilities: `Facilities include a restaurant, bar, swimming pool, and game viewing decks.`,
    },
    {
      id: 8,
      name: "Saltlick Safari Lodge",
      park: "Tsavo West National Park",
      category: "Tsavo West",
      image: "/assets/Saltlick.png",
      type: "Lodge",
      fullDescription: `Saltlick Safari Lodge is an architectural marvel built on stilts, offering unique views of a waterhole that attracts a variety of wildlife. Located in the Taita Hills Wildlife Sanctuary.`,
      accommodation: `The lodge features 96 rooms connected by elevated walkways, all with en-suite bathrooms and views of the waterhole.`,
      facilities: `Facilities include two swimming pools, restaurants, bars, underground tunnel for photography, and game drives.`,
    },
    {
      id: 9,
      name: "Ziwani Tented Camp",
      park: "Tsavo West National Park",
      category: "Tsavo West",
      image: "/assets/ziwani.png",
      type: "Camp",
      fullDescription: `Ziwani Tented Camp is situated on a private ranch bordering Tsavo West National Park, offering a serene escape with views of Mount Kilimanjaro.`,
      accommodation: `The camp features 20 luxury tents with en-suite bathrooms and private verandas overlooking the waterhole.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, boat rides, and game drives.`,
    },
    {
      id: 10,
      name: "Finch Hattons Camp",
      park: "Tsavo West National Park",
      category: "Tsavo West",
      image: "/assets/hatons.png",
      type: "Camp",
      fullDescription: `Finch Hattons Camp is a luxury tented camp located in the heart of Tsavo West, offering exclusive safari experiences in a pristine wilderness setting.`,
      accommodation: `The camp features 17 luxury suites with en-suite bathrooms, outdoor showers, and private decks overlooking the waterhole.`,
      facilities: `Facilities include a swimming pool, spa, restaurant, bar, game drives, and guided bush walks.`,
    },
    {
      id: 11,
      name: "Rhino Camp",
      park: "Tsavo West National Park",
      category: "Tsavo West",
      image: "/assets/rhino.png",
      type: "Camp",
      fullDescription: `Rhino Camp offers a rustic camping experience in Tsavo West, focusing on rhino conservation and authentic bush experiences.`,
      accommodation: `The camp features comfortable tents with en-suite bathrooms and basic amenities.`,
      facilities: `Facilities include a dining tent, campfire area, game drives, and rhino tracking.`,
    },
    {
      id: 12,
      name: "Kilanguni Lodge",
      park: "Tsavo West National Park",
      category: "Tsavo West",
      image: "/assets/kilaguni .png",
      type: "Lodge",
      fullDescription: `Kilanguni Lodge offers comfortable accommodation in the heart of Tsavo West, close to Mzima Springs and other park attractions.`,
      accommodation: `The lodge features 50 rooms with en-suite bathrooms and views of the surrounding landscape.`,
      facilities: `Facilities include a restaurant, bar, swimming pool, and game drives.`,
    },
    {
      id: 13,
      name: "Ngulia Safari Lodge",
      park: "Tsavo West National Park",
      category: "Tsavo West",
      image: "/assets/Nguuulialodge.png",
      type: "Lodge",
      fullDescription: `Ngulia Safari Lodge is famous for bird watching, especially during the annual bird migration season. Located on the Ngulia Hills in Tsavo West.`,
      accommodation: `The lodge has 52 rooms with en-suite bathrooms and private balconies with valley views.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and bird watching platforms.`,
    },
    {
      id: 14,
      name: "Severin Tented Camp",
      park: "Tsavo West National Park",
      category: "Tsavo West",
      image: "/assets/severin west lodge .png",
      type: "Camp",
      fullDescription: `Severin Tented Camp offers luxury camping in Tsavo West, combining comfort with authentic safari experiences.`,
      accommodation: `The camp features 20 luxury tents with en-suite bathrooms and private verandas.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, game drives, and bush dinners.`,
    },
    {
      id: 15,
      name: "Kibo Safari Camp",
      park: "Amboseli National Park",
      category: "Amboseli",
      image: "/assets/kibocamp.png",
      type: "Camp",
      fullDescription: `Kibo Safari Camp offers spectacular views of Mount Kilimanjaro from every tent. Located in Amboseli, known for its large elephant herds.`,
      accommodation: `The camp features 50 luxury tents with en-suite bathrooms, private verandas, and views of Kilimanjaro.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, game drives, and Maasai cultural visits.`,
    },
    {
      id: 16,
      name: "Amboseli Serena Lodge",
      park: "Amboseli National Park",
      category: "Amboseli",
      image: "/assets/serena ambo.png",
      type: "Lodge",
      fullDescription: `Amboseli Serena Lodge is built around natural springs, offering lush gardens and stunning views of Mount Kilimanjaro.`,
      accommodation: `The lodge features 92 rooms with en-suite bathrooms, traditional African decor, and private verandas.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, spa, game drives, and cultural performances.`,
    },
    {
      id: 17,
      name: "Sentrim Lodge",
      park: "Amboseli National Park",
      category: "Amboseli",
      image: "/assets/sentrim amboseli .png",
      type: "Lodge",
      fullDescription: `Sentrim Lodge offers comfortable accommodation with modern amenities, located close to Amboseli National Park.`,
      accommodation: `The lodge features 60 rooms with en-suite bathrooms and private balconies.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and game drives.`,
    },
    {
      id: 18,
      name: "Kilima Tented Camp",
      park: "Amboseli National Park",
      category: "Amboseli",
      image: "/assets/likimaa ambo.png",
      type: "Camp",
      fullDescription: `Kilima Tented Camp offers a classic camping experience with views of Mount Kilimanjaro.`,
      accommodation: `The camp features 30 tents with en-suite bathrooms and comfortable bedding.`,
      facilities: `Facilities include a restaurant, bar, bonfire area, and game drives.`,
    },
    {
      id: 19,
      name: "AA Amboseli Lodge",
      park: "Amboseli National Park",
      category: "Amboseli",
      image: "/assets/aaa Ambo.png",
      type: "Lodge",
      fullDescription: `AA Amboseli Lodge offers budget-friendly accommodation with easy access to Amboseli National Park.`,
      accommodation: `The lodge features 40 rooms with en-suite bathrooms and basic amenities.`,
      facilities: `Facilities include a restaurant, bar, swimming pool, and game drives.`,
    },
    {
      id: 20,
      name: "Figtree Tented Camps",
      park: "Masai Mara National Reserve",
      category: "Masai Mara",
      image: "/assets/fig  mara.png",
      type: "Camp",
      fullDescription: `Figtree Tented Camp offers a peaceful retreat in the Masai Mara, named after the large fig tree at its center.`,
      accommodation: `The camp features 10 tents with en-suite bathrooms and private verandas.`,
      facilities: `Facilities include a restaurant, bar, campfire area, and game drives.`,
    },
    {
      id: 21,
      name: "Mara Sopa Lodge",
      park: "Masai Mara National Reserve",
      category: "Masai Mara",
      image: "/assets/sopa mara1.png",
      type: "Lodge",
      fullDescription: `Mara Sopa Lodge is located on the slopes of the Oloolaimutia Hills, offering spectacular views of the Masai Mara.`,
      accommodation: `The lodge features 50 rooms and 2 suites with en-suite bathrooms and private balconies.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and game drives.`,
    },
    {
      id: 22,
      name: "Mara Simba Lodge",
      park: "Masai Mara National Reserve",
      category: "Masai Mara",
      image: "/assets/maara simba 1.png",
      type: "Lodge",
      fullDescription: `Mara Simba Lodge offers comfortable accommodation on the banks of the Talek River, providing excellent wildlife viewing opportunities.`,
      accommodation: `The lodge features 60 rooms with en-suite bathrooms and private verandas.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and game drives.`,
    },
    {
      id: 23,
      name: "Sentrim Tented Camp",
      park: "Masai Mara National Reserve",
      category: "Masai Mara",
      image: "/assets/sentrim maara.png",
      type: "Camp",
      fullDescription: `Sentrim Tented Camp offers luxury camping in the Masai Mara with modern amenities.`,
      accommodation: `The camp features 60 luxury tents with en-suite bathrooms and comfortable beds.`,
      facilities: `Facilities include a restaurant, bar, bonfire area, and game drives.`,
    },
    {
      id: 24,
      name: "Kichwa Tembo Camp",
      park: "Masai Mara National Reserve",
      category: "Masai Mara",
      image: "/assets/kichwa tembo.png",
      type: "Camp",
      fullDescription: `Kichwa Tembo Camp is located at the base of the Oloololo Escarpment, offering stunning views of the Masai Mara plains.`,
      accommodation: `The camp features 40 luxury tents with en-suite bathrooms and private verandas.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, spa, and game drives.`,
    },
    {
      id: 25,
      name: "Sarova Lion Hill Lodge",
      park: "Lake Nakuru National Park",
      category: "Lake Nakuru",
      image: "/assets/sarova.png",
      type: "Lodge",
      fullDescription: `Sarova Lion Hill Lodge is set on the Lion Hill within Lake Nakuru National Park, offering panoramic views of the lake and its famous flamingos.`,
      accommodation: `The lodge features 60 rooms with en-suite bathrooms and private balconies with lake views.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, spa, and game drives.`,
    },
    {
      id: 26,
      name: "Lake Nakuru Lodge",
      park: "Lake Nakuru National Park",
      category: "Lake Nakuru",
      image: "/assets/nakuru nnp.png",
      type: "Lodge",
      fullDescription: `Lake Nakuru Lodge is situated in the southeast corner of Lake Nakuru National Park, offering excellent wildlife viewing and bird watching.`,
      accommodation: `The lodge features 50 rooms with en-suite bathrooms and private verandas.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and game drives.`,
    },
    {
      id: 28,
      name: "Nakuru Sopa Lodge",
      park: "Lake Nakuru National Park",
      category: "Lake Nakuru",
      image: "/assets/naku sopa.png",
      type: "Lodge",
      fullDescription: `Perched on a range of hills, Nakuru Sopa Lodge offers stunning views of Lake Nakuru and its famous flamingos.`,
      accommodation: `The lodge features 60 rooms with en-suite bathrooms and private balconies with lake views.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and game drives.`,
    },
    {
      id: 29,
      name: "Sentrim Elementaita",
      park: "Lake Elementaita",
      category: "Lake Nakuru",
      image: "/assets/sent elementaita .png",
      type: "Lodge",
      fullDescription: `Sentrim Elementaita is located on the shores of Lake Elementaita, a UNESCO World Heritage site known for its birdlife.`,
      accommodation: `The lodge features 40 rooms with en-suite bathrooms and lake views.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and bird watching.`,
    },
    {
      id: 30,
      name: "Samburu Sopa Lodge",
      park: "Samburu National Reserve",
      category: "Samburu",
      image: "/assets/samburu sopa .png",
      type: "Lodge",
      fullDescription: `Samburu Sopa Lodge is nestled among giant trees and natural springs on the banks of the Waso Nyiro River, offering a serene retreat in the wild.`,
      accommodation: `The lodge features 50 rooms with en-suite bathrooms and private verandas.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and game drives.`,
    },
    {
      id: 31,
      name: "Samburu Serena Lodge",
      park: "Samburu National Reserve",
      category: "Samburu",
      image: "/assets/samburu serena .png",
      type: "Lodge",
      fullDescription: `Samburu Serena Lodge is set along the banks of the Waso Nyiro River, offering luxurious accommodation in the arid but beautiful Samburu landscape.`,
      accommodation: `The lodge features 65 rooms with en-suite bathrooms and river views.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, spa, and game drives.`,
    },
    {
      id: 32,
      name: "Crescent Tented Camp",
      park: "Lake Naivasha",
      category: "Naivasha",
      image: "/assets/secrent .png",
      type: "Camp",
      fullDescription: `Crescent Tented Camp is located on the shores of Lake Naivasha on Crescent Island, offering walking safaris among wildlife.`,
      accommodation: `The camp features 20 tents with en-suite bathrooms and lake views.`,
      facilities: `Facilities include a restaurant, bar, boat rides, and walking safaris.`,
    },
    {
      id: 33,
      name: "Naivasha Resort",
      park: "Lake Naivasha",
      category: "Naivasha",
      image: "/assets/naiva resot.png",
      type: "Resort",
      fullDescription: `Naivasha Resort offers luxury accommodation on the shores of Lake Naivasha with beautiful gardens and wildlife.`,
      accommodation: `The resort features 60 rooms with en-suite bathrooms and garden or lake views.`,
      facilities: `Facilities include a swimming pool, spa, restaurant, bar, boat rides, and bike rentals.`,
    },
    {
      id: 34,
      name: "Naivasha Simba Lodge",
      park: "Lake Naivasha",
      category: "Naivasha",
      image: "/assets/naiva simba .png",
      type: "Lodge",
      fullDescription: `Naivasha Simba Lodge is set in a private sanctuary on the shores of Lake Naivasha, where wildlife roams freely.`,
      accommodation: `The lodge features 52 rooms with en-suite bathrooms and private verandas.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, spa, and game drives.`,
    },
    {
      id: 35,
      name: "Naivasha Sopa Lodge",
      park: "Lake Naivasha",
      category: "Naivasha",
      image: "/assets/naiva---simba.png",
      type: "Lodge",
      fullDescription: `Naivasha Sopa Lodge is set in over 150 acres of grassland forest with giraffes and zebras roaming freely around the grounds.`,
      accommodation: `The lodge features 60 rooms with en-suite bathrooms and private balconies.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, and nature trails.`,
    },
    {
      id: 36,
      name: "The Ark",
      park: "Aberdare National Park",
      category: "Aberdare",
      image: "/assets/Ark na.png",
      type: "Lodge",
      fullDescription: `The Ark is a unique tree lodge designed to resemble Noah's Ark, offering amazing animal viewing from multiple decks overlooking a waterhole.`,
      accommodation: `The lodge features 60 cabins with en-suite bathrooms and animal viewing decks.`,
      facilities: `Facilities include multiple viewing decks, restaurant, bar, and night game viewing.`,
    },
    {
      id: 37,
      name: "Aberdares County Club",
      park: "Aberdare National Park",
      category: "Aberdare",
      image: "/assets/abade club .png",
      type: "Lodge",
      fullDescription: `Aberdares Country Club is set in the beautiful Mweiga Hills with stunning views of Mount Kenya, offering a golf course and luxury accommodation.`,
      accommodation: `The club features 60 rooms with en-suite bathrooms and garden or mountain views.`,
      facilities: `Facilities include a golf course, swimming pool, restaurant, bar, and horse riding.`,
    },
    {
      id: 38,
      name: "Ikweta Camps",
      park: "Meru National Park",
      category: "Meru",
      image: "/assets/ikwita.png",
      type: "Camp",
      fullDescription: `Ikweta Camps offers comfortable camping in Meru National Park, known for its diverse wildlife and beautiful landscapes.`,
      accommodation: `The camp features 10 tents with en-suite bathrooms and comfortable bedding.`,
      facilities: `Facilities include a restaurant, bar, campfire, and game drives.`,
    },
    {
      id: 39,
      name: "Eka Hotel",
      park: "Nairobi City",
      category: "Nairobi",
      image: "/assets/eka.png",
      type: "Hotel",
      fullDescription: `Eka Hotel is a modern hotel located in Nairobi, offering comfortable accommodation for business and leisure travelers.`,
      accommodation: `The hotel features 120 rooms with en-suite bathrooms and modern amenities.`,
      facilities: `Facilities include a swimming pool, restaurant, bar, gym, and conference facilities.`,
    },
  ];

  // Accommodations data with local images (Coastal)
  const accommodations = {
    watamu: [
      {
        id: 1,
        name: "Turtle Bay",
        type: "Resort",
        image: "/assets/turlebay.png",
        fallback: "/assets/turlebay2.png",
        fullDescription: `Turtle Bay Beach Resort is a premier beachfront destination located in the pristine Watamu Marine National Park. This all-inclusive resort offers a perfect blend of relaxation and adventure, with direct access to one of Kenya's most beautiful beaches and protected marine areas. The resort is renowned for its eco-friendly practices and commitment to marine conservation.`,
        accommodation: `The resort features 164 rooms including standard rooms, family rooms, and suites. All rooms are tastefully decorated with African-inspired decor, en-suite bathrooms, private balconies or terraces, air conditioning, and modern amenities including flat-screen TVs and mini-bars.`,
        facilities: `Facilities include a large swimming pool, multiple restaurants and bars, water sports center, tennis courts, kids club, spa, conference facilities, free WiFi, and organized excursions to nearby attractions such as Gede Ruins and the Arabuko Sokoke Forest.`,
      },
      {
        id: 2,
        name: "Hemmingways Watamu",
        type: "Luxury Hotel",
        image: "/assets/hotel-Hemingways-Watamu2.png",
        fallback: "/assets/hotel-Hemingways-Watamu.png",
        fullDescription: `Hemmingways Watamu is a luxurious boutique hotel situated on the beautiful Watamu beach. Named after the famous writer Ernest Hemingway, this hotel offers an exclusive and intimate experience with world-class service and breathtaking ocean views.`,
        accommodation: `The hotel features elegantly appointed rooms and suites with ocean views, king-size beds, en-suite marble bathrooms, private balconies, air conditioning, and complimentary WiFi. Each room is designed with a blend of contemporary luxury and coastal charm.`,
        facilities: `Facilities include a fine dining restaurant, bar, swimming pool, spa, water sports, deep-sea fishing, diving center, and personalized butler service.`,
      },
      {
        id: 4,
        name: "Temple Point",
        type: "Resort",
        image: "/assets/templ.png",
        fallback: "/assets/templ.png",
        fullDescription: `Temple Point Resort is a stunning beachfront property located at the tip of a peninsula in Watamu, offering panoramic views of Mida Creek and the Indian Ocean. The resort is named after the ancient Swahili temple ruins found nearby.`,
        accommodation: `The resort offers a variety of rooms including standard rooms, superior rooms, and suites. All rooms feature en-suite bathrooms, air conditioning, and private balconies with garden or ocean views.`,
        facilities: `Facilities include multiple swimming pools, restaurants, bars, water sports center, kids club, tennis courts, and organized excursions to nearby marine parks and cultural sites.`,
      },
      {
        id: 5,
        name: "Crystal Bay Resort",
        type: "Resort",
        image: "/assets/cristal.png",
        fallback: "/assets/cristal.png",
        fullDescription: `Crystal Bay Resort is a charming beachfront property offering a peaceful retreat on the shores of Watamu. With its crystal-clear waters and white sandy beaches, it provides the perfect setting for a relaxing coastal holiday.`,
        accommodation: `The resort features comfortable rooms with ocean or garden views, en-suite bathrooms, air conditioning, and private terraces. Rooms are decorated in a contemporary African style with local artwork and furnishings.`,
        facilities: `Facilities include a swimming pool, restaurant, beach bar, water sports activities, snorkeling excursions, and boat trips to the Watamu Marine National Park.`,
      },
      {
        id: 6,
        name: "Lyle Palm",
        type: "Hotel",
        image: "/assets/lylpalm .png",
        fallback: "/assets/lylpalm .png",
        fullDescription: `Lyle Palm Hotel is a welcoming beach hotel located in the heart of Watamu, offering comfortable accommodation just steps away from the Indian Ocean. The hotel is known for its friendly service and relaxed atmosphere.`,
        accommodation: `The hotel offers clean and comfortable rooms with en-suite bathrooms, air conditioning, and private balconies. Rooms are simply but tastefully furnished, providing all the essentials for a comfortable stay.`,
        facilities: `Facilities include a swimming pool, restaurant serving local and international cuisine, bar, garden area, and assistance with organizing local excursions and water sports activities.`,
      },
      {
        id: 7,
        name: "Barakuda",
        type: "Resort",
        image: "/assets/barakuda.png",
        fallback: "/assets/barakuda.png",
        fullDescription: `Barakuda Resort is a lively beachfront resort in Watamu, popular for its excellent water sports facilities and vibrant atmosphere. The resort is particularly famous among kite surfers and diving enthusiasts.`,
        accommodation: `The resort offers a range of rooms from standard to deluxe, all with en-suite bathrooms, air conditioning, and balconies. The rooms are decorated in a bright, tropical style reflecting the coastal environment.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, kite surfing school, diving center, water sports equipment rental, and evening entertainment.`,
      },
      {
        id: 8,
        name: "Aquarius",
        type: "Hotel",
        image: "/assets/aqurius watamu.png",
        fallback: "/assets/aqurius watamu.png",
        fullDescription: `Aquarius Hotel is a comfortable beach hotel offering stunning views of the Indian Ocean in Watamu. Known for its excellent location and friendly atmosphere, it's a popular choice for both couples and families.`,
        accommodation: `The hotel features well-appointed rooms with ocean views, en-suite bathrooms, air conditioning, and private balconies. Each room is designed to maximize comfort while showcasing the beautiful coastal scenery.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, water sports activities, and easy access to the beach and nearby attractions.`,
      },
    ],
    jacarandaWatamu: [
      {
        id: 9,
        name: "The One",
        type: "Boutique Hotel",
        image: "/assets/the one .png",
        fallback: "/assets/accommodation/default.jpg",
        fullDescription: `The One is an exclusive boutique hotel located in the Jacaranda area of Watamu, offering a unique and personalized experience. With its stylish design and attention to detail, it provides an intimate setting for a memorable coastal getaway.`,
        accommodation: `The hotel features individually designed rooms and suites with premium furnishings, en-suite bathrooms, air conditioning, and private terraces. Each room showcases contemporary African design with luxurious touches.`,
        facilities: `Facilities include a swimming pool, gourmet restaurant, bar, spa services, and personalized concierge service to arrange excursions and activities.`,
      },
      {
        id: 10,
        name: "Jacaranda Resort",
        type: "Resort",
        image: "/assets/jacaranda beach.png",
        fallback: "/assets/jacaranda beach.png",
        fullDescription: `Jacaranda Resort is a beautiful beachfront property situated on Jacaranda Beach in Watamu. Known for its stunning sunsets and pristine beach, the resort offers a perfect blend of relaxation and water activities.`,
        accommodation: `The resort offers a variety of rooms and suites with ocean or garden views, en-suite bathrooms, air conditioning, and private balconies. Rooms are spacious and decorated in a tropical coastal style.`,
        facilities: `Facilities include multiple swimming pools, restaurants, bars, water sports center, kids club, and organized excursions to local attractions including the Watamu Marine Park.`,
      },
      {
        id: 11,
        name: "Jumbo",
        type: "Hotel",
        image: "/assets/jumbo jac.png",
        fallback: "/assets/jumbo jac.png",
        fullDescription: `Jumbo Hotel is a friendly and affordable beach hotel located in the Jacaranda area of Watamu. It offers comfortable accommodation with easy access to the beautiful Jacaranda Beach and local attractions.`,
        accommodation: `The hotel provides comfortable rooms with en-suite bathrooms, air conditioning, and private balconies. Rooms are clean and well-maintained, offering good value for budget-conscious travelers.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, and tour desk to help organize local excursions and water sports activities.`,
      },
      {
        id: 12,
        name: "Bravo",
        type: "Hotel",
        image: "/assets/braco jac .png",
        fallback: "/assets/braco jac .png",
        fullDescription: `Bravo Hotel is a charming beach hotel in the Jacaranda area of Watamu, offering a relaxed atmosphere and warm hospitality. It's an ideal choice for travelers seeking a peaceful beach holiday.`,
        accommodation: `The hotel features comfortable rooms with en-suite bathrooms, air conditioning, and balconies overlooking the gardens or ocean. Rooms are simply but tastefully furnished.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, and assistance with booking local excursions and activities.`,
      },
    ],
    mombasa: [
      {
        id: 13,
        name: "Severin Sea Lodge",
        type: "Luxury Resort",
        image: "/assets/sev sea.png",
        fallback: "/assets/sev sea.png",
        fullDescription: `Severin Sea Lodge is a luxurious beachfront resort located on Bamburi Beach in Mombasa. Set within lush tropical gardens, it offers an idyllic setting for a relaxing beach holiday with excellent service and amenities.`,
        accommodation: `The resort features elegantly appointed rooms and suites with ocean or garden views, en-suite bathrooms, air conditioning, private balconies or terraces, and modern amenities. The rooms blend African charm with contemporary comfort.`,
        facilities: `Facilities include two swimming pools, multiple restaurants and bars, spa, fitness center, water sports, tennis courts, and organized excursions to Mombasa's historic sites including Fort Jesus and Old Town.`,
      },
      {
        id: 14,
        name: "Sarova Whitesands Beach Resort",
        type: "Premium Resort",
        image: "/assets/sarova httl.png",
        fallback: "/assets/sarova httl.png",
        fullDescription: `Sarova Whitesands Beach Resort & Spa is one of Mombasa's premier beach resorts, located on the pristine Bamburi Beach. This award-winning resort offers world-class facilities and service in a stunning beachfront setting.`,
        accommodation: `The resort boasts 338 rooms and suites, all with ocean or garden views, en-suite bathrooms, air conditioning, flat-screen TVs, and private balconies. The rooms are spacious and elegantly furnished with modern amenities.`,
        facilities: `Facilities include five swimming pools, multiple restaurants and bars, Ozone Spa & Health Club, water sports center, tennis courts, kids club, conference facilities, and evening entertainment programs.`,
      },
      {
        id: 15,
        name: "Mombasa Beach",
        type: "Resort",
        image: "/assets/mombasa beach htl.png",
        fallback: "/assets/mombasa beach htl.png",
        fullDescription: `Mombasa Beach Hotel is a classic beachfront hotel overlooking the Indian Ocean. With its prime location on the North Coast, it offers easy access to Mombasa's attractions while providing a peaceful beach retreat.`,
        accommodation: `The hotel features comfortable rooms with ocean or garden views, en-suite bathrooms, air conditioning, and private balconies. Rooms are well-maintained and offer all essential amenities for a comfortable stay.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, water sports activities, and organized excursions to Mombasa's cultural and historical sites.`,
      },
      {
        id: 16,
        name: "Nyali Beach",
        type: "Hotel",
        image: "/assets/nyali beach .png",
        fallback: "/assets/nyali beach .png",
        fullDescription: `Nyali Beach Hotel is a charming beachfront property located in the prestigious Nyali area of Mombasa. Surrounded by tropical gardens, it offers a tranquil escape while being close to Mombasa's attractions and amenities.`,
        accommodation: `The hotel offers a range of rooms and suites with garden or ocean views, en-suite bathrooms, air conditioning, and private balconies. Rooms are decorated in a warm, tropical style.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, water sports, and easy access to nearby attractions including Nyali Golf Club and Mombasa Marine Park.`,
      },
      {
        id: 17,
        name: "Bamburi Beach",
        type: "Resort",
        image: "/assets/bamburi beach.png",
        fallback: "/assets/bamburi beach.png",
        fullDescription: `Bamburi Beach Resort is a popular beachfront resort situated on the famous Bamburi Beach in Mombasa. Known for its lively atmosphere and excellent beach access, it's a favorite among tourists seeking sun, sea, and entertainment.`,
        accommodation: `The resort features a variety of rooms from standard to family rooms, all with en-suite bathrooms, air conditioning, and balconies. The rooms are comfortable and well-equipped for a relaxing stay.`,
        facilities: `Facilities include a swimming pool, multiple restaurants and bars, water sports center, evening entertainment, kids activities, and organized excursions.`,
      },
      {
        id: 18,
        name: "Neptune Beach",
        type: "Resort",
        image: "/assets/accommodation/neptune.jpg",
        fallback: "/assets/accommodation/default.jpg",
        fullDescription: `Neptune Beach Resort is an all-inclusive beachfront resort located on the stunning Bamburi Beach. The resort offers a comprehensive holiday experience with excellent facilities and entertainment options for all ages.`,
        accommodation: `The resort features comfortable rooms and suites with ocean or garden views, en-suite bathrooms, air conditioning, and private balconies. Rooms are well-appointed with all necessary amenities.`,
        facilities: `Facilities include swimming pools, restaurants, bars, water sports, kids club, evening entertainment, and organized excursions to local attractions.`,
      },
      {
        id: 19,
        name: "White Sand Beach",
        type: "Hotel",
        image: "/assets/white sands.png",
        fallback: "/assets/white sands.png",
        fullDescription: `White Sand Beach Hotel is a delightful beachfront hotel on Mombasa's North Coast. With its pristine white sand beach and crystal-clear waters, it offers a perfect setting for a relaxing coastal holiday.`,
        accommodation: `The hotel offers comfortable rooms with ocean views, en-suite bathrooms, air conditioning, and private balconies. Rooms are clean, well-maintained, and tastefully decorated.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, water sports activities, and a tour desk for organizing local excursions.`,
      },
    ],
    nairobi: [
      {
        id: 20,
        name: "West Lavat",
        type: "Hotel",
        image: "/assets/larauwat.png",
        fallback: "/assets/larauwat.png",
        fullDescription: `West Lavat Hotel is a modern hotel located in Nairobi, offering comfortable accommodation for both business and leisure travelers. With its convenient location and excellent facilities, it provides a great base for exploring Kenya's capital city.`,
        accommodation: `The hotel features well-appointed rooms with en-suite bathrooms, air conditioning, flat-screen TVs, work desks, and complimentary WiFi. Rooms are designed with contemporary decor and all modern amenities.`,
        facilities: `Facilities include a restaurant, bar, fitness center, conference facilities, and easy access to Nairobi's business districts and attractions.`,
      },
      {
        id: 21,
        name: "Sarova Nairobi",
        type: "Business Hotel",
        image: "/assets/sarova nbr.png",
        fallback: "/assets/sarova nbr.png",
        fullDescription: `Sarova Nairobi Hotel is a premium business and leisure hotel in the heart of Nairobi. Part of the renowned Sarova group, it offers exceptional service and facilities for discerning travelers.`,
        accommodation: `The hotel features luxurious rooms and suites with en-suite bathrooms, air conditioning, flat-screen TVs, work areas, and complimentary WiFi. Rooms are elegantly furnished with modern amenities and city views.`,
        facilities: `Facilities include multiple restaurants and bars, swimming pool, fitness center, spa, conference facilities, and business center.`,
      },
      {
        id: 22,
        name: "Canivo",
        type: "Hotel",
        image: "/assets/canivo htl.png",
        fallback: "/assets/canivo htl.png",
        fullDescription: `Canivo Hotel is a comfortable and affordable hotel in Nairobi, offering convenient accommodation for travelers exploring Kenya's capital. With its central location, it provides easy access to the city's attractions and business areas.`,
        accommodation: `The hotel offers clean and comfortable rooms with en-suite bathrooms, TV, and WiFi. Rooms are simply furnished and provide all essential amenities for a comfortable stay.`,
        facilities: `Facilities include a restaurant, bar, and tour desk to assist with arranging safaris and excursions.`,
      },
    ],
    malindi: [
      {
        id: 23,
        name: "Scorpion Villa",
        type: "Villa",
        image: "/assets/scopio villa.png",
        fallback: "/assets/scopio villa.png",
        fullDescription: `Scorpion Villa is an exclusive private villa in Malindi, offering a luxurious and private coastal retreat. Ideal for families and groups seeking privacy and personalized service in one of Kenya's most historic coastal towns.`,
        accommodation: `The villa features multiple bedrooms with en-suite bathrooms, a fully equipped kitchen, spacious living areas, private swimming pool, and beautiful tropical gardens. It's designed for comfort and privacy with all the amenities of a luxury home.`,
        facilities: `Facilities include a private swimming pool, garden, fully equipped kitchen, BBQ area, housekeeping services, and assistance with organizing excursions to Malindi's attractions including the Malindi Marine Park and historic sites.`,
      },
      {
        id: 24,
        name: "Tropical",
        type: "Resort",
        image: "/assets/tropicall.png",
        fallback: "/assets/tropicall.png",
        fullDescription: `Tropical Resort is a charming beachfront resort in Malindi, offering a true tropical paradise experience. With its lush gardens and beautiful beach, it provides an ideal setting for a relaxing coastal holiday.`,
        accommodation: `The resort offers a variety of rooms and suites with garden or ocean views, en-suite bathrooms, air conditioning, and private balconies or terraces. Rooms are decorated in a bright tropical style.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, water sports activities, and organized excursions to Malindi's attractions including the Vasco da Gama pillar and the Marine National Park.`,
      },
      {
        id: 25,
        name: "Diamond Africa",
        type: "Hotel",
        image: "/assets/diamond malindi.png",
        fallback: "/assets/diamond malindi.png",
        fullDescription: `Diamond Africa Hotel is a comfortable beach hotel in Malindi, offering good value accommodation with excellent beach access. Known for its friendly service, it's popular among travelers seeking a relaxed beach holiday.`,
        accommodation: `The hotel features comfortable rooms with en-suite bathrooms, air conditioning, and balconies. Rooms are well-maintained and offer all essential amenities for a pleasant stay.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, and assistance with organizing local excursions and water sports activities.`,
      },
      {
        id: 26,
        name: "Kilili Baharini",
        type: "Resort",
        image: "/assets/killi bahari2.png",
        fallback: "/assets/killi bahari2.png",
        fullDescription: `Kilili Baharini Resort & Spa is a luxurious beachfront resort in Malindi, set within beautifully landscaped tropical gardens. The resort offers a perfect blend of Italian style and African hospitality.`,
        accommodation: `The resort features elegant rooms and suites with ocean or garden views, en-suite bathrooms, air conditioning, and private terraces. Rooms are beautifully furnished with attention to detail and comfort.`,
        facilities: `Facilities include multiple swimming pools, restaurants, bars, spa, tennis courts, water sports center, and organized excursions to local attractions.`,
      },
    ],
    diani: [
      {
        id: 27,
        name: "Jacaranda Indian Ocean",
        type: "Resort",
        image: "/assets/jac dian.png",
        fallback: "/assets/jac dian.png",
        fullDescription: `Jacaranda Indian Ocean Beach Resort is a stunning beachfront resort located on the world-famous Diani Beach. With its pristine white sand beach and turquoise waters, it offers a perfect tropical paradise experience.`,
        accommodation: `The resort features a variety of rooms and suites with ocean or garden views, en-suite bathrooms, air conditioning, and private balconies. Rooms are spacious and elegantly decorated with African coastal themes.`,
        facilities: `Facilities include multiple swimming pools, restaurants, bars, water sports center, kids club, spa, and organized excursions including dolphin watching and visits to the Shimba Hills National Reserve.`,
      },
      {
        id: 28,
        name: "Baobab Beach",
        type: "Premium Resort",
        image: "/assets/baobao.png",
        fallback: "/assets/baobao.png",
        fullDescription: `Baobab Beach Resort & Spa is a premium all-inclusive resort set on the magnificent Diani Beach. Named after the iconic baobab trees on the property, it offers world-class service and facilities in a stunning natural setting.`,
        accommodation: `The resort features luxurious rooms and suites with ocean or garden views, en-suite bathrooms, air conditioning, flat-screen TVs, and private balconies. The rooms are elegantly appointed with modern amenities and Swahili-inspired decor.`,
        facilities: `Facilities include three swimming pools, multiple restaurants and bars, water sports center, spa, fitness center, tennis courts, kids club, and evening entertainment programs.`,
      },
      {
        id: 29,
        name: "Thousand Palms",
        type: "Resort",
        image: "/assets/san palm .png",
        fallback: "/assets/san palm .png",
        fullDescription: `Thousand Palms Resort is a beautiful beachfront property on Diani Beach, surrounded by palm trees and tropical gardens. It offers a peaceful and relaxing atmosphere for a memorable beach holiday.`,
        accommodation: `The resort offers comfortable rooms with garden or ocean views, en-suite bathrooms, air conditioning, and private balconies. Rooms are tastefully decorated and well-equipped for a comfortable stay.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, water sports activities, and easy access to Diani Beach's attractions and shopping areas.`,
      },
      {
        id: 30,
        name: "Kolekole Beach",
        type: "Hotel",
        image: "/assets/kk diani .png",
        fallback: "/assets/kk diani .png",
        fullDescription: `Kolekole Beach Hotel is a charming beachfront hotel on Diani Beach, known for its laid-back atmosphere and stunning ocean views. It's an ideal choice for travelers seeking a relaxed and authentic beach experience.`,
        accommodation: `The hotel features comfortable rooms with ocean views, en-suite bathrooms, and private balconies. Rooms are simply furnished but clean and well-maintained, focusing on the natural beauty of the surroundings.`,
        facilities: `Facilities include a swimming pool, restaurant, bar, water sports activities, and a tour desk for organizing local excursions.`,
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

  const safariCategories = [
    ...new Map(
      safariLodges.map((lodge) => [lodge.category, lodge.category]),
    ).keys(),
  ];
  const [selectedSafariCategory, setSelectedSafariCategory] = useState("all");
  const [showMobileSafariFilter, setShowMobileSafariFilter] = useState(false);

  const filteredSafariLodges =
    selectedSafariCategory === "all"
      ? safariLodges
      : safariLodges.filter(
          (lodge) => lodge.category === selectedSafariCategory,
        );

  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
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

  const openLodgeDetailModal = (lodge) => {
    setSelectedLodge(lodge);
    setShowLodgeDetailModal(true);
  };

  const closeLodgeDetailModal = () => {
    setShowLodgeDetailModal(false);
    setSelectedLodge(null);
  };

  const openCoastalDetailModal = (accommodation) => {
    setSelectedCoastal(accommodation);
    setShowCoastalDetailModal(true);
  };

  const closeCoastalDetailModal = () => {
    setShowCoastalDetailModal(false);
    setSelectedCoastal(null);
  };

  const handleImageError = (e, fallbackImage) => {
    e.target.onerror = null;
    e.target.src = fallbackImage || "/assets/fallback.jpg";
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Processing Your Request...",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
          <p class="text-gray-600">Sending your booking request...</p>
          <p class="text-sm text-gray-500 mt-2">This will only take a moment</p>
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

    const isSafari = bookingData.accommodation?.park ? true : false;

    const formattedData = {
      fullName: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
      park: isSafari
        ? bookingData.accommodation.park
        : getCategoryName(bookingData.accommodation.category),
      lodge: bookingData.accommodation.name,
      days: calculateNights() || 1,
      travelers: bookingData.guests || 1,
      totalPrice: "Quote Requested",
      startDate: bookingData.checkIn || "Not specified",
      message: bookingData.message || "",
      roomType: bookingData.roomType || "Standard",
      checkIn: bookingData.checkIn || "",
      checkOut: bookingData.checkOut || "",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send booking");
      }

      Swal.fire({
        title: "Booking Request Sent Successfully!",
        html: `
          <div style="text-align: left;">
            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px; margin-bottom: 15px; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #166534;"><strong>📋 Booking ID:</strong> ${result.bookingId}</p>
            </div>
            <p style="margin-bottom: 10px;">Thank you for choosing Joztembo Tours!</p>
            <p style="font-size: 14px; color: #4b5563; margin-bottom: 5px;">✓ Your booking request has been received</p>
            <p style="font-size: 14px; color: #4b5563; margin-bottom: 5px;">✓ A confirmation email will be sent to your email</p>
            <p style="font-size: 14px; color: #4b5563;">✓ Our team will contact you within 24 hours</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Great!",
        confirmButtonColor: "#3b82f6",
      });

      return { success: true, bookingId: result.bookingId };
    } catch (error) {
      console.error("Booking failed:", error);

      Swal.fire({
        title: "Unable to Send Online",
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 15px;">The booking server is temporarily unavailable.</p>
            <p style="font-size: 14px; color: #4b5563; margin-bottom: 15px;">You can still send your booking directly via email.</p>
            <button 
              onclick="window.location.href='mailto:tembo4401@gmail.com?subject=Booking Request: ${formattedData.lodge}&body=${encodeURIComponent(JSON.stringify(formattedData, null, 2))}'"
              style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;"
            >
              📧 Open Email Client
            </button>
          </div>
        `,
        icon: "warning",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#6b7280",
      });

      setTimeout(() => {
        const emailSubject = `Booking Request: ${formattedData.lodge}`;
        const emailBody = JSON.stringify(formattedData, null, 2);
        window.open(
          `mailto:tembo4401@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
          "_blank",
        );
      }, 1500);

      return { success: false, error: error.message };
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
    if (e.target === e.currentTarget) closeBookingModal();
  };

  const handleLodgeBookingSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      accommodation: selectedLodge,
    };
    setBookingForm(bookingData);
    setSelectedHotel(selectedLodge);
    closeLodgeDetailModal();
    setShowBookingModal(true);
  };

  const handleCoastalEnquirySubmit = (e) => {
    e.preventDefault();
    const formData = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
      accommodation: selectedCoastal,
    };
    setBookingForm(formData);
    setSelectedHotel(selectedCoastal);
    closeCoastalDetailModal();
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {backendStatus !== "connected" && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 text-center py-2 text-sm ${
            backendStatus === "checking"
              ? "bg-yellow-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {backendStatus === "checking"
            ? "Connecting to server..."
            : "Server offline - Email booking will be used as fallback"}
        </div>
      )}

      <div className="relative h-[300px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-900/70 z-10"></div>
        <img
          src="/assets/coastal-hero.jpg"
          alt="Kenya Accommodation"
          className="w-full h-full object-cover scale-105"
          onError={(e) =>
            handleImageError(e, "/assets/coastal-hero-fallback.jpg")
          }
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 font-display tracking-tight animate-fade-in">
              Kenya Accommodation
            </h1>
            <p className="text-base md:text-xl lg:text-2xl max-w-2xl mx-auto opacity-95 px-2">
              Discover the best safari camps, lodges, and coastal resorts in
              Kenya
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-6 md:py-3 rounded-full text-xs md:text-base">
                <span className="font-semibold">🦁 Safari Adventures</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-6 md:py-3 rounded-full text-xs md:text-base">
                <span className="font-semibold">🏖️ Beach Paradise</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-6 md:py-3 rounded-full text-xs md:text-base">
                <span className="font-semibold">🏨 Luxury Stays</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-50 to-transparent z-10"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-emerald-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
              Wildlife Experience
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4 font-display mt-2">
              Safari Camps & Lodges
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Click on any lodge below to view detailed information about your
              dream safari destination
            </p>
          </div>

          <div className="hidden md:flex flex-wrap justify-center gap-1.5 md:gap-2 mb-8 md:mb-10">
            <button
              onClick={() => setSelectedSafariCategory("all")}
              className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                selectedSafariCategory === "all"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              All Parks
            </button>
            {safariCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSafariCategory(cat)}
                className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  selectedSafariCategory === cat
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:shadow-md"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowMobileSafariFilter(!showMobileSafariFilter)}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm"
            >
              <span className="text-gray-700 font-medium">
                {selectedSafariCategory === "all"
                  ? "All Parks"
                  : selectedSafariCategory}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${showMobileSafariFilter ? "rotate-180" : ""}`}
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

            {showMobileSafariFilter && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setSelectedSafariCategory("all");
                    setShowMobileSafariFilter(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedSafariCategory === "all" ? "bg-emerald-50 text-emerald-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  All Parks
                </button>
                {safariCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedSafariCategory(cat);
                      setShowMobileSafariFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-gray-100 ${selectedSafariCategory === cat ? "bg-emerald-50 text-emerald-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {(showAllSafari
                ? filteredSafariLodges
                : filteredSafariLodges.slice(0, 8)
              ).map((lodge) => (
                <button
                  key={lodge.id}
                  onClick={() => openLodgeDetailModal(lodge)}
                  className="group text-left bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-3 border border-gray-100"
                >
                  <div className="h-32 sm:h-40 md:h-48 relative overflow-hidden">
                    <img
                      src={lodge.image}
                      alt={lodge.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) =>
                        handleImageError(e, "/assets/fallback.jpg")
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-2 right-2 md:top-4 md:right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-emerald-700 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-semibold shadow-md">
                        {lodge.type}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-0.5 md:mb-1">
                        {lodge.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-2 md:p-4">
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2 md:mb-3">
                      <span className="inline-flex items-center gap-0.5 md:gap-1 bg-emerald-50 text-emerald-700 px-1 md:px-2 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs">
                        <svg
                          className="w-2 md:w-3 h-2 md:h-3"
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
                        </svg>
                        {lodge.park.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-1.5 md:py-2.5 px-2 rounded-lg md:rounded-xl font-semibold text-[10px] md:text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 shadow-md hover:shadow-lg">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Details
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {filteredSafariLodges.length > 8 && (
              <div className="flex justify-center pt-4 md:pt-6">
                <button
                  onClick={() => setShowAllSafari(!showAllSafari)}
                  className="group flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 bg-white border-2 border-emerald-200 hover:border-emerald-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-emerald-700 font-semibold text-sm md:text-base">
                    {showAllSafari
                      ? "▲ Show less"
                      : `▼ Show all (${filteredSafariLodges.length - 8} more)`}
                  </span>
                  <svg
                    className={`w-4 h-4 md:w-5 md:h-5 text-emerald-600 transition-transform duration-300 ${showAllSafari ? "rotate-180" : ""}`}
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
              </div>
            )}
          </div>
        </div>

        <div className="relative my-12 md:my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-b from-emerald-50 to-teal-50 px-4 md:px-6 py-1.5 md:py-2 text-gray-500 text-xs md:text-sm rounded-full shadow-sm">
              Beach Accommodation
            </span>
          </div>
        </div>

        <div>
          <div className="text-center mb-8 md:mb-12">
            <span className="text-blue-600 font-semibold text-xs md:text-sm uppercase tracking-wider">
              Coastal Paradise
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4 font-display mt-2">
              Select Your Coastal Destination
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Click on any property below to view detailed information about
              your dream coastal getaway
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mb-8 md:mb-10">
            <button
              onClick={() => {
                setSelectedLocation("all");
                setShowAllCoastal(false);
              }}
              className={`px-3 md:px-6 py-1.5 md:py-2.5 rounded-full text-xs md:text-base font-medium transition-all duration-300 ${selectedLocation === "all" ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
            >
              All Locations
            </button>
            {Object.keys(accommodations).map((location) => (
              <button
                key={location}
                onClick={() => {
                  setSelectedLocation(location);
                  setShowAllCoastal(false);
                }}
                className={`px-3 md:px-6 py-1.5 md:py-2.5 rounded-full text-xs md:text-base font-medium transition-all duration-300 ${selectedLocation === location ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
              >
                {getCategoryName(location)}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto mb-8 md:mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-blue-100 shadow-sm">
              <p className="text-gray-700 mb-2 md:mb-3 font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
                <span className="text-lg md:text-xl">📞</span> Do not hesitate
                to give us a call
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4">
                <a
                  href="tel:+254743545012"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors flex items-center justify-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    📱
                  </span>
                  +254 743 545 012
                </a>
                <a
                  href="tel:+254722266955"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors flex items-center justify-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    📱
                  </span>
                  +254 722 266 955
                </a>
                <a
                  href="tel:+254722609492"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors flex items-center justify-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    📱
                  </span>
                  +254 722 609 492
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {(showAllCoastal
                ? filteredAccommodations
                : filteredAccommodations.slice(0, 8)
              ).map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-3 border border-gray-100"
                >
                  <div className="h-32 sm:h-40 md:h-48 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => handleImageError(e, item.fallback)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-2 right-2 md:top-4 md:right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-blue-700 px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-semibold shadow-md">
                        {item.type}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-0.5 md:mb-1">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-2 md:p-4">
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2 md:mb-3">
                      <span className="inline-flex items-center gap-0.5 md:gap-1 bg-blue-50 text-blue-700 px-1 md:px-2 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs">
                        <svg
                          className="w-2 md:w-3 h-2 md:h-3"
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
                        </svg>
                        {getCategoryName(item.category)}
                      </span>
                    </div>
                    <button
                      onClick={() => openCoastalDetailModal(item)}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-1.5 md:py-2.5 px-2 rounded-lg md:rounded-xl font-semibold text-[10px] md:text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredAccommodations.length > 8 && (
              <div className="flex justify-center pt-4 md:pt-6">
                <button
                  onClick={() => setShowAllCoastal(!showAllCoastal)}
                  className="group flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 bg-white border-2 border-blue-200 hover:border-blue-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-blue-700 font-semibold text-sm md:text-base">
                    {showAllCoastal
                      ? "▲ Show less"
                      : `▼ Show all (${filteredAccommodations.length - 8} more)`}
                  </span>
                  <svg
                    className={`w-4 h-4 md:w-5 md:h-5 text-blue-600 transition-transform duration-300 ${showAllCoastal ? "rotate-180" : ""}`}
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
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 md:mt-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4 font-display">
              Why Book With Us?
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-emerald-600"
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
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                Quality Assured
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                All our partner properties are carefully vetted for quality and
                service excellence
              </p>
            </div>
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-blue-600"
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
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                24/7 Support
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Our dedicated team is available round the clock for assistance
              </p>
            </div>
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-amber-600"
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
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                Easy Booking
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Simple and secure booking process with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {showLodgeDetailModal && selectedLodge && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto"
          onClick={closeLodgeDetailModal}
        >
          <div
            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-4xl w-full my-4 md:my-8 max-h-[95vh] md:max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-3 md:p-5 border-b flex justify-between items-center rounded-t-2xl md:rounded-t-3xl">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                {selectedLodge.name}
              </h2>
              <button
                onClick={closeLodgeDetailModal}
                className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
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
            <div className="p-4 md:p-8">
              <div className="h-48 md:h-80 lg:h-96 rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-lg">
                <img
                  src={selectedLodge.image}
                  alt={selectedLodge.name}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, "/assets/fallback.jpg")}
                />
              </div>
              <div className="mb-4 md:mb-6">
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {selectedLodge.park}
                </span>
              </div>
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-emerald-500 rounded-full"></span>
                  Description
                </h3>
                <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedLodge.fullDescription}
                </div>
              </div>
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-emerald-500 rounded-full"></span>
                  Accommodation
                </h3>
                <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedLodge.accommodation}
                </div>
              </div>
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-emerald-500 rounded-full"></span>
                  Facilities
                </h3>
                <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedLodge.facilities}
                </div>
              </div>
              <div className="mb-6 md:mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-emerald-100">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">✨</span>WHY BOOK WITH
                  US?
                </h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-emerald-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    We are a specialist destination travel company, focused on
                    creating tailor-made and group travel holiday packages in
                    Kenya
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-emerald-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    We have over 20 years experience in organizing Tours &
                    Safaris
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-emerald-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    A Kenyan based company with extensive local knowledge
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-emerald-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Book everything through one contact, a seamless and painless
                    vacation for you
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-emerald-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Save time and get honest advice by booking your Kenyan
                    safari holiday through us
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-emerald-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Tailor-made travel for any need and budget
                  </li>
                </ul>
              </div>
              <div className="border-t pt-4 md:pt-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-5">
                  Enquire or Book Your Safari
                </h3>
                <form onSubmit={handleLodgeBookingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>
                  <div className="mb-4 md:mb-5">
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm md:text-base"
                    />
                  </div>
                  <div className="mb-5 md:mb-6">
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm md:text-base"
                      placeholder="Tell us your travel dates, number of guests, and any special requests..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 md:py-3 px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCoastalDetailModal && selectedCoastal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto"
          onClick={closeCoastalDetailModal}
        >
          <div
            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-4xl w-full my-4 md:my-8 max-h-[95vh] md:max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-3 md:p-5 border-b flex justify-between items-center rounded-t-2xl md:rounded-t-3xl">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                {selectedCoastal.name}
              </h2>
              <button
                onClick={closeCoastalDetailModal}
                className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
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
            <div className="p-4 md:p-8">
              <div className="h-48 md:h-80 lg:h-96 rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-lg">
                <img
                  src={selectedCoastal.image}
                  alt={selectedCoastal.name}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    handleImageError(
                      e,
                      selectedCoastal.fallback || "/assets/fallback.jpg",
                    )
                  }
                />
              </div>
              <div className="mb-4 md:mb-6">
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {getCategoryName(selectedCoastal.category)}, Kenya Coast
                </span>
                <span className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold ml-2">
                  {selectedCoastal.type}
                </span>
              </div>
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-blue-500 rounded-full"></span>
                  Description
                </h3>
                <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedCoastal.fullDescription}
                </div>
              </div>
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-blue-500 rounded-full"></span>
                  Accommodation
                </h3>
                <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedCoastal.accommodation}
                </div>
              </div>
              <div className="mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 md:h-6 bg-blue-500 rounded-full"></span>
                  Facilities & Activities
                </h3>
                <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedCoastal.facilities}
                </div>
              </div>
              <div className="mb-6 md:mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-blue-100">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">🏖️</span>WHY BOOK WITH
                  US?
                </h3>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-blue-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    We are a specialist destination travel company, focused on
                    creating tailor-made beach holidays in Kenya
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-blue-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Over 20 years experience organizing coastal vacations and
                    safaris
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-blue-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Kenyan based company with extensive local knowledge of the
                    coast
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-blue-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Best price guarantee and exclusive deals at partner
                    properties
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-blue-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Personalized service - book everything through one contact
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="text-blue-600 text-base md:text-lg">
                      ✓
                    </span>{" "}
                    Tailor-made packages for any budget and group size
                  </li>
                </ul>
              </div>
              <div className="border-t pt-4 md:pt-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-5">
                  Enquire About This Property
                </h3>
                <form onSubmit={handleCoastalEnquirySubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>
                  <div className="mb-4 md:mb-5">
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                    />
                  </div>
                  <div className="mb-5 md:mb-6">
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                      placeholder="Tell us your travel dates, number of guests, and any special requests..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 md:py-3 px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && selectedHotel && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto animate-scale-in">
            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Book {selectedHotel.name}
                </h2>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
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
              <div
                className={`p-3 md:p-4 rounded-lg md:rounded-xl mb-4 md:mb-6 border ${selectedHotel.park ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-200"}`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden shadow-md">
                    <img
                      src={selectedHotel.image}
                      alt={selectedHotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        handleImageError(
                          e,
                          selectedHotel.fallback || "/assets/fallback.jpg",
                        )
                      }
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">
                      {selectedHotel.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
                      <span className="font-medium">📍</span>{" "}
                      {selectedHotel.park ||
                        getCategoryName(selectedHotel.category)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      <span className="font-medium">🏷️</span>{" "}
                      {selectedHotel.type}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={bookingForm.fullName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      Check-in *
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={bookingForm.checkIn}
                      onChange={handleFormChange}
                      required
                      className="w-full px-2 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                      Check-out *
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={bookingForm.checkOut}
                      onChange={handleFormChange}
                      required
                      className="w-full px-2 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={bookingForm.guests}
                    onChange={handleFormChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={bookingForm.roomType}
                    onChange={handleFormChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                  >
                    <option value="Standard">Standard Room/Tent</option>
                    <option value="Deluxe">Deluxe Room/Tent</option>
                    <option value="Suite">Suite/Luxury Tent</option>
                    <option value="Beachfront">Beachfront Villa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                    Special Requests
                  </label>
                  <textarea
                    name="message"
                    value={bookingForm.message}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                    placeholder="Any special requirements or requests..."
                  ></textarea>
                </div>
                {bookingForm.checkIn && bookingForm.checkOut && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                      Booking Summary
                    </h3>
                    <div className="space-y-1 text-xs md:text-sm">
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
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 md:py-3 px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 mt-5 md:mt-6 flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
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
              <p className="text-[10px] md:text-xs text-gray-500 text-center mt-3 md:mt-4">
                Your booking details will be sent to tembo4401@gmail.com
              </p>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CoastalAccommodation;
