import axios from "axios";

export default class DonationService {
    static async getDonatorDonations (user) {
        try{
            const result = await axios.get("https://givehub-server.onrender.com/api/donations")
            return result.data;
        }catch(e) {
            console.log(e)
        }
    }
    static async putDonationRequest (donation) {
        try{
            const result = await axios.post(`https://givehub-server.onrender.com/api/donations`,donation)
            return result.data;
        }catch(e) {
            console.log(e)
        }
    }
    static async updateDonationRequest (donation) {
        try{
            const result = await axios.put(`https://givehub-server.onrender.com/api/donations/${donation._id}`,donation)
            return result.data;
        }catch(e) {
            console.log(e)
        }
    }
}