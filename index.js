'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Product = require('./models/product')

const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//endpoint
app.get('/api/product', (req, res) => {
  Product.find({}, (err, products) => {
    if (err) return res.status(500).send({mensage: `Error al realizar5 la peticion: ${err}`})
    if (!products) return res.status(404).send({mensage: 'No existed productos'})

    res.status(200).send({ products })
  })
})

// Method get for list a product
app.get('/api/product/:productId', (req, res) => {
  let productId = req.params.productId

  Product.findById(productId, (err, product) => {
    if(err) return res.status(500).send({mensage: `Error al realizar la peticicion: ${err}`})
    if(!product) return res.status(400).send({mensage: 'El producto no existe'})

    res.status(200).send({product: product}) //res.status(200).send({product})
  })
})

// Method post for insert a producto to the BD
app.post('/api/product', (req, res) => {
  console.log('Post /api/product')
  console.log(req.body)

  let product = new Product()
  product.name = req.body.name
  product.picture = req.body.picture
  product.price = req.body.price
  product.category = req.body.category
  product.description = req.body.description

  product.save((err, productStore) => {
    if (err) res.status(500).send({mensage: `Error: al guardar en la BD ${err}`})

    res.status(200).send({product: productStore})
  })
})

// method put for update product
app.put('/api/product/:productId', (req, res) => {
  let productId = req.params.productId
  let update = req.body

  Product.findByIdAndUpdate(productId, update, (err, productUpdate) =>{
    if (err) res.status(500).send({mensage: `Error al actulizar el producto: ${err}`})
      res.status(200).send({product: productUpdate})
  })
})

//method delete for delete product
app.delete('/api/product/:productId', (req, res) => {
  let productId = req.params.productId

  Product.findById(productId, (err, product) =>{
    if (err) res.status(500).send({mensage: `Error al eliminar el producto: ${err}`})

    product.remove( err => {
      if (err) res.status(500).send({mensage: `Error al eliminar el producto: ${err}`})
      res.status(200).send({mensage: 'El producto ha sido eliminado'})
    })
  })
})

//conection to BD and run app
mongoose.connect('mongodb://localhost:27017/shop', (err, res) => {
  if (err) throw err
    console.log('Conexion a la BD establecida...')
    app.listen(port, () => {
      console.log(`API REST Run in http://localhost:${port}`)
    })
})
