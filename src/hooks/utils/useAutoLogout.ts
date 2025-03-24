import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../actions/userActions";
import { RootState } from "../../store";
import { snackBarError } from "../../components/toast/Toast";

const INACTIVITY_LIMIT = 10 * 60 * 1000;

export const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoggedOut = useRef(false);

  const user = useSelector((state: RootState) => state.user);

  const logoutOnce = () => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    dispatch(setUser(null));
    localStorage.removeItem("user");
    snackBarError("You have been logged out due to inactivity.");
    navigate("/login");
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(logoutOnce, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    if (!user) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);
};
