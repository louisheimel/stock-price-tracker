'use strict';

(function() {
    var form = document.getElementsByTagName('form')[0];
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var value = e.target[0].value;
      // get stock data here
      ajaxFunctions.ajaxRequest('GET', '/get_stock?stock=' + value, function(data) {
        console.log(data)
      })
      
    })
})();