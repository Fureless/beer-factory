const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

const {getOrders, getCustomerId, createOrder, changeStatus, changeWorker, deleteOrder, getOrdersWorkers} = require('../tedious/tedious')

// api/orders
router.get(
    '/', auth, async (req, res) => {
        try {
            getOrders(req.user.userId, req.user.userPosition, result => {
                res.json({result})
            })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// api/orders/workers
router.get(
    '/workers', auth, async (req, res) => {
        try {
            getOrdersWorkers(result => {
                res.json({result})
            })
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

// api/orders/changeStatus
router.post(
    '/changeStatus', auth, async (req, res) => {
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

// api/orders/changeWorker
router.post(
    '/changeWorker', auth, async (req, res) => {
        try {
            const {idOrder, idWorker} = req.body

            // ЗАПРОС
            changeWorker(idOrder, idWorker)

            res.status(201).json({message: 'Работник назначен'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

// api/orders/delete
router.post(
    '/delete', auth, async (req, res) => {
        try {
            const {idOrder} = req.body

            // ЗАПРОС
            deleteOrder(idOrder)

            res.status(201).json({message: 'Заказ удалён'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    }
)

module.exports = router
