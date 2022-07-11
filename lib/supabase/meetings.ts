import { supabase } from "./config";
import {
  Meeting,
  MeetingAgendaItem,
  MeetingParticipant,
} from "../../utils/types";

export const fetchAllMeetings = async () => {
  return await supabase
    .from("meetings")
    .select("*")
    .order("startDate", { ascending: true });
};

export const fetchSingleMeeting = async (meetingId: string) => {
  return await supabase
    .from("meetings")
    .select("*")
    .eq("id", meetingId)
    .single();
};

export const createMeeting = async (meeting: Meeting) => {
  return await supabase.from("meetings").insert([meeting]);
};

export const updateAgenda = async (
  meetingId: string,
  agenda: MeetingAgendaItem[]
) => {
  return await supabase
    .from("meetings")
    .update({
      agenda: agenda.map((a) => JSON.stringify(a)),
    })
    .match({ id: meetingId });
};

export const updateParticipants = async (
  meetingId: string,
  newParticipants: MeetingParticipant[]
) => {
  return await supabase
    .from("meetings")
    .update({
      participants: newParticipants,
    })
    .match({ id: meetingId });
};