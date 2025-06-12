function convertBigInts(obj) {
  if (typeof obj === 'bigint') {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigInts);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertBigInts(obj[key]);
    }
    return newObj;
  } else {
    return obj;
  }
}

module.exports = { convertBigInts };