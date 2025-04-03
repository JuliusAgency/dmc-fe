import { Container, Typography, Box } from "@mui/material";
import {
  NO_IMAGE_AVAILABLE,
  ERROR_LOADING_HOMEPAGE,
  LOADING_TEXT,
} from "./constants";
import {
  useGetHomeImages,
  useGetHomeAnnouncements,
} from "../../hooks/home/homeHooks";
import { BulletinBoard } from "./components/BulletinBoard";
import { SearchBar } from "../../components/search/SearchBar";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const {
    data: homeImages,
    isLoading: loadingImages,
    error: errorImages,
  } = useGetHomeImages();

  const { isLoading: loadingAnnouncements, error: errorAnnouncements } =
    useGetHomeAnnouncements();

  const imageUrl = homeImages?.imageUrl || "";
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/documents?query=${encodeURIComponent(query)}`);
  };

  if (loadingImages || loadingAnnouncements) {
    return <Typography>{LOADING_TEXT}</Typography>;
  }

  if (errorImages || errorAnnouncements) {
    return <Typography color="error">{ERROR_LOADING_HOMEPAGE}</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Box display="flex" flexDirection="row-reverse" width="100%" p={2}>
        <Box
          sx={{
            width: 300,
            ml: 4,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <SearchBar onSearch={handleSearch} />
          <BulletinBoard />
        </Box>

        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {imageUrl ? (
            <video
              src={imageUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "16px",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography color="gray">{NO_IMAGE_AVAILABLE}</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};
