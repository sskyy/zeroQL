var assert = require('assert')
var AttrParser = require('../lib/AttrParser')

describe('attrs',function(){

  var parser = new AttrParser

  parser.parse('id,name:"jhon",gender')
  it('ast', function(){
    assert.equal( parser.ast.data.id, null)
    assert.equal( parser.ast.data.name, 'jhon')
    assert.equal( parser.ast.unfilledKeys[0], 'id')
    assert.equal( parser.ast.unfilledKeys[1], 'gender')
  })

})