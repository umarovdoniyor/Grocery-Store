"use client";

import { useEffect, useRef } from "react";
import { recordView } from "../../libs/product";
import { useAuth } from "contexts/AuthContext";

interface Props {
  productId: string;
}

export default function ProductViewRecorder({ productId }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const recorded = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !productId || recorded.current) return;
    recorded.current = true;
    recordView({ viewGroup: "PRODUCT", viewRefId: productId });
  }, [isAuthenticated, isLoading, productId]);

  return null;
}
