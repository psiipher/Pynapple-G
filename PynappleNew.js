var myFileName = "";
let currentLayer;
let legendControl;
var is_count_on = false; 

var map = L.map('map', {
	minZoom: 2,
	center: [0,0],
	zoom: 3,
	zoomControl: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	noWrap: true,
	myLayerId: 1
}).addTo(map);


function displayPolygons() {
	map.setView([0, 0], 3);

	document.getElementById('loaderWrapper').style.display = 'block';

	shp('http://localhost:8000/ne_10m_admin_0_countries.zip').then(function(geojson) {
		
		
		document.getElementById('loaderWrapper').style.display = 'none';

		legendControl = L.control({ position: 'bottomleft' });

		legendControl.onAdd = function (map) {
			var div = L.DomUtil.create('div', 'info legend');
			var grades = [0, 10000, 20000, 50000, 100000];
	
			div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
			div.style.padding = '10px 35px';
			div.style.marginLeft = '30px';
	
			div.innerHTML += '<h4>Legend</h4>';
			for (var i = 1; i < grades.length + 1; i++) {
				if (i == grades.length) {
				div.innerHTML +=
				'<div style="background:' + getColor(grades[i-1] + 1) + '; height: 20px; width: 20px; display: inline-block; margin-right: 4px;"></div> ' +
					grades[i-1] + '+ <br>';
				} else {
				div.innerHTML +=
				'<div style="background:' + getColor(grades[i-1] + 1) + '; height: 20px; width: 20px; display: inline-block; margin-right: 4px;"></div> ' +
					grades[i-1] + '&ndash;' + grades[i] + '<br>';
				}
	
			}
	
			return div;
		};

		if (currentLayer) {
			if (legendControl) {
				map.removeControl(legendControl);
			}
			map.removeLayer(currentLayer);
		}

		currentLayer = L.geoJSON(geojson, {
			style: function (feature) {
				var countryName = feature.properties.NAME_EN;
				var value = sgpac_result[countryName];

				if (value == undefined) {
					countryName = feature.properties.NAME;
					value = sgpac_result[countryName]; 
				}
				var fillColor = getColor(value);
				
				return {
					fillColor: fillColor,
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7
				};
			},		
			onEachFeature: function (feature, layer) {
				if (feature.properties && feature.properties.NAME_EN) {
					
					var val = sgpac_result[feature.properties.NAME_EN];
					if(val == undefined) val = 0; 
					
					layer.bindPopup(feature.properties.NAME_EN + ': ' + val.toLocaleString(
						undefined, // leave undefined to use the visitor's browser 
						// locale or a string like 'en-US' to override it.
						{ minimumFractionDigits: 0 }
					));
				}
			}
		}).addTo(map);
	
		legendControl.addTo(map);
	});
}

var sgpac_result = {"Azerbaijan":25114,"Saint Kitts and Nevis":1255,"Egypt":231704,"Saudi Arabia":564794,"Virgin Islands":0,"United States of America":5792,"Republic of the Congo":2998,"British Virgin Islands":1370,"Turkmenistan":8756,"Christmas Island":132,"Brazil":7464623,"Senegal":10538,"Kuwait":838034,"South Africa":776555,"Austria":86350,"Vietnam":70526,"Canada":1193998,"Tokelau":0,"Niue":228,"Afghanistan":5249,"Saint Pierre and Miquelon":257,"Eritrea":1059,"Western Sahara":562,"Switzerland":109205,"Qatar":46185,"Slovenia":17743,"Australia":689852,"Taiwan":148721,"Mongolia":8661,"Reunion":2705,"Belarus":157256,"Central African Republic":1517,"Gibraltar":2409,"Uganda":30908,"Comoros":189,"Democratic Republic of the Congo":0,"Tanzania":40645,"North Macedonia":9153,"Panama":113943,"Pitcairn Islands":11,"Costa Rica":219251,"Paracel Islands":0,"Luxembourg":12495,"Belgium":303825,"French Guiana":1052,"French Polynesia":2394,"Timor-Leste":783,"Norfolk Island":265,"Heard Island and McDonald Islands":7,"Romania":61820,"Saint Helena":254,"Bouvet Island":6,"Slovakia":14940,"Tunisia":16228,"Morocco":46348,"Niger":2338,"South Sudan":879,"Mauritius":7051,"Gambia":763,"Thailand":3521812,"Guam":7821,"Ghana":68790,"Monaco":8138,"Argentina":2624484,"Faroe Islands":887,"Solomon Islands":536,"Aruba":6721,"Malawi":5662,"Sudan":29197,"Papua New Guinea":2073,"Lesotho":6784,"Mali":2743,"Tonga":650,"Dominica":548,"Cape Verde":1980,"Peru":292152,"Honduras":26387,"South Korea":329236,"Laos":12587,"Northern Cyprus":60408,"Kiribati":197,"Myanmar":16665,"Maldives":13740,"Seychelles":1358,"Vanuatu":552,"Yemen":13872,"Bahamas":12573,"British Indian Ocean Territory":14,"Cocos Islands":2,"Saint-Barthélemy":990,"Brunei":15081,"Norway":75175,"Guadeloupe":4594,"Spratly Islands":0,"Curaçao":3367,"Montserrat":354,"United States Minor Outlying Islands":97,"Greenland":4017,"North Korea":4761,"Madagascar":4953,"São Tomé and Príncipe":334,"San Marino":2209,"Guatemala":90547,"Malta":11305,"Germany":849992,"Nigeria":691916,"France":983066,"New Caledonia":1163,"Cyprus":13361,"Ireland":198817,"Northern Mariana Islands":2144,"Italy":1012930,"Åland":344,"Venezuela":631800,"Kyrgyzstan":6437,"Kenya":190508,"Pakistan":134582,"Bhutan":2408,"Bangladesh":36595,"Czech Republic":87204,"Benin":4183,"Palau":507,"Marshall Islands":74,"Poland":196623,"Martinique":25052,"Saint-Martin":1290,"Estonia":12137,"Uruguay":229568,"Burundi":707,"Ecuador":228314,"Ukraine":319214,"Cayman Islands":2994,"Haiti":14724,"Dominican Republic":225084,"Denmark":75352,"Guinea-Bissau":121,"Saint Lucia":3056,"Sri Lanka":46249,"China":266506,"Guernsey":4048,"South Georgia and the South Sandwich Islands":264,"Isle of Man":2830,"Zambia":18910,"Grenada":1431,"Puerto Rico":132073,"Kazakhstan":46458,"Turks and Caicos Islands":3773,"Sint Maarten":2242,"Liberia":1649,"Palestina":9082,"El Salvador":29112,"Russia":1410673,"Bahrain":36441,"Liechtenstein":633,"Suriname":1905,"Greece":168583,"Portugal":313625,"Bosnia and Herzegovina":13595,"Bulgaria":37556,"Somalia":2815,"Sweden":265730,"Iceland":23108,"United Arab Emirates":307034,"Netherlands":553669,"Ethiopia":4552,"Philippines":3130470,"United States":21254994,"Colombia":727334,"Oman":49328,"Swaziland":1540,"Samoa":369,"Turkey":7633889,"Antarctica":435,"Wallis and Futuna":3,"Trinidad and Tobago":18630,"Lithuania":13124,"India":825382,"Anguilla":1046,"Djibouti":1372,"Nepal":36322,"French Southern Territories":187,"Cook Islands":627,"Latvia":133310,"Svalbard and Jan Mayen":429,"Hungary":61573,"Antigua and Barbuda":4622,"Libya":22112,"Chad":1350,"Algeria":64936,"Jordan":39240,"Gabon":2293,"Paraguay":343259,"Lebanon":69767,"Togo":2078,"Kosovo":8750,"Fiji":4816,"Vatican City":6859,"Sierra Leone":1526,"Mauritania":1844,"Macao":13189,"American Samoa":496,"Uzbekistan":13517,"Guyana":1953,"Saint Vincent and the Grenadines":812,"Tuvalu":1,"Nauru":60,"Caspian Sea":2275,"Falkland Islands":337,"Spain":2069271,"Albania":5737,"Namibia":8699,"Syria":6858,"Mexico":2268024,"Serbia":54867,"Iraq":27079,"Cameroon":17693,"Guinea":1294,"New Zealand":134949,"Belize":3326,"Chile":845469,"Armenia":7312,"Botswana":19102,"Croatia":40403,"Israel":53715,"Hong Kong":124387,"Cuba":14780,"Rwanda":0,"United Kingdom":3258471,"Malaysia":5238889,"Jersey":4855,"Singapore":532587,"Burkina Faso":2024,"Cambodia":23730,"Mozambique":12764,"Equatorial Guinea":901,"Bermuda":3061,"Montenegro":10362,"Georgia":18922,"Japan":7322848,"Mayotte":355,"Côte d'Ivoire":8809,"Finland":143807,"Moldova":6244,"Tajikistan":2096,"Andorra":4802,"Barbados":8286,"Nicaragua":51389,"Clipperton Island":0,"Micronesia":292,"Indonesia":11097236,"Bonaire":0,"Sint Eustatius and Saba":919,"Akrotiri and Dhekelia":162,"Jamaica":38634,"Iran":47195,"Bolivia":21697,"Angola":10014}
  
function displayLargeLayer(polygonLayer) {
    map.setView([33.9806, -117.3755], 15); // Zoom in to the desired location

    if (currentLayer) {
        if (legendControl) {
            map.removeControl(legendControl);
        }
        map.removeLayer(currentLayer);
    }

    // Create a marker cluster group
    const markers = L.markerClusterGroup();

    // Iterate over the features in the GeoJSON object
    polygonLayer.features.forEach((feature) => {
        // Check if the feature's geometry type is Polygon or MultiPolygon
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            const marker = L.geoJSON(feature, {
                style: function (feature) {
                    return {
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillColor: getRandomColor(),
                        fillOpacity: '0.5'
                    };
                }
            });
            markers.addLayer(marker);
        }
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);
}

function displayLargeLinesLayer(polygonLayer, layerStyle) {

	map.setView([33.9806, -117.3755], 15); // Zoom in to the desired location

	if (currentLayer) {
		if (legendControl) {
			map.removeControl(legendControl);
		}
        map.removeLayer(currentLayer);
    }
	
	currentLayer = L.geoJSON(polygonLayer, {
		filter: function(feature, layer) {
			var bounds;
			
			if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
				bounds = new L.LatLngBounds();
				L.geoJSON(feature).eachLayer(function(layer) {
					bounds.extend(layer.getBounds());
				});
				} else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
				bounds = new L.LatLngBounds();
				L.geoJSON(feature).eachLayer(function(layer) {
					var latlngs = layer.getLatLngs();
					for (var i = 0; i < latlngs.length; i++) {
						bounds.extend(latlngs[i]);
					}
				});
				} else {
				// Exclude features that are not Polygon, MultiPolygon, LineString, or MultiLineString
				return false;
			}
			
			return map.getBounds().intersects(bounds);
		},
		style: function(feature) { 

			return layerStyle;
		}
	}).addTo(map);

	
}

function displayLayer(polygonLayer, fillColor) {
	L.geoJSON(polygonLayer, {
		style: function (feature) {			
			return {
				fillColor: fillColor,
				//weight: 2,
				//opacity: 1,
				color: '#9a342c',
				//dashArray: '3',
				fillOpacity: 0.5
			};
		}}).addTo(map);
}

function displayOutline(polygonLayer, OutlineColor) {
	L.geoJSON(polygonLayer, {
		style: function (feature) {			
			return {
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillColor: getRandomColor(),
					fillOpacity: '1'
			};
		}}).addTo(map);
}

function displayOverlay() {	
	fetch('http://localhost:8000/data/overlay/resultIntersect.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
		}
        return response.json(); // Assuming the file is JSON
	})
    .then(data => {
        displayLayer(data, '#aba194');
	})
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
	});
	
}

function displayFirstLayer() {
	var fileInput = document.getElementById('input1');
	var file = fileInput.files[0];
	
    var reader = new FileReader();
    
    reader.onload = function(event) {
		const polygonLayer = JSON.parse(event.target.result);
        displayOutline(polygonLayer, '#7b2d26');
	};
    
    reader.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
	};
    
    reader.readAsText(file);
}

function displaySecondLayer() {
	var fileInput = document.getElementById('input2');
	var file = fileInput.files[0];
	
    var reader = new FileReader();
    
    reader.onload = function(event) {
		const polygonLayer = JSON.parse(event.target.result);
        displayOutline(polygonLayer, '#0b7a75');
	};
    
    reader.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
	};
    
    reader.readAsText(file);
}

function displayLines() {

	document.getElementById('loaderWrapper').style.display = 'block';


	fetch('http://localhost:8000/CaliforniaRoads.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
		}
        return response.json(); // Assuming the file is JSON
	})
    .then(data => {
		document.getElementById('loaderWrapper').style.display = 'none';
		style = {
			weight: 1,
			opacity: 1,
			color: '#1c263c'
		}
        displayLargeLinesLayer(data, style);
	})
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
	});
}

function displayDDCEL(fileName, type) {

	map.setView([33.9806, -117.3755], 15);
	
	function loadVisibleData() {
		document.getElementById('loaderWrapper').style.display = 'block';
	
		fetch(fileName)
			.then(response => {
				if (!response.ok) {
					document.getElementById('loaderWrapper').style.display = 'none';
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
	
				document.getElementById('loaderWrapper').style.display = 'none';
	
				// Filter the GeoJSON data based on the visible area
				const filteredData = {
					type: 'FeatureCollection',
					features: data.features.filter(feature => {
						const bounds = L.geoJSON(feature).getBounds();
						return map.getBounds().intersects(bounds);
					})
				};
	
				// Remove the current layer if it exists
				if (currentLayer) {
					if (legendControl) {
						map.removeControl(legendControl);
					}
					map.removeLayer(currentLayer);
				}
	
				// Create a marker cluster group
				const markers = L.markerClusterGroup();
	
				// Iterate over the filtered features and add markers to the cluster group
				filteredData.features.forEach((feature) => {

					const bounds = new L.LatLngBounds();
					const marker = L.geoJSON(feature, {
						style: function (feature) {
							if (type == "INPUT") {
								return {
									weight: 1,
									opacity: 1,
									color: '#1c263c'
								};
							} else if (type == "OUTPUT") {
								return {
									weight: 2,
									opacity: 1,
									color: '#1c263c',
									dashArray: '3',
									fillColor: getRandomColor(),
									fillOpacity: '0.5'
								};
							}
						}
					});

					if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
						marker.eachLayer(function (layer) {
							bounds.extend(layer.getBounds());
						});
					} else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
						marker.eachLayer(function (layer) {
							var latlngs = layer.getLatLngs();
							for (var i = 0; i < latlngs.length; i++) {
								bounds.extend(latlngs[i]);
							}
						});
					}

					markers.addLayer(marker);
				});
	
				// Add the marker cluster group to the map
				map.addLayer(markers);
	
				// Update the currentLayer variable
				currentLayer = markers;
			})
			.catch(error => {
				console.error('There was a problem loading data:', error);
			});
	}
	
	// Initial load of visible data
	loadVisibleData();
	
	// Reload visible data when zooming in or out
	map.on('zoomend', () => {
		const zoomLevel = map.getZoom();
		if (zoomLevel >= 15) { // Adjust the zoom level threshold as needed
			loadVisibleData();
		}
	});
}
	
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function callDDCEL() {
	let fineName = "http://localhost:8000/CaliforniaRoads.geojson";
	displayDDCEL(fineName, "INPUT");
	is_count_on = false;
}

function callOverlay() {
	let fineName = "http://localhost:8000/DDCEL.geojson";
	displayDDCEL(fineName, "OUTPUT");
	is_count_on = false;
}

function callSGPAC() {
	if (!is_count_on) {
		displayPolygons();
		is_count_on = true;
	}
}

function updateFileName(inputElement, spanId) {
	const fileInput = document.getElementById('input1');
	const allowedExtensions = ['.zip'];
	const fileName = fileInput.value.split('.').pop(); // Get the file extension

	if (allowedExtensions.includes('.' + fileName.toLowerCase())) {
		// File type is allowed, you can proceed with uploading or processing
		alert('File uploaded successfully!');
		// Add your upload or processing logic here
	} else {
		// File type is not allowed, show error message
		alert('Error: Only .zip files are allowed.');
		// Clear the file input to prevent uploading invalid files
		fileInput.value = '';
	}
}

$(document).ready(function() {
    const originalButtonText1 = $('#fileInputLabel1').text(); // Store the original button text for the first button
    const originalButtonText2 = $('#fileInputLabel2').text(); // Store the original button text for the second button

    $('#fileInput1').change(function() {
        handleFileChange($(this), '#fileInputLabel1', '#uploadButton1', '.zip', originalButtonText1);
    });

    $('#uploadButton1').click(function() {
        handleUploadButtonClick('#fileInput1', '#fileInputLabel1', '#uploadButton1', originalButtonText1);
    });

    $('#fileInput2').change(function() {
        handleFileChange($(this), '#fileInputLabel2', '#uploadButton2', '.txt', originalButtonText2);
    });

    $('#uploadButton2').click(function() {
        handleUploadButtonClick('#fileInput2', '#fileInputLabel2', '#uploadButton2', originalButtonText2);
    });

    function handleFileChange(input, labelId, buttonId, acceptFileType, originalText) {
        const file = input.get(0).files[0]; // Get the selected file
        if (file && file.name.toLowerCase().endsWith(acceptFileType)) {
            $(labelId).text(file.name); // Display the file name next to the button
            $(buttonId).show(); // Show the corresponding upload button
        } else {
            alert('Please upload a valid ' + acceptFileType + ' file.');
            input.val(null); // Reset the file input
            $(labelId).text(originalText); // Reset the label text to the original button name
            $(buttonId).hide(); // Hide the upload button
        }
    }

    function handleUploadButtonClick(inputId, labelId, buttonId, originalText) {
        const fileInput = $(inputId).get(0).files[0]; // Get the selected file
        // Perform upload logic here (e.g., AJAX request to server)
        console.log('Uploading file:', fileInput.name);
        // Optionally disable the upload button after upload
        $(inputId).prop('disabled', true);

        // Reset to original state after successful upload
        setTimeout(function() {
            $(inputId).val(null); // Clear the file input
            $(labelId).text(originalText); // Reset the label text to the original button name
            $(buttonId).hide(); // Hide the upload button
            $(inputId).prop('disabled', false); // Re-enable the file input
        }, 1000); // Adjust the delay time as needed
    }
});




