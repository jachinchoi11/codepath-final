import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Import Supabase client

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setPost(data);
      setEditTitle(data.title);
      setEditContent(data.content);
      setEditImageUrl(data.image_url);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editTitle,
          content: editContent,
          image_url: editImageUrl,
        })
        .eq('id', id);

      if (error) throw error;

      setIsEditing(false);
      fetchPost();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  async function handleDelete() {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      navigate('/'); // Redirect to the home page after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {isEditing ? (
        <div>
          <h2>Edit Post</h2>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Post Title"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={5}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Post Content"
          />
          <input
            type="url"
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Image URL"
          />
          <button onClick={handleUpdate} style={{ marginRight: '10px' }}>
            Save Changes
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
            />
          )}
          <div>
            <button onClick={() => setIsEditing(true)} style={{ marginRight: '10px' }}>
              Edit Post
            </button>
            <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
              Delete Post
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PostDetail;
