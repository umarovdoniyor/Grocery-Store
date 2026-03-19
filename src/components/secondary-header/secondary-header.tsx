import type { ComponentProps, PropsWithChildren } from "react";
import NavbarCategoryDropdown from "./category-dropdown";
import { StyledRoot, InnerContainer } from "./styles";

// =========================================================================
interface SecondaryHeaderProps extends ComponentProps<typeof StyledRoot> {}
// =========================================================================

export function SecondaryHeader({
  elevation = 2,
  border = 0,
  children,
  ...props
}: SecondaryHeaderProps) {
  return (
    <StyledRoot elevation={elevation} border={border} {...props}>
      <InnerContainer>{children}</InnerContainer>
    </StyledRoot>
  );
}

SecondaryHeader.Left = function ({ children }: PropsWithChildren) {
  return <NavbarCategoryDropdown>{children}</NavbarCategoryDropdown>;
};

SecondaryHeader.Right = function ({ children }: PropsWithChildren) {
  return <>{children}</>;
};
