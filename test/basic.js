var assert = require('assert')
var Parser = require('../lib/Parser.js')

function toAttrs( obj ){
  var str =JSON.stringify( obj )
  return str.substr(1, str.length -2)
}

describe('basic', function(){
  var parser = new Parser
  var type = `Todo`
  var attrs = {id:1,name:`jhon`}
  var fields = ['content', 'id']
  var query  = `${type}(${toAttrs(attrs)})
    {
      ${fields.join(',')}
    }`
  var ast = parser.parse( query ).ast

  it('type right', function(){
    assert.equal(ast.type, type)
  })

  it('fileds right', function(){
    assert.equal( ast.fields.sort().join(','),  fields.sort().join(','))
  })

  it('attrs right', function(){
    assert.equal( JSON.stringify(ast.attrs.data), JSON.stringify( attrs))
  })
})

describe('execise', function(){
  var query = `Todo(id:1,gender) {
         User created {}
          content,
          creator
         }`
  var parser = new Parser
  var ast = parser.parse( query ).ast

  it('type right', function(){
    assert.equal(ast.type, 'Todo')
  })

  it('relation right', function(){
    assert.equal( ast.relations[0].target.type, 'User')
  })

  it('attr right', function(){
    assert.equal( ast.attrs.data.id, 1)
    assert.equal( ast.attrs.data.gender, null)
    assert.equal( ast.attrs.unfilledKeys[0], 'gender')
  })
})

