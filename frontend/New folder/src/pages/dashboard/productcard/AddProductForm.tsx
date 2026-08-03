import React, { useState } from 'react';
import style from './productcard.module.css';
import { API_BASE_URL } from '../../../config/api';

// --- Interfaces ---

export interface AddProductFormProps {
  onCancel: () => void;
  onSuccess: (result: unknown) => void;
}

interface ProductFormState {
  name: string;
  price: string;
  description: string;
  image: File | null;
}

// --- Component Definition ---

export default function AddProductForm({
  onCancel,
  onSuccess,
}: AddProductFormProps): React.JSX.Element {
  const [form, setForm] = useState<ProductFormState>({
    name: '',
    price: '',
    description: '',
    image: null,
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    
    // Check if the target is an HTMLInputElement with files (file input)
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      setForm((prev) => ({
        ...prev,
        [name]: files && files.length > 0 ? files[0] : null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      
      if (form.name) formData.append('name', form.name);
      if (form.price) formData.append('price', form.price);
      if (form.description) formData.append('description', form.description);
      if (form.image) formData.append('image', form.image);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={style.formWrapper}>
      <form onSubmit={handleSubmit} className={style.form}>
        <h1>Add a Product</h1>
        <input
          className={style.input}
          name="name"
          placeholder="Product name"
          onChange={handleChange}
          required
        />
        <input
          className={style.input}
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
        />
        <textarea
          className={style.textarea}
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input
          className={style.input}
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />

        {error && <p className={style.error}>{error}</p>}

        <div className={style.actions}>
          <button
            className={style.button}
            type="button"
            onClick={onCancel}
            disabled={uploading}
          >
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