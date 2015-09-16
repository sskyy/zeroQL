var Translator = require('./Translator')
var util = require("util")
var AttrType = require('./AttrType')


function AttrParser( query ){
  Translator.call( this )
  this.ast = new AttrType

  this.registerSeparator('root', ',', attrSeparator )
  this.registerSeparator('root', '[', valueArraySeparator )
  this.registerSeparator('valueArray', ']', valueArrayEndSeparator )
  this.registerSeparator('root', '{', valueObjectSeparator )
  this.registerSeparator('valueObject', '}', valueObjectEndSeparator )
  this.registerSeparator('root', '/0', attrSeparator )
  query && this.parse( query )
}

util.inherits(AttrParser, Translator)

function attrSeparator( ast, context ){

  var feed = context.feed.trim()

  var match = feed.match(/^(["'A-Za-z0-9_-]+):/)
  var key
  var value = null

  if( match !== null ){
    key = match[1].replace(/^["']/,'').replace(/["']$/,'')
    //变成JSON来读
    //TODO 这里很危险
    eval(`value = ${feed.replace( new RegExp(`^${match[1]}:`), '')}`)

    ast.data[key] = value

  }else{
    key = feed
    ast.unfilledKeys.push(key)
  }
  context.feed = ''
}

function valueArraySeparator(ast, context){
  context.phase = 'valueArray'
  context.feed += '['
}



function valueArrayEndSeparator(ast, context){
  context.phase = 'root'
  context.feed += ']'
}

function valueObjectSeparator(ast, context){
  context.phase = 'valueObject'
  context.feed += '{'
}

function valueObjectEndSeparator(ast, context){
  context.phase = 'root'
  context.feed += '}'
}



module.exports = AttrParser