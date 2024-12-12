import { Preference, MercadoPagoConfig, Payment } from 'mercadopago';
import * as purchasesService from '../services/purchases.service.js';
import * as cartsService from '../services/cart.service.js';


async function createPreference(req, res) {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

    const preference = new Preference(client);
    try {
        const body = {
            items: req.body.items,
            metadata: {
                id_user: req.body.id_user, id_cart: req.body.id_cart, totalQuantity: req.body.totalQuantity, totalDelay: req.body.totalDelay
            },
            back_urls: {
                success: `${process.env.FRONT_URL}/store`,
                failure: `${process.env.FRONT_URL}/store/cart/${req.body.id_user}`,
                pending: `${process.env.FRONT_URL}/store/cart/${req.body.id_user}?status=pending`
            },
            notification_url: `${process.env.BACK_URL}/webhook`,
            auto_return: 'approved',
        }

        if (req.body.items.length === 0) {
            throw new Error('No hay productos en el carrito.')
        }

        const result = await preference.create({ body })
        return res.status(201).json(
            result
        )
    } catch (error) {
        res.status(404).json({ success: false, message: error.message })
    }
}

async function receiveWebhook(req, res) {
    if (req.query.hasOwnProperty('data.id')) {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);
        
        payment.get({
            id: req.query['data.id'],
        }).then(async (resp) => {
            const purchase = await purchasesService.filter({ mp_id: resp.order.id })
            if (purchase && resp.order.id !== purchase.mp_id) {
                const purchase = await purchasesService.create({
                    id_user: resp.metadata.id_user,
                    id_cart: resp.metadata.id_cart,
                    items: resp.additional_info.items,
                    created_at: new Date(),
                    totalCost: resp.transaction_amount,
                    totalQuantity: resp.metadata.total_quantity,
                    totalDelay: resp.metadata.total_delay,
                    mp_card: resp.card,
                    mp_fee_details: resp.fee_details,
                    mp_id: resp.order.id,
                    mp_payer: resp.payer,
                    delivered_at: null
                })
                if (purchase._id) {
                    await cartsService.remove(purchase.id_cart)
                }
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    res.json({
        message: 'Webhook received'
    })
}


export default {
    createPreference,
    receiveWebhook
}