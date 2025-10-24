export interface Student {
  id: string;
  name: string;
  program: string;
  year: number;
  section: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupInfo?: {
    section: string;
    program: string;
    description?: string;
  };
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    program: 'Computer Science',
    year: 3,
    section: 'CS-301',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    program: 'Computer Science',
    year: 2,
    section: 'CS-201',
    isOnline: false,
    lastSeen: '2 hours ago'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    program: 'Business Administration',
    year: 4,
    section: 'BA-401',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '4',
    name: 'Emily Davis',
    program: 'Computer Science',
    year: 3,
    section: 'CS-301',
    isOnline: false,
    lastSeen: '1 day ago'
  },
  {
    id: '5',
    name: 'David Kim',
    program: 'Engineering',
    year: 2,
    section: 'ENG-201',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '6',
    name: 'Lisa Wang',
    program: 'Business Administration',
    year: 3,
    section: 'BA-301',
    isOnline: false,
    lastSeen: '30 minutes ago'
  },
  {
    id: '7',
    name: 'James Wilson',
    program: 'Computer Science',
    year: 1,
    section: 'CS-101',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    program: 'Engineering',
    year: 4,
    section: 'ENG-401',
    isOnline: false,
    lastSeen: '3 hours ago'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey! How was the CS-301 lecture today?',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'text',
    isRead: true
  },
  {
    id: '2',
    senderId: '4',
    content: 'It was really interesting! The professor covered machine learning basics.',
    timestamp: '2024-01-15T10:32:00Z',
    type: 'text',
    isRead: true
  },
  {
    id: '3',
    senderId: '1',
    content: 'Awesome! Do you have the assignment details?',
    timestamp: '2024-01-15T10:35:00Z',
    type: 'text',
    isRead: false
  }
];

export const mockChats: Chat[] = [
  {
    id: '1',
    type: 'direct',
    name: 'Alex Johnson',
    participants: ['1', '4'],
    lastMessage: mockMessages[2],
    unreadCount: 1,
    isGroup: false
  },
  {
    id: '2',
    type: 'group',
    name: 'CS-301 Study Group',
    participants: ['1', '4', '7'],
    lastMessage: {
      id: '4',
      senderId: '7',
      content: 'Anyone want to meet up for the group project?',
      timestamp: '2024-01-15T09:15:00Z',
      type: 'text',
      isRead: true
    },
    unreadCount: 0,
    isGroup: true,
    groupInfo: {
      section: 'CS-301',
      program: 'Computer Science',
      description: 'Advanced Algorithms Study Group'
    }
  },
  {
    id: '3',
    type: 'direct',
    name: 'Sarah Chen',
    participants: ['1', '2'],
    lastMessage: {
      id: '5',
      senderId: '2',
      content: 'Thanks for helping with the assignment!',
      timestamp: '2024-01-14T16:45:00Z',
      type: 'text',
      isRead: true
    },
    unreadCount: 0,
    isGroup: false
  }
];

export const currentUserId = '1'; // Alex Johnson