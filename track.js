async function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 3
  });

  var bounds = new google.maps.LatLngBounds();

  let distance = 0;
  const path = [];
  let lastPoint;

  const tracks = await Promise.all([
    "008e9049121e84d51cbda4f0d3562901",
    "0f874c576933fa5fa409979e3ab785e3",
    "11757857002fb92219c4f72411f502d7",
    "2c1f72c983957fdeb1412866560024a7",
    "2df725c8b0e53189287d50e85dc08ff0",
    "367cdd65cee6d885f75e1f33dc76772d",
    "3c71916557b379f180e7aa9f41b3e334",
    "42af8b133416cc3bf060c25e331a6bb7",
    "4e43700d4fde17b6730c0d5516a701b9",
    "628937fd2b7c6077496978a93a519acc",
    "65c678c9ed9b167cfaf4fbdc051269f1",
    "718e13027b8a9a7404557665156ff153",
    "85da508b784fe70ecf7e9ce89f82f8ab",
    "8b42ae56bd6afae7ec0dcd5ffb803ac1",
    "ac5ecbebb017465eea43f9a1966bdfd9",
    "b3a506283405d80fb5e23199698ff4cd",
    "bc57c9eb999b4b9ded4e088b505364d3",
    "ce26856fb68f6fabbed42ed57ebab093",
    "d5f3edfd6fe851176d4d11b03a254d65",
    "d7f297b55294ba7e21447c5cd5e2c274",
    "d9df1f6cac1ec3058200bd6287a1eb1b",
    "da4491d1eb48b8b2154594636ae207b2",
    "e2733415aa5735ce11507020785bd4df",
    "e475a1bb2181807b18b68f3d4e3f303d",
    "e844275d129105d28f9bf4ea69d3a0ef",
    "ee839332b5efbe255b264abe28dc6c57",
    "f42f1bd9c0a22b6c476416fc2f88406b",
    "f6d16d51fe9b1739727c23e2f1872871",
    "f81135732a6328c1284a3586349865da",
    "f8a4289c4845bdaf4d3d259f7c04ebb5"
  ].map(async track => {
    const response = await fetch(`tracks/${track}.json`)
    return response.json()
  }))

  tracks.sort((a, b) => Date.parse(a.date).valueOf() - Date.parse(b.date).valueOf()).forEach(track => {
    var path = lastPoint ? [lastPoint].concat(track.coordinates) : track.coordinates
    var segment = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#E05638',
        strokeOpacity: 0.75,
        strokeWeight: 3
    });
    lastPoint = track.coordinates[track.coordinates.length - 1];
    segment.setMap(map);
    bounds.extend(path[0])
    bounds.extend(path[path.length - 1])

    let start = track.coordinates[0]
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(start.lat, start.lng),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeOpacity: 0.5,
          scale: 2
        },
        // label: 'A',
        map: map
    });
    var point_popup = `${track.name}<br>${track.id}`;
    var infowindow = new google.maps.InfoWindow({ content: point_popup });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    distance += google.maps.geometry.spherical.computeLength(segment.getPath().getArray());

    console.log('total distance:', Math.round(distance / 1852) /* nautical miles */)
  })

  map.fitBounds(bounds);
  map.panToBounds(bounds);

}
