import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Home, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Login = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    reset();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const loginData = {
        ...data,
        role: activeTab
      };

      // For student login, use studentId as email if it doesn't contain @
      if (activeTab === 'student' && data.studentId && !data.studentId.includes('@')) {
        loginData.email = `${data.studentId}@student.hostel`;
      } else if (activeTab === 'student') {
        loginData.email = data.studentId;
      }

      const result = await login(loginData);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate(`/${result.user.role}/dashboard`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6">
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Management</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Tab Buttons */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg transition-colors ${
                activeTab === 'student'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg transition-colors ${
                activeTab === 'admin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Admin
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Student ID / Email Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                {activeTab === 'student' ? 'Student ID' : 'Email'}
              </label>
              <input
                {...register(activeTab === 'student' ? 'studentId' : 'email', {
                  required: `${activeTab === 'student' ? 'Student ID' : 'Email'} is required`,
                  ...(activeTab === 'admin' && {
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })
                })}
                type={activeTab === 'student' ? 'text' : 'email'}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder={activeTab === 'student' ? 'Enter your student ID' : 'Enter your email'}
              />
              {errors.studentId && (
                <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>
              )}
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
         
{/* <div>
  <button
    type="submit"
    disabled={isLoading}
    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
  >
    {isLoading ? (
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="sm" />
        <span>Signing in...</span>
      </div>
    ) : (
      'Sign In'
    )}
  </button>
</div> */}

{/* Sign Up Link */}
<div className="mt-4 text-center">
  <p className="text-sm text-gray-600">
    Don't have an account?{' '}
    <button
      type="button"
      onClick={() => navigate(activeTab === 'student' ? '/student/signup' : '/admin/signup')}
      className="text-blue-500 hover:text-blue-600 font-medium"
    >
      Sign Up as {activeTab === 'student' ? 'Student' : 'Admin'}
    </button>
  </p>
</div>

        
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Developed with ❤️ by{' '}
          <a
            href="https://www.linkedin.com/in/dwdjitendra/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
           Jitendra
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;