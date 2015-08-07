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
  [static]assigned( content: 'run' ) Task: {
    id,
    content
  }
}
```