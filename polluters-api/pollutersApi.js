const { POLLUTERS_API_PATH, POLLUTERS_WORST_API_PATH }  = require("../constants")

module.exports = function createPollutersApi(fossilData) {
  function worst(req, res) {
    let   from = parseInt(req.query?.from),
          to   = parseInt(req.query?.to),
          type = req.query?.type
          top  = parseInt(req.query?.top)

    /*
    if(isNaN(from) || isNaN(to) || isNaN(top)) {
      return res.status(400).send("Following query parameters must be integers: from, to, top")
    }
      */

    let data = spliceYears(from, to, fossilData)
    data = toApiResponse(type, top, data)
    //data =  data.slice

   // console.log(data)

    return res.status(200).json(data)
  }
  
  return function usePollutersApi(app) {
    const WORST_URL = POLLUTERS_API_PATH + POLLUTERS_WORST_API_PATH

    console.info("Polluters Api is activate in " +  POLLUTERS_API_PATH)
    
    app.get(WORST_URL, worst)
  }
}

function spliceYears(from, to, data) {
  let spliceFrom = from < data.firstRecord ? data.firstRecord : from,
  spliceTo   = to > data.lastRecord ? data.lastRecord     : to

  return data.records.slice(spliceFrom, spliceTo + 1)
}

function toApiResponse(type, top, records) {
  if(typeof type !== "string") { 
    type = "Total"
  }

  return records.map((year, index) => {
    let polluters = year.map(rec => {
      return {
        name: rec.country,
        pollutionAmount: rec[type]
      }
    })
    
    polluters = polluters.sort((a,b) => {
      return b.pollutionAmount - a.pollutionAmount 
    })

    if(top) {
      polluters = polluters.slice(0, top)
    }

    return {
      year: year[0].year, 
      polluters
    }
  })
}