import nodemailer from "nodemailer";

export const emails = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //   Informacion del email
  const info = await transport.sendMail({
    from: "UpTask - Administrador de Proyectos",
    to: email,
    subject: "UpTask Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `
        <p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya casi esta lista, solo tienes que confirmala en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>    
        <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
   `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //   Informacion del email
  const info = await transport.sendMail({
    from: "UpTask - Administrador de Proyectos",
    to: email,
    subject: "UpTask Restablece tu password",
    text: "Comprueba tu cuenta en UpTask",
    html: `
        <p>Hola: ${nombre} has solicitado reestablecer tu password</p>
        <p>Sigue en el siguiente enlace para generar un nuevo password:</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>    
        <p>Si tu no solicitaste esta email, puedes ignorar el mensaje</p>
   `,
  });
};
