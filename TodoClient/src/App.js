import React, { useEffect, useState } from 'react';
import service from './services/toDoService.js';
import Layout from './components/Layout'
import { Routes, Route } from 'react-router-dom'; 
import AppRoutes from './AppRoutes'; 
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';


const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
    <div className="App">
      <CacheProvider value={cacheRtl}>
        <Layout>
          <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>
        </Layout>
        </CacheProvider>
    </div>
  );
}

export default App;