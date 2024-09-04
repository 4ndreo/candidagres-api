import { Preference } from 'mercadopago';
import { MercadoPagoConfig } from 'mercadopago';


// Agrega credenciales

const client = new MercadoPagoConfig({ accessToken: "APP_USR-8875919460375661-090318-f1b6a6119c02afce564c4037f19d43b7-1950755273" });

const preference = new Preference(client);

async function createPreference(req, res) {
    try {
        console.log(req.body)
        const body = {
            items: req.body,
            back_urls: {
                success: 'http://localhost:3000/',
                failure: 'http://localhost:3000/',
                pending: 'http://localhost:3000/'
            },
            auto_return: 'approved',
        }
        const result = await preference.create({ body })
        res.json({
            id: result.id
        })

    } catch (error) {
    }
}



export default {
    createPreference
}