
// Limit the maximum amount of recursive calls for
// the exponential runtime minimum coloring algorithm (NP-complete).
// Switch to greedy coloring if number of calls reaches limiter.
// This prevents webpage from becoming unresponsive.

let recursiveCallCount_ = 0;
const recursiveLimiter_ = 100000;

function evaluateMinColorRuntime() {
  if (recursiveCallCount_ >= recursiveLimiter_) {
    document.getElementById("colorGreedyButton").click();
    return false;
  }
  return true;
}

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

  removeEdge(vertex1, vertex2) {
    if (vertex1 < 0 || vertex1 >= this.vertexCount) {
      return;
    }
    if (vertex2 < 0 || vertex2 >= this.vertexCount) {
      return;
    }
    if (vertex1 == vertex2) {
      return;
    }

    this.adjMatrix[vertex1][vertex2] = 0;
    this.adjMatrix[vertex2][vertex1] = 0;

    let arr = [vertex1, vertex2];
    arr.sort();
    this.edgeColorMap.delete(arr.join('_'));
  }

  incidentVertices(vertex) {
    let arr = [];
    if (vertex < 0 || vertex >= this.vertexCount) {
      return arr;
    }
    for (let i = 0; i < this.vertexCount; ++i) {
      if (i != vertex && this.adjMatrix[vertex][i] == 1) {
        arr.push(i);
      }
    }
    return arr;
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

  assignEdgeInducedColoring() {
    globalGraph_.assignUncoloredColoring();
    for (let key of globalGraph_.vertexColorMap.keys()) {
      globalGraph_.vertexColorMap.set(key, "blue");
    }
    for (let key of globalGraph_.edgeColorMap.keys()) {
      globalGraph_.edgeColorMap.set(key, colorBank_[Math.floor(Math.random() * colorBank_.length)]);
    }
  }

  nextAvailableColor(keyIndex, colorCount) {
    let incidentColoredVertices = this.incidentColoredVertices(keyIndex);
    for (let i = 0; i < colorCount; ++i) {
      let available = true;
      let color = colorBank_[i];

      for (let i = 0; i < incidentColoredVertices.length; ++i) {
        if (color == this.vertexColorMap.get(incidentColoredVertices[i].toString())) {
          available = false;
          break;
        }
      }

      if (available) {
        return color;
      }
    }
    return "#FFFFFF";
  }

  assignGreedyColoring() {
    this.assignUncoloredColoring();
    for (let key of this.vertexColorMap.keys()) {
      let color = this.nextAvailableColor(Number(key), this.vertexCount);
      if (color == "#FFFFFF") {
        return;
      }
//      console.log("Set " + key + " to " + color);
      this.vertexColorMap.set(key, color);
    }
  }

  preliminaryMinAssignments() {
    let edgeCount = this.edgeColorMap.size;

    // edgeless
    if (edgeCount == 0) {
      this.assignMinimumColoring_helper(0, 1);
      evaluateMinColorRuntime();
      return true;
    }

    // complete
    let maximumEdges = this.vertexCount * (this.vertexCount - 1) / 2;
    if (edgeCount == maximumEdges) {
      this.assignMinimumColoring_helper(0, this.vertexCount);
      evaluateMinColorRuntime();
      return true;
    }
    return false;
  }

  assignMinimumColoring() {
    recursiveCallCount_ = 0;
    this.assignUncoloredColoring();

    if (this.preliminaryMinAssignments()) {
      return;
    }

    let edgeCount = this.edgeColorMap.size;
    let colorCount = this.vertexCount - 1;
    let minColorCount = 0;

    while(true) {
      let canColor = this.assignMinimumColoring_helper(0, colorCount);
      if (!evaluateMinColorRuntime()) {
        return;
      }

      if (canColor) {
        this.assignUncoloredColoring();
        --colorCount;
      }
      else {
        minColorCount = colorCount + 1;
        break;
      }
    }
    this.assignMinimumColoring_helper(0, minColorCount);
    evaluateMinColorRuntime();
  }

  isColorAvailable(keyIndex, color) {
    let incidentColoredVertices = this.incidentColoredVertices(keyIndex);
    for (let i = 0; i < incidentColoredVertices.length; ++i) {
      if (color == this.vertexColorMap.get(incidentColoredVertices[i].toString())) {
        return false;
      }
    }
    return true;
  }

  assignMinimumColoring_helper(keyIndex, colorCount) {
    ++recursiveCallCount_;
    if (colorCount <= 0 || recursiveCallCount_ >= recursiveLimiter_) {
      return false;
    }

    for (let i = 0; i < colorCount; ++i) {
      let color = colorBank_[i];
      if (this.isColorAvailable(keyIndex, color)) {
//        console.log("[SET] " + keyIndex.toString() + " to " + color);
        this.vertexColorMap.set(keyIndex.toString(), color);
        if (keyIndex + 1 < this.vertexCount) {
          if(this.assignMinimumColoring_helper(keyIndex + 1, colorCount)) {
            return true;
          }
        }
        else {
          return true;
        }
//        console.log("[RESET] " + keyIndex.toString() + " to " + "UNCOLORED");
        this.vertexColorMap.set(keyIndex.toString(), "#FFFFFF");
      }
    }
    return false;
  }

}

/*
 * Global variables used in drawing and displaying the graph.
 */


// first line of colorBank_: gray, red, yellow, blue, lime, fuschia, purple, silver, maroon, green, aqua, teal, navy, olive
const colorBank_ = ["#808080", "#FF0000", "#FFFF00", "#0000FF", "#00FF00", "#FF00FF", "#800080", "#C0C0C0", "#800000", "#008000", "#00FFFF", "#008080", "#000080", "#808000",
"#FF7F50", "#CA226B", "#8467D7", "#7D0552", "#FFA62F", "#348781", "#0000A0", "#8EEBEC", "#810541", "#F7E7CE", "#E67451", "#C24641", "#B4CFEC", "#7FFFD4", "#5EFB6E", "#87F717", "#E38AAE", "#C3FDB8", "#B6B6B4", "#565051", "#FBBBB9", "#842DCE", "#15317E", "#C12869", "#4B0082", "#728C00", "#43C6DB", "#C8B560", "#D462FF", "#9CB071", "#ECE5B6", "#FFDB58", "#6CC417", "#306754", "#F75D59", "#41A317", "#C8A2C8", "#E41B17", "#848482", "#C34A2C", "#7F4E52", "#736F6E", "#FFE87C", "#616D7E", "#B38481", "#FDD017", "#FFDFDD", "#FFE5B4", "#A74AC7", "#FCDFFF", "#342D7E", "#98AFC7", "#DEB887", "#2B60DE", "#FFF380", "#F88017", "#954535", "#FFD801", "#FBB917", "#8C001A", "#E55B3C", "#C19A6B", "#D2B9D3", "#463E3F", "#D1D0CE", "#C11B17", "#4E8975", "#FFF5EE", "#CD7F32", "#CFECEC", "#6CBB3C", "#348017", "#667C26", "#78C7C7", "#6C2DC7", "#FC6C85", "#FFF8C6", "#E3E4FA", "#DC381F", "#7E3817", "#C36241", "#3BB9FF", "#C58917", "#5C5858", "#E56E94", "#4CC417", "#CC6600", "#B041FF", "#CCFFFF", "#F2BB66", "#56A5EC", "#FAAFBA", "#EBDDE2", "#B1FB17", "#B7CEEC", "#566D7E", "#2B3856", "#F5F5DC", "#786D5F", "#827B60", "#C48189", "#E18B6B", "#9172EC", "#43BFC7", "#FDD7E4", "#87AFC7", "#9DC209", "#E66C2C", "#C68E17", "#4C4646", "#827839", "#3B3131", "#46C7C7", "#AF7817", "#EDE275", "#E799A3", "#3D3C3A", "#D16587", "#CCFB5D", "#C38EC7", "#3EA99F", "#5CB3FF", "#646D7E", "#8A4117", "#7F38EC", "#C88141", "#AF9B60", "#1F45FC", "#E0FFFF", "#C12267", "#93FFE8", "#FF2400", "#7BCCB5", "#F0FFFF", "#9F000F", "#E9AB17", "#FF8040", "#8E35EF", "#C2DFFF", "#F535AA", "#0041C2", "#E6A9EC", "#F9A7B0", "#82CAFF", "#614051", "#571B7E", "#F6358A", "#FAAFBE", "#C45AEC", "#C04000", "#A23BEC", "#EDDA74", "#F778A1", "#C35817", "#347C2C", "#FBB117", "#6D6968", "#F70D1A", "#6D7B8D", "#3B9C9C", "#9AFEFF", "#893BFF", "#990012", "#357EC7", "#493D26", "#F52887", "#EE9A4D", "#FAEBD7", "#F433FF", "#E9CFEC", "#D4A017", "#ADA96E", "#38ACEC", "#583759", "#4AA02C", "#E4287C", "#307D7E", "#2B547E", "#1589FF", "#FFEBCD", "#77BFC7", "#2B65EC", "#5E5A80", "#4863A0", "#4E9258", "#52D017", "#736AFF", "#8D38C9", "#7DFDFE", "#7FE817", "#E238EC", "#A0CFEC", "#BDEDFF", "#7F462C", "#6AFB92", "#E8ADAA", "#6AA121", "#E8A317", "#368BC1", "#7F5A58", "#E45E9D", "#151B54", "#C7A317", "#7D0541", "#C9BE62", "#306EFF", "#848b79", "#4E387E", "#151B8D", "#F62817", "#2554C7", "#ECC5C0", "#BCC6CC", "#C2B280", "#FFFFCC", "#625D5D", "#413839", "#F3E5AB", "#F660AB", "#B5A642", "#806517", "#9E7BFF", "#50EBEC", "#6698FF", "#347235", "#EDC9AF", "#7F525D", "#F9966B", "#387C44", "#8BB381", "#C48793", "#79BAEC", "#3090C7", "#FFCBA4", "#726E6D", "#92C7C7", "#B87333", "#82CAFA", "#F87431", "#B048B5", "#666362", "#657383", "#254117", "#6495ED", "#E78A61", "#F0F8FF", "#617C58", "#7E354D", "#B5EAAA", "#C25283", "#461B7E", "#F88158", "#5FFB17", "#E56717", "#7E3517", "#157DEC", "#AFDCEC", "#E2A76F", "#E7A1B0", "#F87217", "#438D80", "#98FF98", "#54C571", "#7F5217", "#89C35C", "#4EE2EC", "#488AC7", "#483C32", "#4CC552", "#95B9C7", "#E55451", "#737CA1", "#6F4E37", "#99C68E", "#7D1B7E", "#A1C935", "#1569C7", "#FBF6D9", "#6960EC", "#48CCCD", "#E5E4E2", "#B2C248", "#EAC117", "#728FCE", "#C25A7C", "#0020C2", "#25383C", "#4C787E", "#34282C", "#EBF4FA", "#504A4B", "#57E964", "#C47451", "#85BB65", "#F62217", "#C12283", "#C6DEFF", "#3EA055", "#659EC7", "#78866B", "#800517", "#E3319D", "#ADDFFF", "#64E986", "#B93B8F", "#7A5DC7", "#FDEEF4", "#FFFFC2", "#C6AEC7", "#BCE954", "#C5908E", "#5E7D7E", "#59E817", "#8AFB17", "#E42217", "#437C17", "#57FEFF", "#81D8D0", "#FFF8DC", "#966F33", "#E77471", "#837E7C", "#6A287E", "#835C3B", "#C85A17", "#7E587E", "#E0B0FF", "#347C17", "#F9B7FF"];

const canvas_ = document.getElementById("graphCanvas");
const context_ = canvas_.getContext("2d");
const canvasWidth_ = 600;
const canvasHeight_ = 600;
const margin_ = 50;
let isDisplayWheel_ = false;
let globalGraph_ = new Graph();
let table_ = document.getElementById("graphInformation");

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
   for (let value of globalGraph_.vertexColorMap.values()) {
     usedColors.add(value);
   }
   console.log("Colors used: " + usedColors.size.toString());
   console.log("recursiveCallCount_: " + recursiveCallCount_.toString());
   recursiveCallCount_ = 0;
}

/*
 * Functions used to draw and update the displayed graph and table.
 */

function dividePoints(numPoints, width, height, margin_, wheel = isDisplayWheel_) {
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
  let horizontalRadius = width / 2 - margin_;
  let verticalRadius = height / 2 - margin_;

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
  context_.beginPath();
  context_.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context_.fillStyle = color;
  context_.fill();
  context_.lineWidth = 1;
  context_.strokeStyle = "#000";
  context_.stroke();

  context_.fillStyle = "#000";
  context_.font = "16px Arial";
  context_.textAlign = "center";
  context_.fillText(vertex.toString(), centerX, centerY + 6);
}

function drawEdge(beginX, beginY, endX, endY, color="#000000") {
  context_.beginPath();
  context_.strokeStyle = color;
  context_.lineWidth = 4;
  context_.moveTo(beginX, beginY);
  context_.lineTo(endX, endY);
  context_.stroke();
}

function drawGraph() {
  applyColoringOption();
  let pointPositions = dividePoints(globalGraph_.vertexCount, canvasWidth_, canvasHeight_, margin_);

  for (let key of globalGraph_.edgeColorMap.keys()) {
    let points = key.split("_");
    let firstPoint = parseInt(points[0]);
    let secondPoint = parseInt(points[1]);
    let beginX = pointPositions[2 * firstPoint];
    let beginY = pointPositions[2 * firstPoint + 1];
    let endX = pointPositions[2 * secondPoint];
    let endY = pointPositions[2 * secondPoint + 1];
    drawEdge(beginX, beginY, endX, endY, globalGraph_.edgeColorMap.get(key));
  }

  for (let key of globalGraph_.vertexColorMap.keys()) {
    drawVertex(key, pointPositions[2 * key], pointPositions[2 * key + 1], 20, globalGraph_.vertexColorMap.get(key));
  }
}

function updateGraphText() {
  document.getElementById("InfoVertexCount").innerHTML = globalGraph_.vertexCount;

  let maximumEdges = globalGraph_.vertexCount * (globalGraph_.vertexCount - 1) / 2;
  document.getElementById("InfoEdgeCount").innerHTML = globalGraph_.edgeColorMap.size.toString() + " out of " + maximumEdges.toString();

  let activeGenerateButtons = document.getElementById("generateOptions").getElementsByClassName("active");
  let generateOption = document.getElementById(activeGenerateButtons[0].id).innerHTML;
  let baseVertexCount = document.getElementById("vertices").value;
  let endStr = (parseInt(baseVertexCount) != 1) ? " vertices" : " vertex";
  document.getElementById("InfoBaseGraph").innerHTML = generateOption + " with " + baseVertexCount + endStr;

  document.getElementById("InfoDisplayOption").innerHTML = isDisplayWheel_ ? "Wheel-like" : "Cycle-like";

  let activeColorButtons = document.getElementById("colorOptions").getElementsByClassName("active");
  let coloringOption = document.getElementById(activeColorButtons[0].id).innerHTML;
  document.getElementById("InfoColorScheme").innerHTML = coloringOption;

  let usedColors = new Set();
  for (let value of globalGraph_.vertexColorMap.values()) {
    usedColors.add(value);
  }
  document.getElementById("InfoColorsUsed").innerHTML = usedColors.size;
}

function clearDataTable() {
  let rowCount = table_.rows.length;
  for (let i = 1; i < rowCount; ++i) {
    table_.deleteRow(1);
  }
}

function generateDataTable() {
  for (let i = 0; i < globalGraph_.vertexCount; ++i) {
    let row = table_.insertRow(i + 1);
    let vertexCell = row.insertCell(0);
    let colorCell = row.insertCell(1);
    let degreeCell = row.insertCell(2);
    let neighborsCell = row.insertCell(3);

    vertexCell.innerHTML = i.toString();
    colorCell.innerHTML = globalGraph_.vertexColorMap.get(i.toString());

    let neighbors = globalGraph_.incidentVertices(i);
    degreeCell.innerHTML = neighbors.length;

    let neighborsStr = "";
    for (let j = 0; j < neighbors.length; ++j) {
      neighborsStr += neighbors[j];
      if (j < neighbors.length - 1) {
        neighborsStr += ", ";
      }
    }
    neighborsCell.innerHTML = neighborsStr;
  }
}

function updateShownGraph() {
  drawGraph();
  updateGraphText();
  clearDataTable();
  generateDataTable();
  logGraphInformation();
}

function clearCanvas() {
  context_.clearRect(0, 0, canvas_.width, canvas_.height);
}

/*
 * Functions used to color the graph.
 */

 function colorGraph() {
   clearCanvas();
   updateShownGraph();
 }

function applyColoringOption() {
  let activeButtons = document.getElementById("colorOptions").getElementsByClassName("active");
  let id = activeButtons[0].id;
  if (id == "colorUncoloredButton") {
    globalGraph_.assignUncoloredColoring();
  }
  else if (id == "colorEdgeInducedButton") {
    globalGraph_.assignEdgeInducedColoring();
  }
  else if (id == "colorGreedyButton") {
    globalGraph_.assignGreedyColoring();
  }
  else if (id == "colorMinimumButton") {
    globalGraph_.assignMinimumColoring();
  }
}

/*
 * Functions used to add to the graph.
 */

function addVertexToGraph() {
  if (globalGraph_.vertexCount < 100) {
    clearCanvas();
    globalGraph_.addVertex();
    updateShownGraph();
  }
}

function addRandomEdgeToGraph() {
  let maximumEdges = globalGraph_.vertexCount * (globalGraph_.vertexCount - 1) / 2;
  if (globalGraph_.edgeColorMap.size < maximumEdges) {
      clearCanvas();
      while (true) {
        let firstVertex = Math.floor(Math.random() * globalGraph_.vertexCount);
        let secondVertex = Math.floor(Math.random() * globalGraph_.vertexCount);
        if (firstVertex != secondVertex) {
          if (globalGraph_.adjMatrix[firstVertex][secondVertex] == 0) {
            globalGraph_.addEdge(firstVertex, secondVertex);
            updateShownGraph();
            return;
          }
        }
      }
  }
}

// check for invalid edge additions to avoid unnecessarily re-updating the shown graph
function addCustomEdgeToGraph() {
  let firstVertex = document.getElementById("firstVertex").value;
  let secondVertex = document.getElementById("secondVertex").value;
  if (firstVertex != secondVertex
    && firstVertex >= 0 && firstVertex < globalGraph_.vertexCount
    && secondVertex >= 0 && secondVertex < globalGraph_.vertexCount) {
    if (globalGraph_.adjMatrix[firstVertex][secondVertex] != 1) {
      globalGraph_.addEdge(firstVertex, secondVertex);
      updateShownGraph();
      return;
    }
  }
}

function removeCustomEdgeFromGraph() {
  let firstVertex = document.getElementById("firstVertex").value;
  let secondVertex = document.getElementById("secondVertex").value;
  if (firstVertex != secondVertex
    && firstVertex >= 0 && firstVertex < globalGraph_.vertexCount
    && secondVertex >= 0 && secondVertex < globalGraph_.vertexCount) {
    if (globalGraph_.adjMatrix[firstVertex][secondVertex] != 0) {
      globalGraph_.removeEdge(firstVertex, secondVertex);
      clearCanvas();
      updateShownGraph();
      return;
    }
  }
}

/*
 * Functons that change the graph's display.
 */

function selectCycleDisplay() {
  isDisplayWheel_ = false;
  clearCanvas();
  updateShownGraph();
}

function selectWheelDisplay() {
  isDisplayWheel_ = true;
  clearCanvas();
  updateShownGraph();
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

  globalGraph_ = new Graph(vertexCount);

  let edgesAdded = 0;
  while (edgesAdded < edgesRequired) {
    let firstVertex = Math.floor(Math.random() * globalGraph_.vertexCount);
    let secondVertex = Math.floor(Math.random() * globalGraph_.vertexCount);
    if (firstVertex != secondVertex) {
      if (globalGraph_.adjMatrix[firstVertex][secondVertex] == 0) {
        globalGraph_.addEdge(firstVertex, secondVertex);
        ++edgesAdded;
      }
    }
  }
  updateShownGraph();
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
  globalGraph_ = new Graph(vertexCount);
  updateShownGraph();
}

function generateCycleGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 3) {
    vertexCount = 3;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  globalGraph_ = new Graph(vertexCount);
  for (let i = 0; i < globalGraph_.vertexCount; ++i) {
    globalGraph_.addEdge(i, i + 1);
  }
  globalGraph_.addEdge(0, globalGraph_.vertexCount - 1);
  updateShownGraph();
}

function generateWheelGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 4) {
    vertexCount = 4;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  globalGraph_ = new Graph(vertexCount);
  for (let i = 1; i < globalGraph_.vertexCount; ++i) {
    globalGraph_.addEdge(i, i + 1);
  }
  globalGraph_.addEdge(1, globalGraph_.vertexCount - 1);

  for (let i = 1; i < globalGraph_.vertexCount; ++i) {
    globalGraph_.addEdge(0, i);
  }
  updateShownGraph();
}

function generateMinimalGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 2) {
    vertexCount = 2;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  globalGraph_ = new Graph(vertexCount);

  let arr = [];
  for (let i = 0; i < vertexCount; ++i) {
    arr.push(i);
  }

  arr = shuffle(arr);

  for (let i = 0; i < arr.length - 1; ++i) {
    globalGraph_.addEdge(arr[i], arr[i + 1]);
  }
  updateShownGraph();
}

function generateConnectedGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 2) {
    vertexCount = 2;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  globalGraph_ = new Graph(vertexCount);

  let arr = [];
  for (let i = 0; i < globalGraph_.vertexCount; ++i) {
    arr.push(i);
  }
  arr = shuffle(arr);

  for (let i = 0; i < arr.length - 1; ++i) {
    globalGraph_.addEdge(arr[i], arr[i + 1]);
  }

  let edgesAdded = vertexCount - 1;
  const maximumEdges = vertexCount * (vertexCount - 1) / 2;
  const edgesRequired = Math.floor(Math.random() * (maximumEdges - vertexCount + 2)) + edgesAdded;

  while (edgesAdded < edgesRequired) {
    let firstVertex = Math.floor(Math.random() * globalGraph_.vertexCount);
    let secondVertex = Math.floor(Math.random() * globalGraph_.vertexCount);
    if (firstVertex != secondVertex) {
      if (globalGraph_.adjMatrix[firstVertex][secondVertex] == 0) {
        globalGraph_.addEdge(firstVertex, secondVertex);
        ++edgesAdded;
      }
    }
  }
  updateShownGraph();
}

function generateCompleteGraph() {
  clearCanvas();
  let vertexCount = retrieveVertexCount();

  if (vertexCount < 2) {
    vertexCount = 2;
    document.getElementById("vertices").value = vertexCount.toString();
  }

  globalGraph_ = new Graph(vertexCount);

  for (let i = 0; i < globalGraph_.vertexCount; ++i) {
    for (let j = i + 1; j < globalGraph_.vertexCount; ++j) {
      globalGraph_.addEdge(i, j);
    }
  }
  updateShownGraph();
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
   * Add limits to first and second vertex for custom edge input.
   */

  document.getElementById("firstVertex").addEventListener("change", function() {
    if (this.value < 0) {
      this.value = 0;
    }
    else if (this.value >= globalGraph_.vertexCount) {
      this.value = globalGraph_.vertexCount - 1;
    }
  })

  document.getElementById("secondVertex").addEventListener("change", function() {
    if (this.value < 0) {
      this.value = 0;
    }
    else if (this.value >= globalGraph_.vertexCount) {
      this.value = globalGraph_.vertexCount - 1;
    }
  })

  /*
   * Add dynamic graph generation with changes to the number of vertices.
   */

  document.getElementById("vertices").addEventListener("change", function() {
    document.getElementById("firstVertex").value = 0;
    document.getElementById("secondVertex").value = 0;
    let activeButtons = document.getElementById("generateOptions").getElementsByClassName("active");
    document.getElementById(activeButtons[0].id).click();
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

  document.getElementById("generateMinSpanButton").addEventListener("click", generateMinimalGraph);
  document.getElementById("generateConnectedButton").addEventListener("click", generateConnectedGraph);
  document.getElementById("generateCompleteButton").addEventListener("click", generateCompleteGraph);

  document.getElementById("selectCycleLikeButton").addEventListener("click", selectCycleDisplay);
  document.getElementById("selectWheelLikeButton").addEventListener("click", selectWheelDisplay);

  document.getElementById("addVertexButton").addEventListener("click", addVertexToGraph);
  document.getElementById("addRandomEdgeButton").addEventListener("click", addRandomEdgeToGraph);
  document.getElementById("addCustomEdgeButton").addEventListener("click", addCustomEdgeToGraph);
  document.getElementById("removeCustomEdgeButton").addEventListener("click", removeCustomEdgeFromGraph);

  document.getElementById("colorUncoloredButton").addEventListener("click", colorGraph);
  document.getElementById("colorEdgeInducedButton").addEventListener("click", colorGraph);

  document.getElementById("colorGreedyButton").addEventListener("click", colorGraph);
  document.getElementById("colorMinimumButton").addEventListener("click", colorGraph);
}
