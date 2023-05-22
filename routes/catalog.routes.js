const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.middleware')
//const {check, validationResult} = require('express-validator')
const router = Router()

const {getCatalog, createProduct, editProduct, deleteProduct, getBestProducts} = require('../tedious/tedious')

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

            // TODO А ЕСЛИ ПУСТОЙ? ОШИБКА?
            getCatalog(result => {
                res.json({result})
            })

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

// /api/catalog/create
router.post(
    '/create', auth,  async (req, res) => {
        try {
            const {name, color, degree, price, isFiltration} = req.body
            createProduct(name, color, degree, price, isFiltration)
            res.status(201).json({message: 'Добавлено в каталог'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

// /api/catalog/edit
router.post(
    '/edit', auth,  async (req, res) => {
        try {
            const {name, color, degree, price, isFiltration, idBeer} = req.body
            editProduct(name, color, degree, price, isFiltration, idBeer)
            res.status(202).json({message: 'Изменено'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

// /api/catalog/
router.delete(
    '/', auth,  async (req, res) => {
        try {
            const {idBeer} = req.body
            deleteProduct(idBeer)
            res.status(202).json({message: 'Удалено'})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

// /api/catalog/best
router.get(
    '/best', auth,  async (req, res) => {
        try {
            getBestProducts(result => {
                res.json({result})
            })
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router
