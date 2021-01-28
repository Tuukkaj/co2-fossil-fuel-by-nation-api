const { POLLUTERS_API_PATH, POLLUTERS_WORST_API_PATH }  = require("../constants")

module.exports = function createPollutersApi(fossilData) {
  function worst(req, res) {
    const from = req.query?.from,
          to   = req.query?.to,
          type = mapTypeToRecordType(req.query?.type, fossilData.knownTypes)
          top  = parseInt(req.query?.top)
    
    const errors = checkQuery(from, to, type, top, fossilData.knownTypes)

    if(errors.length > 0) {
      return res.status(400).json({errors})
    }

    let data = spliceYears(from, to, fossilData)
    data = parsePollution(type, top, data)

    return res.status(200).json(data)
  }
  
  return function usePollutersApi(app) {
    const WORST_URL = POLLUTERS_API_PATH + POLLUTERS_WORST_API_PATH

    console.info("Polluters Api is activate in " +  POLLUTERS_API_PATH)
    
    app.get(WORST_URL, worst)
  }
}

function spliceYears(fromText, toText, data) {
  let from = parseInt(fromText) || 0,
      to   = parseInt(toText) || data.lastRecord

  const isOutOfRange = (number) => number < data.firstRecord || number > data.lastRecord

  let spliceFrom = isOutOfRange(from) ? data.firstRecord : from,
      spliceTo   = isOutOfRange(to) ? data.lastRecord     : to

  return data.records.slice(spliceFrom, spliceTo + 1)
}

function parsePollution(type, top, records) {
  let array = []; 
  
  for(let year of records) {
    let polluters = []

    if(!year) {
      continue
    }

    for(let rec of year) {
      if(isNaN(rec[type])) {
        continue
      }

      polluters.push({
        name: rec.country,
        pollutionAmount: Number(rec[type])
      })
    }
    
    polluters = polluters.sort((a,b) => {
      return b.pollutionAmount - a.pollutionAmount 
    })

    if(top) {
      polluters = polluters.slice(0, top)
    }

    array.push({
      year: Number(year[0].year), 
      polluters
    })
  }

  return array; 
}


function mapTypeToRecordType(type, knownTypes) {
  if(!type) {
    return "total"
  }

  for(let key in knownTypes) {
    if(knownTypes[key].toLowerCase() === type.toLowerCase()) {
      return key
    }
  }

  return false
}

function checkQuery(from, to, type, top, knownTypes) {
  const errors = []
  
  if(from && isNaN(from)) {
    errors.push("Query error: from query must be integer")
  }

  if(to && isNaN(to)) {
    errors.push("Query error: to query must be integer")
  }

  if(type === false) { // Strict equal to check if type is false. If !type used other falsy values would result in true
    errors.push("Query error: type query not recognized. Possible types: " + Object.values(knownTypes).join(", "))
  }

  if(top && isNaN(top) || top < 1) {
    errors.push("Query error: Top must be integer and larger than 0")
  }

  return errors
}