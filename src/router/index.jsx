import React, { lazy, useEffect } from "react";
import Home from "../views/Home";
const NoFound = lazy(() => import("../views/404"));
import { Navigate, Outlet, useParams } from "react-router-dom";

const withLoadingComponent = (Comp) => (props) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <Comp {...props} />
  </React.Suspense>
);

//跳轉的function
const RedirectComponent = () => {
  const { shortUrlId } = useParams();

  useEffect(() => {
    window.location.assign(`https://tiny-server.zeabur.app/${shortUrlId}`); // 修改這裡
  }, [shortUrlId]);

  return null; // 可以返回null或其他元素作為占位符
};


const routes = [
  // 路由 開始-------------------
  {
    path: "/",
    element: <Navigate to="/home" />
  },

  {
    path: "/",
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/home",
        element: withLoadingComponent(<Home />)
      },
      {
        path: "/404",
        element: <NoFound />
      },
      {
        path: `/:shortUrlId`, // 使用動態參數
        element: <RedirectComponent />
      }
    ]
  },
  // //路由 結束-------------------
  // 假設User隨便輸入不是裡面的網址  返回404
  {
    path: "*",
    element: <Navigate to="/404" />
  }
];

export default routes;
