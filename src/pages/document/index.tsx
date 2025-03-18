import { GenericTable } from "../../components/genericTable/genericTable";
import { COLUMNS } from "./consts.tsx";
import {
  useGetAllDocuments,
  useGetFile,
  useDeleteDocument,
} from "../../hooks/document/documentHooks.ts";
import { useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { PaginationModel } from "../../consts/types.ts";
import { AddDocument } from "./components/addDocument/index.tsx";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { GridColDef } from "@mui/x-data-grid";
import { RevisionGroup } from "./components/revisionGroup";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentType } from "../../api/documentAPI/types.ts";
import { useParams } from "react-router-dom";
import SelectSignersPopup from "./components/selectSignersPopup";
import { DocumentHistory } from "./components/documentHistory";

export const Document = () => {
  const { id: categoryId } = useParams();
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [fileNameToDownload, setFileNameToDownload] = useState<string | null>(
    null
  );
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

  const documentsQuery = useGetAllDocuments(
    pagination,
    {
      status: ["APPROVED"],
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    ["tags", "tags.tag", "category", "processOwner"],
    "getActiveDocuments"
  );

  const fileQuery = useGetFile(fileNameToDownload ?? "");
  const deleteMutation = useDeleteDocument();

  const toggleDocumentModal = useCallback(() => {
    setIsAddDocumentModalOpen(!isAddDocumentModalOpen);
  }, [isAddDocumentModalOpen]);

  useEffect(() => {
    if (categoryId) {
      documentsQuery.refetch();
    }
  }, [categoryId]);

  useEffect(() => {
    if (fileQuery.data) {
      const url = window.URL.createObjectURL(new Blob([fileQuery.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileNameToDownload ?? "");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setFileNameToDownload(null);
    }
  }, [fileQuery.data, fileNameToDownload]);

  const handleOpenFile = (fileName: string) => {
    setFileNameToDownload(fileName);
  };

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

  const filteredDocs = documentsQuery.data?.data ?? [];

  const ACTION_COLUMN: GridColDef = {
    field: "action",
    headerName: "Actions",
    headerAlign: "center",
    width: 280,
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Box display={"flex"} gap={1}>
          <Button
            variant="outlined"
            onClick={() => handleOpenFile(row.fileName)}
          >
            <DownloadForOfflineIcon />
          </Button>
          <Button variant="outlined" onClick={() => handleEdit(row)}>
            <EditIcon />
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon />
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleShowHistory(row.documentPartNumber)}
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
      }}
    >
      <Grid
        container
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          width: "100%",
          bgcolor: "background.default",
          p: 1,
          borderRadius: 2,
        }}
      >
        <Grid
          item
          xs={12}
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
            bgcolor: "background.default",
            height: "60vh",
            mb: 3,
            width: "100%",
          }}
          rowCount={documentsQuery?.data?.total ?? 0}
          rows={filteredDocs}
          getDetailPanelHeight={() => 200}
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
      </Grid>
    </Box>
  );
};
