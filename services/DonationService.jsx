export default class DonationService {
    static async getDonatorDonations (user) {
        try{
            const result = await axios.get("https://givehub-server.onrender.com/api/donations")
            return result.data;
        }catch(e) {
            console.log(e)
        }
    }
}