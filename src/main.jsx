import React from 'react'
import ReactDOM from 'react-dom/client'
import Quarklight from './components/Quarklight.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./style/root.css";
import AssetRoot from "./components/asset/AssetRoot.jsx";
import Client from "./components/Client.jsx";
import Quark from "./components/quarks/Quark.jsx";
import Channel from "./components/channels/Channel.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AssetRoot />,
        children: [
            {
                path: "/",
                element:  <Quarklight />,
                children: [
                    {
                        path: "/",
                        element: <Client />,
                        children: [
                            {
                                path: "/:quarkId",
                                element: <Quark />,
                                children: [
                                    {
                                        path: "/:quarkId/:channelId",
                                        element: <Channel />
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
)

