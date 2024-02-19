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
    const result = await axios.get(`https://givehub-server.onrender.com/api/users${userId}`);
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
  static async putDonationOrganization(org_id,donation_id){
    try {
      const result = await axios.put(`https://givehub-server.onrender.com/api/users/${org_id}`,{
        id:donation_id
      });
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
  static async getAllOrganizations(){
    try {
      const result = await axios.get(`https://givehub-server.onrender.com/api/users/org`);
      return result.data;
    } catch (e) {
      console.log(e);
    }
  }
}
