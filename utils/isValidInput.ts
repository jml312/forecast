export async function isValidInput({ validationSchema, fields }) {
  const values = fields.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {});

  let isValid;
  try {
    await validationSchema.validate(values, { strict: true });
    isValid = true;
  } catch ({ path, message }) {
    fields.forEach(({ name, setError, ref }) => {
      if (path === name) {
        setError(message);
        ref.current.focus();
        isValid = false;
      }
    });
  } finally {
    return isValid;
  }
}
