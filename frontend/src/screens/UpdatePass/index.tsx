import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonComponent } from "../common/components/button";

import {
  BtnContainer,
  StyledForm,
  Input,
  Label,
  ErrorContainer,
  ErrorText,
} from "../todos/components/modal-user-profile/modal-user-profile.styled";
import { useSetNewPasswordUser } from "./hooks/use-auth-user";
import { initialSetNewPassValues } from "../common/consts/init-value.const";
import { SetNewPassSchema } from "../common/validation/change-pass-schema";
import { SetNewPassFormValues } from "../common/types/change-pass-form.type";
import { APP_KEYS } from "../common/consts";
import { FormComponent } from "../common/components/form";

interface ISetNewPass {
  password: string;
  token: string;
}

export const SetPassPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [error, setError] = useState("");

  const {
    mutateAsync,
  }: { mutateAsync: (data: ISetNewPass) => Promise<boolean> } =
    useSetNewPasswordUser();

  const onSubmit = async (values: SetNewPassFormValues) => {
    const { newPassword, confirmNewPassword } = values;
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password not match");
      return;
    }
    const data = { password: newPassword, token: token || "" };
    const change = await mutateAsync(data);
    if (change) {
      navigate(APP_KEYS.ROUTER_KEYS.LOGIN);
    }
  };
  return (
    <FormComponent>
      <h2>Set new password</h2>
      {error && <ErrorText>{error}</ErrorText>}
      <Formik
        initialValues={initialSetNewPassValues}
        onSubmit={onSubmit}
        validationSchema={SetNewPassSchema}
      >
        {({ errors, touched }) => (
          <StyledForm>
            <Label htmlFor="newPassword">
              New password
              <Input
                id="newPassword"
                name="newPassword"
                placeholder="Please enter new password"
                type="password"
              />
              {errors.newPassword && touched.newPassword ? (
                <ErrorContainer>{errors.newPassword}</ErrorContainer>
              ) : null}
            </Label>
            <Label htmlFor="confirmNewPassword">
              Confirm new password
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="Please confirm new password"
                type="password"
              />
              {errors.confirmNewPassword && touched.confirmNewPassword ? (
                <ErrorContainer>{errors.confirmNewPassword}</ErrorContainer>
              ) : null}
            </Label>
            <BtnContainer>
              <ButtonComponent typeSubmit text="Submit" />
            </BtnContainer>
          </StyledForm>
        )}
      </Formik>
    </FormComponent>
  );
};
