
import { User } from './../model/user.model.js';

export const  checkUserExistsByEmail = async (email) => {
 return await User.findOne({ email: email });
}

export const createUser = async (userData) => {
    return await User.create(userData);
}

export const updateUser = async (email, updateData) => {
    return await User.findOneAndUpdate({ email: email }, updateData, { returnDocument: 'after' });
}