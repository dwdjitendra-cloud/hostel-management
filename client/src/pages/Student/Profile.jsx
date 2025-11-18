import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { User, Edit2, Save, X, Building2, DoorOpen as Door, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const InfoSection = ({ title, children, icon: Icon }) => (
  <div className="card">
    <div className="flex items-center mb-4">
      <Icon className="w-5 h-5 text-primary-600 mr-2" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: student, isLoading, error } = useQuery('studentProfile', async () => {
    const response = await api.get('/student/profile');
    return response.data.data;
  });

  const updateMutation = useMutation(
    (data) => api.put('/student/profile', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('studentProfile');
        queryClient.invalidateQueries('studentDashboard');
        toast.success('Profile updated successfully');
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  React.useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        phone: student.phone
      });
    }
  }, [student, reset]);

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: student.name,
      phone: student.phone
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Error loading profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">View and manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <InfoSection title="Personal Information" icon={User}>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Non-editable fields for reference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Cannot be changed)
                </label>
                <input
                  value={student.email}
                  className="input-field bg-gray-50"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID (Cannot be changed)
                </label>
                <input
                  value={student.studentId}
                  className="input-field bg-gray-50"
                  disabled
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {updateMutation.isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student ID:</span>
                <span className="font-medium">{student.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{student.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{student.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Course:</span>
                <span className="font-medium">{student.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year:</span>
                <span className="font-medium">{student.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{student.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admission Date:</span>
                <span className="font-medium">
                  {new Date(student.admissionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </InfoSection>

        {/* Academic Information */}
        <InfoSection title="Academic Information" icon={User}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Course:</span>
              <span className="font-medium">{student.course}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Academic Year:</span>
              <span className="font-medium">{student.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admission Date:</span>
              <span className="font-medium">
                {new Date(student.admissionDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                student.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {student.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Academic information cannot be modified by students. 
              Please contact the administration for any changes required.
            </p>
          </div>
        </InfoSection>

        {/* Hostel Information */}
        {student.hostel ? (
          <InfoSection title="Hostel Information" icon={Building2}>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Hostel Name:</span>
                <span className="font-medium">{student.hostel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{student.hostel.type} Hostel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Fee:</span>
                <span className="font-medium">₹{student.hostel.fees?.monthly}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit:</span>
                <span className="font-medium">₹{student.hostel.fees?.security}</span>
              </div>
            </div>

            {student.hostel.address && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{student.hostel.address}</p>
                  </div>
                </div>
              </div>
            )}

            {student.hostel.warden?.name && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Warden Contact</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{student.hostel.warden.name}</span>
                  </div>
                  {student.hostel.warden.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{student.hostel.warden.phone}</span>
                    </div>
                  )}
                  {student.hostel.warden.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{student.hostel.warden.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </InfoSection>
        ) : (
          <InfoSection title="Hostel Information" icon={Building2}>
            <div className="text-center py-8">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You have not been assigned to a hostel yet.</p>
              <p className="text-sm text-gray-400 mt-2">Please contact the administrator.</p>
            </div>
          </InfoSection>
        )}

        {/* Room Information */}
        {student.room ? (
          <InfoSection title="Room Information" icon={Door}>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Number:</span>
                <span className="font-medium">{student.room.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium">{student.room.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Floor:</span>
                <span className="font-medium">Floor {student.room.floor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">
                  {student.room.currentOccupancy}/{student.room.capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="font-medium">₹{student.room.monthlyRent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Air Conditioning:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  student.room.isAC 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.room.isAC ? 'AC' : 'Non-AC'}
                </span>
              </div>
            </div>

            {student.room.amenities && student.room.amenities.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Room Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {student.room.amenities.map((amenity, index) => (
                    <span key={index} className="bg-white px-2 py-1 rounded text-xs text-gray-600 border">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </InfoSection>
        ) : (
          <InfoSection title="Room Information" icon={Door}>
            <div className="text-center py-8">
              <Door className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You have not been assigned to a room yet.</p>
              <p className="text-sm text-gray-400 mt-2">Please contact the administrator.</p>
            </div>
          </InfoSection>
        )}
      </div>
    </div>
  );
};

export default Profile;