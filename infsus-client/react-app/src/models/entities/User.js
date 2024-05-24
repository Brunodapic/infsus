
import { UserRoleEnum } from '../enums/UserRoleEnum';
import { GenderEnum } from '../enums/GenderEnum';

/**
 * Represents a user.
 */
export class User {
  /**
   * @param {number} id - The user ID.
   * @param {string} username - The username.
   * @param {string} email - The email address.
   * @param {string} password - The password.
   * @param {string} firstName - The first name.
   * @param {string} lastName - The last name.
   * @param {GenderEnum} gender - The gender.
   * @param {UserRoleEnum} role - The user role.
   * @param {string} image - The path to the user's image.
   */
  constructor(id, username, email, password, firstName, lastName, gender, role, image) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.role = role;
    this.image = image;
  }

  /**
   * Creates a User instance from a JSON object.
   * @param {Object} json - The JSON object.
   * @returns {User} The User instance.
   */
  static fromJson(json) {
    return new User(
      json.id,
      json.username,
      json.email,
      json.password,
      json.firstName,
      json.lastName,
      json.gender,
      json.role,
      json.image
    );
  }


}
