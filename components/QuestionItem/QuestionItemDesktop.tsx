import { MdOutlineClose, MdOutlineDone, MdThumbUp } from "react-icons/md";
import { formatUpvoteText } from "../../utils/formatting";
import { MeetingQuestion } from "../../utils/types";

type Props = {
  meetingQuestion: MeetingQuestion;
  onUpvote: () => void;
  onMarkAsAnswered: () => void;
  upvoted: boolean;
};

const QuestionItemDesktop = ({
  meetingQuestion,
  onUpvote,
  onMarkAsAnswered,
  upvoted,
}: Props) => {
  return (
    <div className="flex flex-col justify-between p-3 pt-2.5 bg-white rounded-xl max-h-question">
      <div className="flex space-x-2 items-center text-sm font-medium truncate-3-lines text-mblue-500">
        {meetingQuestion.question}
      </div>
      <div>
        <div className="flex space-x-2 justify-end pt-3">
          <button
            type="button"
            onClick={onUpvote}
            className={`flex items-center space-x-1.5 py-1 px-2 font-medium rounded-xl text-extrasmall ${
              upvoted
                ? "bg-mblue-500 text-white"
                : "bg-mblue-200 bg-opacity-60 text-mblue-500"
            }`}
          >
            <MdThumbUp className="w-3 h-3 flex-shrink-0" />
            <p>{formatUpvoteText(meetingQuestion.upvotes)}</p>
          </button>
          <button
            type="button"
            onClick={onMarkAsAnswered}
            className="flex items-center space-x-1.5 py-1 px-2 font-medium bg-mblue-200 bg-opacity-60 text-mblue-500 rounded-xl text-extrasmall"
          >
            {meetingQuestion.answered ? (
              <MdOutlineClose className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <MdOutlineDone className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <p>
              {meetingQuestion.answered
                ? "mark as not answered"
                : "mark as answered"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionItemDesktop;
