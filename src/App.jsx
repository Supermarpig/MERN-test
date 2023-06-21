import { useRoutes } from 'react-router-dom';
import router from './router';

function App() {
  const outlet = useRoutes(router);

  return (
    <div className="App">
     {outlet || <NoFound />}{/* 添加此行，如果没有匹配到路由，顯示 404 组件 */}
    </div>
  );
}

export default App;
