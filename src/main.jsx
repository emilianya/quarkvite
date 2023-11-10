import React from 'react'
import ReactDOM from 'react-dom/client'
import Quarklight from './components/Quarklight.jsx'
import {
    createBrowserRouter,
    createRoutesFromChildren, matchRoutes,
    RouterProvider,
    useLocation,
    useNavigationType
} from "react-router-dom";
import "./style/root.css";
import AssetRoot from "./components/asset/AssetRoot.jsx";
import Client from "./components/Client.jsx";
import Quark from "./components/quarks/Quark.jsx";
import Channel from "./components/channels/Channel.jsx";

import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://c0236bc34da6926f2dbe59f139a02e5e@sentry.yggdrasil.cat/2",
    integrations: [
        new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                React.useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes
            ),
            // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost", /^https:\/\/[a-zA-Z0-9-.]+\.[a-zA-Z0-9]+\/v2.*/],
        }),
        new Sentry.Replay(),
    ],
    environment: import.meta.env.QV_ENV || "development",
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
const sentryCreateBrowserRouter =
Sentry.wrapCreateBrowserRouter(createBrowserRouter);
const router = sentryCreateBrowserRouter([
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

