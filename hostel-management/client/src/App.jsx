import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './utils/AuthContext';
import { useAuth } from './utils/AuthContext';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminRegister from './pages/Auth/AdminRegister'; // New admin signup page
import StudentRegister from './pages/Auth/StudentRegister'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import HostelManagement from './pages/Admin/HostelManagement';
import RoomManagement from './pages/Admin/RoomManagement';
import StudentManagement from './pages/Admin/StudentManagement';
import AdminComplaints from './pages/Admin/Complaints';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import StudentProfile from './pages/Student/Profile';
import StudentComplaints from './pages/Student/Complaints';

// Layout Components
import AdminLayout from './components/Common/AdminLayout';
import StudentLayout from './components/Common/StudentLayout';
import LoadingSpinner from './components/Common/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Register />}
      />


 {/* Separate signup routes */}
      <Route
        path="/admin/signup"
        element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <AdminRegister />}
      />
      <Route
        path="/student/signup"
        element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <StudentRegister />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/hostels" element={<HostelManagement />} />
                <Route path="/rooms" element={<RoomManagement />} />
                <Route path="/students" element={<StudentManagement />} />
                <Route path="/complaints" element={<AdminComplaints />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout>
              <Routes>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/complaints" element={<StudentComplaints />} />
              </Routes>
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.role}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Unauthorized Route */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page.
              </p>
              <button
                onClick={() => window.history.back()}
                className="btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <AuthProvider>
        
          <div className="App">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        
      </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;