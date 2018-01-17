export function notBlank(...values) {
  return values.every((value) => {
    return !isBlank(value)
  })
}

function isBlank(val) {
  return !val || val.length === 0
}

function lengthGreaterThan(val, length) {
  return !isBlank(val) && val.length > length
}

export function email(val) {
  if (!lengthGreaterThan(val, 3)) return true

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(val.toLowerCase());
}
