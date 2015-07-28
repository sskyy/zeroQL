var assert = require('assert')
var AttrParser = require('../lib/AttrParser')

describe('attrs',function(){

  var parser = new AttrParser

  parser.parse('id,name:"jhon",gender')
  console.log( parser.ast )
  it('ast', function(){
    assert.equal( parser.ast.attrs.id, null)
    assert.equal( parser.ast.attrs.name, 'jhon')
    assert.equal( parser.ast.unfilledKeys[0], 'id')
    assert.equal( parser.ast.unfilledKeys[1], 'gender')
  })

})