
const colors = ["#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F0FFFF", "#F5F5DC", "#FFE4C4", "#FFEBCD", "#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E", "#FF7F50", "#6495ED", "#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B", "#B8860B", "#A9A9A9", "#A9A9A9", "#006400", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00", "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#2F4F4F", "#00CED1", "#9400D3", "#FF1493", "#00BFFF", "#696969", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22", "#FF00FF", "#DCDCDC", "#F8F8FF", "#FFD700", "#DAA520", "#808080", "#808080", "#008000", "#ADFF2F", "#F0FFF0", "#FF69B4", "#CD5C5C", "#4B0082", "#FFFFF0", "#F0E68C", "#E6E6FA", "#FFF0F5", "#7CFC00", "#FFFACD", "#ADD8E6", "#F08080", "#E0FFFF", "#FAFAD2", "#D3D3D3", "#D3D3D3", "#90EE90", "#FFB6C1", "#FFA07A", "#20B2AA", "#87CEFA", "#778899", "#778899", "#B0C4DE", "#FFFFE0", "#00FF00", "#32CD32", "#FAF0E6", "#FF00FF", "#800000", "#66CDAA", "#0000CD", "#BA55D3", "#9370DB", "#3CB371", "#7B68EE", "#00FA9A", "#48D1CC", "#C71585", "#191970", "#F5FFFA", "#FFE4E1", "#FFE4B5", "#FFDEAD", "#000080", "#FDF5E6", "#808000", "#6B8E23", "#FFA500", "#FF4500", "#DA70D6", "#EEE8AA", "#98FB98", "#AFEEEE", "#DB7093", "#FFEFD5", "#FFDAB9", "#CD853F", "#FFC0CB", "#DDA0DD", "#B0E0E6", "#800080", "#663399", "#FF0000", "#BC8F8F", "#4169E1", "#8B4513", "#FA8072", "#F4A460", "#2E8B57", "#FFF5EE", "#A0522D", "#C0C0C0", "#87CEEB", "#6A5ACD", "#708090", "#708090", "#FFFAFA", "#00FF7F", "#4682B4", "#D2B48C", "#008080", "#D8BFD8", "#FF6347", "#40E0D0", "#EE82EE", "#F5DEB3", "#FFFF00", "#9ACD32"];

const canvas = document.getElementById("graphCanvas");
const context = canvas.getContext("2d");
const canvas_width = 600;
const canvas_height = 600;
const margin = 50;
let isBaseGraphWheel = false;

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

  assignEdgeColors() {
    let arr = shuffle(colors);
    for (let i = 0; i < g.vertexCount; ++i) {
      for (let j = 0; j < g.vertexCount; ++j) {

      }
    }
  }

  assignVertexColors() {

  }

  assignEdgeInducedColoring() {

  }
}

let g = new Graph();

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
  context.lineWidth = 2;
  context.moveTo(beginX, beginY);
  context.lineTo(endX, endY);
  context.stroke();
}

function drawGraph(graph = g, wheel = isBaseGraphWheel) {
  let pointPositions = dividePoints(graph.vertexCount, canvas_width, canvas_height, margin, wheel);

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
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

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
  isBaseGraphWheel = false;
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
  isBaseGraphWheel = false;
  generateRandomGraph("sparse");
}

function generateDenseGraph() {
  isBaseGraphWheel = false;
  generateRandomGraph("dense");
}

function generateEdgelessGraph() {
  clearCanvas();
  isBaseGraphWheel = false;
  let vertexCount = retrieveVertexCount();
  g = new Graph(vertexCount);
  drawGraph();
}

function generateCycleGraph() {
  clearCanvas();
  isBaseGraphWheel = false;
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
  isBaseGraphWheel = true;
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
  drawGraph(g, true);
}

function generateMinimalGraph() {
  clearCanvas();
  isBaseGraphWheel = false;
  let vertexCount = retrieveVertexCount();
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
  isBaseGraphWheel = false;
  let vertexCount = retrieveVertexCount();
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
  isBaseGraphWheel = false;
  let vertexCount = retrieveVertexCount();
  g = new Graph(vertexCount);

  for (let i = 0; i < g.vertexCount; ++i) {
    for (let j = i + 1; j < g.vertexCount; ++j) {
      g.addEdge(i, j);
    }
  }
  drawGraph();
}


function colorGraphEdgeInduced() {
  clearCanvas();
  for (let key of g.vertexColorMap.keys()) {
    g.vertexColorMap.set(key, "blue");
  }
  for (let key of g.edgeColorMap.keys()) {
    g.edgeColorMap.set(key, colors[Math.floor(Math.random() * colors.length)]);
  }
  drawGraph();
}

function colorGraphVertices() {
  clearCanvas();
  for (let key of g.edgeColorMap.keys()) {
    g.edgeColorMap.set(key, "black");
  }

  for (let key of g.vertexColorMap.keys()) {
    g.vertexColorMap.set(key, colors[Math.floor(Math.random() * colors.length)]);
  }
  drawGraph();
}

window.onload = function() {
  const vertexCount = Math.floor(Math.random() * 8) + 3;
  document.getElementById("vertices").value = vertexCount.toString();
  generateRandomGraph();

  document.getElementById("generateRandomButton").addEventListener("click", generateRandomGraph);
  document.getElementById("generateSparseButton").addEventListener("click", generateSparseGraph);
  document.getElementById("generateDenseButton").addEventListener("click", generateDenseGraph);

  document.getElementById("generateEdgelessButton").addEventListener("click", generateEdgelessGraph);
  document.getElementById("generateCycleButton").addEventListener("click", generateCycleGraph);
  document.getElementById("generateWheelButton").addEventListener("click", generateWheelGraph);

  document.getElementById("generateMinimalButton").addEventListener("click", generateMinimalGraph);
  document.getElementById("generateConnectedButton").addEventListener("click", generateConnectedGraph);
  document.getElementById("generateCompleteButton").addEventListener("click", generateCompleteGraph);

  document.getElementById("addVertexButton").addEventListener("click", addVertexToGraph);
  document.getElementById("addEdgeButton").addEventListener("click", addEdgeToGraph);

  document.getElementById("colorEdgeInducedButton").addEventListener("click", colorGraphEdgeInduced);
  document.getElementById("colorVerticesButton").addEventListener("click", colorGraphVertices);
}
