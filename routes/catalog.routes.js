const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.middleware')
//const {check, validationResult} = require('express-validator')
const router = Router()

const {getCatalog} = require('../tedious/tedious')

//ПРОВЕРИТЬ ТИПЫ ДАННЫХ
// /api/catalog
router.get(
    '/', auth,  async (req, res) => {
        try {

            // if (!errors.isEmpty()) {
            //     return res.status(400).json({
            //         errors: errors.array(),
            //         message: 'Некорректные данные при регистрации'
            //     })
            // }

            // Проверяю авторизован ли пользователь
            // Делаю запрос на бд и получаю весь каталог
            getCatalog(result => {
                //console.log(result[0][0].value)
                //const {IdBeer, Name, Color, Price, Degree, IsFiltration} = result
                // console.log(IdBeer)
                // console.log(Name)
                // console.log(Color)
                // console.log(Price)
                // console.log(Degree)
                // console.log(IsFiltration)
                // const token = jwt.sign(
                //     {
                //         userId: result,
                //         userPosition: 'director'
                //     },
                //     config.get('jwtSecret'),
                //     {expiresIn: '1h'}
                // )

                res.json({result})
            })

            // Отправляю каталог

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router
