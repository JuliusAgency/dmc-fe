import { GenericTable } from "../../components/genericTable/genericTable";
import { useColumns } from "./consts.tsx";
import {
  useGetAllDocuments,
  useUpdateDocument,
  useDeleteDocument,
} from "../../hooks/document/documentHooks.ts";
import { useCallback, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, useTheme } from "@mui/material";
import { PaginationModel } from "../../consts/types.ts";
import { Box, Button, Grid } from "@mui/material";
import { AddDocument } from "./components/addDocument/index.tsx";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { GridColDef } from "@mui/x-data-grid";
import { RevisionGroup } from "./components/revisionGroup";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentType } from "../../api/documentAPI/types.ts";
import { useParams } from "react-router-dom";
import { DocumentHistory } from "./components/documentHistory";
import { useSelector } from "react-redux";
import { SelectSignersPopup } from "./components/selectSignersPopup";
import { useFileDownload } from "../../hooks/utils/useFileDownload";
import { CONFIG } from "../../consts/config.ts";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const Document = () => {
  const COLUMNS = useColumns();
  const { id: categoryId } = useParams();
  const { handleDownloadFile } = useFileDownload();

  const theme = useTheme();
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 15,
    page: 0,
  });

  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);

  const [documentToEdit, setDocumentToEdit] = useState<
    DocumentType | undefined
  >(undefined);
  const [isSignersPopupOpen, setIsSignersPopupOpen] = useState(false);
  const [documentIdForSigners, setDocumentIdForSigners] = useState<
    number | null
  >(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedDocumentPartNumber, setSelectedDocumentPartNumber] = useState<
    string | null
  >(null);

  const storedUser = localStorage.getItem("user");

  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  const documentsQuery = useGetAllDocuments(
    pagination,
    {
      status: ["APPROVED"],
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    ["tags", "tags.tag", "category", "processOwner"],
    "getActiveDocuments"
  );

  const deleteMutation = useDeleteDocument();
  const updateDocumentMutation = useUpdateDocument();

  const toggleDocumentModal = useCallback(() => {
    setIsAddDocumentModalOpen(!isAddDocumentModalOpen);
  }, [isAddDocumentModalOpen]);

  useEffect(() => {
    if (categoryId) {
      documentsQuery.refetch();
    }
  }, [categoryId]);

  const handleEdit = (document: DocumentType) => {
    setDocumentToEdit(document);
    toggleDocumentModal();
  };

  const handleDocumentAdded = (documentId: number) => {
    setDocumentIdForSigners(documentId);
    setIsSignersPopupOpen(true);
    documentsQuery.refetch();
  };

  const handleDelete = async (documentId: number) => {
    await deleteMutation.mutateAsync(documentId);
    documentsQuery.refetch();
  };

  const handleShowHistory = (documentPartNumber: string) => {
    setSelectedDocumentPartNumber(documentPartNumber);
    setIsHistoryDialogOpen(true);
  };

  const handleViewFile = (fileName: string) => {
    if (!fileName) {
      return;
    }

    const fileUrl = new URL(`document/view/${fileName}`, CONFIG.BASE_URL).href;
    console.log(fileUrl, CONFIG.BASE_URL);
    window.open(fileUrl, "_blank");
  };

  const handleRowUpdate = async (
    newRow: DocumentType,
    oldRow: DocumentType
  ) => {
    try {
      const changedFields = Object.keys(newRow).filter(
        (key) =>
          newRow[key as keyof DocumentType] !==
          oldRow[key as keyof DocumentType]
      );

      if (changedFields.length === 0) {
        return newRow;
      }

      await Promise.all(
        changedFields.map((field) =>
          updateDocumentMutation.mutateAsync({
            id: newRow.id,
            field,
            value: newRow[field as keyof DocumentType],
          })
        )
      );

      return newRow;
    } catch (error) {
      console.error("Failed to update document:", error);
      return oldRow;
    }
  };

  const filteredDocs = documentsQuery.data?.data ?? [];

  const ACTION_COLUMN: GridColDef = {
    field: "action",
    headerName: "Actions",
    headerAlign: "center",
    width: 150,
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Box display={"flex"} gap={1}>
          <Button
            onClick={() => handleDownloadFile(row.fileName)}
            sx={{
              padding: 0,
              minWidth: 0,
              color: theme.palette.primary.main,
            }}
          >
            <DownloadForOfflineIcon sx={{ color: "green" }} />
          </Button>
          <Button
            onClick={() => handleViewFile(row.fileName)}
            sx={{
              padding: 0,
              minWidth: 0,
              color: theme.palette.primary.main,
            }}
          >
            <VisibilityIcon sx={{ color: "blue" }} />
          </Button>
          <Button
            sx={{
              padding: 0,
              minWidth: 0,
              color: theme.palette.primary.main,
            }}
            onClick={() => handleEdit(row)}
          >
            <EditIcon sx={{ color: "orange" }} />
          </Button>
          {user.role === "ADMIN" ||
            (user.role === "SYSTEM_ADMIN" && (
              <Button
                color="error"
                onClick={() => handleDelete(row.id)}
                sx={{
                  padding: 0,
                  minWidth: 0,
                  color: theme.palette.primary.main,
                }}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </Button>
            ))}
          <Button
            color="primary"
            onClick={() => handleShowHistory(row.documentPartNumber)}
            sx={{
              padding: 0,
              minWidth: 0,
              color: theme.palette.primary.main,
            }}
          >
            <HistoryIcon sx={{ color: "purple" }} />
          </Button>
        </Box>
      );
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        display={"flex"}
        justifyContent={"flex-start"}
        width={"100%"}
        mb={2}
      >
        <Button variant="outlined" onClick={toggleDocumentModal}>
          Add Document
        </Button>
      </Grid>

      <GenericTable
        loading={documentsQuery.isLoading ?? false}
        columns={[...COLUMNS, ACTION_COLUMN]}
        pageSize={pagination.pageSize}
        onPaginationModelChange={setPagination}
        rowCount={documentsQuery?.data?.total ?? 0}
        rows={filteredDocs}
        getDetailPanelHeight={() => 200}
        processRowUpdate={handleRowUpdate}
        getDetailPanelContent={(params) => (
          <RevisionGroup
            key={params.row.id}
            documentPartNumber={params.row.documentPartNumber}
            rows={filteredDocs}
            setRows={() => {}}
          />
        )}
      />

      <AddDocument
        open={isAddDocumentModalOpen}
        onClose={() => {
          setDocumentToEdit(undefined);
          toggleDocumentModal();
        }}
        refetch={documentsQuery.refetch}
        documentToEdit={documentToEdit}
        onDocumentAdded={handleDocumentAdded}
      />

      <SelectSignersPopup
        open={isSignersPopupOpen}
        onClose={() => setIsSignersPopupOpen(false)}
        documentId={documentIdForSigners}
      />

      <Dialog
        open={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Document History</DialogTitle>
        <DialogContent>
          {selectedDocumentPartNumber && (
            <DocumentHistory
              documentPartNumber={selectedDocumentPartNumber}
              onClose={() => setIsHistoryDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
