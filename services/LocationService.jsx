import axios from 'axios'
export default class LocationService {
    static async getLocation (address) {
        try {
        const location = await axios.get(`https://nominatim.openstreetmap.org/search?addressdetails=1&format=jsonv2&q=${address.split(" ").join("+")}`);
        return location.data;
        }catch(e) {
            console.log(e)
        }
    }
    static async getAddress (location) {
        try {
        const address = await axios.get(`https://nominatim.openstreetmap.org/reverse?addressdetails=1&format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`);
        return address.data;
        }catch(e) {
            console.log(e)
        }
    }
}