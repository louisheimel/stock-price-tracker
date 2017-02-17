'use strict';
var something;
(function() {
    var form = document.getElementsByTagName('form')[0];
    
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic);
    
    renderAllStocks();
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var value = e.target[0].value;
      // get stock data here
      ajaxFunctions.ajaxRequest('GET', '/get_stock?stock=' + value, function(data) {
        var div = document.querySelector('div.container');
        
        var newDiv = document.createElement('div');
        var para = document.createElement('p').appendChild(document.createTextNode(value.toUpperCase()));
        newDiv.appendChild(para)
        div.appendChild(newDiv);
      })
      
    });

    function renderAllStocks() {
      ajaxFunctions.ajaxRequest('GET', '/get_all_stocks', function(stocks) {
        console.log('hello, here are teh stocks ' + stocks);
        
        stocks.forEach((stock) => {
          console.log(stock);
        })
      })
    }
    
    function drawBasic(stockData) {
          console.log(stockData)
          var data = new google.visualization.DataTable();
          data.addColumn('date', 'Y');
          data.addColumn('number', 'X');
    
          data.addRows(stockData.data);
    
          var options = {
            hAxis: {
              title: 'Time'
            },
            vAxis: {
              title: 'Price'
            }
          };
    
          var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    
          chart.draw(data, options);
        }
})();