import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { supabase, type UserChallenge } from '../lib/supabase';

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

interface ChallengeContextType {
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  dailyStreak: number;
  totalPoints: number;
  updateProgress: (challengeId: string, progress: number) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
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
      fetchUserChallenges();
      calculateStats();
    }
  }, [user]);

  const fetchUserChallenges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching user challenges:', error);
      } else {
        setUserChallenges(data || []);
      }
    } catch (error) {
      console.error('Error fetching user challenges:', error);
    }
  };

  const calculateStats = async () => {
    if (!user) return;

    try {
      // Calculate total points from completed challenges
      const { data: completedChallenges } = await supabase
        .from('user_challenges')
        .select('challenge_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      let points = 0;
      completedChallenges?.forEach((uc) => {
        const challenge = challenges.find(c => c.id === uc.challenge_id);
        if (challenge) {
          points += challenge.points;
        }
      });
      setTotalPoints(points);

      // Calculate daily streak (simplified - count consecutive days with completed daily challenges)
      const { data: recentChallenges } = await supabase
        .from('user_challenges')
        .select('completed_at, challenge_id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(30);

      let streak = 0;
      const today = new Date();
      const dailyChallengeIds = challenges.filter(c => c.type === 'daily').map(c => c.id);

      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toDateString();

        const hasCompletedDaily = recentChallenges?.some(rc => {
          const completedDate = new Date(rc.completed_at!).toDateString();
          return completedDate === dateStr && dailyChallengeIds.includes(rc.challenge_id);
        });

        if (hasCompletedDaily) {
          streak++;
        } else {
          break;
        }
      }
      setDailyStreak(streak);
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const updateProgress = async (challengeId: string, progress: number) => {
    if (!user) return;

    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const clampedProgress = Math.min(progress, challenge.target);

      // Check if user challenge exists
      const existingChallenge = userChallenges.find(uc => uc.challenge_id === challengeId);

      if (existingChallenge) {
        // Update existing challenge
        const { error } = await supabase
          .from('user_challenges')
          .update({ progress: clampedProgress })
          .eq('id', existingChallenge.id);

        if (error) {
          console.error('Error updating challenge progress:', error);
        } else {
          setUserChallenges(prev => 
            prev.map(uc => 
              uc.id === existingChallenge.id 
                ? { ...uc, progress: clampedProgress }
                : uc
            )
          );
        }
      } else {
        // Create new challenge
        const { data, error } = await supabase
          .from('user_challenges')
          .insert([
            {
              user_id: user.id,
              challenge_id: challengeId,
              progress: clampedProgress,
              completed: false,
              started_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('Error creating challenge:', error);
        } else {
          setUserChallenges(prev => [...prev, data]);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const completeChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const existingChallenge = userChallenges.find(uc => uc.challenge_id === challengeId);

      if (existingChallenge) {
        // Update existing challenge
        const { error } = await supabase
          .from('user_challenges')
          .update({ 
            completed: true, 
            completed_at: new Date().toISOString(),
            progress: challenge.target 
          })
          .eq('id', existingChallenge.id);

        if (error) {
          console.error('Error completing challenge:', error);
        } else {
          setUserChallenges(prev => 
            prev.map(uc => 
              uc.id === existingChallenge.id 
                ? { 
                    ...uc, 
                    completed: true, 
                    completed_at: new Date().toISOString(),
                    progress: challenge.target 
                  }
                : uc
            )
          );
          
          // Recalculate stats
          calculateStats();

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
        }
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const getAvailableChallenges = () => {
    return challenges.filter(challenge => {
      const userChallenge = userChallenges.find(uc => uc.challenge_id === challenge.id);
      return !userChallenge?.completed;
    });
  };

  const getUserChallengeProgress = (challengeId: string) => {
    return userChallenges.find(uc => uc.challenge_id === challengeId);
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