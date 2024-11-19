import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, image_url: imageUrl || null, upvotes: 0 }])
        .select();

      if (error) {
        console.error('Error creating post:', error);
        setError('Failed to create post. Please try again.');
      } else {
        console.log('Post created:', data);
        setTitle('');
        setContent('');
        setImageUrl('');
        if (onPostCreated) onPostCreated(); // Refresh posts
        if (data.length > 0) navigate(`/post/${data[0].id}`); // Redirect to post
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL (optional):</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
