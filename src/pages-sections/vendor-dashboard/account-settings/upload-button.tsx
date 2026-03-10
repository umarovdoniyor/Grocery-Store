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
          color="secondary"
          disabled={disabled || loading}
          sx={{
            p: "6px",
            height: "auto",
            borderRadius: "50%",
            bgcolor: "info.100",
            ...style,
            ":hover": { backgroundColor: "grey.300" }
          }}
        >
          {loading ? <CircularProgress size={16} /> : <CameraAlt fontSize="small" color="info" />}
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
