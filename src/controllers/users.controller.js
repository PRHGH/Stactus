import {
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/users.service';
import logger from '#config/logger';
import { formatValidationError } from '#utils/format';
import { updateUserSchema, userIdSchema } from '#validations/users.validation';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users');

    const allUsers = await getAllUsers();
    res.json({
      message: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const paramsValidation = userIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramsValidation.error),
      });
    }

    const { id } = paramsValidation.data;
    logger.info(`Fetching user by id: ${id}`);

    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: user });
  } catch (error) {
    logger.error('Error fetching user by id', error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const paramsValidation = userIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramsValidation.error),
      });
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = paramsValidation.data;
    const updates = { ...bodyValidation.data };
    const isAdmin = req.user.role === 'admin';
    const isOwnAccount = Number(req.user.id) === id;

    if (!isAdmin && !isOwnAccount) {
      return res
        .status(403)
        .json({ error: 'You can only update your own account' });
    }

    if (!isAdmin && updates.role) {
      return res
        .status(403)
        .json({ error: 'Only admin users can update roles' });
    }

    const user = await updateUserService(id, updates);

    logger.info(`User updated: ${id} by ${req.user.id}`);
    return res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    logger.error('Error updating user', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const paramsValidation = userIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(paramsValidation.error),
      });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = paramsValidation.data;
    const isAdmin = req.user.role === 'admin';
    const isOwnAccount = Number(req.user.id) === id;

    if (!isAdmin && !isOwnAccount) {
      return res
        .status(403)
        .json({ error: 'You can only delete your own account' });
    }

    await deleteUserService(id);

    logger.info(`User deleted: ${id} by ${req.user.id}`);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};
