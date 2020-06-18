// create the map
let map = L.map("map", {
  center: [150, 755],
  crs: L.CRS.Simple,
  zoom: 1,
  minZoom: -5,
  maxZoom: 3,

  zoomControl: false,
});

function isOff(text) {
  if (
    text !== "OFF" &&
    text != "OFF." &&
    text !== "off." &&
    text !== "off" &&
    text !== "Off." &&
    text !== "Off"
  ) {
    return false;
  }
  return true;
}
const posteIcon = L.icon({
  iconUrl: "assets/poste.gif",
  iconSize: [32, 32],
});

// create the image
const imageUrl = "assets/gtasa.jpg",
  imageBounds = [
    [-3000, -3000],
    [3000, 3000],
  ];

var markers = {}; // Dictionary to hold your markers in an outer scope.
var blipsAdded = {};

function getData() {
  fetch("https://centralizer.herokuapp.com/retrieve")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      AddOrUpdateMarkers(data);
      UpdateChat(data);
      UpdateDashboard(data);
    });
}

setInterval(function () {
  getData();
}, 1000);

function UpdateDashboard(data) {
  let plys = data.persons;

  const dashboardcontent = document.getElementById("dashboard-content");
  dashboardcontent.innerHTML = "";

  for (let ply of plys) {
    const firstSpaceindex = ply.occupation.indexOf(" ");
    let unit = ply.occupation.substring(0, firstSpaceindex);
    let persons = "";
    if (unit === "") {
      unit = ply.occupation;
    } else {
      persons = ply.occupation.substring(firstSpaceindex);
    }
    let childDomTR = document.createElement("tr");
 
    if (!isOff(ply.occupation)) {
      childDomTR.onclick = function click() {
        map.flyTo([ply.position.y, ply.position.x], 1);
      };
      childDomTR.className = "dashboard-zoomable";
    }

    childDomTR.innerHTML = `
                    <td>${ply.name}</td><td>${unit}${persons}</td>
            `;
    dashboardcontent.append(childDomTR);
  }
}

function UpdateChat(data) {
  let msgs = data.messages;

  const history = document.getElementById("history");
  history.innerHTML = "";

  for (let msg of msgs) {
    let childDom = document.createElement("div");
    childDom.className = "entry msgtype-" + msg.type;

    childDom.innerHTML = `
                <span class="msg">
                    ${msg.fulltext}
                </span>
            `;
    history.append(childDom);
  }

  const chat = document.getElementById("chat");
}

function AddOrUpdateMarkers(data) {
  var blips = data.blips;
  let persons = "";
  blips.forEach((blip) => {
    var id = blip.owner;
    var latLng = [blip.position.y, blip.position.x];
    const firstSpaceindex = blip.text.indexOf(" ");
    let unit = blip.text.substring(0, firstSpaceindex);
    if (unit === "") {
      unit = blip.text;
    } else {
      persons = blip.text.substring(firstSpaceindex);
    }

    let blipPopup = L.popup({
      closeOnClick: true,
      autoClose: false,
    }).setContent(persons);

    let iconToUse = "";

    iconToUse = checkIcons(blip, iconToUse);
    if (!isOff(blip.text)) {
      if (!markers[id]) {
        // If there is no marker with this id yet, instantiate a new one.
        if (persons !== "") {
          markers[id] = L.marker(latLng, { icon: iconToUse })
            .addTo(map)
            .bindPopup(blipPopup)
            .bindTooltip(unit, {
              direction: "bottom",
              offset: [0, 15],
              permanent: true,
              className: "class-tooltip",
            })
            .openTooltip();
        } else {
          markers[id] = L.marker(latLng, { icon: iconToUse })
            .addTo(map)
            .bindTooltip(unit, {
              direction: "bottom",
              offset: [0, 15],
              permanent: true,
            })
            .openTooltip();
        }
      } else {
        // If there is already a marker with this id, simply modify its position.
        if (persons !== "") {
          markers[id]
            .setLatLng(latLng)
            .setIcon(iconToUse)
            .bindPopup(blipPopup)
            .setTooltipContent(unit, {
              direction: "bottom",
              offset: [0, 15],
              permanent: true,
            })
            .openTooltip();
        } else {
          markers[id]
            .setLatLng(latLng)
            .setIcon(iconToUse)
            .unbindPopup(blipPopup)
            .setTooltipContent(unit, {
              direction: "bottom",
              offset: [0, 15],
              permanent: true,
            })
            .openTooltip();
        }
      }
      blipsAdded[id] = id;
    }
  });
  for (let [key, value] of Object.entries(markers)) {
    if (!blipsAdded[key]) {
      map.removeLayer(value);
      delete markers[key];
    }
  }
  blipsAdded = {};
}

// 2526.0974,-2696.7273 port
// -2371.7661,2210.2646 bayside
let newpopup = L.popup({
  closeOnClick: true,
  autoClose: false,
}).setContent("<strong>Poste de police</strong>");
L.marker([-1680, 1560], { icon: posteIcon }).bindPopup(newpopup).addTo(map);
L.imageOverlay(imageUrl, imageBounds).addTo(map);
