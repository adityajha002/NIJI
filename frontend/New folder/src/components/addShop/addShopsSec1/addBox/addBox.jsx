import React from 'react'
import style from './addBox.module.css'
import { useForm } from 'react-hook-form'
import ImageUpload from './addImg.jsx'
import { getCurrentLocation } from '../../../../services/locationService.js'
import useAuth from '../../../../context/useAuth.js'

const AddBox = () => {
  const { register, handleSubmit } = useForm();
  const { token } = useAuth();
  const [coords, setCoords] = React.useState({ latitude: null, longitude: null });

  const onSubmit = async (data) => {
    try {
      if (!token) {
        throw new Error("Please log in before adding a shop");
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("tags", data.tags);
      formData.append("location", data.location);
      formData.append("description", data.address);
      formData.append("pincode", data.pincode);

      if (coords.longitude !== null && coords.latitude !== null) {
        formData.append("longitude", coords.longitude);
        formData.append("latitude", coords.latitude);
      }

      const image = data.image?.[0];
      if (!image) {
        throw new Error("Please select an image before submitting");
      }

      formData.append("image", image);

      const res = await fetch("/api/shops", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "Failed to save shop");
      }

      console.log("Saved:", result);

    } catch (err) {
      console.error("Error:", err);
    }
  };
  return (
    <div className={style.box}>
      <div className={style.gridbox}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.imagesec}>
            <ImageUpload register={register}/>
          </div>
          
          <input type="text" placeholder="NAME" className={style.inputname} {...register('name')} />
          <select {...register("category")} defaultValue="" className={style.inputcat}>
            <option value="" disabled>Select Category</option>
            <option value="Grocery">Grocery</option>
            <option value="Dairy & Bakery">Dairy & Bakery</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Medical">Medical</option>
            <option value="Stationery">Stationery</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Hardware">Hardware</option>
          </select>
          <input type="text" placeholder="TAGS" className={style.inputtags} {...register('tags')} />
          <button type="button" placeholder="LOCATION" className={style.inputloc} onClick={async () => {
            const location = await getCurrentLocation();
            const { latitude, longitude } = location;
            setCoords({ latitude, longitude });
          }}>
            GET LOCATION
          </button>
          <textarea placeholder="ADDRESS" className={style.inputdesc} {...register('address')} />
          <input type="text" placeholder="PINCODE" className={style.pincode} {...register('pincode')} />
          <button className={style.addbtn}>DONE</button>
        </form>
      </div>
    </div>
  )
}

export default AddBox
