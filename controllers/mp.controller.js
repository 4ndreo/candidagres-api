import { Preference } from 'mercadopago';
import { MercadoPagoConfig } from 'mercadopago';
import * as comprasService from '../services/compras.service.js';


// Agrega credenciales

const client = new MercadoPagoConfig({ accessToken: "APP_USR-8875919460375661-090318-f1b6a6119c02afce564c4037f19d43b7-1950755273" });

const preference = new Preference(client);

async function createPreference(req, res) {
    try {
        console.log(req.body)
        let pendingPurchase = await comprasService.findPendingByCartId(req.body.carritoId)
        console.log('pending2', pendingPurchase)
        if (!pendingPurchase || pendingPurchase.length === 0 || pendingPurchase === undefined) {
            console.log('creando...')
            pendingPurchase = await comprasService.create({

                usuarioId: req.body.usuarioId,
                carritoId: req.body.carritoId,
                productos: req.body.items,
                state: req.body.state
            }
            )
        }


        const body = {
            items: req.body.items,
            back_urls: {
                success: `http://localhost:2025/api/feedback/${pendingPurchase.length === 0 ? pendingPurchase._id : pendingPurchase[0]._id}`,
                failure: `http://localhost:3000/tienda/carrito/id-${req.body.usuarioId}`,
                pending: 'http://localhost:2025/api/'
            },
            auto_return: 'approved',
        }

        console.log(body)

        if (pendingPurchase) {
            const result = await preference.create({ body })
            res.json({
                id: result.id
            })
        }

    } catch (error) {
    }
}

async function feedback(req, res) {
    try {
        res.redirect('http://localhost:3000/tienda');
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



export default {
    createPreference,
    feedback
}