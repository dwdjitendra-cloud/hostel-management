import React from 'react';
import { useQuery } from 'react-query';
import { Users, Building2, DoorOpen as Door, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="card">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <span className="ml-2 text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}%
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const RecentComplaintItem = ({ complaint }) => (
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
      <p className="text-sm text-gray-600">
        {complaint.student?.name} - {complaint.student?.studentId}
      </p>
      <div className="flex items-center mt-1 text-xs text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        {new Date(complaint.createdAt).toLocaleDateString()}
      </div>
    </div>
  </div>
);

const HostelOccupancyItem = ({ hostel }) => {
  const occupancyPercentage = (hostel.currentOccupancy / hostel.totalCapacity) * 100;
  
  return (
    <div className="py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-900">{hostel.name}</p>
        <span className="text-sm text-gray-600">
          {hostel.currentOccupancy}/{hostel.totalCapacity}
        </span>
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
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {occupancyPercentage.toFixed(1)}% occupied
      </p>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading, error } = useQuery('adminDashboard', async () => {
    const response = await api.get('/admin/dashboard');
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your hostel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={data.stats.totalStudents}
          icon={Users}
          color="bg-blue-500"
          change={5}
        />
        <StatCard
          title="Total Hostels"
          value={data.stats.totalHostels}
          icon={Building2}
          color="bg-green-500"
          change={2}
        />
        <StatCard
          title="Total Rooms"
          value={data.stats.totalRooms}
          icon={Door}
          color="bg-purple-500"
          change={8}
        />
        <StatCard
          title="Open Complaints"
          value={data.stats.openComplaints}
          icon={MessageSquare}
          color="bg-red-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {data.recentComplaints?.length > 0 ? (
              data.recentComplaints.map((complaint) => (
                <RecentComplaintItem key={complaint._id} complaint={complaint} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent complaints</p>
            )}
          </div>
        </div>

        {/* Hostel Occupancy */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Hostel Occupancy</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {data.hostels?.length > 0 ? (
              data.hostels.map((hostel) => (
                <HostelOccupancyItem key={hostel._id} hostel={hostel} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hostels available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;