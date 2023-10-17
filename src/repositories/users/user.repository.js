export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    try {
      const data = await this.dao.get();
      return data;
    } catch (err) {
      return err;
    }
  };

  getInactiveUsers = async (date) => {
    try {
      const data = await this.dao.getInactive(date);
      return data;
    } catch (err) {
      return err;
    }
  }

  findUser = async (email = null, uid = null) => {
    if (email !== null) {
      try {
        const data = await this.dao.getUserByEmail(email);
        return data;
      } catch (err) {
        return err;
      }
    } else {
      try {
        const data = await this.dao.getUserById(uid);
        return data;
      } catch (err) {
        return err;
      }
    }
  };

  createUser = async (userInfo) => {
    try {
      const data = await this.dao.create(userInfo);
      return data;
    } catch (err) {
      return err;
    }
  };

  updateUser = async (email, userInfo) => {
    try {
      const data = await this.dao.update(email, userInfo);
      return data;
    } catch (err) {
      return err;
    }
  };

  deleteInactiveUsers = async (date) => {
    try {
      const data = await this.dao.deleteInactive(date);
      return data;
    } catch (err) {
      return err;
    }
  };

  // For tests only:
  deleteUser = async (uid) => {
    try {
      const data = await this.dao.delete(uid);
      return data;
    } catch (err) {
      return err;
    }
  };
}
