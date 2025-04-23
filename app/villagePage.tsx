import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Define the type for the village object
interface Village {
  name: string;
  description: string;
  images: string[];
}

const VillagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [village, setVillage] = useState<Village | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVillage = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/villages/${id}`);
        const data = await response.json();
        setVillage(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching village:', error);
        setLoading(false);
      }
    };
    fetchVillage();
  }, [id]);

  const styles = {
    container: {
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      backgroundColor: '#a97435',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      textAlign: 'center' as const,
    },
    backButton: {
      backgroundColor: 'white',
      color: '#a97435',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      marginBottom: '20px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    content: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    description: {
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    gallery: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover' as const,
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (!village) return <div style={styles.container}>Village not found</div>;

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div style={styles.header}>
        <h1>{village.name}</h1>
      </div>
      <div style={styles.content}>
        <p style={styles.description}>{village.description}</p>
        <div style={styles.gallery}>
          {village.images.map((image, index) => (
            <img key={index} src={image} alt={`Village image ${index}`} style={styles.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VillagePage;
