import { useForm } from "react-hook-form";
import { ERROR_MESSAGES } from "../../../utils/constants";
import Button from "../../formElements/Button";
import ErrorMessage from "../../formElements/ErrorMessage";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import LabelInputWrapper from "../../formElements/LabelInputWrapper";
import NotificationLabel from "../../formElements/NotificationLabel";
import AuthPageLayout from "../layouts/AuthPageLayout";

export type SetNewPasswordInputs = {
  password: string;
};

type Props = {
  onLogin: () => void;
  onSetNewPassword: (newPassword: string) => void;
  errorMessage?: string;
};

const SetNewPasswordPage = ({
  onLogin,
  onSetNewPassword,
  errorMessage,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetNewPasswordInputs>({
    criteriaMode: "all",
  });

  const onSubmit = (data: SetNewPasswordInputs) => {
    onSetNewPassword(data.password);
  };

  return (
    <AuthPageLayout
      title="Set new password"
      secondaryChildren={
        <Button
          className="bg-mblue-500 bg-opacity-20 hover:bg-mblue-600       hover:bg-opacity-30"
          onClick={onLogin}
        >
          Back To Login
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3 p-5">
          <LabelInputWrapper>
            <Label required icon="password">
              Password
            </Label>
            <Input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: ERROR_MESSAGES.IS_REQUIRED,
                validate: {
                  minLength: (v) =>
                    v.length >= 6 || ERROR_MESSAGES.PASSWORD.MIN_LENGTH,
                },
              })}
            />
            <ErrorMessage fieldName="password" errors={errors} multipleErrors />
          </LabelInputWrapper>

          <Button variant="highlighted" type="submit">
            Set password
          </Button>

          {!!errorMessage?.length && (
            <NotificationLabel>{errorMessage}</NotificationLabel>
          )}
        </div>
      </form>
    </AuthPageLayout>
  );
};

export default SetNewPasswordPage;
