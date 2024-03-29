import { useEffect, useState } from "react";
import { DatabaseSyncStatus } from "../../components/meetingElements/NoteSyncStatusBar";
import { generateRandomID } from "../../utils/functions";
import {
  DatabaseParticipant,
  Meeting,
  MeetingAgendaItem,
  MeetingNote,
  MeetingParticipant,
  MeetingQuestion
} from "../../utils/types";
import { useAuth } from "../auth";
import { getServiceSupabase, supabase } from "./config";
import { getParticipantInfoIfEmailIsRegistered } from "./users";

export const useMeeting = (meeting: Meeting) => {
  const [meetingNote, setMeetingNote] = useState<MeetingNote>();
  const [sharedNotes, setSharedNotes] = useState<MeetingNote>();
  const [agendaItems, setAgendaItems] = useState<MeetingAgendaItem[]>(meeting.agenda)  

  const [databaseStatus, setDatabaseStatus] =
    useState<DatabaseSyncStatus>("NONE");

  const [sharedNotesDatabaseStatus, setSharedNotesDatabaseStatus] =
    useState<DatabaseSyncStatus>("NONE");

  const [meetingQuestions, setMeetingQuestions] = useState<MeetingQuestion[]>(
    []
  );

  const [meetingIsCompleted, setMeetingIsCompleted] = useState(
    meeting.completed
  );

  const [participants, setParticipants] = useState<MeetingParticipant[]>(
    meeting.participants
  );

  const { user } = useAuth();

  var createNewMeetingNote = (function async() {
    // make sure note create function only gets called once
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        createMeetingNote({
          id: generateRandomID(),
          meetingId: meeting.id,
          createdBy: user!.id,
          content: "",
        }).then((note) => {
          setMeetingNote(note);
        });
      }
    };
  })();

  var createNewMeetingNoteForSharedNotes = (function async() {
    // make sure note create function only gets called once
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        createMeetingNote({
          id: generateRandomID(),
          meetingId: meeting.id,
          createdBy: "shared",
          content: "",
        }).then((note) => {
          setSharedNotes(note);
        });
      }
    };
  })();

  const checkParticipantsInfo = async (
    participantsToCheck: MeetingParticipant[]
  ) => {
    checkParticipants(participantsToCheck).then((updatedParticipants) => {
      setParticipants(updatedParticipants);
    });
  };

  useEffect(() => {
    // get meeting note if available
    fetchMeetingNote(meeting.id, user!.id, setMeetingNote).catch((error) => {
      if (error.code === "PGRST116") {
        // if does not exist, create empty note
        createNewMeetingNote();
      }
    });

    // get shared notes if available
    fetchMeetingNote(meeting.id, "shared", setSharedNotes).catch((error) => {
      if (error.code === "PGRST116") {
        // if does not exist, create empty note
        createNewMeetingNoteForSharedNotes();
      }
    });

    fetchMeetingQuestions(meeting.id, setMeetingQuestions).catch((error) => {
      throw error;
    });

    checkParticipantsInfo(participants);

    const supabaseServer = getServiceSupabase();

    const meetingSubscription = supabaseServer
      .from("meetings")
      .on("*", (payload) => {
        setParticipants(payload.new.participants);
        setAgendaItems(payload.new.agenda);     
        checkParticipantsInfo(payload.new.participants);
        if (payload.new.completed) {
          setMeetingIsCompleted(true);
        }
      })
      .subscribe();

    const noteSubscription = supabaseServer
      .from("meeting_notes")
      .on("UPDATE", (payload) => {
        if (payload.new.createdBy === "shared") {
          setSharedNotes(payload.new);
        } else {
          setMeetingNote(payload.new);
        }
      })
      .subscribe();

    const questionSubscription = supabaseServer
      .from("meeting_questions")
      .on("*", (payload) => {
        fetchMeetingQuestions(meeting.id, setMeetingQuestions);
      })
      .subscribe();

    return () => {
      meetingSubscription.unsubscribe();
      noteSubscription.unsubscribe();
      questionSubscription.unsubscribe();
    };
  }, []);

  return {
    meetingNote,
    sharedNotes,
    databaseStatus,
    setDatabaseStatus,
    sharedNotesDatabaseStatus,
    setSharedNotesDatabaseStatus,
    participants,
    setParticipants,
    meetingIsCompleted,
    meetingQuestions,
    agendaItems
  };
};

export const fetchMeetingNote = async (
  meetingId: string,
  participantId: string,
  setState: (meetingNote: MeetingNote) => void
) => {
  const { data, error } = await supabase
    .from("meeting_notes")
    .select("*")
    .eq("meetingId", meetingId)
    .eq("createdBy", participantId)
    .single();

  if (error) {
    throw error;
  }

  if (data) {
    setState(data);
    return data;
  }
};

export const createMeetingNote = async (meetingNote: MeetingNote) => {
  const { data, error } = await supabase
    .from("meeting_notes")
    .insert([meetingNote])
    .single();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }
};

export const updateMeetingNote = async (
  meetingNoteId: string,
  updatedText: string
) => {
  const { data, error } = await supabase
    .from("meeting_notes")
    .update({
      content: updatedText,
    })
    .match({
      id: meetingNoteId,
    })
    .single();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }
};

export const checkParticipants = async (participants: MeetingParticipant[]) => {
  let temp: MeetingParticipant[] = [];
  for (const p of participants) {
    const { data, error } = await getParticipantInfoIfEmailIsRegistered(
      p.email
    );

    if (data) {
      temp = [...temp, data];
    } else {
      temp = [...temp, p];
    }
  }
  return temp;
};

export const updateParticipants = async (
  meetingId: string,
  newParticipants: DatabaseParticipant[]
) => {
  return await supabase
    .from("meetings")
    .update({
      participants: newParticipants,
    })
    .match({ id: meetingId });
};

export const fetchMeetingQuestions = async (
  meetingId: string,
  setState: (meetingQuestions: MeetingQuestion[]) => void
) => {
  const { data, error } = await supabase
    .from("meeting_questions")
    .select("*")
    .eq("meetingId", meetingId)
    .order("createdAt", { ascending: false });

  if (error) {
    throw error;
  }

  if (data) {
    setState(data);
    return data;
  }
};

export const createMeetingQuestion = async (
  meetingId: string,
  question: string
) => {
  const { data, error } = await supabase
    .from("meeting_questions")
    .insert([
      {
        meetingId,
        question,
      },
    ])
    .single();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }
};

export const upvoteMeetingQuestion = async (
  questionId: string,
  upvotes: string[]
) => {
  const { data, error } = await supabase
    .from("meeting_questions")
    .update({
      upvotes,
    })
    .match({
      id: questionId,
    });

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }
};

export const changeMeetingQuestionAnsweredStatus = async (
  questionId: string,
  answered: boolean
) => {
  const { data, error } = await supabase
    .from("meeting_questions")
    .update({
      answered,
    })
    .match({
      id: questionId,
    })
    .single();

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }
};

export const createPresentationStorage = async () => {
  const { data, error } = await supabase.storage.createBucket("presentations", {
    public: false,
  });

  if (error) {
    throw error;
  }

  if (data) {
    return data;
  }
};

export const markMeetingAsComplete = async (meetingId: string) => {
  // change end date to timestamp when meeting was ended
  const { data: updateData, error: updateError } = await supabase
    .from("meetings")
    .update({
      endDate: new Date(),
    })
    .match({ id: meetingId });

  if (updateError) {
    throw updateError;
  }

  if (updateData) {
    // mark meeting as completed
    const { data, error } = await supabase
      .from("meetings")
      .update({ completed: true })
      .eq("id", meetingId);

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }
  }
};
