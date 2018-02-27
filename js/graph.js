queue()
  .defer(d3.csv, "data/human_development_amend.csv")
  .await(makeGraphs);
  
    function makeGraphs(error, developmentData) {
        
        let ndx = crossfilter(developmentData);
        
        developmentData.forEach(function (d){
            d.Human_Development_Index = parseFloat(d.Human_Development_Index);
            d.HDI_Rank= parseInt(d["hdi_rank"]);
            d.Gross_National_Income = parseInt(d["gross_national_income_per_capita"]);
        })
        
        show_country_rank(ndx);
        top_10_countries(ndx);
        lowest_10_countries(ndx);
        number_of_countries(ndx);
        average_hdi_score(ndx, "#average_hdi_score");
        average_hdi_score_by_continent(ndx, "#average_hdi_score_by_continent");
        display_rank(ndx);
        choose_by_country(ndx);
        dc.renderAll();
    }
///---------------ALL COUNTRIES HDI SCORE------------------//
function show_country_rank(ndx) {
    
   var country_dim = ndx.dimension(dc.pluck('country'));
   var Human_Development_Index_group = country_dim.group().reduceSum(dc.pluck('Human_Development_Index'));
   
   dc.barChart("#hdi_rank_by_country")
            .width(900)
            .height(300)
            .margins({top: 10, right: 50, bottom: 50, left: 50})
            .dimension(country_dim)
            .group(Human_Development_Index_group)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Country")
            .yAxisLabel("HDI")
            .yAxis().ticks(20);
        
      
    }

//Top 10 Countries by score..................... 
function top_10_countries(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var hdi_rank_group = top_country_dim.group().reduceSum(dc.pluck('Human_Development_Index'));

  
  dc.rowChart("#top_10_countries")
        .width(600)
        .height(330)
        .dimension(top_country_dim)
        .group(hdi_rank_group)
        .cap(10)
        .othersGrouper(false)
        .xAxis().ticks(10);
}

//Lowest 10 Countries by score..................... 

function lowest_10_countries(ndx) {
  
  var lowest_country_dim = ndx.dimension(dc.pluck('country'));
  var hdi_rank_group = lowest_country_dim.group().reduceSum(dc.pluck('hdi_rank'));
  
  
  dc.rowChart("#lowest_10_countries")
        .width(600)
        .height(330)
        .dimension(lowest_country_dim)
        .group(hdi_rank_group)
        .cap(10)
        .othersGrouper(false)
        .xAxis().ticks(10);
}
  
  function display_rank(ndx) {
  
  var lowest_country_dim = ndx.dimension(dc.pluck('country'));
  var hdi_rank_group = lowest_country_dim.group().reduceSum(dc.pluck('hdi_rank'));
        
   dc.numberDisplay("#display_rank")
        .formatNumber(d3.format("," + " out of 188 "))
        .group(hdi_rank_group);
}
    

//The average world HDI Score//
function average_hdi_score(ndx, element) {
  
    let all_records = ndx.groupAll();
    
    let average_hdi = all_records.reduce(
        function (p, v) {
            p.count++;
            p.total += v.Human_Development_Index;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            p.count--;
            if(p.count > 0){
                p.total -= v.Human_Development_Index;
                p.average = p.total / p.count; 
            }else{
                p.total = 0;
                p.average = 0
            }
            return p;
        },
        function (){
            return {count:0, total:0, average:0}
        });
        
    
    dc.numberDisplay(element)
        .formatNumber(d3.format(".1f"))
        .valueAccessor(function (d) {
            return d.average;
        })
        .group(average_hdi);
        
}

//The average continent HDI Score//
function average_hdi_score_by_continent(ndx, element) {
  let continent_dim = ndx.dimension(dc.pluck('continent'));
  
  let hdi_by_continent = continent_dim.group().reduce(
        function (p, v) {
            p.count++;
            p.total += v.Human_Development_Index;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            p.count--;
            if(p.count > 0){
                p.total -= v.Human_Development_Index;
                p.average = p.total / p.count; 
            }else{
                p.total = 0;
                p.average = 0
            }
            return p;
        },
        function (){
            return {count:0, total:0, average:0};
        });
        
    
    dc.barChart(element)
        .width(800)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(continent_dim)
        .group(hdi_by_continent)
        .valueAccessor(function(d){
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Continents")
        .yAxisLabel("Avg HDI score")
        .yAxis().ticks(20);
}

//Number of countries per continent. 
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
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Continent")
            .yAxisLabel("Countries")
            .yAxis().ticks(20);
}

//DROPDOWN MENU SECTION..............................//
    
function choose_by_country(ndx){
        let country_dim = ndx.dimension(dc.pluck('country'));
        let country_group = country_dim.group();
        
        dc.selectMenu("#choose_by_country")
            .dimension(country_dim)
            .group(country_group);
} 



