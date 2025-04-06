// AdminMapPage.tsx
import React, { useState, useEffect } from 'react';
import './AdminMapPage.css'; // Import the CSS file

interface MapData {
  images: string[];
  abstracts: string[];
  roads: string[];
  buildings: string[];
}

interface UpdateRequest {
  id: string;
  user: string;
  type: 'image' | 'abstract' | 'road' | 'building';
  data: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminMapPage: React.FC = () => {
  const [mapData, setMapData] = useState<MapData>({
    images: [],
    abstracts: [],
    roads: [],
    buildings: [],
  });
  const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>([]);

  useEffect(() => {
    // Fetch initial map data and update requests from your backend API
    fetch('/api/map')
      .then(res => res.json())
      .then(data => setMapData(data));

    fetch('/api/update-requests')
      .then(res => res.json())
      .then(data => setUpdateRequests(data));
  }, []);

  const handleUpdateRequest = (id: string, status: 'approved' | 'rejected') => {
    fetch(`/api/update-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    .then(res => res.json())
    .then(updatedRequest => {
        setUpdateRequests(prevRequests => 
            prevRequests.map(req => req.id === id ? updatedRequest : req)
        );
    });
  };

  const handleMapUpdate = (type: keyof MapData, newData: string) => {
    fetch('/api/map', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [type]: [...mapData[type], newData] }),
    })
    .then(res => res.json())
    .then(updatedMapData => setMapData(updatedMapData));
  };

  return (
    <div className="admin-map-page">
      <h1>Admin Map Control</h1>

      <div className="map-data-controls">
        {Object.keys(mapData).map((key) => (
          <div key={key} className="data-control">
            <h2>{key.charAt(0).toUpperCase() + key.slice(1)}</h2> {/* Capitalize key */}
            <input type="text" placeholder={`Add new ${key}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleMapUpdate(key as keyof MapData, e.currentTarget.value)
                        e.currentTarget.value = '';
                    }
                }}
            />
            <ul>
              {mapData[key as keyof MapData].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="update-requests">
        <h2>Update Requests</h2>
        <ul>
          {updateRequests.map((request) => (
            <li key={request.id}>
              {request.user} requests to add a {request.type}: {request.data}
              <button onClick={() => handleUpdateRequest(request.id, 'approved')}>Approve</button>
              <button onClick={() => handleUpdateRequest(request.id, 'rejected')}>Reject</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminMapPage;