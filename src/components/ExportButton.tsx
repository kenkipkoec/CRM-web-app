import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportPDF?: () => void;
  disabled?: boolean;
}

export default function ExportButton({ onExportCSV, onExportPDF, disabled }: ExportButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Tooltip title="Export">
        <IconButton
          onClick={e => setAnchorEl(e.currentTarget)}
          disabled={disabled}
          size="small"
          sx={{ ml: 1 }}
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { onExportCSV(); setAnchorEl(null); }}>Export as CSV</MenuItem>
        {onExportPDF && (
          <MenuItem onClick={() => { onExportPDF(); setAnchorEl(null); }}>Export as PDF</MenuItem>
        )}
      </Menu>
    </>
  );
}