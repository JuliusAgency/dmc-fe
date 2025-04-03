import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { GenericTable } from "../../../../components/genericTable/genericTable";
import {
  useCreatePartNumber,
  useDeletePartNumber,
  useGetAllPartNumbers,
} from "../../../../hooks/partNumber/partNumberHooks";
import {
  CreatePartNumberModal,
  PartNumberFormData,
} from "./create-part-number-modal";

export function PartNumberTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: createPartNumber, isPending: isCreating } =
    useCreatePartNumber();
  const { mutate: deletePartNumber } = useDeletePartNumber();
  const { data: partNumbers = [], isLoading: loadingPartNumbers } =
    useGetAllPartNumbers();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreatePartNumber = (data: PartNumberFormData) => {
    createPartNumber(data, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Create Part Number
        </Button>
      </Box>

      <CreatePartNumberModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreatePartNumber}
        isSubmitting={isCreating}
      />

      <GenericTable
        loading={loadingPartNumbers}
        columns={[
          {
            field: "definition",
            headerName: "Part Number",
            flex: 1,
          },
          {
            field: "number",
            headerName: "Number",
            flex: 1,
          },
          {
            field: "actions",
            headerName: "Actions",
            flex: 0.3,
            renderCell: (params) => (
              <>
                <IconButton onClick={() => deletePartNumber(params.row.id)}>
                  <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                </IconButton>
              </>
            ),
          },
        ]}
        rows={partNumbers}
        rowCount={partNumbers.length}
        pageSize={1000}
        onPaginationModelChange={() => {}}
        sx={{ height: "auto", mt: 2 }}
        hideFooterPagination={true}
        fileName="part-number"
      />
    </>
  );
}
