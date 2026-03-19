import { ChangeEvent, Fragment } from "react";
import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";
import CameraAlt from "@mui/icons-material/CameraAlt";
import CircularProgress from "@mui/material/CircularProgress";

// ==============================================================
type Props = {
  id: string;
  style?: SxProps<Theme>;
  onFileChange?: (file: File) => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
};
// ==============================================================

export default function UploadButton({
  id,
  style = {},
  onFileChange,
  disabled = false,
  loading = false
}: Props) {
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
            border: "1px solid #99F6E4",
            bgcolor: "rgba(240, 253, 250, 0.9)",
            ...style,
            ":hover": {
              backgroundColor: "#CCFBF1",
              borderColor: "#14B8A6"
            }
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: "#0F766E" }} />
          ) : (
            <CameraAlt fontSize="small" sx={{ color: "#0F766E" }} />
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
