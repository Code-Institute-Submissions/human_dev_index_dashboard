queue()
  .defer(d3.json, "/data")
  .await(makeGraphs);
  
    function makeGraphs(error, developmentData) {
        
        let ndx = crossfilter(developmentData);
        
        developmentData.forEach(function (d){
            d.Human_Development_Index = parseFloat(d.Human_Development_Index);
            d.HDI_Rank= parseInt(d["hdi_rank"]);
            d.life_expectancy_at_birth = parseFloat(d["life_expectancy_at_birth"]);
            d.gross_national_income_per_capita= parseInt(d["gross_national_income_per_capita"]);
            d.mean_years_of_education = parseFloat(d["mean_years_of_education"]);
        });
        
        top_10_countries(ndx);
        lowest_10_countries(ndx);
        average_hdi_score(ndx, "#average_hdi_score");
        average_hdi_score_by_continent(ndx, "#average_hdi_score_by_continent");
        display_rank(ndx);
        choose_by_country(ndx);
        life_expectancy_average(ndx, "#life_expectancy_average");
        average_income_by_continent(ndx, "#average_income_by_continent");
        average_education_by_continent(ndx, "#average_education_by_continent");
        top_10_expectancy(ndx);
        lowest_10_expectancy(ndx);
        top_10_income(ndx);
        lowest_10_income(ndx);
        top_10_education(ndx);
        lowest_10_education(ndx);
        display_life_expectancy(ndx);
        display_gross_income(ndx);
        display_mean_education(ndx);
        show_life_expectancy_to_HDI_correlation(ndx);
        show_GNI_to_HDI_correlation(ndx);
        show_Education_to_HDI_correlation(ndx);
        continent_countries(ndx);
        
        dc.renderAll();
    }

//Top 10 Countries by HDI score..................... 
function top_10_countries(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var hdi_rank_group = top_country_dim.group().reduceSum(dc.pluck('Human_Development_Index'));

  
  dc.rowChart("#top_10_countries")
        .width(400)
        .height(200)
        .dimension(top_country_dim)
        .group(hdi_rank_group)
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(10);
}

//Lowest 10 Countries by score..................... 

function lowest_10_countries(ndx) {
  
  var lowest_country_dim = ndx.dimension(dc.pluck('country'));
  var hdi_rank_group = lowest_country_dim.group().reduceSum(dc.pluck('hdi_rank'));
  
  
  dc.rowChart("#lowest_10_countries")
        .width(400)
        .height(200)
        .dimension(lowest_country_dim)
        .group(hdi_rank_group)
        .cap(5)
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
        .width(700)
        .height(500)
        .margins({top: 10, right: 50, bottom: 50, left: 50})
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



//DROPDOWN MENU SECTION..............................//
    
function choose_by_country(ndx){
        let country_dim = ndx.dimension(dc.pluck('country'));
        let country_group = country_dim.group();
        
        dc.selectMenu("#choose_by_country")
            .dimension(country_dim)
            .group(country_group);
} 

// Average Life Expectancy at Birth.................//

function life_expectancy_average(ndx, element) {
  let continent_dim = ndx.dimension(dc.pluck('continent'));
  
  let birth_by_continent = continent_dim.group().reduce(
        function (p, v) {
            p.count++;
            p.total += v.life_expectancy_at_birth;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            p.count--;
            if(p.count > 0){
                p.total -= v.life_expectancy_at_birth;
                p.average = p.total / p.count; 
            }else{
                p.total = 0;
                p.average = 0;
            }
            return p;
        },
        function (){
            return {count:0, total:0, average:0};
        });
        
        
       dc.barChart(element)
        .width(700)
        .height(500)
        .margins({top: 10, right: 50, bottom: 50, left: 50})
        .dimension(continent_dim)
        .group(birth_by_continent)
        .valueAccessor(function(d){
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Continents")
        .yAxisLabel("Avg Life Expectancy score")
        .yAxis().ticks(20);
}


// Display Country Age......//// 

function top_10_expectancy(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var expectancy_rank_group = top_country_dim.group().reduceSum(dc.pluck('life_expectancy_at_birth'));

  
  dc.rowChart("#top_10_expectancy")
        .width(400)
        .height(200)
        .dimension(top_country_dim)
        .group(expectancy_rank_group)
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(10);
}

function lowest_10_expectancy(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var expectancy_rank_group = top_country_dim.group().reduceSum(dc.pluck('life_expectancy_at_birth'));

  
  dc.rowChart("#lowest_10_expectancy")
        .width(400)
        .height(200)
        .dimension(top_country_dim)
        .group(expectancy_rank_group)
        .ordering(function(d){ return d.value; })
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(10);
}


function top_10_income(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var income_rank_group = top_country_dim.group().reduceSum(dc.pluck('gross_national_income_per_capita'));

  
  dc.rowChart("#top_10_income")
        .width(400)
        .height(200)
        .dimension(top_country_dim)
        .group(income_rank_group)
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(5);
}

function lowest_10_income(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var income_rank_group = top_country_dim.group().reduceSum(dc.pluck('gross_national_income_per_capita'));

  
  dc.rowChart("#lowest_10_income")
        .width(400)
        .height(200)
        .dimension(top_country_dim)
        .group(income_rank_group)
        .ordering(function(d){ return d.value; })
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(5);
}

//education by continent /////

function average_education_by_continent(ndx, element) {
  let continent_dim = ndx.dimension(dc.pluck('continent'));
  
  let education_by_continent = continent_dim.group().reduce(
        function (p, v) {
            p.count++;
            p.total += v.mean_years_of_education;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            p.count--;
            if(p.count > 0){
                p.total -= v.mean_years_of_education;
                p.average = p.total / p.count; 
            }else{
                p.total = 0;
                p.average = 0;
            }
            return p;
        },
        function (){
            return {count:0, total:0, average:0};
        });
        
        
       dc.barChart(element)
        .width(700)
        .height(500)
        .margins({top: 10, right: 50, bottom: 50, left: 50})
        .dimension(continent_dim)
        .group(education_by_continent)
        .valueAccessor(function(d){
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Continents")
        .yAxisLabel("Avg Education Years")
        .yAxis().ticks(20);
}


//Average Age Display // 

function display_life_expectancy(ndx) {
  
  var country_dim = ndx.dimension(dc.pluck('country'));
  var expectancy_rank_group = country_dim.group().reduceSum(dc.pluck('life_expectancy_at_birth'));
        
   dc.numberDisplay("#display_life_expectancy")
        .formatNumber(d3.format("," + " out of 188 "))
        .group(expectancy_rank_group);
}

function display_gross_income(ndx) {
  
  var country_dim = ndx.dimension(dc.pluck('country'));
  var gross_income_group = country_dim.group().reduceSum(dc.pluck('gross_national_income_per_capita'));
        
   dc.numberDisplay("#display_gross_income")
        .formatNumber(d3.format(","))
        .group(gross_income_group);
}

function display_mean_education(ndx) {
  
  var country_dim = ndx.dimension(dc.pluck('country'));
  var mean_education_group = country_dim.group().reduceSum(dc.pluck('mean_years_of_education'));
        
   dc.numberDisplay("#display_mean_education")
        .formatNumber(d3.format(","))
        .group(mean_education_group);
}

// Display Country Income......//// 

function average_income_by_continent(ndx, element) {
    
let continent_dim = ndx.dimension(dc.pluck('continent'));
  
  let income_by_continent = continent_dim.group().reduce(
        function (p, v) {
            p.count++;
            p.total += v.gross_national_income_per_capita;
            p.average = p.total / p.count;
            return p;
        },
        function (p, v) {
            p.count--;
            if(p.count > 0){
                p.total -= v.gross_national_income_per_capita;
                p.average = p.total / p.count; 
            }else{
                p.total = 0;
                p.average = 0;
            }
            return p;
        },
        function (){
            return {count:0, total:0, average:0};
        });
        
        
       dc.barChart(element)
        .width(700)
        .height(500)
        .margins({top: 10, right: 50, bottom: 50, left: 50})
        .dimension(continent_dim)
        .group(income_by_continent)
        .valueAccessor(function(d){
            return d.value.average;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Continents")
        .yAxisLabel("Avg Income")
        .yAxis().ticks(20);
}

  

//Correlation between life expectancy and HDI by continent.

function show_life_expectancy_to_HDI_correlation(ndx) {
  var  continentColors = d3.scale.ordinal()
    .domain(["Africa", "Asia", "Europe", "Oceania", "South America", "North America"])
    .range(["pink", "blue", "orange", "yellow", "red", "green"]);

  let lDim = ndx.dimension(dc.pluck("life_expectancy_at_birth"));
    let expectancyDim = ndx.dimension(function (d) {
	      return [d.life_expectancy_at_birth, d.Human_Development_Index, d.gross_national_income_per_capita];	
});
    
    let expectancyHDIGroup = expectancyDim.group();
    
    let minExpectancy = lDim.bottom(1)[0].life_expectancy_at_birth;
    let maxExpectancy = lDim.top(1)[0].life_expectancy_at_birth;
  
  console.log(expectancyHDIGroup.all()); 


  dc.scatterPlot("#show_life_expectancy_to_HDI_correlation")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minExpectancy,maxExpectancy]))
        .brushOn(true)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("HDI")
        .xAxisLabel("Life Expectancy")
        .title(function (d) {
            return " Life Expectancy: " + d.key[0] + " years and HDI is: " + d.key[1];
        })
        .colorAccessor(function (d) {
            return d.key[2];
        })
        .colors(continentColors)
        .dimension(expectancyDim)
        .group(expectancyHDIGroup)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
        
}



//Correlation between GDI and HDI./////////////

function show_GNI_to_HDI_correlation(ndx) {
  var  continentColors = d3.scale.ordinal()
    .domain(["Africa", "Asia", "Europe", "Oceania", "South America", "North America"])
    .range(["pink", "blue", "orange", "yellow", "red", "green"]);

  let lDim = ndx.dimension(dc.pluck("gross_national_income_per_capita"));
    let incomeDim = ndx.dimension(function (d) {
	      return [d.gross_national_income_per_capita, d.Human_Development_Index, d.continent];	
});
    
    let incomeHDIGroup = incomeDim.group();
    
    let minGNI = lDim.bottom(1)[0].gross_national_income_per_capita;
    let maxGNI = lDim.top(1)[0].gross_national_income_per_capita;

  dc.scatterPlot("#show_GNI_to_HDI_correlation")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minGNI,maxGNI]))
        .brushOn(true)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("HDI")
        .xAxisLabel("Gross National Income Per Capita")
        .title(function (d) {
            return " GNI is: " + d.key[0] + " and HDI is: " + d.key[1];
        })
        .colorAccessor(function (d) {
            return d.key[2];
        })
        .colors(continentColors)
        .dimension(incomeDim)
        .group(incomeHDIGroup)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
        
}
        
// Correlation between Education and HDI // 

function show_Education_to_HDI_correlation(ndx) {
  var  continentColors = d3.scale.ordinal()
    .domain(["Africa", "Asia", "Europe", "Oceania", "South America", "North America"])
    .range(["pink", "blue", "orange", "yellow", "red", "green"]);

  let lDim = ndx.dimension(dc.pluck("mean_years_of_education"));
    let educationDim = ndx.dimension(function (d) {
	      return [d.mean_years_of_education, d.Human_Development_Index, d.continent];	
});
    
    let educationHDIGroup = educationDim.group();
    
    let minEdu = lDim.bottom(1)[0].mean_years_of_education;
    let maxEdu = lDim.top(1)[0].mean_years_of_education;

  dc.scatterPlot("#show_Education_to_HDI_correlation")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minEdu,maxEdu]))
        .brushOn(true)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("HDI")
        .xAxisLabel("Mean years of Education")
        .title(function (d) {
            return " Years of education are: " + d.key[0] + " and HDI is: " + d.key[1];
        })
        .colorAccessor(function (d) {
            return d.key[2];
        })
        .colors(continentColors)
        .dimension(educationDim)
        .group(educationHDIGroup)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
        
}

function top_10_education(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var education_rank_group = top_country_dim.group().reduceSum(dc.pluck('mean_years_of_education'));

  
  dc.rowChart("#top_10_education")
        .width(400)
        .height(200)
        .dimension(top_country_dim)
        .group(education_rank_group)
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(10);
}


function lowest_10_education(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var education_rank_group = top_country_dim.group().reduceSum(dc.pluck('mean_years_of_education'));

  
  dc.rowChart("#lowest_10_education")
        .width(400)
        .height(200)
        .dimension(top_country_dim)
        .group(education_rank_group)
        .ordering(function(d){ return d.value; })
        .cap(5)
        .othersGrouper(false)
        .xAxis().ticks(10);
}

/////// Pie chart //////

function continent_countries(ndx) {

    var group_by_continent = ndx.dimension(dc.pluck('continent'));
    var total_countries_per_continent = group_by_continent.group();
            
    dc.pieChart("#countries_per_continent")
            .height(412)
            .radius(112)
            .dimension(group_by_continent)
            .group(total_countries_per_continent);
            
            }