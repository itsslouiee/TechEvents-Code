// Mock data for development
export const mockOrganizers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    location: "New York",
    date: "2024-03-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    location: "Los Angeles",
    date: "2024-03-14",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    location: "Chicago",
    date: "2024-03-13",
  },
];

export const mockOrganizerSubmissions = [
  {
    id: 1,
    name: "Alice Brown",
    email: "alice@example.com",
    location: "Boston",
    date: "2024-03-15",
    status: "pending",
    documentUrl: "https://example.com/docs/alice.pdf",
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@example.com",
    location: "Seattle",
    date: "2024-03-14",
    status: "approved",
    documentUrl: "https://example.com/docs/bob.pdf",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    location: "Miami",
    date: "2024-03-13",
    status: "rejected",
    documentUrl: "https://example.com/docs/carol.pdf",
  },
];

export const mockEvents = [
  {
    id: 1,
    name: "Tech Conference 2024",
    organization: "Tech Corp",
    type: "Conference",
    date: "2024-04-15",
  },
  {
    id: 2,
    name: "Web Development Workshop",
    organization: "Code Academy",
    type: "Workshop",
    date: "2024-04-20",
  },
  {
    id: 3,
    name: "AI Summit",
    organization: "AI Institute",
    type: "Summit",
    date: "2024-05-01",
  },
];

export const mockEventSubmissions = [
  {
    id: 1,
    name: "Startup Pitch Competition",
    organization: "Startup Hub",
    date: "2024-04-25",
    status: "pending",
    documentUrl: "https://example.com/docs/startup.pdf",
  },
  {
    id: 2,
    name: "Blockchain Workshop",
    organization: "Crypto Labs",
    date: "2024-05-10",
    status: "approved",
    documentUrl: "https://example.com/docs/blockchain.pdf",
  },
  {
    id: 3,
    name: "Data Science Meetup",
    organization: "Data Society",
    date: "2024-05-15",
    status: "rejected",
    documentUrl: "https://example.com/docs/datascience.pdf",
  },
];
