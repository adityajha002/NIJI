import React, { useEffect, useRef, useState } from "react";

const ImageUpload = ({ register, rules }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const imageField = register("image", rules);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "280px",
          maxWidth: "100%",
          height: "150px",
          border: "2px dashed rgba(255, 255, 255, 0.25)",
          borderRadius: "14px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          cursor: "pointer",
          overflow: "hidden",
          margin: "10px auto",
          transition: "all 0.3s ease",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: "500",
              textAlign: "center",
              padding: "0 10px",
              transition: "color 0.2s ease",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Click or drag image to upload</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
