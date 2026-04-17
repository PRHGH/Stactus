import logger from '#config/logger';
import { db } from '#config/database';
import { users } from '#models/user.model';
import { eq } from 'drizzle-orm';

const userFields = {
  id: users.id,
  email: users.email,
  name: users.name,
  role: users.role,
  created_at: users.created_at,
  updated_at: users.updated,
};

export const getAllUsers = async () => {
  try {
    return await db.select(userFields).from(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select(userFields)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  } catch (error) {
    logger.error(`Error fetching user by id ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const existingUser = await getUserById(id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning(userFields);

    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    const existingUser = await getUserById(id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning(userFields);
    return deletedUser;
  } catch (error) {
    logger.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};
