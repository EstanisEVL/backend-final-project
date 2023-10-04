import UserDTO from "../dtos/user.dto.js";
import { UserService } from "../repositories/index.js";

// Deberá obtener todos los usuarios, éste sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol):
export const getUsers = async (req, res) => {
  try {
    const data = await UserService.getUsers();

    const users = data.map((user) => new UserDTO(user));

    return res.status(200).json({ message: "Users in data base - ", users });
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in getUsers - user.controller.js",
    });
  }
};

export const togglePremium = async (req, res) => {
  try {
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in togglePremium - user.controller.js",
    });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in uploadDocuments - user.controller.js",
    });
  }
};

export const deleteUsers = async (req, res) => {
  // DELETE / deberá limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días. (puedes hacer pruebas con los últimos 30 minutos, por ejemplo). Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad:
  try {
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in deleteUsers - user.controller.js",
    });
  }
};

// Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce
