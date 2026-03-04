import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  loading?: boolean;
  error?: string | null;
  emptyText?: string;
};

export default function AsyncState({ loading, error, emptyText }: Props) {
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight={320}>
        <CircularProgress color="info" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight={320}>
        <Typography color="error.main">{error}</Typography>
      </Stack>
    );
  }

  if (emptyText) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight={320}>
        <Typography color="text.secondary">{emptyText}</Typography>
      </Stack>
    );
  }

  return null;
}
