import { Request, Response } from 'express';
import { generateToken } from '../config/generateToken';
import User from '../models/user-model';
import bcryptjs from 'bcryptjs';
import Logging from '../library/Logging';

const fetchUsers = async (req: Request, res: Response) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select('-password');
  res.status(201).send({ users });
};

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  if (!name || !email || !password) {
    res.status(404).send({ message: 'Please enter all the fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({ message: 'User already exists' });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profilePhoto,
  });
  if (user) {
    const { name, email, profilePhoto, _id } = user;
    res.status(201).json({
      _id,
      name,
      email,
      profilePhoto,
      token: await generateToken(user.id),
    });
  } else {
    res.status(400).send({ message: 'failed to create user' });
  }
};

const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  try {
    if (user && (await bcryptjs.compare(password, user?.password))) {
      Logging.info('User Authenticated Successfully');
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token: await generateToken(user._id),
      });
    } else {
      Logging.error('Invalid Credentials');
      res.status(404).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    Logging.error(error);
    res.status(401).json({ message: 'Authorization failed' });
  }
};

export default { fetchUsers, registerUser, authUser };
