export const convertObjectToVector = (trackObject) => {
  let resultArray = []
  Object.keys(trackObject).forEach(key => {
    resultArray.push(trackObject[key])
  })
  return resultArray
}

export const calculateTrackSimilarity = (a, b) => {
  if (JSON.stringify(a) === JSON.stringify(b)) {
    return 0
  }
  let dotproduct = 0
  let mA = 0
  let mB = 0
  for (let i = 0; i < a.length; i++) {
    dotproduct += (a[i] * b[i])
    mA += (a[i] * a[i])
    mB += (b[i] * b[i])
  }
  mA = Math.sqrt(mA)
  mB = Math.sqrt(mB)
  return Math.acos((dotproduct) / ((mA) * (mB))) * 1000
}