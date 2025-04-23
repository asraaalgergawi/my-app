import React, { useState } from "react";
import axios from "axios";
import "./addVillage.css";

const AddVillage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
        const response = await axios.post("http://localhost:8081/api/addVillage", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      setMessage("Village added successfully!");
      setName("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to add village.");
    }
  };

  return (
    <div className="add-village-container">
      <h2>Add New Village</h2>
      <form onSubmit={handleSubmit} className="add-village-form">
        <input
          type="text"
          placeholder="Village Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Village Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <button type="submit">Add Village</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddVillage;
