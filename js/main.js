/*
 * Graph class that keeps track of the coloring of its vertices and edges.
 */

class Graph {
  constructor(vertexCount = 1) {
    if (vertexCount <= 0) {
      vertexCount = 1;
    }

    this.vertexCount = vertexCount;
    this.vertexColorMap = new Map();
    this.edgeColorMap = new Map();

    let adjMatrix = new Array(vertexCount);
    for (let i = 0; i < vertexCount; ++i) {
      adjMatrix[i] = new Array(vertexCount);
      this.vertexColorMap.set(i.toString(), "#FFFFFF");
    }

    for (let i = 0; i < vertexCount; ++i) {
      for (let j = 0; j < vertexCount; ++j) {
        adjMatrix[i][j] = 0;
      }
    }
    this.adjMatrix = adjMatrix;
  }

  addVertex() {
    const addedVertex = this.vertexCount;
    ++this.vertexCount;

    let adjMatrix = new Array(this.vertexCount);
    for (let i = 0; i < this.vertexCount; ++i) {
      adjMatrix[i] = new Array(this.vertexCount);
    }
    for (let i = 0; i < addedVertex; ++i) {
      for (let j = 0; j < addedVertex; ++j) {
        adjMatrix[i][j] = this.adjMatrix[i][j];
      }
    }

    for (let i = 0; i < this.vertexCount; ++i) {
      adjMatrix[i][addedVertex] = 0;
      adjMatrix[addedVertex][i] = 0;
    }

    this.adjMatrix = adjMatrix;
    this.vertexColorMap.set(addedVertex.toString(), "#FFFFFF");
  }

  addEdge(vertex1, vertex2) {
    if (vertex1 < 0 || vertex1 >= this.vertexCount) {
      return;
    }
    if (vertex2 < 0 || vertex2 >= this.vertexCount) {
      return;
    }
    if (vertex1 == vertex2) {
      return;
    }

    this.adjMatrix[vertex1][vertex2] = 1;
    this.adjMatrix[vertex2][vertex1] = 1;

    let arr = [vertex1, vertex2];
    arr.sort();
    this.edgeColorMap.set(arr.join('_'), "#000000");
  }

  incidentUncoloredVertices(vertex) {
    let arr = [];
    if (vertex < 0 || vertex >= this.vertexCount) {
      return arr;
    }
    for (let i = 0; i < this.vertexCount; ++i) {
      if (i != vertex && this.adjMatrix[vertex][i] == 1) {
        if (this.vertexColorMap.get(i.toString()) == "#FFFFFF") {
          arr.push(i);
        }
      }
    }
    return arr;
  }

  incidentColoredVertices(vertex) {
    let arr = [];
    if (vertex < 0 || vertex >= this.vertexCount) {
      return arr;
    }
    for (let i = 0; i < this.vertexCount; ++i) {
      if (i != vertex && this.adjMatrix[vertex][i] == 1) {
        if (this.vertexColorMap.get(i.toString()) != "#FFFFFF") {
          arr.push(i);
        }
      }
    }
    return arr;
  }

  assignUncoloredColoring() {
    for (let key of this.vertexColorMap.keys()) {
      this.vertexColorMap.set(key, "#FFFFFF");
    }
    for (let key of this.edgeColorMap.keys()) {
      this.edgeColorMap.set(key, "#000000");
    }
  }

  assignEdgeColors() {
    let arr = shuffle(colors);
    for (let i = 0; i < g.vertexCount; ++i) {
      for (let j = 0; j < g.vertexCount; ++j) {

      }
    }
  }

  assignEdgeInducedColoring() {

  }

  assignGreedyColoring() {
    this.assignUncoloredColoring();
    for (let key of this.vertexColorMap.keys()) {
      for (let color of colors) {
        let available = true;
        for (let i = 0; i < this.vertexCount; ++i) {
          if (i != key && this.adjMatrix[key][i] == 1) {
            if (color == this.vertexColorMap.get(i.toString())) {
              available = false;
              break;
            }
          }
        }
        if (available) {
          this.vertexColorMap.set(key, color);
          break;
        }
      }
    }
  }

  assignMinimumColoring() {
    this.assignUncoloredColoring();
    for (let key of this.vertexColorMap.keys()) {
      if (this.vertexColorMap.get(key) == "#FFFFFF") {
        let colorCount = 1;
        while (true) {
          let isColorable = this.assignMinimumColoring_helper(Number(key), colorCount);
          if (!isColorable) {
            if (colorCount == 7) {
              return;
            }
            ++colorCount;
          }
          else {
            break;
          }
        }
      }
    }
  }

  assignMinimumColoring_helper(key_index, colorCount) {
    let incidentColoredVertices = this.incidentColoredVertices(key_index);
    for (let i = 0; i < colorCount; ++i) {
      let available = true;
      let color = colors[i];

      for (let i = 0; i < incidentColoredVertices.length; ++i) {
        if (color == this.vertexColorMap.get(incidentColoredVertices[i].toString())) {
          available = false;
          break;
        }
      }

      if (available) {
        this.vertexColorMap.set(key_index.toString(), color);
        let incidentUncoloredVertices = this.incidentUncoloredVertices(key_index);
        if (incidentUncoloredVertices.length == 0) {
          return true;
        }
        for (let i = 0; i < incidentUncoloredVertices.length; ++i) {
          if (this.assignMinimumColoring_helper(incidentUncoloredVertices[i], colorCount)) {
            return true;
          }
        }
        this.vertexColorMap.set(key_index.toString(), "#FFFFFF");
      }
    }
    return false;
  }

}

/*
 * Global variables used in drawing and displaying the graph.
 */


// first line of colors: gray, red, yellow, blue, lime, fuschia, purple, silver, maroon, green, aqua, teal, navy, olive
const colors = ["#808080", "#FF0000", "#FFFF00", "#0000FF", "#00FF00", "#FF00FF", "#800080", "#C0C0C0", "#800000", "#008000", "#00FFFF", "#008080", "#000080", "#808000",
"#FF7F50", "#CA226B", "#8467D7", "#7D0552", "#FFA62F", "#348781", "#0000A0", "#8EEBEC", "#810541", "#F7E7CE", "#E67451", "#C24641", "#B4CFEC", "#7FFFD4", "#5EFB6E", "#87F717", "#E38AAE", "#C3FDB8", "#B6B6B4", "#565051", "#FBBBB9", "#842DCE", "#15317E", "#C12869", "#4B0082", "#728C00", "#43C6DB", "#C8B560", "#D462FF", "#9CB071", "#ECE5B6", "#FFDB58", "#6CC417", "#306754", "#F75D59", "#41A317", "#C8A2C8", "#E41B17", "#848482", "#C34A2C", "#7F4E52", "#736F6E", "#FFE87C", "#616D7E", "#B38481", "#FDD017", "#FFDFDD", "#FFE5B4", "#A74AC7", "#FCDFFF", "#342D7E", "#98AFC7", "#DEB887", "#2B60DE", "#FFF380", "#F88017", "#954535", "#FFD801", "#FBB917", "#8C001A", "#E55B3C", "#C19A6B", "#D2B9D3", "#463E3F", "#D1D0CE", "#C11B17", "#4E8975", "#FFF5EE", "#CD7F32", "#CFECEC", "#6CBB3C", "#348017", "#667C26", "#78C7C7", "#6C2DC7", "#FC6C85", "#FFF8C6", "#E3E4FA", "#DC381F", "#7E3817", "#C36241", "#3BB9FF", "#C58917", "#5C5858", "#E56E94", "#4CC417", "#CC6600", "#B041FF", "#CCFFFF", "#F2BB66", "#56A5EC", "#FAAFBA", "#EBDDE2", "#B1FB17", "#B7CEEC", "#566D7E", "#2B3856", "#F5F5DC", "#786D5F", "#827B60", "#C48189", "#E18B6B", "#9172EC", "#43BFC7", "#FDD7E4", "#87AFC7", "#9DC209", "#E66C2C", "#C68E17", "#4C4646", "#827839", "#3B3131", "#46C7C7", "#AF7817", "#EDE275", "#E799A3", "#3D3C3A", "#D16587", "#CCFB5D", "#C38EC7", "#3EA99F", "#5CB3FF", "#646D7E", "#8A4117", "#7F38EC", "#C88141", "#AF9B60", "#1F45FC", "#E0FFFF", "#C12267", "#93FFE8", "#FF2400", "#7BCCB5", "#F0FFFF", "#9F000F", "#E9AB17", "#FF8040", "#8E35EF", "#C2DFFF", "#F535AA", "#0041C2", "#E6A9EC", "#F9A7B0", "#82CAFF", "#614051", "#571B7E", "#F6358A", "#FAAFBE", "#C45AEC", "#C04000", "#A23BEC", "#EDDA74", "#F778A1", "#C35817", "#347C2C", "#FBB117", "#6D6968", "#F70D1A", "#6D7B8D", "#3B9C9C", "#9AFEFF", "#893BFF", "#990012", "#357EC7", "#493D26", "#F52887", "#EE9A4D", "#FAEBD7", "#F433FF", "#E9CFEC", "#D4A017", "#ADA96E", "#38ACEC", "#583759", "#4AA02C", "#E4287C", "#307D7E", "#2B547E", "#1589FF", "#FFEBCD", "#77BFC7", "#2B65EC", "#5E5A80", "#4863A0", "#4E9258", "#52D017", "#736AFF", "#8D38C9", "#7DFDFE", "#7FE817", "#E238EC", "#A0CFEC", "#BDEDFF", "#7F462C", "#6AFB92", "#E8ADAA", "#6AA121", "#E8A317", "#368BC1", "#7F5A58", "#E45E9D", "#151B54", "#C7A317", "#7D0541", "#C9BE62", "#306EFF", "#848b79", "#4E387E", "#151B8D", "#F62817", "#2554C7", "#ECC5C0", "#BCC6CC", "#C2B280", "#FFFFCC", "#625D5D", "#413839", "#F3E5AB", "#F660AB", "#B5A642", "#806517", "#9E7BFF", "#50EBEC", "#6698FF", "#347235", "#EDC9AF", "#7F525D", "#F9966B", "#387C44", "#8BB381", "#C48793", "#79BAEC", "#3090C7", "#FFCBA4", "#726E6D", "#92C7C7", "#B87333", "#82CAFA", "#F87431", "#B048B5", "#666362", "#657383", "#254117", "#6495ED", "#E78A61", "#F0F8FF", "#617C58", "#7E354D", "#B5EAAA", "#C25283", "#461B7E", "#F88158", "#5FFB17", "#E56717", "#7E3517", "#157DEC", "#AFDCEC", "#E2A76F", "#E7A1B0", "#F87217", "#438D80", "#98FF98", "#54C571", "#7F5217", "#89C35C", "#4EE2EC", "#488AC7", "#483C32", "#4CC552", "#95B9C7", "#E55451", "#737CA1", "#6F4E37", "#99C68E", "#7D1B7E", "#A1C935", "#1569C7", "#FBF6D9", "#6960EC", "#48CCCD", "#E5E4E2", "#B2C248", "#EAC117", "#728FCE", "#C25A7C", "#0020C2", "#25383C", "#4C787E", "#34282C", "#EBF4FA", "#504A4B", "#57E964", "#C47451", "#85BB65", "#F62217", "#C12283", "#C6DEFF", "#3EA055", "#659EC7", "#78866B", "#800517", "#E3319D", "#ADDFFF", "#64E986", "#B93B8F", "#7A5DC7", "#FDEEF4", "#FFFFC2", "#C6AEC7", "#BCE954", "#C5908E", "#5E7D7E", "#59E817", "#8AFB17", "#E42217", "#437C17", "#57FEFF", "#81D8D0", "#FFF8DC", "#966F33", "#E77471", "#837E7C", "#6A287E", "#835C3B", "#C85A17", "#7E587E", "#E0B0FF", "#347C17", "#F9B7FF"];

const canvas = document.getElementById("graphCanvas");
const context = canvas.getContext("2d");
const canvasWidth = 600;
const canvasHeight = 600;
const margin = 50;
let isBaseGraphWheel = false;
let coloringType = "uncolored"; //figure this out to work with addEdgeToGraph, addVertexToGraph
let g = new Graph();

/*
 * Function used to print graph information to the console.
 */

function logGraphInformation() {
   console.log("\n_________________");
   console.log("Graph information\n");
   let activeButtons = document.getElementById("colorOptions").getElementsByClassName("active");
   let coloringOption = activeButtons[0].id.replace("color", "").replace("Button", "");
   console.log("Coloring option: " + coloringOption);
   let usedColors = new Set();
   for (let value of g.vertexColorMap.values()) {
     usedColors.add(value);
   }
   console.log("Colors used: " + usedColors.size.toString());

   console.log("\n[Key, color]");
   for (let [key, color] of g.vertexColorMap.entries()) {
     console.log(key + ": " + color);
   }

   console.log("\n[Key, adjacent vertices]");
   for (let i = 0; i < g.vertexCount; ++i) {
     let adjacentMessage = i.toString() + ":";
     for (let j = 0; j < g.vertexCount; ++j) {
       if (i != j && g.adjMatrix[i][j] == 1) {
         adjacentMessage += (" " + j.toString());
       }
     }
     console.log(adjacentMessage);
   }
}

/*
 * Functions used to draw the graph.
 */

function dividePoints(numPoints, width, height, margin, wheel = isBaseGraphWheel) {
  if (numPoints == 0) {
    return [];
  }
  let xyArr = new Array(2 * numPoints);
  let centerX = width / 2;
  let centerY = height / 2;

  let includedCenter = 0;
  if (wheel) {
    xyArr[0] = centerX;
    xyArr[1] = centerY;
    ++includedCenter;
  }

  let degreeInterval = 360.0 / (numPoints - includedCenter);
  let horizontalRadius = width / 2 - margin;
  let verticalRadius = height / 2 - margin;

  for (let i = 0; i < numPoints - includedCenter; ++i) {
    let angleClockwise = i * degreeInterval;
    let xCoord = centerX + (horizontalRadius * Math.sin(angleClockwise * Math.PI / 180));
    let yCoord = centerY - (verticalRadius * Math.cos(angleClockwise * Math.PI / 180));
    xyArr[2 * (i + includedCenter)] = xCoord;
    xyArr[2 * (i + includedCenter) + 1] = yCoord;
  }
  return xyArr;
}

function drawVertex(vertex, centerX, centerY, radius, color="#FFFFFF") {
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "#000";
  context.stroke();

  context.fillStyle = "#000";
  context.font = "16px Arial";
  context.textAlign = "center";
  context.fillText(vertex.toString(), centerX, centerY + 6);
}

function drawEdge(beginX, beginY, endX, endY, color="#000000") {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 4;
  context.moveTo(beginX, beginY);
  context.lineTo(endX, endY);
  context.stroke();
}

function drawGraph(graph = g, wheel = isBaseGraphWheel) {
  applyColoringOption();
  let pointPositions = dividePoints(graph.vertexCount, canvasWidth, canvasHeight, margin, wheel);

  for (let key of graph.edgeColorMap.keys()) {
    let points = key.split("_");
    let firstPoint = parseInt(points[0]);
    let secondPoint = parseInt(points[1]);
    let beginX = pointPositions[2 * firstPoint];
    let beginY = pointPositions[2 * firstPoint + 1];
    let endX = pointPositions[2 * secondPoint];
    let endY = pointPositions[2 * secondPoint + 1];
    drawEdge(beginX, beginY, endX, endY, graph.edgeColorMap.get(key));
  }

  for (let key of graph.vertexColorMap.keys()) {
    drawVertex(key, pointPositions[2 * key], pointPositions[2 * key + 1], 20, graph.vertexColorMap.get(key));
  }
  logGraphInformation();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * Functions used to color the graph.
 */

function colorGraphUncolored_action() {
  g.assignUncoloredColoring();
}

function colorGraphUncolored() {
  clearCanvas();
  colorGraphUncolored_action();
  drawGraph();
}

function colorGraphEdgeInduced_action() {
  g.assignUncoloredColoring();
  for (let key of g.vertexColorMap.keys()) {
    g.vertexColorMap.set(key, "blue");
  }
  for (let key of g.edgeColorMap.keys()) {
    g.edgeColorMap.set(key, colors[Math.floor(Math.random() * colors.length)]);
  }
}

function colorGraphEdgeInduced() {
  clearCanvas();
  colorGraphEdgeInduced_action();
  drawGraph();
}

function colorGraphGreedy_action() {
  g.assignUncoloredColoring();
  g.assignGreedyColoring();
}

function colorGraphGreedy() {
  clearCanvas();
  colorGraphGreedy_action();
  drawGraph();
}

function colorGraphMinimum_action() {
  g.assignUncoloredColoring();
  g.assignMinimumColoring();
}

function colorGraphMinimum() {
  clearCanvas();
  colorGraphMinimum_action();
  drawGraph();
}

function applyColoringOption() {
  let activeButtons = document.getElementById("colorOptions").getElementsByClassName("active");
  let id = activeButtons[0].id;
  if (id == "colorUncoloredButton") {
    colorGraphUncolored_action();
  }
  else if (id == "colorEdgeInducedButton") {
    colorGraphEdgeInduced_action();
  }
  else if (id == "colorGreedyButton") {
    colorGraphGreedy_action();
  }
  else if (id == "colorMinimumButton") {
    colorGraphMinimum_action();
  }
}

/*
 * Functions used to add to the graph.
 */

function addVertexToGraph() {
  if (g.vertexCount < 100) {
    clearCanvas();
    g.addVertex();
    document.getElementById("vertices").value = g.vertexCount.toString();
    drawGraph();
  }
}

function addEdgeToGraph() {
  let maximumEdges = g.vertexCount * (g.vertexCount - 1) / 2;
  if (g.edgeColorMap.size < maximumEdges) {
      clearCanvas();
      while (true) {
        let firstVertex = Math.floor(Math.random() * g.vertexCount);
        let secondVertex = Math.floor(Math.random() * g.vertexCount);
        if (firstVertex != secondVertex) {
          if (g.adjMatrix[firstVertex][secondVertex] == 0) {
            g.addEdge(firstVertex, secondVertex);
            drawGraph();
            return;
          }
        }
      }
  }
}


/*
 * Functons that change the graph's display.
 */

function selectCycleDisplay() {
  isBaseGraphWheel = false;
  clearCanvas();
  drawGraph();
}

function selectWheelDisplay() {
  isBaseGraphWheel = true;
  clearCanvas();
  drawGraph();
}


/*
 * Functions used to generate different classes of graphs.
 */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; --i) {
    let rand_prev_index = Math.floor(Math.random() * i);
    let tmp = arr[i];
    arr[i] = arr[rand_prev_index];
    arr[rand_prev_index] = tmp;
  }
  return arr;
}

function retrieveVertexCount() {
  let vertexCount = Number($("#vertices").val());
  if (vertexCount < 1) {
    vertexCount = 1;
  }
  else if (vertexCount > 100) {
    vertexCount = 100;
  }
  document.getElementById("vertices").value = vertexCount.toString();
  return vertexCount;
}

function generateRandomGraph(label = "") {
  clearCanvas();
  let vertexCount = retrieveVertexCount();
  let minimumEdges = 0;
  let maximumEdges = vertexCount * (vertexCount - 1) / 2;

  if (label == "sparse") {
    maximumEdges = vertexCount - 1;
  }
  else if (label == "dense") {
    minimumEdges = vertexCount - 1;
  }

  let edgesRequired = Math.floor(Math.random() * (maximumEdges - minimumEdges + 1)) + minimumEdges;

  g = new Graph(vertexCount);

  let edgesAdded = 0;
  while (edgesAdded < edgesRequired) {
    let firstVertex = Math.floor(Math.random() * g.vertexCount);
    let secondVertex = Math.floor(Math.random() * g.vertexCount);
    if (firstVertex != secondVertex) {
      if (g.adjMatrix[firstVertex][secondVertex] == 0) {
        g.addEdge(firstVertex, secondVertex);
        ++edgesAdded;
      }
    }
  }
  drawGraph();
}

function generateSparseGraph() {
  generateRandomGraph("sparse");
}

function generateDenseGraph() {
  generateRandomGraph("dense");
}

function generateEdgelessGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();
  g = new Graph(vertexCount);
  drawGraph();
}

function generateCycleGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 3) {
    vertexCount = 3;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  g = new Graph(vertexCount);
  for (let i = 0; i < g.vertexCount; ++i) {
    g.addEdge(i, i + 1);
  }
  g.addEdge(0, g.vertexCount - 1);
  drawGraph();
}

function generateWheelGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 4) {
    vertexCount = 4;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  g = new Graph(vertexCount);
  for (let i = 1; i < g.vertexCount; ++i) {
    g.addEdge(i, i + 1);
  }
  g.addEdge(1, g.vertexCount - 1);

  for (let i = 1; i < g.vertexCount; ++i) {
    g.addEdge(0, i);
  }
  drawGraph();
}

function generateMinimalGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 2) {
    vertexCount = 2;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  g = new Graph(vertexCount);

  let arr = [];
  for (let i = 0; i < vertexCount; ++i) {
    arr.push(i);
  }

  arr = shuffle(arr);

  for (let i = 0; i < arr.length - 1; ++i) {
    g.addEdge(arr[i], arr[i + 1]);
  }
  drawGraph();
}

function generateConnectedGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 2) {
    vertexCount = 2;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  g = new Graph(vertexCount);

  let arr = [];
  for (let i = 0; i < g.vertexCount; ++i) {
    arr.push(i);
  }
  arr = shuffle(arr);

  for (let i = 0; i < arr.length - 1; ++i) {
    g.addEdge(arr[i], arr[i + 1]);
  }

  let edgesAdded = vertexCount - 1;
  const maximumEdges = vertexCount * (vertexCount - 1) / 2;
  const edgesRequired = Math.floor(Math.random() * (maximumEdges - vertexCount + 2)) + edgesAdded;

  while (edgesAdded < edgesRequired) {
    let firstVertex = Math.floor(Math.random() * g.vertexCount);
    let secondVertex = Math.floor(Math.random() * g.vertexCount);
    if (firstVertex != secondVertex) {
      if (g.adjMatrix[firstVertex][secondVertex] == 0) {
        g.addEdge(firstVertex, secondVertex);
        ++edgesAdded;
      }
    }
  }
  drawGraph();
}

function generateCompleteGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 2) {
    vertexCount = 2;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  g = new Graph(vertexCount);

  for (let i = 0; i < g.vertexCount; ++i) {
    for (let j = i + 1; j < g.vertexCount; ++j) {
      g.addEdge(i, j);
    }
  }
  drawGraph();
}

/*
 * Function to add active class to in-use buttons.
 */

function addActiveFunctionality(optionsId) {
  let buttons = document.getElementById(optionsId).getElementsByClassName("input");
  for (let i = 0; i < buttons.length; ++i) {
    buttons[i].addEventListener("click", function() {
      let current = document.getElementById(optionsId).getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    })
  }
}

/*
 * Functions used to change the vertex count of the displayed graph.
 */

function increaseVertexCount() {
  let vertexCount = retrieveVertexCount();
  if (vertexCount < 100) {
    ++vertexCount;
    document.getElementById("vertices").value = vertexCount.toString();
    document.getElementById("vertices").dispatchEvent(new Event("change"));
  }
}

function sameVertexCount() {
  document.getElementById("vertices").dispatchEvent(new Event("change"));
}

function decreaseVertexCount() {
  let vertexCount = retrieveVertexCount();
  if (vertexCount > 1) {
    --vertexCount;
    document.getElementById("vertices").value = vertexCount.toString();
    document.getElementById("vertices").dispatchEvent(new Event("change"));
  }
}

/*
 * Function to randomize onload graph and also add functionality to buttons.
 */

window.onload = function() {
  /*
   * Randomize onload graph.
   */

  const vertexCount = Math.floor(Math.random() * 8) + 3;
  document.getElementById("vertices").value = vertexCount.toString();
  generateRandomGraph();


  /*
   * Add active functionality to input groups.
   */

  addActiveFunctionality("generateOptions");
  addActiveFunctionality("displayOptions");
  addActiveFunctionality("colorOptions");

  /*
   * Add dynamic graph generation with changes to the number of vertices.
   */

  document.getElementById("vertices").addEventListener("change", function() {
    let activeButtons = document.getElementById("userInput").getElementsByClassName("active");
    for (let i = 0; i < activeButtons.length; ++i) {
      console.log(activeButtons[i].id);
      document.getElementById(activeButtons[i].id).click();
    }
  })

  /*
   * Add button onclick methods.
   */

  document.getElementById("increaseVertexCountButton").addEventListener("click", increaseVertexCount);
  document.getElementById("decreaseVertexCountButton").addEventListener("click", decreaseVertexCount);
  document.getElementById("sameVertexCountButton").addEventListener("click", sameVertexCount);

  document.getElementById("generateRandomButton").addEventListener("click", generateRandomGraph);
  document.getElementById("generateSparseButton").addEventListener("click", generateSparseGraph);
  document.getElementById("generateDenseButton").addEventListener("click", generateDenseGraph);

  document.getElementById("generateEdgelessButton").addEventListener("click", generateEdgelessGraph);
  document.getElementById("generateCycleButton").addEventListener("click", generateCycleGraph);
  document.getElementById("generateWheelButton").addEventListener("click", generateWheelGraph);

  document.getElementById("generateMinimalButton").addEventListener("click", generateMinimalGraph);
  document.getElementById("generateConnectedButton").addEventListener("click", generateConnectedGraph);
  document.getElementById("generateCompleteButton").addEventListener("click", generateCompleteGraph);

  document.getElementById("selectCycleLikeButton").addEventListener("click", selectCycleDisplay);
  document.getElementById("selectWheelLikeButton").addEventListener("click", selectWheelDisplay);

  document.getElementById("addVertexButton").addEventListener("click", addVertexToGraph);
  document.getElementById("addEdgeButton").addEventListener("click", addEdgeToGraph);

  document.getElementById("colorUncoloredButton").addEventListener("click", colorGraphUncolored);
  document.getElementById("colorEdgeInducedButton").addEventListener("click", colorGraphEdgeInduced);

  document.getElementById("colorGreedyButton").addEventListener("click", colorGraphGreedy);
  document.getElementById("colorMinimumButton").addEventListener("click", colorGraphMinimum);
}
