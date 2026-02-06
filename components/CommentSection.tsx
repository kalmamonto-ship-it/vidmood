'use client';

import { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import { CommentData } from '../types/comment';

interface CommentSectionProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentSection({ videoId, isOpen, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadComments();
      checkCurrentUser();
    }
  }, [isOpen, videoId]);

  const checkCurrentUser = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await commentService.getCommentsByVideoId(videoId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login to add a comment');
      return;
    }
    
    if (!newComment.trim()) return;

    try {
      const userProfile = await authService.getUserProfile(currentUser.uid);
      
      const commentToAdd = {
        videoId,
        userId: currentUser.uid,
        userName: userProfile?.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
        text: newComment
      };
      
      const commentId = await commentService.addComment(commentToAdd);
      
      // Add to local state
      const newCommentObj: CommentData = {
        id: commentId,
        ...commentToAdd,
        createdAt: new Date()
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
      <div className="bg-gray-900 w-full h-3/4 md:h-2/3 md:max-w-2xl rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold">Comments ({comments.length})</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-sm text-white">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-800 rounded-2xl px-4 py-2">
                    <div className="font-semibold text-white text-sm">
                      {comment.userName}
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      {comment.text}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {comment.createdAt.toLocaleDateString()} • {comment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {currentUser ? (
          <form onSubmit={handleAddComment} className="border-t border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-blue-500 text-white rounded-full px-4 py-2 font-medium disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={() => {
                // Trigger auth modal - this would depend on your app's auth modal implementation
                alert('Please login to comment');
              }}
              className="w-full bg-blue-500 text-white rounded-full px-4 py-2 font-medium"
            >
              Login to Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}