const express = require('express')
const config = require('config')
const path = require('path')

const app = express()

// TODO разделить запрос на get, post и тд?
// middleware для того, чтобы парсить приходящие json
app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/catalog', require('./routes/catalog.routes'))
app.use('/api/orders', require('./routes/orders.routes'))
app.use('/api/profile', require('./routes/profile.routes'))
app.use('/api/statuses', require('./routes/statuses.routes'))
app.use('/api/workers', require('./routes/workers.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
