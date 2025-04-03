import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { GridRowId } from "@mui/x-data-grid-pro";

import { PaginationModel } from "../../consts/types";
import { CONFIG } from "../../consts/config";
import { snackBarInfo } from "../../components/toast/Toast";

import {
  useGetAllDocuments,
  useUpdateDocument,
  useDeleteDocument,
} from "../../hooks/document/documentHooks";
import { useGetCategoryById } from "../../hooks/category/categoryHooks";
import { useFileDownload } from "../../hooks/utils/useFileDownload";

import { GenericTable } from "../../components/genericTable/genericTable";
import { useColumns } from "./useColumns";
import { getActionColumn } from "./constants";

import { AddDocument } from "./components/addDocument";
import { RevisionGroup } from "./components/revisionGroup";
import { DocumentHistory } from "./components/documentHistory";
import { SelectSignersPopup } from "./components/selectSignersPopup";
import { DisplaySignatures } from "./components/displaySignatures";
import { ReportIssuePopup } from "./components/reportIssuePopup";

import { DocumentType } from "../../api/documentAPI/types";

export const Document = () => {
  const theme = useTheme();
  const location = useLocation();
  const pathSegments = location.pathname
    .replace("/category/", "")
    .split("/")
    .filter(Boolean);

  const categoryId = pathSegments[pathSegments.length - 1];

  console.log("categoryId", categoryId);
  const { handleDownloadFile } = useFileDownload();

  const [pagination, setPagination] = useState<PaginationModel>({
    page: 0,
    pageSize: 15,
  });

  const [isAddOpen, setAddOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<DocumentType>();
  const [isSignersOpen, setSignersOpen] = useState(false);
  const [signersDocId, setSignersDocId] = useState<number | null>(null);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [selectedPartNumber, setSelectedPartNumber] = useState<string | null>(
    null
  );
  const [expandedRowIds, setExpandedRowIds] = useState<GridRowId[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [isReportOpen, setReportOpen] = useState(false);
  const [reportDoc, setReportDoc] = useState<DocumentType | null>(null);

  const categoryQuery = useGetCategoryById(
    categoryId ? Number(categoryId) : undefined
  );

  const refetchParams = {
    pagination,
    filters: {
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    relations: [
      "tags",
      "tags.tag",
      "category",
      "processOwner",
      "signatures",
      "signatures.user",
      "reports",
    ],
  };

  const approvedQuery = useGetAllDocuments(
    pagination,
    { ...refetchParams.filters, status: ["APPROVED"] },
    refetchParams.relations,
    "approvedDocs"
  );

  const inProgressQuery = useGetAllDocuments(
    pagination,
    { ...refetchParams.filters, status: ["IN_PROGRESS"] },
    refetchParams.relations,
    "inProgressDocs"
  );

  const draftQuery = useGetAllDocuments(
    pagination,
    { ...refetchParams.filters, status: ["DRAFT"], revision: 1 },
    refetchParams.relations,
    "draftDocs"
  );

  const deleteDoc = useDeleteDocument();
  const updateDoc = useUpdateDocument();

  const toggleAddModal = () => {
    setAddOpen(!isAddOpen);
    setDocumentToEdit(undefined);
  };

  const handleEdit = (doc: DocumentType) => {
    setDocumentToEdit(doc);
    setAddOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteDoc.mutateAsync(id);
    refetchAll();
  };

  const handleAdd = (id: number) => {
    setSignersDocId(id);
    setSignersOpen(true);
    refetchAll();
  };

  const handleHistory = (partNumber: string) => {
    setSelectedPartNumber(partNumber);
    setHistoryOpen(true);
  };

  const handleReport = (doc: DocumentType) => {
    setReportDoc(doc);
    setReportOpen(true);
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

      if (!changedFields.length) return newRow;

      await Promise.all(
        changedFields.map((field) =>
          updateDoc.mutateAsync({
            id: newRow.id,
            field,
            value: newRow[field as keyof DocumentType],
          })
        )
      );

      return newRow;
    } catch (e) {
      console.error("Failed to update document:", e);
      return oldRow;
    }
  };

  const handleOpenSignatures = (doc: DocumentType) => {
    setSelectedDoc(doc);
  };

  const handleCloseSignatures = () => {
    setSelectedDoc(null);
  };

  const refetchAll = async () => {
    await Promise.all([
      approvedQuery.refetch(),
      inProgressQuery.refetch(),
      draftQuery.refetch(),
    ]);
  };

  useEffect(() => {
    if (categoryId) refetchAll();
  }, [categoryId]);

  const columns = useColumns(handleOpenSignatures);
  const actionColumn = getActionColumn(
    handleDownloadFile,
    handleViewFile,
    handleEdit,
    handleDelete,
    handleHistory,
    handleReport
  );

  const approved = approvedQuery.data?.data ?? [];
  const inProgress =
    inProgressQuery.data?.data.filter((doc) => Number(doc.revision) === 1) ??
    [];
  const drafts = draftQuery.data?.data ?? [];

  const allDocs = [...approved, ...inProgress, ...drafts];
  const totalDocs =
    (approvedQuery.data?.total ?? 0) +
    (inProgressQuery.data?.total ?? 0) +
    (draftQuery.data?.total ?? 0);

  return (
    <Box sx={{ width: "100%", height: "92vh", padding: 2 }}>
      {categoryQuery.data && (
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: theme.palette.primary.main,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            pb: 1,
          }}
        >
          {categoryQuery.data.name}
        </Typography>
      )}

      <Grid container justifyContent="flex-start" mb={2}>
        <Button variant="outlined" onClick={toggleAddModal}>
          Add Document
        </Button>
      </Grid>

      <GenericTable
        rows={allDocs}
        rowCount={totalDocs}
        loading={
          approvedQuery.isLoading ||
          inProgressQuery.isLoading ||
          draftQuery.isLoading
        }
        columns={[...columns, actionColumn]}
        pageSize={pagination.pageSize}
        onPaginationModelChange={setPagination}
        getDetailPanelHeight={() => 200}
        processRowUpdate={handleRowUpdate}
        detailPanelExpandedRowIds={expandedRowIds}
        setDetailPanelExpandedRowIds={setExpandedRowIds}
        onTryExpandRow={(rowId) => {
          const doc = allDocs.find((d) => d.id === rowId.id);
          if (!doc) return false;

          const hasInProgress = inProgressQuery.data?.data.some(
            (d) =>
              d.documentPartNumber === doc.documentPartNumber &&
              d.status === "IN_PROGRESS"
          );

          if (!hasInProgress) {
            snackBarInfo("No documents are currently in the approval process.");
            return false;
          }

          return true;
        }}
        getDetailPanelContent={({ row }) => (
          <RevisionGroup
            key={row.id}
            documentPartNumber={row.documentPartNumber}
            rows={allDocs}
            setRows={() => {}}
          />
        )}
      />

      <AddDocument
        open={isAddOpen}
        onClose={toggleAddModal}
        documentToEdit={documentToEdit}
        onDocumentAdded={handleAdd}
        refetch={refetchAll}
      />

      <SelectSignersPopup
        open={isSignersOpen}
        onClose={() => setSignersOpen(false)}
        documentId={signersDocId}
        refetch={refetchAll}
      />

      {isHistoryOpen && selectedPartNumber && (
        <DocumentHistory
          open={isHistoryOpen}
          onClose={() => setHistoryOpen(false)}
          documentPartNumber={selectedPartNumber}
        />
      )}

      {selectedDoc && (
        <DisplaySignatures
          open={Boolean(selectedDoc)}
          onClose={handleCloseSignatures}
          documentId={selectedDoc.id}
          signatures={selectedDoc.signatures || []}
        />
      )}

      <ReportIssuePopup
        open={isReportOpen}
        onClose={() => setReportOpen(false)}
        document={reportDoc}
      />
    </Box>
  );
};
