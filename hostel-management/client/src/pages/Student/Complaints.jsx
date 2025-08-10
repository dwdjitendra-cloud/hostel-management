import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Filter,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const getStatusColor = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-red-100 text-red-800';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'Resolved':
      return 'bg-green-100 text-green-800';
    case 'Closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const ComplaintCard = ({ complaint, onClick }) => (
  <div 
    className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
        {complaint.subject}
      </h3>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
        {complaint.status}
      </span>
    </div>

    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
      {complaint.description}
    </p>

    <div className="flex items-center justify-between mb-3">
      <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(complaint.priority)}`}>
        {complaint.priority} Priority
      </span>
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
        {complaint.category}
      </span>
    </div>

    <div className="flex items-center justify-between text-sm text-gray-500">
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4" />
        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
      </div>
      {complaint.comments && complaint.comments.length > 0 && (
        <span className="text-xs">
          {complaint.comments.length} comment{complaint.comments.length !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  </div>
);

const ComplaintModal = ({ isOpen, onClose, complaint, onAddComment }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const onSubmitComment = async (data) => {
    setIsSubmittingComment(true);
    try {
      await onAddComment(complaint._id, data.message);
      reset();
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {complaint.subject}
              </h2>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority} Priority
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {complaint.category}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{complaint.description}</p>
          </div>

          {/* Resolution (if available) */}
          {complaint.resolution && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Resolution
              </h3>
              <p className="text-green-800">{complaint.resolution}</p>
              {complaint.resolvedAt && (
                <p className="text-xs text-green-600 mt-2">
                  Resolved on {new Date(complaint.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Comments</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {complaint.comments && complaint.comments.length > 0 ? (
                complaint.comments.map((comment, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Comment Form */}
        {complaint.status !== 'Closed' && (
          <div className="p-6 border-t border-gray-200">
            <form onSubmit={handleSubmit(onSubmitComment)} className="flex space-x-3">
              <input
                {...register('message', { required: true })}
                placeholder="Add a comment..."
                className="flex-1 input-field"
              />
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="btn-primary flex items-center space-x-2"
              >
                {isSubmittingComment ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const NewComplaintModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  React.useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const categories = [
    'Food Quality',
    'Electricity Issues',
    'Laundry Services',
    'Ragging',
    'Maintenance',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Submit New Complaint
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                {...register('subject', { required: 'Subject is required' })}
                className="input-field"
                placeholder="Brief description of the issue"
              />
              {errors.subject && (
                <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="input-field"
                  defaultValue="Medium"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className="input-field"
                rows="4"
                placeholder="Provide detailed information about the issue"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
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
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Complaint'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Complaints = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isNewComplaintModalOpen, setIsNewComplaintModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  
  const queryClient = useQueryClient();

  const { data: complaints, isLoading, error } = useQuery(['complaints', filters], async () => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    
    const response = await api.get(`/complaints?${params.toString()}`);
    return response.data.data;
  });

  const createMutation = useMutation(
    (data) => api.post('/complaints', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('complaints');
        toast.success('Complaint submitted successfully');
        setIsNewComplaintModalOpen(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit complaint');
      }
    }
  );

  const addCommentMutation = useMutation(
    ({ id, message }) => api.post(`/complaints/${id}/comments`, { message }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('complaints');
        toast.success('Comment added successfully');
        
        // Update the selected complaint
        if (selectedComplaint) {
          const updatedComplaints = complaints.map(c => 
            c._id === selectedComplaint._id 
              ? { ...c, comments: [...(c.comments || []), { message, createdAt: new Date() }] }
              : c
          );
          setSelectedComplaint(updatedComplaints.find(c => c._id === selectedComplaint._id));
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add comment');
      }
    }
  );

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsComplaintModalOpen(true);
  };

  const handleAddComment = async (complaintId, message) => {
    return addCommentMutation.mutateAsync({ id: complaintId, message });
  };

  const handleSubmitComplaint = (data) => {
    createMutation.mutate(data);
  };

  // Filter complaints based on search
  const filteredComplaints = complaints?.filter(complaint => {
    const searchTerm = filters.search.toLowerCase();
    return (
      complaint.subject.toLowerCase().includes(searchTerm) ||
      complaint.description.toLowerCase().includes(searchTerm) ||
      complaint.category.toLowerCase().includes(searchTerm)
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
          <p className="text-red-600">Error loading complaints</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-600">Submit and track your complaints</p>
        </div>
        <button
          onClick={() => setIsNewComplaintModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search complaints..."
                className="input-field pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="input-field"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="Mess Food">Mess Food</option>
              <option value="Electricity">Electricity</option>
              <option value="Security">Security</option>
              <option value="Medical">Medical</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              className="input-field"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', category: '', priority: '', search: '' })}
              className="btn-secondary w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints && filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onClick={() => handleComplaintClick(complaint)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filters.search || filters.status || filters.category || filters.priority 
              ? 'No complaints match your filters' 
              : 'No complaints found'
            }
          </h2>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.status || filters.category || filters.priority
              ? 'Try adjusting your search criteria'
              : 'Submit your first complaint to get started'
            }
          </p>
          {!(filters.search || filters.status || filters.category || filters.priority) && (
            <button
              onClick={() => setIsNewComplaintModalOpen(true)}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Submit Complaint</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => {
          setIsComplaintModalOpen(false);
          setSelectedComplaint(null);
        }}
        complaint={selectedComplaint}
        onAddComment={handleAddComment}
      />

      <NewComplaintModal
        isOpen={isNewComplaintModalOpen}
        onClose={() => setIsNewComplaintModalOpen(false)}
        onSubmit={handleSubmitComplaint}
        isLoading={createMutation.isLoading}
      />
    </div>
  );
};

export default Complaints;