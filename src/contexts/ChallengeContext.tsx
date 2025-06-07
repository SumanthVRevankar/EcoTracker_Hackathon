import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  category: 'transport' | 'energy' | 'waste' | 'diet' | 'water';
  points: number;
  target: number;
  unit: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  carbonSaving: number; // kg CO2 saved
}

interface UserChallenge {
  challengeId: string;
  userId: number;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  startedAt: Date;
}

interface ChallengeContextType {
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  dailyStreak: number;
  totalPoints: number;
  updateProgress: (challengeId: string, progress: number) => void;
  completeChallenge: (challengeId: string) => void;
  getAvailableChallenges: () => Challenge[];
  getUserChallengeProgress: (challengeId: string) => UserChallenge | undefined;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenges = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
};

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addNotification, sendPushNotification } = useNotifications();
  
  const [challenges] = useState<Challenge[]>([
    {
      id: 'walk-5km',
      title: 'Walk 5km Today',
      description: 'Replace car trips with walking for short distances',
      type: 'daily',
      category: 'transport',
      points: 50,
      target: 5,
      unit: 'km',
      icon: '🚶',
      difficulty: 'easy',
      carbonSaving: 1.2
    },
    {
      id: 'no-meat-day',
      title: 'Meat-Free Day',
      description: 'Go vegetarian for the entire day',
      type: 'daily',
      category: 'diet',
      points: 75,
      target: 1,
      unit: 'day',
      icon: '🥗',
      difficulty: 'medium',
      carbonSaving: 2.5
    },
    {
      id: 'reduce-shower-time',
      title: 'Short Showers',
      description: 'Keep showers under 5 minutes',
      type: 'daily',
      category: 'water',
      points: 30,
      target: 5,
      unit: 'minutes',
      icon: '🚿',
      difficulty: 'easy',
      carbonSaving: 0.8
    },
    {
      id: 'zero-waste-day',
      title: 'Zero Waste Day',
      description: 'Produce no single-use plastic waste',
      type: 'daily',
      category: 'waste',
      points: 100,
      target: 1,
      unit: 'day',
      icon: '♻️',
      difficulty: 'hard',
      carbonSaving: 1.5
    },
    {
      id: 'led-lights-only',
      title: 'LED Lights Only',
      description: 'Use only LED bulbs for lighting',
      type: 'daily',
      category: 'energy',
      points: 40,
      target: 1,
      unit: 'day',
      icon: '💡',
      difficulty: 'easy',
      carbonSaving: 0.6
    },
    {
      id: 'bike-to-work-week',
      title: 'Bike to Work Week',
      description: 'Cycle to work for 5 days this week',
      type: 'weekly',
      category: 'transport',
      points: 200,
      target: 5,
      unit: 'days',
      icon: '🚴',
      difficulty: 'medium',
      carbonSaving: 8.5
    },
    {
      id: 'plant-based-week',
      title: 'Plant-Based Week',
      description: 'Eat only plant-based meals for a week',
      type: 'weekly',
      category: 'diet',
      points: 300,
      target: 7,
      unit: 'days',
      icon: '🌱',
      difficulty: 'hard',
      carbonSaving: 15.2
    },
    {
      id: 'energy-saving-week',
      title: 'Energy Saving Week',
      description: 'Reduce energy consumption by 20% this week',
      type: 'weekly',
      category: 'energy',
      points: 250,
      target: 20,
      unit: '%',
      icon: '⚡',
      difficulty: 'medium',
      carbonSaving: 12.0
    }
  ]);

  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (user) {
      // Initialize user challenges for today/this week
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      
      const existingChallenges = userChallenges.filter(uc => 
        challenges.find(c => c.id === uc.challengeId)
      );

      const newChallenges = challenges
        .filter(challenge => {
          const hasExisting = existingChallenges.some(uc => uc.challengeId === challenge.id);
          if (challenge.type === 'daily') {
            // Check if user has today's challenge
            const todayChallenge = existingChallenges.find(uc => 
              uc.challengeId === challenge.id && 
              new Date(uc.startedAt).toDateString() === new Date().toDateString()
            );
            return !todayChallenge;
          } else {
            // Check if user has this week's challenge
            const weekChallenge = existingChallenges.find(uc => 
              uc.challengeId === challenge.id && 
              new Date(uc.startedAt) >= startOfWeek
            );
            return !weekChallenge;
          }
        })
        .map(challenge => ({
          challengeId: challenge.id,
          userId: user.id,
          progress: 0,
          completed: false,
          startedAt: new Date()
        }));

      if (newChallenges.length > 0) {
        setUserChallenges(prev => [...prev, ...newChallenges]);
      }
    }
  }, [user, challenges]);

  const updateProgress = (challengeId: string, progress: number) => {
    setUserChallenges(prev => 
      prev.map(uc => 
        uc.challengeId === challengeId 
          ? { ...uc, progress: Math.min(progress, challenges.find(c => c.id === challengeId)?.target || 0) }
          : uc
      )
    );
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    setUserChallenges(prev => 
      prev.map(uc => 
        uc.challengeId === challengeId 
          ? { ...uc, completed: true, completedAt: new Date(), progress: challenge.target }
          : uc
      )
    );

    setTotalPoints(prev => prev + challenge.points);

    // Update daily streak for daily challenges
    if (challenge.type === 'daily') {
      setDailyStreak(prev => prev + 1);
    }

    // Send notifications
    addNotification({
      type: 'success',
      title: 'Challenge Completed! 🎉',
      message: `You completed "${challenge.title}" and earned ${challenge.points} points!`
    });

    sendPushNotification(
      'Challenge Completed!',
      `Great job! You completed "${challenge.title}" and saved ${challenge.carbonSaving}kg CO₂`
    );
  };

  const getAvailableChallenges = () => {
    return challenges.filter(challenge => {
      const userChallenge = userChallenges.find(uc => uc.challengeId === challenge.id);
      return !userChallenge?.completed;
    });
  };

  const getUserChallengeProgress = (challengeId: string) => {
    return userChallenges.find(uc => uc.challengeId === challengeId);
  };

  const value = {
    challenges,
    userChallenges,
    dailyStreak,
    totalPoints,
    updateProgress,
    completeChallenge,
    getAvailableChallenges,
    getUserChallengeProgress,
  };

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};