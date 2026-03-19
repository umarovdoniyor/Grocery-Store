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

const inputSx = {
  backgroundColor: "#FAF6EF",
  borderRadius: "4px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(43, 38, 34, 0.2)"
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(43, 38, 34, 0.4)"
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#A44A3F",
    borderWidth: "1px"
  }
};

const labelSx = {
  "& .MuiInputLabel-root": {
    color: "#8B6A4A",
    fontWeight: 600,
    fontSize: "0.875rem",
    zIndex: 1
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#A44A3F"
  }
};

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
          <TextField
            size="medium"
            fullWidth
            name="card_no"
            label="Reference ID"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            size="medium"
            fullWidth
            name="name"
            label="Profile Name"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            size="medium"
            fullWidth
            name="exp"
            label="Renewal Date"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField
            size="medium"
            fullWidth
            name="cvc"
            label="Verification Code"
            slotProps={{ input: { sx: inputSx } }}
            sx={labelSx}
          />
        </Grid>

        <Grid size={12}>
          <Button
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{
              backgroundColor: "#2B2622",
              color: "#F4EEE3",
              borderRadius: "4px",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.02em",
              px: 4,
              boxShadow: "3px 3px 0px #A44A3F",
              transition: "background-color 180ms ease, box-shadow 180ms ease",
              "&:hover": {
                backgroundColor: "#A44A3F",
                boxShadow: "3px 3px 0px #2B2622"
              }
            }}
          >
            Save Demo Profile
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
