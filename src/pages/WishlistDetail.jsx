import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export default function WishlistDetail() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', image: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistInfo, setWishlistInfo] = useState(null);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: '', image: '', price: '' });

  const productsRef = collection(db, 'wishlists', id, 'products');

  // Fetch products
  useEffect(() => {
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    });
    return unsubscribe;
  }, [id]);

  // Fetch wishlist info
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'wishlists', id), (docSnap) => {
      if (docSnap.exists()) {
        setWishlistInfo(docSnap.data());
      }
    });
    return () => unsub();
  }, [id]);

  const handleAddProduct = async () => {
    if (!newItem.name.trim() || !newItem.price.trim()) return;
    await addDoc(productsRef, {
      ...newItem,
      price: parseFloat(newItem.price),
      addedBy: auth.currentUser?.email || 'anonymous',
      createdAt: serverTimestamp(),
    });
    setNewItem({ name: '', image: '', price: '' });
  };

  const handleDelete = async (productId) => {
    await deleteDoc(doc(db, 'wishlists', id, 'products', productId));
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setEditedProduct({
      name: product.name,
      image: product.image,
      price: product.price,
    });
  };

  const saveEdit = async () => {
    const productRef = doc(db, 'wishlists', id, 'products', editingProductId);
    await updateDoc(productRef, {
      name: editedProduct.name,
      image: editedProduct.image,
      price: parseFloat(editedProduct.price),
      editedAt: serverTimestamp(),
    });
    setEditingProductId(null);
  };

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || '';
    const addedBy = product.addedBy?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || addedBy.includes(term);
  });

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Wishlist Items</h2>

      {wishlistInfo && (
        <div className="text-sm text-gray-700 mb-6 space-y-1">
          <p>👤 <strong>Owner:</strong> {wishlistInfo.owner}</p>
          <p>👥 <strong>Collaborators:</strong>{' '}
            {wishlistInfo.invited?.length > 0 ? wishlistInfo.invited.join(', ') : 'No one invited yet'}
          </p>
        </div>
      )}

      {/* Add Product Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Product Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Image URL"
          value={newItem.image}
          onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Price"
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
      </div>

      <button
        onClick={handleAddProduct}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700 transition"
      >
        Add Product
      </button>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="🔍 Search products by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No matching products found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="border p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-1 w-full">
                {editingProductId === product.id ? (
                  <div className="space-y-2">
                    <input
                      className="border p-1 w-full rounded"
                      value={editedProduct.name}
                      onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                      placeholder="Name"
                    />
                    <input
                      className="border p-1 w-full rounded"
                      value={editedProduct.image}
                      onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
                      placeholder="Image URL"
                    />
                    <input
                      className="border p-1 w-full rounded"
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                      placeholder="Price"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProductId(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-lg">{product.name}</p>
                    <p>₹ {product.price}</p>
                    <p className="text-sm text-gray-500">Added by: {product.addedBy}</p>
                    <button
                      onClick={() => startEditing(product)}
                      className="text-blue-600 hover:underline mt-2"
                    >
                      ✏️ Edit
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100';
                    }}
                  />
                )}
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
