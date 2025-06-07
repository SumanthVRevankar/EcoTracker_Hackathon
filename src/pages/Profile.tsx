import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { User, Mail, MapPin, Calendar, TrendingDown, BarChart3, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { getUserRecords } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-500">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const userRecords = getUserRecords(user.id);
  const chartData = userRecords.map((record, index) => ({
    date: record.date.toLocaleDateString(),
    emission: record.emission,
    day: index + 1
  }));

  const totalEmissions = userRecords.reduce((sum, record) => sum + record.emission, 0);
  const avgEmission = userRecords.length > 0 ? totalEmissions / userRecords.length : 0;
  const trend = userRecords.length >= 2 
    ? userRecords[userRecords.length - 1].emission - userRecords[0].emission 
    : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.username}!</h1>
          <p className="text-gray-600">Track your environmental impact and progress</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-semibold text-gray-900">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-semibold text-gray-900">{user.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-900">December 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingDown className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-green-900">First Calculation</span>
                    </div>
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  
                  {avgEmission < 2.0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-blue-900">Eco Warrior</span>
                      </div>
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                  )}
                  
                  {userRecords.length >= 5 && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-purple-900">Consistent Tracker</span>
                      </div>
                      <span className="text-purple-600 text-sm">✓</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Average Daily</p>
                      <p className="text-2xl font-bold">{avgEmission.toFixed(2)}</p>
                      <p className="text-green-100 text-sm">kg CO₂</p>
                    </div>
                    <TrendingDown className="h-12 w-12 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Records</p>
                      <p className="text-2xl font-bold">{userRecords.length}</p>
                      <p className="text-blue-100 text-small">calculations</p>
                    </div>
                    <BarChart3 className="h-12 w-12 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Trend</p>
                      <p className="text-2xl font-bold">{trend >= 0 ? '+' : ''}{trend.toFixed(2)}</p>
                      <p className="text-purple-100 text-sm">kg CO₂</p>
                    </div>
                    <TrendingDown className={`h-12 w-12 text-purple-200 ${trend < 0 ? 'transform rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Calculations</h3>
                {userRecords.length > 0 ? (
                  <div className="space-y-3">
                    {userRecords.slice(-5).reverse().map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <TrendingDown className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{record.emission.toFixed(2)} kg CO₂</p>
                            <p className="text-sm text-gray-500">{record.date.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.emission < 2.0 ? 'bg-green-100 text-green-800' :
                          record.emission < 2.5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.emission < 2.0 ? 'Excellent' :
                           record.emission < 2.5 ? 'Good' : 'Needs Improvement'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No calculations yet. Start tracking your carbon footprint!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {userRecords.length > 0 ? (
              <>
                {/* Emission Trend Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Carbon Emission Trends</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} kg CO₂`, 'Emission']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="emission" 
                          stroke="#16a34a" 
                          fill="#16a34a" 
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Analytics */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Total Emissions</span>
                        <span className="font-bold text-gray-900">{totalEmissions.toFixed(2)} kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Daily Average</span>
                        <span className="font-bold text-gray-900">{avgEmission.toFixed(2)} kg CO₂</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Best Day</span>
                        <span className="font-bold text-green-600">
                          {Math.min(...userRecords.map(r => r.emission)).toFixed(2)} kg CO₂
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Highest Day</span>
                        <span className="font-bold text-red-600">
                          {Math.max(...userRecords.map(r => r.emission)).toFixed(2)} kg CO₂
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Environmental Impact</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Trees Needed</h4>
                        <p className="text-2xl font-bold text-green-700">
                          {Math.ceil(totalEmissions * 365 / 21)} trees/year
                        </p>
                        <p className="text-sm text-green-600">to offset your annual emissions</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Driving Equivalent</h4>
                        <p className="text-2xl font-bold text-blue-700">
                          {(totalEmissions * 365 / 0.404).toFixed(0)} km/year
                        </p>
                        <p className="text-sm text-blue-600">equivalent car distance</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">Energy Usage</h4>
                        <p className="text-2xl font-bold text-purple-700">
                          {(totalEmissions * 365 * 2.3).toFixed(0)} kWh/year
                        </p>
                        <p className="text-sm text-purple-600">energy equivalent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No Data Available</h3>
                <p className="text-gray-400 mb-6">Complete your first carbon footprint calculation to see analytics</p>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold">
                  Calculate Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={user.city}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-gray-700">Email notifications for new achievements</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-gray-700">Weekly carbon footprint summary</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-gray-700">Community forum notifications</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;