const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')

const {getUserProfile, editUserProfile} = require('../tedious/tedious')

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
router.post('/edit', auth, async (req, res) => {
    try {
        const {firstName, lastName, email, phone, date, salary} = req.body

        editUserProfile(req.user.userId, req.user.userPosition, lastName + ' ' + firstName, email, phone, date, salary, message => {
            res.status(201).json({message: message})
        })
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
})

module.exports = router
