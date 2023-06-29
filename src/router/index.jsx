import React, { lazy } from "react"
import Home from "../views/Home"
const NoFound = lazy(() => import("../views/404"))
// Navigate重定向組件
import { Navigate, Outlet } from "react-router-dom"

const withLoadingComponent = (comp) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    {comp}
  </React.Suspense>
);

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
        element: withLoadingComponent(<NoFound />)
      }, 
      // {
      //   path: `/${shortUrlId}`, // 使用動態參數
      //   element: <Navigate to={`http://localhost:3001/${shortUrlId}`} /> // 使用動態參數重新指定路徑
      // },
    ]
  },
  // //路由 結束-------------------
  // 假設User隨便輸入不是裡面的網址  返回404
  {
    path: "*",
    element: <Navigate to="/404" />
  }
]

export default routes
