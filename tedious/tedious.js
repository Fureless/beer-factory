const config = require("config")
const {Connection, Request} = require('tedious')

const SERVER = config.get('server') || 'localhost'
const PORT = config.get('port') || 5000
const USER = config.get('user') || 'beer'
const PASSWORD = config.get('password') || 'beer123'
const DATABASE = config.get('database') || 'BeerFactory'

// конфигурация
const configuration = {
    server: `${SERVER}`,
    port: `${PORT}`,
    authentication: {
        type: 'default',
        options: {
            userName: `${USER}`,
            password: `${PASSWORD}`
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        //encrypt: true,
        //trustServerCertificate: false, // ?????????????
        rowCollectionOnRequestCompletion: true,
        database: `${DATABASE}`
    }
}

// TODO ДОБАВИТЬ ОБРАБОТЧИКИ ОШИБОК

module.exports.findLogin = (login, callback) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request(`SELECT Login FROM Users WHERE Login='${login}'`, (err, rowCount, rows) => {
            rowCount === 0 ? callback('havent') : callback('have')
            connection.close()
        })

        connection.execSql(request);
    })
    connection.connect()
}

module.exports.createUser = (login, password, name, email, phone, date, salary) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        if (date) {
            let request = new Request(`Customer_Registration '${login}', '${password}', '${name}', '${email}', '${phone}', '${date}'`, (err, rowCount, rows) => {
                console.log(rowCount)
                connection.close()
            })
            connection.execSql(request)
        } else {
            let request = new Request(`Worker_Registration '${login}', '${password}', '${name}', '${email}', '${phone}', '${salary}'`, (err, rowCount, rows) => {
                console.log(rowCount)
                connection.close()
            })
            connection.execSql(request)
        }
    })
    connection.connect()
}

module.exports.getIdUser = (login, password, callback) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request(`SELECT IdUser, IsDirector FROM Users WHERE Login='${login}' AND Password='${password}'`, (err, rowCount, rows) => {
            rowCount === 0 ? callback('havent') : callback(rows[0][0].value, rows[0][1].value)
            connection.close()
        })

        connection.execSql(request);
    })

    connection.connect()
}

module.exports.getPosition = (idUser, callback) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request(`SELECT * FROM Worker JOIN Users ON Users.IdUser=Worker.IdUser WHERE Users.IdUser='${idUser}'`, (err, rowCount) => {
            rowCount === 0 ? callback('customer') : callback('worker')
            connection.close()
        })

        connection.execSql(request);
    })
    connection.connect()
}

module.exports.getCatalog = callback => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request('SELECT * FROM Beer', (err, rowCount, rows) => {
            // TODO rows[0] ?
            callback(rows)

            connection.close()
        })
        connection.execSql(request);
    })

    connection.connect()
}

module.exports.getOrders = (idUser, position, callback) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }
        if (position === 'customer') {
            let request = new Request(`SELECT IdOrder, IdBeer, Orders.IdCustomer, Orders.IdWorker, Quantity, OrderPrice, IdStatus, OrderTime
                                       FROM Orders JOIN Customers ON Orders.IdCustomer=Customers.IdCustomer
                                       RIGHT JOIN Users ON Customers.IdUser=Users.IdUser WHERE Users.IdUser=${idUser}`, (err, rowCount, rows) => {
                callback(rows)
                connection.close()
            })
            connection.execSql(request);
        } else if (position === 'worker') {
            let request = new Request(`SELECT IdOrder, IdBeer, Orders.IdCustomer, Orders.IdWorker, Quantity, OrderPrice, IdStatus, OrderTime
                                       FROM Orders JOIN Worker ON Orders.IdWorker=Worker.IdWorker
                                       RIGHT JOIN Users ON Worker.IdUser=Users.IdUser WHERE Users.IdUser=${idUser}`, (err, rowCount, rows) => {
                callback(rows)
                connection.close()
            })
            connection.execSql(request);
        } else {
            let request = new Request(`SELECT * FROM Orders`, (err, rowCount, rows) => {
                callback(rows)
                connection.close()
            })
            connection.execSql(request);
        }
    })
    connection.connect()
}

module.exports.getCustomerId = (idUser, callback) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request(`SELECT idCustomer FROM Customers JOIN Users ON Users.IdUser=Customers.IdUser WHERE Customers.idUser=${idUser}`, (err, rowCount, rows) => {
            callback(rows[0][0].value)
            connection.close()
        })

        connection.execSql(request);
    })

    connection.connect()
}

module.exports.createOrder = (idBeer, idCustomer, quantity) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request(`Order_Creation ${idBeer}, ${idCustomer}, ${quantity}`, (err, rowCount, rows) => {
            connection.close()
        })

        connection.execSql(request);
    })

    connection.connect()
}

module.exports.changeStatus = (idOrder, idStatus) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request(`UPDATE Orders SET IdStatus=${idStatus} WHERE IdOrder=${idOrder}`, (err, rowCount, rows) => {
            connection.close()
        })

        connection.execSql(request)
    })

    connection.connect()
}

module.exports.changeWorker = (idOrder, idWorker) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request(`UPDATE Orders SET IdWorker=${idWorker} WHERE IdOrder=${idOrder}`, (err, rowCount, rows) => {
            connection.close()
        })

        connection.execSql(request)
    })

    connection.connect()
}

module.exports.getUserProfile = (idUser, position, callback) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        if (position === 'customer') {
            let request = new Request(`SELECT * FROM Customers WHERE IdUser=${idUser}`, (err, rowCount, rows) => {
                callback(rows)
                connection.close()
            })
            connection.execSql(request)
        } else {
            let request = new Request(`SELECT * FROM Worker WHERE IdUser=${idUser}`, (err, rowCount, rows) => {
                callback(rows)
                connection.close()
            })
            connection.execSql(request)
        }
    })
    connection.connect()
}

module.exports.editUserProfile = (idUser, position, name, email, phone, date, salary, callback) => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        if (position === 'customer') {
            let request = new Request(`UPDATE Customers SET FIO='${name}', Mail='${email}', Phone='${phone}', Age='${date}' WHERE IdUser=${idUser}`, (err, rowCount, rows) => {
                if (err) {
                    console.log(err)
                }
                rowCount === 1 ? callback('Данные изменены') : callback('Некорректные данные')
                connection.close()
            })
            connection.execSql(request)
        } else {
            let request = new Request(`UPDATE Worker SET FIO='${name}', Mail='${email}', Phone='${phone}', Salary=${salary} WHERE IdUser=${idUser}`, (err, rowCount, rows) => {
                rowCount === 1 ? callback('Данные изменены') : callback('Некорректные данные')
                connection.close()
            })
            connection.execSql(request)
        }
    })
    connection.connect()
}

module.exports.getStatuses = callback => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request('SELECT * FROM Statuses', (err, rowCount, rows) => {
            callback(rows)
            connection.close()
        })

        connection.execSql(request)
    })
    connection.connect()
}

module.exports.getWorkers = callback => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        let request = new Request('SELECT * FROM Worker', (err, rowCount, rows) => {
            callback(rows)
            connection.close()
        })

        connection.execSql(request)
    })
    connection.connect()
}

module.exports.deleteOrder = idOrder => {
    let connection = new Connection(configuration)

    connection.on('connect', err => {
        if (err) {
            console.log(err)
        }

        // TODO убрать лишние параметры
        let request = new Request(`DELETE FROM Orders WHERE IdOrder=${idOrder}`, (err, rowCount, rows) => {
            connection.close()
        })

        connection.execSql(request)
    })

    connection.connect()
}
