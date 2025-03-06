import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import {
  HOME_PAGE_TITLE,
  NO_IMAGE_AVAILABLE,
  ERROR_LOADING_HOMEPAGE,
  LOADING_TEXT,
  ANNOUNCEMENT_POSITION_STYLES,
  IMAGE_STYLES,
} from "./constants";
import {
  useGetHomeImages,
  useGetHomeAnnouncements,
} from "../../hooks/home/homeHooks";

export const HomePage = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  const {
    data: homeImages,
    isLoading: loadingImages,
    error: errorImages,
  } = useGetHomeImages();
  const {
    data: homeAnnouncements,
    isLoading: loadingAnnouncements,
    error: errorAnnouncements,
  } = useGetHomeAnnouncements();

  const homeContent = {
    imageUrl: homeImages?.imageUrl || "",
    announcements: homeAnnouncements?.map((item) => item.text) || [],
  };

  useEffect(() => {
    if (homeContent.announcements.length > 0) {
      const interval = setInterval(() => {
        setCurrentAnnouncement(
          (prev) => (prev + 1) % homeContent.announcements.length
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [homeContent.announcements]);

  if (loadingImages || loadingAnnouncements) {
    return <Typography>{LOADING_TEXT}</Typography>;
  }

  if (errorImages || errorAnnouncements) {
    return <Typography color="error">{ERROR_LOADING_HOMEPAGE}</Typography>;
  }

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
        {homeContent?.imageUrl ? (
          <Box
            component="img"
            src={homeContent.imageUrl}
            alt="Homepage Image"
            sx={IMAGE_STYLES}
          />
        ) : (
          <Typography color="gray">{NO_IMAGE_AVAILABLE}</Typography>
        )}

        {homeContent.announcements.length > 0 && (
          <Typography variant="h6" sx={ANNOUNCEMENT_POSITION_STYLES}>
            {homeContent.announcements[currentAnnouncement]}
          </Typography>
        )}
      </Box>
    </Container>
  );
};
