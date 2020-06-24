var alldata;

$.ajax ({
    'async': false,
    'global': false,
    'dataType': 'json',
    'url': 'https://thefederal.com/api/scraper.php?m=Corona&t=globalDashboard',
    'success': function(data) {           
        
        alldata = data;
    }

       
});

console.log("alldata", alldata);
