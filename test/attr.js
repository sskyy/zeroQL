var assert = require('assert')
var AttrParser = require('../lib/AttrParser')

describe('attrs',function(){


  it('ast', function(){
    var parser = new AttrParser

    parser.parse('id,name:"jhon",gender')
    assert.equal( parser.ast.data.id, null)
    assert.equal( parser.ast.data.name, 'jhon')
    assert.equal( parser.ast.unfilledKeys[0], 'id')
    assert.equal( parser.ast.unfilledKeys[1], 'gender')
  })


  it('array', function(){
    var parser = new AttrParser
    parser.parse('id:[1,2,3,4]')
    assert.equal( parser.ast.data.id.length, 4)
    assert.equal( parser.ast.data.id.join(','), '1,2,3,4')
  })

  it('object', function(){
    var parser = new AttrParser
    parser.parse(`id:{like:'%something%'}`)
    assert.equal( parser.ast.data.id.like, '%something%')
  })

})