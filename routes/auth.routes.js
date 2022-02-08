const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const router = Router()

const {findLogin, getIdUser, getPosition, createUser} = require('../tedious/tedious')

// TODO Сделать валидацию
// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email')
            .isEmail(),
        check('password', "Минимальная длина пароля 6 символов")
            .isLength({min: 6}),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }

            const {firstName, lastName, login, password, email, phone, date, salary} = req.body

            // ЗДЕСЬ МЫ НАХОДИМ В БД ТАКОГО ЮЗЕРА
            //const candidate = await User.findOne({email})
            //console.log(tedious.findOne('Aleksei'))
            // let candidate = ''

            //let candidate = ''

            // findOne(`${email}`, candidate => {
            //     candidate === 'have' ?
            //         res.status(400).json({message: 'Пользователь с таким email уже существует'}) :
            //         res.status(201).json({message: 'Пользователь создан'})
            // })

            findLogin(`${login}`, candidate => {
                if (candidate === 'have') {
                    res.status(400).json({message: 'Пользователь с таким логином уже существует'})
                } else {
                    // Отправляем запрос на создание нового пользователя
                    createUser(login, password, lastName + ' ' + firstName, email, phone, date, salary)
                    res.status(201).json({message: 'Пользователь создан'})
                }
            })

            //console.log('Candidate = ', candidate)

            //res.status(201).json({message: 'Пользователь создан'})

            //const hashedPassword = await bcrypt.hash(password, 12)

            // ЗДЕСЬ МЫ СОЗДАЕМ ТАКОГО ЮЗЕРА В БД
            //const user = new User({email, password: hashedPassword})

            // СОХРАНЯЕМ ЕГО
            //await user.save()

            //res.status(201).json({message: 'Пользователь создан'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

router.post('/login',
    [
        /*check('email', 'Введите корректный email').normalizeEmail().isEmail(),*/
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const {login, password} = req.body

            getIdUser(`${login}`, `${password}`, (result, isDirector) => {
                if (isDirector) {
                    //res.status(201).json({message: 'ОГО ТЫ ДИРЕКТОР'})

                    const token = jwt.sign(
                        {
                            userId: result,
                            userPosition: 'director'
                        },
                        config.get('jwtSecret'),
                        {expiresIn: '1h'}
                    )

                    res.json({token, userId: result, userPosition: 'director'})
                } else if (result !== 'havent') {
                    getPosition(result, position => {
                        if (position === 'worker') {
                            const token = jwt.sign(
                                {
                                    userId: result,
                                    userPosition: 'worker'
                                },
                                config.get('jwtSecret'),
                                {expiresIn: '1h'}
                            )

                            res.json({token, userId: result, userPosition: 'worker'})
                        } else {
                            const token = jwt.sign(
                                {
                                    userId: result,
                                    userPosition: 'customer'
                                },
                                config.get('jwtSecret'),
                                {expiresIn: '1h'}
                            )

                            res.json({token, userId: result, userPosition: 'customer'})
                        }
                    })
                } else {
                    res.status(400).json({message: 'Неверный логин/пароль'})
                }
            })

            //
            // const isMatch = await bcrypt.compare(password, user.password)
            //
            // if (!isMatch) {
            //     return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            // }
            //
            // const token = jwt.sign(
            //     {userId: user.id},
            //     config.get('jwtSecret'),
            //     {expiresIn: '1h'}
            // )
            //
            // res.json({token, userId: user.id})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }

    })

module.exports = router
