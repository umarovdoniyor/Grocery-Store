import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
// LOCAL CUSTOM COMPONENT
import UploadButton from "./upload-button";

type Props = {
  avatarSrc: string;
  coverSrc: string;
  onAvatarUpload: (file: File) => void | Promise<void>;
  onCoverUpload: (file: File) => void | Promise<void>;
  uploadingAvatar?: boolean;
  uploadingCover?: boolean;
};

export default function CoverPicSection({
  avatarSrc,
  coverSrc,
  onAvatarUpload,
  onCoverUpload,
  uploadingAvatar = false,
  uploadingCover = false
}: Props) {
  return (
    <Box
      mb={3}
      height="173px"
      overflow="hidden"
      borderRadius="10px"
      position="relative"
      sx={{
        border: "1px solid #D1D5DB",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.2))",
          pointerEvents: "none"
        }
      }}
      style={{ background: `url(${coverSrc}) center/cover` }}
    >
      <Box position="absolute" bottom={20} left={24}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <UploadButton
              id="profile-image"
              style={{ bgcolor: "grey.300" }}
              onFileChange={onAvatarUpload}
              loading={uploadingAvatar}
            />
          }
        >
          <Avatar
            alt="user"
            src={avatarSrc}
            sx={{
              width: 80,
              height: 80,
              borderRadius: "10px",
              border: "4px solid",
              borderColor: "#F8FAFC"
            }}
          />
        </Badge>
      </Box>

      <Box position="absolute" top={20} right={20}>
        <UploadButton
          id="cover-image"
          onFileChange={onCoverUpload}
          loading={uploadingCover}
          style={{ bgcolor: "grey.100" }}
        />
      </Box>
    </Box>
  );
}
