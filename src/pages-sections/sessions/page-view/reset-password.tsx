"use client";

import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
import FlexRowCenter from "components/flex-box/flex-row-center";
// LOCAL CUSTOM COMPONENT
import BoxLink from "../components/box-link";

// FORM FIELD VALIDATION SCHEMA
const validationSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("Email is required")
});

export default function ResetPassword() {
  const methods = useForm({
    defaultValues: { email: "" },
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
    <Fragment>
      <Typography
        variant="h3"
        fontWeight={700}
        sx={{
          mb: 4,
          textAlign: "center",
          color: "#446127"
        }}
      >
        Reset your password
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        <Stack spacing={3}>
          <div>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#446127",
                letterSpacing: "0.2px"
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              size="medium"
              placeholder="example@mail.com"
              slotProps={{
                input: {
                  sx: {
                    borderRadius: "10px",
                    backgroundColor: "#f8f6ec",
                    border: "1px solid rgba(79, 109, 47, 0.15)",
                    transition: "all 220ms ease",
                    "&:focus-within": {
                      borderColor: "#4f6d2f",
                      backgroundColor: "#fefdf9",
                      boxShadow: "0 0 0 3px rgba(79, 109, 47, 0.08)"
                    },
                    "&.Mui-error": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(79, 109, 47, 0.35)"
                      }
                    }
                  }
                }
              }}
            />
          </div>

          <Button
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            loading={isSubmitting}
            sx={{
              background: "linear-gradient(135deg, #4f6d2f 0%, #5a7a30 100%)",
              borderRadius: "10px",
              fontWeight: 600,
              letterSpacing: "0.3px",
              textTransform: "none",
              boxShadow: "0 6px 20px rgba(79, 109, 47, 0.25)",
              transition: "all 220ms ease",
              "&:hover": {
                background: "linear-gradient(135deg, #446127 0%, #4f6d2f 100%)",
                boxShadow: "0 8px 28px rgba(79, 109, 47, 0.35)"
              }
            }}
          >
            Reset
          </Button>
        </Stack>
      </FormProvider>

      <FlexRowCenter mt={3} justifyContent="center" gap={1}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          Don&apos;t have an account?
        </Typography>

        <BoxLink title="Register" href="/register" />
      </FlexRowCenter>
    </Fragment>
  );
}
