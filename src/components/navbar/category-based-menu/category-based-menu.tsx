import { useEffect, useRef, useState } from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
// CUSTOM COMPONENTS
import { SubChildList } from "./sub-child-list";
// ICON COMPONENTS
import ChevronRight from "icons/ChevronRight";
// DATA TYPES
import { CategoryMenuItem } from "models/Navigation.model";
// STYLED COMPONENTS
import { Wrapper, StyledCard, CategoryList, MenusContainer, CategoryListItem } from "./styles";

// ===============================================================
interface Props {
  title: string;
  menuList: CategoryMenuItem[];
}
// ===============================================================

export function CategoryBasedMenu({ title, menuList }: Props) {
  const [selected, setSelected] = useState(menuList[0].title);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const list = menuList.reduce<string[]>((prev, curr) => [...prev, curr.title], []);
  const childList = menuList.find((item) => item.title === selected);

  useEffect(() => {
    const handleScroll = () => setOpen(false);

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Wrapper ref={rootRef} active={open ? 1 : 0}>
      <div
        className="menu-title"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        {title} <KeyboardArrowDown className="icon" />
      </div>

      <MenusContainer className="menu-list" sx={{ display: open ? "block" : "none" }}>
        <StyledCard>
          {/* MAIN CATEGORIES SECTION */}
          <CategoryList>
            {list.map((name) => (
              <CategoryListItem
                key={name}
                active={selected === name}
                onMouseEnter={() => setSelected(name)}
              >
                <span>{name}</span>
                <ChevronRight fontSize="small" className="icon" />
              </CategoryListItem>
            ))}
          </CategoryList>

          {/* SUB / CHILD CATEGORIES SECTION */}
          <SubChildList subChildren={childList!} />
        </StyledCard>
      </MenusContainer>
    </Wrapper>
  );
}
