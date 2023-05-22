const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

const {getUserProfile, editUser, deleteUser} = require('../tedious/tedious')

// api/profile
router.get('/', auth, async (req, res) => {
    try {
        getUserProfile(req.user.userId, req.user.userPosition, result => {
                res.json({result})
            }
        )
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// api/profile/edit
router.post('/', auth, async (req, res) => {
    try {
        const {firstName, lastName, email, phone, date, salary, idUser} = req.body
        if (idUser) {
            editUser(idUser, req.user.userPosition, lastName + ' ' + firstName, email, phone, date, salary, message => {
                res.status(202).json({message: message})
            })
        } else {
            editUser(req.user.userId, req.user.userPosition, lastName + ' ' + firstName, email, phone, date, salary, message => {
                res.status(202).json({message: message})
            })
        }
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

// api/profile/delete
router.delete('/', auth, async (req, res) => {
    try {
        const {idWorker} = req.body

        deleteUser(idWorker)
        res.status(202).json({message: 'Профиль работника удалён'})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router
