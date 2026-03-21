import { ComponentProps } from "react";
import TopbarLeftTranslatedText from "./topbar-left-translated-text";
// STYLED COMPONENTS
import { LeftContent, RightContent, StyledChip, StyledContainer, StyledRoot } from "./styles";

// ===============================================================
interface TopbarProps extends ComponentProps<typeof StyledRoot> {}
// ===============================================================

export function Topbar({ bgColor, children, ...props }: TopbarProps) {
  return (
    <StyledRoot bgColor={bgColor} {...props}>
      <StyledContainer>{children}</StyledContainer>
    </StyledRoot>
  );
}

// ===================================================================
interface TopbarLeftProps extends ComponentProps<typeof LeftContent> {
  label: string;
  title: string;
}
// ===================================================================

Topbar.Left = function ({ label, title, children, ...props }: TopbarLeftProps) {
  return (
    <LeftContent {...props}>
      <div className="tag">
        <TopbarLeftTranslatedText label={label} title={title} />
      </div>
    </LeftContent>
  );
};

// ======================================================================
interface TopbarRightProps extends ComponentProps<typeof RightContent> {}
// ======================================================================

Topbar.Right = function ({ children, ...props }: TopbarRightProps) {
  return <RightContent {...props}>{children}</RightContent>;
};
