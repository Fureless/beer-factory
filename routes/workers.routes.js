const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const router = Router()

const {getWorkers} = require('../tedious/tedious')

//ПРОВЕРИТЬ ТИПЫ ДАННЫХ
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

module.exports = router
