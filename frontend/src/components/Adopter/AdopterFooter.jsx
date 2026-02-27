import { Link } from 'react-router-dom';

const AdopterFooter = () => (
  <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-600 text-sm mb-4 md:mb-0">
        © {new Date().getFullYear()} The Paw House — Adopter Dashboard
      </p>
      <div className="flex gap-6">
        <Link to="/adoption-process" className="text-sm text-gray-600 hover:text-[#085558] transition-colors">Adoption Process</Link>
        <Link to="/contact"          className="text-sm text-gray-600 hover:text-[#085558] transition-colors">Contact</Link>
        <Link to="/adoption-faq"     className="text-sm text-gray-600 hover:text-[#085558] transition-colors">FAQ</Link>
      </div>
    </div>
  </footer>
);

export default AdopterFooter;
