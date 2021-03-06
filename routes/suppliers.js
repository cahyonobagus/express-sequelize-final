let express = require('express');
let router = express.Router();
const models = require('../models')
const formatuang = require('../helpers/formatuang.js')


router.get('/', (req, res)=>{
  models.Supplier.findAll({
    include: [{model:models.Item}]
  })
    .then(suppliers => {
          res.render('suppliers/suppliers_list', {data_suppliers: suppliers, title: "Supplier List"})
          // res.send({data_suppliers: suppliers, title: "Suppliers List"})

    })
    .catch(err => {console.log(err);})
})

router.get('/add', (req, res)=>{
  res.render('suppliers/suppliers_add', {title: 'Add suppliers'})
})

router.post('/add', (req, res)=>{
  models.Supplier.create({
    name: req.body.name,
    kota: req.body.kota,
  })
  .then( suppliers => {
    res.redirect('/suppliers')
  })
  .catch(err => {console.log(err);})
})


router.get('/delete/:id/', (req, res) => {
  models.Supplier.destroy({
    where: {id: req.params.id}
  })
  .then(suppliers => {
    res.redirect('/suppliers')
  })
  .catch(err => {console.log(err);})
})


router.get('/edit/:id/', (req, res) => {
  models.Supplier.findAll({
    where: {id: req.params.id}
  })
  .then(suppliers => {
    res.render('suppliers/suppliers_edit', {data_suppliers: suppliers, title: 'Edit Suppliers'})
    // res.send({data_suppliers: suppliers, title: 'Edit Suppliers'})
  })
  .catch(err=> {console.log(err);})

})

router.post('/edit/:id', (req, res) => {
  models.Supplier.update({
    name: req.body.name,
    kota: req.body.kota,
  },
  {where: {id: req.params.id}
  })
  .then(suppliers => {
    res.redirect('/suppliers')
  })
  .catch(err => {console.log(err);})
})


// ================ relation ========
router.get('/:id/additem', (req,res)=> {

    models.Supplier.findAll({
      where: {id: req.params.id},
      include: [{model:models.Item}]
      })
      .then(supplier => {
        res.send(supplier)
        models.Item.findAll()
          .then(items => {
            // res.send(supplier)
            if(supplier[0].Items.length > 0) {
              let count = 0
              supplier[0].Items.forEach(item => {
                item.SupplierItem.price = formatuang(item.SupplierItem.price)
                count++
                if(count >= supplier[0].Items.length){
                  // res.send({data_supplier: supplier, data_items: items, title: 'Add Item for Supplier'} )
                  res.render('suppliers/supplier_add_item',{data_suppliers: supplier, data_items: items, title: 'Add Item for Supplier'} )
                }
              })
            } else {
              // res.send({data_supplier: supplier, data_items: items, title: 'Add Item for Supplier'} )
              res.render('suppliers/supplier_add_item',{data_suppliers: supplier, data_items: items, title: 'Add Item for Supplier'} )
            }




          })
          .catch(err => {console.log(err);})

      })
      .catch(err => {console.log(err);})


})


router.post('/:id/additem', (req,res)=> {
  models.SupplierItem.create({
    SupplierId: req.params.id,
    ItemId: req.body.ItemId,
    price: req.body.price
  })
  .then(conj => {
    res.redirect('/suppliers')
  })
  .catch(err => {console.log(err);})

})


module.exports = router
