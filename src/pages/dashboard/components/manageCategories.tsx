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
} from "@mui/material";
import { getCategories, createCategory } from "../../../api";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>
        ניהול קטגוריות ומקטים
      </Typography>
      <TextField
        label="שם קטגוריה חדשה"
        value={newCategory}
        onChange={(e: any) => setNewCategory(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleCreateCategory}>
        צור קטגוריה
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>שם קטגוריה</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
