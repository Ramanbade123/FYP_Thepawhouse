const RecentApplications = ({ applications }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#063630]">Recent Applications</h2>
        <span className="text-sm text-gray-500">{applications.length} total</span>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#063630]">{app.applicantName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.color}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">
              Applied for: <span className="font-medium">{app.dogName}</span>
            </p>
            <p className="text-gray-500 text-xs mb-3">{new Date(app.date).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-[#085558]/10 text-[#085558] rounded-lg text-xs font-medium hover:bg-[#085558]/20 transition-colors">
                View Profile
              </button>
              <button
                className="flex-1 py-1.5 bg-gradient-to-r from-[#085558] to-[#008737] text-white rounded-lg text-xs font-medium hover:shadow-md transition-shadow"
                style={{ color: '#ffffff' }}
              >
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;
