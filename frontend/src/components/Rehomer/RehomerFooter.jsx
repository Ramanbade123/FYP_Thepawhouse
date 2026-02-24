import { Link } from 'react-router-dom';

const RehomerFooter = () => {
  return (
    <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} The Paw House — Rehomer Dashboard
          </p>
          <div className="flex gap-6">
            {['/terms', '/privacy', '/help'].map((path) => (
              <Link key={path} to={path} className="text-sm text-gray-600 hover:text-[#085558] transition-colors capitalize">
                {path.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RehomerFooter;
