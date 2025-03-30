export const CATEGORY_TITLE_COLOR = "#1976d2";

export const CATEGORY_PAGE_TITLE = (level: number) =>
  `Subcategories (Level ${level})`;

export const CATEGORY_LOADING_TEXT = "Loading...";

export const CATEGORY_CARD_STYLES = {
  backgroundColor: "#e3f2fd",
  border: "1px solid #90caf9",
  "&:hover": {
    backgroundColor: "#bbdefb",
    cursor: "pointer",
  },
};

export const CATEGORY_CARD_CONTENT_STYLES = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
