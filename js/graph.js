queue()
  .defer(d3.csv, "data/human_development.csv")
  .await(makeGraphs);
  
    function makeGraphs(error, developmentData) {
        
        let ndx = crossfilter(developmentData);
        
        developmentData.forEach(function (d){
            d.Human_Development_Index = parseFloat(d.Human_Development_Index);
            d.HDI_Rank= parseInt(d["hdi_rank"]);
            d.Gross_National_Income = parseInt(d["Gross_National_Income"]);
        })
        
        show_country_rank(ndx);
        top_10_countries(ndx);
        lowest_10_countries(ndx);
        average_hdi_score(ndx, "#average_hdi_score");
         dc.renderAll();
    }

function show_country_rank(ndx) {
    
   var country_dim = ndx.dimension(dc.pluck('country'));
   var Human_Development_Index_group = country_dim.group().reduceSum(dc.pluck('Human_Development_Index'));
   
   
  console.log(Human_Development_Index_group.all());
   
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

//Top 10 // Lowest 10. 
function top_10_countries(ndx) {
  
  var top_country_dim = ndx.dimension(dc.pluck('country'));
  var hdi_rank_group = top_country_dim.group().reduceSum(dc.pluck('Human_Development_Index'));
  
  console.log(hdi_rank_group.all());
  
  dc.rowChart("#top_10_countries")
        .width(600)
        .height(330)
        .dimension(top_country_dim)
        .group(hdi_rank_group)
        .cap(10)
        .othersGrouper(false)
        .xAxis().ticks(10);
}

function lowest_10_countries(ndx) {
  
  var lowest_country_dim = ndx.dimension(dc.pluck('country'));
  var hdi_rank_group = lowest_country_dim.group().reduceSum(dc.pluck('hdi_rank'));
  
  console.log(hdi_rank_group.all());
  
  dc.rowChart("#lowest_10_countries")
        .width(600)
        .height(330)
        .dimension(lowest_country_dim)
        .group(hdi_rank_group)
        .cap(10)
        .othersGrouper(false)
        .xAxis().ticks(10);

dc.renderAll();

}
    
//////////////////////////////////////////////////////
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

dc.renderAll();


