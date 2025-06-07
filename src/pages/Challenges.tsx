import React, { useState } from 'react';
import { useChallenges } from '../contexts/ChallengeContext';
import { useTranslation } from 'react-i18next';
import { Trophy, Target, Calendar, Zap, CheckCircle, Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Challenges: React.FC = () => {
  const { t } = useTranslation();
  const { 
    challenges, 
    userChallenges, 
    dailyStreak, 
    totalPoints, 
    updateProgress, 
    completeChallenge,
    getAvailableChallenges,
    getUserChallengeProgress 
  } = useChallenges();
  
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const availableChallenges = getAvailableChallenges();
  const filteredChallenges = availableChallenges.filter(c => c.type === activeTab);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport': return '🚗';
      case 'energy': return '⚡';
      case 'waste': return '♻️';
      case 'diet': return '🥗';
      case 'water': return '💧';
      default: return '🌱';
    }
  };

  const handleProgressUpdate = (challengeId: string, progress: number) => {
    updateProgress(challengeId, progress);
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && progress >= challenge.target) {
      completeChallenge(challengeId);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent-100 rounded-xl">
              <Trophy className="h-8 w-8 text-accent-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('challenges.title')}</h1>
          <p className="text-gray-600">{t('challenges.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">{t('challenges.streak')}</p>
                <p className="text-3xl font-bold">{dailyStreak}</p>
                <p className="text-orange-100 text-sm">days</p>
              </div>
              <Flame className="h-12 w-12 text-orange-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Points</p>
                <p className="text-3xl font-bold">{totalPoints}</p>
                <p className="text-purple-100 text-sm">earned</p>
              </div>
              <Target className="h-12 w-12 text-purple-200" />
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
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-3xl font-bold">
                  {userChallenges.filter(uc => uc.completed).length}
                </p>
                <p className="text-green-100 text-sm">challenges</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200" />
            </div>
          </motion.div>
        </div>

        {/* Challenge Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'daily'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{t('challenges.daily')}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'weekly'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>{t('challenges.weekly')}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const userProgress = getUserChallengeProgress(challenge.id);
            const progressPercentage = userProgress 
              ? (userProgress.progress / challenge.target) * 100 
              : 0;
            const isCompleted = userProgress?.completed || false;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                  isCompleted ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{challenge.icon}</div>
                    <div className="text-2xl">{getCategoryIcon(challenge.category)}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">
                      {userProgress?.progress || 0} / {challenge.target} {challenge.unit}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-accent-500" />
                      <span className="text-sm font-medium text-accent-600">
                        {challenge.points} points
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600">
                        -{challenge.carbonSaving}kg CO₂
                      </span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center justify-center space-x-2 py-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-700 font-medium">{t('challenges.completed')}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{t('challenges.inProgress')}</span>
                      </div>
                      
                      {/* Quick action buttons for demo */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleProgressUpdate(challenge.id, (userProgress?.progress || 0) + 1)}
                          className="flex-1 py-2 px-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200 text-sm font-medium"
                        >
                          +1 {challenge.unit}
                        </button>
                        <button
                          onClick={() => handleProgressUpdate(challenge.id, challenge.target)}
                          className="py-2 px-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">All challenges completed!</h3>
            <p className="text-gray-400">Check back tomorrow for new challenges.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;