var btn_capture = document.getElementById("btn-capture");
var input_capture = document.getElementById("capture");
var btn_upload = document.getElementById("btn-upload");
var input_upload = document.getElementById("file");
var fa_image = document.getElementById("fa-image");
var imgBox = document.getElementById("imgBox");
var btn_scan = document.getElementById("btn-scan");
var btn_scan_capture = document.getElementById("btn-scan-capture");
var btn_scan_again = document.getElementById("btn-scan-again");
var progressBar = document.getElementById("upload-progress");

// Initialize default values
let url = "http://treesbe.firstasia.edu.ph:5000";
let model;

function setDefaultModel() {
  const defaultOption = mDropdown.options[0];
  model = defaultOption.value;
  console.log(model);
}



function serverDropdown() {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const selectedValue = selectedOption.value;
  url = selectedValue;
  console.log(url);
}

function modelDropdown() {
  const selectedOption = mDropdown.options[mDropdown.selectedIndex];
  const selectedValue = selectedOption.value;
  model = selectedValue;
  console.log(model);
}

// Set the default URL and model when the page loads
window.addEventListener("DOMContentLoaded", setDefaultModel);

// Initialize buttons for model scan
var btn_model_scan_capture = document.getElementById("btn-model-scan-capture");
function modelScanAgainCapture() {
  refresh();
  scan_capture();
}

var btn_model_scan = document.getElementById("btn-model-scan");
function modelScanAgain() {
  refresh();
  scan();
}
