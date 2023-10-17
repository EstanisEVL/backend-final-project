export default class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.name = `${user.first_name} ${user.last_name}`;
    this.email = user.email;
    this.age = user.age;
    this.userCarts = user.carts;
    this.role = user.role.toUpperCase();
    this.documents = user.documents;
    this.last_connection = `Última conexión: ${user.last_connection?.toLocaleString(
      "es-Es",
      {
        timeZone: "America/Argentina/Buenos_aires",
      }
    )}`;
  }
}
