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
import { useNavigate } from "react-router-dom";
import { SearchReturnType } from "../../api/searchAPI/search";
import { useSearch } from "../../hooks/search/searchHooks";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const pathSegments = location.pathname
    .replace("/category/", "")
    .split("/")
    .filter(Boolean);

  const categoryId = pathSegments.length >= 6 ? pathSegments[5] : null;

  const {
    data: searchResultsData,
    isLoading,
    isError,
  } = useSearch(debouncedQuery, Number(categoryId));

  const searchResults = searchResultsData?.data;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setDebouncedQuery(searchQuery.trim());
        setIsResultsOpen(true);
      } else {
        setDebouncedQuery("");
        setIsResultsOpen(false);
      }
    }, 1000);

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
      onSearch(searchQuery.trim(), Number(categoryId));
      setIsResultsOpen(false);
    }
  };

  const navigate = useNavigate();

  const handleResultClick = (result: SearchReturnType) => {
    setIsResultsOpen(false);
    const url = getUrlFromSearchResult(result);
    if (url) {
      navigate(url);
    }
  };

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
            position: "relative",
            borderRadius: 2,
            border: `1px solid black`,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginRight: 2,
            marginLeft: 0,
            width: fullWidth ? "100%" : "auto",
            [theme.breakpoints.up("sm")]: {
              marginLeft: theme.spacing(1),
              width: fullWidth ? "100%" : "auto",
            },
            display: "flex",
          }}
        >
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{
              color: "inherit",
              "& .MuiInputBase-input": {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: 0,
                width: "100%",
                [theme.breakpoints.up("md")]: {
                  width: fullWidth ? "100%" : "20ch",
                },
              },
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
                sx={{ mt: 1, maxHeight: "300px", overflow: "auto" }}
              >
                {isLoading ? (
                  <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : isError ? (
                  <Box sx={{ p: 2 }}>
                    <Typography color="error">Error loading results</Typography>
                  </Box>
                ) : searchResults && searchResults.length > 0 ? (
                  <List dense>
                    {searchResults.map((result, index) => {
                      return (
                        <ListItem
                          key={`${result.table}-${index}`}
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
                            secondary={result.table}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : debouncedQuery ? (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2">No results found</Typography>
                  </Box>
                ) : null}
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
