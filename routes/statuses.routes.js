const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const router = Router()

const {getStatuses, addStatus} = require('../tedious/tedious')

// /api/statuses
router.get(
    '/', auth,  async (req, res) => {
        try {
            getStatuses(result => {
                res.json({result})
            })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

// /api/statuses
router.post(
    '/', auth,  async (req, res) => {
        try {
            const {status} = req.body
            addStatus(status)
            res.status(201).json({message: 'Статус добавлен'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router
