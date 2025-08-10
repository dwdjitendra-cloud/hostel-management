import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import api from '../../utils/api'; // custom axios instance

const StudentRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = {
        studentId: formData.studentId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        course: formData.course,
        year: parseInt(formData.year),
        gender: formData.gender,
        role: 'student' // explicitly set role
      };

      const res = await api.post('/student/register', payload);

      toast.success('Registration successful');
      login(res.data); // assuming API returns token + user data
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <Building2 className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Student Registration</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('studentId', { required: 'Student ID is required' })}
            placeholder="Student ID"
            className="w-full border p-2 rounded"
          />
          {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId.message}</p>}

          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <input
            {...register('phone', { required: 'Phone number is required' })}
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

          <input
            {...register('course', { required: 'Course is required' })}
            placeholder="Course"
            className="w-full border p-2 rounded"
          />
          {errors.course && <p className="text-red-500 text-sm">{errors.course.message}</p>}

          <input
            type="number"
            {...register('year', { required: 'Year is required' })}
            placeholder="Academic Year"
            className="w-full border p-2 rounded"
          />
          {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}

          <select
            {...register('gender', { required: 'Gender is required' })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            {loading ? <LoadingSpinner /> : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/student/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
