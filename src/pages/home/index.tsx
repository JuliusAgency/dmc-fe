import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { HOME_PAGE_TITLE } from "./constants";
import { getHomeImages, getHomeAnnouncements } from "../../api/homeAPI/home"; // API

export const HomePage = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [homeContent, setHomeContent] = useState<any>({
    imageUrl: "",
    announcements: [],
  });

  useEffect(() => {
    fetchHomeContent();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement(
        (prev) => (prev + 1) % homeContent.announcements.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [homeContent.announcements]);

  const fetchHomeContent = async () => {
    try {
      const imageData = await getHomeImages();
      const announcementsData = await getHomeAnnouncements();

      setHomeContent({
        imageUrl: imageData.imageUrl || "",
        announcements: announcementsData.map((item: any) => item.text) || [],
      });
    } catch (error) {
      console.error("Error fetching home content:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 3, mb: 2 }}>
        {HOME_PAGE_TITLE}
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {homeContent.imageUrl && (
          <Box
            component="img"
            src={homeContent.imageUrl}
            alt="תמונת דף הבית"
            sx={{ width: "80%", borderRadius: 2, boxShadow: 2 }}
          />
        )}

        {homeContent.announcements.length > 0 && (
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 1,
              fontWeight: "bold",
            }}
          >
            {homeContent.announcements[currentAnnouncement]}
          </Typography>
        )}
      </Box>
    </Container>
  );
};
