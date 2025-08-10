import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, DoorOpen as Door, Users, Building2, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const RoomCard = ({ room, onEdit, onDelete }) => {
  const occupancyPercentage = (room.currentOccupancy / room.capacity) * 100;
  const isAvailable = room.currentOccupancy < room.capacity;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
            <Door className={`w-6 h-6 ${isAvailable ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Room {room.roomNumber}
            </h3>
            <p className="text-sm text-gray-600">{room.hostel?.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(room)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(room)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Type</span>
          <span className="font-medium">{room.type}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Floor</span>
          <span className="font-medium">Floor {room.floor}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Capacity</span>
          <span className="font-medium">{room.currentOccupancy}/{room.capacity}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              occupancyPercentage === 100 
                ? 'bg-red-500' 
                : occupancyPercentage >= 50 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
            }`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Monthly Rent</span>
          <span className="font-medium">₹{room.monthlyRent}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">AC</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            room.isAC 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {room.isAC ? 'AC' : 'Non-AC'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? 'Available' : 'Full'}
          </span>
        </div>

        {room.students && room.students.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Current Students</p>
            <div className="space-y-1">
              {room.students.map((student, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {student.name} ({student.studentId})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RoomFormModal = ({ isOpen, onClose, room, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: room || {}
  });

  const { data: hostels } = useQuery('hostels', async () => {
    const response = await api.get('/hostels');
    return response.data.data;
  });

  React.useEffect(() => {
    if (room) {
      reset({
        ...room,
        hostel: room.hostel?._id || room.hostel,
        amenities: room.amenities?.join(', ') || ''
      });
    } else {
      reset({});
    }
  }, [room, reset]);

  const roomType = watch('type');
  const getCapacityByType = (type) => {
    switch (type) {
      case 'Single': return 1;
      case 'Double': return 2;
      case 'Triple': return 3;
      case 'Quadruple': return 4;
      default: return 1;
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      capacity: getCapacityByType(data.type),
      amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(Boolean) : []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {room ? 'Edit Room' : 'Add New Room'}
          </h2>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number
                </label>
                <input
                  {...register('roomNumber', { required: 'Room number is required' })}
                  className="input-field"
                  placeholder="Enter room number"
                />
                {errors.roomNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.roomNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel
                </label>
                <select
                  {...register('hostel', { required: 'Hostel is required' })}
                  className="input-field"
                >
                  <option value="">Select hostel</option>
                  {hostels?.map((hostel) => (
                    <option key={hostel._id} value={hostel._id}>
                      {hostel.name}
                    </option>
                  ))}
                </select>
                {errors.hostel && (
                  <p className="text-sm text-red-600 mt-1">{errors.hostel.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  {...register('type', { required: 'Room type is required' })}
                  className="input-field"
                >
                  <option value="">Select type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Quadruple">Quadruple</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  value={roomType ? getCapacityByType(roomType) : ''}
                  className="input-field bg-gray-50"
                  readOnly
                  placeholder="Auto-filled based on type"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Automatically set based on room type
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor
                </label>
                <input
                  {...register('floor', { 
                    required: 'Floor is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Floor must be at least 1' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="Enter floor number"
                />
                {errors.floor && (
                  <p className="text-sm text-red-600 mt-1">{errors.floor.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rent (₹)
                </label>
                <input
                  {...register('monthlyRent', { 
                    required: 'Monthly rent is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="Enter monthly rent"
                />
                {errors.monthlyRent && (
                  <p className="text-sm text-red-600 mt-1">{errors.monthlyRent.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  {...register('isAC')}
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Air Conditioned</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <input
                {...register('amenities')}
                className="input-field"
                placeholder="Enter amenities separated by commas (e.g., Attached Bathroom, Balcony, Study Table)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple amenities with commas</p>
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
                    <span>{room ? 'Updating...' : 'Adding...'}</span>
                  </div>
                ) : (
                  room ? 'Update Room' : 'Add Room'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const RoomManagement = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    hostel: '',
    available: '',
    search: ''
  });
  const queryClient = useQueryClient();

  const { data: hostels } = useQuery('hostels', async () => {
    const response = await api.get('/hostels');
    return response.data.data;
  });

  const { data: rooms, isLoading, error } = useQuery(['rooms', filters], async () => {
    const params = new URLSearchParams();
    if (filters.hostel) params.append('hostel', filters.hostel);
    if (filters.available) params.append('available', filters.available);
    
    const response = await api.get(`/rooms?${params.toString()}`);
    return response.data.data;
  });

  const createMutation = useMutation(
    (data) => api.post('/rooms', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rooms');
        queryClient.invalidateQueries('hostels');
        toast.success('Room added successfully');
        setIsModalOpen(false);
        setSelectedRoom(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add room');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => api.put(`/rooms/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rooms');
        queryClient.invalidateQueries('hostels');
        toast.success('Room updated successfully');
        setIsModalOpen(false);
        setSelectedRoom(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update room');
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => api.delete(`/rooms/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rooms');
        queryClient.invalidateQueries('hostels');
        toast.success('Room deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete room');
      }
    }
  );

  const handleAdd = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDelete = (room) => {
    if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
      deleteMutation.mutate(room._id);
    }
  };

  const handleSubmit = (data) => {
    if (selectedRoom) {
      updateMutation.mutate({ id: selectedRoom._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Filter rooms based on search
  const filteredRooms = rooms?.filter(room => {
    const searchTerm = filters.search.toLowerCase();
    return (
      room.roomNumber.toLowerCase().includes(searchTerm) ||
      room.hostel?.name.toLowerCase().includes(searchTerm)
    );
  });

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
          <p className="text-red-600">Error loading rooms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage rooms across all hostels</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search rooms..."
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              className="input-field"
              value={filters.available}
              onChange={(e) => setFilters({ ...filters, available: e.target.value })}
            >
              <option value="">All Rooms</option>
              <option value="true">Available</option>
              <option value="false">Full</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ hostel: '', available: '', search: '' })}
              className="btn-secondary w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms && filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Door className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filters.search || filters.hostel || filters.available ? 'No rooms match your filters' : 'No rooms found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.hostel || filters.available 
              ? 'Try adjusting your search criteria' 
              : 'Get started by adding your first room'
            }
          </p>
          {!(filters.search || filters.hostel || filters.available) && (
            <button
              onClick={handleAdd}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Room</span>
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
};

export default RoomManagement;