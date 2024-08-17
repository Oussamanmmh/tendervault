
import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating'; 
const renderStarRating = (rating) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const starClass = i <= rating ? 'text-yellow-500' : 'text-yellow-200';

    stars.push(
      <span
        key={i}
        className={`text-2xl mr-1 ${starClass}`}
      
      >
        ★
      </span>
    );
  }

  return stars;
};
const TenderCard = ({ tender, user }) => {
  return (
   <div
              key={tender.id}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer shadow-md hover:shadow-lg"
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={tender.imageUrl||'https://media.istockphoto.com/id/1267010934/photo/experienced-engineer-explaining-the-problems-in-construction-works-development-after-recession.jpg?b=1&s=612x612&w=0&k=20&c=SA3ZB024TeuvRX_l_650nAIC3Ebfnf707vkbY1ifYEo='}
                  alt={tender.companyName}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h2 className="text-xl font-semibold">{tender.title}</h2>
                <p className="text-gray-600 text-sm">{tender.description}</p>
                <p className="text-gray-400 text-sm mt-2">Company: {tender.companyName}</p>
                <p className="text-gray-400 text-sm">Category: {tender.category}</p>
                <p className="text-gray-400 text-sm">Cost: {tender.cost} Lakhs</p>
                <p className="text-gray-400 text-sm">Status: {tender.status}</p>
               <div className="flex items-center mt-2">
                <div className="mr-2">{renderStarRating(tender.rating)}</div>
                <div className="text-gray-400 text-sm">(Rating: {tender.rating})</div>
                 
              </div>
                  <div className="mt-4 flex flex-col items-center">
  <Link to={`/tender/${tender.id}`}>
    <button className="bg-green-500 text-white rounded-md px-3 py-1 mb-2">
      Details
    </button>
  </Link>
  {user && user.role === "admin" && (
    
     <StarRating tenderId={tender.id} />
     
  )}
</div>
              </div>
            </div>
  );
};

export default TenderCard;
