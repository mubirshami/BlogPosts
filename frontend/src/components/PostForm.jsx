import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, getPostById } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { postSchema } from '../validations/postSchemas';
import RichTextEditor from './RichTextEditor';
import LoadingSpinner from './LoadingSpinner';

/**
 * PostForm - Component for creating and editing blog posts
 * Supports both create and edit modes based on URL parameter
 */
const PostForm = () => {
  // Get post ID from URL (if editing)
  const { id } = useParams();
  const isEditMode = !!id; // True if id exists (edit mode), false otherwise (create mode)
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  
  // Validation and UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load post data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  /**
   * Fetches existing post data for editing
   */
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await getPostById(id);
      const post = response.data;
      
      // Populate form with existing post data
      setFormData({
        title: post.title,
        content: post.content,
      });
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles input field changes (title)
   * Clears validation errors when user starts typing
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    setError('');
  };

  /**
   * Handles rich text editor content changes
   * Clears validation errors when user starts typing
   */
  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value,
    });
    
    // Clear content error when user starts typing
    if (errors.content) {
      setErrors({
        ...errors,
        content: '',
      });
    }
  };

  /**
   * Handles form submission
   * Validates form data and creates/updates post
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    // Check authentication
    if (!isAuthenticated) {
      setError('You must be logged in to create/edit posts');
      return;
    }

    // Validate form data with Zod
    const validationResult = postSchema.safeParse(formData);

    if (!validationResult.success) {
      // Extract and display field-specific errors
      const fieldErrors = {};
      validationResult.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Submit form
    setLoading(true);

    try {
      if (isEditMode) {
        await updatePost(id, formData);
      } else {
        await createPost(formData);
      }
      // Navigate to home page after successful save
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" text="Loading post..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          {/* Gradient Header */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Post' : 'Create New Post'}
                </h2>
              </div>
              <p className="text-gray-600 ml-15">
                {isEditMode ? 'Update your blog post' : 'Share your thoughts with the world'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'input-field-error' : ''}`}
              placeholder="Enter a captivating title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <div className={errors.content ? 'border-2 border-red-500 rounded' : ''}>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                error={errors.content}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Use the toolbar above to format your content with rich text editing.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Update Post' : 'Publish Post'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;

