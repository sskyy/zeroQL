function NodeType(type, attrs){
  this.type = type || ''
  this.fields = []
  this.attrs = attrs || {}
  this.relations = {}
}

NodeType.prototype.merge = function( ast ){
  this.fields = this.fields.concat( ast.fields)
  this.relations = this.relations.concat( ast.relations )
}


module.exports = NodeType
