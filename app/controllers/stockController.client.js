'use strict';

(function() {
    	var form = document.getElementsByTagName('form')[0];
    	
		    google.charts.load('current', {packages: ['corechart', 'line']});
		    google.charts.setOnLoadCallback(drawBasic);
		    form.addEventListener('submit', function(e) {
		      e.preventDefault();
		      socket.emit('new_ticker', e.target.childNodes[3].value);
		    })
		    function appendStockDiv(val) {
      if(document.querySelectorAll('#' + val.toUpperCase()).length > 0) { return; }
      var div = document.createElement('div');
      var a = document.createElement('a');
      a.appendChild(document.createTextNode('x'))
      a.setAttribute('href', '/remove_stock?stock=' + val);
      a.setAttribute('id', val);
      div.appendChild(a);
       var textNode = document.createTextNode(val);
       div.appendChild(textNode);
       document.getElementsByClassName('container')[0].appendChild(div);
    }
			function drawBasic(cb) {
		      var data = new google.visualization.DataTable();
		      data.addColumn('date', 'stock date');
		      ajaxFunctions.ajaxRequest('GET', '/get_all_stocks', function(stocks) {
		        
		        JSON.parse(stocks).forEach((stock) => { appendStockDiv(stock.symbol)});
		        JSON.parse(stocks).forEach((stock) => {
		          // add a column for each stock
		          data.addColumn('number', stock.symbol);
		        });
		
		        data.addRows(
		          JSON.parse(stocks)
		          .map((e) => e.data
		                        .map((e) => { return [new Date(e.date), e.price]; })
		          )
		          .reduce((acc, col) => {
		            if (acc.length === 0) { 
		              return col;
		            } else {
		              return acc.map((e, i) => { return e.concat(col[i][1]); });
		            }
		          }, [])
		        );
		        
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
		        if (cb) { cb() };
		      });
			}
		    var socket = io();
		    
		    socket.on('connect', function(data) {
		        socket.emit('join', 'Hello World from client');
		    });
		    
		    socket.on('updateui', function() {
		      console.log('ui updating!');
		      drawBasic();
		    })
		    
          document.addEventListener('click', function(e) {
          if(e.target.tagName === 'A') {
            e.preventDefault();
            ajaxFunctions.ajaxRequest('GET', '/remove_stock?stock=' + e.target.id);
            socket.emit('updateuionallsockets');
          }
		    });

})();