import React from 'react'
import ReactDOM from 'react-dom/client'
import Quarklight from './components/Quarklight.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AssetLoader from "./components/AssetLoader.jsx";
import "./style/root.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AssetLoader />,
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

