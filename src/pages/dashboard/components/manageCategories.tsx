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
    <Container sx={{ direction: "rtl", textAlign: "right" }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        ניהול קטגוריות ותגיות
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, direction: "rtl" }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "right" }}>
              קטגוריות
            </Typography>
            <TextField
              label="שם קטגוריה חדשה"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              fullWidth
              sx={{ mb: 2, textAlign: "right", direction: "rtl" }}
              InputProps={{ sx: { textAlign: "right" } }}
            />
            <Button
              variant="contained"
              onClick={handleCreateCategory}
              fullWidth
              sx={{ direction: "rtl" }}
            >
              צור קטגוריה
            </Button>
            <Table sx={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "right" }}>שם קטגוריה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell sx={{ textAlign: "right" }}>
                        {c.description}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={1} align="right">
                      אין קטגוריות זמינות
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, direction: "rtl" }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "right" }}>
              תגיות
            </Typography>
            <TextField
              label="שם תגית חדשה"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              fullWidth
              sx={{ mb: 2, textAlign: "right", direction: "rtl" }}
              InputProps={{ sx: { textAlign: "right" } }}
            />
            <Button
              variant="contained"
              onClick={handleCreateTag}
              fullWidth
              sx={{ direction: "rtl" }}
            >
              צור תגית
            </Button>
            <Table sx={{ direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "right" }}>שם תגית</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(tags) && tags.length > 0 ? (
                  tags.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell sx={{ textAlign: "right" }}>
                        {t.description}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={1} align="right">
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
