import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import router from './router';

function App() {
  const outlet = useRoutes(router);

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        {outlet} {/* 如果未匹配到路由，使用 Navigate 進行重定向 */}
      </Suspense>
    </div>
  );
}

export default App;
