import { Preference } from 'mercadopago';
import { MercadoPagoConfig } from 'mercadopago';
import * as comprasService from '../services/compras.service.js';
import * as carritoService from '../services/carrito.service.js';


// Agrega credenciales

const client = new MercadoPagoConfig({ accessToken: "APP_USR-8875919460375661-090318-f1b6a6119c02afce564c4037f19d43b7-1950755273" });

const preference = new Preference(client);

async function createPreference(req, res) {
    try {
        let pendingPurchase = await comprasService.findPendingByCartId(req.body.carritoId)
        
        if (pendingPurchase && pendingPurchase.length > 0 && pendingPurchase !== undefined) {
            pendingPurchase = await comprasService.update(pendingPurchase[0]._id, { items: req.body.items, totalCost: req.body.totalCost, totalQuantity: req.body.totalQuantity, totalDelay: req.body.totalDelay })
        }

        if (!pendingPurchase || pendingPurchase.length === 0 || pendingPurchase === undefined) {
            pendingPurchase = await comprasService.create({
                usuarioId: req.body.usuarioId,
                carritoId: req.body.carritoId,
                items: req.body.items,
                state: "pending",
                created_at: new Date(),
                totalCost: req.body.totalCost,
                totalQuantity: req.body.totalQuantity,
                totalDelay: req.body.totalDelay,
                delivered_at: null
            }
            )
        }
        const body = {
            items: req.body.items,
            back_urls: {
                success: `http://localhost:2025/api/feedback/${typeof pendingPurchase === 'object' ? pendingPurchase._id : pendingPurchase[0]._id}`,
                failure: `http://localhost:3000/store/carrito/id-${req.body.usuarioId}`,
                pending: 'http://localhost:2025/api/'
            },
            notification_url: `https://fcd0-2800-810-454-152-6de5-daf8-4ffb-179a.ngrok-free.app/api/webhook`,
            auto_return: 'approved',
        }

        if (pendingPurchase) {
            const result = await preference.create({ body })
            return res.json({
                id: result.id
            })
        }

        if (pendingPurchase.items.length === 0) {
            return res.json({
                success: false,
                message: 'No hay productos en el carrito.'
            })
        }

    } catch (error) {
        return res.json({
            id: error.id
        })
    }
}

async function feedback(req, res) {
    try {
        if (req.query.status === 'approved') {
            const purchaseApproved = await comprasService.update(req.params.id, {
                state: 'approved',
                Payment: req.query.payment_id,
                Status: req.query.status,
                MerchantOrder: req.query.merchant_order_id
            })
            const deletedCart = await carritoService.remove(purchaseApproved.carritoId)
            if (purchaseApproved && deletedCart) {
                res.redirect('http://localhost:3000/store');
            }

        }
        // res.json({
        //     Payment: req.query.payment_id,
        //     Status: req.query.status,
        //     MerchantOrder: req.query.merchant_order_id
        // });
        // const body = {
        //     items: req.body,
        //     back_urls: {
        //         success: 'http://localhost:2025/api/feedback',
        //         failure: 'http://localhost:2025/api/feedback',
        //         pending: 'http://localhost:2025/api/'
        //     },
        //     auto_return: 'approved',
        // }
        // const result = await preference.create({ body })
        // res.json({
        //     id: result.id
        // })

    } catch (error) {
    }
}

function receiveWebhook(req, res) {
    console.log('webhook received');
    res.json({
        message: 'Webhook received'
    })
}


export default {
    createPreference,
    feedback,
    receiveWebhook
}