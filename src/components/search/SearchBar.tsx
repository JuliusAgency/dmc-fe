import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Grow,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../../hooks/search/searchHooks";
import { SearchReturnType } from "../../api/searchAPI/search";
import { getNameFromSearchResult, getUrlFromSearchResult } from "./utils";

interface SearchBarProps {
  onSearch: (query: string, categoryId?: number | null) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search…",
  fullWidth = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const anchorRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const pathSegments = location.pathname
    .replace("/category/", "")
    .split("/")
    .filter(Boolean);
  const rawCategoryId = pathSegments[pathSegments.length - 1];
  const categoryId = isNaN(Number(rawCategoryId))
    ? null
    : Number(rawCategoryId);

  const {
    data: searchResultsData,
    isLoading,
    isError,
  } = useSearch(debouncedQuery, categoryId, "document");
  console.log(categoryId);

  const searchResults = searchResultsData?.data ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setDebouncedQuery(searchQuery.trim());
        setIsResultsOpen(true);
      } else {
        setDebouncedQuery("");
        setIsResultsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClickAway = () => {
    setIsResultsOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (!event.target.value.trim()) {
      setIsResultsOpen(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim(), categoryId);
      setIsResultsOpen(false);
    }
  };

  const handleResultClick = (result: SearchReturnType) => {
    setIsResultsOpen(false);
    const url = getUrlFromSearchResult(result);
    console.log("url", url);
    if (url) {
      navigate(url);
    }
  };

  console.log(searchQuery);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        ref={anchorRef}
        sx={{ position: "relative", width: fullWidth ? "100%" : "auto" }}
      >
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            position: "relative",
            borderRadius: 2,
            border: "1px solid black",
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            width: fullWidth ? "100%" : "auto",
            marginRight: 2,
            marginLeft: 0,
          }}
        >
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{
              color: "inherit",
              flex: 1,
              padding: theme.spacing(1),
              minWidth: fullWidth ? "100%" : "20ch",
            }}
            placeholder={placeholder}
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isLoading && (
            <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}
        </Box>

        <Popper
          open={isResultsOpen && !!debouncedQuery}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          style={{ width: anchorRef.current?.clientWidth, zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
              <Paper
                elevation={3}
                sx={{ mt: 1, maxHeight: 300, overflow: "auto" }}
              >
                {isError ? (
                  <Box sx={{ p: 2 }}>
                    <Typography color="error">Error loading results</Typography>
                  </Box>
                ) : searchResults.length > 0 ? (
                  <List dense>
                    {searchResults.map((result, index) => {
                      const id = (result as any)?.value?.id ?? index;
                      return (
                        <ListItem
                          key={`result-${id}-${index}`}
                          onClick={() => handleResultClick(result)}
                          divider
                          button
                        >
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight="bold">
                                {getNameFromSearchResult(result)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2">No results found</Typography>
                  </Box>
                )}
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
