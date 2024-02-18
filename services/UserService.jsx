import axios from 'axios'
export default class UserService {
    static async addUser (user) {
        const result = await axios({
            method: 'post',
            url: 'https://givehub-server.onrender.com/api/users',
            data: user
        });
        return result;
    }
    static async getAllUser () {
        const result = await axios({
            method: 'get',
            url: 'https://givehub-server.onrender.com/api/users',
        });
        return result;
    }
}