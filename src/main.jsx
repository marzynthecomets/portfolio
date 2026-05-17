import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import HomepageDtp from "./HomepageDtp.jsx";
import NeboCaseStudy from "./NeboCaseStudy.jsx";
import NutritionSourceCaseStudy from "./NutritionSourceCaseStudy.jsx";
import CulturePassCaseStudy from "./CulturePassCaseStudy.jsx";

function readRoute() {
  const h = window.location.hash.replace(/^#\/?/, "");
  return h || "home";
}

function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route === "nebo") return <NeboCaseStudy />;
  if (route === "nutrition-source") return <NutritionSourceCaseStudy />;
  if (route === "culturepass") return <CulturePassCaseStudy />;
  return <HomepageDtp />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
