import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { GridCloseIcon } from "@mui/x-data-grid-pro";
import {
  useCreateDocument,
  useUploadDocument,
  useGenerateDocumentPartNumber,
} from "../../../../hooks/document/documentHooks.ts";
import { useGetUsers } from "../../../../hooks/user/userHooks.ts";
import { useGetAllTags } from "../../../../hooks/tag/tagHooks.ts";
import {
  GridMultipleAutocomplete,
  Option,
} from "../../../../components/gridItems/gridMultipleAutocomplete/GridMultipleAutocomplete.tsx";
import GridInput from "../../../../components/gridItems/gridInput/GridInput.tsx";
import GridButton from "../../../../components/gridItems/gridButton/GridButton.tsx";
import {
  snackBarError,
  snackBarSuccess,
} from "../../../../components/toast/Toast.tsx";
import { DocumentType } from "../../../../api/documentAPI/types.ts";
import { useParams } from "react-router-dom";

export type AddDocumentProps = {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  documentToEdit?: DocumentType;
};

export const AddDocument = ({
  open,
  onClose,
  refetch,
  documentToEdit,
}: AddDocumentProps) => {
  const storedUser = localStorage.getItem("user");

  const uploadDocumentMutation = useUploadDocument();

  const { id: categoryId } = useParams();
  const createDocument = useCreateDocument();

  const { data: tags } = useGetAllTags();
  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  const { data: users } = useGetUsers();

  const userOptions = users
    ? users.map((user: any) => ({ id: user.id, name: user.email }))
    : [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    docType: null as Option | null,
    documentPartNumber: "",
    name: "",
    classification: { id: 1, name: "Public" } as Option,
    revision: "01",
    createdBy: user?.name || "Unknown",
    dcoNumber: "Generated in approval process",
    uploadDate: new Date(),
    processOwner: null as Option | null,
    type: null as Option | null,
    categoryId: "",
  });

  const { data: generatedPartNumber } = useGenerateDocumentPartNumber(
    formData.docType?.id || null,
    formData.docType?.name || null
  );

  const tagOptions: Option[] = tags
    ? tags.map((tag) => ({ id: tag.id, name: tag.name }))
    : [];

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (generatedPartNumber) {
      setFormData((prev) => ({
        ...prev,
        documentPartNumber: generatedPartNumber,
      }));
    }
  }, [generatedPartNumber]);

  useEffect(() => {
    if (!documentToEdit) return;
    setFormData((prev) => ({
      ...prev,
      revision: String(Number(documentToEdit.revision) + 1).padStart(2, "0"),
      fileName: documentToEdit.fileName || "",
      isFinal: false,
      docType: documentToEdit.docType
        ? { id: documentToEdit.docType.id, name: documentToEdit.docType.name }
        : null,
      processOwner: documentToEdit.processOwner
        ? {
            id: documentToEdit.processOwner.id,
            name: documentToEdit.processOwner.name,
          }
        : null,
      type: documentToEdit.type ? { id: 1, name: documentToEdit.type } : null,
    }));
  }, [documentToEdit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      snackBarError("Invalid file format! Allowed: PDF, Word, Excel, Images.");
      return;
    }

    setFile(selectedFile);
    setFormData((prev) => ({ ...prev, fileName: selectedFile.name }));
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFormData((prev) => ({ ...prev, fileName: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.docType ||
      !formData.documentPartNumber ||
      !formData.name ||
      !formData.classification ||
      !file ||
      !formData.processOwner
    ) {
      snackBarError("All fields are required, including a file upload!");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append(
        "entityData",
        JSON.stringify({
          docTypeId: formData.docType.id,
          classification: formData.classification.name.toUpperCase(),
          processOwnerId: formData.processOwner.id,
          updatedBy: user?.email || null,
          revision: Number(formData.revision),
          name: formData.name,
          documentPartNumber: formData.documentPartNumber,
          status: "NEW",
          published: new Date(),
          isFinal: !documentToEdit,
          type: formData.type?.name.toUpperCase(),
          categoryId: Number(categoryId),
        })
      );

      await uploadDocumentMutation.mutateAsync(formDataToSend);
      snackBarSuccess("Document uploaded successfully!");
      refetch();
      onClose();

      setFormData({
        docType: null,
        documentPartNumber: "",
        name: "",
        classification: { id: 1, name: "Public" },
        revision: "01",
        createdBy: user?.name || "Unknown",
        dcoNumber: "Generated in approval process",
        uploadDate: new Date(),
        processOwner: null,
        type: null,
        categoryId: "",
      });

      setFile(null);
    } catch (error) {
      console.error("❌ Upload Error:", error);
      snackBarError("An error occurred while uploading the document.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ padding: 20, width: "50vw" }}>
          <Typography variant="h5" align="center" gutterBottom>
            {documentToEdit ? "Edit Document" : "Create New Document"}
          </Typography>
          <Grid item xs={12} md={12}>
            <GridInput
              label="Name"
              required
              onChange={(value) => handleInputChange("name", value)}
              value={formData.name ?? ""}
              fullWidth
              sx={{ minWidth: 250, typography: "h6" }}
            />
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <GridMultipleAutocomplete
                multiple={false}
                onChange={(value) => handleInputChange("docType", value)}
                value={formData.docType}
                fullWidth
                selectorData={{
                  label: "Document Type",
                  accessorId: "docType",
                  options: tagOptions || [],
                }}
                sx={{ minWidth: 250, typography: "h6" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <GridInput
                label="Document P.N"
                value={formData.documentPartNumber ?? ""}
                disabled
                fullWidth
                sx={{ minWidth: 250, typography: "h6" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <GridMultipleAutocomplete
                multiple={false}
                onChange={(value) => handleInputChange("classification", value)}
                value={formData.classification ?? ""}
                fullWidth
                selectorData={{
                  label: "Classification",
                  accessorId: "classification",
                  options: [
                    { id: 1, name: "Public" },
                    { id: 2, name: "Internal" },
                    { id: 3, name: "Confidential" },
                    { id: 4, name: "Secret" },
                  ],
                }}
                sx={{ minWidth: 250, typography: "h6" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <GridMultipleAutocomplete
                multiple={false}
                onChange={(value) => handleInputChange("processOwner", value)}
                value={formData.processOwner ?? null}
                fullWidth
                selectorData={{
                  label: "Process Owner",
                  accessorId: "processOwner",
                  options: userOptions,
                }}
                sx={{ minWidth: 250, typography: "h6" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <GridInput
                label="Revision"
                value={formData.revision ?? "01"}
                disabled
                fullWidth
                sx={{ minWidth: 250, typography: "h6" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <GridInput
                label="Created By"
                value={formData.createdBy ?? user?.name ?? ""}
                disabled
                fullWidth
                sx={{ minWidth: 250, typography: "h6" }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <GridMultipleAutocomplete
                multiple={false}
                onChange={(value) => handleInputChange("type", value)}
                value={formData.type ?? null}
                fullWidth
                selectorData={{
                  label: "File Type",
                  accessorId: "type",
                  options: [
                    { id: 1, name: "PDF" },
                    { id: 2, name: "DOCX" },
                    { id: 3, name: "XLSX" },
                    { id: 4, name: "PPTX" },
                    { id: 5, name: "PNG" },
                  ],
                }}
                sx={{ minWidth: 250, typography: "h6" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ width: "100%", fontSize: "1.1rem" }}
              />
              {file && (
                <Box display="flex" alignItems="center" mt={1}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {file.name}
                  </Typography>
                  <IconButton size="small" onClick={handleRemoveFile}>
                    <GridCloseIcon color="error" />
                  </IconButton>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <GridButton
                buttonText="Save"
                type="submit"
                variant="contained"
                fullWidth
                sx={{ fontSize: "1.2rem", padding: "12px" }}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};
