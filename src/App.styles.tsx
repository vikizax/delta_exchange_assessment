import { createStyles } from "@mantine/core";
import { pxToRem } from "./utils/theme.utils";
export const useStyles = createStyles((theme) => ({
  table: {
    height: "100%",
    overflow: "auto",
    borderCollapse: "separate",
    tableLayout: "fixed",
    width: "100%",
    "& thead th": {
      position: "sticky",
      top: 0,
      width: "250px",
      background: theme.white,
      ":first-of-type": {
        position: "sticky",
        left: 0,
        zIndex: 2,
      },
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        width: "150px",
      },
    },
    "& tbody td": {
      background: theme.white,
      ":first-of-type": {
        position: "sticky",
        left: 0,
        zIndex: 1,
      },
    },
  },
  tableContainer: {
    position: "relative",
    maxHeight: "100%",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: pxToRem(5),
      height: pxToRem(5),
    },
    "&::-webkit-scrollbar-track": {
      background: "#fff",
      borderRadius: pxToRem(4),
      marginRight: pxToRem(10),
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0,0,0,0.1)",
      borderRadius: pxToRem(4),
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "rgba(0,0,0,0.2)",
    },
  },
  paginationContainer: {
    paddingTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      "& > div": {
        gap: 0,
      },
    },
  },
}));
