import React, { useState } from "react";
import Swal from "sweetalert2";

const CoastalAccommodation = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLodgeDetailModal, setShowLodgeDetailModal] = useState(false);
  const [selectedLodge, setSelectedLodge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  // Complete Safari Camps & Lodges Data
  const safariLodges = [
    // Tsavo East Camps & Lodges
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
    // Tsavo West Camps & Lodges
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
    // Amboseli Camps & Lodges
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
    // Masai Mara Camps & Lodges

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
    // Lake Nakuru Camps & Lodges

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
    // Samburu Camps & Lodges
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

    // Naivasha Camps & Lodges
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
    // Aberdare Park
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
    // Meru National Park
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
    // Nairobi City Hotels
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
      },
      {
        id: 2,
        name: "Hemmingways Watamu",
        type: "Luxury Hotel",
        image: "/assets/hotel-Hemingways-Watamu2.png",
        fallback: "/assets/hotel-Hemingways-Watamu.png",
      },

      {
        id: 4,
        name: "Temple Point",
        type: "Resort",
        image: "/assets/templ.png",
        fallback: "/assets/templ.png",
      },
      {
        id: 5,
        name: "Crystal Bay Resort",
        type: "Resort",
        image: "/assets/cristal.png",
        fallback: "/assets/cristal.png",
      },
      {
        id: 6,
        name: "Lyle Palm",
        type: "Hotel",
        image: "/assets/lylpalm .png",
        fallback: "/assets/lylpalm .png",
      },
      {
        id: 7,
        name: "Barakuda",
        type: "Resort",
        image: "/assets/barakuda.png",
        fallback: "/assets/barakuda.png",
      },
      {
        id: 8,
        name: "Aquarius",
        type: "Hotel",
        image: "/assets/aqurius watamu.png",
        fallback: "/assets/aqurius watamu.png",
      },
    ],
    jacarandaWatamu: [
      {
        id: 9,
        name: "The One",
        type: "Boutique Hotel",
        image: "/assets/the one .png",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 10,
        name: "Jacaranda Resort",
        type: "Resort",
        image: "/assets/accommodation/jacaranda-resort.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 11,
        name: "Jumbo",
        type: "Hotel",
        image: "/assets/accommodation/jumbo.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 12,
        name: "Bravo",
        type: "Hotel",
        image: "/assets/accommodation/bravo.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    mombasa: [
      {
        id: 13,
        name: "Severin Sea Lodge",
        type: "Luxury Resort",
        image: "/assets/accommodation/severin.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 14,
        name: "Sarova Whitesands Beach Resort",
        type: "Premium Resort",
        image: "/assets/accommodation/sarova-whitesands.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 15,
        name: "Mombasa Beach",
        type: "Resort",
        image: "/assets/accommodation/mombasa-beach.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 16,
        name: "Nyali Beach",
        type: "Hotel",
        image: "/assets/accommodation/nyali-beach.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 17,
        name: "Bamburi Beach",
        type: "Resort",
        image: "/assets/accommodation/bamburi.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 18,
        name: "Neptune Beach",
        type: "Resort",
        image: "/assets/accommodation/neptune.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 19,
        name: "White Sand Beach",
        type: "Hotel",
        image: "/assets/accommodation/white-sand.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    nairobi: [
      {
        id: 20,
        name: "West Lavat",
        type: "Hotel",
        image: "/assets/accommodation/west-lavat.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 21,
        name: "Sarova Nairobi",
        type: "Business Hotel",
        image: "/assets/accommodation/sarova-nairobi.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 22,
        name: "Canivo",
        type: "Hotel",
        image: "/assets/accommodation/canivo.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    malindi: [
      {
        id: 23,
        name: "Scorpion Villa",
        type: "Villa",
        image: "/assets/accommodation/scorpion-villa.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 24,
        name: "Tropical",
        type: "Resort",
        image: "/assets/accommodation/tropical.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 25,
        name: "Diamond Africa",
        type: "Hotel",
        image: "/assets/accommodation/diamond-africa.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 26,
        name: "Kilili Baharini",
        type: "Resort",
        image: "/assets/accommodation/kilili.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
    ],
    diani: [
      {
        id: 27,
        name: "Jacaranda Indian Ocean",
        type: "Resort",
        image: "/assets/accommodation/jacaranda-ocean.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 28,
        name: "Baobab Beach",
        type: "Premium Resort",
        image: "/assets/accommodation/baobab-beach.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 29,
        name: "Thousand Palms",
        type: "Resort",
        image: "/assets/accommodation/thousand-palms.jpg",
        fallback: "/assets/accommodation/default.jpg",
      },
      {
        id: 30,
        name: "Kolekole Beach",
        type: "Hotel",
        image: "/assets/accommodation/kolekole.jpg",
        fallback: "/assets/accommodation/default.jpg",
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

  const handleImageError = (e, fallbackImage) => {
    e.target.onerror = null;
    e.target.src = fallbackImage || "/assets/fallback.jpg";
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Processing Booking...",
      html: `<div style="display: flex; flex-direction: column; align-items: center;"><div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 20px;"></div><p>Please wait while we process your request</p></div>`,
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

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const emailBody = `
${bookingData.accommodation.park ? "SAFARI LODGE/CAMP BOOKING DETAILS:" : "COASTAL ACCOMMODATION BOOKING DETAILS:"}

🏨 ACCOMMODATION: ${bookingData.accommodation.name}
📍 LOCATION: ${bookingData.accommodation.park || getCategoryName(bookingData.accommodation.category)}
🏠 TYPE: ${bookingData.accommodation.type}

📅 BOOKING DATES:
- Check-in: ${bookingData.checkIn}
- Check-out: ${bookingData.checkOut}
- Duration: ${calculateNights()} nights
- Guests: ${bookingData.guests}
- Room Type: ${bookingData.roomType}

👤 GUEST INFORMATION:
- Full Name: ${bookingData.fullName}
- Email: ${bookingData.email}
- Phone: ${bookingData.phone}

💬 ADDITIONAL NOTES:
${bookingData.message || "No additional notes"}

📧 This booking was made through JozTembo Tours Portal.
      `.trim();

      const response = await fetch("http://localhost:5000/api/send-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "accommodation",
          accommodation: bookingData.accommodation,
          bookingDetails: bookingData,
          nights: calculateNights(),
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Your booking request has been sent successfully!",
          icon: "success",
          confirmButtonText: "Great!",
          confirmButtonColor: "#3b82f6",
        });
      } else {
        throw new Error("Backend failed");
      }
    } catch (error) {
      window.open(
        `mailto:tembo4401@gmail.com?subject=Booking: ${bookingData.accommodation.name}&body=${encodeURIComponent(emailBody)}`,
      );
      Swal.fire({
        title: "Email Client Opened",
        text: "Please send the pre-filled email to complete your booking",
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
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
    const bookingData = { ...bookingForm, accommodation: selectedHotel };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-900/70 z-10"></div>
        <img
          src="/assets/coastal-hero.jpg"
          alt="Kenya Accommodation"
          className="w-full h-full object-cover scale-105"
          onError={(e) =>
            handleImageError(e, "/assets/coastal-hero-fallback.jpg")
          }
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 font-display tracking-tight animate-fade-in">
              Kenya Accommodation
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-95">
              Discover the best safari camps, lodges, and coastal resorts in
              Kenya
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <span className="font-semibold">🦁 Safari Adventures</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <span className="font-semibold">🏖️ Beach Paradise</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <span className="font-semibold">🏨 Luxury Stays</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-50 to-transparent z-10"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Safari Lodges Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
              Wildlife Experience
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-display mt-2">
              Safari Camps & Lodges
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on any lodge name below to view detailed information about
              your dream safari destination
            </p>
          </div>

          {/* Safari Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedSafariCategory("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedSafariCategory === "all" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:shadow-md"}`}
            >
              All
            </button>
            {safariCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSafariCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedSafariCategory === cat ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200" : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:shadow-md"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lodges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredSafariLodges.map((lodge, index) => (
              <button
                key={lodge.id}
                onClick={() => openLodgeDetailModal(lodge)}
                className="group text-left bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={lodge.image}
                    alt={lodge.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => handleImageError(e, "/assets/fallback.jpg")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-semibold bg-emerald-500/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      {lodge.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors text-base">
                    {lodge.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-emerald-500"
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {lodge.park}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-emerald-600 font-semibold text-sm">
                      View Details →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-b from-emerald-50 to-teal-50 px-6 py-2 text-gray-500 text-sm rounded-full shadow-sm">
              Beach Accommodation
            </span>
          </div>
        </div>

        {/* Coastal Section */}
        <div>
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Coastal Paradise
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-display mt-2">
              Select Your Coastal Destination
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          </div>

          {/* Location Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setSelectedLocation("all")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedLocation === "all" ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
            >
              All Locations
            </button>
            {Object.keys(accommodations).map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedLocation === location ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-md"}`}
              >
                {getCategoryName(location)}
              </button>
            ))}
          </div>

          {/* Contact Numbers */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 text-center border border-blue-100 shadow-sm">
              <p className="text-gray-700 mb-3 font-semibold flex items-center justify-center gap-2">
                <span className="text-xl">📞</span> Do not hesitate to give us a
                call
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <a
                  href="tel:+254743545012"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors flex items-center justify-center gap-2 group"
                >
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    📱
                  </span>
                  +254 743 545 012
                </a>
                <a
                  href="tel:+254722266955"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors flex items-center justify-center gap-2 group"
                >
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    📱
                  </span>
                  +254 722 266 955
                </a>
                <a
                  href="tel:+254722609492"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors flex items-center justify-center gap-2 group"
                >
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    📱
                  </span>
                  +254 722 609 492
                </a>
              </div>
            </div>
          </div>

          {/* Coastal Accommodation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAccommodations.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => handleImageError(e, item.fallback)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      {item.type}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {item.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {getCategoryName(item.category)}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {item.type}
                    </span>
                  </div>
                  <button
                    onClick={() => openBookingModal(item)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Book With Us */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-display">
              Why Book With Us?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-emerald-600"
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
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Quality Assured
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All our partner properties are carefully vetted for quality and
                service excellence
              </p>
            </div>
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-blue-600"
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
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated team is available round the clock for assistance
              </p>
            </div>
            <div className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-amber-600"
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
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Easy Booking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Simple and secure booking process with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lodge Detail Modal - Keep from your original */}
      {showLodgeDetailModal && selectedLodge && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={closeLodgeDetailModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-5 border-b flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedLodge.name}
              </h2>
              <button
                onClick={closeLodgeDetailModal}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
            <div className="p-6 md:p-8">
              <div className="h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
                <img
                  src={selectedLodge.image}
                  alt={selectedLodge.name}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, "/assets/fallback.jpg")}
                />
              </div>
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {selectedLodge.park}
                </span>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                  Description
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedLodge.fullDescription}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                  Accommodation
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedLodge.accommodation}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                  Facilities
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedLodge.facilities}
                </div>
              </div>
              <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✨</span>WHY BOOK WITH US?
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-lg">✓</span> We are a
                    specialist destination travel company, focused on creating
                    tailor-made and group travel holiday packages in Kenya
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-lg">✓</span> We have
                    over 20 years experience in organizing Tours & Safaris
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-lg">✓</span> A Kenyan
                    based company with extensive local knowledge
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-lg">✓</span> Book
                    everything through one contact, a seamless and painless
                    vacation for you
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-lg">✓</span> Save
                    time and get honest advice by booking your Kenyan safari
                    holiday through us
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 text-lg">✓</span>{" "}
                    Tailor-made travel for any need and budget
                  </li>
                </ul>
              </div>
              <div className="border-t pt-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-5">
                  Enquire or Book Your Safari
                </h3>
                <form onSubmit={handleLodgeBookingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Tell us your travel dates, number of guests, and any special requests..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Book {selectedHotel.name}
                </h2>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                className={`p-4 rounded-xl mb-6 border ${selectedHotel.park ? "bg-emerald-50 border-emerald-200" : "bg-blue-50 border-blue-200"}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
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
                    <h3 className="font-bold text-gray-800 text-lg">
                      {selectedHotel.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">📍</span>{" "}
                      {selectedHotel.park ||
                        getCategoryName(selectedHotel.category)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">🏷️</span>{" "}
                      {selectedHotel.type}
                    </p>
                  </div>
                </div>
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Check-in *
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={bookingForm.checkIn}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Check-out *
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={bookingForm.checkOut}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={bookingForm.guests}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={bookingForm.roomType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Standard">Standard Room/Tent</option>
                    <option value="Deluxe">Deluxe Room/Tent</option>
                    <option value="Suite">Suite/Luxury Tent</option>
                    <option value="Beachfront">Beachfront Villa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="message"
                    value={bookingForm.message}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Any special requirements or requests..."
                  ></textarea>
                </div>
                {bookingForm.checkIn && bookingForm.checkOut && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Booking Summary
                    </h3>
                    <div className="space-y-1 text-sm">
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
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 mt-6 flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
      `}</style>
    </div>
  );
};

export default CoastalAccommodation;
