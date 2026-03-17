import Link from "next/link";
import Button from "@mui/material/Button";
// STYLED COMPONENT
import { SectionContainer } from "./styles";

export default function Section1() {
  const categoryLinks = [
    { label: "Seasonal Fruits", href: "/products/search?keyword=fruits" },
    { label: "Garden Vegetables", href: "/products/search?keyword=vegetables" },
    { label: "Dairy & Breakfast", href: "/products/search?keyword=dairy" },
    { label: "Healthy Pantry", href: "/products/search?keyword=organic" }
  ];

  return (
    <SectionContainer>
      <h1>Fresh groceries at your doorstep in 30 minutes</h1>
      <p className="heroSubTitle">
        Curated produce, pantry staples, and everyday essentials from trusted local vendors.
      </p>

      <div className="heroActions">
        <Link href="/products">
          <Button className="heroPrimaryBtn" disableElevation variant="contained">
            Start Shopping
          </Button>
        </Link>

        <div className="quickLinks">
          {categoryLinks.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button className="quickChip" disableElevation variant="text">
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
