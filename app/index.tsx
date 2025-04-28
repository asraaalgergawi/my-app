import React, { useEffect, useState } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import axios from "axios";
import "./indexStyle.css";

interface Village {
  _id: string;
  name: string;
  description: string;
  image?: string;
}

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [villages, setVillages] = useState<Village[]>([]);
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8081";

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/villages`);
        setVillages(response.data);
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    };

    fetchVillages();
  }, [baseUrl]);

  const getImageUrl = (imageUrl?: string) => {
    return imageUrl || 'https://static-cdn.toi-media.com/www/uploads/2021/06/000_9BN43E.jpg';
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <div className="leftButtonContainer">
          <button className="button" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </div>

      <div className="container">
        <h1>Unrecognized Villages in the Negev</h1>
        <p className="intro-paragraph">
          Unrecognized villages in the Negev are home to about 70,000 Bedouins living in 35 villages that cover
          around 180,000 dunams (1.4% of Israel's land). Due to the lack of official recognition, these communities
          face severe shortages in basic infrastructure and services such as electricity, water, and sewage,
          relying instead on generators and water tanks. Government policies reflect systemic neglect, as Bedouins
          are not recognized as an indigenous population, which denies them rights under international law and
          deepens inequalities with the Jewish majority (Amara, 2013; Sciendo, 2021; Minority Rights Group, 2024).
        </p>

        <div className="village-grid">
          {villages.map((village) => (
            <div
              key={village._id}
              className="village-card"
              onClick={() => navigate(`/village/${village._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={getImageUrl(village.image)}
                alt={village.name}
                className="village-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://static-cdn.toi-media.com/www/uploads/2021/06/000_9BN43E.jpg";
                }}
              />
              <div className="village-info">
                <h2>{village.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <IndexPage />
  </BrowserRouter>
);

export default App;
