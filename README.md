# BLKY Pets - API
## Coderhouse's backend programming course - commission 43335

##### Version: 1.0.1

---

### Index:

1. [Project structure](#project-structure).
2. [Environment variables](#environment-variables).
3. [How to run the app](#how-to-run-the-app).
4. [Test coverage](#test-coverage).
5. [API docs](#api-docs).

---

### Project structure:
- **errors**
└─── errors.log     # Error log file. (This file logs errors.)

- **src**

└─── **config**

├───└─── *config.js* # Loads variables for the three supported environments: development, testing, and production.

├───└─── *passport.config.js* # Handles passport configuration for authentication.

└───└─── *swagger.config.js* # Configures Swagger documentation for your API.

└─── **constants** 

└───└─── *roles.js* # Defines the app's supported roles.

└─── **controllers** 

├───└─── *cart.controller.js* # Manages cart-related functionality.

├───└─── *product.controller.js* # Controls product-related actions.

├───└─── *session.controller.js* # Handles user sessions.

├───└─── *user.controller.js* # Manages user-related operations.

└───└─── *view.controller.js* # Controls view-related functionality.

└─── **dao**

├───└─── **mongodb**

├───└───└─── *cart.mongo.js* # Defines MongoDB operations for the cart.

├───└───└─── *product.mongo.js* # Defines MongoDB operations for products.

├───└───└─── *ticket.mongo.js* # Manages ticket-related data in MongoDB.

├───└───└─── *user.mongo.js* # Manages user data in MongoDB.

└───└─── *factory.js* # Provides a factory for creating data access objects.

└─── **docs**

├───└─── **carts**

├───└───└─── *carts.yml* # API documentation for cart entity.

├───└─── **products**

├───└───└─── *products.yml* # API documentation for product entity.

├───└─── **sessions**

├───└───└─── *sessions.yml* # API documentation for session entity.

├───└─── **users**

└───└───└─── *users.yml* # API documentation for user entity.

└─── **dtos**

├───└─── *admin.dto.js* # Data transfer object for admin-related information.

├───└─── *auth.dto.js* # Data transfer object for authentication.

├───└─── *cart.dto.js* # Data transfer object for cart-related data.

├───└─── *product.dto.js* # Data transfer object for product-related data.

├───└─── *ticket.dto.js* # Data transfer object for ticket-related information.

├───└─── *user.dto.js* # Data transfer object for user-related data.

└── **helpers**

└───└─── *email.helper.js* # Provides helper functions for email-related tasks.

└── **middlewares**

├───└─── *handle-policies.middleware.js* # Handles policies in the application.

├───└─── *handle-uploads.middleware.js* # Manages file uploads.

├───└─── *validate-fields.middleware.js* # Validates request fields.

├───└─── *validate-mongoid.middleware.js* # Validates MongoDB object IDs.

└───└─── *verify-token.middleware.js* # Verifies user tokens.

└── **models**

├───└─── *cart.model.js* # Defines the data model for carts.

├───└─── *product.model.js* # Defines the data model for products.

├───└─── *ticket.model.js* # Defines the data model for tickets.

└───└─── *user.model.js* # Defines the data model for users.

└─── **public**

├───└─── **assets** # Public assets folder.

├───└─── **css**

└───└───└─── *styles.css* # Stylesheet for the application.

├───└─── **js**

└───└───└─── *index.js* # Main JavaScript file for the application.

├───└─── **uploads**

├───└───└─── **documents** # Folder for uploaded documents.

├───└───└─── **products** # Folder for uploaded product images.

├───└───└─── **profiles** # Folder for user profile images.

└── **repositories**

├───└─── **carts**

└───└───└─── *cart.repository.js* # Manages cart-related data in the repository.

├───└─── **products**

└───└───└─── *product.repository.js* # Manages product-related data in the repository.

├───└─── **tickets**

└───└───└─── *ticket.repository.js* # Manages ticket-related data in the repository.

├───└─── **users**

└───└───└─── *user.repository.js* # Manages user-related data in the repository.

└───└─── *index.js* # Central repository index.

└─── **routes**

├───└─── *cart.routes.js* # Defines routes for cart-related endpoints.

├───└─── *product.routes.js* # Defines routes for product-related endpoints.

├───└─── *session.routes.js* # Defines routes for session-related endpoints.

├───└─── *user.routes.js* # Defines routes for user-related endpoints.

└───└─── *view.routes.js* # Defines routes for view-related endpoints.

└─── **utils**

├───└─── *connect.js* # Manages database connection.

├───└─── *encrypt.js* # Provides encryption utilities.

├───└─── *jwt.js* # Manages JSON Web Tokens (JWT).

├───└─── *logger.js* # Logging utilities.

└───└─── *validate.js* # Validation helper functions.

└─── **views**

├───└─── **layouts**

└───└───└─── *main.handlebars* # Main layout template for the application.

├───└─── *admin.handlebars* # Admin interface view template.

├───└─── *login.handlebars* # Login view template.

├───└─── *profile.handlebars* # User profile view template.

├───└─── *recover.handlebars* # Password recovery view template.

├───└─── *register.handlebars* # User registration view template.

├───└─── *reset.handlebars* # Password reset view template.

└───└─── *success.handlebars* # Success message view template.

└── *app.js* # Application entry point.

└── *utils.js* # Miscellaneous utility functions.


- **test**

└─── **integration**

├───└─── **carts**

└───└───└─── *cart.functional.test.js* # Functional tests for cart-related functionality.

├───└─── **products**

└───└───└─── *product.functional.test.js* # Functional tests for product-related functionality.

├───└─── **sessions**

└───└───└─── *session.functional.test.js* # Functional tests for session-related functionality.

├───└─── **users**

└───└───└─── *user.functional.test.js* # Functional tests for user-related functionality.

└───└─── *test.png* # A small image file to test upload endpoints.

└── **unit**

├───└─── **carts**

└───└───└─── *cart.mongo.test.js* # Unit tests for cart MongoDB operations.

├───└─── **products**

└───└───└─── *product.mongo.test.js* # Unit tests for product MongoDB operations.

├───└─── **tickets**

└───└───└─── *ticket.mongo.test.js* # Unit tests for ticket MongoDB operations.

└───└─── **users**

└───└───└─── *user.mongo.test.js* # Unit tests for user MongoDB operations.


- *.gitignore* # Git ignore file.

- *package-lock.json* # Lock file for package dependencies.

- *package.json* # Project dependencies and settings.

- *README.md* # The README file you are currently reading.

---

### Environment variables:

The application supports three environments: **development**, **qa** and **production**. The variables for each environment are located in the corresponding .env files and include:

```
API_VERSION
NODE_ENV
PORT
PERSISTENCE
MONGO_URL
ADMIN_EMAIL
ADMIN_PASSWORD
SECRET_JWT
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL
EMAIL
EMAIL_PASSWORD
BASE_API_URL
RESET_URL
SESSION_ROUTES
USER_ROUTES
CART_ROUTES
PRODUCT_ROUTES
```

---

### How to run the app:

You can visit the live version of the app here: [link](https://backend-final-project-production.up.railway.app).

Alternatively: feel free to fork the repo and once the .env files are correctly configured, you can run the app in any of its environments. Just execute the command `npm run start:<env>`. Environment options can be `dev`, `qa` or `prod`. Remember to install node_modules folder with `npm install`.

---

### Test coverage:

The project also includes both unit and functional tests that you can run using the following commands:

**Unitary tests:** 
```
npm run test:unit:carts
npm run test:unit:products
npm run test:unit:tickets
npm run test:unit:users
```

**Functional tests:** 
```
npm run test:functional:carts
npm run test:functional:products
npm run test:functional:tickets
npm run test:functional:users
```
---

### API docs:

This project utilizes Swagger for API documentation and exploration. You can access the Swagger UI to view and test the API endpoints by following these steps:

1. Ensure the project is running (the API server is up).
2. Open a web browser and navigate to the Swagger UI URL, typically available at: `http://localhost:PORT/api/API_VERSION/docs`
Replace `PORT` with the actual port your API server is running on.
3. You'll be presented with the Swagger UI interface where you can explore the available endpoints, make test requests, and access detailed documentation.

---