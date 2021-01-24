const fs = require("fs")

const { FOSSIL_FUEL_FILE_PATH } = require("../constants")
const FossilData = require("./FossilData")

module.exports = function readFossilData() {

  try {
    const data = fs.readFileSync(FOSSIL_FUEL_FILE_PATH, {encoding:'utf8', flag:'r'})

    console.info("Starting to read Fossil fuel data from: " + FOSSIL_FUEL_FILE_PATH)
  
    const fossilData = data.split("\n").map(line => new FossilData(line))
  
    console.info("Reading complete. Fossil fuel CSV data length: " + fossilData.length)

    return fossilData

  } catch(e) {
      console.error("Exiting process. Couldn't read fossil fuel data from " + FOSSIL_FUEL_FILE_PATH)
      console.error(e)
      process.exit()
  }
}