import bcrypt from 'bcrypt'

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param plainPassword - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, 10)
}

export default hashPassword
