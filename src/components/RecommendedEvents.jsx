import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RecommendedEvents = ({ refreshTrigger }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const userId = useSelector((state) => state.auth.id);
  const token = useSelector((state) => state.auth.token);

  // Function to manually refresh recommendations
  const handleManualRefresh = () => {
    setLoading(true);
    setError(null);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching recommendations for user ID:', userId, 'Refresh trigger:', refreshTrigger);

        // First try to fetch from the direct API
        try {
          const response = await axios.get(
            `https://sportalon-backend.onrender.com/api/recommendations/user/${userId}`,
            {
              withCredentials: true,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              timeout: 10000 // 10 second timeout
            }
          );

          console.log('Recommendations response:', response.data);

          if (response.data.success) {
            if (response.data.recommendations && Array.isArray(response.data.recommendations)) {
              setRecommendations(response.data.recommendations);
              setLoading(false);
              return;
            } else {
              console.warn('Recommendations is not an array:', response.data.recommendations);
            }
          } else {
            console.warn('API returned success: false', response.data);
          }
        } catch (directApiError) {
          console.error('Error with direct API call:', directApiError);
        }

        // If direct API fails, try the fallback endpoint
        try {
          console.log('Trying fallback endpoint for recommendations');
          const fallbackResponse = await axios.get(
            `https://sportalon-backend.onrender.com/api/admin/events`,
            {
              withCredentials: true,
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (fallbackResponse.data && fallbackResponse.data.events) {
            // Take the 3 most recent events as recommendations
            const fallbackRecommendations = fallbackResponse.data.events
              .slice(0, 3)
              .map(event => ({
                ...event,
                recommendationSource: 'fallback'
              }));

            console.log('Using fallback recommendations:', fallbackRecommendations);
            setRecommendations(fallbackRecommendations);
          } else {
            setError('No events available for recommendations');
          }
        } catch (fallbackError) {
          console.error('Fallback endpoint also failed:', fallbackError);
          setError('Error fetching recommendations. Please try again later.');
        }
      } catch (err) {
        console.error('Error in recommendation process:', err);
        setError('Error fetching recommendations. Please try again later.');
      } finally {
        setLoading(false);
        setLastRefreshed(new Date());
      }
    };

    fetchRecommendations();
  }, [userId, token, refreshTrigger]); // Add refreshTrigger to dependencies

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Recommended Events</h2>
        <div className="flex flex-col justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">
            {refreshTrigger > 0 ? "Refreshing recommendations based on your updated interests..." : "Loading recommendations..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Recommended Events</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Recommended Events</h2>
        <p className="text-gray-600">
          No recommendations available. Try updating your sports interests in your profile.
        </p>
        <button
          onClick={() => window.location.href = '/profile?tab=sports'}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Update Sports Interests
        </button>
      </div>
    );
  }

  // Check if recommendations are from ML or fallback
  const hasContentBasedRecommendations = recommendations.some(rec => rec.recommendationSource === 'ml_content');
  const hasCollaborativeRecommendations = recommendations.some(rec => rec.recommendationSource === 'ml_collaborative');
  const hasFallbackRecommendations = recommendations.some(rec => rec.recommendationSource === 'fallback');
  const hasMLRecommendations = hasContentBasedRecommendations || hasCollaborativeRecommendations;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recommended Events</h2>
        <button 
          onClick={handleManualRefresh}
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {refreshTrigger > 0 && (
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
          Your recommendations have been updated based on your latest interests.
        </div>
      )}
      
      {hasContentBasedRecommendations && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
          <span className="font-medium">Content-Based Recommendations:</span> Events matched to your sports interests using TF-IDF and cosine similarity.
        </div>
      )}
      
      {hasCollaborativeRecommendations && (
        <div className="mb-4 p-2 bg-indigo-50 border border-indigo-200 rounded-md text-indigo-700 text-sm">
          <span className="font-medium">Collaborative Filtering:</span> Events recommended based on similar users' preferences using matrix factorization.
        </div>
      )}
      
      {hasFallbackRecommendations && (
        <div className="mb-4 p-2 bg-purple-50 border border-purple-200 rounded-md text-purple-700 text-sm">
          <span className="font-medium">Popular Events:</span> Some recommendations are based on popular events you might be interested in.
        </div>
      )}
      
      {lastRefreshed && (
        <div className="mb-4 text-xs text-gray-500">
          Last refreshed: {lastRefreshed.toLocaleString()}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((event) => (
          <div
            key={event._id || `event-${Math.random()}`}
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col ${
              event.recommendationSource === 'fallback' ? 'border-purple-200' : 'border-blue-300'
            }`}
          >
            <div className="p-4 flex flex-col h-full">
              {/* Recommendation badge */}
              <div className="mb-2">
                {event.recommendationSource === 'fallback' ? (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    Popular Event
                  </span>
                ) : event.recommendationSource === 'ml_content' ? (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Content-Based
                  </span>
                ) : event.recommendationSource === 'ml_collaborative' ? (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    Collaborative
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    AI Recommended
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
              <div className="flex-grow">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Categories:</span> {event.sportsCategory}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                )}
                {event.startDate && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Date:</span> {new Date(event.startDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="mt-4 text-center">
                <a
                  href={`/events/${event._id}?register=true`}
                  className={`inline-block w-full px-4 py-2 text-white rounded transition-colors shadow-md ${
                    event.recommendationSource === 'fallback' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  Register Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href="/events"
          className="inline-block px-6 py-3 bg-indigo-100 text-indigo-800 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
        >
          View All Events
        </a>
      </div>
    </div>
  );
};

export default RecommendedEvents;