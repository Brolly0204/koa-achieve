
function Delegates (proto, target) {
  if (!(this instanceof Delegates)) return new Delegates(proto, target)
  this.proto = proto
  this.target = target
  this.methods = []
  this.getters = []
  this.setters = []
}

Delegates.prototype.method = function (name) {
  const { proto, target, methods } = this
  methods.push(name)
  proto[name] = function () {
    return this[target][name].apply(this[target], arguments)
  }
  return this
}

Delegates.prototype.access = function (name) {
  return this.getter(name).setter(name)
}


Delegates.prototype.getter = function (name) {
  const { proto, getters, target } = this
  getters.push(name)
  proto.__defineGetter__(name, function() {
    return this[target][name]
  })
  return this
}

Delegates.prototype.setter = function (name) {
  const { proto, setters, target } = this
  setters.push(name)
  proto.__defineSetter__(name, function(val) {
    return this[target][name] = val
  })
  return this
}

module.exports = Delegates