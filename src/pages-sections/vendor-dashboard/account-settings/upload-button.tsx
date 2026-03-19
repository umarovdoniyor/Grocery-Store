import { ChangeEvent, Fragment } from "react";
import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";
import CameraAlt from "@mui/icons-material/CameraAlt";
import CircularProgress from "@mui/material/CircularProgress";

// ==============================================================
type Props = {
  id: string;
  uiMode?: "vendor" | "admin";
  style?: SxProps<Theme>;
  onFileChange?: (file: File) => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
};
// ==============================================================

export default function UploadButton({
  id,
  uiMode = "vendor",
  style = {},
  onFileChange,
  disabled = false,
  loading = false
}: Props) {
  const isAdminMode = uiMode === "admin";
  const accentMain = isAdminMode ? "#4F46E5" : "#14B8A6";
  const accentDark = isAdminMode ? "#4338CA" : "#0F766E";
  const accentBorder = isAdminMode ? "#C7D2FE" : "#99F6E4";
  const accentSoft = isAdminMode ? "rgba(238, 242, 255, 0.9)" : "rgba(240, 253, 250, 0.9)";

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onFileChange) {
      event.target.value = "";
      return;
    }

    await onFileChange(file);
    event.target.value = "";
  };

  return (
    <Fragment>
      <label htmlFor={id}>
        <Button
          size="small"
          component="span"
          disabled={disabled || loading}
          sx={{
            p: "6px",
            height: "auto",
            borderRadius: "50%",
            minWidth: 0,
            border: `1px solid ${accentBorder}`,
            bgcolor: accentSoft,
            ...style,
            ":hover": {
              backgroundColor: isAdminMode ? "#E0E7FF" : "#CCFBF1",
              borderColor: accentMain
            }
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: accentDark }} />
          ) : (
            <CameraAlt fontSize="small" sx={{ color: accentDark }} />
          )}
        </Button>
      </label>

      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
    </Fragment>
  );
}
