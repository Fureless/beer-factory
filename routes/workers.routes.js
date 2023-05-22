const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const router = Router()

const {getWorkers, getWorkerOrders} = require('../tedious/tedious')

// /api/workers
router.get(
    '/', auth,  async (req, res) => {
        try {
            getWorkers(result => {
                res.json({result})
            })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

// /api/workers/orders
router.post(
    '/orders', auth,  async (req, res) => {
        try {
            const {idWorker} = req.body
            getWorkerOrders(idWorker, result => {
                res.json({result})
            })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router
