module.exports = function FossilData(fossilDataEntries) {
  let records = [], 
      firstRecord,
      lastRecord,
      knownTypes = []

  for(const entry of fossilDataEntries) {
    let year = parseInt(entry.year)
    if(isNaN(year)) {
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
    lastRecord
  }; 
}