import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import { supabase } from './supabase';

function App() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 300); // Debounce fetchPosts on `searchTerm` changes

    return () => clearTimeout(delayDebounceFn);
  }, [sortBy, searchTerm]);

  async function fetchPosts() {
    setIsLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order(sortBy, { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    } catch (err) {
      console.error('Error in fetchPosts:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <BrowserRouter>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Navigation */}
        <nav style={{ marginBottom: '20px' }}>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
            <li style={{ marginRight: '10px' }}>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create Post</Link>
            </li>
          </ul>
        </nav>
        <div>
          <h1>Medication Blog</h1>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <button onClick={fetchPosts}>Search</button>
        </div>

        {/* Sort Options */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setSortBy('created_at')}
            style={{ marginRight: '10px' }}
          >
            Sort by Date
          </button>
          <button onClick={() => setSortBy('upvotes')}>Sort by Upvotes</button>
        </div>

        {isLoading && <p>Loading posts...</p>}

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              <PostList
                posts={posts}
                setPosts={setPosts} // Pass setPosts for direct updates
                fetchPosts={fetchPosts} // Refresh data
              />
            }
          />
          <Route
            path="/create"
            element={<CreatePost onPostCreated={fetchPosts} />}
          />
          <Route
            path="/post/:id"
            element={
              <PostDetail
                fetchPosts={fetchPosts} // Ensure re-sync
                setPosts={setPosts} // Pass setPosts to remove post
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
