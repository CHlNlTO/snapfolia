import * as maptilersdk from "@maptiler/sdk";

maptilersdk.config.apiKey = "IFhXYPDjLBHIKtmv9dba";
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element to render the map
  style: "satellite",
  center: [121.14981, 14.07767], // starting position [lng, lat]
  zoom: 14, // starting zoom
});
