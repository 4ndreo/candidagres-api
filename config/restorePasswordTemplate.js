export const createEmailTemplate = (userData, verificationCode) => {
    // TODO: Add CGRES logo to the template
    return `
      <html>
        <body>
          <h1>Hola, ${userData.first_name}</h1>
          <p>Recibimos una solicitud para restaurar tu contraseña. Tu código de verificación es:</p>
          <p style="font-size: 2rem;">${verificationCode}</p>
          <p>Tendrás 5 minutos para ingresarlo.</p>
          <p>Si no solicitaste el cambio, podés ignorar este mensaje.</p>
        </body>
      </html>
    `;
};

