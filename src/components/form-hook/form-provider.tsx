import type { PropsWithChildren } from "react";
import { FieldValues, FormProvider as ReactHookFormProvider, UseFormReturn } from "react-hook-form";

// ==============================================================
interface Props<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined
> extends PropsWithChildren {
  methods: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
// ==============================================================

export default function FormProvider<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined
>({ children, methods, onSubmit }: Props<TFieldValues, TContext, TTransformedValues>) {
  return (
    <ReactHookFormProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </ReactHookFormProvider>
  );
}
