var Translator = require('./Translator')
var util = require("util")
var separators = require('./separators')


function empty( obj ){
  return Object.keys(obj).length === 0
}


function toAttrsStr( attrs ){
  if( !attrs || empty(attrs)) return  ''

  var attrsStr = JSON.stringify(attrs)
  return `(${attrsStr.substr(1,attrsStr.length-2 )})`
}

function Parser( query ){
  Translator.call( this )
  this.registerSeparator('root', '{', separators.rootTypeSeparator)
  this.registerSeparator('detail', '{', separators.relationSeparator)
  this.registerSeparator('detail', '}', separators.relationEndOrDetailEndOrRootEndSeparator)
  this.registerSeparator('detail', '(', separators.attrSeparator)
  this.registerSeparator('attr', ')', separators.attrEndSeparator)
  this.registerSeparator('detail', ',', separators.fieldSeparator)
  query && this.parse( query )
}

util.inherits(Parser, Translator)



Parser.prototype.toZeroQL = function( ast, relationName, reverse ){
  var that = this
  ast = ast || this.ast

  relationName = relationName || ''
  var typeStr =  `${ast.type}${toAttrsStr(ast.attrs)}`
  var firstLine = reverse? `${typeStr} ${relationName}` : `${relationName} ${typeStr}`

  return `${firstLine} {
    ${ast.relations.map(function(relation){
    return that.toZeroQL( relation.target, relation.name, relation.reverse )
  }).join('')}
    ${ast.fields.join(',')}
  }`
}

module.exports = Parser


