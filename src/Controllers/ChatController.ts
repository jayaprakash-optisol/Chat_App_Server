import { Request, Response } from 'express';
import Logging from '../library/Logging';
import Chat from '../models/chat-model';
import User from '../models/user-model';

const accessChat = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    Logging.error('UserId not found in request');
    return res.status(400).json({ message: 'UserId not found' });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name profilePicture email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};

const fetchChats = async (req: Request, res: Response) => {
  try {
    await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', ['-password', '-isAdmin'])
      .populate('groupAdmin', ['-password', '-isAdmin'])
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: ' name profilePicture email',
        });

        res.status(201).json(results);
      });
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch chats' });
  }
};

const createGroupChat = async (req: Request, res: Response) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(404).json({ message: 'All fields are required' });
  }

  let parsedUsers = JSON.parse(users);
  if (parsedUsers?.length < 2) {
    return res
      .status(400)
      .json({ message: 'Two users are required for group chat' });
  }
  parsedUsers.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: parsedUsers,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ error, message: 'Failed to create group chat' });
  }
};

const renameGroup = async (req: Request, res: Response) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(201).json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: 'failed to rename group', error });
  }
};

const addToGroup = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  try {
    const addedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(201).json(addedUser);
  } catch (error) {
    res.status(400).json({ message: 'failed to add user to group', error });
  }
};

const removeFromGroup = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  try {
    const removedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(201).json(removedUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'failed to remove user from group', error });
  }
};

export default {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
