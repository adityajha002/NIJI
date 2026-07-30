import React, { useEffect, useRef, useState } from "react";

const ImageUpload = ({ register }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const imageField = register("image");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        name={imageField.name}
        onBlur={imageField.onBlur}
        ref={(element) => {
          imageField.ref(element);
          inputRef.current = element;
        }}
        style={{ display: "none" }}
        onChange={(e) => {
          imageField.onChange(e);
          const file = e.target.files?.[0];
          if (file) {
            if (preview) {
              URL.revokeObjectURL(preview);
            }
            setPreview(URL.createObjectURL(file));
          }
        }}
      />

      <div
        onClick={() => inputRef.current?.click()}
        style={{
          width: "250px",
          height: "150px",
          border: "2px solid #aaa",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          marginTop: "20px",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span>Click to upload image</span>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
