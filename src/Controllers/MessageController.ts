import { Request, Response } from 'express';
import Logging from '../library/Logging';
import Chat from '../models/chat-model';
import Message from '../models/message-model';
import User from '../models/user-model';

const sendMessage = async (req: Request, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    Logging.error('Invalid data passed');
    return res.status(404).json({ message: 'Invalid data passed' });
  }

  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate('sender', 'name profilePhoto');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name, profilePhoto email',
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(201).json(message);
  } catch (error) {
    Logging.error('Failed to send message');
    return res.status(400).json({ message: 'failed to send message', error });
  }
};

const allMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name profilePhoto email')
      .populate('chat');

    res.status(201).json(messages);
  } catch (error) {
    Logging.error('Failed to fetch messages');
    return res.status(400).json({ message: 'failed to fetch messages', error });
  }
};
export default { sendMessage, allMessages };
