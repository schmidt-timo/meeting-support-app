import { useEffect, useRef, useState } from "react";
import {
  MdInfo,
  MdOpenInNew,
  MdOutlineClose,
  MdPeople,
  MdQuestionAnswer,
} from "react-icons/md";
import QRCode from "react-qr-code";
import { useAuth } from "../../../lib/auth";
import {
  changeMeetingQuestionAnsweredStatus,
  createMeetingQuestion,
  upvoteMeetingQuestion,
} from "../../../lib/supabase/meeting";
import {
  filterAnsweredQuestions,
  filterOpenQuestions,
} from "../../../utils/filtering";
import {
  Meeting,
  MeetingAgendaItem,
  MeetingAgendaStatus,
  MeetingNote,
  MeetingParticipant,
  MeetingQuestion,
} from "../../../utils/types";
import Button from "../../formElements/Button";
import Label from "../../formElements/Label";
import NotificationLabel from "../../formElements/NotificationLabel";
import AgendaController from "../../meetingElements/AgendaController";
import MeetingCounter from "../../meetingElements/MeetingCounter";
import MeetingNotes from "../../meetingElements/MeetingNotes";
import { DatabaseSyncStatus } from "../../meetingElements/NoteSyncStatusBar";
import SharedNotes from "../../meetingElements/SharedNotes";
import QuestionItemDesktop from "../../QuestionItem/QuestionItemDesktop";
import QuestionItemInput from "../../QuestionItem/QuestionItemInput";
import PresentationView from "./PresentationView";

type MeetingViewPageProps = {
  meeting: Meeting;
  onShowInfo: () => void;
  onExitMeeting: () => void;
  agendaItems: MeetingAgendaItem[];
  agendaStatus: MeetingAgendaStatus;
  onShowFullAgenda: () => void;
  onAgendaItemChange: (newIndex: number) => Promise<void>;
  onPresentationPageChange: (pageNumber: number) => Promise<void>;
  onMeetingNoteChange: (newText: string) => Promise<MeetingNote>;
  onSharedNotesChange: (newText: string) => Promise<MeetingNote>;
  meetingNote: MeetingNote;
  sharedNotes: MeetingNote;
  databaseStatus: DatabaseSyncStatus;
  setDatabaseStatus: (status: DatabaseSyncStatus) => void;
  sharedNotesDatabaseStatus: DatabaseSyncStatus;
  setSharedNotesDatabaseStatus: (status: DatabaseSyncStatus) => void;
  onManageParticipants: () => void;
  onManageQuestions: () => void;
  meetingQuestions: MeetingQuestion[];
  participants: MeetingParticipant[];
  onAlarm: () => void;
};

const MeetingViewPageDesktop = ({
  meeting,
  onShowInfo,
  onExitMeeting,
  agendaItems,
  agendaStatus,
  onShowFullAgenda,
  onAgendaItemChange,
  onPresentationPageChange,
  onMeetingNoteChange,
  onSharedNotesChange,
  meetingNote,
  sharedNotes,
  databaseStatus,
  setDatabaseStatus,
  sharedNotesDatabaseStatus,
  setSharedNotesDatabaseStatus,
  onManageParticipants,
  onManageQuestions,
  meetingQuestions,
  participants,
  onAlarm,
}: MeetingViewPageProps) => {
  const [showSharedNotes, setShowSharedNotes] = useState(false);
  const [showQuestionsButton, setShowQuestionsButton] = useState(false);

  const { user } = useAuth();

  const questionRef = useRef<HTMLDivElement>(null);

  const handleQuestionArea = () => {
    if (questionRef.current) {
      console.log(questionRef.current.clientHeight);
      if (questionRef.current.clientHeight < 165) {
        setShowQuestionsButton(true);
      } else {
        setShowQuestionsButton(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleQuestionArea();
    }, 100);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleQuestionArea);

    return () => window.removeEventListener("resize", handleQuestionArea);
  });

  // filter questions
  const openQuestions = filterOpenQuestions(meetingQuestions);
  const answeredQuestions = filterAnsweredQuestions(meetingQuestions);

  return (
    <div className="w-full h-meetingviewDesktop">
      <div className="w-full py-4 px-10 flex items-center justify-between bg-white flex-shrink-0">
        <span className="w-full truncate pr-2 text-mblue-500">
          <h1 className="font-bold text-base truncate">{meeting.title}</h1>
          <MeetingCounter
            startDate={meeting.startDate}
            endDate={meeting.endDate}
            onReachingEndTime={onAlarm}
          />
        </span>
        <span className="w-full space-x-3 flex items-center justify-end">
          <button
            onClick={onManageParticipants}
            className="rounded-xl bg-mblue-500 hover:bg-mblue-600 text-white flex items-center justify-center flex-shrink-0 py-1.5 px-3 text-xs space-x-1.5"
          >
            <MdPeople className="w-5 h-5" />
            <p>{participants.length} Participants</p>
          </button>
          <button
            className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0"
            onClick={onExitMeeting}
          >
            <MdOutlineClose className="w-8 h-8" />
          </button>
        </span>
      </div>

      <div className="w-full h-full flex px-10 space-x-5">
        <div className="w-2/3 space-y-5 flex flex-col justify-between">
          {!!agendaItems.length && (
            <PresentationView
              isDesktop
              agendaStatus={agendaStatus}
              agendaItem={agendaItems[agendaStatus.currentItemIndex]}
              meetingTimer={{
                start: meeting.startDate,
                end: meeting.endDate,
              }}
              onPresentationPageChange={onPresentationPageChange}
            />
          )}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between space-x-1">
              <button
                onClick={() => setShowSharedNotes(false)}
                className={`rounded-l-xl w-full py-1 flex items-center space-x-1.5 justify-center text-xs ${
                  !showSharedNotes
                    ? "bg-mblue-500 text-white"
                    : "bg-mblue-100 text-mblue-500"
                }`}
              >
                <p className="text-xs font-medium">Your Notes</p>
                <p className="text-extrasmall">(only visible to you)</p>
              </button>
              <button
                onClick={() => setShowSharedNotes(true)}
                className={`rounded-r-xl w-full py-1 flex items-center space-x-1.5 justify-center text-xs ${
                  showSharedNotes
                    ? "bg-mblue-500 text-white"
                    : "bg-mblue-100 text-mblue-500"
                }`}
              >
                <p className="text-xs font-medium">Shared Notes</p>
                <p className="text-extrasmall">(visible to everyone)</p>
              </button>
            </div>
            {showSharedNotes && (
              <SharedNotes
                meetingNote={sharedNotes}
                onChangeNote={onSharedNotesChange}
                databaseStatus={sharedNotesDatabaseStatus}
                setDatabaseStatus={setSharedNotesDatabaseStatus}
              />
            )}
            {!showSharedNotes && (
              <MeetingNotes
                meetingNote={meetingNote}
                onChangeNote={onMeetingNoteChange}
                databaseStatus={databaseStatus}
                setDatabaseStatus={setDatabaseStatus}
              />
            )}
            <div className="h-8 flex-shrink-0" />
          </div>
        </div>

        <div className="w-1/3 space-y-5 h-full flex flex-col">
          <div className="w-full">
            <div className="bg-mblue-500 text-white rounded-xl p-4">
              <div className="w-full truncate flex justify-between">
                <span className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs">Meeting ID</p>
                    <h1 className="font-bold text-base tracking-wider pr-2">
                      {meeting.id}
                    </h1>
                  </div>
                  <button
                    onClick={onShowInfo}
                    className="rounded-xl bg-white hover:bg-mblue-200 text-mblue-500 flex items-center justify-center flex-shrink-0 py-1.5 text-xs space-x-1.5"
                    style={{ width: "7rem" }}
                  >
                    <MdInfo className="w-4 h-4" />
                    <p>More info</p>
                  </button>
                </span>

                <span className="bg-white p-3 rounded-xl">
                  <QRCode value={meeting.id} size={100} />
                </span>
              </div>
            </div>
          </div>
          <div className="w-full">
            {!!agendaItems.length ? (
              <AgendaController
                agendaStatus={agendaStatus!}
                agendaItems={agendaItems}
                onShowFullAgenda={onShowFullAgenda}
                onAgendaItemChange={onAgendaItemChange}
              />
            ) : (
              <div className="border border-mblue-500 bg-mblue-100 rounded-xl">
                <div className="w-full bg-mblue-500 rounded-t-xl text-sm text-center text-white py-2">
                  Agenda
                </div>
                <div className="p-5 space-y-2">
                  <NotificationLabel variant="yellow">
                    No agenda available for this meeting.
                  </NotificationLabel>
                  <Button onClick={onShowFullAgenda}>Manage agenda</Button>
                </div>
              </div>
            )}
          </div>

          <div
            ref={questionRef}
            className={`w-full grow flex flex-col overflow-hidden min-h-button ${
              !showQuestionsButton &&
              "border border-mblue-500 rounded-xl bg-mblue-100"
            }`}
          >
            {showQuestionsButton ? (
              <Button onClick={onManageQuestions} variant="highlighted">
                <div className="flex items-center justify-center space-x-2">
                  <MdQuestionAnswer className="w-4 h-4 mt-0.5" />
                  <p>
                    {meetingQuestions.length > 0
                      ? `Questions (${meetingQuestions.length})`
                      : "Questions"}
                  </p>
                </div>
              </Button>
            ) : (
              <>
                <div className="w-full bg-mblue-500 rounded-t-xl text-sm text-center text-white py-2 flex items-center space-x-2 justify-center relative">
                  {meetingQuestions.length > 0
                    ? `Questions (${meetingQuestions.length})`
                    : "Questions"}
                  <button
                    onClick={onManageQuestions}
                    style={{ top: "0.35rem", right: "0.35rem" }}
                    className="absolute bg-mblue-100 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0"
                  >
                    <MdOpenInNew className="w-4 h-4 text-mblue-500" />
                  </button>
                </div>
                <div className="grow overflow-auto p-3 space-y-3">
                  <QuestionItemInput
                    isDesktop
                    onAdd={(question) => {
                      createMeetingQuestion(meeting.id, question);
                    }}
                  />
                  <div className="space-y-2">
                    {!!openQuestions.length && (
                      <div className="pb-1.5 space-y-2">
                        <Label>{`Open Questions (${openQuestions.length})`}</Label>
                        {openQuestions.map((q) => (
                          <QuestionItemDesktop
                            key={q.id}
                            meetingQuestion={q}
                            onUpvote={async () => {
                              const alreadyUpvoted = q.upvotes.includes(
                                user!.id
                              );
                              if (alreadyUpvoted) {
                                // remove upvote
                                const removeUpvote = q.upvotes.filter(
                                  (u) => u !== user!.id
                                );
                                upvoteMeetingQuestion(q.id, removeUpvote);
                              } else {
                                const newUpvotes = [...q.upvotes, user!.id];
                                upvoteMeetingQuestion(q.id, newUpvotes);
                              }
                            }}
                            onMarkAsAnswered={async () => {
                              changeMeetingQuestionAnsweredStatus(
                                q.id,
                                !q.answered
                              );
                            }}
                            upvoted={q.upvotes.includes(user!.id)}
                          />
                        ))}
                      </div>
                    )}
                    {!!answeredQuestions.length && (
                      <>
                        <Label>{`Answered Questions (${answeredQuestions.length})`}</Label>
                        {answeredQuestions.map((q) => (
                          <QuestionItemDesktop
                            key={q.id}
                            meetingQuestion={q}
                            onUpvote={async () => {
                              const alreadyUpvoted = q.upvotes.includes(
                                user!.id
                              );
                              if (alreadyUpvoted) {
                                // remove upvote
                                const removeUpvote = q.upvotes.filter(
                                  (u) => u !== user!.id
                                );
                                upvoteMeetingQuestion(q.id, removeUpvote);
                              } else {
                                const newUpvotes = [...q.upvotes, user!.id];
                                upvoteMeetingQuestion(q.id, newUpvotes);
                              }
                            }}
                            onMarkAsAnswered={async () => {
                              changeMeetingQuestionAnsweredStatus(
                                q.id,
                                !q.answered
                              );
                            }}
                            upvoted={q.upvotes.includes(user!.id)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="h-5 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default MeetingViewPageDesktop;
