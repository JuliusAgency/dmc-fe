import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth-form";
import Dashboard from "./dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthForm
              type="login"
              onSuccess={() => (window.location.href = "/")}
            />
          }
        />
        <Route
          path="/register"
          element={
            <AuthForm
              type="register"
              onSuccess={() => (window.location.href = "/")}
            />
          }
        />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
