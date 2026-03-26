import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PawPrint, Calendar, MapPin, Heart, Scale,
  Search, Filter, ChevronLeft, ChevronRight,
  Bone, Shield, Home, Star, X, SlidersHorizontal
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");

const FILTERS = [
  { id: "all",        label: "All Dogs" },
  { id: "puppies",    label: "Puppies (0-1 year)" },
  { id: "medium",     label: "Medium Size" },
  { id: "kathmandu",  label: "Kathmandu Valley" },
  { id: "female",     label: "Female" },
  { id: "male",       label: "Male" },
];

const SIZES  = ["", "Small", "Medium", "Large", "Extra Large"];
const CITIES = ["", "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Chitwan", "Other"];

const PER_PAGE = 6;

// Safely convert any value to a renderable string
const safeStr = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") {
    if (val.value !== undefined) return `${val.value}${val.unit ? " " + val.unit : ""}`;
    return JSON.stringify(val);
  }
  return String(val);
};

const imgSrc = (pet) => {
  const img = pet.primaryImage || (pet.images && pet.images[0]);
  if (!img) return "https://placehold.co/400x300?text=No+Photo";
  let fullUrl = img;
  if (!img.startsWith('http') && !img.startsWith('/')) {
    fullUrl = `/uploads/pets/${img}`;
  }
  if (fullUrl.startsWith("http")) return fullUrl;
  return `${BASE_URL}${fullUrl}`;
};

const ageLabel = (pet) => {
  if (pet.age && typeof pet.age === "object") {
    const v = pet.age.value;
    const u = pet.age.unit || "years";
    if (v === undefined || v === null) return "Unknown age";
    return `${v} ${u}`;
  }
  return safeStr(pet.age) || "Unknown age";
};

const isPuppy = (pet) => {
  if (pet.age && typeof pet.age === "object") {
    return pet.age.unit === "months" || (pet.age.unit === "years" && pet.age.value <= 1);
  }
  return false;
};

const isKathmandu = (pet) => {
  const loc = (pet.location?.city || pet.location || "").toLowerCase();
  return ["kathmandu", "lalitpur", "bhaktapur", "ktm"].some(k => loc.includes(k));
};

const Pets = () => {
  const navigate = useNavigate();
  const [pets,        setPets]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [favorites,   setFavorites]   = useState(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u?.favorites || [];
  });
  const [page,        setPage]        = useState(1);
  const [total,       setTotal]       = useState(0);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter,setActiveFilter]= useState("all");
  const [showAdv,     setShowAdv]     = useState(false);
  const [advSize,     setAdvSize]     = useState("");
  const [advCity,     setAdvCity]     = useState("");
  const [advGender,   setAdvGender]   = useState("");
  const [advVaccinated, setAdvVaccinated] = useState(false);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE, status: "available" });
      if (search)      params.set("search", search);
      if (advSize)     params.set("size", advSize);
      if (advCity)     params.set("city", advCity);
      if (advGender)   params.set("gender", advGender);

      const res  = await fetch(`${API}/pets?${params}`);
      const data = await res.json();
      if (data.success) {
        let results = data.data || [];

        // Client-side filter chip logic
        if (activeFilter === "puppies")   results = results.filter(isPuppy);
        if (activeFilter === "medium")    results = results.filter(p => p.size === "Medium");
        if (activeFilter === "kathmandu") results = results.filter(isKathmandu);
        if (activeFilter === "female")    results = results.filter(p => p.gender === "female");
        if (activeFilter === "male")      results = results.filter(p => p.gender === "male");
        if (advVaccinated)                results = results.filter(p => p.vaccinated);

        setPets(results);
        setTotal(activeFilter === "all" && !advVaccinated ? (data.total || results.length) : results.length);
      }
    } catch (err) {
      console.error("Fetch pets error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, activeFilter, advSize, advCity, advGender, advVaccinated]);

  useEffect(() => { fetchPets(); }, [fetchPets]);

  // Reset to page 1 on filter/search change
  useEffect(() => { setPage(1); }, [search, activeFilter, advSize, advCity, advGender, advVaccinated]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setSearch(""); setSearchInput(""); setActiveFilter("all");
    setAdvSize(""); setAdvCity(""); setAdvGender(""); setAdvVaccinated(false);
    setPage(1);
  };

  const hasActiveFilters = search || activeFilter !== "all" || advSize || advCity || advGender || advVaccinated;

  const toggleFavorite = async (id, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login to save favorites!");
    
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    try {
      const res = await fetch(`${API}/users/favorites/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFavorites(data.data);
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        u.favorites = data.data;
        localStorage.setItem('user', JSON.stringify(u));
      }
    } catch (error) { console.error('Favorite toggle failed', error); }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <section id="adopt" className="py-16 lg:py-24 bg-[#EDEDED]">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-[#008737]/10 text-[#008737] px-4 py-2 rounded-full mb-6"
          >
            <Bone className="h-4 w-4" />
            <span className="text-sm font-semibold">Meet Our Friends</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#063630] mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008737] to-[#085558]">Perfect Companion</span>
          </h2>
          <p className="text-base lg:text-lg text-[#063630]/80 max-w-[65ch] text-longform mx-auto">
            Discover loyal dogs waiting for their forever homes. Every adoption saves a life.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#008737]/10 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by breed, location, or name..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#008737] focus:ring-2 focus:ring-[#008737]/20 transition-all text-[#063630]"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-[#008737] to-[#085558] text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                <Search className="h-4 w-4" /> Search
              </button>
              <button type="button" onClick={() => setShowAdv(p => !p)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border transition-all ${showAdv ? "bg-[#063630] text-white border-[#063630]" : "border-gray-200 text-[#063630] hover:bg-gray-50"}`}>
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-3 rounded-xl text-red-500 border border-red-200 hover:bg-red-50 transition-all text-sm font-semibold">
                  <X className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
          </form>

          {/* Advanced filters panel */}
          {showAdv && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Size</label>
                <select value={advSize} onChange={e => setAdvSize(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]">
                  <option value="">Any size</option>
                  {SIZES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">City</label>
                <select value={advCity} onChange={e => setAdvCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]">
                  <option value="">Any city</option>
                  {CITIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Gender</label>
                <select value={advGender} onChange={e => setAdvGender(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#008737]">
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={advVaccinated} onChange={e => setAdvVaccinated(e.target.checked)}
                    className="w-4 h-4 accent-[#008737]" />
                  <span className="text-sm font-semibold text-[#063630]">Vaccinated only</span>
                </label>
              </div>
            </div>
          )}

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f.id
                    ? "bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md"
                    : "bg-gray-100 text-[#063630] hover:bg-gray-200"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-6">
            {total > 0 ? `Showing ${pets.length} of ${total} available dog${total !== 1 ? "s" : ""}` : ""}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-[#008737] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && pets.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <PawPrint className="h-14 w-14 mx-auto mb-4 text-gray-200" />
            <p className="text-lg font-bold text-[#063630] mb-2">No dogs found</p>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters}
              className="px-6 py-2.5 bg-gradient-to-r from-[#008737] to-[#085558] text-white rounded-xl font-semibold hover:shadow-md transition-all">
              Clear Filters
            </button>
          </div>
        )}

        {/* Dogs Grid */}
        {!loading && pets.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {pets.map((dog, i) => (
              <motion.div key={dog._id}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#008737]/10 group cursor-pointer"
                onClick={() => navigate(`/dogs/${dog._id}`)}
              >
                {/* Image */}
                <div className="relative h-64 lg:h-72 overflow-hidden">
                  <img src={imgSrc(dog)} alt={dog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = "https://placehold.co/400x300?text=No+Photo"; }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#008737] text-white text-xs font-semibold rounded-full shadow-md">
                      Available
                    </span>
                  </div>
                  <button onClick={(e) => toggleFavorite(dog._id, e)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors shadow-sm z-10">
                    <Heart className={`h-5 w-5 ${favorites.includes(dog._id) ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063630]/50 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#063630]">{safeStr(dog.name)}</h3>
                      <p className="text-[#008737] font-medium text-sm">{safeStr(dog.breed)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dog.gender === "female" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"}`}>
                      {dog.gender === "female" ? "♀ Female" : "♂ Male"}
                    </span>
                  </div>

                  <p className="text-[#063630]/70 text-sm mb-4 line-clamp-2">{safeStr(dog.description || dog.personality)}</p>

                  <div className="space-y-2 mb-4 text-sm text-[#063630]/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#008737] flex-shrink-0" />
                      {ageLabel(dog)}
                    </div>
                    {(dog.size || dog.weight) && (
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-[#008737] flex-shrink-0" />
                        {dog.weight ? `${safeStr(dog.weight)} • ` : ""}{safeStr(dog.size)} size
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#008737] flex-shrink-0" />
                      {typeof dog.location === "object"
                        ? [dog.location?.city, dog.location?.province].filter(Boolean).join(", ") || "Nepal"
                        : safeStr(dog.location) || "Nepal"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {dog.vaccinated && (
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Shield className="h-3 w-3" /> Vaccinated
                      </span>
                    )}
                    {dog.trained && (
                      <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        <Star className="h-3 w-3" /> Trained
                      </span>
                    )}
                  </div>

                  <button onClick={e => { e.stopPropagation(); navigate(`/dogs/${dog._id}`); }}
                    className="w-full bg-gradient-to-r from-[#008737] to-[#085558] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Meet {safeStr(dog.name)}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className={`p-3 rounded-full transition-colors ${page === 1 ? "text-gray-300 cursor-not-allowed" : "text-[#063630] hover:bg-[#008737]/10"}`}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full font-semibold transition-all ${page === i + 1 ? "bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-md" : "text-[#063630] hover:bg-[#008737]/10"}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className={`p-3 rounded-full transition-colors ${page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-[#063630] hover:bg-[#008737]/10"}`}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pets;