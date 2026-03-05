import { Metadata } from "next";
import ProfileEditClient from "./profile-edit-client";

export const metadata: Metadata = {
  title: "Edit Profile - Bazaar Next.js E-commerce Template",
  description: "Bazaar is a React Next.js E-commerce template.",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default function ProfileEdit() {
  return <ProfileEditClient />;
}
