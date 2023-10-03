# BLKY Pets - API
## Coderhouse's backend programming course - commission 43335

##### Version: 1.0.1

---

### Index:

1. [Project structure](#project-structure).
2. [Environment variables](#environment-variables).
3. [How to run the app](#how-to-run-the-app).

---

### Project structure:

src

└─── config         # carga de variables de entorno para desarrollo, testing y producción.

└─── controllers    # controladores que se comunican con los servicios, con validaciones y middlewares.

└─── dao 

├───└─── managers   # managers

└───└─── models     # modelos de la base de datos (MongoDb)

└─── middlewares     # operaciones que controlan o manipulan las peticiones a procesar por el controlador

└─── public

├───└─── assets    # iconos e imágenes

└───└─── css       # estilos CSS

└─── routes          # rutas de Express.js que definen la estructura de la API

└─── services        # intercede entre el controlador y la capa de persistencia, y utiliza los modelos.

└─── utils           # funciones y métodos utilitarios

└─── views           # vistas de Handlebars

app.js          # punto de entrada de la aplicación

---

### Environment variables:

The application supports three environments: **development**, **qa** and **production**. The variables for each environment are located in the corresponding .env files and include:

```
PORT
MONGO_USER
MONGO_PASSWORD
MONGO_URL
ADMIN_EMAIL
ADMIN_PASSWORD
SECRET_JWT

```

---

### How to run the app:

Once the the .env files are correctly configured, you can run the app in any of its environments. Just execute the command `npm run start:<env>`. Environment options can be `dev`, `qa` or `prod`.