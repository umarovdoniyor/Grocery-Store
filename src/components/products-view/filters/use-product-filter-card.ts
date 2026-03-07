import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";

export default function useProductFilterCard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(true);
  const [prices, setPrices] = useState<number[]>(
    JSON.parse(searchParams.get("prices") || "[0, 300]")
  );

  const rating = useMemo<number>(
    () => JSON.parse(searchParams.get("rating") || "0"),
    [searchParams]
  );

  const colors = useMemo<string[]>(
    () => JSON.parse(searchParams.get("colors") || "[]"),
    [searchParams]
  );

  const sales = useMemo<string[]>(
    () => JSON.parse(searchParams.get("sales") || "[]"),
    [searchParams]
  );

  const brands = useMemo<string[]>(
    () => JSON.parse(searchParams.get("brands") || "[]"),
    [searchParams]
  );

  const handleChangeSearchParams = useCallback(
    (key: string, value: string) => {
      if (!key) return;
      const params = new URLSearchParams(searchParams);

      if (value) params.set(key, value);
      else params.delete(key);

      params.delete("page");

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleToggleSearchParam = useCallback(
    (key: string, value: string) => {
      if (!key || !value) return;
      const currentValue = searchParams.get(key) ?? "";
      handleChangeSearchParams(key, currentValue === value ? "" : value);
    },
    [handleChangeSearchParams, searchParams]
  );

  const debouncedChangePrice = debounce((values: number[]) => {
    handleChangeSearchParams("prices", JSON.stringify(values));
  }, 500);

  const handleChangePrice = useCallback(
    (values: number[]) => {
      setPrices(values);
      debouncedChangePrice(values);
    },
    [debouncedChangePrice]
  );

  const handleChangeColor = (value: string) => {
    const values = colors.includes(value)
      ? colors.filter((item) => item !== value)
      : [...colors, value];

    handleChangeSearchParams("colors", JSON.stringify(values));
  };

  const handleChangeBrand = (value: string) => {
    const values = brands.includes(value)
      ? brands.filter((item) => item !== value)
      : [...brands, value];

    handleChangeSearchParams("brands", JSON.stringify(values));
  };

  const handleChangeSales = (value: string) => {
    const values = sales.includes(value)
      ? sales.filter((item) => item !== value)
      : [...sales, value];

    handleChangeSearchParams("sales", JSON.stringify(values));
  };

  return {
    sales,
    brands,
    rating,
    colors,
    prices,
    collapsed,
    setCollapsed,
    handleChangePrice,
    handleChangeColor,
    handleChangeBrand,
    handleChangeSales,
    handleChangeSearchParams,
    handleToggleSearchParam
  };
}
