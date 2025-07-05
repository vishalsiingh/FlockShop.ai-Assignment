import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [wishlists, setWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔁 Redirect only AFTER auth check
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // 📦 Fetch wishlists where user is a participant
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'wishlists'),
      where('participants', 'array-contains', user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlists(data);
    });

    return () => unsubscribe();
  }, [user]);

  // ➕ Handle wishlist creation
  const handleCreate = async () => {
    if (!newWishlistName.trim()) {
      alert('Please enter a wishlist name');
      return;
    }

    try {
      await addDoc(collection(db, 'wishlists'), {
        name: newWishlistName,
        owner: user.email,
        participants: [user.email],
        invited: [],
        createdAt: serverTimestamp(),
      });

      setNewWishlistName('');
    } catch (err) {
      alert('Error creating wishlist: ' + err.message);
    }
  };

  // 🚪 Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // ⏳ While checking auth
  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">📝 Your Wishlists</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        </div>

        {/* Logged-in user */}
        {user && (
          <div className="text-sm text-gray-600 mb-6">
            👋 Logged in as <span className="font-semibold">{user.email}</span>
          </div>
        )}

        {/* Create Wishlist */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            placeholder="Enter wishlist name"
          />
          <button
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            ➕ Create
          </button>
        </div>

        {/* Wishlist List */}
        {wishlists.length === 0 ? (
          <p className="text-center text-gray-500">No wishlists yet. Start by creating one!</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {wishlists.map((w) => (
              <li
                key={w.id}
                onClick={() => navigate(`/wishlist/${w.id}`)}
                className="cursor-pointer border rounded-lg p-4 bg-gray-100 hover:bg-blue-50 hover:shadow transition"
              >
                <h3 className="text-lg font-semibold text-blue-800">{w.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Owner: {w.owner}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
