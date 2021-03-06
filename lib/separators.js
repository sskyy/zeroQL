var NodeType = require('./NodeType')
var ContextType = require('./ContextType')
var AttrType = require('./AttrType')
var AttrParser = require('./AttrParser')
var attrParser = new AttrParser


function Tracker() {
  this.prefix = 'v'
  this.index = 0
}

Tracker.prototype.gen = function () {
  return this.prefix + String(this.index++)
}

//TODO 会一直不释放
var tracker = new Tracker



function isObject(obj){
  return typeof obj === 'object'
}

function getRef( obj, name ){
  var ns = (typeof name === "string") ? name.split(".") :  [].concat(name),
    ref = obj,
    currentName


  while( (currentName = ns.shift()) !== undefined ){
    if(isObject(ref) && ref[currentName]){
      ref = ref[currentName]
    }else{
      ref = undefined
      break;
    }
  }

  return ref
}


function strReverse( str ){
  return str.split('').reverse().join('')
}




function parseTypeFeed( feed ){
  feed = feed.trim()
  var matchType, typeName

  matchType = feed.match(/^(static::)?([A-Z][a-z]+)(\((.+)\))?$/)
  if( !matchType ){
    console.log(  feed, 'not match')
  }
  typeName = matchType[2]


  var attrAst = new AttrType
  var context = new ContextType

  if( matchType[4] ){
    attrParser.parse( matchType[4], attrAst, context)
  }

  //attrs = matchType[3] ? eval(`({${matchType[3]}})`) : []
  return {
    type  : typeName,
    attrs : attrAst,
    static : matchType[1] !== undefined
  }
}




function rootTypeSeparator( ast, context){
  var ref = getRef( ast, context.keys)
  var paredFeed = parseTypeFeed( context.feed.trim() )
  ref.type = paredFeed.type
  ref.attrs = paredFeed.attrs
  ref.tracker = tracker.gen()
  context.phase = 'detail'
  context.feed = ''
}

function relationSeparator( ast, context){

  var feed = context.feed.trim()
  var ref = context.keys.length ===0? ast : getRef( ast, context.keys)


  //parse feed
  var relationName, typeFeed, match
  var reverse = /^[A-Z]/.test(feed)

  if( reverse ) feed = strReverse(feed)
  match= feed.match( /^([A-Za-z0-9_]+)\s(.+)$/ )

  if( match === null ) throw new Error(`not a valid relation feed: ${feed}`)

  relationName = reverse ? strReverse(match[1]) : match[1]
  typeFeed = reverse ? strReverse(match[2]) : match[2]

  var parsedFeed = parseTypeFeed( typeFeed )


  var to = new NodeType(parsedFeed.type, parsedFeed.attrs)
  to.tracker = tracker.gen()


  var relationKey = [relationName, to.type]
  if( reverse === true ) relationKey = relationKey.reverse()
  var relationKeyStr = relationKey.join('-')

  ref.relations[relationKeyStr]={
    name : relationName,
    reverse : reverse,
    to : to,
    static : parsedFeed.static
  }

  context.phase = 'detail'
  context.keys = context.keys.concat('relations', relationKeyStr, 'to')
  context.feed = ''
}

function relationEndOrDetailEndOrRootEndSeparator(ast, context){
  //relation end
  var ref = getRef( ast, context.keys )
  if( context.keys.length !== 0 ){
    context.keys.splice( context.keys.length -3)
  }

  //also detail end
  if( context.feed ){
    var fieldName = context.feed.trim()
    context.feed = ''
    ref.fields.push( fieldName )
  }
}

function attrSeparator( ast, context){
  context.phase = 'attr'
  context.feed += '('
}

function attrEndSeparator( ast, context){
  context.phase = 'detail'
  context.feed += ')'

}

function fieldSeparator(ast, context){
  var ref = getRef( ast, context.keys )
  if( !ref.fields ){

    console.log( "..........")
    console.log(context)
    console.log(ast)
    console.log(ref)
  }

  var field = context.feed.trim()
  if( field!=='' ){
    //处理无异议的 , 号
    ref.fields.push( field )
  }
  context.feed = ''
}

module.exports = {
  rootTypeSeparator,
  relationSeparator,
  relationEndOrDetailEndOrRootEndSeparator,
  attrSeparator,
  attrEndSeparator,
  fieldSeparator
}