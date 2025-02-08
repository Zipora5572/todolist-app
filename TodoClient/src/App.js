import React, { useEffect, useState } from 'react';
import service from './services/toDoService.js';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom'; 
import AppRoutes from './AppRoutes'; 
import { CircularProgress } from '@mui/material';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <>
   
          <Layout>
          {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : (

        <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>)}
        </Layout>
      
    </>
  );
}

export default App;
