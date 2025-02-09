import { transport } from "../config/nodemailer";

type EmailType = {
      name: string
      email: string
      token: string
};

export class AuthEmail {
      static sendConfirmationEmail = async (user: EmailType) => {
            //console.log(user);
            const email = await transport.sendMail({
                  from: 'CashTrackr <admin@cashtrackr.com>',//si esto no funciona le colocamos @gmail.com
                  to: user.email,
                  subject: 'Cashtrackr - Confirma tu cuenta',
                  html: `
                        <p>Hola ${user.name}, has creado tu  cuenta en Cashtrackr, ya esta casi lista</p>
                        <p>Visita el siguiente enlace:</p>
                        <a href="#">Confirmar Cuenta</a>
                        <p>e ingresa el código: <b>${user.token}</b></p>
                  `
            });
            // console.log('Mensaje enviado ', email.messageId);
      };

      static sendPasswordResetToken = async (user: EmailType) => {
            //console.log(user);
            const email = await transport.sendMail({
                  from: 'CashTrackr <admin@cashtrackr.com>',//si esto no funciona le colocamos @gmail.com
                  to: user.email,
                  subject: 'Cashtrackr - Restablece tu Password',
                  html: `
                        <p>Hola ${user.name}, has solicitado reestablecer tu password</p>
                        <p>Visita el siguiente enlace:</p>
                        <a href="#">Reestablecer Password</a>
                        <p>e ingresa el código: <b>${user.token}</b></p>
                  `
            });
            // console.log('Mensaje enviado ', email.messageId);
      };
};