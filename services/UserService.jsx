import axios from "axios";
export default class UserService {
  static async addUser(user) {
    const result = await axios.post(
      "https://givehub-server.onrender.com/api/users",
      user
    );
    return result.data;
  }
  static async getUserById(userId) {
    const result = await axios.get(`https://givehub-server.onrender.com/api/users?_id=${userId}`);
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
  static async updateUser(user) {
    try {
      const result = await axios.put(`https://givehub-server.onrender.com/api/users/${user._id}`,user);
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
  static async putDonationOrganization(org_id,data){
    try {
      const result = await axios.put(`https://givehub-server.onrender.com/api/users/${org_id}`,data);
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
  static async getAllOrganizations(){
    try {
      const result = await axios.get(`https://givehub-server.onrender.com/api/users?__t=org`);
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
}