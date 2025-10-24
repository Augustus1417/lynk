export interface Student {
  id: string;
  name: string;
  program: string;
  year: number;
  email: string;
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
}

export interface Chat {
  id: string;
  name: string;
  type: 'individual' | 'group';
  participants: string[];
  lastMessage?: Message;
  lastActivity: string;
  isGroupChat?: boolean;
  groupDescription?: string;
}

export interface ClassSection {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  professor: string;
  semester: string;
  students: string[];
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    program: 'Computer Science',
    year: 3,
    email: 'alex.johnson@university.edu',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    program: 'Business Administration',
    year: 2,
    email: 'sarah.chen@university.edu',
    isOnline: false,
    lastSeen: '2 hours ago'
  },
  {
    id: '3',
    name: 'Marcus Rodriguez',
    program: 'Engineering',
    year: 4,
    email: 'marcus.rodriguez@university.edu',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    program: 'Psychology',
    year: 1,
    email: 'emma.wilson@university.edu',
    isOnline: false,
    lastSeen: '1 day ago'
  },
  {
    id: '5',
    name: 'David Kim',
    program: 'Computer Science',
    year: 3,
    email: 'david.kim@university.edu',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    program: 'Biology',
    year: 2,
    email: 'lisa.thompson@university.edu',
    isOnline: false,
    lastSeen: '30 minutes ago'
  },
  {
    id: '7',
    name: 'James Brown',
    program: 'Engineering',
    year: 3,
    email: 'james.brown@university.edu',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    program: 'Business Administration',
    year: 4,
    email: 'maria.garcia@university.edu',
    isOnline: false,
    lastSeen: '3 hours ago'
  },
  {
    id: '9',
    name: 'Kevin Lee',
    program: 'Computer Science',
    year: 2,
    email: 'kevin.lee@university.edu',
    isOnline: true,
    lastSeen: 'now'
  },
  {
    id: '10',
    name: 'Rachel Davis',
    program: 'Psychology',
    year: 3,
    email: 'rachel.davis@university.edu',
    isOnline: false,
    lastSeen: '1 hour ago'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey! How was the CS 101 lecture today?',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'text'
  },
  {
    id: '2',
    senderId: '5',
    content: 'It was great! The professor explained algorithms really well.',
    timestamp: '2024-01-15T10:32:00Z',
    type: 'text'
  },
  {
    id: '3',
    senderId: '1',
    content: 'Awesome! Want to study together for the midterm?',
    timestamp: '2024-01-15T10:35:00Z',
    type: 'text'
  },
  {
    id: '4',
    senderId: '2',
    content: 'Anyone interested in forming a study group for Business Ethics?',
    timestamp: '2024-01-15T09:15:00Z',
    type: 'text'
  },
  {
    id: '5',
    senderId: '8',
    content: 'I am! When are you thinking?',
    timestamp: '2024-01-15T09:20:00Z',
    type: 'text'
  }
];

export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    type: 'individual',
    participants: ['1', '5'],
    lastMessage: mockMessages[2],
    lastActivity: '2024-01-15T10:35:00Z'
  },
  {
    id: '2',
    name: 'Business Ethics Study Group',
    type: 'group',
    participants: ['2', '8', '4'],
    lastMessage: mockMessages[4],
    lastActivity: '2024-01-15T09:20:00Z',
    isGroupChat: true,
    groupDescription: 'Study group for Business Ethics course'
  },
  {
    id: '3',
    name: 'CS 101 - Section A',
    type: 'group',
    participants: ['1', '5', '9', '3'],
    lastMessage: mockMessages[0],
    lastActivity: '2024-01-15T10:30:00Z',
    isGroupChat: true,
    groupDescription: 'Computer Science 101 - Section A group chat'
  }
];

export const mockClassSections: ClassSection[] = [
  {
    id: '1',
    courseCode: 'CS 101',
    courseName: 'Introduction to Computer Science',
    section: 'A',
    professor: 'Dr. Smith',
    semester: 'Spring 2024',
    students: ['1', '5', '9', '3']
  },
  {
    id: '2',
    courseCode: 'BUS 201',
    courseName: 'Business Ethics',
    section: 'B',
    professor: 'Prof. Johnson',
    semester: 'Spring 2024',
    students: ['2', '8', '4']
  },
  {
    id: '3',
    courseCode: 'ENG 301',
    courseName: 'Advanced Engineering',
    section: 'C',
    professor: 'Dr. Williams',
    semester: 'Spring 2024',
    students: ['3', '7']
  },
  {
    id: '4',
    courseCode: 'PSY 101',
    courseName: 'Introduction to Psychology',
    section: 'A',
    professor: 'Dr. Brown',
    semester: 'Spring 2024',
    students: ['4', '10']
  }
];

export const currentUser: Student = {
  id: 'current',
  name: 'You',
  program: 'Computer Science',
  year: 3,
  email: 'you@university.edu',
  isOnline: true,
  lastSeen: 'now'
};