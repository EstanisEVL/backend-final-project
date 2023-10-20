import UserDTO from "../dtos/user.dto.js";
import { sendDeletedAccountMail } from "../helpers/email.helper.js";
import { CartService, UserService } from "../repositories/index.js";

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
    const { uid } = req.params;

    const checkUser = await UserService.findUser(null, uid);

    if (!checkUser) {
      return res.status(404).json({ message: "Error - User not found." });
    } else {
      if (checkUser.role === "admin") {
        return res
          .status(400)
          .json({ message: "Error - Admin cannot change its role." });
      } else {
        if (checkUser.role && checkUser.role === "premium") {
          checkUser.role = "user";

          await checkUser.save();

          return res
            .status(200)
            .json({ message: `Role changed to ${checkUser.role}` });
        } else {
          const requiredDocs = [
            "identificacion",
            "comprobantededomicilio",
            "comprobantedeestadodecuenta",
          ];

          const docs = checkUser.documents.map((doc) => doc.docType);

          const missingDocs = requiredDocs.filter(
            (reqDoc) => !docs.includes(reqDoc)
          );

          if (missingDocs.length > 0) {
            return res.status(400).json({
              message:
                "Error - User cannot be premium until it finishes uploading required documentation.",
            });
          }

          checkUser.role = "premium";

          await checkUser.save();

          return res
            .status(200)
            .json({ message: `Role changed to ${checkUser.role}` });
        }
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in togglePremium - user.controller.js",
    });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await UserService.findUser(null, uid);

    if (!user) {
      return res.status(404).json({ message: "Error - User not found." });
    } else {
      if (!req.files || req.files.length === 0) {
        return res.status(404).json({ message: "Error - No files found." });
      } else {
        for (const doc of req.files) {
          const { originalname, filename } = doc;
          const { document_type } = req.body;
          const docType = document_type;

          user.documents.push({
            name: originalname.replace(/\s/g, "").toLowerCase(),
            reference: filename.replace(/\s/g, "").toLowerCase(),
            docType: docType.replace(/\s/g, "").toLowerCase(),
          });
        }

        await user.save();

        return res
          .status(200)
          .json({ message: "Documents successfully uploaded." });
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in uploadDocuments - user.controller.js.",
    });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    const currentDate = new Date();
    const limitDate = new Date(currentDate);
    limitDate.setDate(currentDate.getDate() - 2);

    const inactiveUsers = await UserService.getInactiveUsers(limitDate);

    if (inactiveUsers.length === 0) {
      return res
        .status(404)
        .json({ message: "Error - No inactive users found." });
    } else {
      const userCarts = inactiveUsers.map((user) =>
        user.carts.map((cart) => String(cart._id))
      );
      const userEmails = inactiveUsers.map((user) => user.email);

      for (const cart of userCarts) {
        const cid = cart[0];
        await CartService.deleteCartById(cid);
      }

      for (const user of userEmails) {
        const result = await sendDeletedAccountMail(user);
        if (!result.success) {
          return res
            .status(400)
            .json({ message: `Error - Email could not be sent to ${user}.` });
        }
      }
      await UserService.deleteInactiveUsers(limitDate);

      return res.status(200).json({
        message: "Inactive users successfully notified and deleted.",
      });
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "Server side error - in deleteUsers - user.controller.js",
    });
  }
};
