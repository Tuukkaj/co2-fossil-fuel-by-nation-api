const express = require('express')
const app = express()
const { PORT } = require("./constants")

const readFossilData = require("./helpers/readFossilData")
const FossilData = require("./helpers/FossilData")
const FOSSIL_DATA = FossilData(readFossilData())

const usePollutersApi = require("./polluters-api/pollutersApi")(FOSSIL_DATA)
usePollutersApi(app)

app.listen(PORT, () => {
  console.log(`Fossil fuel CO2 by nation API listening at http://localhost:${PORT}`)
})

