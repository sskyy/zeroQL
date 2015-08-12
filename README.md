# ZeroQL

A graphQL inspired graph database query language.

## Usage

### Basic

1. Query nodes with certain label :

```
User {
  id,
  name,
  age
}
```

2. Query nodes with certain attributes :

```
User( age:21 ){
  id,
  name,
  age
}
```

### Query Related Data

1. Query optional related data

```
User( age:21 ){
  id,
  name,
  assigned Task : {
    id,
    content
  }
}
```

2. Query related Data with certain attribute

```
User( age:21 ){
  id,
  name,
  assigned static::Task( content: 'run' ): {
    id,
    content
  }
}
```

query above will be parsed to :

```
{
  type : 'User',
  attrs : {
    age :21
  },
  unfilledKeys : [],
  fields : ['id', 'name'],
  relations : [
    {
      name : 'assigned',
      static : true,
      reverse : false,
      target : {
        type : 'Task',
        attrs : {
          content : 'run'
        },
        fields : ['id','content']
        unfilledKeys : [],
        relations : []
      }
    }
  ]
}

```