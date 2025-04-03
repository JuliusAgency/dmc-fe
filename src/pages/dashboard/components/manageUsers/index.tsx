import { Container, Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GenericTable } from "../../../../components/genericTable/genericTable";
import { useManageUsersLogic } from "./useManageUsersLogic";
import { USERS_TITLE } from "./constants";
import { CreateUserPopup } from "./components/createUserPopUp";
import { ResetPasswordPopup } from "./components/resetPasswordPopUp";
import { BlockedCategoriesPopup } from "./components/blockedCategoriesPopUp";

export const ManageUsers = () => {
  const {
    users,
    isLoading,
    COLUMNS,
    userData,
    setUserData,
    openCreatePopup,
    handleOpenCreatePopup,
    handleCloseCreatePopup,
    handleSaveUser,
    openResetPopup,
    handleCloseResetPopup,
    newPassword,
    setNewPassword,
    handleResetPassword,
    openPermissionsPopup,
    handleClosePermissionsPopup,
    handleSavePermissions,
    selectedUser,
    selectedCategories,
    setSelectedCategories,
    topLevelCategories,
  } = useManageUsersLogic();

  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {USERS_TITLE}
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 3 }}
      >
        <Button variant="contained" onClick={handleOpenCreatePopup}>
          <AddIcon />
        </Button>
      </Box>

      <GenericTable
        loading={isLoading}
        columns={COLUMNS}
        rows={users}
        rowCount={users.length}
        pageSize={10}
        onPaginationModelChange={() => {}}
        hideFooterPagination
        fileName="users"
        sx={{
          width: "100%",
          height: "auto",
          border: "none",
          "& .MuiDataGrid-virtualScroller": { overflow: "visible" },
        }}
      />

      <CreateUserPopup
        open={openCreatePopup}
        onClose={handleCloseCreatePopup}
        onConfirm={handleSaveUser}
        userData={userData}
        setUserData={setUserData}
      />

      <ResetPasswordPopup
        open={openResetPopup}
        onClose={handleCloseResetPopup}
        onConfirm={handleResetPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
      />

      <BlockedCategoriesPopup
        open={openPermissionsPopup}
        onClose={handleClosePermissionsPopup}
        onConfirm={handleSavePermissions}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        topLevelCategories={topLevelCategories}
        email={selectedUser?.email}
      />
    </Container>
  );
};
