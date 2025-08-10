import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  Filter,
  Building2,
  DoorOpen as Door,
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const StudentCard = ({ student, onEdit, onDelete, onAssignRoom }) => (
  <div className="card hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-600">{student.studentId}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(student)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(student)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Mail className="w-4 h-4" />
        <span>{student.email}</span>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Phone className="w-4 h-4" />
        <span>{student.phone}</span>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <BookOpen className="w-4 h-4" />
        <span>{student.course} - Year {student.year}</span>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>Joined: {new Date(student.admissionDate).toLocaleDateString()}</span>
      </div>

      {student.hostel && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Building2 className="w-4 h-4" />
          <span>{student.hostel.name}</span>
        </div>
      )}

      {student.room && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Door className="w-4 h-4" />
          <span>Room {student.room.roomNumber}</span>
        </div>
      )}

      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            student.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {student.isActive ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={() => onAssignRoom(student)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {student.room ? 'Change Room' : 'Assign Room'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StudentFormModal = ({ isOpen, onClose, student, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: student || {}
  });

  React.useEffect(() => {
    if (student) {
      reset(student);
    } else {
      reset({});
    }
  }, [student, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID *
                </label>
                <input
                  {...register('studentId', { required: 'Student ID is required' })}
                  className="input-field"
                  placeholder="Enter student ID"
                  disabled={!!student}
                />
                {errors.studentId && (
                  <p className="text-sm text-red-600 mt-1">{errors.studentId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  className="input-field"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <input
                  {...register('course', { required: 'Course is required' })}
                  className="input-field"
                  placeholder="Enter course name"
                />
                {errors.course && (
                  <p className="text-sm text-red-600 mt-1">{errors.course.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year *
                </label>
                <select
                  {...register('year', { required: 'Year is required' })}
                  className="input-field"
                >
                  <option value="">Select year</option>
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
                {errors.year && (
                  <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="input-field"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
                )}
              </div>

              {!student && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className="input-field"
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>{student ? 'Updating...' : 'Adding...'}</span>
                  </div>
                ) : (
                  student ? 'Update Student' : 'Add Student'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const RoomAssignModal = ({ isOpen, onClose, student, onSubmit, isLoading }) => {
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const { data: hostels } = useQuery('hostels', async () => {
    const response = await api.get('/hostels');
    return response.data.data;
  });

  const { data: rooms } = useQuery(['rooms', selectedHostel], async () => {
    if (!selectedHostel) return [];
    const response = await api.get(`/rooms?hostel=${selectedHostel}&available=true`);
    return response.data.data;
  }, {
    enabled: !!selectedHostel
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      toast.error('Please select a room');
      return;
    }
    onSubmit(selectedRoom);
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Assign Room to {student.name}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Hostel
              </label>
              <select
                value={selectedHostel}
                onChange={(e) => {
                  setSelectedHostel(e.target.value);
                  setSelectedRoom('');
                }}
                className="input-field"
                required
              >
                <option value="">Choose hostel</option>
                {hostels?.map((hostel) => (
                  <option key={hostel._id} value={hostel._id}>
                    {hostel.name} ({hostel.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="input-field"
                required
                disabled={!selectedHostel}
              >
                <option value="">Choose room</option>
                {rooms?.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber} ({room.type}) - {room.currentOccupancy}/{room.capacity} occupied
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Assigning...</span>
                  </div>
                ) : (
                  'Assign Room'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const StudentManagement = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    hostel: ''
  });
  const queryClient = useQueryClient();

  const { data: hostels } = useQuery('hostels', async () => {
    const response = await api.get('/hostels');
    return response.data.data;
  });

  const { data: students, isLoading, error } = useQuery(['students', filters], async () => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.hostel) params.append('hostel', filters.hostel);
    
    const response = await api.get(`/admin/students?${params.toString()}`);
    return response.data.data;
  });

  const createMutation = useMutation(
    (data) => api.post('/auth/student/register', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
        toast.success('Student added successfully');
        setIsModalOpen(false);
        setSelectedStudent(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add student');
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => api.delete(`/admin/students/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
        toast.success('Student deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete student');
      }
    }
  );

  const assignRoomMutation = useMutation(
    ({ studentId, roomId }) => api.put(`/admin/students/${studentId}/assign-room`, { roomId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
        queryClient.invalidateQueries('rooms');
        toast.success('Room assigned successfully');
        setIsRoomModalOpen(false);
        setSelectedStudent(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign room');
      }
    }
  );

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      deleteMutation.mutate(student._id);
    }
  };

  const handleAssignRoom = (student) => {
    setSelectedStudent(student);
    setIsRoomModalOpen(true);
  };

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleRoomAssign = (roomId) => {
    assignRoomMutation.mutate({
      studentId: selectedStudent._id,
      roomId
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
          <p className="text-red-600">Error loading students</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student records and room assignments</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Students
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                className="input-field pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Hostel
            </label>
            <select
              className="input-field"
              value={filters.hostel}
              onChange={(e) => setFilters({ ...filters, hostel: e.target.value })}
            >
              <option value="">All Hostels</option>
              {hostels?.map((hostel) => (
                <option key={hostel._id} value={hostel._id}>
                  {hostel.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ search: '', hostel: '' })}
              className="btn-secondary w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {students && students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAssignRoom={handleAssignRoom}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filters.search || filters.hostel ? 'No students match your filters' : 'No students found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.hostel 
              ? 'Try adjusting your search criteria' 
              : 'Get started by adding your first student'
            }
          </p>
          {!(filters.search || filters.hostel) && (
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Student</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading}
      />

      <RoomAssignModal
        isOpen={isRoomModalOpen}
        onClose={() => {
          setIsRoomModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onSubmit={handleRoomAssign}
        isLoading={assignRoomMutation.isLoading}
      />
    </div>
  );
};

export default StudentManagement;