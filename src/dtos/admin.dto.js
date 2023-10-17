export default class AdminDTO {
  constructor(admin) {
    this.fullName = `${admin.first_name} ${admin.last_name}`;
    this.email = admin.email;
    this.role = admin.role.toUpperCase();
  }
}
