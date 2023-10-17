export default class AuthDTO {
  constructor(auth) {
    this.email = auth.user.email;
    this.role = auth.user.role.toUpperCase();
  }
}
