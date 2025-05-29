
export interface Skill {
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface Resource {
  _id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  location: string;
  availableCapacity: number;
  availabilityStatus: string;
  managerName: string;
  managerEmail: string;
  externalSystemId: string;
  projects: string[];
  allocations: string[];
  profile_summary: string;
  skills: Skill[];
  atlassian_id: string;
  github_username: string;
}

export interface ChatMessage {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
}
