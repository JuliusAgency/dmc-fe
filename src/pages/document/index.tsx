import { GenericTable } from "../../components/genericTable/genericTable";
import { COLUMNS } from "./consts.tsx";
import {
  useGetAllDocuments,
  useUpdateDocument,
  useDeleteDocument,
} from "../../hooks/document/documentHooks.ts";
import { useCallback, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, useTheme } from "@mui/material";
import { PaginationModel } from "../../consts/types.ts";
import { Box, Button, Grid, alpha } from "@mui/material";
import { AddDocument } from "./components/addDocument/index.tsx";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { GridColDef } from "@mui/x-data-grid";
import { RevisionGroup } from "./components/revisionGroup";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentType, Classification } from "../../api/documentAPI/types.ts";
import { useParams } from "react-router-dom";
import { DocumentHistory } from "./components/documentHistory";
import { useSelector } from "react-redux";
import { SelectSignersPopup } from "./components/selectSignersPopup";
import { useFileDownload } from "../../hooks/utils/useFileDownload";

export const Document = () => {
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

      console.log("🔹 Before update:", newRow);

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
            <DownloadForOfflineIcon />
          </Button>
          <Button
            sx={{
              padding: 0,
              minWidth: 0,
              color: theme.palette.primary.main,
            }}
            onClick={() => handleEdit(row)}
          >
            <EditIcon />
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
                <DeleteIcon />
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
            <HistoryIcon />
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
        sx={{
          height: "65vh",
          mb: 2,
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            padding: "2px 4px",
            lineHeight: "1.1",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
            fontWeight: "bold",
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-columnHeader": {
            padding: "2px 4px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: alpha(theme.palette.background.default, 0.4),
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: alpha(theme.palette.primary.light, 0.1),
          },
          "& .actionColumn": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiTablePagination-root": {
            fontSize: "0.75rem",
          },
        }}
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
