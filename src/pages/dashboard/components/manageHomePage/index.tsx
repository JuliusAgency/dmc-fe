import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Input,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GenericTable } from "../../../../components/genericTable/genericTable";
import { GridColDef } from "@mui/x-data-grid";
import {
  useUploadHomeImage,
  useGetHomeAnnouncements,
  useAddHomeAnnouncement,
  useDeleteHomeAnnouncement,
} from "../../../../hooks/home/homeHooks";
import {
  HOME_PAGE_TITLE,
  RUNNING_ANNOUNCEMENTS_TITLE,
  NEW_ANNOUNCEMENT_LABEL,
  ADD_ANNOUNCEMENT_BUTTON,
  HOMEPAGE_IMAGE_TITLE,
  UPLOAD_HOMEPAGE_IMAGE_BUTTON,
} from "./constants";

export default function ManageHomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  const { data: homeAnnouncements = [] } = useGetHomeAnnouncements();
  const uploadImageMutation = useUploadHomeImage();
  const addAnnouncementMutation = useAddHomeAnnouncement();
  const deleteAnnouncementMutation = useDeleteHomeAnnouncement();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement) {
      addAnnouncementMutation.mutate(newAnnouncement, {
        onSuccess: () => setNewAnnouncement(""),
      });
    }
  };

  const handleUploadImage = () => {
    if (selectedFile) {
      uploadImageMutation.mutate(selectedFile);
    }
  };

  const announcementColumns: GridColDef[] = [
    { field: "text", headerName: "Announcement", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params) => (
        <IconButton
          onClick={() => deleteAnnouncementMutation.mutate(params.row.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
        {HOME_PAGE_TITLE}
      </Typography>

      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem", mb: 1 }}>
            {RUNNING_ANNOUNCEMENTS_TITLE}
          </Typography>
          <TextField
            label={NEW_ANNOUNCEMENT_LABEL}
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleAddAnnouncement}
            sx={{ mb: 2, textTransform: "none" }}
          >
            {ADD_ANNOUNCEMENT_BUTTON}
          </Button>

          <GenericTable
            loading={false}
            columns={announcementColumns}
            rows={homeAnnouncements}
            rowCount={homeAnnouncements.length}
            pageSize={10}
            hideFooterPagination={true}
            onPaginationModelChange={() => {}}
            sx={{ height: "auto", mt: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem", mb: 1 }}>
            {HOMEPAGE_IMAGE_TITLE}
          </Typography>
          <Input
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleFileChange}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleUploadImage}
            sx={{ mb: 2, textTransform: "none" }}
          >
            {UPLOAD_HOMEPAGE_IMAGE_BUTTON}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
