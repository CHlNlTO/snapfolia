fetch("./static/trees/tree_div.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("tree-div").innerHTML = data;
  });
