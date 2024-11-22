export const createEmailTemplate = (userData, verificationCode) => {
    return `
      <html>
        <body>
         <img src="https://res.cloudinary.com/du6q3fppu/image/upload/f_auto,q_auto/jyyj80spczglaugxmyj5" alt="Logo de Cándida Gres" style="width: 100%; max-width: 150px; display: block;">
          <h1>Hola, ${userData.first_name ?? userData.email}</h1>
          <p>Recibimos una solicitud para restaurar tu contraseña. Tu código de verificación es:</p>
          <p style="font-size: 2rem;">${verificationCode}</p>
          <p>Tendrás 5 minutos para ingresarlo.</p>
          <p>Si no solicitaste el cambio, podés ignorar este mensaje.</p>
        </body>
      </html>
    `;
};

