// 🔧 Helper za konverziju BigInt vrijednosti
function convertBigInts(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBigInts);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertBigInts(obj[key]);
    }
    return newObj;
  } else if (typeof obj === 'bigint') {
    return obj.toString();
  } else {
    return obj;
  }
}

module.exports = { convertBigInts };