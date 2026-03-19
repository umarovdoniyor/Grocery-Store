"use client";

import dynamic from "next/dynamic";
import Modal from "@mui/material/Modal";
// STYLED COMPONENTS
import { ModalWrapper } from "./styles";
// STORIES INTERFACES
import type { ReactInstaStoriesProps } from "react-insta-stories/dist/interfaces";

// Lazy-load the heavy stories player — only fetched when the modal opens
const Stories = dynamic(() => import("react-insta-stories"), { ssr: false });

// ==============================================================
interface Props extends ReactInstaStoriesProps {
  open: boolean;
  handleClose: () => void;
}
// ==============================================================

export default function StoryViewer({
  open,
  stories,
  handleClose,
  currentIndex,
  width = 360,
  height = 640,
  defaultInterval = 5000
}: Props) {
  return (
    <Modal open={open} onClose={handleClose}>
      <ModalWrapper>
        <Stories
          width={width}
          height={height}
          stories={stories}
          currentIndex={currentIndex}
          onAllStoriesEnd={handleClose}
          defaultInterval={defaultInterval}
          progressStyles={{ height: 3, borderRadius: 10 }}
          progressWrapperStyles={{ height: 3, borderRadius: 10, background: "#373F50" }}
        />
      </ModalWrapper>
    </Modal>
  );
}
