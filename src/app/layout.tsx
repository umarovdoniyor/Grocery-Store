import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const geist = Geist({
  subsets: ["latin"]
});

import "overlayscrollbars/overlayscrollbars.css";

// THEME PROVIDER
import ThemeProvider from "theme/theme-provider";

// PRODUCT CART PROVIDER
import CartProvider from "contexts/CartContext";

// SITE SETTINGS PROVIDER
import SettingsProvider from "contexts/SettingContext";

// AUTH PROVIDER
import { AuthProvider } from "contexts/AuthContext";

// GLOBAL CUSTOM COMPONENTS
import RTL from "components/rtl";
import ProgressBar from "components/progress";
import SnackbarProvider from "components/SnackbarProvider";

// IMPORT i18n SUPPORT FILE
import "i18n";

// ==============================================================
interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
// ==============================================================

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="body" className={geist.className}>
        <AuthProvider>
          <CartProvider>
            <SettingsProvider>
              <ThemeProvider>
                <SnackbarProvider>
                  <RTL>
                    {modal}
                    {children}
                  </RTL>

                  <ProgressBar />
                </SnackbarProvider>
              </ThemeProvider>
            </SettingsProvider>
          </CartProvider>
        </AuthProvider>

        <GoogleAnalytics gaId="G-XKPD36JXY0" />
      </body>
    </html>
  );
}
