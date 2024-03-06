import axios from "axios";

export default class DeliveryService {
    static async getDonatorDeliveries (user) {
        try{
        const result = await axios.get("https://givehub-server.onrender.com/api/deliveries")
        return result.data;
        }catch(e) {
            console.log(e)
        }
    }
    static async getDeliverieById (id) {
        try{
        const result = await axios.get(`https://givehub-server.onrender.com/api/deliveries/${id}`)
        return result.data;
        }catch(e) {
            console.log(e)
        }
    }
    static async deleteDelivery (id) {
        try{
        const result = await axios.delete(`https://givehub-server.onrender.com/api/deliveries/${id}`)
        return result.data;
        }catch(e) {
            console.log(e)
        }
    }
    static async updateDelivery (delivery) {
        try{
            const result = await axios.put(`https://givehub-server.onrender.com/api/deliveries/${delivery._id}`,delivery)
            return result.data;
        }catch(e) {
            console.log(e)
        }
    }
    static async addDelivery (delivery) {
        try{
            const result = await axios.post(`https://givehub-server.onrender.com/api/deliveries/`,delivery)
            return result.data;
        }catch(e) {
            console.log(e)
        }
    }
}