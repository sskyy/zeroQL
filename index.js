var Parser = require('./lib/Parser')

module.exports = {
  parse : function(query){
    return new Parser(query)
  }
}
