import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import UserModel, { UserDocument, UserInput } from "models/user.model";

// Crea un nuovo utente escludendo la password dai dati restituiti
export const createUser = async (input: UserInput) => {
  const newUser = await UserModel.create(input);
  return omit(newUser.toJSON(), "password");
};

// Convalida la password di un utente e restituisce i dati dell'utente senza la password
export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserModel.findOne({ email });
  if (!user) return false;
  const isValid = await user.comparePassword(password);
  if (!isValid) return false;
  return omit(user.toJSON(), "password");
};

// Trova un utente nel database basato su una query
export const findUser = async (query: FilterQuery<UserDocument>) => {
  return UserModel.findOne(query).lean();
};

// Trova un utente nel database basato sull'email fornita
export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  return user || null;
};

// Cancella un utente dal database basato su una query
export const deleteUser = async (query: FilterQuery<UserDocument>) => {
  return UserModel.deleteOne(query).lean();
};
