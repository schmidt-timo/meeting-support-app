import { Meeting } from "./types";

export const exampleMeetings: Meeting[] = [
  {
    id: "example-meeting-1",
    createdBy: "timoschmidt",
    name: "Team Meeting",
    startDate: new Date("June 1, 2022, 09:00:00"),
    endDate: new Date("June 1, 2022, 10:30:00"),
    location: "Conference Room A",
    agenda: [
      {
        title: "1. Tagespunkt",
        description: "Beschreibung für den ersten Tagespunkt",
        duration: 15,
      },
      {
        title: "2. Tagespunkt",
        description: "Beschreibung für den zweiten Tagespunkt",
        duration: 30,
      },
    ],
    participants: [
      {
        name: "Max Mustermann",
        email: "maxmustermann@email.com",
      },
      {
        name: "Erika Mustermann",
        email: "erikamustermann@email.com",
      },
    ],
  },
  {
    id: "example-meeting-2",
    createdBy: "timoschmidt",
    name: "Creative Meeting (Project XYZ)",
    startDate: new Date("June 2, 2022, 12:00:00"),
    endDate: new Date("June 2, 2022, 14:00:00"),
    agenda: [],
    participants: [
      {
        name: "Max Mustermann",
        email: "maxmustermann@email.com",
      },
    ],
    location: "Conference Room B",
  },
  {
    id: "example-meeting-3",
    createdBy: "maxmustermann",
    name: "Weekly",
    startDate: new Date("June 3, 2022, 09:00:00"),
    endDate: new Date("June 3, 2022, 09:30:00"),
    agenda: [],
    participants: [
      {
        name: "Max Mustermann",
        email: "maxmustermann@email.com",
      },
    ],
  },
  {
    id: "example-meeting-4",
    createdBy: "johndoe",
    name: "Team Meeting",
    startDate: new Date("June 4, 2022, 10:00:00"),
    endDate: new Date("June 4, 2022, 11:30:00"),
    agenda: [
      {
        title: "1. Tagespunkt",
        description: "Beschreibung für den ersten Tagespunkt",
        duration: 15,
      },
      {
        title: "2. Tagespunkt",
        description: "Beschreibung für den zweiten Tagespunkt",
        duration: 30,
      },
    ],
    participants: [
      {
        name: "John Doe",
        email: "johndoe@email.com",
      },
      {
        name: "Max Mustermann",
        email: "maxmustermann@email.com",
      },
      {
        name: "Erika Mustermann",
        email: "erikamustermann@email.com",
      },
    ],
    location: "Conference Room B",
  },
];
