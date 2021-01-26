module.exports = function FossilData(fossilDataEntries) {
  const knownTypes = parseKnownTypes(fossilDataEntries[0])

  let records = [], 
      firstRecord,
      lastRecord

  for(const entry of fossilDataEntries) {
    let year = parseInt(entry.year)
    if(isNaN(year) || entry.country === "") {
      continue
    }

    if(!Array.isArray(records[year])) {
      records[year] = []
    }
    records[year].push(entry)

    if(firstRecord > year || !firstRecord) {
      firstRecord = year
    }

    if(lastRecord < year || !lastRecord) {
      lastRecord = year
    }
  }

  return {
    records,
    firstRecord,
    lastRecord,
    knownTypes
  }; 
}

function parseKnownTypes(csvHeaderEntry) {
  let copy = JSON.parse(JSON.stringify(csvHeaderEntry))

  for(let key in copy) {
    // Special handling for types with parenthesis. In this case "Bunker fuels (Not in Total)"
    copy[key] = copy[key].replace(/\(.*\)/, "").trim()
  }

  return copy
}