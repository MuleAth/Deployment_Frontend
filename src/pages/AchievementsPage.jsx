import React, { useState } from 'react';
import { Search, Filter, Trophy, Medal, Star, Calendar, User, School } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Achievements
          </h1>
          <p className="text-xl text-gray-600">
            Celebrating excellence in sports across all disciplines
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">150+</div>
            <div className="text-gray-600">Total Medals</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <Medal className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">75</div>
            <div className="text-gray-600">Gold Medals</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <Star className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">25+</div>
            <div className="text-gray-600">Championships</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <User className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-gray-600">Athletes</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {medals.map(medal => (
                  <option key={medal} value={medal}>Medal: {medal === 'All' ? 'All' : medal.charAt(0).toUpperCase() + medal.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={achievement.image} 
                  alt={achievement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{achievement.year}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      achievement.medal === 'gold' ? 'bg-yellow-500 text-white' :
                      achievement.medal === 'silver' ? 'bg-gray-300 text-gray-800' :
                      'bg-orange-700 text-white'
                    }`}>
                      {achievement.position}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 mb-4">{achievement.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <span>{achievement.student}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <School className="h-5 w-5 mr-2" />
                    <span>{achievement.department}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Trophy className="h-5 w-5 mr-2" />
                    <span>{achievement.category}</span>
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
    </div>
  );
};

export default AchievementsPage;