# dependency-resolver
If you have a dependency tree, and you'd like to know in which order to initialize each node, this library is for you.

## How to use

### Node
In CLI, execute 
```
npm i dependency-tree-resolver --save-dev
```
and then 
```javascript
var DepResolver =  require('dependency-tree-resolver');
```

### Browser
Get a local copy of [dep-res.js](src/dep-res.js), or consume it via [RawGit's CDN](https://cdn.rawgit.com/shaylh/dependency-resolver/master/src/dep-res.js),
and add to your HTML:
```html
<script type="text/javascript" src="dep-res.js"></script>
```
and then you'll have ```DepResolver``` on the  ```window``` scope.

## API
Once you include the script in your project you'll have a function ```DepResolver``` which accepts two arguments:
```javascript
DepResolver(
    tree = {
        string: [...string],
        ...
    }, 
    options = {
        exclude: [...string]
    }
)
```
## Arguments
*  ```tree```: each key in the map represents a node in the tree, and each value in the array represents a single dependency of that node.
* ```options```:
    * ```exclude```: allows you to specify which dependencies are special and allowed to not have a node for themselves (usefull when depending on external resources)

## Examples
```javascript
//valid tree
var tree = {a: [], b: ['c', 'd'], c: ['d'], d: ['a']};
var resolved = DepResolver(tree);
console.log(resolved);//['a','d','c','b' ]

//invalid tree w/ excluded external resource
var tree = {a: ['b'], b: ['d']};
var options = {exclude: ['d']};
var resolved = DepResolver(tree, options);
console.log(resolved);//['b','a']

//invalid tree w/o excluded external resource
var tree = {a: ['b'], b: ['d']};
var resolved = DepResolver(tree);//throw error: "b" has an unknown dependency "d"

//invalid tree with cyclic dependency
var tree = {a: ['b'], b: ['c'], c: ['a'], d: ['e'], e: ['d']};
var resolved = DepResolver(tree);//throw error: circular dependency found: a > b > c > a
```
## License
This library is provided under the [MIT license](http://choosealicense.com/licenses/mit/).
