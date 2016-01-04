var action = function(data)
{
  //data.forEach(function (d){d.mm=10* Math.floor(d.mid/10);});

  var process=crossfilter(data);
  var cf_periode=process.dimension(function (d){return d.period;});
  var cf_hh=process.dimension(function (d){return d.household;});
  var cf_ind=process.dimension(function (d){return d.individual;});
  var cf_adm0=process.dimension(function (d){return d.adm0;});
  var cf_adm1=process.dimension(function (d){return d.adm1;});
  var cf_adm2_arr=process.dimension(function (d){return d.adm2_arr;});
  var cf_adm3_arr=process.dimension(function (d){return d.ADM3_ID2;});
  var cf_adm3_arr_name=process.dimension(function (d){return d.adm3_arr;});
  var cf_adm2_dep=process.dimension(function (d){return d.adm2_name;});
  var cf_reason=process.dimension(function (d){return d.reason;});
  var cf_type=process.dimension(function (d){return d.type;});
  var cf=process.dimension(function (d){return d.key;});
  var all=process.groupAll();
  console.log(cf_adm2_arr.top(10));

  var periode=cf_periode.group().reduceSum(function(d) { return d.individual; } );
  var hh=cf_hh.group().reduceSum(function(d) { return d.individual; } );
  var ind=cf_ind.group().reduceSum(function(d) { return d.individual; } );
  var adm0=cf_adm0.group().reduceSum(function(d) { return d.individual; } );
  var adm1=cf_adm1.group().reduceSum(function(d) { return d.individual; } );
  var adm2_arr=cf_adm2_arr.group().reduceSum(function(d) { return d.individual; } );
  var adm3_arr=cf_adm3_arr.group().reduceSum(function(d) { return d.individual; } );
  var adm3_arr_name=cf_adm3_arr_name.group().reduceSum(function(d) { return d.individual; } );
  var adm2_dep=cf_adm2_dep.group().reduceSum(function(d) { return d.individual; } );
  var reason=cf_reason.group().reduceSum(function(d) { return d.individual; } );
  var type=cf_type.group().reduceSum(function(d) { return d.individual; } );
  var key=cf.group().reduceCount(function(d) { return d.key; } );
  var all=process.groupAll();
  var max_adm3=adm3_arr.top(1)[0].value;
  console.log(max_adm3);

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
  console.log(max_adm3);
  var graph_time = dc.rowChart("#time");
  graph_time
    .width(250).height(200)
    .dimension(cf_periode)
    .group(periode)
    .colors(['#ffff99','#fecc5c','#fd8d3c','#f03b20','#bd0026'])
    .colorDomain([1,5])
    .colorAccessor(function(d, i){return i%5+1;})
    .elasticX(true)
    .xAxis().ticks(3);
    /*.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5));*/

  var graph_reason  = dc.rowChart("#reason");
  graph_reason
    .width(250).height(200)
    .dimension(cf_reason)
    .group(reason)
    .colors(['#bd0026','#2b8cbe','#cccccc','#fecc5c'])
    .colorDomain([1,4])
    .colorAccessor(function(d, i){return i%4+1;})
    .elasticX(true)
    .xAxis().ticks(3);

 var graph_type  = dc.rowChart("#type");
  graph_type
    .width(250).height(200)
    .dimension(cf_type)
    .group(type)
    .colors(['#2b8cbe','#feb24c','#a6d854'])
    .colorDomain([1,4])
    .colorAccessor(function(d, i){return i%3+1;})
    .ordering(function (d){return -d.value;})
    .elasticX(true)
    .xAxis().ticks(3);

 var graph_adm2  = dc.rowChart("#adm2");
  graph_adm2
    .width(250).height(200)
    .dimension(cf_adm2_dep)
    .group(adm2_dep)
    .data(function(group) {
            return group.top(5);
        })
    .colors(d3.scale.category10())
    .label(function (d){return d.key;})
    .ordering(function (d){return -d.value;})
    .elasticX(true)
    .xAxis().ticks(3);
   // .xAxis().ticks(max_all);


  /*var tab  = dc.dataTable("#tableau");
  tab
    .width(250).height(300)
    .dimension(cf_adm3_arr_name)
    .group(function(d){return d.adm3_arr})
    .columns(['household','individual','period','type','reason','adm0'])

     .on('renderlet', function (table) {
            //table.selectAll('tr.dc-table-row').style('line-width','2px)
            table.selectAll('tr.dc-table-row').style('background-color', function(d) {
        return d.color;})})
    .size(13);*/

   var map= dc.geoChoroplethChart("#map");
  map
    .width(600).height(450)
    //.overlayGeoJson(regions.features, "Pays", function(d) {return d.properties.NAME_REF;})
    .overlayGeoJson(admin_3.features, "Arrondissement", function(d) {return d.properties.ADM3_ID2;})
    .projection(d3.geo.mercator().center([16.5,11.5]).scale(7000))
    //.projection(d3.geo.mercator().center([20,8]).scale(2000))
    .dimension(cf_adm3_arr)
    .group(adm3_arr)
    .colors(d3.scale.quantize().range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"]))
    .colorDomain([0, max_adm3])
    .colorCalculator(function (d) { return d ? map.colors()(d) : '#f9f9f9'; })



  dc.renderAll();

var projection = d3.geo.mercator()
    .center([16.5,11.5])
    .scale(7000);

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
        return lala[i]*max_adm3/6;
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
    .attr("class","arrond");


var g = d3.selectAll("#map").select("svg").append("g");
  g.selectAll("path")
    .data(admin_2.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#000000')
    .attr("stroke-width",'2px')
    .attr("fill",'none')
    .attr("class","depart");


 var g= d3.selectAll("#map").select("svg").append("g");
  g.selectAll("path")
    .data(admin_3.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#000000')
    .attr("stroke-width",'1px')
    .attr("fill",'none')
    .attr("class","arrond");

   var g= d3.selectAll("#map").select("svg").append("g");
  g.selectAll("path")
    .data(admin_0.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#000000')
    .attr("stroke-width",'3px')
    .attr("fill",'none')
    .attr("class","arrond");

  var g= d3.selectAll("#map").select("svg").append("g");
  g.selectAll("path")
    .data(lake.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke",'#99d8c9')
    .attr("stroke-width",'1px')
    .attr("fill",'#99d8c9')
    .attr("class","arrond");



var mapLabels = d3.selectAll("#map").select("svg").append("g");

mapLabels.selectAll('text')
    .data(label.features)
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
    .data(label_adm2.features)
    .enter()
    .append("text")
    .attr("x", function(d,i){
                return path.centroid(d)[0]-20;})
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
function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

