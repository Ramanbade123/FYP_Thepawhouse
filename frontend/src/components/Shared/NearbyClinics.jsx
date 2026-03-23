import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, ExternalLink, Loader2, HeartPulse, Building2, Clock, Globe, MessageSquare, Bookmark, Share2, Star, Car } from 'lucide-react';

const NearbyClinics = () => {
  const [location, setLocation] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // 1. Get User Location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (err) => {
        console.warn('Geolocation denied or failed. Using fallback coordinates (Kathmandu).', err);
        // Fallback coordinates (e.g. general area of Kathmandu for the demo)
        setLocation({ lat: 27.7172, lon: 85.3240 });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity }
    );
  }, [retryCount]);

  // --- ADD YOUR CLINIC DATA HERE ---
  // You can list your locations and details manually below.
  const CUSTOM_CLINICS = [
    {
      id: "clinic_1",
      name: "Jibachha Veterinary",
      address: "P89F+4C4, Kathmandu 00977",
      phone: "982-3651008",
      website: "",
      opening_hours: "Open · Closes 6:30 PM",
      lat: 27.7172,
      lon: 85.3240,
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
      rating: 4.2,
      reviews: 217,
      imageUrl: "https://images.unsplash.com/photo-1596272875886-f6313ed6c99f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  // 2. Load Custom Clinics
  useEffect(() => {
    // If you need distance, we map it here:
    if (location) {
        const mappedClinics = CUSTOM_CLINICS.map(clinic => ({
            ...clinic,
            // calculate distance from user location
            distance: calculateDistance(location.lat, location.lon, clinic.lat, clinic.lon)
        })).sort((a, b) => a.distance - b.distance);
        
        setClinics(mappedClinics);
    } else {
        // If location not available yet, just show them as-is
        setClinics(CUSTOM_CLINICS);
    }
    setLoading(false);
  }, [location]);

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

  // Generate deterministic dummy rating data for the demo
  const getDummyRating = (idStr) => {
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);
    const rating = 3.5 + (absHash % 15) / 10; // 3.5 to 4.9
    const reviews = 10 + (absHash % 500);
    const driveTime = 5 + (absHash % 30);
    return { rating: rating.toFixed(1), reviews, driveTime };
  };

  const mapBoxStyle = {
    background: '#1a1a1a', // Fallback
    backgroundImage: `url('https://maps.geoapify.com/v1/staticmap?style=dark-matter&width=600&height=400&center=lonlat:85.3240,27.7172&zoom=12&apiKey=YOUR_API_KEY_HERE')`, // Requires API key for real use, but we'll use a placeholder styling
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <Loader2 className="h-8 w-8 text-[#008737] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Finding veterinary clinics near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-2xl border border-red-100 min-h-[400px]">
        <HeartPulse className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-red-800 font-bold mb-2">Oops!</h3>
        <p className="text-red-600 text-center max-w-md mb-6">{error}</p>
        <button 
          onClick={() => setRetryCount(c => c + 1)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nearby Veterinary Clinics</h2>
        </div>
      </div>

      {clinics.length === 0 ? (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-12 text-center">
          <Building2 className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-orange-900 mb-2">No clinics found nearby</h3>
          <p className="text-orange-700">We couldn't find any registered veterinary clinics within 5km of your location on OpenStreetMap.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {clinics.map((clinic) => {
            const rating = clinic.rating || 4.0;
            const reviews = clinic.reviews || 0;
            
            // Generate a simple dummy drive time based on distance if available
            const driveTime = clinic.distance ? Math.round(clinic.distance * 3) : 10;
            
            // Use Google Maps generic embed URL with the clinic's name and address
            const mapQuery = encodeURIComponent(`${clinic.name}, ${clinic.address}`);
            const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&hl=en&z=15&output=embed`;
            
            return (
            <div key={clinic.id} className="bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-lg border-b-4 border-b-[#008737]/20 overflow-hidden flex flex-col font-sans mb-4">
              
              {/* Map Header */}
              <div className="h-32 sm:h-40 w-full relative bg-gray-100 overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={mapUrl}
                  className="w-full h-full opacity-90 transition-opacity pointer-events-none"
                ></iframe>
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-900 shadow-sm border border-gray-200">
                  See Map
                </div>
              </div>

              {/* Main Info */}
              <div className="p-4 sm:p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{clinic.name}</h3>
                
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="text-gray-700 font-medium">{rating}</span>
                  <div className="flex scale-90 origin-left">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-[#008737] hover:text-[#063630] font-medium cursor-pointer">{reviews} Reviews</span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">Veterinarian in {clinic.address.split(',').pop()?.trim() || 'your area'}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-100 pb-4">
                  {clinic.website && (
                    <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[#008737] font-semibold text-sm">
                      <Globe className="h-3.5 w-3.5" /> Website
                    </a>
                  )}
                  <a href={getGoogleMapsLink(clinic.address, clinic.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#008737] bg-[#008737] hover:bg-[#063630] transition-colors text-white hover:text-white font-semibold shadow-sm text-sm">
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

                {/* Detailed Details */}
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
                      {clinic.opening_hours !== 'Varies' ? (
                        <span>{clinic.opening_hours}</span>
                      ) : (
                        <>
                          <span className="text-red-500 font-bold">Closed</span>
                          <span>· Opens 8:00 AM</span>
                        </>
                      )}
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
