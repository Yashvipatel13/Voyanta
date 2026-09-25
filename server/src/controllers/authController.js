import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'voyanta-travel-secret-jwt-key-2026';

export const register = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        preferences: preferences ? JSON.stringify(preferences) : JSON.stringify({
          preferredVibes: ['Nature & Peace', 'Café / Slow Travel'],
          defaultBudget: 'Moderate',
          travelStyle: 'Relaxed'
        })
      }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        preferences: JSON.parse(user.preferences || '{}')
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        preferences: JSON.parse(user.preferences || '{}')
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        preferences: true,
        createdAt: true,
        trips: {
          select: {
            id: true,
            destinationName: true,
            destinationCountry: true,
            durationDays: true,
            totalEstimatedCost: true,
            status: true,
            createdAt: true
          }
        },
        wishlists: {
          include: {
            destination: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        ...user,
        preferences: JSON.parse(user.preferences || '{}')
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Server error fetching user profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, preferences, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(preferences && { preferences: JSON.stringify(preferences) })
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        preferences: true
      }
    });

    res.json({
      message: 'Profile updated successfully!',
      user: {
        ...updatedUser,
        preferences: JSON.parse(updatedUser.preferences || '{}')
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
};
