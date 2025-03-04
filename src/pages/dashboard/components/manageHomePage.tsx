import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Input,
  Box,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addHomeImage,
  getHomeImages,
  addHomeAnnouncement,
  getHomeAnnouncements,
  deleteHomeAnnouncement,
} from "../../../api/adminAPI/admin";

export default function ManageHomePage() {
  const [homeImage, setHomeImage] = useState<{ url: string | null }>({
    url: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [homeAnnouncements, setHomeAnnouncements] = useState<
    { id: number; text: string }[]
  >([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const images = await getHomeImages();
      const firstImage = images.length > 0 ? images[0] : null;
      setHomeImage({ url: firstImage?.url || null });

      const announcements = await getHomeAnnouncements();
      setHomeAnnouncements(announcements || []);
    } catch (error) {
      console.error("Error fetching home content:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      alert("נא לבחור תמונה");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", "תמונה ראשונה"); // שם קבוע לתמונה
      formData.append("image", selectedFile);

      await addHomeImage(formData);
      alert("תמונה ראשונה הועלתה בהצלחה!");
      setSelectedFile(null);
      fetchHomeContent();
    } catch (error) {
      console.error("Error uploading home image:", error);
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement) {
      alert("נא להזין תוכן להודעה רצה.");
      return;
    }
    try {
      await addHomeAnnouncement({ text: newAnnouncement });
      alert("הודעה רצה נוספה בהצלחה!");
      setNewAnnouncement("");
      fetchHomeContent();
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await deleteHomeAnnouncement(id);
      fetchHomeContent();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <Container sx={{ textAlign: "right" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        ניהול דף הבית
      </Typography>

      {/* === ניהול תמונת דף הבית === */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        תמונת דף הבית
      </Typography>

      {homeImage.url && (
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="h6">תמונה ראשונה</Typography>
          <img
            src={homeImage.url}
            alt="תמונה ראשונה"
            style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
          />
        </Box>
      )}

      <Typography variant="h6">העלאת תמונה ראשונה</Typography>
      <Input
        type="file"
        inputProps={{ accept: "image/*" }}
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleUploadImage} sx={{ mb: 2 }}>
        העלה תמונה ראשונה
      </Button>

      {/* === ניהול הודעות רצות === */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        הודעות רצות
      </Typography>

      <TextField
        label="הודעה רצה"
        value={newAnnouncement}
        onChange={(e) => setNewAnnouncement(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleAddAnnouncement}
        sx={{ mb: 2 }}
      >
        הוסף הודעה רצה
      </Button>

      {/* הצגת ההודעות הקיימות */}
      {homeAnnouncements.length > 0 && (
        <Box>
          <Typography variant="h6">הודעות קיימות</Typography>
          <List>
            {homeAnnouncements.map((ann) => (
              <ListItem
                key={ann.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "5px",
                  mb: 1,
                }}
              >
                <Typography>{ann.text}</Typography>
                <IconButton onClick={() => handleDeleteAnnouncement(ann.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
}
