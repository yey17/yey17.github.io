var action = function(data)
{
  //data.forEach(function (d){d.mm=10* Math.floor(d.mid/10);});

  var process=crossfilter(data);
  //var cf_periode=process.dimension(function (d){return d.period;});
  var cf_hh=process.dimension(function (d){return d.estimate_hh_Ward;});
  var cf_ind=process.dimension(function (d){return d.estimate_Ind_Ward;});
  var cf_adm0=process.dimension(function (d){return d.adm0;});
  var cf_adm1_arr=process.dimension(function (d){return d.state_name;});
  var cf_adm2_arr_code=process.dimension(function (d){return d.lga_pcode;});
  var cf_adm3_arr=process.dimension(function (d){return d.ward_name;});
  var cf_adm2_arr=process.dimension(function (d){return d.lga_name;});
  var cf_adm1_dep=process.dimension(function (d){return d.state_orig;});
  var cf_adm2_dep=process.dimension(function (d){return d.lga_orig;});
  var cf_reason=process.dimension(function (d){return d.reason_insurg_ind;});
  var cf_location_type=process.dimension(function (d){return d.location_type;});
  var cf=process.dimension(function (d){return d.key;});
  var all=process.groupAll();
  console.log(cf_adm2_arr.top(10));

  //var periode=cf_periode.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );

  var ind=cf_ind.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var adm0=cf_adm0.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var adm1_arr=cf_adm1_arr.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var adm1_dep=cf_adm1_dep.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var adm2_arr=cf_adm2_arr.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var adm3_arr=cf_adm3_arr.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var adm2_arr_code=cf_adm2_arr_code.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var adm2_dep=cf_adm2_dep.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var reason=cf_reason.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var type=cf_location_type.group().reduceSum(function(d) { return d.estimate_Ind_Ward; } );
  var key=cf.group().reduceCount(function(d) { return d.key; } );
  var all=process.groupAll();
  var max_adm2=adm2_arr_code.top(1)[0].value;
  console.log(max_adm2);

  var adm2_color=cf_adm2_dep.group().reduce(
    //add
    function (p,v){++p.count;
                   p.individual+=v.individual; //p.moy_mid=Math.round(p.somme_mid/p.count);
                   p.adm2a=v.adm0;
                   if (p.adm2a == "CMR") {p.color=1;}
                   else {p.color=2};
                   return p;},
    //remove
    function (p,v){--p.count;
                   p.individual-=v.individual; //p.moy_mid=p.count? Math.round(p.somme_mid/p.count):0;
                   p.adm2a=v.adm0;
                    if (p.adm2a == "CMR") {p.color=1;}
                   else {p.color=2};
                   return p;},
    //init
    function (){return {count:0,individual:0, adm2a:0, color:"blue"};}//, moy_def:0, moy_mid:0,  moy_att:0};}
    );

  console.log(adm2_color.top(5));

  var counter=dc.dataCount("#dc-data-count")
	counter
    .dimension(process)
	  .group(all)
    .html({
            some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' ,
            all: 'All records selected. Please click on the graph to apply filters.'
        });


  console.log(adm3_arr.top(5));
  console.log(max_adm2);

  var graph_ward  = dc.rowChart("#ward");
  graph_ward
    .width(250).height(200)
    .dimension(cf_adm3_arr)
    .group(adm3_arr)
    .data(function(group) {
            return group.top(10);
        })
    .colors(d3.scale.category10())
    .ordering(function (d){return -d.value;})
    .elasticX(true)
    .xAxis().ticks(3);

  var graph_type = dc.rowChart("#loc_type");
  graph_type
    .width(250).height(200)
    .dimension(cf_location_type)
    .group(type)
    .colors(d3.scale.category10())
    .ordering(function (d){return -d.value;})
    .elasticX(true)
    .xAxis().ticks(2);

  var graph_reason  = dc.rowChart("#reason");
  graph_reason
    .width(250).height(200)
    .dimension(cf_reason)
    .group(reason)
    .colors(d3.scale.category10())
    .elasticX(true)
    .xAxis().ticks(3);



 var graph_adm2  = dc.rowChart("#Departure_adm2");
  graph_adm2
    .width(250).height(200)
    .dimension(cf_adm2_dep)
    .group(adm2_dep)
    .data(function(group) {
            return group.top(10);
        })
    .colors(d3.scale.category10())
    .label(function (d){return d.key;})
    .ordering(function (d){return -d.value;})
    .elasticX(true)
    .xAxis().ticks(3);



  var graph_dep_adm1  = dc.rowChart("#Departure_adm1");
  graph_dep_adm1
    .width(250).height(200)
    .dimension(cf_adm1_dep)
    .group(adm1_dep)
    .colors(d3.scale.category10())
    .label(function (d){return d.key;})
    .ordering(function (d){return -d.value;})
    .elasticX(true)
    .xAxis().ticks(3);

  var graph_arr_adm1  = dc.rowChart("#Arrival_adm1");
  graph_arr_adm1
    .width(250).height(200)
    .dimension(cf_adm1_arr)
    .group(adm1_dep)
    .colors(d3.scale.category10())
    .label(function (d){return d.key;})
    .ordering(function (d){return -d.value;})
    .elasticX(true)
    .xAxis().ticks(3);

   var map= dc.geoChoroplethChart("#map");
  map
    .width(500).height(450)

    .overlayGeoJson(nga_adm2.features, "Arrondissement", function(d) {return d.properties.ADM2_CODE;})
    .projection(d3.geo.mercator().center([14.6,9]).scale(2300))

    .dimension(cf_adm2_arr_code)
    .group(adm2_arr_code)
    .colors(d3.scale.quantize().range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]))
    .colorDomain([0, max_adm2])
    .colorCalculator(function (d) { return d ? map.colors()(d) : '#f9f9f9'; })



  dc.renderAll();

var projection = d3.geo.mercator()
    .center([14.6,9])
    .scale(2300);

var path = d3.geo.path()
    .projection(projection);

  var colors = d3.scale.quantize()
    .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]);




  var legend = d3.selectAll("#map").select("svg").append("g");

  var legend = d3.select('#legend')
  .append('ul')
    .attr('class', 'list-inline');

var keys = legend.selectAll('li.key')
    .data(colors.range());

keys.enter().append('li')
    .attr('class', 'key')
    .style('border-top-color', String)
    .text(function(d,i) {
        var lala=[0,1,2,3,4,5,6]
        return Math.floor(lala[i]*max_adm2/6);
    });



 var g= d3.selectAll("#map").select("svg").append("g");
  g.selectAll("path")
    .data(lake.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#0868ac')
    .attr("stroke-width",'1px')
    .attr("fill",'#99d8c9')
    .attr("class","arrond")
    .attr("opacity",0.7)//;
    .on("click",function(d){
      transition(d.state_name);});

var g = d3.selectAll("#map").select("svg").append("g");
  g.selectAll("path")
    .data(admin_1.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#000000')
    .attr("stroke-width",'1px')
    .attr("fill",'none')
    .attr("class","depart");

  var g= d3.selectAll("#map").select("svg").append("g");
  g.selectAll("path")
    .data(neighbors.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#000000')
    .attr("stroke-width",'2px')
    .attr("fill",'none')
    .attr("class","arrond");


var mapLabels = d3.selectAll("#map").select("svg").append("g");

mapLabels.selectAll('text')
    .data(label_adm0.features)
    .enter()
    .append("text")
    .attr("x", function(d,i){
                return path.centroid(d)[0]-20;})
    .attr("y", function(d,i){
                return path.centroid(d)[1];})
    .attr("dy", ".55em")
    .attr("class","maplabel")
    .style("font-size","16px")
    .text(function(d,i){
        return d.properties.country;  });

var mapLabels = d3.selectAll("#map").select("svg").append("g");

mapLabels.selectAll('text')
    .data(label_adm1.features)
    .enter()
    .append("text")
    .attr("x", function(d,i){
                return path.centroid(d)[0]-15;})
    .attr("y", function(d,i){
                return path.centroid(d)[1];})
    .attr("dy", ".55em")
    .attr("class","maplabel")
    .style("font-size","12px")
    //.style("text-shadow", "-1px 0 white, 0 1px white,, 1px 0 white,, 0 -1px white,")
    .attr("opacity",0.9)
    .text(function(d,i){
        return d.properties.UID;
    });

  }



