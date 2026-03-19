import { PropsWithChildren, ReactNode } from "react";
// LOCAL CUSTOM COMPONENTS
import LogoWithTitle from "./components/logo-title";
import SocialButtons from "./components/social-buttons";
// GLOBAL CUSTOM COMPONENTS
import FlexRowCenter from "components/flex-box/flex-row-center";
// COMMON STYLED COMPONENT
import { Wrapper } from "./styles";

// ==============================================================
interface Props extends PropsWithChildren {
  bottomContent: ReactNode;
}
// ==============================================================

export default function AuthLayout({ children, bottomContent }: Props) {
  return (
    <FlexRowCenter
      flexDirection="column"
      minHeight="100vh"
      px={2}
      sx={{
        background: "#f9f7f0",
        backgroundImage: `
          radial-gradient(circle at 85% 15%, rgba(95, 125, 79, 0.14) 0%, transparent 40%),
          radial-gradient(circle at 15% 85%, rgba(159, 107, 68, 0.12) 0%, transparent 40%)
        `,
        position: "relative"
      }}
    >
      <Wrapper elevation={6}>
        <LogoWithTitle />

        {children}

        <SocialButtons />

        {/* RENDER BOTTOM CONTENT BASED ON CONDITION */}
        {bottomContent}
      </Wrapper>
    </FlexRowCenter>
  );
}
