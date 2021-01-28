/*
  Goes through array of FossilLine.js objects and parses away corrupted lines where year or country are not defined.
  Also maps out known types, first record (first year) and last record (latest year). records array is array of arrays.
  Each year represents index of the array. For example year 1950 is 1950 index in records array.
  Returns object with records, knownTypes, firstRecord and lastRecord.
*/
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
  delete copy.year // Not emission type
  delete copy.country // Not emission type 

  for(let key in copy) {
    // Special handling for types with parenthesis. In this case "Bunker fuels (Not in Total)"
    copy[key] = copy[key].replace(/\(.*\)/, "").trim()
  }

  return copy
}