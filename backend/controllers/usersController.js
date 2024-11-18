import * as usersService from '../services/usersService.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await usersService.getUserById(id, req.user.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ error: 'Forbidden. You can only access your own data.' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).send('User not found');
    }
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const updatedUser = await usersService.updateUser(id, req.body);
    res.json(updatedUser);
  } catch (error) {
    if (error.message === 'NO_FIELDS') {
      return res.status(400).json({ error: 'No fields to update' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).send('User not found');
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await usersService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).send('User not found');
    }
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
