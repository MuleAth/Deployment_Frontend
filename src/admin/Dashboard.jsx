import { FaUsers, FaCalendarAlt, FaDumbbell, FaComments, FaGraduationCap } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate();

  const stats = {
    users: 156,
    equipments: 45,
    liveEvents: 3,
    feedbacks: 89,
    departments: 8
  }

  const StatCard = ({ icon: Icon, title, value, color, path }) => (
    <div
      className="card cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 transform relative overflow-hidden border border-gray-200 dark:border-gray-700 p-4 rounded-lg group"
      onClick={() => navigate(path)}
      title={`View ${title}`}
    >
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-10 transition-opacity"></div>
      <div className="absolute -bottom-10 group-hover:bottom-2 right-2 transition-all duration-300 bg-gray-800 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100">
        Click to view details
      </div>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-2xl text-white" />
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="text-gray-400 dark:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  )

  return (
    <div className="content-area p-6">
      <h1 className="page-title text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="flex flex-col gap-6">
        {/* First row - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FaUsers}
            title="Total Users"
            value={stats.users}
            color="bg-blue-500"
            path="/admin/users"
          />
          <StatCard
            icon={FaGraduationCap}
            title="Departments"
            value={stats.departments}
            color="bg-indigo-500"
            path="/admin/departments"
          />
          <StatCard
            icon={FaDumbbell}
            title="Equipment"
            value={stats.equipments}
            color="bg-green-500"
            path="/admin/equipment"
          />
          <StatCard
            icon={FaCalendarAlt}
            title="Events"
            value={stats.liveEvents}
            color="bg-purple-500"
            path="/admin/events"
          />
        </div>

        {/* Second row - 1 card */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FaComments}
            title="Feedback"
            value={stats.feedbacks}
            color="bg-yellow-500"
            path="/admin/feedback"
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard