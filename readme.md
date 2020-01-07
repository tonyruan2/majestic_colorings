# Majestic Colorings of Graphs

This web application was inspired by the Spring 2020 Illinois Geometry Lab (IGL) Research Project titled "Majestic Colorings of Graphs".

Read more about the research project here: [link](https://math.illinois.edu/research/igl/projects/spring/2020/majestic-colorings-graphs)

Read more about the organization here: [link](https://math.illinois.edu/research/igl)

## Features

1) Dynamic graph generation, modification, and coloring

2) Nine base graph options (random, sparse, dense, edgeless, cycle, wheel, min span, connected, and complete)
   * When the application is loaded, a default graph is randomly generated and has between 3 and 10 vertices

3) Two displays for clarity: cycle-like and wheel-like

4) Four coloring options

   * Uncolored: white vertices and black edges
   * Greedy: Welsh-Powell coloring algorithm for fast and efficient coloring
   * Min Colors: Exponential coloring algorithm for guaranteed minimum colors (exponential runtime provisions are implemented; if over 100,000 recursive calls are made while attempting to run the minimum coloring algorithm, greedy coloring will be employed instead)
   * Edge-Induced: Color edges first and generate appropriate colors for the vertices (work in progress)

5) Properties of the displayed graph are shown in both text and table format

   * Sort the table of graph information by clicking on the desired header (credit: Nick Grealy)

6) Value checking

   * The number of vertices inputted will be fixed to be between 1 and 100

   * The vertex inputs for custom edge toggles are fixed to between 0 and the greatest vertex in the graph

   * If a cycle is generated, the vertex count will be changed to 3 if it is less than 3

   * If a wheel is generated, the vertex count will be changed to 4 if it is less than 4

   * If a min span, connected, or complete graph is generated, the vertex count will be changed to 2 if the count is 1

## Usage

1) Choose the number of vertices (between 1 and 100) to generate a base graph with

2) Select a base graph and click the appropriate button

3) In any continuous and repeating order, freely:
   * Change the display of the graph
   * Alternate the coloring scheme
   * Modify the graph by adding vertices and/or edges
   * View information about the graph by scrolling down

## Author

Tony Ruan

## Tools

HTML, CSS, JavaScript

Bootstrap, FontAwesome
