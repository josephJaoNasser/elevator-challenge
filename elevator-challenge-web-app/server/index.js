const express = require('express')
const app = express()
const path = require('path')


/***********************************
 *      SERVE STATIC ASSETS
 ***********************************/
app.use(express.static('client'))
app.get('*', (req,res)=> {
  res.sendFile(path.join(__dirname,'../client/index.html'))
})


/***********************************
 *           PORT
 ***********************************/
const port = process.env.PORT || 5000
app.listen(port, ()=> console.log(`Server started on port ${port}`))
