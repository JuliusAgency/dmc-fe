import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface PartNumberFormData {
  definition: string;
  number: string;
}

interface FormattedNumberParts {
  prefix: string;
  middle: string;
  suffix: string;
}

export interface CreatePartNumberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PartNumberFormData) => void;
  isSubmitting: boolean;
}

export function CreatePartNumberModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: CreatePartNumberModalProps) {
  const [formData, setFormData] = useState<PartNumberFormData>({
    definition: "",
    number: "",
  });

  const [numberParts, setNumberParts] = useState<FormattedNumberParts>({
    prefix: "",
    middle: "x", // This is fixed as 'x'
    suffix: "",
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    setFormData({
      definition: "",
      number: "",
    });
    setNumberParts({
      prefix: "",
      middle: "x", // Always reset to 'x'
      suffix: "",
    });
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "prefix" || name === "suffix") {
      // Handle the number parts
      let newValue = value;
      
      // Validate input based on the part
      if (name === "prefix") {
        // Allow 3 alphanumeric characters for prefix (letters will be uppercase)
        newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
        setNumberParts(prev => ({ ...prev, prefix: newValue }));
      } else if (name === "suffix") {
        // Allow 2 alphanumeric characters for suffix (letters will be uppercase)
        newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 2);
        setNumberParts(prev => ({ ...prev, suffix: newValue }));
      }
      
      // Construct the full number
      const fullNumber = `${numberParts.prefix}-000${numberParts.middle}-${numberParts.suffix}`;
      setFormData(prev => ({ ...prev, number: fullNumber }));
    } else {
      // Handle other form fields normally
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Update the full number whenever number parts change
  useEffect(() => {
    if (numberParts.prefix || numberParts.middle !== "x" || numberParts.suffix) {
      const fullNumber = `${numberParts.prefix}-000${numberParts.middle}-${numberParts.suffix}`;
      setFormData(prev => ({ ...prev, number: fullNumber }));
    }
  }, [numberParts]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid =
    formData.definition.trim() !== "" && 
    numberParts.prefix.length === 3 && 
    numberParts.suffix.length === 2;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Part Number</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="definition"
            name="definition"
            label="Part Number Definition"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.definition}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Number Format: XXX-000x-XX (X can be letters or numbers)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              margin="dense"
              id="prefix"
              name="prefix"
              label="Prefix (XXX)"
              type="text"
              variant="outlined"
              value={numberParts.prefix}
              onChange={handleChange}
              inputProps={{ maxLength: 3 }}
              sx={{ width: '30%' }}
              placeholder="ABC/123"
            />
            <Typography variant="body1">-</Typography>
            <TextField
              disabled
              margin="dense"
              value="000"
              variant="outlined"
              sx={{ width: '20%' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              disabled
              margin="dense"
              value="x"
              variant="outlined"
              sx={{ width: '15%' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <Typography variant="body1">-</Typography>
            <TextField
              margin="dense"
              id="suffix"
              name="suffix"
              label="Suffix (XX)"
              type="text"
              variant="outlined"
              value={numberParts.suffix}
              onChange={handleChange}
              inputProps={{ maxLength: 2 }}
              sx={{ width: '25%' }}
              placeholder="ZZ/99"
            />
          </Box>
          <TextField
            margin="dense"
            id="fullNumber"
            label="Full Number"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.number || "XXX-000x-XX"}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid || isSubmitting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
