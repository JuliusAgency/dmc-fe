import { GenericTable } from "../../components/genericTable/genericTable";
import { COLUMNS } from "./consts.tsx";
import {
  useGetAllDocuments,
  useGetFile,
} from "../../hooks/document/documentHooks.ts";
import { useCallback, useState, useEffect } from "react";
import { PaginationModel } from "../../consts/types.ts";
import { Box, Button, Grid, Tooltip, Paper, alpha } from "@mui/material";
import { AddDocument } from "./components/addDocument/index.tsx";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { GridColDef } from "@mui/x-data-grid";
import { RevisionGroup } from "./components/revisionGroup";
import EditIcon from "@mui/icons-material/Edit";
import { DocumentType } from "../../api/documentAPI/types.ts";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import SelectSignersPopup from "./components/selectSignersPopup/index.tsx";

export const Document = () => {
  const theme = useTheme();
  const [rows, setRows] = useState<DocumentType[]>([]);
  const { id: categoryId } = useParams();
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 15,
    page: 0,
  });
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] =
    useState<boolean>(false);
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

  const documentsQuery = useGetAllDocuments(
    pagination,
    { isFinal: true, categoryId: categoryId ? Number(categoryId) : undefined },
    ["tags", "tags.tag", "category", "processOwner"]
  );

  const fileQuery = useGetFile(fileNameToDownload ?? "");

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
  };

  useEffect(() => {
    if (documentsQuery?.data?.data) {
      setRows(documentsQuery.data.data);
    }
  }, [documentsQuery?.data?.data]);

  const ACTION_COLUMN: GridColDef = {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    align: "center",
    width: 100,
    cellClassName: "actionColumn",
    renderCell: ({ row }) => {
      return (
        <Box display={"flex"} gap={1}>
          <Tooltip title="Download document">
            <Button
              sx={{
                padding: 0,
                minWidth: 0,
                color: theme.palette.primary.main,
              }}
              onClick={() => handleOpenFile(row.fileName)}
            >
              <DownloadForOfflineIcon fontSize="small" />
            </Button>
          </Tooltip>
          <Tooltip title="Edit document">
            <Button
              sx={{
                padding: 0,
                minWidth: 0,
                color: theme.palette.primary.main,
              }}
              onClick={() => handleEdit(row)}
            >
              <EditIcon fontSize="small" />
            </Button>
          </Tooltip>
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
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
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
            bgcolor: "background.paper",
            p: 2,
          }}
        >
          <Grid
            item
            xs={12}
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"start"}
            width={"100%"}
            mb={2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={toggleDocumentModal}
              size="small"
            >
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
            rows={rows}
            getDetailPanelHeight={() => 150}
            getDetailPanelContent={(params) => {
              return (
                <RevisionGroup
                  key={params.row.id}
                  revisionGroup={params.row.revisionGroup}
                  rows={rows}
                  setRows={setRows}
                />
              );
            }}
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
        </Grid>
      </Paper>
    </Box>
  );
};
