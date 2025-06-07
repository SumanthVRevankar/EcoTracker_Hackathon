import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Users, MessageCircle, Heart, Plus, Send, Calendar } from 'lucide-react';

const Community: React.FC = () => {
  const { user } = useAuth();
  const { posts, addPost, addComment, toggleLike } = useData();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newPost.title && newPost.content) {
      addPost(newPost.title, newPost.content, user.id, user.username);
      setNewPost({ title: '', content: '' });
      setShowNewPost(false);
    }
  };

  const handleSubmitComment = (postId: number) => {
    const content = commentInputs[postId];
    if (user && content) {
      addComment(postId, content, user.id, user.username);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
          <p className="text-gray-600">Connect with eco-conscious individuals and share sustainable living tips</p>
        </div>

        {/* New Post Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Post</span>
          </button>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Thoughts</h3>
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="What's on your mind about sustainability?"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{post.author}</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 pb-4 border-b border-gray-100">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <Heart className={`h-5 w-5 ${post.likes > 0 ? 'fill-current text-red-500' : ''}`} />
                  <span>{post.likes} likes</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments.length} comments</span>
                </div>
              </div>

              {/* Comments */}
              <div className="mt-4 space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {/* Add Comment */}
                {user && (
                  <div className="flex space-x-3 mt-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.username.charAt(0)}
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                      />
                      <button
                        onClick={() => handleSubmitComment(post.id)}
                        className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No posts yet</h3>
            <p className="text-gray-400">Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;