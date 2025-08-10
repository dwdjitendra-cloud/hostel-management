import React from 'react';
import { useQuery } from 'react-query';
import { Building2, DoorOpen as Door, User, MessageSquare, MapPin, Phone, Mail, CreditCard, Shield } from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const InfoCard = ({ title, children, icon: Icon }) => (
  <div className="card">
    <div className="flex items-center mb-4">
      <Icon className="w-5 h-5 text-primary-600 mr-2" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const ComplaintItem = ({ complaint }) => (
  <div className="flex items-center py-3 border-b border-gray-200 last:border-b-0">
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">{complaint.subject}</p>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          complaint.status === 'Open' 
            ? 'bg-red-100 text-red-800'
            : complaint.status === 'In Progress'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {complaint.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{complaint.category}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(complaint.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const { data, isLoading, error } = useQuery('studentDashboard', async () => {
    const response = await api.get('/student/dashboard');
    return response.data.data;
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
          <p className="text-red-600">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  const student = data.student;
  const recentComplaints = data.recentComplaints;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {student.name}!</h1>
        <p className="text-gray-600">Here's your hostel information and recent activity.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center">
            <User className="w-8 h-8 mr-3" />
            <div>
              <p className="text-primary-100">Student ID</p>
              <p className="text-2xl font-bold">{student.studentId}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 mr-3" />
            <div>
              <p className="text-secondary-100">Hostel</p>
              <p className="text-2xl font-bold">{student.hostel?.name || 'Not Assigned'}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <Door className="w-8 h-8 mr-3" />
            <div>
              <p className="text-purple-100">Room</p>
              <p className="text-2xl font-bold">{student.room?.roomNumber || 'Not Assigned'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <InfoCard title="Personal Information" icon={User}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{student.name}</span>
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
          </div>
        </InfoCard>

        {/* Recent Complaints */}
        <InfoCard title="Recent Complaints" icon={MessageSquare}>
          <div className="space-y-1">
            {recentComplaints && recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <ComplaintItem key={complaint._id} complaint={complaint} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent complaints</p>
            )}
          </div>
        </InfoCard>

        {/* Hostel Information */}
        {student.hostel && (
          <InfoCard title="Hostel Information" icon={Building2}>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
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
              {student.hostel.warden?.name && (
                <>
                  <hr className="my-3" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Warden Contact</h4>
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
                </>
              )}
            </div>
          </InfoCard>
        )}

        {/* Room Information */}
        {student.room && (
          <InfoCard title="Room Information" icon={Door}>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Number:</span>
                <span className="font-medium">{student.room.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
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
                <span className="text-gray-600">AC:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  student.room.isAC 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.room.isAC ? 'AC' : 'Non-AC'}
                </span>
              </div>
              
              {student.room.amenities && student.room.amenities.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Room Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {student.room.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </InfoCard>
        )}
      </div>

      {/* Assignment Notice */}
      {!student.hostel || !student.room && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800">
              {!student.hostel && !student.room 
                ? 'You have not been assigned to a hostel or room yet. Please contact the administrator.'
                : !student.room 
                ? 'You have been assigned to a hostel but not to a specific room yet. Please contact the administrator.'
                : 'You have been assigned to a room but not to a hostel yet. Please contact the administrator.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;