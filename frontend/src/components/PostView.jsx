import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';
import Alert from './Alert';
import LoadingSpinner from './LoadingSpinner';

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  // Dialog and alert states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [showAlert, setShowAlert] = useState(false);

  // Fetch post data when component mounts or id changes
  useEffect(() => {
    fetchPost();
  }, [id]);

  /**
   * Fetches a single post by ID from the API
   */
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await getPostById(id);
      setPost(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the delete confirmation dialog
   */
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Confirms and executes the delete operation
   */
  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);

    try {
      setDeleting(true);
      await deletePost(id);
      // Navigate to home page after successful deletion
      navigate('/');
    } catch (err) {
      setDeleting(false);
      showAlertMessage('Failed to delete post. Please try again.', 'error');
      console.error(err);
    }
  };

  /**
   * Cancels the delete operation
   */
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  /**
   * Shows an alert message
   */
  const showAlertMessage = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  /**
   * Closes the alert
   */
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // Check if current user is the owner of the post
  const isOwner = user && post && user.id === post.authorId._id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" text="Loading post..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium text-lg mb-4">{error || 'Post not found'}</p>
          <Link to="/" className="btn-secondary">
            Go back to posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Alert Message */}
      <Alert
        type={alertType}
        message={alertMessage}
        isVisible={showAlert}
        onClose={handleCloseAlert}
      />

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card">
            {/* Gradient Header */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="p-8">
              {/* Post Header */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {/* Post Meta Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {post.authorId?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {post.authorId?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Owner Actions */}
                  {isOwner && (
                    <div className="flex space-x-3">
                      <Link
                        to={`/posts/${post._id}/edit`}
                        className="flex items-center space-x-1 px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={handleDeleteClick}
                        disabled={deleting}
                        className="flex items-center space-x-1 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium transition-colors disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to all posts</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostView;

