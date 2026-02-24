import { CheckCircle, Upload, Edit } from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Complete Profile',        completed: true  },
  { step: 2, title: 'List Your Dog',           completed: true  },
  { step: 3, title: 'Review Applications',     completed: false },
  { step: 4, title: 'Meet Potential Adopters', completed: false },
  { step: 5, title: 'Finalize Adoption',       completed: false },
];

const RehomingProgress = () => {
  const completedCount = STEPS.filter(s => s.completed).length;
  const progressPct = Math.round((completedCount / STEPS.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#063630]">Rehoming Progress</h2>
        <span className="text-sm font-semibold text-[#085558]">{progressPct}% complete</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#085558] to-[#008737] rounded-full transition-all duration-700"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex items-start justify-between mb-8">
        {/* connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-[#085558] to-[#008737] z-0 transition-all duration-700"
          style={{ width: `${progressPct}%` }}
        />

        {STEPS.map((step) => (
          <div key={step.step} className="relative z-10 flex flex-col items-center gap-2" style={{ width: '20%' }}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
              step.completed
                ? 'bg-gradient-to-r from-[#085558] to-[#008737] border-transparent text-white'
                : 'bg-white border-gray-200 text-gray-400'
            }`}>
              {step.completed ? <CheckCircle className="h-5 w-5" /> : step.step}
            </div>
            <span className="text-xs font-medium text-center text-gray-600 leading-tight">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Next step CTA */}
      <div className="bg-gradient-to-r from-[#085558]/5 to-[#008737]/5 p-4 rounded-lg">
        <h3 className="font-bold text-[#063630] mb-2">Next Steps</h3>
        <p className="text-gray-600 text-sm mb-3">
          Complete your dog's profile and start receiving applications from potential adopters.
        </p>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow flex items-center gap-2"
            style={{ color: '#ffffff' }}
          >
            <Upload className="h-4 w-4" style={{ color: '#ffffff' }} /> Upload More Photos
          </button>
          <button className="px-4 py-2 border border-[#085558] text-[#085558] rounded-lg text-sm font-medium hover:bg-[#085558]/5 transition-colors flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default RehomingProgress;
