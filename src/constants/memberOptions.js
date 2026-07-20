export const PATROLS = [
  "FOX", "DOVE", "BULL", "PEACOCK", "OFFICERS", "MENTOR",
  "MPL", "RHINO", "TURTLE", "SLEEPING", "NRI",
];

export const INSTRUMENTS = [
  "Saxophone",
  "Clarinet",
  "Trumpet",
  "Trombone",
  "Euphonium",
  "Side Drum",
  "Base Drum",
  "Rhythm",
  "Band Inspector",
];

export const PROFESSIONS = ["BUSINESS", "JOB", "STUDENT", "RETIRED", "OTHER"];

export const PROFESSION_DETAIL_LABELS = {
  BUSINESS: "Nature of business",
  JOB: "Nature of job",
  STUDENT: "Studies being pursued",
  OTHER: "Profession details",
};

export const professionLabel = (profession) => profession ? `${profession[0]}${profession.slice(1).toLowerCase()}` : "Not assigned";
