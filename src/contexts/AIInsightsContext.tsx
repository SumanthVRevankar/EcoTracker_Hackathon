import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';

interface AIInsight {
  id: string;
  type: 'tip' | 'trend' | 'goal' | 'achievement';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  category: 'transport' | 'energy' | 'diet' | 'waste' | 'general';
  carbonImpact?: number;
  createdAt: Date;
  read: boolean;
}

interface PersonalizedGoal {
  id: string;
  title: string;
  description: string;
  targetReduction: number; // percentage
  timeframe: 'week' | 'month' | 'quarter';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedSaving: number; // kg CO2
}

interface AIInsightsContextType {
  insights: AIInsight[];
  goals: PersonalizedGoal[];
  trendAnalysis: string;
  generateInsights: () => void;
  markInsightAsRead: (id: string) => void;
  acceptGoal: (goalId: string) => void;
}

const AIInsightsContext = createContext<AIInsightsContextType | undefined>(undefined);

export const useAIInsights = () => {
  const context = useContext(AIInsightsContext);
  if (context === undefined) {
    throw new Error('useAIInsights must be used within an AIInsightsProvider');
  }
  return context;
};

export const AIInsightsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { getUserRecords } = useData();
  
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [goals, setGoals] = useState<PersonalizedGoal[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState('');

  const generateTrendAnalysis = (records: any[]) => {
    if (records.length < 2) {
      return "Start tracking more data to see personalized insights about your carbon footprint trends.";
    }

    const recent = records.slice(-7); // Last 7 records
    const older = records.slice(-14, -7); // Previous 7 records
    
    const recentAvg = recent.reduce((sum, r) => sum + r.emission, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, r) => sum + r.emission, 0) / older.length : recentAvg;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (Math.abs(change) < 5) {
      return `Your carbon footprint has remained stable at ${recentAvg.toFixed(2)} kg CO₂ per day. Consider trying new eco-friendly habits to reduce your impact further.`;
    } else if (change < 0) {
      return `Excellent progress! Your emissions have decreased by ${Math.abs(change).toFixed(1)}% compared to last week. You're now averaging ${recentAvg.toFixed(2)} kg CO₂ per day. Keep up the great work!`;
    } else {
      return `Your emissions have increased by ${change.toFixed(1)}% this week to ${recentAvg.toFixed(2)} kg CO₂ per day. Let's work on some strategies to get back on track with your environmental goals.`;
    }
  };

  const generatePersonalizedTips = (records: any[]) => {
    const tips: AIInsight[] = [];
    
    if (records.length === 0) return tips;

    const avgEmission = records.reduce((sum, r) => sum + r.emission, 0) / records.length;
    
    // High emissions tip
    if (avgEmission > 3.0) {
      tips.push({
        id: 'high-emissions-tip',
        type: 'tip',
        title: 'Reduce Transportation Emissions',
        content: 'Your carbon footprint is above average. Consider using public transport, cycling, or walking for short trips. Even replacing one car trip per day can reduce your emissions by 20-30%.',
        priority: 'high',
        category: 'transport',
        carbonImpact: 1.2,
        createdAt: new Date(),
        read: false
      });
    }

    // Moderate emissions tip
    if (avgEmission > 2.0 && avgEmission <= 3.0) {
      tips.push({
        id: 'moderate-emissions-tip',
        type: 'tip',
        title: 'Optimize Energy Usage',
        content: 'You\'re doing well! To further reduce your footprint, try switching to LED bulbs, unplugging devices when not in use, and adjusting your thermostat by 2°C.',
        priority: 'medium',
        category: 'energy',
        carbonImpact: 0.8,
        createdAt: new Date(),
        read: false
      });
    }

    // Low emissions encouragement
    if (avgEmission <= 2.0) {
      tips.push({
        id: 'low-emissions-tip',
        type: 'achievement',
        title: 'Eco Champion Status!',
        content: 'Congratulations! Your carbon footprint is well below average. You\'re making a real difference. Consider sharing your eco-friendly habits with the community to inspire others.',
        priority: 'high',
        category: 'general',
        createdAt: new Date(),
        read: false
      });
    }

    // Weekly pattern analysis
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 1) { // Monday
      tips.push({
        id: 'monday-motivation',
        type: 'tip',
        title: 'Start Your Week Green',
        content: 'Monday is perfect for setting eco-friendly intentions! Plan your meals to reduce food waste, choose sustainable transport options, and set a weekly carbon reduction goal.',
        priority: 'medium',
        category: 'general',
        createdAt: new Date(),
        read: false
      });
    }

    return tips;
  };

  const generatePersonalizedGoals = (records: any[]) => {
    const goals: PersonalizedGoal[] = [];
    
    if (records.length === 0) return goals;

    const avgEmission = records.reduce((sum, r) => sum + r.emission, 0) / records.length;

    // Transport goal
    if (avgEmission > 2.5) {
      goals.push({
        id: 'reduce-transport-emissions',
        title: 'Reduce Transportation Footprint',
        description: 'Cut your transport-related emissions by using alternative modes of transport 3 days per week',
        targetReduction: 15,
        timeframe: 'month',
        category: 'transport',
        difficulty: 'medium',
        estimatedSaving: 4.5
      });
    }

    // Energy goal
    goals.push({
      id: 'energy-efficiency',
      title: 'Improve Home Energy Efficiency',
      description: 'Reduce energy consumption through smart usage habits and efficient appliances',
      targetReduction: 10,
      timeframe: 'month',
      category: 'energy',
      difficulty: 'easy',
      estimatedSaving: 2.8
    });

    // Diet goal
    if (avgEmission > 2.0) {
      goals.push({
        id: 'sustainable-diet',
        title: 'Adopt More Plant-Based Meals',
        description: 'Replace meat with plant-based alternatives 2-3 times per week',
        targetReduction: 12,
        timeframe: 'month',
        category: 'diet',
        difficulty: 'medium',
        estimatedSaving: 3.2
      });
    }

    return goals;
  };

  const generateInsights = () => {
    if (!user) return;

    const userRecords = getUserRecords(user.id);
    
    // Generate trend analysis
    const analysis = generateTrendAnalysis(userRecords);
    setTrendAnalysis(analysis);

    // Generate personalized tips
    const newTips = generatePersonalizedTips(userRecords);
    setInsights(prev => {
      // Remove old tips and add new ones
      const filtered = prev.filter(insight => insight.type !== 'tip' && insight.type !== 'achievement');
      return [...filtered, ...newTips];
    });

    // Generate personalized goals
    const newGoals = generatePersonalizedGoals(userRecords);
    setGoals(newGoals);
  };

  useEffect(() => {
    if (user) {
      generateInsights();
    }
  }, [user]);

  const markInsightAsRead = (id: string) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === id ? { ...insight, read: true } : insight
      )
    );
  };

  const acceptGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setInsights(prev => [...prev, {
        id: `goal-accepted-${goalId}`,
        type: 'goal',
        title: 'New Goal Accepted',
        content: `You've committed to: ${goal.title}. Track your progress and aim to save ${goal.estimatedSaving} kg CO₂!`,
        priority: 'high',
        category: goal.category as any,
        carbonImpact: goal.estimatedSaving,
        createdAt: new Date(),
        read: false
      }]);
    }
  };

  const value = {
    insights,
    goals,
    trendAnalysis,
    generateInsights,
    markInsightAsRead,
    acceptGoal,
  };

  return (
    <AIInsightsContext.Provider value={value}>
      {children}
    </AIInsightsContext.Provider>
  );
};