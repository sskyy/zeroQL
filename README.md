# ZeroQL

A graphQL inspired graph database query language.

## Usage

### 1. Basic

#### 1.1 Query nodes with certain label: ####

```
User {
  id,
  name,
  age
}
```

Query will be parse to:

```
{
  type: 'User',
  fields : ['id','name','age']
}
```

#### 1.2 Query nodes with certain attributes :

```
User( age:21 ){
  id,
  name,
  age
}
```

Query will be parse to:

```
{
  type: 'User',
  attrs : {
    data : {
      age : 21
    }
  },
  fields : ['id','name','age']
}
```

#### 1.3 Query with empty attribute

```
User( age:21 ){
  id,
  name,
  age
}
```

Query will be parse to:

```
{
  type: 'User',
  attrs : {
    unFilledKeys : ['age']
  },
  fields : ['id','name','age']
}
```

### 2. Query Related Data

#### 2.1 Query optional related data

```
User( age:21 ){
  id,
  name,
  created Task : {
    id,
    content
  }
}
```

Query will be parse to:

```
{
  type : 'User',
  attrs : {
    data : {
      age :21
    }
  },
  fields : ['id', 'name'],
  relations : {
    'created Task' : {
      name : 'created',
      target : {
        type : 'Task',
        fields : ['id','content']
      }
    }
  }
}
```


#### 2.2 Query related Data with certain attribute

```
User( age:21 ){
  id,
  name,
  Task assigned( content: 'run' ): {
    id,
    content
  }
}
```

Query  will be parsed to :

```
{
  type : 'User',
  attrs : {
    data : {
      age :21
    }
  },
  fields : ['id', 'name'],
  relations : {
    'Task-assigned' : {
      name : 'assigned',
      reverse : true,            //notice, this is a reverse relation
      target : {
        type : 'Task',
        attrs : {
          data : {
            content : 'run'
          }
        },
        fields : ['id','content']
      }
    }
  }
}
```