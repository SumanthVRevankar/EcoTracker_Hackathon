import React, { useState } from 'react';
import { useAIInsights } from '../contexts/AIInsightsContext';
import { useTranslation } from 'react-i18next';
import { Brain, TrendingUp, Target, Lightbulb, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Insights: React.FC = () => {
  const { t } = useTranslation();
  const { insights, goals, trendAnalysis, markInsightAsRead, acceptGoal } = useAIInsights();
  const [activeTab, setActiveTab] = useState<'insights' | 'trends' | 'goals'>('insights');

  const unreadInsights = insights.filter(insight => !insight.read);
  const tips = insights.filter(insight => insight.type === 'tip');
  const achievements = insights.filter(insight => insight.type === 'achievement');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport': return '🚗';
      case 'energy': return '⚡';
      case 'diet': return '🥗';
      case 'waste': return '♻️';
      case 'general': return '🌱';
      default: return '💡';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('insights.title')}</h1>
          <p className="text-gray-600">{t('insights.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">New Insights</p>
                <p className="text-3xl font-bold">{unreadInsights.length}</p>
                <p className="text-purple-100 text-sm">unread</p>
              </div>
              <Lightbulb className="h-12 w-12 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Goals</p>
                <p className="text-3xl font-bold">{goals.length}</p>
                <p className="text-blue-100 text-sm">recommended</p>
              </div>
              <Target className="h-12 w-12 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Achievements</p>
                <p className="text-3xl font-bold">{achievements.length}</p>
                <p className="text-green-100 text-sm">unlocked</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>{t('insights.personalizedTips')}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'trends'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>{t('insights.trendAnalysis')}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'goals'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>{t('insights.goals')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                    getPriorityColor(insight.priority)
                  } ${!insight.read ? 'ring-2 ring-purple-300' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCategoryIcon(insight.category)}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{insight.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {insight.priority} priority
                          </span>
                          <span>•</span>
                          <span>{insight.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {!insight.read && (
                      <button
                        onClick={() => markInsightAsRead(insight.id)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{insight.content}</p>

                  {insight.carbonImpact && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Potential saving: {insight.carbonImpact} kg CO₂</span>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No insights yet</h3>
                <p className="text-gray-400">Complete more carbon footprint calculations to get personalized insights.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">AI Trend Analysis</h2>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <p className="text-gray-700 leading-relaxed text-lg">{trendAnalysis}</p>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-3">Positive Trends</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Consistent tracking habits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Awareness of environmental impact</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Active community participation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">Areas for Improvement</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Transportation choices</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Energy consumption patterns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Waste reduction opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCategoryIcon(goal.category)}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{goal.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(goal.difficulty)}`}>
                            {goal.difficulty}
                          </span>
                          <span>•</span>
                          <span>{goal.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => acceptGoal(goal.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                    >
                      <span>Accept Goal</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{goal.description}</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-blue-600 font-medium">Target Reduction</p>
                      <p className="text-xl font-bold text-blue-900">{goal.targetReduction}%</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-green-600 font-medium">Estimated Saving</p>
                      <p className="text-xl font-bold text-green-900">{goal.estimatedSaving} kg CO₂</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-sm text-purple-600 font-medium">Timeframe</p>
                      <p className="text-xl font-bold text-purple-900 capitalize">{goal.timeframe}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No goals available</h3>
                <p className="text-gray-400">Complete more carbon footprint calculations to get personalized goals.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;