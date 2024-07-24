import { fetchUnreadMessages, getMessages, getMessagesByConversation, addMessageToConversation } from '../src/services/messageService.js';
import Message from '../src/models/Message.js';
import { expect, jest, describe, it, beforeEach, afterEach } from '@jest/globals';

describe('Message Service', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn()
    };

    // Use jest.spyOn to mock Message methods
    jest.spyOn(Message, 'find').mockReturnValue({
      exec: jest.fn()
    });
    jest.spyOn(Message, 'updateMany').mockResolvedValue({ nModified: 0 });
    jest.spyOn(Message, 'create').mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchUnreadMessages', () => {
    it('should fetch unread messages and update their status', async () => {
      req.query.userId = 'testUser';
      const mockUnreadMessages = [
        { _id: '1', messageText: 'Test message 1' },
        { _id: '2', messageText: 'Test message 2' }
      ];

      Message.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockUnreadMessages)
      });

      Message.updateMany.mockResolvedValueOnce({ nModified: 2 });

      await fetchUnreadMessages(req, res);

      expect(Message.find).toHaveBeenCalledWith({ receiverName: 'testUser', readStatus: false });
      expect(res.json).toHaveBeenCalledWith(mockUnreadMessages);
      expect(Message.updateMany).toHaveBeenCalledWith(
        { receiverName: 'testUser', readStatus: false },
        { $set: { readStatus: true } }
      );
    });

    it('should handle errors and return a 500 status', async () => {
      req.query.userId = 'testUser';
      const errorMessage = 'Database error';
      Message.find.mockReturnValueOnce({
        exec: jest.fn().mockRejectedValue(new Error(errorMessage))
      });

      console.error = jest.fn(); // Mock console.error

      await fetchUnreadMessages(req, res);

      expect(console.error).toHaveBeenCalledWith('Failed to fetch messages', expect.any(Error));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to fetch messages');
    });
  });

  describe('getMessages', () => {
    it('should fetch messages based on query parameters', async () => {
      req.query = { receiverName: 'testUser', readStatus: 'false' };
      const mockMessages = [
        { _id: '1', messageText: 'Test message 1' },
        { _id: '2', messageText: 'Test message 2' }
      ];

      Message.find.mockResolvedValueOnce(mockMessages);

      await getMessages(req, res);

      expect(Message.find).toHaveBeenCalledWith({ receiverName: 'testUser', readStatus: false });
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should handle errors and return a 500 status', async () => {
      req.query = { receiverName: 'testUser', readStatus: 'false' };
      const errorMessage = 'Database error';
      Message.find.mockRejectedValueOnce(new Error(errorMessage));

      console.error = jest.fn(); // Mock console.error

      await getMessages(req, res);

      expect(console.error).toHaveBeenCalledWith('Failed to fetch messages', expect.any(Error));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to fetch messages');
    });
  });

  describe('getMessagesByConversation', () => {
    it('should fetch messages by conversation ID', async () => {
      req.params.conversationId = '12345';
      const mockMessages = [
        { _id: '1', messageText: 'Test message 1' },
        { _id: '2', messageText: 'Test message 2' }
      ];

      Message.find.mockResolvedValueOnce(mockMessages);

      await getMessagesByConversation(req, res);

      expect(Message.find).toHaveBeenCalledWith({ conversationId: '12345' });
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should return 404 if no messages found', async () => {
      req.params.conversationId = '12345';
      Message.find.mockResolvedValueOnce([]);

      await getMessagesByConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No messages found for this conversation.' });
    });

    it('should handle errors and return a 500 status', async () => {
      req.params.conversationId = '12345';
      const errorMessage = 'Database error';
      Message.find.mockRejectedValueOnce(new Error(errorMessage));

      console.error = jest.fn(); // Mock console.error

      await getMessagesByConversation(req, res);

      expect(console.error).toHaveBeenCalledWith('Failed to fetch messages', expect.any(Error));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to fetch messages');
    });
  });

  describe('addMessageToConversation', () => {
    it('should add a message to a conversation', async () => {
      req.body = {
        conversationId: '12345',
        message: 'Hello!',
        senderName: 'John',
        receiverName: 'Doe'
      };

      await addMessageToConversation(req, res);

      expect(Message.create).toHaveBeenCalledWith({
        conversationId: '12345',
        messageText: 'Hello!',
        senderName: 'John',
        receiverName: 'Doe',
        readStatus: false,
        timestamp: expect.any(Date)
      });
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should handle errors and return a 500 status', async () => {
      req.body = {
        conversationId: '12345',
        message: 'Hello!',
        senderName: 'John',
        receiverName: 'Doe'
      };
      const errorMessage = 'Database error';
      Message.create.mockRejectedValueOnce(new Error(errorMessage));

      console.error = jest.fn(); // Mock console.error

      await addMessageToConversation(req, res);

      expect(console.error).toHaveBeenCalledWith('Failed to add message:', expect.any(Error));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to add message');
    });
  });
});
