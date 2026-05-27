import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../utils/api';
import RoomCard from '../components/RoomCard';
import Spinner from '../components/Spinner';
import { BookOpen, Clock, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  useDocumentTitle('Home');
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/rooms?limit=6&sort=latest');
        setFeaturedRooms(data);
      } catch (error) {
        console.error("Error fetching featured rooms", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000"
            alt="Library Study Room"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-start">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-hover font-semibold text-sm mb-4 border border-primary/30 backdrop-blur-md">
            Focus Better, Study Harder
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 max-w-2xl leading-tight">
            Find Your Perfect <span className="text-primary">Study Room</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
            Browse and book quiet, private study rooms in your library. Need extra cash? List your own room and start earning today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/rooms" className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1">
              Explore Rooms
            </Link>
            <Link to="/add-room" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-bold text-lg transition-all backdrop-blur-md">
              List Your Room
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Study Rooms</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the latest study spaces added to our platform. Book your spot before it's gone!</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">No rooms available at the moment.</div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/rooms" className="inline-block px-6 py-3 bg-white text-primary border border-primary hover:bg-blue-50 rounded-lg font-medium transition-colors">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Extra Section 1: How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Booking a room is as easy as 1-2-3.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                <BookOpen size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Browse Rooms</h3>
              <p className="text-gray-600">Search through our wide selection of private and shared study spaces.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                <Clock size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Choose a Time</h3>
              <p className="text-gray-600">Select your preferred date and time slot. Our system prevents double-booking!</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Confirm & Study</h3>
              <p className="text-gray-600">Complete your booking securely and focus on what matters most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Why Choose Us */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose StudyNook?</h2>
              <p className="text-blue-100 mb-8 text-lg">
                We provide the best platform for students and professionals to find the perfect environment for deep work.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full"><Zap size={20} /></div>
                  <span className="text-lg font-medium">Instant confirmation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full"><ShieldCheck size={20} /></div>
                  <span className="text-lg font-medium">Secure and verified listings</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full"><Clock size={20} /></div>
                  <span className="text-lg font-medium">Flexible cancellation policy</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="Students studying" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-primary">5k+</div>
                  <div className="text-gray-600 font-medium leading-tight text-sm">Happy<br/>Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
