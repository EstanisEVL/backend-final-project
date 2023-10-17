const validationUtils = {
  validateRegisterBody: (body) => {
    if (
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.age ||
      !body.password ||
      body.password === ""
    ) {
      return false;
    } else {
      return true;
    }
  },

  validateLoginBody: (email, password) => {
    if (!email || !password) {
      return false;
    } else {
      return true;
    }
  },

  validateInput: (input) => {
    const inputRegex = /^[A-Za-z]{4,20}$/;

    if (!inputRegex.test(input)) {
      return false;
    } else {
      return true;
    }
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    } else {
      return true;
    }
  },

  validateAge: (age) => {
    if (age <= 0 || age > 120) {
      return true;
    } else {
      return false;
    }
  },

  validatePassword: (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (password.length < 8) {
      return "Error - Password must be at least 8 characters long.";
    }
    if (!passwordRegex.test(password)) {
      return "Error - Password must have at least one lowercase letter, one uppercase letter, one number and one special character (@$!%*?&).";
    }
    return false;
  },

  validateProduct: (product) => {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.status ||
      !product.stock ||
      !product.category
    ) {
      return false;
    } else {
      return true;
    }
  },

  validateProductBody: (product) => {
    const fields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
    ];
    const productFields = Object.keys(product);

    const invalidFields = productFields.filter((field) => {
      return !fields.includes(field);
    });

    if (productFields.length > 0 && invalidFields.length === 0) {
      return true;
    } else {
      return false;
    }
  },

  validateFieldType: (productBody) => {
    const numFields = [ "code", "price", "stock" ];

    for (const field of Object.keys(productBody)) {
      if (numFields.includes(field)) {
        const value = Number(productBody[field]);
        

        if (isNaN(productBody[field])) {
          throw { status: 400, message: `Error - ${field} must be a number.`}
        }

        if(value <= 0) {
          throw { status: 400, message: `Error - ${field} must be a positive number greater than zero.`}
        }
      } else {
        if (typeof productBody[field] !== "string") {
          throw { status: 400, message: `Error - ${field} must be a string.`}
        }
      }
    }
  },

  validatePrice: (price) => {
    if (price <= 0) {
      return false;
    } else {
      return true;
    }
  },

  validateUpdatedProductBody: (quantity, operation) => {
    if (!quantity || quantity <= 0 || !operation) {
      return false;
    } else {
      return true;
    }
  },

  validateUpdatedCartBody: (updatedCartBody) => {
    if (!updatedCartBody.products) {
      return false;
    } else {
      return true;
    }
  },

  validateTicketBody: (ticketBody) => {
    if (
      !ticketBody.purchaser ||
      !ticketBody.purchase_datetime ||
      !ticketBody.amount
    ) {
      return false;
    } else {
      return true;
    }
  },
};

export default validationUtils;
