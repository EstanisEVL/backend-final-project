import validationUtils from "../utils/validate.js";

export const validateBodyFields = (req, res, next) => {
  const { first_name, last_name, email, age, password } = req.body;

  if (!validationUtils.validateRegisterBody(req.body)) {
    return res
      .status(400)
      .json({ message: "Error - Please fill all required fields." });
  }

  if (!validationUtils.validateInput(first_name)) {
    return res.status(400).json({
      message: `Error - ${first_name} is not a valid name, it must contain only letters and its length must be between 4 and 20 characters.`,
    });
  }

  if (!validationUtils.validateInput(last_name)) {
    return res.status(400).json({
      message: `Error - ${last_name} is not a valid name, it must contain only letters and its length must be between 4 and 20 characters.`,
    });
  }

  if (!validationUtils.validateEmail(email)) {
    return res
      .status(400)
      .json({ message: "Error - Please enter a valid email address." });
  }

  if (validationUtils.validateAge(age)) {
    return res
      .status(400)
      .json({ message: "Error - Please enter a valid age." });
  }

  if (validationUtils.validatePassword(password)) {
    return res
      .status(400)
      .json({ message: validationUtils.validatePassword(password) });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!validationUtils.validateLoginBody(email, password)) {
    return res
      .status(400)
      .json({ message: "Error - Please fill all required fields." });
  }

  next();
};

export const validateReset = (req, res, next) => {
  const { email, password } = req.body;

  if (!validationUtils.validateLoginBody(email, password)) {
    return res
      .status(400)
      .json({ message: "Error - Please fill all required fields." });
  }

  if (!validationUtils.validateEmail(email)) {
    return res
      .status(400)
      .json({ message: "Error - Please enter a valid email address." });
  }

  if (validationUtils.validatePassword(password)) {
    return res
      .status(400)
      .json({ message: validationUtils.validatePassword(password) });
  }

  next();
};

export const validateProductInCartUpdate = (req, res, next) => {
  const { quantity, operation } = req.body;

  if (!validationUtils.validateUpdatedProductBody(quantity, operation)) {
    return res.status(400).json({
      message: "Error - Invalid product body.",
    });
  }

  next();
};

export const validateProductCreation = (req, res, next) => {
  const product = req.body;

  if (!validationUtils.validateProduct(product)) {
    return res.status(400).json({
      message:
        "Error - Please fill all required product fields (title, description, code, price, status, stock and category).",
    });
  } else {
    if (!validationUtils.validatePrice(product.price)) {
      return res.status(400).json({ message: "Error - Invalid price range." });
    }
  }

  next();
};

export const validateProductUpdate = (req, res, next) => {
  const productBody = req.body;

  if (!validationUtils.validateProductBody(productBody)) {
    return res.status(400).json({
      message:
        "Error - only title, description, code, price, status, stock and/or category can be modified.",
    });
  }

  try {
    validationUtils.validateFieldType(productBody);
    next();
  } catch (err) {
    return res.status(400).json({ message: err.message})
  }
};
