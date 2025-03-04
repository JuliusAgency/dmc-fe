import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import {
  getCategories,
  createCategory,
  getTags,
  createTag,
} from "../../../api/adminAPI/admin";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await getTags();
      setTags(response);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory) {
      alert("נא להזין שם קטגוריה");
      return;
    }

    try {
      await createCategory(newCategory);
      fetchCategories();
      setNewCategory("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTag) {
      alert("נא להזין שם תגית");
      return;
    }

    try {
      await createTag(newTag);
      fetchTags();
      setNewTag("");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  return (
    <Container sx={{ direction: "rtl", textAlign: "left" }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "left", fontSize: "1rem" }}
      >
        ניהול קטגוריות ותגיות
      </Typography>

      <Grid container spacing={4} justifyContent="flex-end">
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: "#f9f9f9",
              textAlign: "left",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2, fontSize: "0.9rem" }}>
              קטגוריות
            </Typography>
            <TextField
              label="שם קטגוריה חדשה"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              sx={{ mb: 2, fontSize: "0.9rem" }}
            />
            <Button
              variant="contained"
              onClick={handleCreateCategory}
              fullWidth
            >
              צור קטגוריה
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "left", fontSize: "0.9rem" }}>
                    שם קטגוריה
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ textAlign: "left", fontSize: "0.9rem" }}>
                        {c.description}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={1} align="left">
                      אין קטגוריות זמינות
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              backgroundColor: "#f9f9f9",
              textAlign: "left",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2, fontSize: "0.9rem" }}>
              תגיות
            </Typography>
            <TextField
              label="שם תגית חדשה"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              fullWidth
              sx={{ mb: 2, fontSize: "0.9rem" }}
            />
            <Button variant="contained" onClick={handleCreateTag} fullWidth>
              צור תגית
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "left", fontSize: "0.9rem" }}>
                    שם תגית
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.length > 0 ? (
                  tags.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell sx={{ textAlign: "left", fontSize: "0.9rem" }}>
                        {t.description}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={1} align="left">
                      אין תגיות זמינות
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
