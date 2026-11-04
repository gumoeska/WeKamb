import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import WekambApp from "@wekamb/app-core/application/WekambApp";
import "@wekamb/app-core/styles/index.css";
import { createBrowserBridge } from "./platform/browser-bridge";

const root = document.getElementById("root");

if (!root) {
    throw new Error("Application root was not found");
}

const bridge = createBrowserBridge();

createRoot(root).render(
    <StrictMode>
        <WekambApp bridge={bridge} />
        <Analytics />
    </StrictMode>,
);
