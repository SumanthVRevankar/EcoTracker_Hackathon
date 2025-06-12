import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { supabase, type AIInsight } from '../lib/supabase';

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
  generateInsights: () => Promise<void>;
  markInsightAsRead: (id: string) => Promise<void>;
  acceptGoal: (goalId: string) => Promise<void>;
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

  useEffect(() => {
    if (user) {
      fetchInsights();
      generateInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching insights:', error);
      } else {
        setInsights(data || []);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

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

  const generatePersonalizedTips = async (records: any[]) => {
    if (!user || records.length === 0) return;

    const avgEmission = records.reduce((sum, r) => sum + r.emission, 0) / records.length;
    
    const newInsights: Omit<AIInsight, 'id' | 'created_at'>[] = [];

    // High emissions tip
    if (avgEmission > 3.0) {
      newInsights.push({
        user_id: user.id,
        type: 'tip',
        title: 'Reduce Transportation Emissions',
        content: 'Your carbon footprint is above average. Consider using public transport, cycling, or walking for short trips. Even replacing one car trip per day can reduce your emissions by 20-30%.',
        priority: 'high',
        category: 'transport',
        carbon_impact: 1.2,
        read: false
      });
    }

    // Moderate emissions tip
    if (avgEmission > 2.0 && avgEmission <= 3.0) {
      newInsights.push({
        user_id: user.id,
        type: 'tip',
        title: 'Optimize Energy Usage',
        content: 'You\'re doing well! To further reduce your footprint, try switching to LED bulbs, unplugging devices when not in use, and adjusting your thermostat by 2°C.',
        priority: 'medium',
        category: 'energy',
        carbon_impact: 0.8,
        read: false
      });
    }

    // Low emissions encouragement
    if (avgEmission <= 2.0) {
      newInsights.push({
        user_id: user.id,
        type: 'achievement',
        title: 'Eco Champion Status!',
        content: 'Congratulations! Your carbon footprint is well below average. You\'re making a real difference. Consider sharing your eco-friendly habits with the community to inspire others.',
        priority: 'high',
        category: 'general',
        carbon_impact: null,
        read: false
      });
    }

    // Save insights to database
    if (newInsights.length > 0) {
      try {
        const { error } = await supabase
          .from('ai_insights')
          .insert(newInsights);

        if (error) {
          console.error('Error saving insights:', error);
        } else {
          await fetchInsights(); // Refresh insights
        }
      } catch (error) {
        console.error('Error saving insights:', error);
      }
    }
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

  const generateInsights = async () => {
    if (!user) return;

    const userRecords = getUserRecords(user.id);
    
    // Generate trend analysis
    const analysis = generateTrendAnalysis(userRecords);
    setTrendAnalysis(analysis);

    // Generate personalized tips
    await generatePersonalizedTips(userRecords);

    // Generate personalized goals
    const newGoals = generatePersonalizedGoals(userRecords);
    setGoals(newGoals);
  };

  const markInsightAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_insights')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking insight as read:', error);
      } else {
        setInsights(prev => 
          prev.map(insight => 
            insight.id === id ? { ...insight, read: true } : insight
          )
        );
      }
    } catch (error) {
      console.error('Error marking insight as read:', error);
    }
  };

  const acceptGoal = async (goalId: string) => {
    if (!user) return;

    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      try {
        const { error } = await supabase
          .from('ai_insights')
          .insert([{
            user_id: user.id,
            type: 'goal',
            title: 'New Goal Accepted',
            content: `You've committed to: ${goal.title}. Track your progress and aim to save ${goal.estimatedSaving} kg CO₂!`,
            priority: 'high',
            category: goal.category,
            carbon_impact: goal.estimatedSaving,
            read: false
          }]);

        if (error) {
          console.error('Error accepting goal:', error);
        } else {
          await fetchInsights(); // Refresh insights
        }
      } catch (error) {
        console.error('Error accepting goal:', error);
      }
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