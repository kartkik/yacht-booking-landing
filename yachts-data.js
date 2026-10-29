/* ==========================================================================
   ELITE RENTALS KERALA - CURATED LUXURY FLEET DATASET
   Kochi Marina, Alleppey Backwaters, Vembanad Lake & Arabian Sea
   ========================================================================== */

const YACHTS_DATA = [
  // --- COMFORT CLASS ---
  {
    "id": "yacht-1",
    "name": "Azura 65 Fort Kochi Motor Yacht",
    "category": "Comfort Class",
    "categorySlug": "comfort",
    "length": "20 m",
    "guests": "15 guests",
    "guestCapacity": 15,
    "priceINR": 25000,
    "photosCount": 28,
    "coverImage": "./assets/kochi-yacht-sunset.jpg",
    "gallery": [
      "./assets/kochi-yacht-sunset.jpg",
      "./assets/kerala-yacht-salon.jpg",
      "./assets/kerala-yacht-dining.jpg"
    ],
    "features": [
      "Captain & 3 Certified Crew Included",
      "Unlimited Tender Coconut Water & Refreshments",
      "Bose Surround Sound System",
      "Teak Sun Deck with Lounge Cushions",
      "Air Conditioned Saloon & En-suite Stateroom"
    ],
    "description": "Cruising from Bolgatty Marina and Fort Kochi. Enjoy breathtaking views of the ancient Chinese fishing nets, Willingdon Island, and the Arabian Sea sunset."
  },
  {
    "id": "yacht-2",
    "name": "Marari Breeze 52 Luxury Flybridge",
    "category": "Comfort Class",
    "categorySlug": "comfort",
    "length": "16 m",
    "guests": "12 guests",
    "guestCapacity": 12,
    "priceINR": 20000,
    "photosCount": 24,
    "coverImage": "./assets/marari-coastal-yacht.jpg",
    "gallery": [
      "./assets/marari-coastal-yacht.jpg",
      "./assets/kerala-yacht-dining.jpg",
      "./assets/kerala-yacht-salon.jpg"
    ],
    "features": [
      "Licensed Captain & Uniformed Crew",
      "Chilled Tropical Fruits & Beverages",
      "Flybridge Observation Deck",
      "Bluetooth Audio Setup"
    ],
    "description": "Ideal for romantic escapes and family outings along the serene coastline and lagoons of Marari and Alappuzha."
  },
  {
    "id": "yacht-3",
    "name": "Bolgatty Diamond 58 Marina Cruiser",
    "category": "Comfort Class",
    "categorySlug": "comfort",
    "length": "18 m",
    "guests": "16 guests",
    "guestCapacity": 16,
    "priceINR": 28000,
    "photosCount": 26,
    "coverImage": "./assets/bolgatty-marina-yacht.jpg",
    "gallery": [
      "./assets/bolgatty-marina-yacht.jpg",
      "./assets/kochi-yacht-sunset.jpg",
      "./assets/kerala-yacht-salon.jpg"
    ],
    "features": [
      "Experienced Marine Crew",
      "Spacious Bow Sunbed",
      "Air Conditioned Master Suite",
      "Complimentary Snacking Platter"
    ],
    "description": "Premium day cruiser for island hopping around Vypin, Bolgatty Palace, and the serene Kochi harbour waters."
  },

  // --- COMFORT PLUS ---
  {
    "id": "yacht-4",
    "name": "Alleppey Pearl Heritage Luxury Yacht",
    "category": "Comfort Plus",
    "categorySlug": "comfort-plus",
    "length": "30 m",
    "guests": "30 guests",
    "guestCapacity": 30,
    "priceINR": 45000,
    "photosCount": 35,
    "coverImage": "./assets/alleppey-heritage-yacht.jpg",
    "gallery": [
      "./assets/alleppey-heritage-yacht.jpg",
      "./assets/kerala-yacht-dining.jpg",
      "./assets/vembanad-catamaran.jpg",
      "./assets/kerala-yacht-salon.jpg"
    ],
    "features": [
      "Presidential Glass Panoramic Saloon",
      "Full Teak Promenade & Upper Sun Deck",
      "Gourmet Kerala Coastal On-Board Dining",
      "Dedicated Captain, Stewards & Private Chef",
      "State-of-the-Art Sound & Mood Lighting"
    ],
    "description": "The crown jewel of Alleppey backwaters. Combines the historic elegance of Kerala teak architecture with world-class superyacht luxury."
  },
  {
    "id": "yacht-5",
    "name": "Vembanad Pearl Kumarakom Catamaran",
    "category": "Comfort Plus",
    "categorySlug": "comfort-plus",
    "length": "22 m",
    "guests": "25 guests",
    "guestCapacity": 25,
    "priceINR": 40000,
    "photosCount": 32,
    "coverImage": "./assets/vembanad-catamaran.jpg",
    "gallery": [
      "./assets/vembanad-catamaran.jpg",
      "./assets/kumarakom-sunset-yacht.jpg",
      "./assets/kerala-yacht-dining.jpg"
    ],
    "features": [
      "Double-Hull Ultra Stable Cruising",
      "Expansive Open-Air Foredeck Loungers",
      "Panoramic Lake-View Salon",
      "Fresh Karimeen Pollichathu Dining Option"
    ],
    "description": "Glide through the tranquil waters of Vembanad Lake in Kumarakom with zero engine vibration and breathtaking 360-degree views."
  },
  {
    "id": "yacht-6",
    "name": "Kumarakom Serenity 70 Flybridge",
    "category": "Comfort Plus",
    "categorySlug": "comfort-plus",
    "length": "22 m",
    "guests": "22 guests",
    "guestCapacity": 22,
    "priceINR": 48000,
    "photosCount": 30,
    "coverImage": "./assets/kumarakom-sunset-yacht.jpg",
    "gallery": [
      "./assets/kumarakom-sunset-yacht.jpg",
      "./assets/kerala-yacht-salon.jpg",
      "./assets/vembanad-catamaran.jpg"
    ],
    "features": [
      "Captain, Hostess & Chef Onboard",
      "Dual Flybridge with Wet Bar & Cocktail Seating",
      "Hydraulic Swim Platform",
      "Acoustic Audio & Sunset Deck Lights"
    ],
    "description": "Crafted for grand celebrations, family milestones, and sunset cocktail parties on Vembanad Lake and Kumarakom waters."
  },

  // --- BUSINESS CLASS ---
  {
    "id": "yacht-7",
    "name": "Mythos 90 Emerald Backwaters Yacht",
    "category": "Business Class Yachting",
    "categorySlug": "business",
    "length": "28 m",
    "guests": "35 guests",
    "guestCapacity": 35,
    "priceINR": 85000,
    "photosCount": 40,
    "coverImage": "./assets/hero-kerala-yacht.jpg",
    "gallery": [
      "./assets/hero-kerala-yacht.jpg",
      "./assets/kerala-yacht-salon.jpg",
      "./assets/kerala-yacht-dining.jpg",
      "./assets/arabian-sea-superyacht.jpg"
    ],
    "features": [
      "Top-Deck Jacuzzi with Lake Views",
      "Full Commercial Galley & 5-Star Chef",
      "5 Luxury Staterooms with En-suite Marble Bathrooms",
      "High-Speed Satellite Internet (Starlink)",
      "Dedicated Uniformed Crew of 6"
    ],
    "description": "An imposing 90ft tri-deck yacht designed for VIP guests, international travelers, and unforgettable private gatherings across Kerala."
  },
  {
    "id": "yacht-8",
    "name": "Marari Ocean Predator 85 Yacht",
    "category": "Business Class Yachting",
    "categorySlug": "business",
    "length": "26 m",
    "guests": "25 guests",
    "guestCapacity": 25,
    "priceINR": 95000,
    "photosCount": 36,
    "coverImage": "./assets/marari-coastal-yacht.jpg",
    "gallery": [
      "./assets/marari-coastal-yacht.jpg",
      "./assets/arabian-sea-superyacht.jpg",
      "./assets/kerala-yacht-salon.jpg"
    ],
    "features": [
      "Speed Performance up to 34 Knots",
      "Sleek Carbon & Titanium Styling",
      "Dolby Atmos Interior Cinema",
      "Seabob Water Scooters Available"
    ],
    "description": "High-octane luxury. Cruising out from Kochi Port along the Arabian Sea coastline to Marari Beach."
  },
  {
    "id": "yacht-9",
    "name": "Bolgatty Royal Sovereign 95",
    "category": "Business Class Yachting",
    "categorySlug": "business",
    "length": "29 m",
    "guests": "40 guests",
    "guestCapacity": 40,
    "priceINR": 110000,
    "photosCount": 38,
    "coverImage": "./assets/bolgatty-marina-yacht.jpg",
    "gallery": [
      "./assets/bolgatty-marina-yacht.jpg",
      "./assets/kumarakom-sunset-yacht.jpg",
      "./assets/kerala-yacht-dining.jpg",
      "./assets/kerala-yacht-salon.jpg"
    ],
    "features": [
      "Dual Flybridge with Wet Bar & Grill",
      "Full Air Conditioning with HEPA Filtration",
      "Live Coastal Grill On Deck",
      "VIP Chauffeur Pickup Included"
    ],
    "description": "The ultimate party and corporate charter vessel with two expansive entertainer decks."
  },

  // --- FIRST CLASS SUPERYACHTS ---
  {
    "id": "yacht-10",
    "name": "Arabian Sea Azure 110 Superyacht",
    "category": "First Class Yachting",
    "categorySlug": "first-class",
    "length": "34 m",
    "guests": "45 guests",
    "guestCapacity": 45,
    "priceINR": 180000,
    "photosCount": 45,
    "coverImage": "./assets/arabian-sea-superyacht.jpg",
    "gallery": [
      "./assets/arabian-sea-superyacht.jpg",
      "./assets/hero-kerala-yacht.jpg",
      "./assets/kerala-yacht-salon.jpg",
      "./assets/kerala-yacht-dining.jpg"
    ],
    "features": [
      "Heated Freshwater Jacuzzi on Sky Lounge",
      "Full Beam Master Stateroom with 180° Views",
      "Professional Crew of 8 Including Executive Chef",
      "Seadoo Jet Skis & Speedboat Tender Included",
      "Luxury Chauffeur Transfer in Mercedes Maybach"
    ],
    "description": "Kerala's most prestigious coastal superyacht. Sailing between Kochi Marina, Marari Coast, and Kovalam with absolute royal treatment."
  },
  {
    "id": "yacht-11",
    "name": "Kochi Grand Oceanfast 140 Mega Yacht",
    "category": "First Class Yachting",
    "categorySlug": "first-class",
    "length": "42 m",
    "guests": "60 guests",
    "guestCapacity": 60,
    "priceINR": 240000,
    "photosCount": 50,
    "coverImage": "./assets/arabian-sea-superyacht.jpg",
    "gallery": [
      "./assets/arabian-sea-superyacht.jpg",
      "./assets/bolgatty-marina-yacht.jpg",
      "./assets/kerala-yacht-salon.jpg",
      "./assets/kerala-yacht-dining.jpg"
    ],
    "features": [
      "On-Board Swimming Pool & Heated Jacuzzi",
      "Grand Ballroom & Banquet Saloon",
      "Helipad Deck for Aerial Transfers",
      "Michelin-Trained Culinary Team"
    ],
    "description": "A 140ft maritime marvel accommodating magnificent weddings, royal receptions, and international delegate banquets."
  },

  // --- EXCLUSIVE & EVENTS ---
  {
    "id": "yacht-12",
    "name": "Vembanad Sovereign 160 Grand Banquet Yacht",
    "category": "Extra",
    "categorySlug": "exclusive",
    "length": "48 m",
    "guests": "100 guests",
    "guestCapacity": 100,
    "priceINR": 320000,
    "photosCount": 42,
    "coverImage": "./assets/alleppey-heritage-yacht.jpg",
    "gallery": [
      "./assets/alleppey-heritage-yacht.jpg",
      "./assets/kumarakom-sunset-yacht.jpg",
      "./assets/vembanad-catamaran.jpg",
      "./assets/kerala-yacht-dining.jpg"
    ],
    "features": [
      "Capacity for up to 100 Celebratory Guests",
      "Multi-Tier Open Air Sun Decks",
      "Custom Audio-Visual & Stage Rigging for Live Concerts",
      "Full Service Bar & Buffet Stations"
    ],
    "description": "Kerala's largest luxury charter vessel. Tailor-made for destination weddings, luxury corporate retreats, and film shoot charters."
  }
];
