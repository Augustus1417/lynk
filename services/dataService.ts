import { Student, Message, Chat } from '@/data/mockData';

// This is a modular data service that can be easily replaced with a real backend
export class DataService {
  private static instance: DataService;
  private students: Student[] = [];
  private messages: Message[] = [];
  private chats: Chat[] = [];

  private constructor() {
    // Initialize with mock data
    this.loadMockData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private loadMockData() {
    // In a real app, this would be replaced with API calls
    // For now, we'll import the mock data
    const { mockStudents, mockMessages, mockChats } = require('@/data/mockData');
    this.students = mockStudents;
    this.messages = mockMessages;
    this.chats = mockChats;
  }

  // Student methods
  async getStudents(): Promise<Student[]> {
    // In a real app: return await api.get('/students');
    return this.students;
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    // In a real app: return await api.get(`/students/${id}`);
    return this.students.find(student => student.id === id);
  }

  async searchStudents(query: string, program?: string): Promise<Student[]> {
    // In a real app: return await api.get(`/students/search?q=${query}&program=${program}`);
    return this.students.filter(student => {
      const matchesQuery = student.name.toLowerCase().includes(query.toLowerCase()) ||
                          student.section.toLowerCase().includes(query.toLowerCase());
      const matchesProgram = !program || student.program === program;
      return matchesQuery && matchesProgram;
    });
  }

  async updateStudentStatus(id: string, isOnline: boolean, lastSeen?: string): Promise<void> {
    // In a real app: await api.patch(`/students/${id}`, { isOnline, lastSeen });
    const student = this.students.find(s => s.id === id);
    if (student) {
      student.isOnline = isOnline;
      if (lastSeen) {
        student.lastSeen = lastSeen;
      }
    }
  }

  // Chat methods
  async getChats(): Promise<Chat[]> {
    // In a real app: return await api.get('/chats');
    return this.chats;
  }

  async getChatById(id: string): Promise<Chat | undefined> {
    // In a real app: return await api.get(`/chats/${id}`);
    return this.chats.find(chat => chat.id === id);
  }

  async createDirectChat(participantIds: string[]): Promise<Chat> {
    // In a real app: return await api.post('/chats', { type: 'direct', participants: participantIds });
    const newChat: Chat = {
      id: Date.now().toString(),
      type: 'direct',
      name: 'New Chat', // Will be updated with actual participant name
      participants: participantIds,
      unreadCount: 0,
      isGroup: false,
    };
    this.chats.push(newChat);
    return newChat;
  }

  async createGroupChat(name: string, participants: string[], groupInfo: any): Promise<Chat> {
    // In a real app: return await api.post('/chats', { type: 'group', name, participants, groupInfo });
    const newChat: Chat = {
      id: Date.now().toString(),
      type: 'group',
      name,
      participants,
      unreadCount: 0,
      isGroup: true,
      groupInfo,
    };
    this.chats.push(newChat);
    return newChat;
  }

  // Message methods
  async getMessages(chatId: string): Promise<Message[]> {
    // In a real app: return await api.get(`/chats/${chatId}/messages`);
    return this.messages.filter(message => 
      this.chats.find(chat => chat.id === chatId)?.participants.includes(message.senderId)
    );
  }

  async sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<Message> {
    // In a real app: return await api.post(`/chats/${chatId}/messages`, { content, type });
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1', // Current user ID - in real app, get from auth context
      content,
      timestamp: new Date().toISOString(),
      type,
      isRead: false,
    };
    
    this.messages.push(newMessage);
    
    // Update chat's last message
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = newMessage;
    }
    
    return newMessage;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    // In a real app: await api.patch(`/messages/${messageId}/read`);
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.isRead = true;
    }
  }

  async markChatAsRead(chatId: string): Promise<void> {
    // In a real app: await api.patch(`/chats/${chatId}/read`);
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
      // Mark all messages in this chat as read
      this.messages.forEach(message => {
        if (chat.participants.includes(message.senderId)) {
          message.isRead = true;
        }
      });
    }
  }

  // Real-time methods (for future WebSocket integration)
  onNewMessage(callback: (message: Message) => void): () => void {
    // In a real app: return websocket.subscribe('new-message', callback);
    // For now, return a no-op unsubscribe function
    return () => {};
  }

  onStudentStatusChange(callback: (studentId: string, isOnline: boolean) => void): () => void {
    // In a real app: return websocket.subscribe('student-status', callback);
    // For now, return a no-op unsubscribe function
    return () => {};
  }

  // Utility methods
  async getCurrentUserId(): Promise<string> {
    // In a real app: return await auth.getCurrentUserId();
    return '1'; // Mock current user ID
  }

  async isOnline(): Promise<boolean> {
    // In a real app: return navigator.onLine;
    return true;
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();