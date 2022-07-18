import QRCode from "react-qr-code";
import {
  formatMeetingDate,
  formatMeetingTime,
} from "../../../utils/formatting";
import { isTheSameDay } from "../../../utils/functions";
import { Meeting, MeetingParticipant } from "../../../utils/types";
import Accordion from "../../Accordion/Accordion";
import DetailsLine from "../../MeetingDetails/DetailsLine";
import SubPageLayout from "../layouts/SubPageLayout";

type Props = {
  meeting: Meeting;
  meetingCreator: MeetingParticipant;
  onClose: () => void;
};

const MeetingInfo = ({ meeting, meetingCreator, onClose }: Props) => {
  return (
    <SubPageLayout title={meeting.title} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Meeting ID</p>
          <p className="text-2xl font-bold">{meeting.id}</p>
        </div>
        <div>
          <QRCode value={meeting.id} size={200} bgColor="#E5E7EB" />
          {/* TODO: Color change? */}
        </div>
        <Accordion title="General info">
          <div className="p-2 space-y-1 bg-white rounded-xl">
            {isTheSameDay(meeting.startDate, meeting.endDate) ? (
              <>
                <DetailsLine symbol="date">
                  {formatMeetingDate(meeting.startDate)}
                </DetailsLine>
                <DetailsLine symbol="time">
                  {formatMeetingTime(meeting.startDate, meeting.endDate)}
                </DetailsLine>
              </>
            ) : (
              <>
                <DetailsLine symbol="date">
                  {`from ${formatMeetingDate(meeting.startDate)}`}
                </DetailsLine>
                <DetailsLine symbol="time">
                  {meeting.startDate.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DetailsLine>
                <DetailsLine symbol="date">
                  {`to ${formatMeetingDate(meeting.endDate)}`}
                </DetailsLine>
                <DetailsLine symbol="time">
                  {meeting.endDate.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DetailsLine>
              </>
            )}
            {meeting.location && (
              <DetailsLine symbol="location">{meeting.location}</DetailsLine>
            )}
            <DetailsLine symbol="author">
              <p>
                {`Created by ${
                  meetingCreator.name
                    ? meetingCreator.name
                    : `user with email address ${meetingCreator.email}`
                }`}
              </p>
              {meetingCreator.name && (
                <p className="text-xs text-gray-500">
                  ({meetingCreator.email})
                </p>
              )}
            </DetailsLine>
          </div>
        </Accordion>
        {meeting.description && (
          <Accordion title="Description">
            <div className="w-full rounded-xl p-3 bg-white space-y-1">
              <p className="text-xs">{meeting.description}</p>
            </div>
          </Accordion>
        )}
      </div>
    </SubPageLayout>
  );
};

export default MeetingInfo;
