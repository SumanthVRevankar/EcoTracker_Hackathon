import React from 'react';
import { useData } from '../contexts/DataContext';
import { Trophy, Medal, Award, TrendingDown, MapPin } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { getLeaderboard } = useData();
  const leaderboard = getLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-primary-400 to-primary-600';
    }
  };

  const getEmissionLevel = (emission: number) => {
    if (emission < 1.5) return { level: 'Excellent', color: 'text-green-600 bg-green-50' };
    if (emission < 2.0) return { level: 'Good', color: 'text-blue-600 bg-blue-50' };
    if (emission < 2.5) return { level: 'Fair', color: 'text-yellow-600 bg-yellow-50' };
    return { level: 'Needs Improvement', color: 'text-red-600 bg-red-50' };
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent-100 rounded-xl">
              <Trophy className="h-8 w-8 text-accent-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carbon Footprint Leaderboard</h1>
          <p className="text-gray-600">See how your carbon footprint compares with other eco-warriors</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Best Performer</p>
                <p className="text-2xl font-bold">{leaderboard[0]?.avgEmission.toFixed(2)} kg CO₂</p>
                <p className="text-green-100 text-sm">{leaderboard[0]?.username}</p>
              </div>
              <Trophy className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Average Emission</p>
                <p className="text-2xl font-bold">
                  {leaderboard.length > 0 
                    ? (leaderboard.reduce((sum, item) => sum + item.avgEmission, 0) / leaderboard.length).toFixed(2)
                    : '0.00'
                  } kg CO₂
                </p>
                <p className="text-blue-100 text-sm">Community Average</p>
              </div>
              <TrendingDown className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{leaderboard.length}</p>
                <p className="text-purple-100 text-sm">Active Members</p>
              </div>
              <Award className="h-12 w-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
            <h2 className="text-2xl font-bold">Top Eco-Warriors</h2>
            <p className="text-primary-100">Ranked by lowest average carbon emissions</p>
          </div>

          <div className="p-6">
            {leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((user, index) => {
                  const emissionLevel = getEmissionLevel(user.avgEmission);
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
                        user.rank <= 3 
                          ? `bg-gradient-to-r ${getRankColor(user.rank)} text-white` 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(user.rank)}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                            user.rank <= 3 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                          }`}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          
                          <div>
                            <h3 className={`font-bold text-lg ${user.rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                              {user.username}
                            </h3>
                            <div className={`flex items-center space-x-1 text-sm ${user.rank <= 3 ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                              <MapPin className="h-3 w-3" />
                              <span>{user.city}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-2xl font-bold ${user.rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                          {user.avgEmission.toFixed(2)} kg CO₂
                        </div>
                        <div className={`text-sm ${user.rank <= 3 ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                          daily average
                        </div>
                        {user.rank > 3 && (
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${emissionLevel.color}`}>
                            {emissionLevel.level}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No data available</h3>
                <p className="text-gray-400">Complete your carbon footprint calculation to see the leaderboard!</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Achievement Levels</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">Eco Champion</p>
                <p className="text-sm text-green-700">&lt; 1.5 kg CO₂/day</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Medal className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Green Guardian</p>
                <p className="text-sm text-blue-700">1.5 - 2.0 kg CO₂/day</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-yellow-900">Eco Learner</p>
                <p className="text-sm text-yellow-700">2.0 - 2.5 kg CO₂/day</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-red-900">Getting Started</p>
                <p className="text-sm text-red-700">&gt; 2.5 kg CO₂/day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;