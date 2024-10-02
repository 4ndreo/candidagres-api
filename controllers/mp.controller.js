import { Preference, MercadoPagoConfig, Payment } from 'mercadopago';
import * as comprasService from '../services/compras.service.js';
import * as carritoService from '../services/carrito.service.js';


async function createPreference(req, res) {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

    const preference = new Preference(client);
    try {

        const body = {
            items: req.body.items,
            metadata: { usuarioId: req.body.usuarioId, carritoId: req.body.carritoId, totalQuantity: req.body.totalQuantity, totalDelay: req.body.totalDelay
            },
            back_urls: {
                success: `http://localhost:3000/store`,
                failure: `http://localhost:3000/store/carrito/id-${req.body.usuarioId}`,
                pending: 'http://localhost:2025/api/'
            },
            notification_url: `https://8lmf1sds-2025.brs.devtunnels.ms/api/webhook`,
            auto_return: 'approved',
        }

        if (req.body.items.length === 0) {
            throw new Error('No hay productos en el carrito.')
        }

        const result = await preference.create({ body })
        return res.json(
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
            const purchase = await comprasService.create({
                usuarioId: resp.metadata.usuario_id,
                carritoId: resp.metadata.carrito_id,
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
                await carritoService.remove(purchase.carritoId)
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