import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  Users,
  Wifi,
  Car,
  Shield,
  Utensils
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const amenityIcons = {
  'WiFi': Wifi,
  'Parking': Car,
  'Security': Shield,
  'Mess': Utensils,
  'Laundry': Users
};

const HostelCard = ({ hostel, onEdit, onDelete }) => {
  const occupancyPercentage = (hostel.currentOccupancy / hostel.totalCapacity) * 100;
  
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            hostel.type === 'Boys' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
            <Building2 className={`w-6 h-6 ${
              hostel.type === 'Boys' ? 'text-blue-600' : 'text-pink-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{hostel.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              hostel.type === 'Boys' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-pink-100 text-pink-800'
            }`}>
              {hostel.type} Hostel
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(hostel)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(hostel)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Capacity</span>
          <span className="font-medium">{hostel.currentOccupancy}/{hostel.totalCapacity}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              occupancyPercentage >= 90 
                ? 'bg-red-500' 
                : occupancyPercentage >= 70 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
            }`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Rooms</span>
          <span className="font-medium">{hostel.totalRooms}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Monthly Fee</span>
          <span className="font-medium">₹{hostel.fees?.monthly}</span>
        </div>

        {hostel.amenities && hostel.amenities.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {hostel.amenities.slice(0, 3).map((amenity, index) => {
                const Icon = amenityIcons[amenity] || Shield;
                return (
                  <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                    <Icon className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-600">{amenity}</span>
                  </div>
                );
              })}
              {hostel.amenities.length > 3 && (
                <span className="text-xs text-gray-500">+{hostel.amenities.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HostelFormModal = ({ isOpen, onClose, hostel, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: hostel || {}
  });

  React.useEffect(() => {
    if (hostel) {
      reset({
        ...hostel,
        amenities: hostel.amenities?.join(', ') || ''
      });
    } else {
      reset({});
    }
  }, [hostel, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(Boolean) : []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {hostel ? 'Edit Hostel' : 'Add New Hostel'}
          </h2>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Enter hostel name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  {...register('type', { required: 'Type is required' })}
                  className="input-field"
                >
                  <option value="">Select type</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Rooms
                </label>
                <input
                  {...register('totalRooms', { 
                    required: 'Total rooms is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="Enter total rooms"
                />
                {errors.totalRooms && (
                  <p className="text-sm text-red-600 mt-1">{errors.totalRooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Capacity
                </label>
                <input
                  {...register('totalCapacity', { 
                    required: 'Total capacity is required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="Enter total capacity"
                />
                {errors.totalCapacity && (
                  <p className="text-sm text-red-600 mt-1">{errors.totalCapacity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Fee (₹)
                </label>
                <input
                  {...register('fees.monthly', { 
                    required: 'Monthly fee is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="Enter monthly fee"
                />
                {errors.fees?.monthly && (
                  <p className="text-sm text-red-600 mt-1">{errors.fees.monthly.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Deposit (₹)
                </label>
                <input
                  {...register('fees.security', { 
                    required: 'Security deposit is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  type="number"
                  className="input-field"
                  placeholder="Enter security deposit"
                />
                {errors.fees?.security && (
                  <p className="text-sm text-red-600 mt-1">{errors.fees.security.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                className="input-field"
                rows="3"
                placeholder="Enter hostel address"
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <input
                {...register('amenities')}
                className="input-field"
                placeholder="Enter amenities separated by commas (e.g., WiFi, Parking, Security)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple amenities with commas</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Warden Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warden Name
                  </label>
                  <input
                    {...register('warden.name')}
                    className="input-field"
                    placeholder="Enter warden name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warden Phone
                  </label>
                  <input
                    {...register('warden.phone')}
                    className="input-field"
                    placeholder="Enter warden phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warden Email
                  </label>
                  <input
                    {...register('warden.email')}
                    type="email"
                    className="input-field"
                    placeholder="Enter warden email"
                  />
                </div>
              </div>
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
                    <span>{hostel ? 'Updating...' : 'Adding...'}</span>
                  </div>
                ) : (
                  hostel ? 'Update Hostel' : 'Add Hostel'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const HostelManagement = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: hostels, isLoading, error } = useQuery('hostels', async () => {
    const response = await api.get('/hostels');
    return response.data.data;
  });

  const createMutation = useMutation(
    (data) => api.post('/hostels', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hostels');
        toast.success('Hostel added successfully');
        setIsModalOpen(false);
        setSelectedHostel(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add hostel');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => api.put(`/hostels/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hostels');
        toast.success('Hostel updated successfully');
        setIsModalOpen(false);
        setSelectedHostel(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update hostel');
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => api.delete(`/hostels/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hostels');
        toast.success('Hostel deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete hostel');
      }
    }
  );

  const handleAdd = () => {
    setSelectedHostel(null);
    setIsModalOpen(true);
  };

  const handleEdit = (hostel) => {
    setSelectedHostel(hostel);
    setIsModalOpen(true);
  };

  const handleDelete = (hostel) => {
    if (window.confirm(`Are you sure you want to delete ${hostel.name}?`)) {
      deleteMutation.mutate(hostel._id);
    }
  };

  const handleSubmit = (data) => {
    if (selectedHostel) {
      updateMutation.mutate({ id: selectedHostel._id, data });
    } else {
      createMutation.mutate(data);
    }
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
          <p className="text-red-600">Error loading hostels</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1>
          <p className="text-gray-600">Manage your hostels and their details</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Hostel</span>
        </button>
      </div>

      {/* Hostels Grid */}
      {hostels && hostels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <HostelCard
              key={hostel._id}
              hostel={hostel}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No hostels found</h2>
          <p className="text-gray-600 mb-6">Get started by adding your first hostel</p>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Hostel</span>
          </button>
        </div>
      )}

      {/* Modal */}
      <HostelFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedHostel(null);
        }}
        hostel={selectedHostel}
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
};

export default HostelManagement;