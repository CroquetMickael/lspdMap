// create the map
let map = L.map("map", {
    center: [150, 755],
    crs: L.CRS.Simple,
    zoom: 1,
    minZoom: -2,
    maxZoom: 3,
});

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
        });
}

setInterval(function () {
    getData();
}, 1000);

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

        const airIcon = L.divIcon({
            className: blip.color,
            html: L.Util.template(
                `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000"
     preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
    <path d="M2915 3631 c-81 -20 -125 -64 -147 -145 l-13 -48 -75 6 c-41 4 -446
    27 -899 52 -781 43 -826 45 -867 29 -80 -30 -134 -123 -119 -204 19 -105 92
    -161 207 -161 36 0 425 20 865 45 439 25 819 45 846 45 l47 0 0 -198 0 -199
    -52 -28 c-81 -43 -160 -108 -235 -190 l-68 -75 -976 0 -976 0 -24 -26 c-32
    -34 -34 -104 -2 -135 17 -17 190 -63 890 -233 l868 -211 -3 -185 c-4 -217 8
    -298 62 -415 88 -191 272 -294 611 -342 178 -26 1182 -26 1360 0 258 36 407
    96 515 206 109 111 149 218 157 424 6 148 -14 258 -71 389 -214 492 -920 904
    -1556 909 l-110 1 0 154 0 154 48 0 c26 0 405 -20 842 -45 881 -50 917 -51
    963 -31 39 16 82 61 96 99 18 46 13 124 -9 167 -23 46 -82 89 -131 96 -19 3
    -432 -18 -918 -45 -486 -28 -888 -48 -892 -45 -5 3 -9 17 -9 32 0 32 -35 93
    -70 120 -24 19 -93 43 -115 41 -5 -1 -23 -4 -40 -8z m795 -1107 c352 -66 711
    -337 784 -590 15 -49 19 -89 17 -151 -1 -47 -59 -107 -127 -133 -87 -32 -224
    -50 -429 -57 -263 -8 -388 17 -479 97 -88 77 -111 162 -103 374 6 177 27 287
    68 373 50 104 99 120 269 87z"/>
    <path d="M371 2904 c-223 -60 -365 -277 -332 -509 43 -299 365 -475 644 -351
    53 24 125 78 158 120 l19 24 -117 32 c-64 17 -128 29 -142 27 -14 -3 -46 -10
    -71 -17 -83 -21 -182 21 -234 101 -82 123 -36 283 99 345 79 37 162 29 232
    -22 29 -22 41 -24 162 -24 72 0 131 2 131 4 0 3 -16 32 -35 65 -101 172 -317
    258 -514 205z"/>
    <path d="M4861 969 c-18 -6 -55 -33 -81 -60 -57 -60 -108 -79 -282 -105 -101
    -16 -244 -18 -1354 -23 l-1240 -6 -41 -27 c-102 -67 -112 -224 -18 -300 63
    -51 6 -49 1351 -45 1330 4 1327 4 1525 50 194 46 327 133 375 244 23 55 15
    150 -16 197 -43 65 -142 98 -219 75z"/>
    </g>
    </svg>`
            ),
            iconAnchor: [20, 20],
            iconSize: [32, 32],
            className: blip.color,
        });
        const policeCarIcon = L.divIcon({
            className: blip.color,
            html: L.Util.template(
                `<svg id="Layer_2" style="enable-background:new 0 0 1000 1000;" version="1.1" viewBox="0 0 1000 1000" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M837.608,563.269c0.205-1.247,0.313-2.515,0.313-3.792v-35.49c0-6.745-2.807-13.198-7.759-17.789  c-3.82-3.548-6.404-8.236-7.35-13.373l-3.411-18.413c0-9.318-7.242-17.019-16.541-17.604l-33.014-2.066  c-29.057-1.813-57.479-9.328-83.651-22.117c-30.361-14.835-63.707-22.545-97.501-22.545h-14.923v-2.031  c0-4.082-3.31-7.391-7.391-7.391h-6.567c0-0.001,0-0.002,0-0.003c-0.019-0.322-0.058-0.634-0.107-0.956l-2.593-17.262  c-1.131-7.573-7.769-13.295-15.44-13.295h-18.657c-7.671,0-14.309,5.722-15.439,13.295l-2.593,17.262  c-0.049,0.322-0.088,0.634-0.107,0.956c0,0.001,0,0.002,0,0.003h-6.567c-4.081,0-7.391,3.309-7.391,7.391v2.031h-36.894  c-11.608,0-23.022,2.924-33.199,8.509l-52.869,29.008c-7.632,4.191-15.984,6.901-24.631,7.983l-119.832,14.972  c-18.021,2.261-32.059,16.727-33.764,34.798l-1.628,17.301c-0.214,2.271-0.225,4.571-0.039,6.852l0.058,0.739H176.34  c-0.356-5.638-0.07-11.295,0.886-16.893l2.804-16.424c0.771-4.511-2.263-8.791-6.772-9.561c-4.523-0.777-8.791,2.264-9.562,6.773  l-2.804,16.424c-1.657,9.706-1.707,19.556-0.148,29.28l3.733,23.271h-0.205c-6.735,0-12.185,5.458-12.185,12.184  c0,6.726,5.449,12.184,12.185,12.184h67.674c5.586,24.826,27.761,43.375,54.283,43.375c26.522,0,48.696-18.549,54.282-43.375  h334.933c5.586,24.826,27.761,43.375,54.282,43.375c26.522,0,48.697-18.549,54.283-43.375h51.718  c6.727,0,12.185-5.458,12.185-12.184C847.912,569.215,843.447,564.185,837.608,563.269z M181.261,563.113l-2.615-16.299h10.862  v0.001l1.364,16.298H181.261z M243.761,515.391l-3.118,9.348c-0.713,2.154-2.73,3.606-5.002,3.606h-26.883  c-3.079,0-5.506-2.612-5.263-5.683l1.131-14.786c0.214-2.749,2.505-4.874,5.263-4.874h12.565c7.017,0,13.851,2.281,19.465,6.492  C243.741,510.858,244.482,513.237,243.761,515.391z M314.983,587.481c-4.766,11.17-15.858,19.007-28.754,19.007  c-12.896,0-23.988-7.837-28.755-19.007c-1.618-3.762-2.515-7.915-2.515-12.262c0-17.243,14.026-31.279,31.269-31.279  s31.268,14.036,31.268,31.279C317.498,579.566,316.602,583.719,314.983,587.481z M521.595,400.657l2.241-14.943h17.02l2.242,14.943  l0.001,0.003h-21.505L521.595,400.657z M371.819,472.805c2.671-1.15,5.293-2.427,7.866-3.84l52.869-29.008  c6.559-3.606,13.986-5.507,21.473-5.507h69.722c3.323,0,5.77,3.109,4.982,6.335l-8.062,32.965  c-1.716,7.018-7.115,12.555-14.104,14.446l-9.513,2.573c-2.136,0.576-4.317,0.868-6.521,0.868h-99.217  c-6.354,0-12.467-2.427-17.097-6.774l-3.859-3.626C367.677,478.712,368.438,474.268,371.819,472.805z M658.69,518.267  c-8.324,13.529-10.975,31.785-11.795,40.217c-0.253,2.632-2.455,4.63-5.097,4.63h-271.09c-1.55,0-3.051-0.692-3.996-1.92  c-7.778-10.079-10.995-34.125-12.096-45.09c-0.303-3.012,2.066-5.624,5.097-5.624h294.609  C658.329,510.478,660.784,514.864,658.69,518.267z M678.69,462.775l-13.607,18.617c-4.708,6.433-12.193,10.244-20.166,10.244  h-82.081c-12.721,0-22.156-11.794-19.368-24.202l6.501-28.979c0.526-2.339,2.602-4.006,5.001-4.006h31.6  c31.104,0,61.808,6.999,89.831,20.508c0.126,0.059,0.243,0.117,0.37,0.186C679.655,456.527,680.572,460.192,678.69,462.775z   M758.481,587.481c-4.767,11.17-15.858,19.007-28.755,19.007c-12.896,0-23.988-7.837-28.754-19.007  c-1.618-3.762-2.515-7.915-2.515-12.262c0-17.243,14.025-31.279,31.269-31.279c17.244,0,31.269,14.036,31.269,31.279  C760.996,579.566,760.1,583.719,758.481,587.481z M806.954,512.428h-18.383c-2.623,0-4.747-2.125-4.747-4.747v-26.054  c0-1.989,1.237-3.772,3.109-4.455l10.722-3.928c0.526-0.195,1.072-0.292,1.628-0.292c2.173,0,4.065,1.471,4.601,3.567l7.671,29.992  C812.315,509.503,810.054,512.428,806.954,512.428z"/><path d="M286.229,561.485c-7.584,0-13.725,6.15-13.725,13.734c0,5.361,3.081,10.01,7.563,12.262  c1.853,0.936,3.949,1.462,6.161,1.462c2.212,0,4.308-0.526,6.16-1.462c4.483-2.252,7.564-6.901,7.564-12.262  C299.953,567.636,293.813,561.485,286.229,561.485z"/><path d="M729.727,561.485c-7.583,0-13.724,6.15-13.724,13.734c0,5.361,3.08,10.01,7.563,12.262  c1.852,0.936,3.948,1.462,6.16,1.462c2.213,0,4.309-0.526,6.161-1.462c4.483-2.252,7.563-6.901,7.563-12.262  C743.451,567.636,737.31,561.485,729.727,561.485z"/><path d="M421.607,525.43l-6.783-3.918c-3.499-2.018-7.808-2.018-11.316,0l-6.774,3.918  c-2.009,1.16-3.246,3.294-3.246,5.615v4.259c0,6.248,3.334,12.028,8.753,15.157l6.931,3.996l6.931-3.996  c5.409-3.129,8.752-8.909,8.752-15.157v-4.259C424.853,528.725,423.616,526.59,421.607,525.43z M416.481,534.709l-2.545,2.486  c-0.233,0.224-0.351,0.565-0.292,0.887l0.604,3.5c0.137,0.828-0.731,1.452-1.462,1.063l-3.148-1.647  c-0.293-0.156-0.644-0.156-0.936,0l-3.148,1.647c-0.741,0.39-1.609-0.234-1.462-1.063l0.595-3.5  c0.058-0.321-0.049-0.663-0.283-0.887l-2.544-2.486c-0.605-0.585-0.273-1.599,0.556-1.715l3.519-0.517  c0.321-0.049,0.614-0.253,0.761-0.546l1.569-3.187c0.37-0.751,1.442-0.751,1.813,0l1.569,3.187c0.146,0.293,0.43,0.497,0.761,0.546  l3.509,0.517C416.745,533.111,417.076,534.125,416.481,534.709z"/><path d="M619.223,525.43l-6.775-3.918c-3.509-2.018-7.816-2.018-11.315,0l-6.784,3.918  c-2.009,1.16-3.246,3.294-3.246,5.615v4.259c0,6.248,3.343,12.028,8.753,15.157l6.93,3.996l6.931-3.996  c5.419-3.129,8.753-8.909,8.753-15.157v-4.259C622.469,528.725,621.231,526.59,619.223,525.43z M614.096,534.709l-2.544,2.486  c-0.234,0.224-0.341,0.565-0.283,0.887l0.596,3.5c0.146,0.828-0.722,1.452-1.463,1.063l-3.148-1.647  c-0.292-0.156-0.643-0.156-0.936,0l-3.147,1.647c-0.731,0.39-1.6-0.234-1.463-1.063l0.605-3.5c0.059-0.321-0.059-0.663-0.292-0.887  l-2.544-2.486c-0.596-0.585-0.264-1.599,0.565-1.715l3.508-0.517c0.332-0.049,0.614-0.253,0.761-0.546l1.57-3.187  c0.37-0.751,1.441-0.751,1.812,0l1.57,3.187c0.146,0.293,0.438,0.497,0.761,0.546l3.517,0.517  C614.369,533.111,614.7,534.125,614.096,534.709z"/><path d="M466.309,527.633c-0.662-0.663-1.442-1.19-2.329-1.569c-0.887-0.38-1.822-0.576-2.807-0.576h-5.294  c-1.744,0-2.621,0.868-2.621,2.593v18.666c0,1.481,0.73,2.223,2.202,2.223c1.442,0,2.154-0.741,2.154-2.223v-6.687h3.528  c0.984,0,1.93-0.195,2.817-0.575c0.896-0.38,1.676-0.906,2.339-1.569c0.673-0.672,1.19-1.442,1.58-2.31  c0.379-0.877,0.574-1.822,0.574-2.836c0-0.984-0.195-1.92-0.574-2.807C467.498,529.076,466.972,528.296,466.309,527.633z   M463.258,534.827c-0.565,0.556-1.248,0.829-2.066,0.829h-3.577v-5.8h3.577c0.818,0,1.501,0.283,2.066,0.848  c0.557,0.565,0.828,1.248,0.828,2.037C464.086,533.579,463.815,534.271,463.258,534.827z"/><path d="M490.658,528.598c-1.122-1.111-2.447-1.988-3.958-2.642c-1.511-0.653-3.158-0.984-4.932-0.984  c-1.726,0-3.334,0.331-4.815,0.994c-1.472,0.672-2.759,1.569-3.86,2.7c-1.102,1.141-1.949,2.446-2.573,3.938  c-0.613,1.491-0.926,3.07-0.926,4.718c0,1.695,0.331,3.294,0.984,4.766c0.653,1.482,1.54,2.768,2.642,3.87  c1.111,1.092,2.417,1.959,3.919,2.583c1.511,0.634,3.108,0.945,4.805,0.945c1.706,0,3.304-0.312,4.796-0.945  c1.491-0.624,2.788-1.491,3.898-2.603c1.111-1.111,1.988-2.407,2.622-3.899c0.643-1.491,0.965-3.09,0.965-4.796  c0-1.676-0.312-3.255-0.945-4.747C492.656,531.006,491.778,529.709,490.658,528.598z M489.137,540.315  c-0.399,0.965-0.965,1.803-1.676,2.515c-0.722,0.722-1.55,1.277-2.496,1.687c-0.955,0.409-1.979,0.604-3.09,0.604  s-2.134-0.195-3.07-0.604c-0.936-0.41-1.755-0.965-2.456-1.687c-0.702-0.711-1.248-1.54-1.647-2.476  c-0.39-0.936-0.595-1.95-0.595-3.031c0-1.063,0.205-2.076,0.595-3.051c0.399-0.975,0.935-1.823,1.628-2.554  c0.692-0.721,1.511-1.306,2.456-1.735c0.956-0.429,1.979-0.642,3.09-0.642c1.063,0,2.066,0.204,3.031,0.623  c0.966,0.419,1.803,0.984,2.516,1.706c0.711,0.711,1.276,1.55,1.695,2.505c0.419,0.965,0.634,1.988,0.634,3.07  C489.751,538.336,489.546,539.359,489.137,540.315z"/><path d="M507.055,544.569h-6.324v-16.857c0-1.481-0.733-2.223-2.199-2.223c-1.442,0-2.162,0.727-2.162,2.182  v19.116c0,0.617,0.202,1.135,0.604,1.553c0.403,0.419,0.923,0.629,1.559,0.629h8.523c0.615,0,1.139-0.208,1.57-0.624  c0.431-0.415,0.647-0.929,0.647-1.54c0-0.636-0.217-1.167-0.647-1.594C508.193,544.783,507.67,544.569,507.055,544.569z"/><path d="M519.92,529.889c1.479,0,2.221-0.738,2.221-2.218c0-1.455-0.741-2.182-2.221-2.182h-8.061  c-1.528,0-2.292,0.715-2.292,2.145c0,1.504,0.764,2.255,2.292,2.255h1.887v14.68h-1.887c-1.528,0-2.292,0.733-2.292,2.2  s0.764,2.2,2.292,2.2h8.061c1.479,0,2.221-0.721,2.221-2.164c0-1.491-0.741-2.236-2.221-2.236h-1.81v-14.68H519.92z"/><path d="M543.251,541.685c-0.642,0-1.195,0.271-1.664,0.813c-0.714,0.838-1.584,1.479-2.606,1.923  c-1.023,0.443-2.126,0.665-3.309,0.665c-1.085,0-2.102-0.197-3.05-0.591c-0.95-0.395-1.782-0.943-2.496-1.646  c-0.716-0.703-1.282-1.528-1.701-2.477c-0.419-0.949-0.629-1.965-0.629-3.05c0-1.036,0.204-2.033,0.609-2.995  c0.407-0.961,0.962-1.806,1.664-2.533c0.702-0.727,1.534-1.306,2.496-1.738c0.961-0.431,1.997-0.646,3.106-0.646  c0.962,0,1.891,0.142,2.791,0.424c0.9,0.284,1.708,0.771,2.422,1.461c0.197,0.197,0.432,0.363,0.702,0.498  c0.272,0.136,0.592,0.204,0.962,0.204c0.566,0,1.079-0.221,1.534-0.662c0.457-0.442,0.686-0.944,0.686-1.508  c0-0.613-0.26-1.165-0.777-1.655c-1.184-1.104-2.46-1.9-3.826-2.39c-1.369-0.49-2.867-0.749-4.493-0.773  c-1.751,0-3.371,0.333-4.862,0.997c-1.492,0.664-2.793,1.562-3.9,2.694c-1.11,1.133-1.978,2.443-2.607,3.932  c-0.63,1.489-0.944,3.058-0.944,4.708c0,1.673,0.32,3.242,0.962,4.707c0.642,1.464,1.517,2.751,2.625,3.858  c1.109,1.108,2.416,1.98,3.92,2.621c1.504,0.64,3.118,0.959,4.843,0.959c1.776,0,3.463-0.357,5.066-1.073  c1.603-0.714,2.994-1.737,4.179-3.069c0.344-0.394,0.518-0.875,0.518-1.442c0-0.616-0.21-1.139-0.63-1.572  C544.422,541.901,543.893,541.685,543.251,541.685z"/><path d="M560.481,529.889c0.617,0,1.141-0.215,1.571-0.646c0.432-0.431,0.647-0.956,0.647-1.572 c0-0.66-0.215-1.134-0.647-1.553c-0.431-0.419-0.954-0.629-1.571-0.629H550c-0.637,0-1.156,0.21-1.56,0.629  c-0.401,0.419-0.604,0.938-0.604,1.553v19.116c0,0.617,0.202,1.135,0.604,1.553c0.403,0.419,0.923,0.629,1.56,0.629h10.445  c0.59,0,1.097-0.208,1.516-0.624c0.419-0.415,0.628-0.929,0.628-1.54c0-0.636-0.209-1.167-0.628-1.594  c-0.419-0.428-0.926-0.642-1.516-0.642h-8.247v-6.212h7.729c0.615,0,1.139-0.232,1.57-0.697c0.433-0.465,0.648-0.978,0.648-1.54  c0-0.611-0.215-1.124-0.648-1.54c-0.432-0.415-0.955-0.624-1.57-0.624h-7.729v-4.067H560.481z"/></svg>`
            ),
            iconAnchor: [30, 32],
            iconSize: [64, 64],
            popupAnchor: [0, -28],
        });
        const ctdIcon = L.divIcon({
            className: blip.color,
            html: L.Util.template(
                `<svg id="Layer_2" style="enable-background:new 0 0 1000 1000;" version="1.1" viewBox="0 0 1000 1000" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M164.651,575.269c0.07,0.03,0.139,0.05,0.209,0.05h37.181c7.26,24.678,30.071,42.683,57.092,42.683  c27.022,0,49.833-18.004,57.082-42.683h349.077c7.25,24.678,30.061,42.683,57.082,42.683c27.022,0,49.833-18.004,57.092-42.683  h39.564c10.139,0,18.541-7.875,19.206-18.005l2.433-37.211c0.159-2.463-0.159-4.925-0.923-7.269l-9.613-29.227l4.995-27.201  c1.092-5.948-2.582-11.728-8.421-13.277l-14.141-3.745l-0.005-0.001l6.573-24.493l5.506-0.755  c14.735-2.022,25.042-15.605,23.021-30.341c-0.156-1.138-1.205-1.933-2.342-1.777l-36.194,4.966  c-14.735,2.022-25.042,15.605-23.021,30.341c0.156,1.138,1.205,1.934,2.342,1.777l14.32-1.964l-4.937,18.396  c-114.065-29.117-232.012-40.14-349.523-32.652c-6.654,0.427-13.228,1.52-19.633,3.247c-6.406,1.738-12.642,4.121-18.591,7.121  l-90.191,45.364c-8.083,4.061-16.684,7.001-25.562,8.739l-83.101,16.197c-13.158,2.572-24.867,10.03-32.742,20.875l-13.734,18.908  c-7.637,2.999-12.662,10.368-12.662,18.571v14.479C152.088,564.634,157.044,572.081,164.651,575.269z M789.158,502.835l3.843-9.901  c0.467-1.192,1.43-2.116,2.642-2.533l16.783-5.76c2.393-0.824,4.995,0.576,5.621,3.039l3.814,14.996  c0.685,2.701-1.311,5.332-4.092,5.412l-24.45,0.665C790.22,508.843,788.026,505.734,789.158,502.835z M757.052,558.506  c0,6.098-1.589,11.828-4.37,16.813c-5.919,10.646-17.279,17.856-30.308,17.856c-13.019,0-24.38-7.21-30.309-17.856  c-2.781-4.985-4.36-10.715-4.36-16.813c0-19.126,15.552-34.678,34.668-34.678C741.5,523.828,757.052,539.38,757.052,558.506z   M644.158,425.742l37.449,5.343c9.236,1.311,17.607,6.107,23.407,13.397c1.669,2.095,0.069,5.174-2.602,4.995l-32.613-2.065  c-10.795-0.685-20.735-6.117-27.131-14.846l-1.43-1.946C639.62,428.413,641.457,425.354,644.158,425.742z M626.542,499.378  l-11.51,30.577c-3.803,10.13-11.907,18.044-22.126,21.62l-2.284,0.794c-2.582,0.904-4.965-1.748-3.813-4.22l16.058-34.261  c3.953-8.432,10.983-15.045,19.653-18.462C625.012,494.443,627.485,496.876,626.542,499.378z M330.932,480.848l0.109-0.06  l90.191-45.364c8.977-4.518,18.62-7.13,28.65-7.766c23.159-1.48,46.675-2.225,69.883-2.225c18.719,0,37.419,0.487,56.099,1.44  c7.289,0.378,14.251,3.158,19.782,7.935c15.551,13.446,31.302,29.614,29.762,38.869c-2.88,17.25-266.622,19.703-285.003,19.852  c-0.665,0.01-1.321-0.119-1.946-0.367l-7.11-2.831C327.168,488.673,326.92,482.864,330.932,480.848z M259.132,523.828  c19.117,0,34.669,15.552,34.669,34.678c0,6.098-1.589,11.828-4.37,16.813c-5.919,10.646-17.28,17.856-30.299,17.856  c-13.029,0-24.39-7.21-30.318-17.856c-2.781-4.985-4.36-10.715-4.36-16.813C224.454,539.38,240.005,523.828,259.132,523.828z   M184.959,521.425l14.271-17.796c0.258-0.318,0.616-0.526,1.022-0.596l31.501-5.373c1.718-0.297,2.671,1.907,1.291,2.959  l-22.642,17.21c-0.179,0.139-0.378,0.238-0.586,0.288l-23.149,5.958C185.128,524.474,183.956,522.667,184.959,521.425z"/><path d="M259.132,571.575c7.22,0,13.069-5.849,13.069-13.069c0-7.22-5.849-13.079-13.069-13.079  c-7.22,0-13.079,5.859-13.079,13.079C246.053,565.726,251.912,571.575,259.132,571.575z/><path d="M722.373,571.575c7.229,0,13.079-5.849,13.079-13.069c0-7.22-5.849-13.079-13.079-13.079  c-7.22,0-13.069,5.859-13.069,13.079C709.304,565.726,715.154,571.575,722.373,571.575z"/></svg>`
            ),
            iconAnchor: [30, 32],
            iconSize: [64, 64],
            popupAnchor: [0, -28],
        });

        const pedIcon = L.divIcon({
            className: blip.color,
            html: L.Util.template(
                `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000"
     preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
    <path d="M2418 5096 c-98 -35 -170 -78 -508 -301 -168 -112 -350 -228 -404
    -260 -313 -179 -585 -287 -899 -355 -133 -29 -189 -48 -202 -70 -3 -6 -7 -28
    -7 -50 -1 -92 120 -278 288 -440 104 -101 277 -240 298 -240 7 0 21 10 32 21
    28 31 119 91 199 131 207 103 497 176 852 215 221 24 765 24 986 0 487 -53
    872 -179 1044 -340 41 -38 43 -37 183 76 189 152 346 333 412 473 29 61 39
    129 23 154 -13 21 -68 41 -182 65 -387 83 -662 212 -1078 505 -438 308 -540
    368 -701 415 -117 34 -241 34 -336 1z m302 -557 c41 -20 95 -54 119 -75 43
    -37 43 -39 38 -88 -15 -145 -115 -330 -215 -401 -37 -25 -53 -30 -102 -30 -49
    0 -65 5 -102 30 -100 71 -200 256 -215 401 -5 50 -5 51 38 88 90 77 189 116
    289 113 63 -2 87 -8 150 -38z"/>
    <path d="M2305 3544 c-564 -44 -984 -159 -1272 -347 l-63 -41 0 -238 c0 -220
    -1 -238 -17 -238 -10 0 -43 -12 -73 -26 -146 -68 -245 -192 -280 -351 -17 -72
    -13 -223 6 -290 50 -176 184 -330 340 -391 l47 -19 49 -119 c72 -175 257 -543
    335 -666 208 -328 423 -551 663 -686 270 -151 619 -175 905 -62 293 116 551
    358 798 748 80 126 267 498 335 666 45 114 49 119 87 134 66 25 171 100 219
    154 156 179 193 453 89 668 -50 103 -169 203 -285 240 l-38 12 0 232 0 232
    -62 41 c-249 162 -619 277 -1063 328 -133 15 -606 28 -720 19z m-665 -860
    c257 -85 545 -124 920 -124 459 0 784 57 1088 188 l92 41 0 -245 0 -245 153 3
    c127 2 157 -1 184 -15 50 -27 68 -113 38 -185 -32 -76 -87 -112 -203 -132 -40
    -7 -76 -18 -81 -24 -5 -6 -36 -81 -71 -166 -214 -536 -418 -886 -652 -1118
    -138 -137 -272 -216 -420 -246 -97 -20 -159 -20 -256 0 -148 30 -282 109 -420
    246 -234 232 -435 577 -653 1118 -34 85 -66 160 -71 166 -4 6 -26 14 -48 18
    -105 17 -143 29 -177 59 -93 82 -96 225 -6 264 27 12 78 18 181 21 l142 4 0
    238 0 239 93 -41 c50 -22 126 -51 167 -64z"/>
    <path d="M2467 2398 c-48 -4 -119 -18 -158 -31 -61 -21 -77 -23 -113 -13 -25
    6 -152 11 -326 11 -244 0 -293 -3 -342 -18 -110 -34 -153 -101 -152 -237 2
    -134 52 -251 148 -345 130 -126 300 -172 474 -126 209 55 351 230 369 454 l6
    77 41 12 c23 6 88 11 146 11 58 0 123 -5 146 -11 l41 -12 6 -77 c18 -224 160
    -399 369 -454 174 -46 344 0 474 126 98 96 147 213 147 350 0 163 -55 223
    -228 246 -101 13 -538 7 -598 -9 -30 -8 -47 -6 -86 9 -92 35 -229 49 -364 37z"/>
    </g>
    </svg>`
            ),
            iconAnchor: [17, 20],
            iconSize: [32, 32],
            className: blip.color,
        });
        const unknownIcon = L.divIcon({
            className: blip.color,
            html: L.Util.template(
                ` <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    	 viewBox="0 0 90 90" style="enable-background:new 0 0 90 90;" xml:space="preserve">
    <g>
    	<g>
    		<path d="M65.449,6.169C59.748,2.057,52.588,0,43.971,0c-6.559,0-12.09,1.449-16.588,4.34
    			C20.25,8.871,16.457,16.562,16,27.412h16.531c0-3.158,0.922-6.203,2.766-9.137c1.846-2.932,4.975-4.396,9.389-4.396
    			c4.488,0,7.58,1.19,9.271,3.568c1.693,2.381,2.539,5.018,2.539,7.91c0,2.513-1.262,4.816-2.781,6.91
    			c-0.836,1.22-1.938,2.342-3.307,3.369c0,0-8.965,5.75-12.9,10.368c-2.283,2.681-2.488,6.692-2.689,12.449
    			c-0.014,0.409,0.143,1.255,1.576,1.255c1.433,0,11.582,0,12.857,0s1.541-0.951,1.559-1.362c0.09-2.098,0.326-3.167,0.707-4.377
    			c0.723-2.286,2.688-4.283,4.893-5.997l4.551-3.141c4.107-3.199,7.385-5.826,8.83-7.883C72.264,33.562,74,29.393,74,24.443
    			C74,16.373,71.148,10.281,65.449,6.169z M43.705,69.617c-5.697-0.17-10.398,3.771-10.578,9.951
    			c-0.178,6.178,4.293,10.258,9.99,10.426c5.949,0.177,10.523-3.637,10.701-9.814C53.996,74,49.654,69.793,43.705,69.617z"/>
    	</g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    </svg>`
            ),
            iconAnchor: [17, 25],
            iconSize: [32, 32],
            popupAnchor: [0, -28],
        });

        if (blip.type == "air") {
            iconToUse = airIcon;
        } else if (blip.type == "policecar") {
            iconToUse = policeCarIcon;
        } else if (blip.type == "ctd") {
            iconToUse = ctdIcon;
        } else if (blip.type == "ped") {
            iconToUse = pedIcon;
        } else {
            iconToUse = unknownIcon;
        }
        if (
            blip.text !== "OFF" &&
            blip.text != "OFF." &&
            blip.text !== "off." &&
            blip.text !== "off" &&
            blip.text !== "Off." &&
            blip.text !== "Off"
        ) {
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