import { useState, useEffect } from 'react';
import { Stethoscope, Search, AlertCircle, ChevronDown, ChevronUp, Shield, Zap, Users, Activity, Bug, Wind, Info, HeartPulse } from 'lucide-react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = (extra = {}) => {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra };
};
const apiFetch = async (method, url, body = null, isForm = false) => {
  const token = localStorage.getItem('token');
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  if (!isForm && body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${url}`, { method, headers, body: isForm ? body : (body ? JSON.stringify(body) : undefined) });
  const data = await res.json();
  if (!res.ok) throw { response: { data } };
  return { data };
};


const CATEGORIES = ['all', 'viral', 'bacterial', 'parasitic', 'fungal', 'nutritional', 'genetic', 'other'];

const SEVERITY_STYLES = {
  mild:     { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200', label: 'Mild'     },
  moderate: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Moderate' },
  severe:   { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Severe'   },
  fatal:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200', label: 'Fatal'    },
};

const CATEGORY_ICONS = {
  viral: <Activity className="w-5 h-5 text-purple-500" />,
  bacterial: <Bug className="w-5 h-5 text-emerald-500" />,
  parasitic: <Bug className="w-5 h-5 text-orange-500" />,
  fungal: <Wind className="w-5 h-5 text-blue-500" />,
  genetic: <HeartPulse className="w-5 h-5 text-rose-500" />,
  other: <Info className="w-5 h-5 text-gray-500" />
};

// Seeded diseases shown when DB is empty
const SEED_DISEASES = [
  { _id: '1', name: 'Rabies', category: 'viral', severity: 'fatal', isContagious: true, zoonoticRisk: true, commonInNepal: true, affectedArea: 'Nervous System', symptoms: ['Aggression', 'Excessive drooling', 'Paralysis', 'Fear of water', 'Disorientation'], causes: ['Bite from infected animal'], prevention: ['Annual vaccination', 'Avoid contact with strays', 'Report bites immediately'], treatment: 'No cure once symptoms appear. Vaccination before exposure is the only protection.' },
  { _id: '2', name: 'Canine Distemper', category: 'viral', severity: 'severe', isContagious: true, zoonoticRisk: false, commonInNepal: true, affectedArea: 'Respiratory / Nervous', symptoms: ['Fever', 'Nasal discharge', 'Coughing', 'Seizures', 'Hardened paw pads'], causes: ['Paramyxovirus', 'Contact with infected dogs'], prevention: ['DHPP vaccination', 'Avoid unvaccinated dogs'], treatment: 'Supportive care. No specific antiviral. Vaccination is key prevention.' },
  { _id: '3', name: 'Parvovirus', category: 'viral', severity: 'fatal', isContagious: true, zoonoticRisk: false, commonInNepal: true, affectedArea: 'Digestive System', symptoms: ['Severe vomiting', 'Bloody diarrhoea', 'Lethargy', 'Loss of appetite', 'Fever'], causes: ['Canine parvovirus', 'Contact with infected faeces'], prevention: ['DHPP vaccination series', 'Avoid contaminated areas'], treatment: 'IV fluids, antibiotics, hospitalisation. High mortality without treatment.' },
  { _id: '4', name: 'Kennel Cough', category: 'bacterial', severity: 'mild', isContagious: true, zoonoticRisk: false, commonInNepal: true, affectedArea: 'Respiratory', symptoms: ['Persistent honking cough', 'Runny nose', 'Sneezing', 'Mild fever'], causes: ['Bordetella bronchiseptica', 'Parainfluenza virus'], prevention: ['Bordetella vaccine', 'Avoid crowded dog areas'], treatment: 'Usually resolves in 1-3 weeks. Antibiotics for severe cases.' },
  { _id: '5', name: 'Leptospirosis', category: 'bacterial', severity: 'severe', isContagious: true, zoonoticRisk: true, commonInNepal: true, affectedArea: 'Kidneys / Liver', symptoms: ['Fever', 'Vomiting', 'Jaundice', 'Muscle pain', 'Reluctance to move'], causes: ['Leptospira bacteria', 'Contact with contaminated water or soil'], prevention: ['Lepto vaccine', 'Avoid stagnant water', 'Rodent control'], treatment: 'Antibiotics (penicillin/doxycycline). Early treatment critical.' },
  { _id: '6', name: 'Tick Fever (Ehrlichiosis)', category: 'bacterial', severity: 'moderate', isContagious: false, zoonoticRisk: false, commonInNepal: true, affectedArea: 'Blood / Immune System', symptoms: ['Fever', 'Lethargy', 'Loss of appetite', 'Bleeding', 'Swollen lymph nodes'], causes: ['Ehrlichia bacteria carried by ticks'], prevention: ['Regular tick prevention', 'Tick collars/spot-on treatments', 'Check for ticks'], treatment: 'Doxycycline antibiotics. Blood transfusion in severe cases.' },
  { _id: '7', name: 'Mange (Scabies)', category: 'parasitic', severity: 'moderate', isContagious: true, zoonoticRisk: true, commonInNepal: true, affectedArea: 'Skin', symptoms: ['Intense itching', 'Hair loss', 'Crusty skin', 'Sores', 'Red skin'], causes: ['Sarcoptes scabiei mites'], prevention: ['Regular grooming', 'Avoid contact with infected animals', 'Keep environment clean'], treatment: 'Medicated shampoos, ivermectin injections, topical treatments.' },
  { _id: '8', name: 'Hookworm', category: 'parasitic', severity: 'moderate', isContagious: false, zoonoticRisk: true, commonInNepal: true, affectedArea: 'Digestive / Blood', symptoms: ['Anaemia', 'Weakness', 'Dark tarry stools', 'Weight loss', 'Poor coat'], causes: ['Ancylostoma caninum', 'Contact with contaminated soil'], prevention: ['Regular deworming', 'Clean living environment', 'Avoid contaminated areas'], treatment: 'Antiparasitic drugs (fenbendazole, pyrantel). Iron supplements if anaemic.' },
  { _id: '9', name: 'Ringworm', category: 'fungal', severity: 'mild', isContagious: true, zoonoticRisk: true, commonInNepal: false, affectedArea: 'Skin', symptoms: ['Circular bald patches', 'Scaly skin', 'Itching', 'Broken hairs'], causes: ['Microsporum canis fungus'], prevention: ['Clean bedding', 'Avoid infected animals', 'Wash hands after handling dogs'], treatment: 'Antifungal shampoo, oral antifungals for severe cases. Takes 4-6 weeks.' },
  { _id: '10', name: 'Hip Dysplasia', category: 'genetic', severity: 'moderate', isContagious: false, zoonoticRisk: false, commonInNepal: false, affectedArea: 'Joints', symptoms: ['Limping', 'Difficulty rising', 'Reduced activity', 'Pain in hips', 'Muscle wasting'], causes: ['Genetic predisposition', 'Rapid growth', 'Obesity'], prevention: ['Responsible breeding', 'Healthy weight', 'Avoid over-exercise in puppies'], treatment: 'Weight management, anti-inflammatories, physiotherapy, surgery in severe cases.' },
];

const DiseaseCard = ({ disease }) => {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_STYLES[disease.severity] || SEVERITY_STYLES.moderate;
  const CatIcon = CATEGORY_ICONS[disease.category] || CATEGORY_ICONS.other;

  return (
    <div className={`bg-white rounded-3xl border ${expanded ? sev.border : 'border-gray-100'} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group`}>
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${sev.bg} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {CatIcon}
            </div>
            <div>
              <h3 className="font-bold text-[#063630] text-lg leading-tight group-hover:text-[#008737] transition-colors">{disease.name}</h3>
              <p className="text-sm text-gray-500 capitalize mt-0.5 font-medium">{disease.category} • {disease.affectedArea}</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 border ${sev.bg} ${sev.text} ${sev.border}`}>
            {sev.label}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {disease.isContagious  && <span className="flex items-center gap-1.5 text-xs bg-orange-50/80 text-orange-700 px-2.5 py-1 rounded-lg font-semibold border border-orange-100/50"><Zap className="h-3.5 w-3.5 text-orange-500" /> Contagious</span>}
          {disease.zoonoticRisk  && <span className="flex items-center gap-1.5 text-xs bg-red-50/80 text-red-700 px-2.5 py-1 rounded-lg font-semibold border border-red-100/50"><Users className="h-3.5 w-3.5 text-red-500" /> Risk to Humans</span>}
          {disease.commonInNepal && <span className="flex items-center gap-1.5 text-xs bg-blue-50/80 text-blue-700 px-2.5 py-1 rounded-lg font-semibold border border-blue-100/50"><Shield className="h-3.5 w-3.5 text-blue-500" /> Common in Nepal</span>}
        </div>

        {/* Symptoms preview */}
        <div className="mb-4 flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Symptoms</p>
          <div className="flex flex-wrap gap-1.5">
            {disease.symptoms?.slice(0, expanded ? undefined : 3).map((s, i) => (
              <span key={i} className="text-[13px] bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">{s}</span>
            ))}
            {!expanded && disease.symptoms?.length > 3 && (
              <span className="text-[13px] text-[#008737] bg-[#008737]/5 px-2.5 py-1 rounded-lg font-semibold">+{disease.symptoms.length - 3} more</span>
            )}
          </div>
        </div>

        <button onClick={() => setExpanded(p => !p)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-2 rounded-xl text-sm font-semibold transition-colors bg-gray-50 hover:bg-[#008737] text-gray-600 hover:text-white group">
          {expanded ? <><ChevronUp className="h-4 w-4" /> View Less</> : <><ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" /> Full Details</>}
        </button>
      </div>

      {/* Expanded Content */}
      <div className={`transition-all duration-300 ease-in-out border-t overflow-hidden ${expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 border-transparent'}`} style={expanded ? { borderColor: 'rgba(0,135,55,0.1)' } : {}}>
        <div className="p-6 bg-gray-50/50 space-y-5">
          {disease.causes?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Causes
              </p>
              <ul className="space-y-1.5">
                {disease.causes.map((c, i) => (
                  <li key={i} className="text-[13px] text-gray-700 flex items-start gap-2 leading-relaxed">
                    <span className="text-gray-400 mt-0.5">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {disease.prevention?.length > 0 && (
            <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Prevention
              </p>
              <ul className="space-y-1.5">
                {disease.prevention.map((p, i) => (
                  <li key={i} className="text-[13px] text-green-800 flex items-start gap-2 leading-relaxed">
                    <span className="text-green-500 mt-0.5 font-bold">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {disease.treatment && (
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Treatment
              </p>
              <p className="text-[13px] text-blue-900 leading-relaxed">{disease.treatment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DiseaseAwarenessPage = () => {
  const [diseases, setDiseases]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('all');

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('GET', '/diseases');
      setDiseases(res.data.data?.length > 0 ? res.data.data : SEED_DISEASES);
    } catch {
      setDiseases(SEED_DISEASES);
    } finally {
      setLoading(false);
    }
  };

  const filtered = diseases.filter(d => {
    const matchCat    = category === 'all' || d.category === category;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.affectedArea?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#EDEDED', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#063630] to-[#085558] text-white py-14 px-4 mb-10">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#008737]/30 text-green-200 px-4 py-2 rounded-full mb-5 text-sm font-semibold">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            Health & Wellness — Nepal
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#ffffff' }}>Dog Disease Awareness</h1>
          <p className="text-green-200 text-lg mb-8">Know the signs, prevent the spread, protect your dog</p>
          <div className="flex items-center justify-center gap-8">
            <div><p className="text-4xl font-bold" style={{ color: '#ffffff' }}>{diseases.length}+</p><p className="text-green-200 text-sm mt-1">Diseases Covered</p></div>
            <div className="w-px h-12 bg-white/20" />
            <div><p className="text-4xl font-bold" style={{ color: '#ffffff' }}>{diseases.filter(d => d.commonInNepal).length}</p><p className="text-green-200 text-sm mt-1">Common in Nepal</p></div>
            <div className="w-px h-12 bg-white/20" />
            <div><p className="text-4xl font-bold" style={{ color: '#ffffff' }}>{diseases.filter(d => d.zoonoticRisk).length}</p><p className="text-green-200 text-sm mt-1">Risk to Humans</p></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#008737]/10 p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[200px]" style={{ backgroundColor: '#EDEDED' }}>
            <Search className="h-4 w-4 text-[#063630]/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by disease name or affected area..."
              className="bg-transparent text-sm focus:outline-none w-full text-[#063630] placeholder-[#063630]/40" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  category === c ? 'bg-gradient-to-r from-[#008737] to-[#085558] text-white shadow-sm' : 'text-[#063630]/60 hover:text-[#063630]'
                }`}
                style={category !== c ? { backgroundColor: '#EDEDED' } : {}}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#008737] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Stethoscope className="h-16 w-16 mx-auto mb-4" style={{ color: 'rgba(6,54,48,0.15)' }} />
            <p className="text-[#063630]/60">No diseases found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(d => <DiseaseCard key={d._id} disease={d} />)}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 bg-white border border-[#008737]/15 rounded-2xl p-5 flex gap-3">
          <AlertCircle className="h-5 w-5 text-[#008737] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#063630]/80">This information is for educational purposes only. Always consult a licensed veterinarian for diagnosis and treatment of your dog.</p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseAwarenessPage;