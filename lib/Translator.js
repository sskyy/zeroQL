var NodeType = require('./NodeType')
var ContextType = require('./ContextType')


function Translator( query ){
  this.query = query
  this.ast = new NodeType()
  this.context = new ContextType()
  this.separators = {}
}



Translator.prototype.parse = function( query, ast, context ){
  this.query = query

  ast = ast || this.ast
  context = context || this.context

  var i = 0
  while( i<query.length ){
    //console.log('reading', query[i], this.separators)
    if( this.separators[context.phase] && this.separators[context.phase][query[i]] !== undefined){
      this.separators[context.phase][query[i]]( ast, context )
    }else if( context.feed || /[A-Za-z0-9_]/.test(query[i])){
      context.feed += query[i]
    }
    i++;
  }

  //结束
  if( this.separators[context.phase]['/0'] ){
    this.separators[context.phase]['/0'] ( ast, context )
  }

  return this
}


Translator.prototype.registerSeparator = function( phase, separator, handler ){
  if( this.separators[phase ] === undefined ) this.separators[phase] = {}
  this.separators[phase][separator] = handler
}



module.exports = Translator