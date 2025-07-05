# 📝 Shared Wishlist App

A collaborative wishlist web application where users can create wishlists, add products, invite others (mocked), and track who added what. Built with Firebase and React.

---

## 🔧 Tech Stack

- **Frontend:** React + Tailwind CSS + React Router
- **Backend:** Firebase Firestore + Firebase Auth
- **Database:** Firebase Firestore (NoSQL)
- **Auth:** Firebase Authentication (Email/Password)
- **Realtime Sync:** Firestore Realtime Listeners

---

## 🚀 Setup Instructions

### 1. Clone the Repo
    
    git clone https://github.com/your-username/shared-wishlist-app.git
    cd shared-wishlist-app
### 2. Install Dependencies

    
     npm install

### 3. Set Up Firebase

Create a file at `lib/firebase.js` and add your Firebase config:

     ```js
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";
  
     const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-app.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    // ...other keys
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);

### 3. Set Up Firebase
      npm run dev/ npm start
---

### 📸 Screenshots

#### 🖥️ Home Page
![Home Page Screenshot](./Screenshots/login.png)

#### 📋 SignUp View
![Wishlist Screenshot](./Screenshots/Signup.png)

#### 🔧 Add Wishlist Modal
![Add Product Screenshot](./Screenshots/Wishlist.png)
#### 🔧 Add Wishlist Modal Products
![Add Product Screenshot](./Screenshots/wishlistproduct.png)

            
