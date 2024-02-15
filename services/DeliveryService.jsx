export default class DeliveryService {
    static async getDonatorDeliveries (user) {
        return [
            {Id:1,
            Donator:{name:'hfghf'},
            Organization:{name:'hfghfghfg'},
            Delivery_date:Date('12.2.2024'),
            status:'finished',
            donation:{
                items:[{name:'shirts', amount:50},{name:'shoes', amount:50}],
                status:'finished'
            }},
            {Id:2,
                Donator:{name:'hfghf'},
                Organization:{name:'hfghfghfg'},
                Delivery_date:Date('13.2.2024'),
                status:'finished',
                donation:{
                    items:[{name:'shirts', amount:50},{name:'shoes', amount:50}],
                    status:'finished'
            }}
        ];
    }
}