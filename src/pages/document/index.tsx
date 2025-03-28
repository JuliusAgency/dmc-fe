import { GenericTable } from "../../components/genericTable/genericTable";
import { useColumns } from "./useColumns.tsx";
import {
  useGetAllDocuments,
  useUpdateDocument,
  useDeleteDocument,
} from "../../hooks/document/documentHooks.ts";
import { useCallback, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
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
import { snackBarInfo } from "../../components/toast/Toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { GridRowId } from "@mui/x-data-grid-pro";
import { DisplaySignatures } from "./components/displaySignatures";

export const Document = () => {
  const { id: categoryId } = useParams();
  const { handleDownloadFile } = useFileDownload();

  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 15,
    page: 0,
  });

  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<
    DocumentType | undefined
  >();
  const [isSignersPopupOpen, setIsSignersPopupOpen] = useState(false);
  const [documentIdForSigners, setDocumentIdForSigners] = useState<
    number | null
  >(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedDocumentPartNumber, setSelectedDocumentPartNumber] = useState<
    string | null
  >(null);
  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = useState<
    GridRowId[]
  >([]);

  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );

  const storedUser = localStorage.getItem("user");
  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  const approvedDocsQuery = useGetAllDocuments(
    pagination,
    {
      status: ["APPROVED"],
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    [
      "tags",
      "tags.tag",
      "category",
      "processOwner",
      "signatures",
      "signatures.user",
    ],
    "getActiveDocuments"
  );

  const firstRevisionInProgressQuery = useGetAllDocuments(
    pagination,
    {
      status: ["IN_PROGRESS"],
      revision: 1,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    [
      "tags",
      "tags.tag",
      "category",
      "processOwner",
      "signatures",
      "signatures.user",
    ],
    "getInProgressRevision1"
  );

  const firstRevisionDraftQuery = useGetAllDocuments(
    pagination,
    {
      status: ["DRAFT"],
      revision: 1,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    [
      "tags",
      "tags.tag",
      "category",
      "processOwner",
      "signatures",
      "signatures.user",
    ],
    "getDraftRevision1"
  );

  const deleteMutation = useDeleteDocument();
  const updateDocumentMutation = useUpdateDocument();

  const toggleDocumentModal = useCallback(() => {
    setIsAddDocumentModalOpen(!isAddDocumentModalOpen);
  }, [isAddDocumentModalOpen]);

  useEffect(() => {
    if (categoryId) {
      approvedDocsQuery.refetch();
      firstRevisionInProgressQuery.refetch();
    }
  }, [categoryId]);

  const handleEdit = (document: DocumentType) => {
    setDocumentToEdit(document);
    toggleDocumentModal();
  };

  const handleDocumentAdded = (documentId: number) => {
    setDocumentIdForSigners(documentId);
    setIsSignersPopupOpen(true);
    approvedDocsQuery.refetch();
    firstRevisionInProgressQuery.refetch();
  };

  const handleDelete = async (documentId: number) => {
    await deleteMutation.mutateAsync(documentId);
    approvedDocsQuery.refetch();
    firstRevisionInProgressQuery.refetch();
  };

  const handleShowHistory = (documentPartNumber: string) => {
    setSelectedDocumentPartNumber(documentPartNumber);
    setIsHistoryDialogOpen(true);
  };

  const handleViewFile = (fileName: string) => {
    if (!fileName) return;
    const fileUrl = new URL(`document/view/${fileName}`, CONFIG.BASE_URL).href;
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

      if (changedFields.length === 0) return newRow;

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

  const handleOpenSignatures = (doc: DocumentType) => {
    setSelectedDocument(doc);
  };

  const handleCloseSignatures = () => {
    setSelectedDocument(null);
  };

  const COLUMNS = useColumns(handleOpenSignatures);

  const approvedDocs = approvedDocsQuery.data?.data ?? [];
  const inProgressDocs = firstRevisionInProgressQuery.data?.data ?? [];
  const draftDocs = firstRevisionDraftQuery.data?.data ?? [];

  const filteredDocs = [...approvedDocs, ...inProgressDocs, ...draftDocs];

  const ACTION_COLUMN: GridColDef = {
    field: "action",
    headerName: "Actions",
    headerAlign: "center",
    width: 200,
    align: "center",
    renderCell: ({ row }) => (
      <Box display={"flex"} gap={1}>
        <Button
          onClick={() => handleDownloadFile(row.fileName)}
          sx={{ padding: 0, minWidth: 0 }}
        >
          <DownloadForOfflineIcon sx={{ color: "#66bb6a" }} />
        </Button>
        <Button
          onClick={() => handleViewFile(row.fileName)}
          sx={{ padding: 0, minWidth: 0 }}
        >
          <VisibilityIcon sx={{ color: "#42a5f5" }} />
        </Button>
        <Button
          onClick={() => handleEdit(row)}
          sx={{ padding: 0, minWidth: 0 }}
        >
          <EditIcon sx={{ color: "#ffa726" }} />
        </Button>
        {user.role === "ADMIN" || user.role === "SYSTEM_ADMIN" ? (
          <Button
            onClick={() => handleDelete(row.id)}
            sx={{ padding: 0, minWidth: 0 }}
          >
            <DeleteIcon sx={{ color: "#ef5350" }} />
          </Button>
        ) : null}
        <Button
          onClick={() => handleShowHistory(row.documentPartNumber)}
          sx={{ padding: 0, minWidth: 0 }}
        >
          <HistoryIcon sx={{ color: "#ab47bc" }} />
        </Button>
      </Box>
    ),
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "92vh",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: 2,
      }}
    >
      <Grid container justifyContent={"flex-start"} width={"100%"} mb={2}>
        <Button variant="outlined" onClick={toggleDocumentModal}>
          Add Document
        </Button>
      </Grid>

      <GenericTable
        loading={
          approvedDocsQuery.isLoading ||
          firstRevisionInProgressQuery.isLoading ||
          firstRevisionDraftQuery.isLoading
        }
        columns={[...COLUMNS, ACTION_COLUMN]}
        pageSize={pagination.pageSize}
        onPaginationModelChange={setPagination}
        rowCount={
          (approvedDocsQuery.data?.total ?? 0) +
          (firstRevisionInProgressQuery.data?.total ?? 0) +
          (firstRevisionDraftQuery.data?.total ?? 0)
        }
        rows={filteredDocs}
        getDetailPanelHeight={() => 200}
        processRowUpdate={handleRowUpdate}
        detailPanelExpandedRowIds={detailPanelExpandedRowIds}
        setDetailPanelExpandedRowIds={setDetailPanelExpandedRowIds}
        onTryExpandRow={(rowId) => {
          const row = filteredDocs.find((doc) => doc.id === rowId.id);
          if (!row) return false;

          const hasInProgressForSamePart = filteredDocs.some(
            (doc) =>
              doc.documentPartNumber === row.documentPartNumber &&
              //@ts-ignore
              doc.status === "IN_PROGRESS"
          );

          if (!hasInProgressForSamePart) {
            snackBarInfo("No documents are currently in the approval process.");
            return false;
          }

          return true;
        }}
        getDetailPanelContent={({ row }) => (
          <RevisionGroup
            key={row.id}
            documentPartNumber={row.documentPartNumber}
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
        refetch={
          (approvedDocsQuery.refetch,
          firstRevisionInProgressQuery.refetch,
          firstRevisionDraftQuery.refetch)
        }
        documentToEdit={documentToEdit}
        onDocumentAdded={handleDocumentAdded}
      />

      <SelectSignersPopup
        open={isSignersPopupOpen}
        onClose={() => setIsSignersPopupOpen(false)}
        documentId={documentIdForSigners}
        refetch={
          (approvedDocsQuery.refetch,
          firstRevisionInProgressQuery.refetch,
          firstRevisionDraftQuery.refetch)
        }
      />

      <Dialog
        open={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        fullScreen
      >
        <DialogTitle>Document History</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            p: 0,
          }}
        >
          {selectedDocumentPartNumber && (
            <DocumentHistory
              documentPartNumber={selectedDocumentPartNumber}
              onClose={() => setIsHistoryDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedDocument && (
        <DisplaySignatures
          open={Boolean(selectedDocument)}
          onClose={handleCloseSignatures}
          documentId={selectedDocument.id}
          signatures={selectedDocument.signatures || []}
        />
      )}
    </Box>
  );
};
