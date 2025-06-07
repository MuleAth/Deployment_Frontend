import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component is no longer used directly in the application
// It now redirects to the new admin dashboard route
function AdminHomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new admin dashboard route
    navigate('/admin');
  }, [navigate]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-xl">Redirecting to admin dashboard...</h1>
    </div>
  );
}

export default AdminHomePage;
