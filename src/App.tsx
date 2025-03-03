import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth-form";
import Dashboard from "./dashboard";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/login"
        element={<AuthForm type="login" onSuccess={handleSuccess} />}
      />
      <Route
        path="/register"
        element={<AuthForm type="register" onSuccess={handleSuccess} />}
      />
    </Routes>
  );
}
