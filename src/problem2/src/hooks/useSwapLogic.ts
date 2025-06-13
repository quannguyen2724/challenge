import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

import tokenApi from "../apis/token.api";
import type { Token } from "../types/token.type";

const schema = yup
  .object({
    amountFrom: yup
      .number()
      .typeError("Please enter a valid amount.")
      .required("Please enter an amount.")
      .positive("Amount must be greater than 0"),
  })
  .required();

export type FormValues = {
  amountFrom: number;
};

export const useSwapLogic = () => {
  const [fromToken, setFromToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: prices, isLoading: isLoadingPrices } = useQuery({
    queryKey: ["prices"],
    queryFn: () => tokenApi.getPrices(),
  });

  const tokenMap = useMemo(() => {
    if (!prices) return new Map<string, Token>();
    return new Map(prices.map((token) => [token.currency, token]));
  }, [prices]);

  const tokenSymbols = useMemo(() => Array.from(tokenMap.keys()), [tokenMap]);

  useEffect(() => {
    if (!fromToken && !toToken && tokenSymbols.length > 1) {
      setFromToken(tokenSymbols[0]);
      setToToken(tokenSymbols[1]);
    }
  }, [tokenSymbols, fromToken, toToken]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors: formErrors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { amountFrom: 0 },
  });

  const amountFrom = watch("amountFrom");

  const calculatedAmountTo = useMemo(() => {
    if (!fromToken || !toToken || !amountFrom) return "";
    const fromPrice = tokenMap.get(fromToken)?.price;
    const toPrice = tokenMap.get(toToken)?.price;
    if (!fromPrice || !toPrice || toPrice === 0) return "";

    const value = (Number(amountFrom) * fromPrice) / toPrice;
    return value > 0 ? value.toFixed(6) : "";
  }, [amountFrom, fromToken, toToken, tokenMap]);

  const handleSwapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;
    setFromToken(toToken);
    setToToken(fromToken);
    setValue("amountFrom", Number(calculatedAmountTo) || 0);
  }, [fromToken, toToken, calculatedAmountTo, setValue]);

  const handleSelectToken = useCallback(
    (type: "from" | "to", symbol: string) => {
      const otherToken = type === "from" ? toToken : fromToken;
      if (symbol === otherToken) {
        return;
      }

      if (type === "from") {
        setFromToken(symbol);
      } else {
        setToToken(symbol);
      }
    },
    [fromToken, toToken]
  );

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (!fromToken || !toToken) return;

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success(
          `Successfully swapped ${data.amountFrom} ${fromToken} to ${calculatedAmountTo} ${toToken}!`
        );
        reset({ amountFrom: 0 });
      }, 1500);
    },
    [fromToken, toToken, calculatedAmountTo, reset]
  );

  const isSwapDisabled =
    isSubmitting ||
    isLoadingPrices ||
    !fromToken ||
    !toToken ||
    fromToken === toToken ||
    !amountFrom ||
    Number(amountFrom) <= 0;

  return {
    form: {
      control,
      handleSubmit: handleSubmit(onSubmit),
      errors: formErrors,
    },
    state: {
      fromToken,
      toToken,
      calculatedAmountTo,
      isSubmitting,
      isLoadingPrices,
      isSwapDisabled,
      tokenSymbols,
    },
    handlers: {
      handleSwapTokens,
      handleSelectToken,
    },
  };
};
