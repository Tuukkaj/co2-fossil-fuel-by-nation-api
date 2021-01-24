module.exports = function FossilData(line) {
  const [
    year, 
    country,
    total,
    solidFuel,
    liquidFuel,
    gasFuel,
    cement,
    gasFlaring,
    perCapita,
    bunkerFuels
  ] = line.trim().split(",")

  return {
    year,
    country,
    total,
    solidFuel,
    liquidFuel, 
    gasFuel, 
    cement,
    gasFlaring, 
    perCapita, 
    bunkerFuels
  }
}