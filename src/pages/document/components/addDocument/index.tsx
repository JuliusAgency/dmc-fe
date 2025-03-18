import { Box, Grid, Typography, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { GridCloseIcon } from "@mui/x-data-grid-pro";
import {
  useUploadDocument,
  useGenerateDocumentPartNumber,
} from "../../../../hooks/document/documentHooks.ts";
import { useGetAllPartNumbers } from "../../../../hooks/partNumber/partNumberHooks.ts";
import {
  GridMultipleAutocomplete,
  Option,
} from "../../../../components/gridItems/gridMultipleAutocomplete/GridMultipleAutocomplete.tsx";
import GridInput from "../../../../components/gridItems/gridInput/GridInput.tsx";
import {
  snackBarError,
  snackBarSuccess,
} from "../../../../components/toast/Toast.tsx";
import { useParams } from "react-router-dom";
import {
  CLASSIFICATION_OPTIONS,
  FILE_TYPE_OPTIONS,
  ALLOWED_FILE_TYPES,
  TITLE_NEW_DOCUMENT,
  TITLE_EDIT_DOCUMENT,
  ERROR_REQUIRED_FIELDS,
  ERROR_INVALID_FILE,
  SUCCESS_UPLOAD,
  BUTTON_SAVE,
  BUTTON_CANCEL,
  ERROR_UPLOAD,
} from "./constants.ts";
import { Props } from "./types.ts";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";

export const AddDocument = ({
  open,
  onClose,
  refetch,
  documentToEdit,
  onDocumentAdded,
}: Props) => {
  const storedUser = localStorage.getItem("user");

  const uploadDocumentMutation = useUploadDocument();
  const { data: partNumber } = useGetAllPartNumbers();

  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  const [formData, setFormData] = useState({
    docType: null as Option | null,
    documentPartNumber: "",
    name: "",
    classification: { id: 1, name: "Public" } as Option,
    revision: "01",
    createdBy: user?.email || "Unknown",
    dcoNumber: "Generated in approval process",
    uploadDate: new Date(),
    processOwner: user?.id || "Unknown",
    type: null as Option | null,
    categoryId: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const { data: generatedPartNumber } = useGenerateDocumentPartNumber(
    formData.docType?.id || null,
    formData.docType?.name || null
  );

  const { id: categoryId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(!!documentToEdit);

  const partNumberOptions: Option[] = partNumber
    ? partNumber.map((partNumber) => ({
        id: partNumber.id,
        name: partNumber.number,
      }))
    : [];

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (documentToEdit) {
      setFormData((prev) => ({
        ...prev,
        documentPartNumber: documentToEdit.documentPartNumber,
        revision: String(Number(documentToEdit.revision) + 1).padStart(2, "0"),
        fileName: documentToEdit.fileName || "",
        isFinal: false,
        docType: documentToEdit.docType
          ? { id: documentToEdit.docType.id, name: documentToEdit.docType.name }
          : null,
        type: documentToEdit.type ? { id: 1, name: documentToEdit.type } : null,
      }));
    }
  }, [documentToEdit]);

  useEffect(() => {
    if (!isEditingRef.current && generatedPartNumber) {
      setFormData((prev) => ({
        ...prev,
        documentPartNumber: generatedPartNumber,
      }));
    }
  }, [generatedPartNumber]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      snackBarError(ERROR_INVALID_FILE);
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
      !formData.documentPartNumber ||
      !formData.name ||
      !formData.classification ||
      !file
    ) {
      snackBarError(ERROR_REQUIRED_FIELDS);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append(
        "entityData",
        JSON.stringify({
          docTypeId: formData.docType?.id,
          classification: formData.classification.name.toUpperCase(),
          updatedBy: user?.email || null,
          revision: Number(formData.revision),
          name: formData.name,
          documentPartNumber: formData.documentPartNumber,
          status: "DRAFT",
          published: new Date(),
          isFinal: !documentToEdit,
          type: formData.type?.name.toUpperCase(),
          categoryId: Number(categoryId),
        })
      );

      const response = await uploadDocumentMutation.mutateAsync(formDataToSend);

      if (response?.id) {
        snackBarSuccess(SUCCESS_UPLOAD);
        refetch();
        onClose();
        onDocumentAdded(response.id);
      }

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
      snackBarError(ERROR_UPLOAD);
    }
  };

  return (
    <GenericPopup
      open={open}
      onClose={onClose}
      title={documentToEdit ? TITLE_EDIT_DOCUMENT : TITLE_NEW_DOCUMENT}
      onConfirm={handleSubmit}
      confirmButtonText={BUTTON_SAVE}
      cancelButtonText={BUTTON_CANCEL}
    >
      <Grid container spacing={3}>
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
        {!documentToEdit && (
          <Grid item xs={12} md={12}>
            <GridMultipleAutocomplete
              multiple={false}
              onChange={(value) => handleInputChange("docType", value)}
              value={formData.docType}
              fullWidth
              selectorData={{
                label: "Document Type",
                accessorId: "docType",
                options: partNumberOptions || [],
              }}
              sx={{ minWidth: 250, typography: "h6" }}
            />
          </Grid>
        )}

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
              options: CLASSIFICATION_OPTIONS,
            }}
            sx={{ minWidth: 250, typography: "h6" }}
          />
        </Grid>
        <GridMultipleAutocomplete
          multiple={false}
          onChange={(value) => handleInputChange("type", value)}
          value={formData.type ?? null}
          fullWidth
          selectorData={{
            label: "File Type",
            accessorId: "type",
            options: FILE_TYPE_OPTIONS,
          }}
          sx={{ minWidth: 250, typography: "h6" }}
        />
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
      </Grid>
    </GenericPopup>
  );
};
