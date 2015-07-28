var Translator = require('./Translator')
var util = require("util")
var AttrType = require('./AttrType')


function AttrParser( query ){
  Translator.call( this )
  this.ast = new AttrType

  this.registerSeparator('root', ',', attrSeparator )
  this.registerSeparator('root', '[', valueArraySeparator )
  this.registerSeparator('value', ']', valueArrayEndSeparator )
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
    key = match[1]
    value = eval(feed.replace( new RegExp(`^${match[1]}:`), ''))
  }else{
    key = feed
    ast.unfilledKeys.push(key)
  }

  key = key.replace(/^["']/,'')
  key = key.replace(/["']$/,'')

  context.feed = ''
  ast.data[key] = value
}

function valueArraySeparator(ast, context){
  context.phase = 'value'
}

function valueArrayEndSeparator(ast, context){
  context.phase = 'root'
}



module.exports = AttrParser