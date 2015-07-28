var assert = require('assert')
var Translator = require('../lib/Translator')


function toAttrs( obj ){
  var str =JSON.stringify( obj )
  return str.substr(1, str.length -2)
}

describe('ast to cypher', function() {

  var translator = new Translator
  var ast = {
    type: 'Todo',
    attrs: {
      id: 1
    },
    fields:['content','owner'],
    relations: [{
      name: 'created',
      reverse: true,
      target: {
        type: 'User',
        attrs: {
          id: 12
        },
        fields:[],
        relations: []
      }
    }]
  }

    it('to zeroQL', function(){
      var zeroQL = translator.toZeroQL( ast )
      console.log( zeroQL )
      assert.equal( zeroQL, '')
    })

})