import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Loader2, HeartPulse, Building2, Clock, Globe, MessageSquare, Bookmark, Share2, Star, Car } from 'lucide-react';

const NearbyClinics = ({ currentUser }) => {
  const [location, setLocation] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Kathmandu');

  // Expanded database covering major cities in Nepal
  const CUSTOM_CLINICS = [
    // Kathmandu
    {
      id: "clinic_1",
      name: "Jibachha Veterinary",
      address: "P89F+4C4, Kathmandu 00977",
      phone: "982-3651008",
      website: "",
      opening_hours: "Open · Closes 6:30 PM",
      lat: 27.7172,
      lon: 85.3240,
      city: "Kathmandu",
      rating: 5.0,
      reviews: 1,
      imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "clinic_2",
      name: "Kathmandu Veterinary Clinic",
      address: "Chakrapath Ring Rd, Kathmandu 44600",
      phone: "01-4720266",
      website: "",
      opening_hours: "Closed · Opens 5:30 PM",
      lat: 27.7289,
      lon: 85.3333,
      city: "Kathmandu",
      rating: 3.9,
      reviews: 56,
      imageUrl: "https://images.unsplash.com/photo-1628009368231-7bb7cbcb0def?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "clinic_3",
      name: "Vet for Your Pet",
      address: "P8HQ+6HJ, Banshidhar Marg, Kathmandu 44600",
      phone: "01-4543505",
      website: "",
      opening_hours: "Open · Closes 6:00 PM",
      lat: 27.7344,
      lon: 85.3323,
      city: "Kathmandu",
      rating: 4.2,
      reviews: 217,
      imageUrl: "https://images.unsplash.com/photo-1596272875886-f6313ed6c99f?q=80&w=800&auto=format&fit=crop"
    },
    // Pokhara
    {
      id: "clinic_pk_1",
      name: "Pokhara Veterinary Hospital",
      address: "Near Zero KM, Pokhara 33700",
      phone: "061-521124",
      website: "",
      opening_hours: "Open · Closes 5:00 PM",
      lat: 28.2167,
      lon: 83.9833,
      city: "Pokhara",
      rating: 4.5,
      reviews: 84,
      imageUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "clinic_pk_2",
      name: "Western Veterinary Clinic",
      address: "New Road, Pokhara 33700",
      phone: "061-538942",
      website: "",
      opening_hours: "Open · Closes 6:30 PM",
      lat: 28.2100,
      lon: 83.9900,
      city: "Pokhara",
      rating: 4.3,
      reviews: 62,
      imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "clinic_pk_3",
      name: "Himalayan Vet Services",
      address: "Lakeside Rd, Pokhara 33700",
      phone: "984-6023451",
      website: "",
      opening_hours: "Open 24 Hours",
      lat: 28.2096,
      lon: 83.9589,
      city: "Pokhara",
      rating: 4.8,
      reviews: 125,
      imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop"
    },
    // Bharatpur
    {
        id: "clinic_bh_1",
        name: "Chitwan Veterinary Hospital",
        address: "Bharatpur Height, Chitwan 44200",
        phone: "056-521456",
        website: "",
        opening_hours: "Open · Closes 7:00 PM",
        lat: 27.6750,
        lon: 84.4300,
        city: "Bharatpur",
        rating: 4.6,
        reviews: 95,
        imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "clinic_bh_2",
        name: "Bharatpur Pet Clinic",
        address: "Chaubiskoti, Bharatpur 44200",
        phone: "056-571234",
        website: "",
        opening_hours: "Open · Closes 6:00 PM",
        lat: 27.6800,
        lon: 84.4350,
        city: "Bharatpur",
        rating: 4.1,
        reviews: 42,
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
    },
    // Bhaktapur
    {
        id: "clinic_bkt_1",
        name: "Bhaktapur Veterinary Hospital",
        address: "Madhyapur Thimi, Bhaktapur 44800",
        phone: "01-6630234",
        website: "",
        opening_hours: "Open · Closes 5:30 PM",
        lat: 27.6757,
        lon: 85.3742,
        city: "Bhaktapur",
        rating: 4.4,
        reviews: 28,
        imageUrl: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "clinic_bkt_2",
        name: "Sallaghari Vet Clinic",
        address: "Sallaghari, Bhaktapur 44800",
        phone: "985-1023456",
        website: "",
        opening_hours: "Open · Closes 7:00 PM",
        lat: 27.6715,
        lon: 85.4132,
        city: "Bhaktapur",
        rating: 4.2,
        reviews: 15,
        imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop"
    }
  ];

  // Set initial city based on user data
  useEffect(() => {
    if (currentUser) {
        const userCity = currentUser?.address?.city || currentUser?.city;
        if (userCity) setSelectedCity(userCity);
    }
  }, [currentUser]);

  // Try to get precise location for distance sorting
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => { /* Ignore errors, distance sorting just won't apply */ }
      );
    }
  }, []);

  // Filter clinics by selected city
  useEffect(() => {
    setLoading(true);
    let filteredClinics = CUSTOM_CLINICS;
    
    if (selectedCity && selectedCity !== 'All') {
        filteredClinics = CUSTOM_CLINICS.filter(clinic => 
            clinic.city.toLowerCase() === selectedCity.toLowerCase()
        );
    }

    if (location) {
        let mappedClinics = filteredClinics.map(clinic => ({
            ...clinic,
            distance: calculateDistance(location.lat, location.lon, clinic.lat, clinic.lon)
        }));
        mappedClinics.sort((a, b) => a.distance - b.distance);
        setClinics(mappedClinics);
    } else {
        setClinics(filteredClinics);
    }
    setLoading(false);
  }, [location, selectedCity]);

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth max radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  };

  const getGoogleMapsLink = (address, name) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name + ', ' + address)}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <Loader2 className="h-8 w-8 text-[#008737] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Finding veterinary clinics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap pl-2">City Filter:</label>
            <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#008737] bg-gray-50 text-gray-800 font-medium"
            >
                <option value="All">All Cities</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Bhaktapur">Bhaktapur</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Bharatpur">Bharatpur</option>
                <option value="Butwal">Butwal</option>
                <option value="Biratnagar">Biratnagar</option>
            </select>
        </div>
      </div>

      {clinics.length === 0 ? (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-12 text-center">
          <Building2 className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-orange-900 mb-2">No clinics found {selectedCity !== 'All' ? `in ${selectedCity}` : ''}</h3>
          <p className="text-orange-700">We currently don't have any registered veterinary clinics for this specific city.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {clinics.map((clinic) => {
            const rating = clinic.rating || 4.0;
            const reviews = clinic.reviews || 0;
            const mapQuery = encodeURIComponent(`${clinic.name}, ${clinic.address}`);
            const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&hl=en&z=15&output=embed`;
            
            return (
            <div key={clinic.id} className="bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-lg border-b-4 border-b-[#008737]/20 overflow-hidden flex flex-col font-sans mb-4">
              <div className="h-32 sm:h-40 w-full relative bg-gray-100 overflow-hidden">
                <iframe 
                  width="100%" height="100%" frameBorder="0" scrolling="no" 
                  src={mapUrl}
                  className="w-full h-full opacity-90 pointer-events-none"
                ></iframe>
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 shadow-sm border border-gray-200">
                  See Map
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{clinic.name}</h3>
                
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="text-gray-700 font-medium">{rating}</span>
                  <div className="flex scale-90 origin-left">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-[#008737] font-medium">{reviews} Reviews</span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">Veterinarian in {clinic.city}</p>

                <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-100 pb-4">
                  <a href={getGoogleMapsLink(clinic.address, clinic.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#008737] bg-[#008737] hover:bg-[#063630] transition-colors text-white font-semibold shadow-sm text-sm">
                    <Navigation className="h-3.5 w-3.5" /> Directions
                  </a>
                  {clinic.phone !== 'N/A' && (
                    <a href={`tel:${clinic.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[#008737] font-semibold text-sm">
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium text-sm">
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex gap-4">
                    <span className="font-bold text-gray-900 min-w-[70px]">Address:</span>
                    <span className="text-gray-700">{clinic.address}</span>
                  </div>
                  {clinic.phone !== 'N/A' && (
                    <div className="flex gap-4">
                      <span className="font-bold text-gray-900 min-w-[70px]">Phone:</span>
                      <a href={`tel:${clinic.phone}`} className="text-[#008737] hover:underline font-medium">{clinic.phone}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900 min-w-[70px]">Hours:</span>
                    <div className="text-gray-700 flex items-center gap-2">
                       <span>{clinic.opening_hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NearbyClinics;
