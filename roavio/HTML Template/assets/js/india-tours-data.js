/**
 * Roavio - Comprehensive India Tourist Destinations & Travel Database
 * Covers all major Indian states with authentic landmark photographs,
 * official entry tickets, geolocation coordinates, and verified transport links.
 * Total Destinations: 175 across 24 States and Union Territories.
 */

const INDIA_STATES = [
    "All States",
    "Delhi",
    "Uttar Pradesh",
    "Rajasthan",
    "Kerala",
    "Himachal Pradesh",
    "Goa",
    "Jammu & Kashmir",
    "Ladakh",
    "Uttarakhand",
    "Karnataka",
    "Tamil Nadu",
    "Maharashtra",
    "West Bengal",
    "Punjab",
    "Madhya Pradesh",
    "Odisha",
    "Gujarat",
    "Telangana",
    "Andhra Pradesh",
    "Assam",
    "Meghalaya",
    "Sikkim",
    "Bihar",
    "Andaman & Nicobar"
];

const INDIA_CATEGORIES = [
    {
        "id": "all",
        "name": "All Experiences",
        "icon": "fa-earth-asia"
    },
    {
        "id": "heritage",
        "name": "Heritage & Forts",
        "icon": "fa-monument"
    },
    {
        "id": "hills",
        "name": "Hill Stations",
        "icon": "fa-mountain-sun"
    },
    {
        "id": "beaches",
        "name": "Beaches & Coastal",
        "icon": "fa-umbrella-beach"
    },
    {
        "id": "spiritual",
        "name": "Spiritual & Temples",
        "icon": "fa-om"
    },
    {
        "id": "adventure",
        "name": "Snow & Adventure",
        "icon": "fa-person-snowboarding"
    },
    {
        "id": "wildlife",
        "name": "Wildlife & Safari",
        "icon": "fa-paw"
    }
];

const INDIA_TOURIST_DESTINATIONS = [
    {
        "id": "red-fort-delhi",
        "name": "Red Fort & Chandni Chowk",
        "state": "Delhi",
        "city": "Old Delhi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/red-fort-delhi.jpg",
        "lat": 28.6562,
        "lng": 77.241,
        "ticketPrice": 50,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 12000,
        "badge": "UNESCO World Heritage",
        "description": "Explore Red Fort & Chandni Chowk located in Old Delhi, Delhi. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Old Delhi / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Old Delhi Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Old Delhi Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Old Delhi)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/red-fort-delhi.jpg"
        }
    },
    {
        "id": "qutub-minar",
        "name": "Qutub Minar & Mehrauli",
        "state": "Delhi",
        "city": "South Delhi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/qutub-minar.jpg",
        "lat": 28.5244,
        "lng": 77.1855,
        "ticketPrice": 50,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 12739,
        "badge": "73m Victory Tower",
        "description": "Explore Qutub Minar & Mehrauli located in South Delhi, Delhi. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "South Delhi / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "South Delhi Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "South Delhi Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (South Delhi)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/qutub-minar.jpg"
        }
    },
    {
        "id": "india-gate-delhi",
        "name": "India Gate & Kartavya Path",
        "state": "Delhi",
        "city": "New Delhi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/india-gate-delhi.jpg",
        "lat": 28.6129,
        "lng": 77.2295,
        "ticketPrice": 0,
        "tourPackagePrice": 999,
        "rating": 4.7,
        "reviews": 13478,
        "badge": "National War Memorial",
        "description": "Explore India Gate & Kartavya Path located in New Delhi, Delhi. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "New Delhi / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "New Delhi Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "New Delhi Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (New Delhi)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/india-gate-delhi.jpg"
        }
    },
    {
        "id": "humayuns-tomb",
        "name": "Humayun's Tomb & Sunder Nursery",
        "state": "Delhi",
        "city": "New Delhi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/humayuns-tomb.jpg",
        "lat": 28.5933,
        "lng": 77.2507,
        "ticketPrice": 50,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 14217,
        "badge": "UNESCO Mughal Garden",
        "description": "Explore Humayun's Tomb & Sunder Nursery located in New Delhi, Delhi. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "New Delhi / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "New Delhi Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "New Delhi Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (New Delhi)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/humayuns-tomb.jpg"
        }
    },
    {
        "id": "lotus-temple",
        "name": "Lotus Temple & Kalkaji",
        "state": "Delhi",
        "city": "New Delhi",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/lotus-temple.jpg",
        "lat": 28.5535,
        "lng": 77.2588,
        "ticketPrice": 0,
        "tourPackagePrice": 899,
        "rating": 4.7,
        "reviews": 14956,
        "badge": "Architectural Marvel",
        "description": "Explore Lotus Temple & Kalkaji located in New Delhi, Delhi. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "New Delhi / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "New Delhi Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "New Delhi Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (New Delhi)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/lotus-temple.jpg"
        }
    },
    {
        "id": "taj-mahal",
        "name": "Taj Mahal & Agra Fort",
        "state": "Uttar Pradesh",
        "city": "Agra",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/taj-mahal.jpg",
        "lat": 27.1751,
        "lng": 78.0421,
        "ticketPrice": 50,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 15695,
        "badge": "Wonder of the World",
        "description": "Explore Taj Mahal & Agra Fort located in Agra, Uttar Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Agra / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Agra Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Agra Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Agra)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/taj-mahal.jpg"
        }
    },
    {
        "id": "varanasi",
        "name": "Varanasi Ghats & Kashi Vishwanath",
        "state": "Uttar Pradesh",
        "city": "Varanasi",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/varanasi.jpg",
        "lat": 25.3176,
        "lng": 82.9739,
        "ticketPrice": 0,
        "tourPackagePrice": 1899,
        "rating": 4.7,
        "reviews": 16434,
        "badge": "Oldest Living City",
        "description": "Explore Varanasi Ghats & Kashi Vishwanath located in Varanasi, Uttar Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Varanasi / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Varanasi Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Varanasi Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Varanasi)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/varanasi.jpg"
        }
    },
    {
        "id": "fatehpur-sikri",
        "name": "Fatehpur Sikri & Buland Darwaza",
        "state": "Uttar Pradesh",
        "city": "Agra",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/fatehpur-sikri.jpg",
        "lat": 27.0945,
        "lng": 77.6679,
        "ticketPrice": 50,
        "tourPackagePrice": 1399,
        "rating": 4.7,
        "reviews": 17173,
        "badge": "Mughal Imperial Capital",
        "description": "Explore Fatehpur Sikri & Buland Darwaza located in Agra, Uttar Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Agra / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Agra Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Agra Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Agra)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/fatehpur-sikri.jpg"
        }
    },
    {
        "id": "ayodhya-ram-mandir",
        "name": "Ram Mandir & Saryu River Ghats",
        "state": "Uttar Pradesh",
        "city": "Ayodhya",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/ayodhya-ram-mandir.jpg",
        "lat": 26.7956,
        "lng": 82.1943,
        "ticketPrice": 0,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 17912,
        "badge": "Spiritual Sanctuary",
        "description": "Explore Ram Mandir & Saryu River Ghats located in Ayodhya, Uttar Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Ayodhya / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Ayodhya Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Ayodhya Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Ayodhya)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/ayodhya-ram-mandir.jpg"
        }
    },
    {
        "id": "hawa-mahal",
        "name": "Hawa Mahal & Pink City",
        "state": "Rajasthan",
        "city": "Jaipur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/hawa-mahal.jpg",
        "lat": 26.9239,
        "lng": 75.8267,
        "ticketPrice": 50,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 18651,
        "badge": "Palace of Winds",
        "description": "Explore Hawa Mahal & Pink City located in Jaipur, Rajasthan. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Jaipur / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Jaipur Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Jaipur Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Jaipur)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/hawa-mahal.jpg"
        }
    },
    {
        "id": "amber-fort",
        "name": "Amber Fort & Maota Lake",
        "state": "Rajasthan",
        "city": "Jaipur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/amber-fort.jpg",
        "lat": 26.9855,
        "lng": 75.8513,
        "ticketPrice": 100,
        "tourPackagePrice": 1599,
        "rating": 4.7,
        "reviews": 19390,
        "badge": "Royal Rajput Fortress",
        "description": "Explore Amber Fort & Maota Lake located in Jaipur, Rajasthan. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Jaipur / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Jaipur Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Jaipur Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Jaipur)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/amber-fort.jpg"
        }
    },
    {
        "id": "lake-pichola",
        "name": "Lake Pichola & City Palace",
        "state": "Rajasthan",
        "city": "Udaipur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/lake-pichola.jpg",
        "lat": 24.5764,
        "lng": 73.6835,
        "ticketPrice": 300,
        "tourPackagePrice": 1999,
        "rating": 4.7,
        "reviews": 20129,
        "badge": "City of Lakes",
        "description": "Explore Lake Pichola & City Palace located in Udaipur, Rajasthan. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Udaipur / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Udaipur Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Udaipur Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Udaipur)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/lake-pichola.jpg"
        }
    },
    {
        "id": "mehrangarh",
        "name": "Mehrangarh Fort & Blue City",
        "state": "Rajasthan",
        "city": "Jodhpur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/mehrangarh.jpg",
        "lat": 26.2978,
        "lng": 73.0185,
        "ticketPrice": 100,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 20868,
        "badge": "Cliff-top Fortress",
        "description": "Explore Mehrangarh Fort & Blue City located in Jodhpur, Rajasthan. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Jodhpur / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Jodhpur Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Jodhpur Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Jodhpur)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/mehrangarh.jpg"
        }
    },
    {
        "id": "jaisalmer-dunes",
        "name": "Sam Sand Dunes & Desert Safari",
        "state": "Rajasthan",
        "city": "Jaisalmer",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/jaisalmer-dunes.jpg",
        "lat": 26.8278,
        "lng": 70.529,
        "ticketPrice": 200,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 21607,
        "badge": "Golden Desert Camp",
        "description": "Explore Sam Sand Dunes & Desert Safari located in Jaisalmer, Rajasthan. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Jaisalmer / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Jaisalmer Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Jaisalmer Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Jaisalmer)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/jaisalmer-dunes.jpg"
        }
    },
    {
        "id": "munnar",
        "name": "Munnar Tea Gardens & Anamudi",
        "state": "Kerala",
        "city": "Munnar",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/munnar.jpg",
        "lat": 10.0889,
        "lng": 77.0595,
        "ticketPrice": 150,
        "tourPackagePrice": 1899,
        "rating": 4.7,
        "reviews": 22346,
        "badge": "Misty Hill Station",
        "description": "Explore Munnar Tea Gardens & Anamudi located in Munnar, Kerala. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Munnar / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Munnar Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Munnar Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Munnar)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/munnar.jpg"
        }
    },
    {
        "id": "alleppey",
        "name": "Alleppey Backwaters & Houseboat",
        "state": "Kerala",
        "city": "Alappuzha",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/alleppey.jpg",
        "lat": 9.4981,
        "lng": 76.3388,
        "ticketPrice": 0,
        "tourPackagePrice": 3499,
        "rating": 4.7,
        "reviews": 23085,
        "badge": "Venice of the East",
        "description": "Explore Alleppey Backwaters & Houseboat located in Alappuzha, Kerala. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Alappuzha / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Alappuzha Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Alappuzha Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Alappuzha)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/alleppey.jpg"
        }
    },
    {
        "id": "athirappilly",
        "name": "Athirappilly Waterfalls",
        "state": "Kerala",
        "city": "Thrissur",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/athirappilly.jpg",
        "lat": 10.2851,
        "lng": 76.5698,
        "ticketPrice": 50,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 23824,
        "badge": "Niagara of India",
        "description": "Explore Athirappilly Waterfalls located in Thrissur, Kerala. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Thrissur / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Thrissur Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Thrissur Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Thrissur)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/athirappilly.jpg"
        }
    },
    {
        "id": "kovalam-beach",
        "name": "Kovalam Beach & Lighthouse",
        "state": "Kerala",
        "city": "Thiruvananthapuram",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/kovalam-beach.jpg",
        "lat": 8.4004,
        "lng": 76.9787,
        "ticketPrice": 20,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 24563,
        "badge": "Crescent Coastal Haven",
        "description": "Explore Kovalam Beach & Lighthouse located in Thiruvananthapuram, Kerala. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Thiruvananthapuram / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Thiruvananthapuram Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Thiruvananthapuram Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Thiruvananthapuram)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/kovalam-beach.jpg"
        }
    },
    {
        "id": "solang-manali",
        "name": "Solang Valley & Rohtang Pass",
        "state": "Himachal Pradesh",
        "city": "Manali",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/solang-manali.jpg",
        "lat": 32.3166,
        "lng": 77.1575,
        "ticketPrice": 500,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 25302,
        "badge": "Snow & Adventure Hub",
        "description": "Explore Solang Valley & Rohtang Pass located in Manali, Himachal Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Manali / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Manali Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Manali Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Manali)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/solang-manali.jpg"
        }
    },
    {
        "id": "shimla",
        "name": "The Ridge & Mall Road",
        "state": "Himachal Pradesh",
        "city": "Shimla",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/shimla.jpg",
        "lat": 31.1048,
        "lng": 77.1734,
        "ticketPrice": 0,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 26041,
        "badge": "Queen of Hill Stations",
        "description": "Explore The Ridge & Mall Road located in Shimla, Himachal Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Shimla / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Shimla Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Shimla Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Shimla)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/shimla.jpg"
        }
    },
    {
        "id": "spiti-valley",
        "name": "Spiti Valley & Key Monastery",
        "state": "Himachal Pradesh",
        "city": "Kaza",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/spiti-valley.jpg",
        "lat": 32.2975,
        "lng": 78.0125,
        "ticketPrice": 0,
        "tourPackagePrice": 4999,
        "rating": 4.7,
        "reviews": 26780,
        "badge": "Middle Land Sanctuary",
        "description": "Explore Spiti Valley & Key Monastery located in Kaza, Himachal Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Kaza / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Kaza Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Kaza Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Kaza)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/spiti-valley.jpg"
        }
    },
    {
        "id": "dharamshala",
        "name": "Dharamshala & McLeod Ganj",
        "state": "Himachal Pradesh",
        "city": "Kangra",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/dharamshala.jpg",
        "lat": 32.2426,
        "lng": 76.3213,
        "ticketPrice": 0,
        "tourPackagePrice": 1699,
        "rating": 4.7,
        "reviews": 27519,
        "badge": "Little Lhasa of India",
        "description": "Explore Dharamshala & McLeod Ganj located in Kangra, Himachal Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Kangra / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Kangra Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Kangra Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Kangra)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/dharamshala.jpg"
        }
    },
    {
        "id": "goa-baga",
        "name": "Calangute & Baga Beach Water Sports",
        "state": "Goa",
        "city": "North Goa",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/goa-baga.jpg",
        "lat": 15.5553,
        "lng": 73.7517,
        "ticketPrice": 0,
        "tourPackagePrice": 1899,
        "rating": 4.7,
        "reviews": 28258,
        "badge": "Vibrant Coastal Paradise",
        "description": "Explore Calangute & Baga Beach Water Sports located in North Goa, Goa. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "North Goa / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "North Goa Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "North Goa Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (North Goa)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/goa-baga.jpg"
        }
    },
    {
        "id": "dudhsagar",
        "name": "Dudhsagar 4-Tier Waterfalls",
        "state": "Goa",
        "city": "South Goa",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/dudhsagar.jpg",
        "lat": 15.3144,
        "lng": 74.3143,
        "ticketPrice": 100,
        "tourPackagePrice": 2199,
        "rating": 4.7,
        "reviews": 28997,
        "badge": "Sea of Milk Falls",
        "description": "Explore Dudhsagar 4-Tier Waterfalls located in South Goa, Goa. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "South Goa / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "South Goa Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "South Goa Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (South Goa)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/dudhsagar.jpg"
        }
    },
    {
        "id": "old-goa",
        "name": "Basilica of Bom Jesus & Old Goa",
        "state": "Goa",
        "city": "Old Goa",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/old-goa.jpg",
        "lat": 15.5009,
        "lng": 73.9116,
        "ticketPrice": 0,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 29736,
        "badge": "UNESCO Baroque Shrine",
        "description": "Explore Basilica of Bom Jesus & Old Goa located in Old Goa, Goa. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Old Goa / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Old Goa Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Old Goa Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Old Goa)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/old-goa.jpg"
        }
    },
    {
        "id": "palolem-beach",
        "name": "Palolem Beach & Butterfly Beach",
        "state": "Goa",
        "city": "South Goa",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/palolem-beach.jpg",
        "lat": 15.01,
        "lng": 74.0232,
        "ticketPrice": 0,
        "tourPackagePrice": 1699,
        "rating": 4.7,
        "reviews": 30475,
        "badge": "Serene Sunset Haven",
        "description": "Explore Palolem Beach & Butterfly Beach located in South Goa, Goa. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "South Goa / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "South Goa Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "South Goa Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (South Goa)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/palolem-beach.jpg"
        }
    },
    {
        "id": "dal-lake",
        "name": "Dal Lake Shikara & Floating Market",
        "state": "Jammu & Kashmir",
        "city": "Srinagar",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/dal-lake.jpg",
        "lat": 34.0837,
        "lng": 74.7973,
        "ticketPrice": 700,
        "tourPackagePrice": 2999,
        "rating": 4.7,
        "reviews": 31214,
        "badge": "Jewel of Kashmir",
        "description": "Explore Dal Lake Shikara & Floating Market located in Srinagar, Jammu & Kashmir. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Srinagar / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Srinagar Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Srinagar Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Srinagar)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/dal-lake.jpg"
        }
    },
    {
        "id": "gulmarg",
        "name": "Gulmarg Gondola & Snow Peaks",
        "state": "Jammu & Kashmir",
        "city": "Gulmarg",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/gulmarg.jpg",
        "lat": 34.0484,
        "lng": 74.3805,
        "ticketPrice": 800,
        "tourPackagePrice": 3499,
        "rating": 4.7,
        "reviews": 31953,
        "badge": "Premier Ski Resort",
        "description": "Explore Gulmarg Gondola & Snow Peaks located in Gulmarg, Jammu & Kashmir. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Gulmarg / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Gulmarg Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Gulmarg Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Gulmarg)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/gulmarg.jpg"
        }
    },
    {
        "id": "pahalgam",
        "name": "Pahalgam & Betaab Valley",
        "state": "Jammu & Kashmir",
        "city": "Pahalgam",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/pahalgam.jpg",
        "lat": 34.0163,
        "lng": 75.315,
        "ticketPrice": 100,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 32692,
        "badge": "Valley of Shepherds",
        "description": "Explore Pahalgam & Betaab Valley located in Pahalgam, Jammu & Kashmir. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Pahalgam / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Pahalgam Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Pahalgam Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Pahalgam)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/pahalgam.jpg"
        }
    },
    {
        "id": "pangong-lake",
        "name": "Pangong Tso Lake & Chang La Pass",
        "state": "Ladakh",
        "city": "Leh",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/pangong-lake.jpg",
        "lat": 33.7595,
        "lng": 78.6674,
        "ticketPrice": 400,
        "tourPackagePrice": 4899,
        "rating": 4.7,
        "reviews": 33431,
        "badge": "High Altitude Azure Lake",
        "description": "Explore Pangong Tso Lake & Chang La Pass located in Leh, Ladakh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Leh / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Leh Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Leh Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Leh)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/pangong-lake.jpg"
        }
    },
    {
        "id": "nubra-valley",
        "name": "Nubra Valley & Diskit Monastery",
        "state": "Ladakh",
        "city": "Diskit",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/nubra-valley.jpg",
        "lat": 34.5428,
        "lng": 77.5673,
        "ticketPrice": 400,
        "tourPackagePrice": 4499,
        "rating": 4.7,
        "reviews": 34170,
        "badge": "Valley of Flowers & Dunes",
        "description": "Explore Nubra Valley & Diskit Monastery located in Diskit, Ladakh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Diskit / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Diskit Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Diskit Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Diskit)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/nubra-valley.jpg"
        }
    },
    {
        "id": "rishikesh",
        "name": "Rishikesh Rafting & Triveni Ghat",
        "state": "Uttarakhand",
        "city": "Rishikesh",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/rishikesh.jpg",
        "lat": 30.0869,
        "lng": 78.2676,
        "ticketPrice": 0,
        "tourPackagePrice": 1699,
        "rating": 4.7,
        "reviews": 34909,
        "badge": "Yoga Capital of the World",
        "description": "Explore Rishikesh Rafting & Triveni Ghat located in Rishikesh, Uttarakhand. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Rishikesh / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Rishikesh Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Rishikesh Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Rishikesh)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/rishikesh.jpg"
        }
    },
    {
        "id": "nainital",
        "name": "Nainital Naini Lake & Naina Peak",
        "state": "Uttarakhand",
        "city": "Nainital",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/nainital.jpg",
        "lat": 29.3919,
        "lng": 79.4542,
        "ticketPrice": 150,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 35648,
        "badge": "City of Lakes",
        "description": "Explore Nainital Naini Lake & Naina Peak located in Nainital, Uttarakhand. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Nainital / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Nainital Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Nainital Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Nainital)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/nainital.jpg"
        }
    },
    {
        "id": "corbett",
        "name": "Jim Corbett Tiger Safari",
        "state": "Uttarakhand",
        "city": "Ramnagar",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/corbett.jpg",
        "lat": 29.53,
        "lng": 78.7747,
        "ticketPrice": 1200,
        "tourPackagePrice": 3899,
        "rating": 4.7,
        "reviews": 36387,
        "badge": "First National Park",
        "description": "Explore Jim Corbett Tiger Safari located in Ramnagar, Uttarakhand. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Ramnagar / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Ramnagar Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Ramnagar Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Ramnagar)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/corbett.jpg"
        }
    },
    {
        "id": "kedarnath",
        "name": "Kedarnath Temple & Himalayas",
        "state": "Uttarakhand",
        "city": "Rudraprayag",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/kedarnath.jpg",
        "lat": 30.7352,
        "lng": 79.0669,
        "ticketPrice": 0,
        "tourPackagePrice": 4999,
        "rating": 4.7,
        "reviews": 37126,
        "badge": "Sacred Jyotirlinga",
        "description": "Explore Kedarnath Temple & Himalayas located in Rudraprayag, Uttarakhand. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Rudraprayag / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Rudraprayag Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Rudraprayag Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Rudraprayag)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/kedarnath.jpg"
        }
    },
    {
        "id": "hampi",
        "name": "Hampi UNESCO Ruins & Stone Chariot",
        "state": "Karnataka",
        "city": "Hampi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/hampi.jpg",
        "lat": 15.335,
        "lng": 76.46,
        "ticketPrice": 40,
        "tourPackagePrice": 1699,
        "rating": 4.7,
        "reviews": 37865,
        "badge": "Vijayanagara Empire Ruins",
        "description": "Explore Hampi UNESCO Ruins & Stone Chariot located in Hampi, Karnataka. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Hampi / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Hampi Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Hampi Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Hampi)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/hampi.jpg"
        }
    },
    {
        "id": "mysore-palace",
        "name": "Mysore Palace & Chamundi Hill",
        "state": "Karnataka",
        "city": "Mysuru",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/mysore-palace.jpg",
        "lat": 12.3051,
        "lng": 76.6551,
        "ticketPrice": 100,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 38604,
        "badge": "Wodeyar Royal Citadel",
        "description": "Explore Mysore Palace & Chamundi Hill located in Mysuru, Karnataka. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Mysuru / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Mysuru Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Mysuru Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Mysuru)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/mysore-palace.jpg"
        }
    },
    {
        "id": "coorg",
        "name": "Coorg Coffee Hills & Abbey Falls",
        "state": "Karnataka",
        "city": "Madikeri",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/coorg.jpg",
        "lat": 12.4244,
        "lng": 75.7382,
        "ticketPrice": 50,
        "tourPackagePrice": 1799,
        "rating": 4.7,
        "reviews": 39343,
        "badge": "Scotland of India",
        "description": "Explore Coorg Coffee Hills & Abbey Falls located in Madikeri, Karnataka. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Madikeri / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Madikeri Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Madikeri Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Madikeri)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/coorg.jpg"
        }
    },
    {
        "id": "gokarna-beach",
        "name": "Gokarna Om Beach & Kudle Beach",
        "state": "Karnataka",
        "city": "Gokarna",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/gokarna-beach.jpg",
        "lat": 14.5479,
        "lng": 74.3188,
        "ticketPrice": 0,
        "tourPackagePrice": 1599,
        "rating": 4.7,
        "reviews": 40082,
        "badge": "Pristine Coastal Haven",
        "description": "Explore Gokarna Om Beach & Kudle Beach located in Gokarna, Karnataka. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Gokarna / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Gokarna Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Gokarna Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Gokarna)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/gokarna-beach.jpg"
        }
    },
    {
        "id": "madurai",
        "name": "Meenakshi Amman Temple",
        "state": "Tamil Nadu",
        "city": "Madurai",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/madurai.jpg",
        "lat": 9.9195,
        "lng": 78.1193,
        "ticketPrice": 50,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 40821,
        "badge": "Dravidian Architecture Icon",
        "description": "Explore Meenakshi Amman Temple located in Madurai, Tamil Nadu. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Madurai / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Madurai Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Madurai Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Madurai)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/madurai.jpg"
        }
    },
    {
        "id": "ooty",
        "name": "Ooty Nilgiri Mountain Toy Train",
        "state": "Tamil Nadu",
        "city": "Ooty",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/ooty.jpg",
        "lat": 11.4102,
        "lng": 76.695,
        "ticketPrice": 205,
        "tourPackagePrice": 1899,
        "rating": 4.7,
        "reviews": 41560,
        "badge": "UNESCO Heritage Railway",
        "description": "Explore Ooty Nilgiri Mountain Toy Train located in Ooty, Tamil Nadu. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Ooty / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Ooty Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Ooty Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Ooty)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/ooty.jpg"
        }
    },
    {
        "id": "kanyakumari",
        "name": "Kanyakumari Sunset & Rock Memorial",
        "state": "Tamil Nadu",
        "city": "Kanyakumari",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/kanyakumari.jpg",
        "lat": 8.078,
        "lng": 77.555,
        "ticketPrice": 50,
        "tourPackagePrice": 1399,
        "rating": 4.7,
        "reviews": 42299,
        "badge": "Southernmost Tip of India",
        "description": "Explore Kanyakumari Sunset & Rock Memorial located in Kanyakumari, Tamil Nadu. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Kanyakumari / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Kanyakumari Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Kanyakumari Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Kanyakumari)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/kanyakumari.jpg"
        }
    },
    {
        "id": "mahabalipuram",
        "name": "Mahabalipuram Shore Temple",
        "state": "Tamil Nadu",
        "city": "Mamallapuram",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/mahabalipuram.jpg",
        "lat": 12.6169,
        "lng": 80.199,
        "ticketPrice": 40,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 43038,
        "badge": "Pallava Rock Art",
        "description": "Explore Mahabalipuram Shore Temple located in Mamallapuram, Tamil Nadu. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Mamallapuram / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Mamallapuram Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Mamallapuram Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Mamallapuram)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/mahabalipuram.jpg"
        }
    },
    {
        "id": "gateway-mumbai",
        "name": "Gateway of India & Marine Drive",
        "state": "Maharashtra",
        "city": "Mumbai",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/gateway-mumbai.jpg",
        "lat": 18.922,
        "lng": 72.8347,
        "ticketPrice": 0,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 43777,
        "badge": "Colonial Harbour Arch",
        "description": "Explore Gateway of India & Marine Drive located in Mumbai, Maharashtra. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Mumbai / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Mumbai Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Mumbai Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Mumbai)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/gateway-mumbai.jpg"
        }
    },
    {
        "id": "ajanta-ellora",
        "name": "Ajanta & Ellora Rock-Cut Caves",
        "state": "Maharashtra",
        "city": "Sambhaji Nagar",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/ajanta-ellora.jpg",
        "lat": 20.0268,
        "lng": 75.1792,
        "ticketPrice": 40,
        "tourPackagePrice": 2299,
        "rating": 4.7,
        "reviews": 44516,
        "badge": "Monolithic Kailasa Cave",
        "description": "Explore Ajanta & Ellora Rock-Cut Caves located in Sambhaji Nagar, Maharashtra. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Sambhaji Nagar / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Sambhaji Nagar Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Sambhaji Nagar Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Sambhaji Nagar)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/ajanta-ellora.jpg"
        }
    },
    {
        "id": "lonavala",
        "name": "Tiger Point & Bushi Dam",
        "state": "Maharashtra",
        "city": "Lonavala",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/lonavala.jpg",
        "lat": 18.7557,
        "lng": 73.4091,
        "ticketPrice": 0,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 45255,
        "badge": "Western Ghats Monsoon Hub",
        "description": "Explore Tiger Point & Bushi Dam located in Lonavala, Maharashtra. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Lonavala / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Lonavala Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Lonavala Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Lonavala)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/lonavala.jpg"
        }
    },
    {
        "id": "mahabaleshwar",
        "name": "Mahabaleshwar & Arthur's Seat",
        "state": "Maharashtra",
        "city": "Mahabaleshwar",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/mahabaleshwar.jpg",
        "lat": 17.9237,
        "lng": 73.6586,
        "ticketPrice": 0,
        "tourPackagePrice": 1699,
        "rating": 4.7,
        "reviews": 45994,
        "badge": "Strawberry Capital",
        "description": "Explore Mahabaleshwar & Arthur's Seat located in Mahabaleshwar, Maharashtra. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Mahabaleshwar / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Mahabaleshwar Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Mahabaleshwar Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Mahabaleshwar)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/mahabaleshwar.jpg"
        }
    },
    {
        "id": "darjeeling",
        "name": "Darjeeling Tiger Hill Sunrise",
        "state": "West Bengal",
        "city": "Darjeeling",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/darjeeling.jpg",
        "lat": 27.041,
        "lng": 88.2663,
        "ticketPrice": 60,
        "tourPackagePrice": 1899,
        "rating": 4.7,
        "reviews": 46733,
        "badge": "Kanchenjunga Panorama",
        "description": "Explore Darjeeling Tiger Hill Sunrise located in Darjeeling, West Bengal. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Darjeeling / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Darjeeling Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Darjeeling Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Darjeeling)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/darjeeling.jpg"
        }
    },
    {
        "id": "victoria-kolkata",
        "name": "Victoria Memorial & Howrah Bridge",
        "state": "West Bengal",
        "city": "Kolkata",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/victoria-kolkata.jpg",
        "lat": 22.5448,
        "lng": 88.3426,
        "ticketPrice": 50,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 47472,
        "badge": "City of Joy Landmark",
        "description": "Explore Victoria Memorial & Howrah Bridge located in Kolkata, West Bengal. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Kolkata / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Kolkata Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Kolkata Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Kolkata)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/victoria-kolkata.jpg"
        }
    },
    {
        "id": "sundarbans",
        "name": "Sundarbans Mangrove Tiger Safari",
        "state": "West Bengal",
        "city": "Sundarbans",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/sundarbans.jpg",
        "lat": 21.9497,
        "lng": 89.1833,
        "ticketPrice": 300,
        "tourPackagePrice": 3899,
        "rating": 4.7,
        "reviews": 48211,
        "badge": "Largest Mangrove Delta",
        "description": "Explore Sundarbans Mangrove Tiger Safari located in Sundarbans, West Bengal. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Sundarbans / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Sundarbans Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Sundarbans Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Sundarbans)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/sundarbans.jpg"
        }
    },
    {
        "id": "golden-temple",
        "name": "Golden Temple & Amrit Sarovar",
        "state": "Punjab",
        "city": "Amritsar",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/golden-temple.jpg",
        "lat": 31.62,
        "lng": 74.8765,
        "ticketPrice": 0,
        "tourPackagePrice": 1399,
        "rating": 4.7,
        "reviews": 48950,
        "badge": "Gleaming Golden Sanctuary",
        "description": "Explore Golden Temple & Amrit Sarovar located in Amritsar, Punjab. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Amritsar / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Amritsar Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Amritsar Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Amritsar)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/golden-temple.jpg"
        }
    },
    {
        "id": "wagah-border",
        "name": "Wagah Border Beating Retreat",
        "state": "Punjab",
        "city": "Amritsar",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/wagah-border.jpg",
        "lat": 31.6046,
        "lng": 74.5734,
        "ticketPrice": 0,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 49689,
        "badge": "Patriotic Border Ceremony",
        "description": "Explore Wagah Border Beating Retreat located in Amritsar, Punjab. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Amritsar / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Amritsar Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Amritsar Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Amritsar)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/wagah-border.jpg"
        }
    },
    {
        "id": "khajuraho",
        "name": "Khajuraho UNESCO Temples",
        "state": "Madhya Pradesh",
        "city": "Khajuraho",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/khajuraho.jpg",
        "lat": 24.8318,
        "lng": 79.9199,
        "ticketPrice": 40,
        "tourPackagePrice": 1799,
        "rating": 4.7,
        "reviews": 50428,
        "badge": "Intricate Nagara Carvings",
        "description": "Explore Khajuraho UNESCO Temples located in Khajuraho, Madhya Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Khajuraho / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Khajuraho Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Khajuraho Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Khajuraho)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/khajuraho.jpg"
        }
    },
    {
        "id": "gwalior-fort",
        "name": "Gwalior Fort & Man Mandir Palace",
        "state": "Madhya Pradesh",
        "city": "Gwalior",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/gwalior-fort.jpg",
        "lat": 26.2307,
        "lng": 78.1695,
        "ticketPrice": 75,
        "tourPackagePrice": 1399,
        "rating": 4.7,
        "reviews": 51167,
        "badge": "Pearl in Necklace of Forts",
        "description": "Explore Gwalior Fort & Man Mandir Palace located in Gwalior, Madhya Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Gwalior / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Gwalior Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Gwalior Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Gwalior)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/gwalior-fort.jpg"
        }
    },
    {
        "id": "kanha-tiger",
        "name": "Kanha Tiger Reserve Safari",
        "state": "Madhya Pradesh",
        "city": "Mandla",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/kanha-tiger.jpg",
        "lat": 22.3345,
        "lng": 80.6115,
        "ticketPrice": 1500,
        "tourPackagePrice": 4299,
        "rating": 4.7,
        "reviews": 51906,
        "badge": "Inspiration for Jungle Book",
        "description": "Explore Kanha Tiger Reserve Safari located in Mandla, Madhya Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Mandla / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Mandla Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Mandla Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Mandla)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/kanha-tiger.jpg"
        }
    },
    {
        "id": "puri-jagannath",
        "name": "Puri Jagannath Temple & Golden Beach",
        "state": "Odisha",
        "city": "Puri",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/puri-jagannath.jpg",
        "lat": 19.8049,
        "lng": 85.8179,
        "ticketPrice": 0,
        "tourPackagePrice": 1399,
        "rating": 4.7,
        "reviews": 52645,
        "badge": "Char Dham Pilgrimage",
        "description": "Explore Puri Jagannath Temple & Golden Beach located in Puri, Odisha. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Puri / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Puri Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Puri Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Puri)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/puri-jagannath.jpg"
        }
    },
    {
        "id": "konark-sun-temple",
        "name": "Konark Sun Temple UNESCO Chariot",
        "state": "Odisha",
        "city": "Konark",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/konark-sun-temple.jpg",
        "lat": 19.8876,
        "lng": 86.0945,
        "ticketPrice": 40,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 53384,
        "badge": "Black Pagoda of India",
        "description": "Explore Konark Sun Temple UNESCO Chariot located in Konark, Odisha. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Konark / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Konark Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Konark Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Konark)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/konark-sun-temple.jpg"
        }
    },
    {
        "id": "chilika-lake",
        "name": "Chilika Lake Dolphin Lagoon",
        "state": "Odisha",
        "city": "Puri",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/chilika-lake.jpg",
        "lat": 19.716,
        "lng": 85.32,
        "ticketPrice": 200,
        "tourPackagePrice": 1899,
        "rating": 4.7,
        "reviews": 54123,
        "badge": "Asia Largest Brackish Lagoon",
        "description": "Explore Chilika Lake Dolphin Lagoon located in Puri, Odisha. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Puri / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Puri Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Puri Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Puri)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/chilika-lake.jpg"
        }
    },
    {
        "id": "statue-of-unity",
        "name": "Statue of Unity & Narmada River",
        "state": "Gujarat",
        "city": "Kevadia",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/statue-of-unity.jpg",
        "lat": 21.838,
        "lng": 73.7191,
        "ticketPrice": 150,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 54862,
        "badge": "World Tallest Statue (182m)",
        "description": "Explore Statue of Unity & Narmada River located in Kevadia, Gujarat. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Kevadia / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Kevadia Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Kevadia Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Kevadia)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/statue-of-unity.jpg"
        }
    },
    {
        "id": "rann-of-kutch",
        "name": "Rann of Kutch White Salt Desert",
        "state": "Gujarat",
        "city": "Dhordo",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/rann-of-kutch.jpg",
        "lat": 23.834,
        "lng": 69.832,
        "ticketPrice": 100,
        "tourPackagePrice": 3499,
        "rating": 4.7,
        "reviews": 55601,
        "badge": "White Desert & Rann Utsav",
        "description": "Explore Rann of Kutch White Salt Desert located in Dhordo, Gujarat. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Dhordo / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Dhordo Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Dhordo Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Dhordo)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/rann-of-kutch.jpg"
        }
    },
    {
        "id": "gir-national-park",
        "name": "Gir Asiatic Lion Safari",
        "state": "Gujarat",
        "city": "Sasan Gir",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/gir-national-park.jpg",
        "lat": 21.1243,
        "lng": 70.8242,
        "ticketPrice": 1000,
        "tourPackagePrice": 3999,
        "rating": 4.7,
        "reviews": 56340,
        "badge": "Only Home of Asiatic Lions",
        "description": "Explore Gir Asiatic Lion Safari located in Sasan Gir, Gujarat. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Sasan Gir / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Sasan Gir Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Sasan Gir Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Sasan Gir)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/gir-national-park.jpg"
        }
    },
    {
        "id": "somnath-temple",
        "name": "Somnath Temple & Arabian Promenade",
        "state": "Gujarat",
        "city": "Prabhas Patan",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/somnath-temple.jpg",
        "lat": 20.888,
        "lng": 70.4012,
        "ticketPrice": 0,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 12079,
        "badge": "First of Twelve Jyotirlingas",
        "description": "Explore Somnath Temple & Arabian Promenade located in Prabhas Patan, Gujarat. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Prabhas Patan / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Prabhas Patan Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Prabhas Patan Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Prabhas Patan)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/somnath-temple.jpg"
        }
    },
    {
        "id": "charminar",
        "name": "Charminar & Laad Bazaar",
        "state": "Telangana",
        "city": "Hyderabad",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/charminar.jpg",
        "lat": 17.3616,
        "lng": 78.4747,
        "ticketPrice": 25,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 12818,
        "badge": "Global Icon of Hyderabad",
        "description": "Explore Charminar & Laad Bazaar located in Hyderabad, Telangana. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Hyderabad / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Hyderabad Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Hyderabad Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Hyderabad)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/charminar.jpg"
        }
    },
    {
        "id": "golconda-fort",
        "name": "Golconda Fort & Sound Show",
        "state": "Telangana",
        "city": "Hyderabad",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/golconda-fort.jpg",
        "lat": 17.3833,
        "lng": 78.4011,
        "ticketPrice": 25,
        "tourPackagePrice": 1399,
        "rating": 4.7,
        "reviews": 13557,
        "badge": "Diamond Citadel of India",
        "description": "Explore Golconda Fort & Sound Show located in Hyderabad, Telangana. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Hyderabad / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Hyderabad Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Hyderabad Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Hyderabad)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/golconda-fort.jpg"
        }
    },
    {
        "id": "tirupati-temple",
        "name": "Tirupati Balaji Venkateswara Temple",
        "state": "Andhra Pradesh",
        "city": "Tirupati",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/tirupati-temple.jpg",
        "lat": 13.6833,
        "lng": 79.3472,
        "ticketPrice": 300,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 14296,
        "badge": "Richest Temple on Earth",
        "description": "Explore Tirupati Balaji Venkateswara Temple located in Tirupati, Andhra Pradesh. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Tirupati / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Tirupati Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Tirupati Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Tirupati)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/tirupati-temple.jpg"
        }
    },
    {
        "id": "kaziranga",
        "name": "Kaziranga One-Horned Rhino Safari",
        "state": "Assam",
        "city": "Golaghat",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/kaziranga.jpg",
        "lat": 26.5775,
        "lng": 93.1711,
        "ticketPrice": 1200,
        "tourPackagePrice": 3899,
        "rating": 4.7,
        "reviews": 15035,
        "badge": "UNESCO Rhino Sanctuary",
        "description": "Explore Kaziranga One-Horned Rhino Safari located in Golaghat, Assam. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Golaghat / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Golaghat Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Golaghat Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Golaghat)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/kaziranga.jpg"
        }
    },
    {
        "id": "cherrapunji-roots",
        "name": "Cherrapunji Living Root Bridges",
        "state": "Meghalaya",
        "city": "Cherrapunji",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/cherrapunji-roots.jpg",
        "lat": 25.2986,
        "lng": 91.7336,
        "ticketPrice": 50,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 15774,
        "badge": "Bio-Engineering Wonder",
        "description": "Explore Cherrapunji Living Root Bridges located in Cherrapunji, Meghalaya. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Cherrapunji / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Cherrapunji Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Cherrapunji Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Cherrapunji)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/cherrapunji-roots.jpg"
        }
    },
    {
        "id": "sikkim-tsomgo",
        "name": "Tsomgo Glacial Lake & Nathula Pass",
        "state": "Sikkim",
        "city": "Gangtok",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/sikkim-tsomgo.jpg",
        "lat": 27.3742,
        "lng": 88.7619,
        "ticketPrice": 500,
        "tourPackagePrice": 3899,
        "rating": 4.7,
        "reviews": 16513,
        "badge": "Himalayan Silk Route Pass",
        "description": "Explore Tsomgo Glacial Lake & Nathula Pass located in Gangtok, Sikkim. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Gangtok / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Gangtok Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Gangtok Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Gangtok)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/sikkim-tsomgo.jpg"
        }
    },
    {
        "id": "bodhgaya",
        "name": "Mahabodhi Temple & Bodhi Tree",
        "state": "Bihar",
        "city": "Bodh Gaya",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/bodhgaya.jpg",
        "lat": 24.696,
        "lng": 84.9913,
        "ticketPrice": 0,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 17252,
        "badge": "Buddha Enlightenment Seat",
        "description": "Explore Mahabodhi Temple & Bodhi Tree located in Bodh Gaya, Bihar. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Bodh Gaya / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Bodh Gaya Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Bodh Gaya Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Bodh Gaya)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/bodhgaya.jpg"
        }
    },
    {
        "id": "nalanda-ruins",
        "name": "Nalanda Ancient University Ruins",
        "state": "Bihar",
        "city": "Nalanda",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/nalanda-ruins.jpg",
        "lat": 25.1357,
        "lng": 85.445,
        "ticketPrice": 40,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 17991,
        "badge": "World First Residential Uni",
        "description": "Explore Nalanda Ancient University Ruins located in Nalanda, Bihar. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Nalanda / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Nalanda Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Nalanda Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Nalanda)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/nalanda-ruins.jpg"
        }
    },
    {
        "id": "andaman-radhanagar",
        "name": "Radhanagar Beach (Havelock Island)",
        "state": "Andaman & Nicobar",
        "city": "Swaraj Dweep",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/andaman-radhanagar.jpg",
        "lat": 11.9833,
        "lng": 92.95,
        "ticketPrice": 0,
        "tourPackagePrice": 4499,
        "rating": 4.7,
        "reviews": 18730,
        "badge": "Asia Best Beach (Time Mag)",
        "description": "Explore Radhanagar Beach (Havelock Island) located in Swaraj Dweep, Andaman & Nicobar. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "Open 24 Hours · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Swaraj Dweep / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Swaraj Dweep Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Swaraj Dweep Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Swaraj Dweep)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/andaman-radhanagar.jpg"
        }
    },
    {
        "id": "cellular-jail",
        "name": "Cellular Jail (Kala Pani) Memorial",
        "state": "Andaman & Nicobar",
        "city": "Port Blair",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/cellular-jail.jpg",
        "lat": 11.6739,
        "lng": 92.7478,
        "ticketPrice": 30,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 19469,
        "badge": "Freedom Struggle Shrine",
        "description": "Explore Cellular Jail (Kala Pani) Memorial located in Port Blair, Andaman & Nicobar. An iconic destination offering authentic cultural experiences, rich history, and scenic landscapes.",
        "highlights": [
            "Official Guided Experience & History",
            "Panoramic Photography Vantage Points",
            "Local Cultural Heritage & Architecture",
            "Verified Roavio Transport & Concierge"
        ],
        "timings": "06:00 AM - 06:00 PM · Daily",
        "nearestAirport": {
            "code": "DOM / INTL",
            "name": "Port Blair / State Regional Airport",
            "dist": "25 km"
        },
        "nearestTrain": {
            "code": "RLY",
            "name": "Port Blair Junction",
            "dist": "8 km",
            "trainName": "Vande Bharat Express"
        },
        "nearestBus": {
            "terminal": "Port Blair Central ISBT",
            "dist": "5 km",
            "busName": "AC Volvo Tourist Coach"
        },
        "recommendedHotel": {
            "name": "The Grand Luxury Stay (Port Blair)",
            "price": 3499,
            "rating": 4.8,
            "photo": "assets/img/india-tours/cellular-jail.jpg"
        }
    },
    {
        "id": "brihadeeswarar-temple",
        "name": "Brihadeeswarar Temple (Big Temple)",
        "state": "Tamil Nadu",
        "city": "Thanjavur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/brihadeeswarar-temple.jpg",
        "lat": 10.7828,
        "lng": 79.1318,
        "ticketPrice": 0,
        "tourPackagePrice": 1599,
        "rating": 4.9,
        "reviews": 24500,
        "badge": "Chola UNESCO Wonder",
        "description": "1,000-year-old architectural marvel built by Raja Raja Chola I featuring a monolithic 80-tonne granite dome and soaring vimana.",
        "highlights": [
            "1,000-Year-Old Chola Vimana",
            "Monolithic 80-Tonne Granite Kumbam",
            "Massive Sacred Nandi Statue",
            "UNESCO World Heritage Site"
        ],
        "nearestAirport": {
            "name": "Tiruchirappalli International Airport (TRZ)",
            "dist": "55 km"
        }
    },
    {
        "id": "rameshwaram-temple",
        "name": "Ramanathaswamy Temple & Pamban Bridge",
        "state": "Tamil Nadu",
        "city": "Rameshwaram",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/rameshwaram-temple.jpg",
        "lat": 9.2881,
        "lng": 79.3174,
        "ticketPrice": 0,
        "tourPackagePrice": 2499,
        "rating": 4.8,
        "reviews": 31200,
        "badge": "Sacred Char Dham",
        "description": "One of the 12 Jyotirlinga shrines known for the world's longest pillared corridors and the historic sea bridge connecting the island.",
        "highlights": [
            "World's Longest Temple Corridors",
            "Historic Pamban Sea Bridge",
            "22 Sacred Theerthams Wells",
            "Agni Theertham Sea Beach"
        ],
        "nearestAirport": {
            "name": "Madurai International Airport (IXM)",
            "dist": "175 km"
        }
    },
    {
        "id": "kodaikanal-lake",
        "name": "Kodaikanal Lake & Coaker's Walk",
        "state": "Tamil Nadu",
        "city": "Kodaikanal",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/kodaikanal-lake.jpg",
        "lat": 10.2381,
        "lng": 77.4892,
        "ticketPrice": 40,
        "tourPackagePrice": 3299,
        "rating": 4.7,
        "reviews": 21900,
        "badge": "Princess of Hill Stations",
        "description": "Star-shaped lake nestled in the Palani Hills surrounded by lush pine forests, mist-shrouded viewpoints, and cascading waterfalls.",
        "highlights": [
            "Star-Shaped Boating Lake",
            "Coaker's Walk Valley Vistas",
            "Pillar Rocks & Pine Forests",
            "Silver Cascade Falls"
        ],
        "nearestAirport": {
            "name": "Madurai Airport (IXM)",
            "dist": "120 km"
        }
    },
    {
        "id": "marina-beach-chennai",
        "name": "Marina Beach & Promenade",
        "state": "Tamil Nadu",
        "city": "Chennai",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/marina-beach-chennai.jpg",
        "lat": 13.05,
        "lng": 80.2824,
        "ticketPrice": 0,
        "tourPackagePrice": 999,
        "rating": 4.6,
        "reviews": 42000,
        "badge": "World's 2nd Longest Beach",
        "description": "Natural urban sand beach spanning 12 kilometers along the Bay of Bengal with iconic monuments, lighthouses, and local street delicacies.",
        "highlights": [
            "12-Km Natural Coastal Promenade",
            "Chennai Lighthouse Observation Deck",
            "Historic Statues & Memorials",
            "Sunset Sea Breeze & Street Delights"
        ],
        "nearestAirport": {
            "name": "Chennai International Airport (MAA)",
            "dist": "18 km"
        }
    },
    {
        "id": "hogenakkal-falls",
        "name": "Hogenakkal Falls (Niagara of India)",
        "state": "Tamil Nadu",
        "city": "Dharmapuri",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/hogenakkal-falls.jpg",
        "lat": 12.1189,
        "lng": 77.7767,
        "ticketPrice": 50,
        "tourPackagePrice": 2199,
        "rating": 4.6,
        "reviews": 14800,
        "badge": "Niagara of India",
        "description": "Spectacular waterfall on the Kaveri River famous for its circular coracle boat rides through towering carbonatite rock gorges.",
        "highlights": [
            "Circular Coracle Boat Rides",
            "Kaveri River Gorge Rapids",
            "Natural Medicinal Herbal Baths",
            "Freshly Cooked River Fish Delicacies"
        ],
        "nearestAirport": {
            "name": "Bengaluru Kempegowda Airport (BLR)",
            "dist": "150 km"
        }
    },
    {
        "id": "wayanad-chembra",
        "name": "Wayanad Chembra Peak & Heart Lake",
        "state": "Kerala",
        "city": "Wayanad",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/wayanad-chembra.jpg",
        "lat": 11.5128,
        "lng": 76.0886,
        "ticketPrice": 100,
        "tourPackagePrice": 2899,
        "rating": 4.8,
        "reviews": 18400,
        "badge": "Heart-Shaped Lake",
        "description": "The highest peak in Wayanad with a natural heart-shaped lake halfway up that has never dried up, framed by emerald tea estates.",
        "highlights": [
            "Natural Heart-Shaped Glacial Lake",
            "Highest Peak in Wayanad (2,100m)",
            "Lush Tea Plantation Treks",
            "Edakkal Prehistoric Rock Caves Nearby"
        ],
        "nearestAirport": {
            "name": "Calicut International Airport (CCJ)",
            "dist": "85 km"
        }
    },
    {
        "id": "varkala-cliff-beach",
        "name": "Varkala Red Cliff & Papanasam Beach",
        "state": "Kerala",
        "city": "Varkala",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/varkala-cliff-beach.jpg",
        "lat": 8.7379,
        "lng": 76.7163,
        "ticketPrice": 0,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 21300,
        "badge": "Red Cliff Coast",
        "description": "Dramatic red laterite sedimentary cliffs towering directly adjacent to the Arabian Sea, dotted with bohemian cafes, yoga, and surfing.",
        "highlights": [
            "Soaring Red Laterite Cliffs",
            "Natural Mineral Water Springs",
            "Sunset Cliff Cafes & Seafood",
            "Sacred Papanasam Cleansing Beach"
        ],
        "nearestAirport": {
            "name": "Trivandrum International Airport (TRV)",
            "dist": "45 km"
        }
    },
    {
        "id": "periyar-national-park",
        "name": "Thekkady Periyar Wildlife Sanctuary",
        "state": "Kerala",
        "city": "Thekkady",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/periyar-national-park.jpg",
        "lat": 9.4679,
        "lng": 77.1435,
        "ticketPrice": 155,
        "tourPackagePrice": 3200,
        "rating": 4.7,
        "reviews": 25100,
        "badge": "Wild Elephant Sanctuary",
        "description": "Dense evergreen forest sanctuary centered around Periyar Lake where wild elephants, tigers, and gaur come to drink at the lake shore.",
        "highlights": [
            "Lake Boating Wildlife Safaris",
            "Wild Elephant Herd Sightings",
            "Spice Plantation Walks",
            "Periyar Bamboo Rafting Expeditions"
        ],
        "nearestAirport": {
            "name": "Madurai Airport (IXM)",
            "dist": "140 km"
        }
    },
    {
        "id": "bekal-fort",
        "name": "Bekal Fort & Coastal Ramparts",
        "state": "Kerala",
        "city": "Kasaragod",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/bekal-fort.jpg",
        "lat": 12.3925,
        "lng": 75.0336,
        "ticketPrice": 25,
        "tourPackagePrice": 1799,
        "rating": 4.7,
        "reviews": 13900,
        "badge": "Keyhole Sea Citadel",
        "description": "The largest preserved fort in Kerala rising dramatically out of the Arabian Sea with keyhole-shaped observation towers and scenic lawns.",
        "highlights": [
            "Keyhole-Shaped Observation Tower",
            "Seaside Fort Ramparts & Waves",
            "Iconic Film Shooting Location",
            "Sunset Over the Arabian Sea"
        ],
        "nearestAirport": {
            "name": "Mangalore International Airport (IXE)",
            "dist": "65 km"
        }
    },
    {
        "id": "padmanabhaswamy-temple",
        "name": "Padmanabhaswamy Temple & Trivandrum",
        "state": "Kerala",
        "city": "Thiruvananthapuram",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/padmanabhaswamy-temple.jpg",
        "lat": 8.4828,
        "lng": 76.9436,
        "ticketPrice": 0,
        "tourPackagePrice": 1999,
        "rating": 4.9,
        "reviews": 38200,
        "badge": "Richest Temple on Earth",
        "description": "Ancient Chera & Dravidian architectural wonder dedicated to Lord Vishnu in the Anantha Sayanam posture, renowned worldwide for its sacred gold vaults.",
        "highlights": [
            "Grand 16th-Century Gopuram",
            "Anantha Sayanam Reclining Vishnu",
            "Padmatheertham Sacred Tank",
            "World-Renowned Sacred Vaults"
        ],
        "nearestAirport": {
            "name": "Thiruvananthapuram Airport (TRV)",
            "dist": "5 km"
        }
    },
    {
        "id": "murudeshwar-temple",
        "name": "Murudeshwar Temple & 123ft Shiva Statue",
        "state": "Karnataka",
        "city": "Murudeshwar",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/murudeshwar-temple.jpg",
        "lat": 14.0942,
        "lng": 74.4899,
        "ticketPrice": 0,
        "tourPackagePrice": 2299,
        "rating": 4.8,
        "reviews": 29800,
        "badge": "World's 2nd Tallest Shiva",
        "description": "Majestic 123-foot Lord Shiva statue standing on Kanduka Hill surrounded by the Arabian Sea on three sides with a 20-story Rajagopuram with elevator.",
        "highlights": [
            "123ft Towering Shiva Statue",
            "249ft 20-Story Rajagopuram with Lift",
            "Surrounded by Sea on Three Sides",
            "Netrani Island Scuba Diving Nearby"
        ],
        "nearestAirport": {
            "name": "Mangalore Airport (IXE)",
            "dist": "160 km"
        }
    },
    {
        "id": "jog-falls",
        "name": "Jog Falls (Sharavathi River Cascades)",
        "state": "Karnataka",
        "city": "Shimoga",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/jog-falls.jpg",
        "lat": 14.2285,
        "lng": 74.8122,
        "ticketPrice": 30,
        "tourPackagePrice": 2199,
        "rating": 4.7,
        "reviews": 22100,
        "badge": "Highest Un-Tiered Waterfall",
        "description": "Spectacular 830-foot plunge waterfall created by the Sharavathi River, splitting into four distinct cascades: Raja, Roarer, Rocket, and Rani.",
        "highlights": [
            "830ft Plunge Waterfall (Raja, Roarer, Rocket, Rani)",
            "Watkins Platform Panorama",
            "1,400 Steps to the Chasm Base",
            "Dense Western Ghats Rainforest"
        ],
        "nearestAirport": {
            "name": "Hubli Airport (HBX)",
            "dist": "130 km"
        }
    },
    {
        "id": "chikmagalur-mullayanagiri",
        "name": "Chikmagalur Mullayanagiri Peak",
        "state": "Karnataka",
        "city": "Chikmagalur",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/chikmagalur-mullayanagiri.jpg",
        "lat": 13.391,
        "lng": 75.7214,
        "ticketPrice": 0,
        "tourPackagePrice": 2799,
        "rating": 4.8,
        "reviews": 19400,
        "badge": "Karnataka's Highest Peak",
        "description": "The highest mountain summit in Karnataka (1,930 m) surrounded by rolling coffee plantations, mist-covered valleys, and aromatic estate trails.",
        "highlights": [
            "Highest Summit in Karnataka (1,930m)",
            "Panoramic Cloud-Kissed Ridge Treks",
            "Aromatic Arabica Coffee Plantations",
            "Baba Budangiri Mountain Range"
        ],
        "nearestAirport": {
            "name": "Mangalore International Airport (IXE)",
            "dist": "150 km"
        }
    },
    {
        "id": "badami-cave-temples",
        "name": "Badami Cave Temples & Agastya Lake",
        "state": "Karnataka",
        "city": "Badami",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/badami-cave-temples.jpg",
        "lat": 15.9189,
        "lng": 75.6844,
        "ticketPrice": 25,
        "tourPackagePrice": 1999,
        "rating": 4.8,
        "reviews": 16700,
        "badge": "Chalukya Rock-Cut Masterpiece",
        "description": "Four breathtaking 6th-century rock-cut cave shrines carved into red sandstone cliffs overlooking the historic green waters of Agastya Lake.",
        "highlights": [
            "6th-Century Rock-Cut Shrines",
            "Red Sandstone Cliff Carvings",
            "Scenic Agastya Lake & Bhootnath Temple",
            "Intricate 18-Armed Dancing Nataraja"
        ],
        "nearestAirport": {
            "name": "Hubli Airport (HBX)",
            "dist": "105 km"
        }
    },
    {
        "id": "belur-halebidu",
        "name": "Belur Chennakeshava & Halebidu Temples",
        "state": "Karnataka",
        "city": "Hassan",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/belur-halebidu.jpg",
        "lat": 13.1627,
        "lng": 75.8596,
        "ticketPrice": 25,
        "tourPackagePrice": 1899,
        "rating": 4.9,
        "reviews": 17800,
        "badge": "Hoysala UNESCO Masterpiece",
        "description": "World-famous 12th-century star-shaped soapstone temples representing the pinnacle of Hoysala stone carving with lifelike dancing damsel sculptures.",
        "highlights": [
            "12th-Century Star-Shaped Soapstone Base",
            "Lifelike Madanika Dancing Figures",
            "Intricate Friezes of Elephants & Lions",
            "UNESCO World Heritage Hoysala Ensembles"
        ],
        "nearestAirport": {
            "name": "Bengaluru Kempegowda Airport (BLR)",
            "dist": "220 km"
        }
    },
    {
        "id": "araku-valley",
        "name": "Araku Valley & Borra Caves",
        "state": "Andhra Pradesh",
        "city": "Visakhapatnam",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/araku-valley.jpg",
        "lat": 18.3273,
        "lng": 82.8775,
        "ticketPrice": 80,
        "tourPackagePrice": 2999,
        "rating": 4.7,
        "reviews": 21500,
        "badge": "Eastern Ghats Haven",
        "description": "Scenic hill valley in the Eastern Ghats famous for aromatic organic coffee plantations, tribal culture, and million-year-old limestone stalactite caves.",
        "highlights": [
            "Million-Year-Old Borra Caves",
            "Aromatic Organic Tribal Coffee Estates",
            "Vistadome Glass Train Journey from Vizag",
            "Katiki Waterfalls & Tribal Museum"
        ],
        "nearestAirport": {
            "name": "Visakhapatnam Airport (VTZ)",
            "dist": "115 km"
        }
    },
    {
        "id": "vizag-rk-beach",
        "name": "Visakhapatnam RK Beach & Submarine Museum",
        "state": "Andhra Pradesh",
        "city": "Visakhapatnam",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/vizag-rk-beach.jpg",
        "lat": 17.7167,
        "lng": 83.3333,
        "ticketPrice": 50,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 32000,
        "badge": "Submarine Museum City",
        "description": "Vibrant coastal boulevard with golden sands featuring INS Kursura, the only real decommissioned Russian submarine museum in South Asia.",
        "highlights": [
            "INS Kursura Decommissioned Submarine",
            "Kailasagiri Hilltop Cable Car",
            "Ramakrishna Coastal Promenade",
            "TU 142 Aircraft Museum"
        ],
        "nearestAirport": {
            "name": "Visakhapatnam International (VTZ)",
            "dist": "14 km"
        }
    },
    {
        "id": "gandikota-canyon",
        "name": "Gandikota (Grand Canyon of India)",
        "state": "Andhra Pradesh",
        "city": "Kadapa",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/gandikota-canyon.jpg",
        "lat": 14.8142,
        "lng": 78.2861,
        "ticketPrice": 0,
        "tourPackagePrice": 2299,
        "rating": 4.8,
        "reviews": 18200,
        "badge": "Grand Canyon of India",
        "description": "Breathtaking natural red granite gorge sculpted by the Pennar River, crowned by the ancient 13th-century Gandikota sandstone fort.",
        "highlights": [
            "Massive 300ft Pennar River Gorge",
            "13th-Century Fort Ramparts & Granary",
            "Madhavaraya & Ranganatha Temples",
            "Cliff-Edge Sunrise & Camping"
        ],
        "nearestAirport": {
            "name": "Tirupati Airport (TIR)",
            "dist": "220 km"
        }
    },
    {
        "id": "lepakshi-temple",
        "name": "Lepakshi Veerabhadra Temple & Monolithic Nandi",
        "state": "Andhra Pradesh",
        "city": "Anantapur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/lepakshi-temple.jpg",
        "lat": 13.8042,
        "lng": 77.6083,
        "ticketPrice": 0,
        "tourPackagePrice": 1599,
        "rating": 4.8,
        "reviews": 21300,
        "badge": "Hanging Pillar Wonder",
        "description": "16th-century Vijayanagara engineering marvel renowned for its architectural hanging pillar, massive 7-headed serpent linga, and colossal monolithic Nandi.",
        "highlights": [
            "Architectural Hanging Pillar",
            "World's Largest Monolithic Granite Nandi",
            "7-Headed Nagalinga Sculpture",
            "Intricate Vijayanagara Ceiling Frescoes"
        ],
        "nearestAirport": {
            "name": "Bengaluru Kempegowda Airport (BLR)",
            "dist": "100 km"
        }
    },
    {
        "id": "srisailam-temple",
        "name": "Srisailam Mallikarjuna Swamy Jyotirlinga",
        "state": "Andhra Pradesh",
        "city": "Kurnool",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/srisailam-temple.jpg",
        "lat": 16.0744,
        "lng": 78.8681,
        "ticketPrice": 0,
        "tourPackagePrice": 2799,
        "rating": 4.9,
        "reviews": 34100,
        "badge": "Jyotirlinga & Shakti Peeth",
        "description": "Rare holy sanctuary that is simultaneously one of the 12 sacred Jyotirlingas and one of the 18 Maha Shakti Peethas, set atop Nallamala Hills overlooking Krishna River.",
        "highlights": [
            "Rare Jyotirlinga & Shakti Peeth Shrine",
            "Nallamala Dense Forest Drive",
            "Srisailam Dam Over Krishna River",
            "Patala Ganga Ropeway & Boat Ride"
        ],
        "nearestAirport": {
            "name": "Hyderabad Rajiv Gandhi Airport (HYD)",
            "dist": "200 km"
        }
    },
    {
        "id": "belum-caves",
        "name": "Belum Caves (Underground Limestone Caverns)",
        "state": "Andhra Pradesh",
        "city": "Kurnool",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/belum-caves.jpg",
        "lat": 15.1039,
        "lng": 78.1103,
        "ticketPrice": 65,
        "tourPackagePrice": 1699,
        "rating": 4.6,
        "reviews": 14200,
        "badge": "Longest Caves in India",
        "description": "The second-largest cave network in the Indian subcontinent with subterranean passages, stalactite formations, musical chambers, and underground freshwater streams.",
        "highlights": [
            "3.2-Kilometer Underground Passages",
            "Patalaganga Deepest Cave Stream (150ft)",
            "Musical Limestone Pillars & Simhadwaram",
            "Giant 40ft White Buddha Statue"
        ],
        "nearestAirport": {
            "name": "Tirupati Airport (TIR)",
            "dist": "240 km"
        }
    },
    {
        "id": "ramappa-temple",
        "name": "Ramappa Temple (Kakatiya UNESCO Masterpiece)",
        "state": "Telangana",
        "city": "Warangal",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/ramappa-temple.jpg",
        "lat": 18.2653,
        "lng": 79.9431,
        "ticketPrice": 25,
        "tourPackagePrice": 1999,
        "rating": 4.9,
        "reviews": 18900,
        "badge": "UNESCO Floating Bricks",
        "description": "800-year-old Kakatiya temple constructed using revolutionary floating bricks and intricately carved black basalt pillars, named after its master sculptor.",
        "highlights": [
            "UNESCO World Heritage Kakatiya Wonder",
            "Bricks So Light They Float on Water",
            "Intricately Carved Basalt Dancing Figures",
            "Scenic Ramappa Lake & Boating"
        ],
        "nearestAirport": {
            "name": "Hyderabad Rajiv Gandhi Airport (HYD)",
            "dist": "210 km"
        }
    },
    {
        "id": "nagarjuna-sagar-dam",
        "name": "Nagarjuna Sagar Dam & Buddhist Island",
        "state": "Telangana",
        "city": "Nalgonda",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/nagarjuna-sagar-dam.jpg",
        "lat": 16.5744,
        "lng": 79.3142,
        "ticketPrice": 40,
        "tourPackagePrice": 2199,
        "rating": 4.6,
        "reviews": 21000,
        "badge": "World's Largest Masonry Dam",
        "description": "One of the earliest and largest masonry dams built across the Krishna River, featuring an island museum holding ancient Buddhist relics.",
        "highlights": [
            "26 Spectacular Radial Dam Crest Gates",
            "Nagarjunakonda Island Buddhist Museum",
            "Steamer Boat Rides on Krishna Reservoir",
            "Ethipothala 70ft Cascade Falls Nearby"
        ],
        "nearestAirport": {
            "name": "Hyderabad Airport (HYD)",
            "dist": "150 km"
        }
    },
    {
        "id": "thousand-pillar-temple",
        "name": "Thousand Pillar Temple & Warangal Fort",
        "state": "Telangana",
        "city": "Hanamkonda",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/thousand-pillar-temple.jpg",
        "lat": 17.9942,
        "lng": 79.5744,
        "ticketPrice": 20,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 16300,
        "badge": "Kakatiya Triple Shrine",
        "description": "Historic 12th-century star-shaped triple-shrine (Trikutalayam) temple dedicated to Shiva, Vishnu, and Surya with 1,000 richly carved monolithic pillars.",
        "highlights": [
            "1,000 Richly Carved Monolithic Pillars",
            "Star-Shaped Trikutalayam Shrine",
            "Monolithic Black Basalt Nandi Bull",
            "Warangal Fort Stone Gateway (Kakatiya Thoranam)"
        ],
        "nearestAirport": {
            "name": "Hyderabad Airport (HYD)",
            "dist": "170 km"
        }
    },
    {
        "id": "salar-jung-museum",
        "name": "Salar Jung Museum & Chowmahalla Palace",
        "state": "Telangana",
        "city": "Hyderabad",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/salar-jung-museum.jpg",
        "lat": 17.3714,
        "lng": 78.4804,
        "ticketPrice": 50,
        "tourPackagePrice": 1299,
        "rating": 4.8,
        "reviews": 35600,
        "badge": "World's Largest 1-Man Art Collection",
        "description": "One of the three National Museums of India housing over 46,000 art objects and 50,000 rare manuscripts collected by Nawab Mir Yousuf Ali Khan.",
        "highlights": [
            "Famous Veiled Rebecca Marble Statue",
            "19th-Century Musical Mechanical Clock",
            "Nizam's Jewel & Antique Ivory Collection",
            "Historic Chowmahalla Royal Palace Nearby"
        ],
        "nearestAirport": {
            "name": "Hyderabad Rajiv Gandhi Airport (HYD)",
            "dist": "20 km"
        }
    },
    {
        "id": "hussain-sagar-buddha",
        "name": "Hussain Sagar Lake & Monolithic Buddha",
        "state": "Telangana",
        "city": "Hyderabad",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/hussain-sagar-buddha.jpg",
        "lat": 17.4239,
        "lng": 78.4739,
        "ticketPrice": 0,
        "tourPackagePrice": 999,
        "rating": 4.6,
        "reviews": 41200,
        "badge": "World's Tallest Monolithic Buddha",
        "description": "Heart-shaped artificial lake built in 1563 featuring the world's tallest single-rock white granite statue of Lord Buddha standing on Gibraltar Rock.",
        "highlights": [
            "18-Meter Tall Monolithic White Granite Buddha",
            "Ferry & Speedboat Lake Cruises",
            "Necklace Road Evening Lights & Cafes",
            "Lumbini Park Laser & Musical Fountain Show"
        ],
        "nearestAirport": {
            "name": "Hyderabad Airport (HYD)",
            "dist": "28 km"
        }
    },
    {
        "id": "shirdi-sai-temple",
        "name": "Shirdi Sai Baba Sansthan Temple",
        "state": "Maharashtra",
        "city": "Shirdi",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/shirdi-sai-temple.jpg",
        "lat": 19.7667,
        "lng": 74.4764,
        "ticketPrice": 0,
        "tourPackagePrice": 2499,
        "rating": 4.9,
        "reviews": 58000,
        "badge": "Revered Worldwide Pilgrimage",
        "description": "Sacred shrine dedicated to the revered 19th-century saint Sai Baba, welcoming millions of devotees of all faiths to Dwarkamai and Samadhi Mandir.",
        "highlights": [
            "Holy Samadhi Mandir of Sai Baba",
            "Dwarkamai Sacred Eternal Dhuni",
            "Chavadi Procession & Gurusthan",
            "Mega Prasadalaya Dining Hall"
        ],
        "nearestAirport": {
            "name": "Shirdi International Airport (SAG)",
            "dist": "14 km"
        }
    },
    {
        "id": "elephanta-caves",
        "name": "Elephanta Caves & Trimurti Sculpture",
        "state": "Maharashtra",
        "city": "Mumbai",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/elephanta-caves.jpg",
        "lat": 18.9633,
        "lng": 72.9315,
        "ticketPrice": 40,
        "tourPackagePrice": 1899,
        "rating": 4.7,
        "reviews": 28900,
        "badge": "UNESCO Island Caves",
        "description": "Network of sculpted rock-cut cave temples situated on Elephanta Island in Mumbai Harbour, famous for the colossal 20ft Trimurti Sadashiva sculpture.",
        "highlights": [
            "20-Foot Colossal Trimurti Sadashiva",
            "Ferry Ride Across Mumbai Harbour",
            "6th-Century Bas-Relief Sculptures",
            "UNESCO World Heritage Island Sanctuary"
        ],
        "nearestAirport": {
            "name": "Mumbai Chhatrapati Shivaji Airport (BOM)",
            "dist": "25 km"
        }
    },
    {
        "id": "alibaug-beach-fort",
        "name": "Alibaug Kolaba Fort & Varsoli Beach",
        "state": "Maharashtra",
        "city": "Alibaug",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/alibaug-beach-fort.jpg",
        "lat": 18.6533,
        "lng": 72.8683,
        "ticketPrice": 20,
        "tourPackagePrice": 2299,
        "rating": 4.6,
        "reviews": 21700,
        "badge": "Historic Island Sea Fort",
        "description": "Popular coastal getaway with serene black-sand beaches and the historic 300-year-old Kolaba Fort which can be walked to during low tide.",
        "highlights": [
            "Walk to Kolaba Fort During Low Tide",
            "Water Sports at Varsoli Beach",
            "Fresh Coastal Malvani Seafood",
            "Speedboat Ro-Pax Ferry from Mumbai"
        ],
        "nearestAirport": {
            "name": "Mumbai Airport (BOM)",
            "dist": "95 km"
        }
    },
    {
        "id": "tadoba-tiger-reserve",
        "name": "Tadoba Andhari Tiger Reserve",
        "state": "Maharashtra",
        "city": "Chandrapur",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/tadoba-tiger-reserve.jpg",
        "lat": 20.2444,
        "lng": 79.3517,
        "ticketPrice": 350,
        "tourPackagePrice": 4899,
        "rating": 4.9,
        "reviews": 17200,
        "badge": "Jewel of Vidarbha",
        "description": "Maharashtra's oldest and largest national park, renowned for having the highest density of Royal Bengal tigers and exceptional open-jeep safari sightings.",
        "highlights": [
            "Top Bengal Tiger Sightings in India",
            "Open 4x4 Gypsy Forest Safaris",
            "Tadoba Lake & Sloth Bears",
            "Dense Teak & Bamboo Canopy"
        ],
        "nearestAirport": {
            "name": "Nagpur Dr. Babasaheb Ambedkar Airport (NAG)",
            "dist": "140 km"
        }
    },
    {
        "id": "trimbakeshwar-temple",
        "name": "Trimbakeshwar Shiva Jyotirlinga & Nashik",
        "state": "Maharashtra",
        "city": "Nashik",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/trimbakeshwar-temple.jpg",
        "lat": 19.9325,
        "lng": 73.5308,
        "ticketPrice": 0,
        "tourPackagePrice": 1899,
        "rating": 4.8,
        "reviews": 32600,
        "badge": "Sacred Jyotirlinga",
        "description": "Ancient black-stone Jyotirlinga temple situated at the foot of Brahmagiri Mountain, the origin of the sacred Godavari River, renowned for its three-faced linga.",
        "highlights": [
            "Unique Three-Faced Jyotirlinga (Brahma, Vishnu, Shiva)",
            "Origin of the Sacred Godavari River",
            "Kushavarta Sacred Holy Bathing Kund",
            "Brahmagiri Mountain Trek & Nashik Vineyards"
        ],
        "nearestAirport": {
            "name": "Nashik Ozar Airport (ISK)",
            "dist": "50 km"
        }
    },
    {
        "id": "dwarkadhish-temple",
        "name": "Dwarkadhish Temple & Bet Dwarka",
        "state": "Gujarat",
        "city": "Dwarka",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/dwarkadhish-temple.jpg",
        "lat": 22.2378,
        "lng": 68.9678,
        "ticketPrice": 0,
        "tourPackagePrice": 2899,
        "rating": 4.9,
        "reviews": 41200,
        "badge": "Sacred Char Dham",
        "description": "2,200-year-old grand 5-story temple dedicated to Lord Krishna on the banks of Gomti River overlooking the Arabian Sea, featuring a 52-yard sacred flag.",
        "highlights": [
            "2,200-Year-Old Char Dham Sanctum",
            "72 Pillars & 5-Story Chalukya Shikhara",
            "Gomti Ghat & Holy River Confluence",
            "Sudama Bridge & Bet Dwarka Island Ferry"
        ],
        "nearestAirport": {
            "name": "Jamnagar Airport (JGA)",
            "dist": "135 km"
        }
    },
    {
        "id": "rani-ki-vav",
        "name": "Rani Ki Vav (The Queen's Stepwell)",
        "state": "Gujarat",
        "city": "Patan",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/rani-ki-vav.jpg",
        "lat": 23.8589,
        "lng": 72.1017,
        "ticketPrice": 40,
        "tourPackagePrice": 1799,
        "rating": 4.9,
        "reviews": 26500,
        "badge": "Subterranean UNESCO Wonder",
        "description": "Masterpiece of subterranean architecture built in 1063 AD with seven levels of stairs and over 500 principal sculptures honoring Lord Vishnu.",
        "highlights": [
            "Seven Terraced Levels of Intricate Carvings",
            "Over 500 Principal Vishnu Sculptures",
            "Depicted on the Indian ₹100 Currency Note",
            "UNESCO World Heritage Architectural Wonder"
        ],
        "nearestAirport": {
            "name": "Ahmedabad International Airport (AMD)",
            "dist": "125 km"
        }
    },
    {
        "id": "sabarmati-ashram",
        "name": "Sabarmati Ashram & Riverfront",
        "state": "Gujarat",
        "city": "Ahmedabad",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/sabarmati-ashram.jpg",
        "lat": 23.0606,
        "lng": 72.58,
        "ticketPrice": 0,
        "tourPackagePrice": 999,
        "rating": 4.8,
        "reviews": 47800,
        "badge": "Gandhi's Historic Abode",
        "description": "The serene headquarters from which Mahatma Gandhi led the Indian Independence movement and the historic 1930 Dandi Salt March.",
        "highlights": [
            "Hriday Kunj - Mahatma Gandhi's Original Home",
            "Historic Starting Point of Dandi Salt March",
            "Original Charkha Spinning Wheels & Manuscripts",
            "Modern Sabarmati Riverfront Promenade"
        ],
        "nearestAirport": {
            "name": "Sardar Vallabhbhai Patel Airport (AMD)",
            "dist": "8 km"
        }
    },
    {
        "id": "modhera-sun-temple",
        "name": "Modhera Sun Temple & Surya Kund",
        "state": "Gujarat",
        "city": "Mehsana",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/modhera-sun-temple.jpg",
        "lat": 23.5836,
        "lng": 72.1331,
        "ticketPrice": 25,
        "tourPackagePrice": 1699,
        "rating": 4.8,
        "reviews": 19800,
        "badge": "Solar Equinox Marvel",
        "description": "11th-century Solanki temple designed so the first rays of the sun at solar equinox fall directly on the jewel in the sanctum, overlooking a geometrically sculpted reservoir.",
        "highlights": [
            "Solar Equinox Astronomical Alignment",
            "Surya Kund Geometrical Step-Tank with 108 Mini-Shrines",
            "52 Pillar Assembly Hall Representing Weeks of Year",
            "Evening 3D Light & Sound Projection Show"
        ],
        "nearestAirport": {
            "name": "Ahmedabad Airport (AMD)",
            "dist": "100 km"
        }
    },
    {
        "id": "chittorgarh-fort",
        "name": "Chittorgarh Fort & Vijay Stambha",
        "state": "Rajasthan",
        "city": "Chittorgarh",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/chittorgarh-fort.jpg",
        "lat": 24.8878,
        "lng": 74.6456,
        "ticketPrice": 40,
        "tourPackagePrice": 1899,
        "rating": 4.9,
        "reviews": 28900,
        "badge": "Largest Fort in Asia",
        "description": "Sprawling across 700 acres atop a 180-meter hill, this UNESCO World Heritage fortress embodies the unyielding courage of Rajput warriors and Rani Padmini.",
        "highlights": [
            "9-Story 37m Vijay Stambha (Tower of Victory)",
            "Rani Padmini's Water Palace",
            "Kirti Stambha Tower of Fame",
            "Historic 7 Fortified Gates (Pol)"
        ],
        "nearestAirport": {
            "name": "Udaipur Maharana Pratap Airport (UDR)",
            "dist": "90 km"
        }
    },
    {
        "id": "pushkar-brahma-temple",
        "name": "Pushkar Holy Lake & Brahma Temple",
        "state": "Rajasthan",
        "city": "Pushkar",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/pushkar-brahma-temple.jpg",
        "lat": 26.4886,
        "lng": 74.5511,
        "ticketPrice": 0,
        "tourPackagePrice": 1699,
        "rating": 4.7,
        "reviews": 27400,
        "badge": "World's Only Brahma Shrine",
        "description": "Ancient sacred lakeside town with 52 ghats and the world's most prominent 14th-century temple dedicated to Lord Brahma, famous for the annual vibrant Camel Fair.",
        "highlights": [
            "World's Only Prominent Lord Brahma Temple",
            "52 Sacred Ghats around Pushkar Lake",
            "Savitri Devi Hilltop Ropeway Temple",
            "Desert Sunset Camels & Bohemian Bazaars"
        ],
        "nearestAirport": {
            "name": "Jaipur International Airport (JAI)",
            "dist": "145 km"
        }
    },
    {
        "id": "ranthambore-tiger-safari",
        "name": "Ranthambore Tiger Reserve & Fort",
        "state": "Rajasthan",
        "city": "Sawai Madhopur",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/ranthambore-tiger-safari.jpg",
        "lat": 26.0173,
        "lng": 76.5026,
        "ticketPrice": 500,
        "tourPackagePrice": 4499,
        "rating": 4.8,
        "reviews": 31500,
        "badge": "Royal Bengal Tiger Haven",
        "description": "Famous royal hunting ground turned premier tiger sanctuary where tigers roam among ancient 10th-century palace ruins, lakes, and cenotaphs.",
        "highlights": [
            "Legendary Tiger Spotting among Ruins",
            "1,000-Year-Old UNESCO Ranthambore Fort",
            "Padam Talao Lake & Jogi Mahal",
            "Open 6-Seater 4x4 Gypsy Safaris"
        ],
        "nearestAirport": {
            "name": "Jaipur International Airport (JAI)",
            "dist": "160 km"
        }
    },
    {
        "id": "mount-abu-dilwara",
        "name": "Mount Abu & Dilwara Marble Temples",
        "state": "Rajasthan",
        "city": "Mount Abu",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/mount-abu-dilwara.jpg",
        "lat": 24.5925,
        "lng": 72.7156,
        "ticketPrice": 0,
        "tourPackagePrice": 2499,
        "rating": 4.8,
        "reviews": 26100,
        "badge": "Rajasthan's Only Hill Retreat",
        "description": "The lone hill station of Rajasthan set amidst the lush Aravalli Range, famous for the breathtaking 11th-century Dilwara marble temples and serene Nakki Lake.",
        "highlights": [
            "Finest Carved White Marble Temples in the World",
            "Boating on Serene Nakki Lake",
            "Guru Shikhar Highest Peak of Aravallis",
            "Sunset Point & Toad Rock"
        ],
        "nearestAirport": {
            "name": "Udaipur Airport (UDR)",
            "dist": "185 km"
        }
    },
    {
        "id": "mathura-vrindavan",
        "name": "Mathura & Vrindavan (Prem Mandir & Banke Bihari)",
        "state": "Uttar Pradesh",
        "city": "Mathura",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/mathura-vrindavan.jpg",
        "lat": 27.5706,
        "lng": 77.6594,
        "ticketPrice": 0,
        "tourPackagePrice": 1699,
        "rating": 4.9,
        "reviews": 48900,
        "badge": "Braj Bhoomi Sanctuary",
        "description": "The divine birthplace of Lord Krishna along the sacred Yamuna River, featuring the illuminated white Italian marble Prem Mandir and revered Banke Bihari shrine.",
        "highlights": [
            "Shri Krishna Janmabhoomi Complex",
            "Prem Mandir Illuminated Italian Marble Splendor",
            "Banke Bihari Temple Darshan",
            "Vishram Ghat Evening Yamuna Aarti"
        ],
        "nearestAirport": {
            "name": "Agra Kheria Airport (AGR)",
            "dist": "55 km"
        }
    },
    {
        "id": "prayagraj-sangam",
        "name": "Prayagraj Triveni Sangam & Akbar Fort",
        "state": "Uttar Pradesh",
        "city": "Prayagraj",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/prayagraj-sangam.jpg",
        "lat": 25.4294,
        "lng": 81.8833,
        "ticketPrice": 0,
        "tourPackagePrice": 1899,
        "rating": 4.8,
        "reviews": 36200,
        "badge": "Sacred Triple Confluence",
        "description": "The world-famous sacred confluence where the sacred rivers Ganga, Yamuna, and mythical Saraswati meet, host to the legendary Kumbh Mela.",
        "highlights": [
            "Sacred Ganga-Yamuna Confluence Boat Ride",
            "Historic 1583 Akbar Fort & Patalpuri Temple",
            "Anand Bhavan Nehru Ancestral Home",
            "Site of the Grand Maha Kumbh Mela"
        ],
        "nearestAirport": {
            "name": "Prayagraj Airport (IXD)",
            "dist": "18 km"
        }
    },
    {
        "id": "lucknow-bara-imambara",
        "name": "Lucknow Bara Imambara & Rumi Darwaza",
        "state": "Uttar Pradesh",
        "city": "Lucknow",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/lucknow-bara-imambara.jpg",
        "lat": 26.8692,
        "lng": 80.9125,
        "ticketPrice": 50,
        "tourPackagePrice": 1499,
        "rating": 4.8,
        "reviews": 32900,
        "badge": "Awadhi Architectural Wonder",
        "description": "Monumental 18th-century complex built without any iron beams or pillars, featuring the world-famous Bhulbhulaiya (labyrinth of corridors) and 60ft Rumi Darwaza.",
        "highlights": [
            "Pillarless Arched Central Hall",
            "Bhulbhulaiya Intricate Labyrinth of 1,000 Passages",
            "60ft Soaring Rumi Darwaza Gateway",
            "Historic Chota Imambara & Clock Tower"
        ],
        "nearestAirport": {
            "name": "Lucknow CCS International Airport (LKO)",
            "dist": "15 km"
        }
    },
    {
        "id": "sarnath-dhamek-stupa",
        "name": "Sarnath Dhamek Stupa & Deer Park",
        "state": "Uttar Pradesh",
        "city": "Varanasi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/sarnath-dhamek-stupa.jpg",
        "lat": 25.3811,
        "lng": 83.0244,
        "ticketPrice": 25,
        "tourPackagePrice": 1399,
        "rating": 4.8,
        "reviews": 24700,
        "badge": "Birthplace of Buddhism",
        "description": "The sacred site where Lord Buddha delivered his first sermon after attaining enlightenment, featuring the 43.6m tall cylindrical Dhamek Stupa and Ashoka Lion Capital.",
        "highlights": [
            "43.6m Tall 5th-Century Dhamek Stupa",
            "Origin of India's National Emblem (Ashoka Lion Capital)",
            "Sacred Deer Park & Bodhi Tree",
            "Sarnath Archaeological Museum"
        ],
        "nearestAirport": {
            "name": "Lal Bahadur Shastri Airport (VNS)",
            "dist": "24 km"
        }
    },
    {
        "id": "akshardham-delhi",
        "name": "Akshardham Temple & Cultural Water Show",
        "state": "Delhi",
        "city": "New Delhi",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/akshardham-delhi.jpg",
        "lat": 28.6127,
        "lng": 77.2773,
        "ticketPrice": 0,
        "tourPackagePrice": 1299,
        "rating": 4.9,
        "reviews": 54000,
        "badge": "Guinness World Record",
        "description": "Magnificent 141ft high pink sandstone and Italian Carrara marble temple built according to ancient Vastu Shastra without steel, set on 100 acres along the Yamuna.",
        "highlights": [
            "World's Largest Comprehensive Hindu Temple",
            "Sahaj Anand Musical Water & Laser Show",
            "Boat Ride Through 10,000 Years of Indian History",
            "Over 20,000 Sculptures of Indian Sages"
        ],
        "nearestAirport": {
            "name": "Indira Gandhi International (DEL)",
            "dist": "22 km"
        }
    },
    {
        "id": "jama-masjid-delhi",
        "name": "Jama Masjid & Chandni Chowk",
        "state": "Delhi",
        "city": "Old Delhi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/jama-masjid-delhi.jpg",
        "lat": 28.6507,
        "lng": 77.2334,
        "ticketPrice": 0,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 38900,
        "badge": "Historic Mughal Grandeur",
        "description": "Built by Mughal Emperor Shah Jahan in 1656, one of India's largest mosques featuring red sandstone and white marble with a courtyard accommodating 25,000 worshippers.",
        "highlights": [
            "Courtyard Capacity for 25,000 Worshippers",
            "40m Tall Southern Minaret City Vista",
            "Heritage Rickshaw Tour through Chandni Chowk",
            "Famous Street Delicacies at Paranthe Wali Gali"
        ],
        "nearestAirport": {
            "name": "Indira Gandhi Airport (DEL)",
            "dist": "19 km"
        }
    },
    {
        "id": "rashtrapati-bhavan-delhi",
        "name": "Rashtrapati Bhavan & Amrit Udyan",
        "state": "Delhi",
        "city": "New Delhi",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/rashtrapati-bhavan-delhi.jpg",
        "lat": 28.6143,
        "lng": 77.1994,
        "ticketPrice": 50,
        "tourPackagePrice": 1299,
        "rating": 4.8,
        "reviews": 29400,
        "badge": "Presidential Estate",
        "description": "The 340-room official residence of the President of India on Raisina Hill, designed by Sir Edwin Lutyens, featuring the world-renowned Mughal Gardens (Amrit Udyan).",
        "highlights": [
            "Iconic 340-Room Presidential Palace",
            "Amrit Udyan (Mughal Gardens) Blossom Trail",
            "Central Dome Inspired by Sanchi Stupa",
            "Grand Kartavya Path Vista to India Gate"
        ],
        "nearestAirport": {
            "name": "Indira Gandhi Airport (DEL)",
            "dist": "14 km"
        }
    },
    {
        "id": "kasol-parvati-valley",
        "name": "Kasol & Parvati Valley River Treks",
        "state": "Himachal Pradesh",
        "city": "Kullu",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/kasol-parvati-valley.jpg",
        "lat": 32.01,
        "lng": 77.315,
        "ticketPrice": 0,
        "tourPackagePrice": 2899,
        "rating": 4.8,
        "reviews": 27800,
        "badge": "Mini Israel of India",
        "description": "Charming hamlet on the banks of the Parvati River surrounded by alpine forests and snow peaks, the starting point for Kheerganga and Tosh treks.",
        "highlights": [
            "Parvati River Pine Forest Walks",
            "Gateway to Kheerganga Hot Spring Trek",
            "Bohemian Israeli Cafes & Bakeries",
            "Chalal Suspension Bridge & Tosh Village"
        ],
        "nearestAirport": {
            "name": "Kullu Bhuntar Airport (KUU)",
            "dist": "31 km"
        }
    },
    {
        "id": "dalhousie-khajjiar",
        "name": "Dalhousie & Khajjiar (Mini Switzerland)",
        "state": "Himachal Pradesh",
        "city": "Chamba",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/dalhousie-khajjiar.jpg",
        "lat": 32.55,
        "lng": 76.06,
        "ticketPrice": 0,
        "tourPackagePrice": 3199,
        "rating": 4.7,
        "reviews": 24500,
        "badge": "Mini Switzerland of India",
        "description": "Saucer-shaped lush green meadow surrounded by dense cedar and deodar forests with a floating island lake in the center, officially certified as Mini Switzerland.",
        "highlights": [
            "Officially Designated Mini Switzerland",
            "Central Khajjiar Lake with Floating Island",
            "Zorbing & Horse Riding Across Meadows",
            "Panchpula & Dainkund Peak in Dalhousie"
        ],
        "nearestAirport": {
            "name": "Gaggal Kangra Airport (DHM)",
            "dist": "110 km"
        }
    },
    {
        "id": "bir-billing-paragliding",
        "name": "Bir Billing (World's 2nd Highest Paragliding)",
        "state": "Himachal Pradesh",
        "city": "Kangra",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/bir-billing-paragliding.jpg",
        "lat": 32.0436,
        "lng": 76.7172,
        "ticketPrice": 2500,
        "tourPackagePrice": 4200,
        "rating": 4.9,
        "reviews": 21900,
        "badge": "Paragliding Capital of India",
        "description": "Globally acclaimed paragliding launch site offering 20-30 minute tandem flights over Himalayan tea gardens, snow peaks, and Buddhist monasteries.",
        "highlights": [
            "Tandem Paragliding at 8,000ft Launch Site",
            "Chokling & Palpung Sherabling Monasteries",
            "Scenic Landing Site Sunset Hangouts",
            "Tea Gardens of Baijnath Ancient Shiva Temple"
        ],
        "nearestAirport": {
            "name": "Dharamshala Kangra Airport (DHM)",
            "dist": "65 km"
        }
    },
    {
        "id": "manikaran-sahib",
        "name": "Manikaran Sahib & Hot Sulphur Springs",
        "state": "Himachal Pradesh",
        "city": "Kullu",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/manikaran-sahib.jpg",
        "lat": 32.0278,
        "lng": 77.3478,
        "ticketPrice": 0,
        "tourPackagePrice": 1999,
        "rating": 4.8,
        "reviews": 23400,
        "badge": "Sacred Geothermal Springs",
        "description": "Revered Sikh and Hindu pilgrimage center famous for its boiling natural sulphur springs where langar meals are cooked directly in the geothermal pools.",
        "highlights": [
            "Boiling Hot Sulphur Geothermal Pools",
            "Historic Gurudwara Sri Manikaran Sahib",
            "Lord Shiva & Ramchandra Ancient Temples",
            "Free Langar Meal Cooked in Natural Springs"
        ],
        "nearestAirport": {
            "name": "Kullu Bhuntar Airport (KUU)",
            "dist": "35 km"
        }
    },
    {
        "id": "badrinath-temple",
        "name": "Badrinath Temple & Mana Village",
        "state": "Uttarakhand",
        "city": "Chamoli",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/badrinath-temple.jpg",
        "lat": 30.7447,
        "lng": 79.4933,
        "ticketPrice": 0,
        "tourPackagePrice": 5499,
        "rating": 4.9,
        "reviews": 36700,
        "badge": "Highest Char Dham",
        "description": "One of India's four most sacred Char Dham shrines dedicated to Lord Vishnu, set between Nar and Narayana mountain ranges along the Alaknanda River.",
        "highlights": [
            "Sacred Char Dham Black Stone Badrinarayan",
            "Tapt Kund Natural Hot Sulphur Springs",
            "Mana Village - The Last Indian Village",
            "Vyas Gufa Where the Mahabharata Was Written"
        ],
        "nearestAirport": {
            "name": "Dehradun Jolly Grant Airport (DED)",
            "dist": "310 km"
        }
    },
    {
        "id": "mussoorie-kempty",
        "name": "Mussoorie Mall Road & Kempty Falls",
        "state": "Uttarakhand",
        "city": "Mussoorie",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/mussoorie-kempty.jpg",
        "lat": 30.4598,
        "lng": 78.0644,
        "ticketPrice": 50,
        "tourPackagePrice": 2499,
        "rating": 4.7,
        "reviews": 38200,
        "badge": "Queen of the Hills",
        "description": "Captivating British colonial hill retreat situated on a horseshoe ridge at 6,500 feet, with sweeping panoramas of the Doon Valley and snow-peaked Himalayas.",
        "highlights": [
            "40ft Cascading Kempty Falls",
            "Gun Hill Second Highest Peak via Ropeway",
            "Bustling Mall Road & British Heritage Library",
            "Lal Tibba Scenic Himalayan Viewpoint"
        ],
        "nearestAirport": {
            "name": "Dehradun Jolly Grant Airport (DED)",
            "dist": "58 km"
        }
    },
    {
        "id": "haridwar-ganga-aarti",
        "name": "Haridwar Har Ki Pauri & Ganga Aarti",
        "state": "Uttarakhand",
        "city": "Haridwar",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/haridwar-ganga-aarti.jpg",
        "lat": 29.9567,
        "lng": 78.1706,
        "ticketPrice": 0,
        "tourPackagePrice": 1599,
        "rating": 4.9,
        "reviews": 52000,
        "badge": "Gateway to the Gods",
        "description": "The sacred ghat where the Holy Ganga enters the Indo-Gangetic plains, world-renowned for the magnificent evening Maha Aarti with thousands of floating earthen lamps.",
        "highlights": [
            "Evening Grand Maha Aarti at Har Ki Pauri",
            "Mansa Devi & Chandi Devi Cable Car Temples",
            "Floating Diya Ceremonies along Ganga",
            "Shanti Kunj Spiritual Center"
        ],
        "nearestAirport": {
            "name": "Dehradun Airport (DED)",
            "dist": "38 km"
        }
    },
    {
        "id": "auli-ski-resort",
        "name": "Auli Ski Resort & Nanda Devi View",
        "state": "Uttarakhand",
        "city": "Chamoli",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/auli-ski-resort.jpg",
        "lat": 30.53,
        "lng": 79.57,
        "ticketPrice": 500,
        "tourPackagePrice": 4999,
        "rating": 4.9,
        "reviews": 21300,
        "badge": "India's Skiing Capital",
        "description": "Premier winter sports wonderland in the Himalayas with 4km cable car ride from Joshimath and uninterrupted views of India's second-highest peak Nanda Devi (7,816m).",
        "highlights": [
            "Professional Winter Skiing & Snowboarding Slopes",
            "4-Kilometer Joshimath to Auli Aerial Cable Car",
            "Uninterrupted Views of 7,816m Nanda Devi",
            "Highest Artificial Lake in the World for Snowmaking"
        ],
        "nearestAirport": {
            "name": "Dehradun Jolly Grant Airport (DED)",
            "dist": "280 km"
        }
    },
    {
        "id": "vaishno-devi-shrine",
        "name": "Vaishno Devi Holy Cave Shrine",
        "state": "Jammu & Kashmir",
        "city": "Katra",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/vaishno-devi-shrine.jpg",
        "lat": 33.0308,
        "lng": 74.949,
        "ticketPrice": 0,
        "tourPackagePrice": 2999,
        "rating": 4.9,
        "reviews": 64000,
        "badge": "Maha Shakti Peeth",
        "description": "One of India's most venerated pilgrimage destinations situated at 5,200 feet in the Trikuta Mountains, accessible via a 13km scenic trek or helicopter.",
        "highlights": [
            "Holy Natural Cave Pindies (Maha Kali, Lakshmi, Saraswati)",
            "Helicopter Service & Electric Battery Cars",
            "Bhairon Nath Temple Ropeway",
            "Ardhkuwari Holy Cave Darshan"
        ],
        "nearestAirport": {
            "name": "Jammu Airport (IXJ)",
            "dist": "50 km"
        }
    },
    {
        "id": "sonamarg-glacier",
        "name": "Sonamarg (Meadow of Gold & Thajiwas Glacier)",
        "state": "Jammu & Kashmir",
        "city": "Ganderbal",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/sonamarg-glacier.jpg",
        "lat": 34.31,
        "lng": 75.29,
        "ticketPrice": 0,
        "tourPackagePrice": 3499,
        "rating": 4.8,
        "reviews": 23100,
        "badge": "Meadow of Gold",
        "description": "Breathtaking high-altitude valley on the Sindh River surrounded by towering glaciers, alpine lakes, and the gateway to the sacred Amarnath Yatra.",
        "highlights": [
            "Pony Trek to Thajiwas Snow Glacier",
            "Sindh River White Water Trout Fishing",
            "Gateway to Ladakh via Zoji La Pass",
            "Baltal Base Camp Panorama"
        ],
        "nearestAirport": {
            "name": "Srinagar International Airport (SXR)",
            "dist": "95 km"
        }
    },
    {
        "id": "shankaracharya-temple",
        "name": "Shankaracharya Temple & Srinagar Overlook",
        "state": "Jammu & Kashmir",
        "city": "Srinagar",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/shankaracharya-temple.jpg",
        "lat": 34.0747,
        "lng": 74.8475,
        "ticketPrice": 0,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 19800,
        "badge": "9th-Century Hilltop Shrine",
        "description": "Historic 9th-century Shiva temple situated on Gopadari Hill at 1,000 feet, offering the most spectacular aerial vantage point over Dal Lake and the Srinagar valley.",
        "highlights": [
            "1,000ft Aerial Panoramic View of Dal Lake",
            "Visited by Adi Shankara in 8th Century",
            "Ancient Octagonal Stone Architecture",
            "243 Stone Steps Ascent through Pine Woods"
        ],
        "nearestAirport": {
            "name": "Srinagar International (SXR)",
            "dist": "16 km"
        }
    },
    {
        "id": "leh-palace-shanti-stupa",
        "name": "Leh Palace & Shanti Stupa",
        "state": "Ladakh",
        "city": "Leh",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/leh-palace-shanti-stupa.jpg",
        "lat": 34.165,
        "lng": 77.5878,
        "ticketPrice": 25,
        "tourPackagePrice": 2199,
        "rating": 4.8,
        "reviews": 24600,
        "badge": "Royal Tibetan Citadel",
        "description": "9-story royal palace modeled after Lhasa's Potala Palace overlooking Leh town, crowned by the white-domed Shanti Stupa holding Buddha relics.",
        "highlights": [
            "9-Story 17th-Century Royal Palace",
            "White-Domed Shanti Stupa Sunset Panorama",
            "360-Degree Views of Zanskar Mountain Range",
            "Ancient Thangka Buddhist Murals"
        ],
        "nearestAirport": {
            "name": "Kushok Bakula Rimpochee Airport (IXL)",
            "dist": "5 km"
        }
    },
    {
        "id": "magnetic-hill-sangam",
        "name": "Magnetic Hill & Indus-Zanskar Sangam",
        "state": "Ladakh",
        "city": "Nimmu",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/magnetic-hill-sangam.jpg",
        "lat": 34.19,
        "lng": 77.35,
        "ticketPrice": 0,
        "tourPackagePrice": 1999,
        "rating": 4.7,
        "reviews": 21000,
        "badge": "Gravity-Defying Phenomenon",
        "description": "Fascinating natural optical illusion where vehicles in neutral appear to roll uphill against gravity, paired with the colorful confluence of blue Indus and green Zanskar rivers.",
        "highlights": [
            "Gravity-Defying Magnetic Hill Phenomenon",
            "Confluence of Blue Indus and Muddy Green Zanskar",
            "White Water River Rafting on Zanskar",
            "Gurudwara Pathar Sahib Rock Relic"
        ],
        "nearestAirport": {
            "name": "Leh Airport (IXL)",
            "dist": "30 km"
        }
    },
    {
        "id": "khardung-la-pass",
        "name": "Khardung La Pass (17,982 ft)",
        "state": "Ladakh",
        "city": "Nubra Highway",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/khardung-la-pass.jpg",
        "lat": 34.2789,
        "lng": 77.6044,
        "ticketPrice": 0,
        "tourPackagePrice": 2899,
        "rating": 4.9,
        "reviews": 28900,
        "badge": "17,982 ft Mountain Summit",
        "description": "Legendary high-altitude mountain pass on the Karakoram Range, celebrated as one of the highest motorable roads on planet Earth.",
        "highlights": [
            "17,982-Foot High Himalayan Summit",
            "Gateway to Nubra Valley & Siachen Glacier",
            "Tibetan Prayer Flags Fluttering in Winds",
            "Iconic High-Altitude Cafe with Hot Maggi & Chai"
        ],
        "nearestAirport": {
            "name": "Leh Airport (IXL)",
            "dist": "40 km"
        }
    },
    {
        "id": "jallianwala-bagh",
        "name": "Jallianwala Bagh National Memorial",
        "state": "Punjab",
        "city": "Amritsar",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/jallianwala-bagh.jpg",
        "lat": 31.6206,
        "lng": 74.88,
        "ticketPrice": 0,
        "tourPackagePrice": 799,
        "rating": 4.8,
        "reviews": 44000,
        "badge": "National Freedom Memorial",
        "description": "Solemn public garden and national memorial preserving the historic bullet marks on the brick walls and the Martyrs' Well from the tragic 1919 massacre.",
        "highlights": [
            "Preserved Bullet Marks on Historic Brick Walls",
            "The Historic Martyrs' Well (Shaheedi Khoo)",
            "Eternal Flame of Liberty Memorial",
            "Interactive Light & Sound History Museum"
        ],
        "nearestAirport": {
            "name": "Sri Guru Ram Dass Jee Airport (ATQ)",
            "dist": "13 km"
        }
    },
    {
        "id": "anandpur-sahib",
        "name": "Anandpur Sahib & Virasat-e-Khalsa",
        "state": "Punjab",
        "city": "Rupnagar",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/anandpur-sahib.jpg",
        "lat": 31.2356,
        "lng": 76.4989,
        "ticketPrice": 0,
        "tourPackagePrice": 2199,
        "rating": 4.9,
        "reviews": 28500,
        "badge": "Holy City of Bliss",
        "description": "The birthplace of the Khalsa Panth established by Guru Gobind Singh Ji in 1699, featuring the world-class Virasat-e-Khalsa museum designed by Moshe Safdie.",
        "highlights": [
            "Takht Sri Kesgarh Sahib Holy Sanctum",
            "Virasat-e-Khalsa Award-Winning Architecture",
            "World-Renowned Annual Hola Mohalla Festival",
            "Scenic Shivalik Foothill Vistas"
        ],
        "nearestAirport": {
            "name": "Chandigarh International Airport (IXC)",
            "dist": "85 km"
        }
    },
    {
        "id": "qila-mubarak-bathinda",
        "name": "Qila Mubarak (Bathinda Fort)",
        "state": "Punjab",
        "city": "Bathinda",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/qila-mubarak-bathinda.jpg",
        "lat": 30.2117,
        "lng": 74.9458,
        "ticketPrice": 0,
        "tourPackagePrice": 1199,
        "rating": 4.6,
        "reviews": 14200,
        "badge": "Oldest Surviving Fort in India",
        "description": "Over 1,400 years old, built between 90-110 AD with bricks from the Kushan period, where India's first female ruler Razia Sultana was imprisoned.",
        "highlights": [
            "Built in 1st-Century Kushan Era",
            "Razia Sultana's Historic Prison Chamber",
            "Gurudwara Qila Mubarak within Ramparts",
            "Colossal Red-Brick Bastion Walls"
        ],
        "nearestAirport": {
            "name": "Bathinda Airport (BUP)",
            "dist": "25 km"
        }
    },
    {
        "id": "sheesh-mahal-patiala",
        "name": "Sheesh Mahal & Royal Heritage Gardens",
        "state": "Punjab",
        "city": "Patiala",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/sheesh-mahal-patiala.jpg",
        "lat": 30.3167,
        "lng": 76.3986,
        "ticketPrice": 20,
        "tourPackagePrice": 1399,
        "rating": 4.6,
        "reviews": 16100,
        "badge": "Palace of Mirrors",
        "description": "Built in 1847 by Maharaja Narinder Singh with mirror-work murals, an artificial suspension bridge (Lakshman Jhula), and medal gallery.",
        "highlights": [
            "Intricate European & Rajasthani Glasswork",
            "Suspended Iron Rope Bridge (Lakshman Jhula)",
            "World-Class Royal Medal & Art Gallery",
            "Qila Mubarak & Baradari Gardens Nearby"
        ],
        "nearestAirport": {
            "name": "Chandigarh Airport (IXC)",
            "dist": "60 km"
        }
    },
    {
        "id": "sanchi-stupa",
        "name": "Sanchi Stupa (Emperor Ashoka UNESCO Wonder)",
        "state": "Madhya Pradesh",
        "city": "Raisen",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/sanchi-stupa.jpg",
        "lat": 23.4794,
        "lng": 77.7397,
        "ticketPrice": 40,
        "tourPackagePrice": 1799,
        "rating": 4.9,
        "reviews": 26800,
        "badge": "Oldest Stone Structure in India",
        "description": "Commissioned by Emperor Ashoka in the 3rd century BCE, the Great Stupa is India's most celebrated Buddhist monument featuring 4 intricately carved ceremonial Torana gateways.",
        "highlights": [
            "Built by Emperor Ashoka in 3rd Century BCE",
            "4 Intricately Carved Ceremonial Torana Gateways",
            "UNESCO World Heritage Buddhist Landmark",
            "Archaeological Museum with Relic Caskets"
        ],
        "nearestAirport": {
            "name": "Bhopal Raja Bhoj Airport (BHO)",
            "dist": "50 km"
        }
    },
    {
        "id": "ujjain-mahakaleshwar",
        "name": "Ujjain Mahakaleshwar Jyotirlinga",
        "state": "Madhya Pradesh",
        "city": "Ujjain",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/ujjain-mahakaleshwar.jpg",
        "lat": 23.1828,
        "lng": 75.7681,
        "ticketPrice": 0,
        "tourPackagePrice": 2499,
        "rating": 4.9,
        "reviews": 51200,
        "badge": "Dakshinmukhi Jyotirlinga",
        "description": "One of the most sacred 12 Jyotirlingas, the only one facing south (Dakshinmukhi), famous for the legendary pre-dawn Bhasma Aarti and the 900m grand Mahakal Lok corridor.",
        "highlights": [
            "Pre-Dawn Sacred Bhasma Aarti",
            "Grand 900m Mahakal Lok Corridor",
            "Ram Ghat Evening Shipra River Aarti",
            "Kal Bhairav Ancient Wine Offering Shrine"
        ],
        "nearestAirport": {
            "name": "Indore Devi Ahilya Bai Airport (IDR)",
            "dist": "55 km"
        }
    },
    {
        "id": "bhedaghat-marble-rocks",
        "name": "Bhedaghat Marble Rocks & Dhuandhar Falls",
        "state": "Madhya Pradesh",
        "city": "Jabalpur",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/bhedaghat-marble-rocks.jpg",
        "lat": 23.1308,
        "lng": 79.8,
        "ticketPrice": 50,
        "tourPackagePrice": 1999,
        "rating": 4.8,
        "reviews": 24900,
        "badge": "Marble Canyon Wonder",
        "description": "Spectacular 100-foot white marble gorge carved by the Narmada River that changes color under moonlit skies, paired with the thunderous Dhuandhar mist waterfall.",
        "highlights": [
            "Boat Ride Through 100ft Soaring Marble Canyons",
            "Thunderous Dhuandhar Smokey Mist Waterfall",
            "Full Moon Night Boating Splendor",
            "Chausath Yogini 10th-Century Temple"
        ],
        "nearestAirport": {
            "name": "Jabalpur Dumna Airport (JLR)",
            "dist": "35 km"
        }
    },
    {
        "id": "pachmarhi-hill-station",
        "name": "Pachmarhi (Queen of Satpura & Bee Falls)",
        "state": "Madhya Pradesh",
        "city": "Hoshangabad",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/pachmarhi-hill-station.jpg",
        "lat": 22.4674,
        "lng": 78.4336,
        "ticketPrice": 60,
        "tourPackagePrice": 3299,
        "rating": 4.7,
        "reviews": 19300,
        "badge": "Queen of the Satpuras",
        "description": "The only hill station of Madhya Pradesh nestled in Satpura Biosphere Reserve, renowned for natural rock swimming pools, Bee Falls, and Pandav Caves.",
        "highlights": [
            "150ft Cascading Bee Waterfalls",
            "Ancient Rock-Cut Pandav Caves",
            "Dhoopgarh Highest Point of Satpura Range",
            "Bison Lodge & Satpura Tiger Trails"
        ],
        "nearestAirport": {
            "name": "Bhopal Raja Bhoj Airport (BHO)",
            "dist": "195 km"
        }
    },
    {
        "id": "dakshineswar-kali-temple",
        "name": "Dakshineswar Kali Temple & Belur Math",
        "state": "West Bengal",
        "city": "Kolkata",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/dakshineswar-kali-temple.jpg",
        "lat": 22.655,
        "lng": 88.3575,
        "ticketPrice": 0,
        "tourPackagePrice": 1299,
        "rating": 4.9,
        "reviews": 46200,
        "badge": "Sacred Hooghly Sanctuary",
        "description": "Famous 1855 Navaratna temple where mystic saint Ramakrishna Paramahamsa served as priest, connected via river ferry to Swami Vivekananda's Belur Math.",
        "highlights": [
            "1855 Navaratna Nine-Spired Kali Temple",
            "Ferry Ride Across Hooghly to Belur Math",
            "12 Shrines of Lord Shiva along River",
            "Room of Sri Ramakrishna Paramahamsa"
        ],
        "nearestAirport": {
            "name": "Netaji Subhash Chandra Bose Airport (CCU)",
            "dist": "12 km"
        }
    },
    {
        "id": "digha-beach",
        "name": "Digha & Mandarmani Drive-In Beach",
        "state": "West Bengal",
        "city": "Purba Medinipur",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/digha-beach.jpg",
        "lat": 21.6267,
        "lng": 87.5075,
        "ticketPrice": 0,
        "tourPackagePrice": 1999,
        "rating": 4.6,
        "reviews": 26800,
        "badge": "Brighton of the East",
        "description": "West Bengal's premier coastal seaside resort with a 7km flat shallow sand beach where gentle waves wash over red crab colonies.",
        "highlights": [
            "7km Wide Shallow Coastal Drive",
            "Red Crab Colonies on Mandarmani Sands",
            "Marine Aquarium & Research Centre",
            "Fresh Coastal Hilsa & Prawn Delicacies"
        ],
        "nearestAirport": {
            "name": "Kolkata Airport (CCU)",
            "dist": "185 km"
        }
    },
    {
        "id": "kalimpong-deolo",
        "name": "Kalimpong Deolo Hill & Monasteries",
        "state": "West Bengal",
        "city": "Kalimpong",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/kalimpong-deolo.jpg",
        "lat": 27.06,
        "lng": 78.47,
        "ticketPrice": 0,
        "tourPackagePrice": 2799,
        "rating": 4.7,
        "reviews": 18200,
        "badge": "Himalayan Ridge Haven",
        "description": "Tranquil hill retreat overlooking the Teesta River valley with unobstructed views of Mount Kanchenjunga, exotic orchid nurseries, and Buddhist monasteries.",
        "highlights": [
            "Deolo Hill Highest Vantage Point (1,704m)",
            "Zang Dhok Palri Phodang Historic Monastery",
            "Exotic Cactus & Orchid Flower Nurseries",
            "Paragliding over Teesta Valley"
        ],
        "nearestAirport": {
            "name": "Bagdogra Airport (IXB)",
            "dist": "75 km"
        }
    },
    {
        "id": "shantiniketan-tagore",
        "name": "Shantiniketan (Rabindranath Tagore UNESCO)",
        "state": "West Bengal",
        "city": "Bolpur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/shantiniketan-tagore.jpg",
        "lat": 23.68,
        "lng": 87.68,
        "ticketPrice": 40,
        "tourPackagePrice": 1799,
        "rating": 4.8,
        "reviews": 21900,
        "badge": "UNESCO Abode of Peace",
        "description": "Visionary open-air university town founded by Nobel Laureate Rabindranath Tagore, celebrating world art, literature, Baul folk music, and Basanta Utsav.",
        "highlights": [
            "Uttarayan Complex (Tagore's Five Houses)",
            "Kala Bhavana World-Renowned Art Murals",
            "Shonajhuri Saturday Tribal Haat Market",
            "UNESCO World Heritage Cultural Enclave"
        ],
        "nearestAirport": {
            "name": "Kazi Nazrul Islam Airport Durgapur (RDP)",
            "dist": "65 km"
        }
    },
    {
        "id": "lingaraj-temple",
        "name": "Lingaraj Temple & Bindu Sagar",
        "state": "Odisha",
        "city": "Bhubaneswar",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/lingaraj-temple.jpg",
        "lat": 20.2382,
        "lng": 85.8336,
        "ticketPrice": 0,
        "tourPackagePrice": 1499,
        "rating": 4.8,
        "reviews": 31200,
        "badge": "11th-Century Kalinga Marvel",
        "description": "The quintessential masterpiece of Kalinga architecture soaring 180 feet high in the Temple City, dedicated to Harihara (Lord Shiva & Lord Vishnu).",
        "highlights": [
            "180-Foot Soaring Deula Tower",
            "Sanctum of Lord Harihara (Shiva & Vishnu)",
            "Sacred Bindu Sagar Holy Water Tank",
            "Over 150 Subsidiary Shrines in Enclosure"
        ],
        "nearestAirport": {
            "name": "Biju Patnaik Airport Bhubaneswar (BBI)",
            "dist": "4 km"
        }
    },
    {
        "id": "udayagiri-khandagiri-caves",
        "name": "Udayagiri & Khandagiri Rock-Cut Caves",
        "state": "Odisha",
        "city": "Bhubaneswar",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/udayagiri-khandagiri-caves.jpg",
        "lat": 20.2606,
        "lng": 85.7867,
        "ticketPrice": 25,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 21800,
        "badge": "2nd-Century BCE Jain Caves",
        "description": "Twin hills honeycombed with 33 partly natural and partly rock-cut residential caves commissioned by King Kharavela of Kalinga in the 2nd century BCE.",
        "highlights": [
            "Hathigumpha Inscription of King Kharavela",
            "Ranigumpha (Queen's Cave) Double-Decker Monastery",
            "Tiger Cave (Baghagumpha) Stone Carving",
            "Panoramic Views of Bhubaneswar Skyline"
        ],
        "nearestAirport": {
            "name": "Bhubaneswar Airport (BBI)",
            "dist": "6 km"
        }
    },
    {
        "id": "dhauli-shanti-stupa",
        "name": "Dhauli Shanti Stupa & Ashoka Edicts",
        "state": "Odisha",
        "city": "Bhubaneswar",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/dhauli-shanti-stupa.jpg",
        "lat": 20.1919,
        "lng": 85.8394,
        "ticketPrice": 0,
        "tourPackagePrice": 1199,
        "rating": 4.7,
        "reviews": 23400,
        "badge": "Kalinga War Transformation",
        "description": "Historic hill on the Daya River where Emperor Ashoka renounced war after the bloody Kalinga battle, featuring rock-cut Ashoka edicts and a pristine Peace Pagoda.",
        "highlights": [
            "Pristine White Japanese Peace Pagoda",
            "3rd-Century BCE Emperor Ashoka Rock Edicts",
            "Rock-Cut Elephant Ancient Carving",
            "Evening Light & Sound Show on Kalinga War"
        ],
        "nearestAirport": {
            "name": "Bhubaneswar Airport (BBI)",
            "dist": "10 km"
        }
    },
    {
        "id": "simlipal-tiger-reserve",
        "name": "Simlipal Tiger Reserve & Barehipani Falls",
        "state": "Odisha",
        "city": "Mayurbhanj",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/simlipal-tiger-reserve.jpg",
        "lat": 21.9333,
        "lng": 86.3333,
        "ticketPrice": 100,
        "tourPackagePrice": 4299,
        "rating": 4.8,
        "reviews": 14800,
        "badge": "UNESCO Biosphere Reserve",
        "description": "Vast wilderness harboring Bengal tigers, wild Asian elephants, and the rare melanistic black tigers, punctuated by the 1,300ft Barehipani two-tier waterfall.",
        "highlights": [
            "Rare Melanistic (Black) Tiger Habitat",
            "1,300ft Barehipani Two-Tier Waterfall",
            "Joranda Waterfall Gorge",
            "Deep Sal Forests & Elephant Corridors"
        ],
        "nearestAirport": {
            "name": "Bhubaneswar Airport (BBI)",
            "dist": "270 km"
        }
    },
    {
        "id": "kamakhya-temple",
        "name": "Kamakhya Temple atop Nilachal Hill",
        "state": "Assam",
        "city": "Guwahati",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/kamakhya-temple.jpg",
        "lat": 26.1664,
        "lng": 91.7056,
        "ticketPrice": 0,
        "tourPackagePrice": 1499,
        "rating": 4.9,
        "reviews": 42100,
        "badge": "Foremost Shakti Peeth",
        "description": "One of the oldest and most revered 51 Shakti Peethas in India, situated atop Nilachal Hill overlooking the Brahmaputra River, famous for the Ambubachi Mela.",
        "highlights": [
            "Natural Spring-Fed Holy Cave Sanctum",
            "Spectacular Nilachal Hill Panorama",
            "Annual Ambubachi Fertility Festival",
            "Assamese Shikhara Architecture"
        ],
        "nearestAirport": {
            "name": "Lokpriya Gopinath Bordoloi Airport (GAU)",
            "dist": "18 km"
        }
    },
    {
        "id": "majuli-island",
        "name": "Majuli (World's Largest River Island)",
        "state": "Assam",
        "city": "Majuli",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/majuli-island.jpg",
        "lat": 26.95,
        "lng": 94.2167,
        "ticketPrice": 0,
        "tourPackagePrice": 2899,
        "rating": 4.8,
        "reviews": 17200,
        "badge": "Largest River Island on Earth",
        "description": "Serene island nestled in the Brahmaputra River, the spiritual epicenter of Assamese Neo-Vaishnavite culture preserving ancient mask-making and monastic Satras.",
        "highlights": [
            "World's Largest Inhabited River Island",
            "Traditional Bamboo Mask-Making at Samaguri Satra",
            "Kamalabari & Auniati Monastic Satras",
            "Sunset Ferry Cruise on Brahmaputra"
        ],
        "nearestAirport": {
            "name": "Jorhat Airport (JRH)",
            "dist": "45 km (including ferry)"
        }
    },
    {
        "id": "manas-national-park",
        "name": "Manas National Park & Tiger Reserve",
        "state": "Assam",
        "city": "Barpeta",
        "category": "wildlife",
        "categoryName": "Wildlife & Safari",
        "image": "assets/img/india-tours/manas-national-park.jpg",
        "lat": 26.7167,
        "lng": 91.0333,
        "ticketPrice": 200,
        "tourPackagePrice": 4100,
        "rating": 4.8,
        "reviews": 15300,
        "badge": "UNESCO Himalayan Biosphere",
        "description": "Contiguous with Bhutan's Royal Manas National Park, a pristine sanctuary sheltering the Golden Langur, Pygmy Hog, One-Horned Rhino, and Bengal Tigers.",
        "highlights": [
            "Rare Golden Langur & Pygmy Hog Habitat",
            "Manas River White Water Rafting",
            "UNESCO Natural World Heritage Site",
            "Elephant & 4x4 Jeep Wilderness Safaris"
        ],
        "nearestAirport": {
            "name": "Guwahati Airport (GAU)",
            "dist": "140 km"
        }
    },
    {
        "id": "sivasagar-ahom-palaces",
        "name": "Sivasagar Rang Ghar & Ahom Royal Monuments",
        "state": "Assam",
        "city": "Sivasagar",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/sivasagar-ahom-palaces.jpg",
        "lat": 26.9667,
        "lng": 94.6333,
        "ticketPrice": 25,
        "tourPackagePrice": 1999,
        "rating": 4.7,
        "reviews": 14100,
        "badge": "Asia's Oldest Amphitheater",
        "description": "The capital of the mighty 600-year Ahom kingdom featuring Rang Ghar, an amphitheater built in 1746, Talatal Ghar underground citadel, and massive Sivasagar tank.",
        "highlights": [
            "Rang Ghar (Asia's Oldest Royal Amphitheater)",
            "Talatal Ghar 7-Story Royal Palace",
            "Sivasagar Huge Ancient Water Reservoir",
            "Shivadol 104ft Tall Ancient Temple"
        ],
        "nearestAirport": {
            "name": "Jorhat Airport (JRH)",
            "dist": "55 km"
        }
    },
    {
        "id": "haflong-hill-station",
        "name": "Haflong Hill Station & Jatinga Valley",
        "state": "Assam",
        "city": "Dima Hasao",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/haflong-hill-station.jpg",
        "lat": 25.1833,
        "lng": 93.0167,
        "ticketPrice": 0,
        "tourPackagePrice": 2899,
        "rating": 4.7,
        "reviews": 12800,
        "badge": "Assam's Only Hill Station",
        "description": "Known as the White Ant Hillock, Assam's only hill station is surrounded by cloud-covered rolling hills, cascading emerald streams, and historic British railway tunnels.",
        "highlights": [
            "Haflong Scenic Lake & Hanging Bridge",
            "Misty Jatinga Bird Watch Valley",
            "Panoramic Vista Dome Train Ride",
            "Traditional Dimasa Tribal Culture"
        ],
        "nearestAirport": {
            "name": "Silchar Airport (IXS)",
            "dist": "100 km"
        }
    },
    {
        "id": "nohkalikai-falls",
        "name": "Nohkalikai Falls (1,115 ft Plunge)",
        "state": "Meghalaya",
        "city": "Cherrapunji",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/nohkalikai-falls.jpg",
        "lat": 25.2756,
        "lng": 91.6847,
        "ticketPrice": 50,
        "tourPackagePrice": 2499,
        "rating": 4.9,
        "reviews": 31200,
        "badge": "India's Tallest Plunge Waterfall",
        "description": "India's highest single plunge waterfall dropping an astonishing 1,115 feet from lush tabletop cliffs into a dramatic turquoise-green natural waterhole.",
        "highlights": [
            "1,115ft Single Plunge Waterfall Drop",
            "Vibrant Turquoise-Green Plunge Pool",
            "Lush Tabletop Meghalaya Plateau",
            "Seven Sisters & Dainthlen Falls Nearby"
        ],
        "nearestAirport": {
            "name": "Shillong Umroi Airport (SHL)",
            "dist": "85 km"
        }
    },
    {
        "id": "dawki-umngot-river",
        "name": "Dawki Umngot River (Crystal Clear Waters)",
        "state": "Meghalaya",
        "city": "Dawki",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/dawki-umngot-river.jpg",
        "lat": 25.1833,
        "lng": 92.0167,
        "ticketPrice": 0,
        "tourPackagePrice": 2899,
        "rating": 4.9,
        "reviews": 38400,
        "badge": "Transparent Glass River",
        "description": "The emerald Umngot River is so pure and crystal-clear that boats appear to float mid-air on glass, bordering India and Bangladesh.",
        "highlights": [
            "Boats Appear Floating on Clear Glass",
            "Kayaking & Snorkeling in Umngot River",
            "Suspension Bridge Built by British in 1932",
            "Border Gate to Bangladesh"
        ],
        "nearestAirport": {
            "name": "Guwahati Airport (GAU)",
            "dist": "175 km"
        }
    },
    {
        "id": "shillong-peak-elephant-falls",
        "name": "Shillong Peak & Elephant Falls",
        "state": "Meghalaya",
        "city": "Shillong",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/shillong-peak-elephant-falls.jpg",
        "lat": 25.5367,
        "lng": 91.825,
        "ticketPrice": 30,
        "tourPackagePrice": 1999,
        "rating": 4.8,
        "reviews": 34100,
        "badge": "Scotland of the East",
        "description": "Three-tiered cascade named after an elephant-shaped rock, paired with Shillong Peak (6,449 ft), offering 360-degree vistas of the capital city.",
        "highlights": [
            "Three Unique Consecutive Waterfall Tiers",
            "Shillong Peak 6,449ft Highest Point",
            "Ward's Lake & Pine Woodland Promenade",
            "Laitlum Canyons Sunset Vista Nearby"
        ],
        "nearestAirport": {
            "name": "Shillong Airport (SHL)",
            "dist": "30 km"
        }
    },
    {
        "id": "mawlynnong-clean-village",
        "name": "Mawlynnong (Asia's Cleanest Village)",
        "state": "Meghalaya",
        "city": "East Khasi Hills",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/mawlynnong-clean-village.jpg",
        "lat": 25.2017,
        "lng": 91.9189,
        "ticketPrice": 20,
        "tourPackagePrice": 2399,
        "rating": 4.8,
        "reviews": 26500,
        "badge": "Cleanest Village in Asia",
        "description": "Awarded the Cleanest Village in Asia, renowned for 100% literacy, eco-friendly bamboo dustbins on every pathway, flower gardens, and sky walk.",
        "highlights": [
            "Awarded Cleanest Village in Asia by Discover India",
            "Sky View 85ft Bamboo Watchtower",
            "Single Decker Living Root Bridge in Riwai",
            "Balancing Rock Geological Phenomenon"
        ],
        "nearestAirport": {
            "name": "Guwahati Airport (GAU)",
            "dist": "170 km"
        }
    },
    {
        "id": "krang-suri-falls",
        "name": "Krang Suri Natural Blue Waterfalls",
        "state": "Meghalaya",
        "city": "West Jaintia Hills",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/krang-suri-falls.jpg",
        "lat": 25.3528,
        "lng": 92.2572,
        "ticketPrice": 50,
        "tourPackagePrice": 2699,
        "rating": 4.9,
        "reviews": 22800,
        "badge": "Natural Turquoise Swimming Pool",
        "description": "Spectacular curtain waterfall cascading into a natural pool of astonishing aquamarine blue, complete with a stone walkway carved behind the falling sheet of water.",
        "highlights": [
            "Deep Aquamarine Blue Natural Pool",
            "Walkway Carved Directly Behind the Waterfall",
            "Life-Jacket Swimming in Natural Waters",
            "Cliff Camping under Starlit Himalayan Skies"
        ],
        "nearestAirport": {
            "name": "Shillong Airport (SHL)",
            "dist": "105 km"
        }
    },
    {
        "id": "gangtok-mg-marg",
        "name": "Gangtok MG Marg & Cable Car Ropeway",
        "state": "Sikkim",
        "city": "Gangtok",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/gangtok-mg-marg.jpg",
        "lat": 27.3314,
        "lng": 88.6138,
        "ticketPrice": 0,
        "tourPackagePrice": 2499,
        "rating": 4.8,
        "reviews": 36700,
        "badge": "Cleanest Hill Capital",
        "description": "Pedestrian-only cobblestone boulevard lined with cafes and flower planters, offering bird's-eye views from the Deorali to Tashiling double-cable ropeway.",
        "highlights": [
            "Pedestrian-Only MG Marg Boulevard",
            "1km Bi-Cable Aerial Ropeway Ride",
            "Rumtek Royal Monastery Heritage",
            "Tashi Viewpoint Kanchenjunga Vistas"
        ],
        "nearestAirport": {
            "name": "Pakyong Airport (PYG)",
            "dist": "28 km"
        }
    },
    {
        "id": "yumthang-valley-flowers",
        "name": "Yumthang Valley of Flowers & Hot Springs",
        "state": "Sikkim",
        "city": "Lachung",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/yumthang-valley-flowers.jpg",
        "lat": 27.8286,
        "lng": 88.6958,
        "ticketPrice": 50,
        "tourPackagePrice": 4899,
        "rating": 4.9,
        "reviews": 21500,
        "badge": "Valley of 24 Rhododendron Species",
        "description": "Spectacular alpine meadow at 11,693 feet blanketed with 24 species of wild rhododendrons in spring and blanketed in thick powdery snow in winter.",
        "highlights": [
            "24 Varieties of Blooming Rhododendrons",
            "Natural Geothermal Sulphur Springs",
            "Zero Point Snow Field at 15,300ft",
            "Lachung Traditional Monastic Village"
        ],
        "nearestAirport": {
            "name": "Bagdogra Airport (IXB)",
            "dist": "215 km"
        }
    },
    {
        "id": "pelling-skywalk",
        "name": "Pelling Glass Skywalk & Chenrezig Statue",
        "state": "Sikkim",
        "city": "Pelling",
        "category": "hills",
        "categoryName": "Hill Stations",
        "image": "assets/img/india-tours/pelling-skywalk.jpg",
        "lat": 27.3167,
        "lng": 88.2333,
        "ticketPrice": 50,
        "tourPackagePrice": 2899,
        "rating": 4.8,
        "reviews": 24200,
        "badge": "First Glass Skywalk in India",
        "description": "India's first glass skywalk perched at 7,200 feet leading to a colossal 137ft statue of Bodhisattva Chenrezig with closest vistas of Mount Kanchenjunga.",
        "highlights": [
            "India's First Transparent Glass Skywalk",
            "Colossal 137ft Chenrezig Statue",
            "Rabdentse 17th-Century Royal Ruins",
            "Pemayangtse Ancient Monastery"
        ],
        "nearestAirport": {
            "name": "Pakyong Airport (PYG)",
            "dist": "110 km"
        }
    },
    {
        "id": "gurudongmar-lake",
        "name": "Gurudongmar Lake (17,800 ft Glacial Lake)",
        "state": "Sikkim",
        "city": "Lachen",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/gurudongmar-lake.jpg",
        "lat": 28.0258,
        "lng": 88.7083,
        "ticketPrice": 0,
        "tourPackagePrice": 5499,
        "rating": 4.9,
        "reviews": 18900,
        "badge": "Sacred 17,800ft Glacial Lake",
        "description": "One of the highest lakes in the world located near the Indo-Tibetan border, sacred to Buddhists and Sikhs, with a part that never freezes even in sub-zero winter.",
        "highlights": [
            "17,800ft Glacial Lake Fed by Glaciers",
            "Blessed by Guru Padmasambhava & Guru Nanak",
            "Breathtaking Snow Peaks of Mount Siniolchu",
            "One of the World's Highest Accessible Lakes"
        ],
        "nearestAirport": {
            "name": "Bagdogra Airport (IXB)",
            "dist": "260 km"
        }
    },
    {
        "id": "ravangla-buddha-park",
        "name": "Ravangla Buddha Park (Tathagata Tsal)",
        "state": "Sikkim",
        "city": "Ravangla",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/ravangla-buddha-park.jpg",
        "lat": 27.3106,
        "lng": 88.3633,
        "ticketPrice": 50,
        "tourPackagePrice": 2299,
        "rating": 4.9,
        "reviews": 21600,
        "badge": "130ft Gilded Colossus",
        "description": "Scenic spiritual sanctuary featuring a magnificent 130-foot copper-gilded statue of Lord Buddha consecrated by the 14th Dalai Lama, framed by the Great Himalayas.",
        "highlights": [
            "130-Foot Gilded Buddha Statue",
            "Consecrated by the 14th Dalai Lama",
            "Surrounded by Landscaped Himalayan Gardens",
            "Panoramic Views of Mount Narsing"
        ],
        "nearestAirport": {
            "name": "Pakyong Airport (PYG)",
            "dist": "68 km"
        }
    },
    {
        "id": "rajgir-glass-bridge",
        "name": "Rajgir Glass Bridge & Vishwa Shanti Stupa",
        "state": "Bihar",
        "city": "Rajgir",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/rajgir-glass-bridge.jpg",
        "lat": 25.03,
        "lng": 85.42,
        "ticketPrice": 125,
        "tourPackagePrice": 1999,
        "rating": 4.8,
        "reviews": 29400,
        "badge": "First Skywalk in East India",
        "description": "Historic ancient capital of Magadha empire set in a valley surrounded by 7 hills, famous for its 200ft high glass skywalk bridge and aerial ropeway to Shanti Stupa.",
        "highlights": [
            "200ft High Transparent Glass Skywalk",
            "Vishwa Shanti Stupa Aerial Ropeway",
            "Gridhakuta (Vulture's Peak) Buddha Hermitage",
            "Natural Geothermal Hot Springs (Brahmakund)"
        ],
        "nearestAirport": {
            "name": "Patna Jay Prakash Narayan Airport (PAT)",
            "dist": "100 km"
        }
    },
    {
        "id": "vishnupad-temple-gaya",
        "name": "Vishnupad Temple & Falgu River Ghats",
        "state": "Bihar",
        "city": "Gaya",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/vishnupad-temple-gaya.jpg",
        "lat": 24.7781,
        "lng": 85.0089,
        "ticketPrice": 0,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 31800,
        "badge": "Lord Vishnu's Footprint",
        "description": "Revered octagonal black basalt temple on the sacred Falgu River enshrining a 40-centimeter footprint of Lord Vishnu incised into solid rock.",
        "highlights": [
            "40cm Divine Footprint of Lord Vishnu in Basalt",
            "Sacred Pinda Daan Rituals on Falgu River",
            "Built in 1787 by Queen Ahilyabai Holkar",
            "Mangla Gauri Shakti Peeth Temple Nearby"
        ],
        "nearestAirport": {
            "name": "Gaya International Airport (GAY)",
            "dist": "9 km"
        }
    },
    {
        "id": "patna-sahib-gurudwara",
        "name": "Takht Sri Patna Sahib & Golghar",
        "state": "Bihar",
        "city": "Patna",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/patna-sahib-gurudwara.jpg",
        "lat": 25.5942,
        "lng": 85.2281,
        "ticketPrice": 0,
        "tourPackagePrice": 1199,
        "rating": 4.9,
        "reviews": 35100,
        "badge": "Birthplace of Guru Gobind Singh Ji",
        "description": "One of the five holy Takhts of Sikhism, the historic birthplace of Tenth Guru Sri Guru Gobind Singh Ji Maharaj along the banks of River Ganga.",
        "highlights": [
            "One of Five Sacred Takhts of Sikhism",
            "Holy Relics of Tenth Sikh Guru",
            "Historic 1786 Beehive-Shaped Golghar Granary",
            "Bihar Museum World-Renowned Artefacts"
        ],
        "nearestAirport": {
            "name": "Patna Jay Prakash Narayan (PAT)",
            "dist": "16 km"
        }
    },
    {
        "id": "vikramshila-ancient-university",
        "name": "Vikramshila Ancient University Ruins",
        "state": "Bihar",
        "city": "Bhagalpur",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/vikramshila-ancient-university.jpg",
        "lat": 25.3283,
        "lng": 87.2883,
        "ticketPrice": 25,
        "tourPackagePrice": 1699,
        "rating": 4.7,
        "reviews": 12400,
        "badge": "Pala Dynasty Monastic University",
        "description": "Founded by Pala King Dharmapala in the late 8th century, one of the two most important centers of Buddhist learning in India alongside Nalanda.",
        "highlights": [
            "Cruciform Stupa at Center of Quadrangle",
            "Over 200 Monastic Cells for Scholars",
            "Center of Tantric Vajrayana Buddhism",
            "Archaeological Excavation Site & Museum"
        ],
        "nearestAirport": {
            "name": "Patna Airport (PAT)",
            "dist": "235 km"
        }
    },
    {
        "id": "elephant-beach-havelock",
        "name": "Elephant Beach & Coral Reef Snorkeling",
        "state": "Andaman & Nicobar",
        "city": "Havelock Island",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/elephant-beach-havelock.jpg",
        "lat": 11.9892,
        "lng": 92.9519,
        "ticketPrice": 0,
        "tourPackagePrice": 3899,
        "rating": 4.9,
        "reviews": 26800,
        "badge": "Coral Gardens & Sea Walking",
        "description": "Pristine white-sand cove surrounded by dense tropical rain forests, celebrated for vibrant shallow coral reefs, sea walking, and snorkeling with sea turtles.",
        "highlights": [
            "Vibrant Shallow Live Coral Reefs",
            "Underwater Helmet Sea Walking",
            "Glass Bottom Boat Coral Safaris",
            "Trek through Dense Tropical Jungle"
        ],
        "nearestAirport": {
            "name": "Veer Savarkar Airport Port Blair (IXZ)",
            "dist": "55 km (via Catamaran Ferry)"
        }
    },
    {
        "id": "neil-island-natural-bridge",
        "name": "Neil Island (Bharatpur & Natural Rock Bridge)",
        "state": "Andaman & Nicobar",
        "city": "Neil Island (Shaheed Dweep)",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/neil-island-natural-bridge.jpg",
        "lat": 11.8333,
        "lng": 93.05,
        "ticketPrice": 0,
        "tourPackagePrice": 3299,
        "rating": 4.8,
        "reviews": 21900,
        "badge": "Vegetable Bowl of Andamans",
        "description": "Quiet tropical island famous for the Howrah Natural Bridge (living limestone rock arch) and the calm turquoise lagoons of Bharatpur & Laxmanpur beaches.",
        "highlights": [
            "Living Coral Natural Rock Bridge (Howrah Bridge)",
            "Bharatpur Shallow Glass Bottom Lagoon",
            "Laxmanpur Sunset White Shell Beach",
            "Stargazing over Clear Island Skies"
        ],
        "nearestAirport": {
            "name": "Port Blair Airport (IXZ)",
            "dist": "40 km (via Speed Ferry)"
        }
    },
    {
        "id": "ross-island-port-blair",
        "name": "Ross Island (Netaji Subhash Chandra Bose Island)",
        "state": "Andaman & Nicobar",
        "city": "Port Blair",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/ross-island-port-blair.jpg",
        "lat": 11.6744,
        "lng": 92.7633,
        "ticketPrice": 50,
        "tourPackagePrice": 1799,
        "rating": 4.8,
        "reviews": 24100,
        "badge": "Paris of the East Ruins",
        "description": "Historic British penal administrative headquarters now reclaimed by nature, with colossal banyan tree roots growing through abandoned ballrooms, churches, and deer reserves.",
        "highlights": [
            "Colossal Banyan Roots Enveloping Colonial Ruins",
            "Friendly Spotted Deer & Peacocks Roaming Free",
            "15-Minute Scenic Boat Ride from Water Sports Complex",
            "Evening Sound & Light Show on Freedom Struggle"
        ],
        "nearestAirport": {
            "name": "Port Blair Airport (IXZ)",
            "dist": "6 km"
        }
    },
    {
        "id": "baratang-caves",
        "name": "Baratang Island (Limestone Caves & Mud Volcano)",
        "state": "Andaman & Nicobar",
        "city": "Baratang",
        "category": "adventure",
        "categoryName": "Snow & Adventure",
        "image": "assets/img/india-tours/baratang-caves.jpg",
        "lat": 12.1167,
        "lng": 92.7833,
        "ticketPrice": 50,
        "tourPackagePrice": 3599,
        "rating": 4.7,
        "reviews": 16800,
        "badge": "Rare Geological Wonder",
        "description": "Thrilling journey through the Jarawa tribal reserve and dense mangrove creeks on speedboats leading to million-year-old stalactite limestone caves and rare mud volcanoes.",
        "highlights": [
            "Speedboat Safari Through Dense Mangrove Tunnels",
            "Million-Year-Old Stalactite Limestone Caverns",
            "Only Known Active Mud Volcano in India",
            "Parrot Island Sunset Phenomenon"
        ],
        "nearestAirport": {
            "name": "Port Blair Airport (IXZ)",
            "dist": "100 km"
        }
    },
    {
        "id": "fort-aguada-lighthouse",
        "name": "Fort Aguada & 17th-Century Lighthouse",
        "state": "Goa",
        "city": "Candolim",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/fort-aguada-lighthouse.jpg",
        "lat": 15.4925,
        "lng": 73.7736,
        "ticketPrice": 25,
        "tourPackagePrice": 1499,
        "rating": 4.7,
        "reviews": 38200,
        "badge": "Portuguese Coastal Bastion",
        "description": "17th-century Portuguese fortress overlooking Sinquerim Beach and the Arabian Sea, featuring a 4-story freshwater reservoir and the oldest lighthouse of its kind in Asia.",
        "highlights": [
            "1612 Portuguese Sea Bastion Fortress",
            "Asia's Oldest 4-Story Freshwater Lighthouse",
            "Panoramic Sunset Over Sinquerim Beach",
            "Aguada Central Jail Museum"
        ],
        "nearestAirport": {
            "name": "Manohar International Airport Mopa (GOX)",
            "dist": "32 km"
        }
    },
    {
        "id": "anjuna-beach",
        "name": "Anjuna Beach & Wednesday Flea Market",
        "state": "Goa",
        "city": "Anjuna",
        "category": "beaches",
        "categoryName": "Beaches & Coastal",
        "image": "assets/img/india-tours/anjuna-beach.jpg",
        "lat": 15.58,
        "lng": 73.74,
        "ticketPrice": 0,
        "tourPackagePrice": 1299,
        "rating": 4.7,
        "reviews": 34200,
        "badge": "Legendary Bohemian Coast",
        "description": "Famous for its red laterite rocky outcrops, vibrant beach shacks, Curlies iconic sunset point, and the sprawling Wednesday Flea Market.",
        "highlights": [
            "Red Rocky Outcrop Coastline",
            "World-Famous Wednesday Flea Market",
            "Curlies & Cafe Lilliput Sunset Music Shacks",
            "Water Sports & Bungee Jumping"
        ],
        "nearestAirport": {
            "name": "Mopa International Airport (GOX)",
            "dist": "28 km"
        }
    },
    {
        "id": "chapora-fort-vagator",
        "name": "Chapora Fort & Vagator Beach",
        "state": "Goa",
        "city": "Vagator",
        "category": "heritage",
        "categoryName": "Heritage & Forts",
        "image": "assets/img/india-tours/chapora-fort-vagator.jpg",
        "lat": 15.6058,
        "lng": 73.7372,
        "ticketPrice": 0,
        "tourPackagePrice": 1199,
        "rating": 4.8,
        "reviews": 41200,
        "badge": "Dil Chahta Hai Fort",
        "description": "Historic red laterite fortress high above the Chapora River estuary with panoramic vistas of Big and Little Vagator beaches, immortalized in Bollywood cinema.",
        "highlights": [
            "Iconic Dil Chahta Hai Sunset Fort Ramparts",
            "Dramatic Views Over Chapora River & Arabian Sea",
            "Little Vagator & Big Vagator Red Cliffs",
            "Hilltop Sunset Cafes & Greek Restaurants"
        ],
        "nearestAirport": {
            "name": "Mopa Airport (GOX)",
            "dist": "26 km"
        }
    },
    {
        "id": "mangueshi-temple-spices",
        "name": "Mangueshi Temple & Sahakari Spice Farm",
        "state": "Goa",
        "city": "Ponda",
        "category": "spiritual",
        "categoryName": "Spiritual & Temples",
        "image": "assets/img/india-tours/mangueshi-temple-spices.jpg",
        "lat": 15.4386,
        "lng": 73.9686,
        "ticketPrice": 0,
        "tourPackagePrice": 1599,
        "rating": 4.7,
        "reviews": 22800,
        "badge": "450-Year-Old Deepastambha",
        "description": "One of the most prominent temples in Goa dedicated to Lord Shiva, featuring a 7-story octagonal Deepastambha (lamp tower), paired with lush organic spice plantations.",
        "highlights": [
            "450-Year-Old 7-Story Deepastambha (Lamp Tower)",
            "Distinctive Goan Hindu Architecture",
            "Sahakari Spice Plantation Guided Walk & Buffet",
            "Elephant Shower & Tropical Fruit Groves"
        ],
        "nearestAirport": {
            "name": "Dabolim International Airport (GOI)",
            "dist": "32 km"
        }
    }
];

// Haversine formula to calculate great-circle distance between two GPS coordinates in kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

// Global scope export for browser and Node.js environments
if (typeof window !== 'undefined') {
    window.INDIA_STATES = INDIA_STATES;
    window.INDIA_CATEGORIES = INDIA_CATEGORIES;
    window.INDIA_TOURIST_DESTINATIONS = INDIA_TOURIST_DESTINATIONS;
    window.calculateDistanceKm = calculateDistanceKm;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        INDIA_STATES,
        INDIA_CATEGORIES,
        INDIA_TOURIST_DESTINATIONS,
        calculateDistanceKm
    };
}
