import { useForm } from "react-hook-form";
import { ERROR_MESSAGES } from "../../../utils/constants";
import {
  convertStringsToDate,
  dateAsStringIsTodayOrLater,
} from "../../../utils/functions";
import Button from "../../formElements/Button";
import ErrorMessage from "../../formElements/ErrorMessage";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import LabelInputWrapper from "../../formElements/LabelInputWrapper";
import Textarea from "../../formElements/Textarea";
import SubPageLayout from "../layouts/SubPageLayout";

export type MeetingDataInputs = {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
};

type Props = {
  meetingData?: MeetingDataInputs;
  buttonText: string;
  onNext: (meetingData: MeetingDataInputs) => void;
  onClose: () => void;
};

const NewMeetingPage = ({
  meetingData,
  buttonText,
  onNext,
  onClose,
}: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MeetingDataInputs>({
    criteriaMode: "all",
    defaultValues: {
      title: meetingData?.title,
      startDate: meetingData?.startDate,
      startTime: meetingData?.startTime,
      endDate: meetingData?.endDate,
      endTime: meetingData?.endTime,
      location: meetingData?.location,
      description: meetingData?.description,
    },
  });

  const onSubmit = (data: MeetingDataInputs) => {
    onNext(data);
  };
  const { startDate, startTime, endDate } = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SubPageLayout title="Create Meeting" onClose={onClose}>
        <div className="space-y-3 pb-3">
          <LabelInputWrapper>
            <Label required>Meeting title</Label>
            <Input
              placeholder="Meeting title"
              {...register("title", {
                required: ERROR_MESSAGES.IS_REQUIRED,
              })}
            />
            <ErrorMessage errors={errors} fieldName="title" />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <div className="w-full flex space-y-0 space-x-3 justify-between">
              <span className="w-full space-y-1">
                <Label required icon="date">
                  Start Date
                </Label>
                <Input
                  type="date"
                  {...register("startDate", {
                    required: ERROR_MESSAGES.START_DATE.IS_REQUIRED,
                    validate: {
                      notInPast: (v) =>
                        dateAsStringIsTodayOrLater(v) ||
                        ERROR_MESSAGES.START_DATE.NOT_IN_PAST,
                    },
                  })}
                />
              </span>
              <span className="w-full space-y-1">
                <Label required icon="time">
                  Start time
                </Label>
                <Input
                  type="time"
                  {...register("startTime", {
                    required: ERROR_MESSAGES.START_TIME.IS_REQUIRED,
                    validate: {
                      notInThePast: (v) =>
                        convertStringsToDate(startDate, v) > new Date() ||
                        ERROR_MESSAGES.START_TIME.NOT_IN_PAST,
                    },
                  })}
                />
              </span>
            </div>
            <ErrorMessage
              errors={errors}
              fieldName="startDate"
              multipleErrors
            />
            <ErrorMessage
              errors={errors}
              fieldName="startTime"
              multipleErrors
            />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <div className="w-full flex space-y-0 space-x-3 justify-between">
              <span className="w-full space-y-1">
                <Label required icon="date">
                  End Date
                </Label>
                <Input
                  type="date"
                  {...register("endDate", {
                    required: ERROR_MESSAGES.END_TIME.IS_REQUIRED,
                    validate: {
                      notInPast: (v) =>
                        dateAsStringIsTodayOrLater(v) ||
                        ERROR_MESSAGES.END_DATE.NOT_IN_PAST,
                    },
                  })}
                />
              </span>
              <span className="w-full space-y-1">
                <Label required icon="time">
                  End time
                </Label>
                <Input
                  type="time"
                  {...register("endTime", {
                    required: ERROR_MESSAGES.END_TIME.IS_REQUIRED,
                    validate: {
                      notInThePast: (endTime) =>
                        convertStringsToDate(endDate, endTime) >
                          convertStringsToDate(startDate, startTime) ||
                        ERROR_MESSAGES.END_TIME.NOT_IN_PAST,
                    },
                  })}
                />
              </span>
            </div>
            <ErrorMessage errors={errors} fieldName="endDate" multipleErrors />
            <ErrorMessage errors={errors} fieldName="endTime" multipleErrors />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>Meeting location</Label>
            <Input placeholder="e.g. meeting room" {...register("location")} />
          </LabelInputWrapper>
          <LabelInputWrapper>
            <Label>Short description</Label>
            <Textarea
              placeholder="Meeting description"
              {...register("description")}
            />
          </LabelInputWrapper>
        </div>
        <div>
          <Button variant="highlighted" type="submit">
            {buttonText}
          </Button>
        </div>
      </SubPageLayout>
    </form>
  );
};

export default NewMeetingPage;
