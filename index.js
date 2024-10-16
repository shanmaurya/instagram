'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Bookmark, Send, Home, Search, PlusSquare, User, X, Share2, Link as LinkIcon, Facebook, Twitter, LogOut } from 'lucide-react'

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9)
const getCurrentTimestamp = () => new Date().toISOString()

// ShareModal component (unchanged)
const ShareModal = ({ isOpen, onClose, post }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-96 max-w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Share</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow bg-gray-100 rounded-full px-4 py-2 focus:outline-none"
            />
          </div>
          <div className="space-y-4">
            <button className="flex items-center space-x-3 w-full">
              <Send className="h-6 w-6" />
              <span>Share to Direct</span>
            </button>
            <button className="flex items-center space-x-3 w-full">
              <LinkIcon className="h-6 w-6" />
              <span>Copy Link</span>
            </button>
            <button className="flex items-center space-x-3 w-full">
              <Facebook className="h-6 w-6" />
              <span>Share to Facebook</span>
            </button>
            <button className="flex items-center space-x-3 w-full">
              <Twitter className="h-6 w-6" />
              <span>Share to Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// UploadModal component (unchanged)
const UploadModal = ({ isOpen, onClose, onUpload, isStory = false }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [caption, setCaption] = useState('')

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (selectedImage) {
      onUpload({
        id: generateId(),
        image: selectedImage,
        caption: caption,
        likes: 0,
        comments: [],
        timestamp: getCurrentTimestamp(),
        isStory: isStory
      })
      setSelectedImage(null)
      setCaption('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-96 max-w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create new {isStory ? 'story' : 'post'}</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        <div className="p-4">
          {!selectedImage ? (
            <div className="text-center">
              <PlusSquare className="h-24 w-24 mx-auto mb-4" />
              <p className="mb-4">Drag photos and videos here</p>
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                Select from computer
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
          ) : (
            <div>
              <Image src={selectedImage} alt="Selected" width={400} height={400} className="w-full h-64 object-cover mb-4" />
              {!isStory && (
                <textarea
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              )}
              <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleUpload}>
                Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// SearchModal component (unchanged)
const SearchModal = ({ isOpen, onClose, posts }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (searchTerm) {
      const results = posts.filter(post => 
        post.caption.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, posts])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            autoFocus
          />
          <button onClick={onClose} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 p-1">
            {searchResults.map(post => (
              <div key={post.id} className="aspect-square">
                <Image
                  src={post.image}
                  alt="Post thumbnail"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white text-center mt-10">
            {searchTerm ? 'No results found' : 'Start typing to search'}
          </div>
        )}
      </div>
    </div>
  )
}

// New AccountModal component
const AccountModal = ({ isOpen, onClose, user, onLogin, onLogout, onUpdateUsername }) => {
  const [username, setUsername] = useState(user?.displayName || '')

  if (!isOpen) return null

  const handleGoogleSignIn = () => {
    // In a real app, you would use the Google Identity Services library here
    // For this example, we'll simulate a successful login
    onLogin({
      id: 'google-user-id',
      email: 'user@example.com',
      displayName: 'Google User',
    })
  }

  const handleUsernameUpdate = () => {
    onUpdateUsername(username)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-96 max-w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Account</h2>
          <button onClick={onClose}><X className="h-6 w-6" /></button>
        </div>
        <div className="p-4">
          {user ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                onClick={handleUsernameUpdate}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update Username
              </button>
              <button
                onClick={onLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center justify-center"
            >
              <Image src="/google-logo.png" alt="Google" width={20} height={20} className="mr-2" />
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [stories, setStories] = useState([])
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadStoryModalOpen, setUploadStoryModalOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [activePost, setActivePost] = useState(null)
  const [user, setUser] = useState(null)

  // Load data from localStorage or Google Drive on component mount
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        // In a real app, you would fetch data from Google Drive here
        // For this example, we'll use localStorage
        const savedPosts = localStorage.getItem(`posts_${user.id}`)
        const savedStories = localStorage.getItem(`stories_${user.id}`)
        if (savedPosts) setPosts(JSON.parse(savedPosts))
        if (savedStories) setStories(JSON.parse(savedStories))
      } else {
        // If no user is logged in, use anonymous local storage
        const savedPosts = localStorage.getItem('posts')
        const savedStories = localStorage.getItem('stories')
        if (savedPosts) setPosts(JSON.parse(savedPosts))
        if (savedStories) setStories(JSON.parse(savedStories))
      }
    }

    loadData()
  }, [user])

  // Save data to localStorage or Google Drive whenever posts or stories change
  useEffect(() => {
    const saveData = async () => {
      if (user) {
        // In a real app, you would save data to Google Drive here
        // For this example, we'll use localStorage with user-specific keys
        localStorage.setItem(`posts_${user.id}`, JSON.stringify(posts))
        localStorage.setItem(`stories_${user.id}`, JSON.stringify(stories))
      } else {
        // If no user is logged in, use anonymous local storage
        localStorage.setItem('posts', JSON.stringify(posts))
        localStorage.setItem('stories', JSON.stringify(stories))
      }
    }

    saveData()
  }, [posts, stories, user])

  // Remove expired stories (older than 24 hours)
  useEffect(() => {
    const now = new Date().getTime()
    const updatedStories = stories.filter(story => {
      const storyTime = new Date(story.timestamp).getTime()
      return now - storyTime < 24 * 60 * 60 * 1000
    })
    if (updatedStories.length !== stories.length) {
      setStories(updatedStories)
    }
  }, [stories])

  const handleUpload = (newItem) => {
    if (newItem.isStory) {
      setStories(prevStories => [newItem, ...prevStories])
    } else {
      setPosts(prevPosts => [newItem, ...prevPosts])
    }
  }

  const handleLike = useCallback((postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1, isLiked: true } : post
      )
    )
  }, [])

  const handleUnlike = useCallback((postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes - 1, isLiked: false } : post
      )
    )
  }, [])

  const handleComment = useCallback((postId, comment) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, comments: [...post.comments, { id: generateId(), text: comment, username: user ? user.displayName : 'Anonymous', timestamp: getCurrentTimestamp() }] } : post
      )
    )
  }, [user])

  const openShareModal = (post) => {
    setActivePost(post)
    setShareModalOpen(true)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setAccountModalOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    setAccountModalOpen(false)
    // Clear user-specific data
    setPosts([])
    setStories([])
  }

  const handleUpdateUsername = (newUsername) => {
    setUser(prevUser => ({ ...prevUser, displayName: newUsername }))
  }

  // Sort posts by likes
  const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="font-bold text-xl">Instagram</Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                <Home className="h-6 w-6" />
              </Link>
              <Link href="/messages" className="text-gray-700 hover:text-gray-900">
                <Send className="h-6 w-6" />
              </Link>
              <button onClick={() => setUploadModalOpen(true)} className="text-gray-700 hover:text-gray-900">
                <PlusSquare className="h-6 w-6" />
              </button>
              <button onClick={() => setSearchModalOpen(true)} className="text-gray-700 hover:text-gray-900">
                <Search className="h-6 w-6" />
              </button>
              <button onClick={() => setAccountModalOpen(true)} className="text-gray-700 hover:text-gray-900">
                {user ? (
                  <Image
                    src={`https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                    alt={user.displayName}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stories */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-4">
              <div className="flex flex-col items-center space-y-1">
                <button
                  onClick={() => setUploadStoryModalOpen(true)}
                  className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <PlusSquare className="h-8 w-8" />
                </button>
                <span className="text-xs">Add Story</span>
              </div>
              {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center space-y-1">
                  <div className="w-16 h-16 rounded-full ring-2 ring-pink-500 p-1">
                    <Image
                      src={story.image}
                      alt="Story"
                      width={56}
                      height={56}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-xs">User</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-8">
            {sortedPosts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-300 rounded-md">
                {/* Post header */}
                <div className="flex items-center p-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                  <span className="font-semibold">User</span>
                </div>

                {/* Post image */}
                <div 
                  className="relative"
                  onDoubleClick={() => post.isLiked ? handleUnlike(post.id) : handleLike(post.id)}
                >
                  <Image
                    src={post.image}
                    alt="Post"
                    width={600}
                    height={600}
                    className="w-full"
                  />
                </div>

                {/* Post actions */}
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => post.isLiked ? handleUnlike(post.id) : handleLike(post.id)}
                      className="relative"
                    >
                      <Heart 
                        className={`h-6 w-6 transition-colors duration-300 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                      <span className={`absolute inset-0 ${post.isLiked ? 'animate-like' : ''}`}></span>
                    </button>
                    <button>
                      <MessageCircle className="h-6 w-6" />
                    </button>
                    <button onClick={() => openShareModal(post)}>
                      <Send className="h-6 w-6" />
                    </button>
                    <button className="ml-auto">
                      <Bookmark className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">{post.likes} likes</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">User</span> {post.caption}
                  </div>
                  <div className="mt-2 text-gray-500">
                    View all {post.comments.length} comments
                  </div>
                  {post.comments.slice(-2).map((comment) => (
                    <div key={comment.id} className="mt-1">
                      <span className="font-semibold">{comment.username}</span> {comment.text}
                    </div>
                  ))}
                  <div className="mt-2 text-gray-400 text-xs">
                    {new Date(post.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Add comment */}
                <div className="flex items-center border-t border-gray-300 px-4 py-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-grow bg-transparent focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim() !== '') {
                        handleComment(post.id, e.target.value.trim())
                        e.target.value = ''
                      }
                    }}
                  />
                  <button 
                    className="text-blue-500 font-semibold ml-2"
                    onClick={(e) => {
                      const input = e.target.previousSibling
                      if (input.value.trim() !== '') {
                        handleComment(post.id, input.value.trim())
                        input.value = ''
                      }
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer navigation (mobile) */}
      <footer className="sm:hidden sticky bottom-0 bg-white border-t border-gray-300">
        <nav className="flex justify-around items-center h-16">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            <Home className="h-6 w-6" />
          </Link>
          <button onClick={() => setSearchModalOpen(true)} className="text-gray-700 hover:text-gray-900">
            <Search className="h-6 w-6" />
          </button>
          <button onClick={() => setUploadModalOpen(true)} className="text-gray-700 hover:text-gray-900">
            <PlusSquare className="h-6 w-6" />
          </button>
          <Link href="/activity" className="text-gray-700 hover:text-gray-900">
            <Heart className="h-6 w-6" />
          </Link>
          <button onClick={() => setAccountModalOpen(true)} className="text-gray-700 hover:text-gray-900">
            {user ? (
              <Image
                src={`https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
                alt={user.displayName}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <User className="h-6 w-6" />
            )}
          </button>
        </nav>
      </footer>

      {/* Share Modal */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} post={activePost} />

      {/* Upload Post Modal */}
      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUpload} />

      {/* Upload Story Modal */}
      <UploadModal isOpen={uploadStoryModalOpen} onClose={() => setUploadStoryModalOpen(false)} onUpload={handleUpload} isStory={true} />

      {/* Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} posts={posts} />

      {/* Account Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpdateUsername={handleUpdateUsername}
      />

      {/* Styles for the like button animation */}
      <style jsx global>{`
        @keyframes likeAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-like {
          animation: likeAnimation 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}