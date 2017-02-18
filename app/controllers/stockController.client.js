'use strict';
var something;
(function() {
    var form = document.getElementsByTagName('form')[0];
    
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic);
    
    function drawBasic() {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'stock date');
      ajaxFunctions.ajaxRequest('GET', '/get_all_stocks', function(stocks) {
        
        // console.log('stocks is an array? ' + (JSON.parse(stocks) instanceof Array));
        JSON.parse(stocks).forEach((stock) => {
          // render stock data to chart here
          data.addColumn('number', stock.symbol);
        });
        
        data.addRows([
          // Add rows here
        ]);
        
        var options = {
          hAxis: {
            title: 'stock date'
          },
          
          vAxis: {
            title: 'price'
          }
        }
        
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  
        chart.draw(data, options);
      })
      
      

    }
    
    // renderAllStocks();
    
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

        JSON.parse(stocks).forEach((stock) => {
          // render stock data to chart here
        })
      })
    }
    
 
})();