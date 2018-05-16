// Create Readline interface to read from file
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('edges.txt')
});
// List of all edges
let edges = [];
// Read file line by line and save each edge in list
// File is in following format
// [number_of_nodes] [number_of_edges]
// [one_node_of_edge_1] [other_node_of_edge_1] [edge_1_cost]
// [one_node_of_edge_2] [other_node_of_edge_2] [edge_2_cost]
lineReader.on('line', function (line) {
  const edge = {}; 
  const temp = line.split(' ');
  if (temp.length === 3) {
    edge.u = Number(temp[0]);
    edge.v = Number(temp[1]);
    edge.cost = Number(temp[2]);
  } else { // special case for first line in file 
    edge.V = Number(temp[0]);
    edge.E = Number(temp[1]);
  }
  edges.push(edge);
});

lineReader.on('close', function () {
  // remove first entry from list as it isn't edge pair
  const dump = edges.shift();
  const numberOfNodes = dump.V * 1; 
  const numberOfEdges = dump.E * 1; 
  // Call main function
  primsMST(numberOfNodes);
})

function primsMST(numberOfNodes) {
  const SEED = edges[0].u;
  const X = new Set([SEED]); 
  const tree = [];
  while (X.size !== numberOfNodes) {
    // edge (u,v) such that u belongs to X, v doesn't belongs to X
    const edge = findCheapestEdge(X);
    const v = X.has(edge.u) ? edge.v : edge.u;
    // Add edge to T
    tree.push(edge);
    // Add v to X
    X.add(v);
  }
  calculateCost(tree);
  printTree(X);
}

function calculateCost(list) {
  let cost = 0;
  list.forEach( item => cost += item.cost);
  console.log('Cost', cost);
}


function findCheapestEdge(X) {
  const allEdges = findAllEdges(X);
  const sortedList = allEdges.sort( (a,b) => {
    return a.cost < b.cost ? 1 : -1;
  });
  const cheapestEdge = sortedList.pop();
  edges = edges.filter( 
    edge => !((edge.u === cheapestEdge.u 
      && edge.v === cheapestEdge.v) || (edge.u === cheapestEdge.v 
        && edge.v === cheapestEdge.u))
  )
  return cheapestEdge;
}


function findAllEdges(X) {
  return edges.filter(edge => isCrossEdge(X, edge));
}

function isCrossEdge(X, edge) {
  if ((X.has(edge.u) && !X.has(edge.v)) || (!X.has(edge.u) && X.has(edge.v))) {
    return true;
  }
  return false;
}

function printTree(tree) {
  console.log('--------------Tree---------------');
  for (let node of tree){
    console.log(node);
    console.log(' | ');
  }
  console.log(' ----');
}