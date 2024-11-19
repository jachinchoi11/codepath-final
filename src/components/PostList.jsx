import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

function PostList({ posts, setPosts, fetchPosts }) {
  async function handleUpvote(postId, currentUpvotes) {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', postId);

      if (!error) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, upvotes: currentUpvotes + 1 } : post
          )
        );
        await fetchPosts();
      }
    } catch (err) {
      console.error('Error during upvote:', err);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '20px' }}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              width: '100%',
              maxWidth: '600px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              backgroundColor: '#1e1e1e',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <h2 style={{ marginBottom: '10px' }}>{post.title}</h2>
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  margin: '10px 0',
                }}
              />
            )}
            <p style={{ color: '#aaa', fontSize: '0.8em', marginBottom: '10px' }}>
              Created at: {post.created_at ? new Date(post.created_at).toLocaleString() : 'Unknown'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <div>
                <span>👍 {post.upvotes} Upvotes</span>
                <button
                  onClick={() => handleUpvote(post.id, post.upvotes)}
                  style={{
                    marginLeft: '10px',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    backgroundColor: '#444',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Upvote
                </button>
              </div>
              <Link to={`/post/${post.id}`}>
                <button
                  style={{
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: '#444',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  View Post
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: '#aaa', fontSize: '1.2em' }}>No posts available. Create a new post to get started!</p>
      )}
    </div>
  );
}

export default PostList;
