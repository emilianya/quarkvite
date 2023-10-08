import React from 'react'
import ReactDOM from 'react-dom/client'
import Quarklight from './components/Quarklight.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./style/root.css";
import AssetRoot from "./components/asset/AssetRoot.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AssetRoot />,
        children: [
            {
                path: "/",
                element:  <Quarklight />
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
)

