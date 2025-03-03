import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom"; // ייבוא של Router
import store from "./store";
import "./index.css";
import App from "./App.tsx";

// רנדר את האפליקציה בתוך ה-Provider וה-Router
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        {" "}
        {/* הוספת ה-Router סביב ה-App */}
        <App />
      </Router>
    </Provider>
  </StrictMode>
);
