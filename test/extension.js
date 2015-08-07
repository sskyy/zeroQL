var Translator = require('../lib/Parser')
var NodeType = require('../lib/NodeType')
var ContextType = require('../lib/ContextType')
var assert = require('assert')



describe( 'register separator', function(){

  var translator = new Translator
  var componentId ='com1'
  var componentId2 ='com2'

  var atStart = false
  var parsedComponentIds = []


  translator.registerSeparator('detail', '[', function( ast, context){
    if( context.feed === '' ){
      atStart = true
    }

    context.phase = 'component'
  })

  translator.registerSeparator('component', ']', function( ast, context){

    var feed = context.feed.trim()
    var match = feed.match(/^([\w\d]+):/)
    var componentId = match[1]
    var detailQuery = feed.replace( new RegExp(`^${componentId}:`), '')

    //TODO 单独parse detail
    var detailAst = new NodeType
    var detailContext = new ContextType()
    console.log(  `Fragment { ${detailQuery} }` )
    translator.parse( `Fragment { ${detailQuery} }` , detailAst, detailContext)
    //连接 ast
    translator.ast.merge( detailAst )

    context.feed = ''
    context.phase = 'detail'

    parsedComponentIds.push( componentId )
  })

  translator.parse(`
    Todo {
      [${componentId}:content, detail]
      [${componentId2}: createdBy User(id:1) {
        name,
        gender
      }]
    }
  `)

  it( 'parse componentId', function(){
    assert.equal( atStart, true)
    assert.equal( parsedComponentIds.join(','), [componentId, componentId2].join(','))


    console.log( translator.ast )
    assert.equal( translator.ast.type, 'Todo' )
    assert.equal( translator.ast.fields.join(','), ['content', 'detail'].join(','))
  })

})
