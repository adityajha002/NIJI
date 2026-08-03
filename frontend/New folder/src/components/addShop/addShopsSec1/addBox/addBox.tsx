import React, { useState } from 'react';
import style from './addBox.module.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './addImg';
import { getCurrentLocation } from '../../../../services/locationService';
import useAuth from '../../../../context/useAuth';
import { API_BASE_URL } from '../../../../config/api';

interface ShopFormData {
  image: FileList;
  name: string;
  category: string;
  tags: string;
  address: string;
  pincode: string;
}

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

const AddBox: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormData>();

  const { token, updateUserRole } = useAuth();
  const navigate = useNavigate();

  const [coords, setCoords] = useState<Coordinates>({
    latitude: null,
    longitude: null,
  });

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageResetKey, setImageResetKey] = useState(0);

  const handleGetLocation = async (): Promise<void> => {
    setLocating(true);
    setLocationError('');

    try {
      const location = await getCurrentLocation();
      const { latitude, longitude } = location;

      setCoords({ latitude, longitude });
    } catch (err) {
      setCoords({ latitude: null, longitude: null });

      const message =
        err instanceof Error
          ? err.message
          : 'Could not get your location.';

      setLocationError(
        message === 'Geolocation is not supported'
          ? "Your browser doesn't support location access."
          : 'Could not get your location. Please allow location access and try again.'
      );
    } finally {
      setLocating(false);
    }
  };

  const onSubmit = async (data: ShopFormData): Promise<void> => {
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      if (!token) {
        throw new Error('Please log in before adding a shop');
      }

      const image = data.image?.[0];

      if (!image) {
        throw new Error('Please select an image before submitting');
      }

      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('tags', data.tags);
      formData.append('location', data.address);
      formData.append('description', data.address);
      formData.append('pincode', data.pincode);

      if (coords.latitude !== null && coords.longitude !== null) {
        formData.append('latitude', coords.latitude.toString());
        formData.append('longitude', coords.longitude.toString());
      }

      formData.append('image', image);

      const res = await fetch(`${API_BASE_URL}/api/shops/addShop`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';

      const result =
        contentType.includes('application/json')
          ? await res.json().catch(() => ({}))
          : {};

      if (!res.ok) {
        throw new Error(
          (result as { error?: string }).error ||
            `Failed to save shop (${res.status})`
        );
      }

      reset();

      setCoords({
        latitude: null,
        longitude: null,
      });

      setImageResetKey((key) => key + 1);

      setSubmitSuccess(true);

      updateUserRole('shop');

      navigate('/', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';

      setSubmitError(message);
    }
  };

  return (
    <div className={style.box}>
      <h2 className={style.title}>Add New Shop</h2>

      <div className={style.gridbox}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={style.imagesec}>
            <ImageUpload
              key={imageResetKey}
              register={register}
              rules={{ required: 'Please select an image' }}
            />

            {errors.image && (
              <p className={style.fieldError}>
                {errors.image.message}
              </p>
            )}
          </div>

          <input
            type="text"
            placeholder="NAME"
            className={style.inputname}
            {...register('name', {
              required: 'Shop name is required',
            })}
          />

          {errors.name && (
            <p className={style.fieldError}>
              {errors.name.message}
            </p>
          )}

          <select
            {...register('category', {
              required: 'Please select a category',
            })}
            defaultValue=""
            className={style.inputcat}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Grocery">Grocery</option>
            <option value="Dairy & Bakery">Dairy & Bakery</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Medical">Medical</option>
            <option value="Stationery">Stationery</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Hardware">Hardware</option>
          </select>

          {errors.category && (
            <p className={style.fieldError}>
              {errors.category.message}
            </p>
          )}

          <input
            type="text"
            placeholder="TAGS"
            className={style.inputtags}
            {...register('tags')}
          />

          <button
            type="button"
            className={style.inputloc}
            onClick={handleGetLocation}
            disabled={locating}
          >
            {locating
              ? 'LOCATING…'
              : coords.latitude
              ? 'LOCATION CAPTURED ✓'
              : 'GET LOCATION'}
          </button>

          {locationError && (
            <p className={style.fieldError}>
              {locationError}
            </p>
          )}

          <textarea
            placeholder="ADDRESS"
            className={style.inputdesc}
            {...register('address', {
              required: 'Address is required',
            })}
          />

          {errors.address && (
            <p className={style.fieldError}>
              {errors.address.message}
            </p>
          )}

          <input
            type="text"
            placeholder="PINCODE"
            className={style.pincode}
            {...register('pincode', {
              required: 'Pincode is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'Enter a valid 6-digit pincode',
              },
            })}
          />

          {errors.pincode && (
            <p className={style.fieldError}>
              {errors.pincode.message}
            </p>
          )}

          {submitError && (
            <p className={style.formError}>
              {submitError}
            </p>
          )}

          {submitSuccess && (
            <p className={style.formSuccess}>
              Shop created successfully!
            </p>
          )}

          <button
            className={style.addbtn}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SAVING…' : 'DONE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBox;