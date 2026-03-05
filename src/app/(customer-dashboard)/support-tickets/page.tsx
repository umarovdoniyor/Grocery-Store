import { Metadata } from "next";
import { TicketsPageView } from "pages-sections/customer-dashboard/support-tickets/page-view";
import { getCustomerTickets } from "utils/services/customer-dashboard";

export const metadata: Metadata = {
  title: "Support Tickets - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

// ==============================================================
interface Props {
  searchParams: Promise<{ page: string }>;
}
// ==============================================================

export default async function SupportTickets({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number.parseInt(page || "1", 10) || 1;
  const data = getCustomerTickets(currentPage);

  if (!data || data.tickets.length === 0) {
    return <div>Data not found</div>;
  }

  return <TicketsPageView tickets={data.tickets} totalPages={data.totalPages} />;
}
