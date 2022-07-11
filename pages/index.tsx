import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import MeetingOverviewPage from "../components/pages/MeetingOverviewPage";
import { Meeting } from "../utils/types";
import { useAuth } from "../lib/auth";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { fetchAllMeetings } from "../lib/supabase/meetings";

export const getStaticProps: GetStaticProps = async () => {
  const { data: meetings, error } = await fetchAllMeetings();

  if (error) {
    throw error;
  }

  return {
    props: {
      meetings,
    },
  };
};

type Props = {
  meetings: Meeting[];
};

const MeetingOverview: NextPage<Props> = ({ meetings }) => {
  const router = useRouter();
  const { user } = useAuth();

  if (!meetings) {
    return <LoadingScreen />;
  }

  return (
    <MeetingOverviewPage
      meetings={meetings}
      userId={user!.id}
      onAddMeeting={
        () => {} // TODO: Add onClick
      }
      onCreateMeeting={() => router.push("/newMeeting")}
    />
  );
};

export default MeetingOverview;
