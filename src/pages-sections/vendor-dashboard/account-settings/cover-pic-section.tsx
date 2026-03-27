import React from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
// LOCAL CUSTOM COMPONENT
import UploadButton from "./upload-button";

type Props = {
  uiMode?: "vendor" | "admin";
  avatarSrc: string;
  coverSrc: string;
  onAvatarUpload: (file: File) => void | Promise<void>;
  onCoverUpload: (file: File) => void | Promise<void>;
  uploadingAvatar?: boolean;
  uploadingCover?: boolean;
};

export default function CoverPicSection({
  uiMode = "vendor",
  avatarSrc,
  coverSrc,
  onAvatarUpload,
  onCoverUpload,
  uploadingAvatar = false,
  uploadingCover = false
}: Props) {
  const isAdminMode = uiMode === "admin";

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
              uiMode={uiMode}
              style={{ bgcolor: "grey.300" }}
              onFileChange={onAvatarUpload}
              loading={uploadingAvatar}
            />
          }
        >
          <Avatar
            alt="user"
            src={avatarSrc}
            slotProps={{
              img: {
                onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/faces/propic(9).png";
                }
              }
            }}
            sx={{
              width: 80,
              height: 80,
              borderRadius: "10px",
              border: "4px solid",
              borderColor: isAdminMode ? "#EEF2FF" : "#F8FAFC"
            }}
          />
        </Badge>
      </Box>

      <Box position="absolute" top={20} right={20}>
        <UploadButton
          id="cover-image"
          uiMode={uiMode}
          onFileChange={onCoverUpload}
          loading={uploadingCover}
          style={{ bgcolor: "grey.100" }}
        />
      </Box>
    </Box>
  );
}
