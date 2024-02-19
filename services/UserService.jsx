import axios from "axios";
export default class UserService {
  static async addUser(user) {
    const result = await axios.post(
      "https://givehub-server.onrender.com/api/users",
      user
    );
    return result.data;
  }
  static async getAllUser() {
    try {
      const result = await axios.get(
        "https://givehub-server.onrender.com/api/users"
      );
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
}
