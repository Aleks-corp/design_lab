import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { ButtonComponent } from "../common/components/button";
import { APP_KEYS } from "../common/consts";
import { FormComponent } from "../common/components/form";
import {
  BtnContainer,
  Input,
  Label,
  StyledForm,
  ErrorContainer,
} from "./auth.styled";
import { EmailSchema } from "../common/validation/email-schema";
import { initialEmailValues } from "../common/consts/init-value.const";
import { useForgotPassUser } from "./hooks/use-auth-user";
import { IUserRes } from "./types/user.type";

const ForgotPassPage = () => {
  const navigate = useNavigate();

  const {
    mutateAsync,
    isSuccess,
  }: {
    mutateAsync: (values: { email: string }) => Promise<IUserRes>;
    isSuccess: boolean;
  } = useForgotPassUser();

  const onSubmit = async (values: { email: string }) => {
    await mutateAsync(values);
  };

  return (
    <FormComponent>
      {isSuccess ? (
        <h2>Check email to set new password</h2>
      ) : (
        <>
          <h2>Enter your Email to set new password</h2>
          <Formik
            initialValues={initialEmailValues}
            onSubmit={onSubmit}
            validationSchema={EmailSchema}
          >
            {({ errors, touched }) => (
              <StyledForm>
                <Label htmlFor="email">
                  Email
                  <Input id="email" name="email" placeholder="Email" />
                  {errors.email && touched.email ? (
                    <ErrorContainer>{errors.email}</ErrorContainer>
                  ) : null}
                </Label>
                <BtnContainer>
                  <ButtonComponent
                    text="Back"
                    onClick={() => navigate(APP_KEYS.ROUTER_KEYS.HOME)}
                  />
                  <ButtonComponent typeSubmit text="Send" />
                </BtnContainer>
              </StyledForm>
            )}
          </Formik>
        </>
      )}
    </FormComponent>
  );
};

export default ForgotPassPage;
