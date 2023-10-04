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
  }

  // IDEA: UNIR MÉTODOS FINDUSERBYEMAIL Y BYID EN UNO SOLO:
  // SI NO FUNCIONA, SEPARAR
  // findUser = async (email = null, uid = null) => {
  //   if (email !== null) {
  //     try {
  //       const data = await this.dao.getUserByEmail(email);
  //       return data;
  //     } catch (err) {
  //       return err;
  //     }
  //   } else {
  //     try {
  //       const data = await this.dao.getUserById(uid);
  //       return data;
  //     } catch (err) {
  //       return err;
  //     }
  //   }
  // };

  // createUser = async (uInfo) => {
  //   try {
  //     const data = await this.dao.create(uInfo);
  //     return data;
  //   } catch (err) {
  //     return err;
  //   }
  // };

  // updateUser = async (email, uInfo) => {
  //   try {
  //     const data = await this.dao.update(email, uInfo);
  //     return data;
  //   } catch (err) {
  //     return err;
  //   }
  // };
}