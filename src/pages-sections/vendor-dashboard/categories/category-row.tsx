import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
// MUI ICON COMPONENTS
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
// GLOBAL CUSTOM COMPONENT
import BazaarSwitch from "components/BazaarSwitch";
// STYLED COMPONENTS
import { StyledTableRow, CategoryWrapper, StyledTableCell, StyledIconButton } from "../styles";

// ========================================================================
interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentName: string;
  active: boolean;
}

type Props = {
  category: Category;
  isUpdating?: boolean;
  isRemoving?: boolean;
  onToggleStatus: (category: Category) => void;
  onRemoveCategory: (category: Category) => void;
};
// ========================================================================

export default function CategoryRow({
  category,
  isUpdating,
  isRemoving,
  onToggleStatus,
  onRemoveCategory
}: Props) {
  const { image, name, parentName, active, id, slug } = category;

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">#{id.split("-")[0]}</StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{name}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">{slug}</StyledTableCell>

      <StyledTableCell align="left">
        <Avatar variant="rounded">
          <img
            alt={name}
            src={image}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Avatar>
      </StyledTableCell>

      <StyledTableCell align="left">{parentName}</StyledTableCell>

      <StyledTableCell align="left">
        {isUpdating ? (
          <CircularProgress size={18} color="info" />
        ) : (
          <BazaarSwitch color="info" checked={active} onChange={() => onToggleStatus(category)} />
        )}
      </StyledTableCell>

      <StyledTableCell align="center">
        <Link href={`/admin/categories/${id}`}>
          <StyledIconButton>
            <Edit />
          </StyledIconButton>
        </Link>

        {isRemoving ? (
          <CircularProgress size={18} color="error" />
        ) : (
          <StyledIconButton onClick={() => onRemoveCategory(category)}>
            <Delete />
          </StyledIconButton>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
}
