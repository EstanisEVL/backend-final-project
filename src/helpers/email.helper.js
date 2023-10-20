import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD, RESET_URL } from "../config/config.js";
import { generateMailToken } from "../utils/jwt.js";

export const sendMail = async (email, amount, date) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });
  try {
    let result = await transporter.sendMail({
      from: EMAIL,
      to: email,
      subject: "Confirmación de compra",
      html: `
        <div>
          <h1>¡Gracias por tu compra ${email}!</h1>
          <h2>Detalle:</h2>
          <p>Compra realizada en: ${date}</p>
          <p>Total: $ ${amount}</p>
        </div>
      `,
    });
    return { success: true, result }
  } catch (err) {
    console.log(err);
    return { success: false, error: err }
  }
};

export const sendRecoveryMail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });
  try {
    const token = generateMailToken(user.email);
    const link = `${RESET_URL}/reset/${token}`;
    let result = await transporter.sendMail({
      from: EMAIL,
      to: user.email,
      subject: "Re-establecer contraseña",
      html: `
        <div>
          <h1>¡Hola, ${user.email}!</h1>
          <h2>Para reestablecer tu contraseña haz click en el siguiente botón:</h2>
          <a href=${link}>REESTABLECER CONTRASEÑA</a>
          <p>Recuerda que el link para reestablecer tu contraseña expira en 1 hora.</p>
        </div>
      `,
    });
    return { success: true, result }
  } catch (err) {
    console.log(err);
    return { success: false, error: err }
  }
};

export const sendDeletedAccountMail = async (userEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });
  try {
    let result = await transporter.sendMail({
      from: EMAIL,
      to: userEmail,
      subject: "Cuenta eliminada por inactividad",
      html: `
        <div>
          <h1>¡Hola, ${userEmail}!</h1>
          <h2>Tu cuenta ha sido eliminada:</h2>
          <p>Debido a que has permanecido sin iniciar sesión por más de 48 horas.</p>
        </div>
      `,
    });
    return { success: true, result }
  } catch (err) {
    console.log(err);
    return { success: false, error: err }
  }
};

export const sendDeletedProductMail = async (userEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });
  try {
    let result = await transporter.sendMail({
      from: EMAIL,
      to: userEmail,
      subject: "Producto eliminado",
      html: `
        <div>
          <h1>¡Hola, ${userEmail}!</h1>
          <h2>El producto que habías creado ha sido eliminado.</h2>
          <p>Sólo tu o el administrador del sitio pueden haber realizado la eliminación del producto.</p>
        </div>
      `,
    });
    return { success: true, result }
  } catch (err) {
    console.log(err);
    return { success: false, error: err }
  }
}