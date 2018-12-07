export const objKeys = function(obj) {
  if(typeof Object.keys === 'function') {
    return Object.keys(obj)
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !{toString:null}.propertyIsEnumerable('toString'),
      DontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
  DontEnumsLength = DontEnums.length
  if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
    throw new TypeError('Object.keys called on a non-object')
  }
  var result = []
  for (var name in obj) {
    if (hasOwnProperty.call(obj, name)) {
      result.push(name)
    }
  }
  if (hasDontEnumBug) {
    for (var i = 0; i < DontEnumsLength; i++) {
      if (hasOwnProperty.call(obj, DontEnums[i])) {
        result.push(DontEnums[i])
      }
    }
  }
  return result
}

export const objValues = function(obj) {
  if(typeof Object.values === 'function') {
    return Object.values(obj)
  }
  if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
    throw new TypeError('Object.keys called on a non-object')
  }
  var values = []
  for(var key in obj) { 
    values.push(obj[key])
  }
  return values
}

export const isEmpty = function(obj) {
  if(typeof Object.keys === 'function') {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return JSON.stringify(obj) === JSON.stringify({})
}

export const concat = function(o1, o2) {
  if (typeof Object.assign === 'function') {
    return Object.assign(o1, o2)
  }
  var obj3 = {}
  for (var attrname in o1) {
    obj3[attrname] = o1[attrname]
  }
  for (var attrname in o2) {
    obj3[attrname] = o2[attrname]
  }
  return obj3
}