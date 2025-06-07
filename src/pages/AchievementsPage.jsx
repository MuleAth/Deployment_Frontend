import React, { useState } from 'react';
import { Search, Filter, Trophy, Medal, Star, Calendar, User, School, X, ZoomIn } from 'lucide-react';

const achievements = [
  {
    id: 1,
    title: "National Basketball Championship",
    student: "Rahul Sharma",
    department: "Computer Engineering",
    year: "2024",
    category: "Team Sports",
    position: "Winner",
    description: "Led the college basketball team to victory in the national championship, scoring 32 points in the final match.",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    medal: "gold"
  },
  {
    id: 2,
    title: "State Level Swimming Competition",
    student: "Priya Patel",
    department: "Mechanical Engineering",
    year: "2023",
    category: "Swimming",
    position: "Gold Medal",
    description: "Set a new state record in 200m butterfly stroke with a timing of 2:05.45.",
    image: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    medal: "gold"
  },
  {
    id: 3,
    title: "Inter-College Athletics Meet",
    student: "Amit Kumar",
    department: "Electronics Engineering",
    year: "2024",
    category: "Athletics",
    position: "Gold Medal",
    description: "Won gold in 100m sprint and long jump events, breaking the college record.",
    image: "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    medal: "gold"
  },
  {
    id: 4,
    title: "National Table Tennis Championship",
    student: "Sneha Reddy",
    department: "Civil Engineering",
    year: "2023",
    category: "Indoor Sports",
    position: "Runner-up",
    description: "Secured silver medal in women's singles category after an intense final match.",
    image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    medal: "silver"
  },
  {
    id: 5,
    title: "State Karate Championship",
    student: "Raj Malhotra",
    department: "Computer Engineering",
    year: "2024",
    category: "Martial Arts",
    position: "Gold Medal",
    description: "Won gold medal in under-75kg category, qualifying for national championship.",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    medal: "gold"
  },
  {
    id: 6,
    title: "Inter-University Cricket Tournament",
    student: "Team Event",
    department: "Multiple",
    year: "2023",
    category: "Team Sports",
    position: "Winner",
    description: "College cricket team emerged victorious in the inter-university tournament, remaining undefeated throughout.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    medal: "gold"
  }
];

const AchievementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMedal, setSelectedMedal] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const years = ['All', '2024', '2023', '2022'];
  const categories = ['All', 'Team Sports', 'Swimming', 'Athletics', 'Indoor Sports', 'Martial Arts'];
  const medals = ['All', 'gold', 'silver', 'bronze'];

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = 
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = selectedYear === 'All' || achievement.year === selectedYear;
    const matchesCategory = selectedCategory === 'All' || achievement.category === selectedCategory;
    const matchesMedal = selectedMedal === 'All' || achievement.medal === selectedMedal;

    return matchesSearch && matchesYear && matchesCategory && matchesMedal;
  });

  // Handle image click to open modal
  const handleImageClick = (achievement) => {
    setSelectedImage(achievement);
    setIsModalOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-4 md:mt-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            Our Achievements
          </h1>
          <p className="text-lg md:text-xl text-gray-600 px-4">
            Celebrating excellence in sports across all disciplines
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg">
            <Trophy className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mb-1 md:mb-2" />
            <div className="text-lg md:text-2xl font-bold text-gray-900">150+</div>
            <div className="text-xs md:text-sm text-gray-600">Total Medals</div>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg">
            <Medal className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mb-1 md:mb-2" />
            <div className="text-lg md:text-2xl font-bold text-gray-900">75</div>
            <div className="text-xs md:text-sm text-gray-600">Gold Medals</div>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg">
            <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mb-1 md:mb-2" />
            <div className="text-lg md:text-2xl font-bold text-gray-900">25+</div>
            <div className="text-xs md:text-sm text-gray-600">Championships</div>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg">
            <User className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 mb-1 md:mb-2" />
            <div className="text-lg md:text-2xl font-bold text-gray-900">500+</div>
            <div className="text-xs md:text-sm text-gray-600">Athletes</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-2 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 md:px-4 py-2.5 md:py-2 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>Year: {year}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 md:px-4 py-2.5 md:py-2 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>Category: {category}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedMedal}
                onChange={(e) => setSelectedMedal(e.target.value)}
                className="w-full px-3 md:px-4 py-2.5 md:py-2 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {medals.map(medal => (
                  <option key={medal} value={medal}>Medal: {medal === 'All' ? 'All' : medal.charAt(0).toUpperCase() + medal.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-56 md:h-48 lg:h-56 overflow-hidden relative cursor-pointer group" onClick={() => handleImageClick(achievement)}>
                <img 
                  src={achievement.image} 
                  alt={achievement.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Zoom icon overlay for desktop */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 hidden md:flex">
                  <div className="bg-white/90 rounded-full p-3">
                    <ZoomIn className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
                
                {/* Mobile tap indicator - always visible */}
                <div className="absolute top-3 right-3 md:hidden bg-white/90 rounded-full p-2 shadow-lg">
                  <ZoomIn className="h-4 w-4 text-gray-700" />
                </div>
                
                {/* Mobile tap hint */}
                <div className="absolute top-3 left-3 md:hidden bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  Tap to view
                </div>
                
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm md:text-base">{achievement.year}</span>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                      achievement.medal === 'gold' ? 'bg-yellow-500 text-white' :
                      achievement.medal === 'silver' ? 'bg-gray-300 text-gray-800' :
                      'bg-orange-700 text-white'
                    }`}>
                      {achievement.position}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-3">{achievement.description}</p>
                
                <div className="space-y-1.5 md:space-y-2">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base truncate">{achievement.student}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <School className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base truncate">{achievement.department}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Trophy className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base truncate">{achievement.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[95vh] md:max-h-[90vh] w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Image container */}
            <div className="relative">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] md:max-h-[60vh] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image overlay info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg md:text-xl font-semibold">{selectedImage.year}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedImage.medal === 'gold' ? 'bg-yellow-500 text-white' :
                    selectedImage.medal === 'silver' ? 'bg-gray-300 text-gray-800' :
                    'bg-orange-700 text-white'
                  }`}>
                    {selectedImage.position}
                  </span>
                </div>
              </div>
            </div>

            {/* Achievement details */}
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{selectedImage.title}</h2>
              <p className="text-gray-600 mb-4 text-sm md:text-base">{selectedImage.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 text-indigo-500" />
                  <div>
                    <div className="text-xs text-gray-500">Student</div>
                    <div className="text-sm md:text-base font-medium">{selectedImage.student}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <School className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 text-indigo-500" />
                  <div>
                    <div className="text-xs text-gray-500">Department</div>
                    <div className="text-sm md:text-base font-medium">{selectedImage.department}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0 text-indigo-500" />
                  <div>
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="text-sm md:text-base font-medium">{selectedImage.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;