//Number of countries per continent. 
#Number of countries per continent....................   
    <div class="col-md-6">
    <h4>Number of countries per continent</h4>
   <div id="number_of_countries"></div>
    </div>

number_of_countries(ndx);
function number_of_countries(ndx) {
  
   var continent_dim = ndx.dimension(dc.pluck('continent'));
   var number_of_countries = continent_dim.group().reduceCount(dc.pluck('country'));
   
   dc.barChart("#number_of_countries")
            .width(900)
            .height(300)
            .margins({top: 10, right: 50, bottom: 50, left: 50})
            .dimension(continent_dim)
            .group(number_of_countries)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units .ordinal)
            .xAxisLabel("Continent")
            .yAxisLabel("Countries")
            .yAxis().ticks(20);
}

#........................................................................................


Average income by coutry:
    
     var country_dim = ndx.dimension(dc.pluck('country'));
   var gni_group_dim = country_dim.group().reduceSum(dc.pluck('gross_national_income_per_capita'));
   
   dc.barChart("#average_income_by_continent")
            .width(900)
            .height(300)
            .margins({top: 10, right: 50, bottom: 50, left: 50})
            .dimension(country_dim)
            .group(gni_group_dim)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Country")
            .yAxisLabel("HDI")
            .yAxis().ticks(20);
      
    }