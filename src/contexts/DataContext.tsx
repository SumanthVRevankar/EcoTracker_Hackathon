import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, type CarbonRecord, type CommunityPost, type PostComment, type PostLike, type Profile } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
}

interface DataContextType {
  carbonRecords: CarbonRecord[];
  posts: Post[];
  addCarbonRecord: (emission: number, calculationData: any) => Promise<void>;
  addPost: (title: string, content: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  getUserRecords: (userId: string) => CarbonRecord[];
  getLeaderboard: () => Promise<{ username: string; city: string; avgEmission: number; rank: number }[]>;
  loading: boolean;
  refreshPosts: () => Promise<void>;
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
  const { user, session } = useAuth();
  const [carbonRecords, setCarbonRecords] = useState<CarbonRecord[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchCarbonRecords();
      fetchPosts();
    }
  }, [session]);

  const fetchCarbonRecords = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('carbon_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching carbon records:', error);
      } else {
        setCarbonRecords(data || []);
      }
    } catch (error) {
      console.error('Error fetching carbon records:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (username, city)
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        return;
      }

      // Fetch comments and likes for each post
      const postsWithDetails = await Promise.all(
        (postsData || []).map(async (post) => {
          // Fetch comments
          const { data: commentsData } = await supabase
            .from('post_comments')
            .select(`
              *,
              profiles (username)
            `)
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

          // Fetch likes count
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.profiles?.username || 'Anonymous',
            authorId: post.user_id,
            likes: likesCount || 0,
            comments: (commentsData || []).map((comment: any) => ({
              id: comment.id,
              content: comment.content,
              author: comment.profiles?.username || 'Anonymous',
              authorId: comment.user_id,
              createdAt: new Date(comment.created_at),
            })),
            createdAt: new Date(post.created_at),
          };
        })
      );

      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const addCarbonRecord = async (emission: number, calculationData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('carbon_records')
        .insert([
          {
            user_id: user.id,
            emission,
            calculation_data: calculationData,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding carbon record:', error);
      } else {
        setCarbonRecords(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding carbon record:', error);
    }
  };

  const addPost = async (title: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            title,
            content,
            likes_count: 0,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding post:', error);
      } else {
        await fetchPosts(); // Refresh posts to get the new one with profile data
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content,
          },
        ]);

      if (error) {
        console.error('Error adding comment:', error);
      } else {
        await fetchPosts(); // Refresh posts to get updated comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert([
            {
              post_id: postId,
              user_id: user.id,
            },
          ]);
      }

      await fetchPosts(); // Refresh posts to get updated like counts
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getUserRecords = (userId: string) => {
    return carbonRecords.filter(record => record.user_id === userId);
  };

  const getLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('carbon_records')
        .select(`
          user_id,
          emission,
          profiles (username, city)
        `);

      if (error) {
        console.error('Error fetching leaderboard data:', error);
        return [];
      }

      // Calculate average emissions per user
      const userEmissions: Record<string, { total: number; count: number; username: string; city: string }> = {};

      data?.forEach((record: any) => {
        const userId = record.user_id;
        if (!userEmissions[userId]) {
          userEmissions[userId] = {
            total: 0,
            count: 0,
            username: record.profiles?.username || 'Anonymous',
            city: record.profiles?.city || 'Unknown',
          };
        }
        userEmissions[userId].total += record.emission;
        userEmissions[userId].count += 1;
      });

      // Convert to leaderboard format and sort
      const leaderboard = Object.entries(userEmissions)
        .map(([userId, data]) => ({
          username: data.username,
          city: data.city,
          avgEmission: data.total / data.count,
          rank: 0,
        }))
        .sort((a, b) => a.avgEmission - b.avgEmission)
        .map((item, index) => ({ ...item, rank: index + 1 }));

      return leaderboard;
    } catch (error) {
      console.error('Error calculating leaderboard:', error);
      return [];
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
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
    loading,
    refreshPosts,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};