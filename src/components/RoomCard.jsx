import { Link } from 'react-router-dom';
import { Users, Layers, DollarSign } from 'lucide-react';

const RoomCard = ({ room }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden group">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold truncate">{room.name}</h3>
          <p className="text-sm text-gray-200">{room.floor}</p>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
        
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-primary" />
            <span>{room.capacity} people</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-green-500" />
            <span className="font-semibold text-gray-900">${room.hourlyRate}/hr</span>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-100">
              {amenity}
            </span>
          ))}
          {room.amenities && room.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            to={`/rooms/${room._id}`}
            className="block w-full text-center bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
