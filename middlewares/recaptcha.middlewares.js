async function validateRecaptcha(req, res, next) {
  const validator = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.recaptcha}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((resp) => resp.json())
  if (validator.success) {
    return next();
  }
  return res.status(400).json({ err: { recaptcha: 'Por favor, completá el captcha.' } });
}

export { validateRecaptcha };
