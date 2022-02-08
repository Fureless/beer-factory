const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

const {getOrders, getCustomerId, createOrder, changeStatus} = require('../tedious/tedious')

// api/orders
router.get(
    '/', auth, async (req, res) => {
        try {
            // ЗАПРОС
            getOrders(req.user.userId, req.user.userPosition, result => {
                res.json({result})
            })

            // getCustomerId(req.user.userId, idCustomer => {
            //     getCustomerOrders(idCustomer, result => {
            //         res.json({result})
            //     })
            // })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// api/orders/create
router.post(
    '/create', auth, async (req, res) => {
        try {
            const {idBeer, idUser, quantity} = req.body

            // ЗАПРОС
            // TODO Убрать getCustomer ID?
            getCustomerId(idUser, idCustomer => {
                createOrder(idBeer, idCustomer, quantity)
                res.status(201).json({message: 'Заказ создан'})
            })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// api/orders/status
router.post(
    '/status', auth, async (req, res) => {
        try {
            const {idOrder, idStatus} = req.body

            // ЗАПРОС
            changeStatus(idOrder, idStatus)

            res.status(201).json({message: 'Заказ отменен/изменен'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

module.exports = router
