var assert = require('assert')
var Parser = require('../lib/parser')

describe('relation', function () {
  var parser = new Parser
  var type = `Todo`
  var relation = `created`
  var relationType = `User`
  var fields = ['name','gender']


  //TODO

  it('relation type', function () {
    var parser = new Parser
    var query = `${type} {
    ${relation} ${relationType} {}
  }`
    var ast = parser.parse(query).ast
    //console.log(query, ast)

    assert.equal(ast.relations[0].name, relation)
    assert.equal(ast.relations[0].static, false)
    assert.equal(ast.relations[0].reverse, false)
    assert.equal(ast.relations[0].target.type, relationType)
  })

  it('reverse', function () {
    var parser = new Parser
    var query = `${type} {
    ${relationType} ${relation}  {}
  }`

    var ast = parser.parse(query).ast
    //console.log(ast)

    assert.equal(ast.relations[0].name, relation)
    assert.equal(ast.relations[0].static, false)
    assert.equal(ast.relations[0].reverse, true)
    assert.equal(ast.relations[0].target.type, relationType)

  })

  it('relation fields', function () {
    var parser = new Parser
    var query = `${type} {
      ${relation} ${relationType} {
        ${fields.join(',')}
      }
    }`
    var ast = parser.parse(query).ast
    console.log(query, ast)

    assert.equal(ast.relations[0].target.type, relationType)
    assert.equal(ast.relations[0].target.fields.join(','), fields.join(','))
  })


  it('static relation', function () {
    var parser = new Parser
    var query = `${type} {
      ${relation} static::${relationType} {
        ${fields.join(',')}
      }
    }`
    var ast = parser.parse(query).ast
    console.log(query, ast)

    assert.equal(ast.relations[0].target.type, relationType)
    assert.equal(ast.relations[0].static,true)
    assert.equal(ast.relations[0].target.fields.join(','), fields.join(','))
  })


})