import { GenericTable } from "../../components/genericTable/genericTable";
import { COLUMNS } from "./consts.tsx";
import {
  useGetAllDocuments,
  useGetFile,
} from "../../hooks/document/documentHooks.ts";
import { useCallback, useState, useEffect } from "react";
import { PaginationModel } from "../../consts/types.ts";
import { Box, Button, Grid } from "@mui/material";
import { AddDocument } from "./components/addDocument/index.tsx";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { GridColDef } from "@mui/x-data-grid";
import { RevisionGroup } from "./components/revisionGroup";
import EditIcon from "@mui/icons-material/Edit";

export const Document = () => {
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 10,
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

  const documentsQuery = useGetAllDocuments(pagination, { isFinal: true }, [
    "tags",
    "tags.tag",
    "category",
    "secretLevel",
  ]);
  const fileQuery = useGetFile(fileNameToDownload ?? "");

  const toggleDocumentModal = useCallback(() => {
    setIsAddDocumentModalOpen(!isAddDocumentModalOpen);
  }, [isAddDocumentModalOpen]);

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

  const ACTION_COLUMN: GridColDef = {
    field: "action",
    headerName: "פעולות",
    headerAlign: "center",
    width: 150,
    align: "center",
    cellClassName: "socialMedia",
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
        height: "100vh",
        width: "100%",
        paddingLeft: "5%",
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
          alignItems={"start"}
          width={"100%"}
          mb={2}
        >
          <Button variant="outlined" onClick={toggleDocumentModal}>
            הוספת מסמך
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
          rows={documentsQuery?.data?.data ?? []}
          getDetailPanelHeight={() => 200}
          getDetailPanelContent={(params) => (
            <RevisionGroup
              revisionGroup={params.row.revisionGroup}
              refetchMainDocuments={documentsQuery.refetch}
            />
          )}
        />
        <AddDocument
          open={isAddDocumentModalOpen}
          onClose={toggleDocumentModal}
          refetch={documentsQuery.refetch}
          documentToEdit={documentToEdit}
        />
      </Grid>
    </Box>
  );
};
