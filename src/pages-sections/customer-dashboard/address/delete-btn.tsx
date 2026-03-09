import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Trash from "icons/Trash";

export default function DeleteAddressBtn({ id }: { id: string }) {
  return (
    <Tooltip title="Delete address is not available yet">
      {/* span keeps tooltip active for disabled button */}
      <span>
        <IconButton aria-label={`Delete address ${id}`} disabled>
          <Trash fontSize="small" color="error" />
        </IconButton>
      </span>
    </Tooltip>
  );
}
