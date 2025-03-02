import { useEffect, useState } from "react";
import { getUser, logout } from "./api";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { User } from "./types";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser()
      .then(({ data }) => setUser(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Container>
      <Typography variant="h4">שלום {user?.name}</Typography>
      <Button variant="contained" color="error" onClick={handleLogout}>
        התנתק
      </Button>
    </Container>
  );
}
