var assert = require('assert')
var parser = require('../lib/parser')
var cypherDriver = require('../lib/drivers/cypher.js')


function toAttrs( obj ){
  var str =JSON.stringify( obj )
  return str.substr(1, str.length -2)
}

describe('ast to cypher', function(){

  var ast = {
    type : 'Todo',
    attrs : {
      id : 1
    },
    relations : [{
      name : 'created',
      reverse : true,
      target : {
        type : 'User',
        relations : []
      }
    }]
  }

  it('translate', function(){
    var query = cypherDriver.translate( ast )
    assert.equal( query, 'MATCH (v0:Todo),(v1:User) WHERE v0.id = 1 AND (v0)<-[:CREATED]-(v1) RETURN v0,v1')
  })

})

describe('zeroQL to cypher', function(){

  var type = `Todo`
  var relation = `created`
  var relationType = `User`
  var relationAttrs = {name:`jhon`}


  //TODO

  it('relation type', function(){

    var query  = `${type} {
      ${relationType}(${toAttrs(relationAttrs)}) ${relation}  {}
    }`

    var translator = parser.parse(query)
    assert.equal( translator.toCypher(), "MATCH (v0:Todo),(v1:User) WHERE (v0)<-[:CREATED]-(v1) AND v1.name = 'jhon' RETURN v0,v1")

  })
})