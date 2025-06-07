import React, { createContext, useContext, useState } from 'react';

interface CarbonRecord {
  id: number;
  date: Date;
  emission: number;
  userId: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  authorId: number;
  createdAt: Date;
}

interface DataContextType {
  carbonRecords: CarbonRecord[];
  posts: Post[];
  addCarbonRecord: (emission: number, userId: number) => void;
  addPost: (title: string, content: string, authorId: number, author: string) => void;
  addComment: (postId: number, content: string, authorId: number, author: string) => void;
  toggleLike: (postId: number) => void;
  getUserRecords: (userId: number) => CarbonRecord[];
  getLeaderboard: () => { username: string; city: string; avgEmission: number; rank: number }[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carbonRecords, setCarbonRecords] = useState<CarbonRecord[]>([
    { id: 1, date: new Date(2024, 0, 15), emission: 2.5, userId: 1 },
    { id: 2, date: new Date(2024, 0, 20), emission: 2.1, userId: 1 },
    { id: 3, date: new Date(2024, 0, 25), emission: 1.8, userId: 1 },
    { id: 4, date: new Date(2024, 1, 1), emission: 3.2, userId: 2 },
    { id: 5, date: new Date(2024, 1, 5), emission: 2.9, userId: 2 },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Tips for Reducing Your Carbon Footprint",
      content: "Here are some practical ways to reduce your daily carbon emissions...",
      author: "EcoWarrior",
      authorId: 1,
      likes: 12,
      comments: [
        { id: 1, content: "Great tips! I've started cycling to work.", author: "GreenLiving", authorId: 2, createdAt: new Date() }
      ],
      createdAt: new Date(2024, 0, 10)
    },
    {
      id: 2,
      title: "Renewable Energy at Home",
      content: "Sharing my experience with solar panels and their impact on my carbon footprint...",
      author: "SolarPower",
      authorId: 3,
      likes: 8,
      comments: [],
      createdAt: new Date(2024, 0, 12)
    }
  ]);

  const addCarbonRecord = (emission: number, userId: number) => {
    const newRecord: CarbonRecord = {
      id: Date.now(),
      date: new Date(),
      emission,
      userId,
    };
    setCarbonRecords(prev => [...prev, newRecord]);
  };

  const addPost = (title: string, content: string, authorId: number, author: string) => {
    const newPost: Post = {
      id: Date.now(),
      title,
      content,
      author,
      authorId,
      likes: 0,
      comments: [],
      createdAt: new Date(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const addComment = (postId: number, content: string, authorId: number, author: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [...post.comments, { 
              id: Date.now(), 
              content, 
              author, 
              authorId, 
              createdAt: new Date() 
            }] 
          }
        : post
    ));
  };

  const toggleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const getUserRecords = (userId: number) => {
    return carbonRecords.filter(record => record.userId === userId);
  };

  const getLeaderboard = () => {
    const userEmissions = carbonRecords.reduce((acc, record) => {
      if (!acc[record.userId]) {
        acc[record.userId] = { total: 0, count: 0 };
      }
      acc[record.userId].total += record.emission;
      acc[record.userId].count += 1;
      return acc;
    }, {} as Record<number, { total: number; count: number }>);

    const mockUsers = [
      { id: 1, username: 'EcoWarrior', city: 'San Francisco' },
      { id: 2, username: 'GreenLiving', city: 'Portland' },
      { id: 3, username: 'SolarPower', city: 'Austin' },
    ];

    return Object.entries(userEmissions)
      .map(([userId, data]) => {
        const user = mockUsers.find(u => u.id === parseInt(userId));
        return {
          username: user?.username || 'Unknown',
          city: user?.city || 'Unknown',
          avgEmission: data.total / data.count,
          rank: 0,
        };
      })
      .sort((a, b) => a.avgEmission - b.avgEmission)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  };

  const value = {
    carbonRecords,
    posts,
    addCarbonRecord,
    addPost,
    addComment,
    toggleLike,
    getUserRecords,
    getLeaderboard,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};