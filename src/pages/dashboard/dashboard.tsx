import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, logout } from "../../api";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import { setUser } from "../../actions/userActions";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      getUser()
        .then((response) => dispatch(setUser(response)))
        .catch(() => navigate("/login"));
    }

    console.log(user);
  }, [dispatch, navigate, user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return <div>טוען...</div>;
  }

  return (
    <Container>
      <Typography variant="h6">מייל: {user.email}</Typography>
      <Typography variant="h6">תפקיד: {user.role}</Typography>

      <Button variant="contained" color="error" onClick={handleLogout}>
        התנתק
      </Button>
    </Container>
  );
}
