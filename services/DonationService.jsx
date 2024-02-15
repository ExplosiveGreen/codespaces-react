export default class DonationService {
    static async getDonatorDonations (user) {
        return [
            {
                id:1,
                items:[{name:'shirts', amount:50},{name:'shoes', amount:50}],
                status:'finished'
            },
            {
                Id:2,
                items:[{name:'shirts', amount:60},{name:'shoes', amount:60}],
                status:'finished'
            }
        ];
    }
}