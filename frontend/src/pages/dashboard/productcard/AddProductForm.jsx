import React, { useState } from 'react';
import style from './productcard.module.css';
import { API_BASE_URL } from '../../../config/api.js';

export default function AddProductForm({ onCancel, onSuccess }) {
  const [form, setForm] = useState({ name: '', price: '', description: '', image: null });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';
      const result = contentType.includes('application/json')
        ? await res.json()
        : { error: await res.text() };

      if (!res.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onSuccess(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={style.formWrapper}>
      <form onSubmit={handleSubmit} className={style.form}>
        <h1>Add a Product</h1>
        <input className={style.input} name="name" placeholder="Product name" onChange={handleChange} required />
        <input className={style.input} name="price" type="number" placeholder="Price" onChange={handleChange} required />
        <textarea className={style.textarea} name="description" placeholder="Description" onChange={handleChange} />
        <input className={style.input} name="image" type="file" accept="image/*" onChange={handleChange} required />

        {error && <p className={style.error}>{error}</p>}

        <div className={style.actions}>
          <button className={style.button} type="button" onClick={onCancel} disabled={uploading}>
            Cancel
          </button>
          <button className={style.button} type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
