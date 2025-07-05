import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function TestLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up:", user);
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup error:", err.code, err.message);
      alert(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", user);
      alert("Login successful!");
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      alert(err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Test Auth</h2>
      <input
        type="email"
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-4">
        <button onClick={handleSignup} className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
        <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded">Log In</button>
      </div>
    </div>
  );
}
