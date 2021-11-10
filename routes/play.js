const express = require('express')
const router = express.Router()

router.get('/', (req,res) =>{
    const params = {
        money: req.query.money,
        decks: req.query.decks
      }
    res.render('play_views/field', params)
})

router.post('/', (req,res) =>{
    const params = {
        money: req.body.money,
        decks: req.body.list
      }

    res.render('play_views/field', params)
})

module.exports = router;