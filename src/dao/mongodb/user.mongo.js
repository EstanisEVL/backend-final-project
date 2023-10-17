import userModel from "../../models/user.model.js";

export default class Users {
  get = async () => {
    try {
      const users = await userModel.find();
      return users;
    } catch (err) {
      return err;
    }
  };

  getUserById = async (userId) => {
    try {
      const user = await userModel.findOne({ _id: userId });
      return user;
    } catch (err) {
      return err;
    }
  };

  getUserByEmail = async (email) => {
    try {
      const user = await userModel.findOne({ email: email });
      return user;
    } catch (err) {
      return err;
    }
  };

  getInactive = async (date) => {
    try {
      const inactiveUsers = await userModel.find({
        last_connection: { $lt: date },
      });
      return inactiveUsers;
    } catch (err) {
      return err;
    }
  };

  create = async (userInfo) => {
    try {
      const user = await userModel.create(userInfo);
      return user;
    } catch (err) {
      return err;
    }
  };

  update = async (email, userInfo) => {
    try {
      const updatedUser = await userModel.updateOne(
        { email: email },
        { password: userInfo }
      );
      return updatedUser;
    } catch (err) {
      return err;
    }
  };

  deleteInactive = async (date) => {
    try {
      const deletedUsers = await userModel.deleteMany({
        last_connection: { $lt: date },
      });
      return deletedUsers;
    } catch (err) {
      return err;
    }
  };

  // For tests only:
  delete = async (userId) => {
    try {
      const deletedUser = await userModel.deleteOne({
        _id: userId,
      });
      return deletedUser;
    } catch (err) {
      return err;
    }
  };
}
