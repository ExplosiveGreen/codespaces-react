import axios from 'axios'
export default class LocationService {
    static async getLocation () {
        const location = await axios.get('http://ip-api.com/json/');
        return location;
    }
}