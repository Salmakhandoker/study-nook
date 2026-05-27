import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Home } from 'lucide-react';

const NotFound = () => {
  useDocumentTitle('Page Not Found');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>
        <div className="mt-[-4rem] mb-8 relative z-10">
          <div className="bg-white p-6 rounded-2xl shadow-xl inline-block transform -rotate-2 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Oops! Page not found</h2>
            <p className="text-gray-500 max-w-xs mx-auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>
        </div>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
