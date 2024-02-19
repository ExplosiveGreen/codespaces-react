import axios from 'axios'
export default class LocationService {
    static async getLocation () {
        try {
        const location = await axios.get('http://ip-api.com/json/');
        return location.data;
        }catch(e) {
            console.log(e)
        }
    }
}