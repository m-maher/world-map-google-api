


google.charts.load('visualization', {'packages':['geochart']});

google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  var data = new google.visualization.arrayToDataTable([
    ['Country']
  ]);

  var options = {
    backgroundColor: { fill:'#FFFFFF', stroke:'#FFFFFF' },   
    datalessRegionColor: '#abd5ff'
  };

  var chart = new google.visualization.GeoChart(document.getElementById('map'));

  chart.draw(data, options);
}



