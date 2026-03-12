"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
// CUSTOM DATA MODEL
import Payment from "models/Payment.model";

const validationSchema = yup.object().shape({
  name: yup.string().required("Profile name is required"),
  cvc: yup.string().required("Verification code is required"),
  card_no: yup.string().required("Reference ID is required"),
  exp: yup.string().required("Schedule field is required")
});

// ==============================================================
type Props = { payment: Payment };
// ==============================================================

export default function PaymentForm({ payment }: Props) {
  const initialValues = {
    exp: payment?.exp || "",
    cvc: payment?.cvc || "",
    card_no: payment?.card_no || "",
    name: payment?.payment_method || ""
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleSubmitForm = handleSubmit((values) => {
    alert(JSON.stringify(values, null, 2));
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="card_no" label="Reference ID" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="name" label="Profile Name" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="exp" label="Renewal Date" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="cvc" label="Verification Code" />
        </Grid>

        <Grid size={12}>
          <Button
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isSubmitting}
          >
            Save Demo Profile
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
