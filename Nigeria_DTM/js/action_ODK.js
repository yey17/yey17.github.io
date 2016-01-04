var action = function(data)
{
  //data.forEach(function (d){d.mm=10* Math.floor(d.mid/10);});

  var process=crossfilter(data);
  var cf_periode=process.dimension(function (d){return d.B3_IDP_DEPLACEMENT_YEAR;});
  var cf_hh=process.dimension(function (d){return d.B4_HH_IDP_YEAR;});
  var cf_ind=process.dimension(function (d){return d.B5_IND_IDP_YEAR;});
  var cf_location=process.dimension(function (d){return d.B6_IDP_LOCALISATION_YEAR;});
  var cf_adm1=process.dimension(function (d){return d.B7_ADMIN1_ORIGIN_DEPLACE;});
  var cf_adm2=process.dimension(function (d){return d.B8_ADMIN2_ORIGIN_DEPLACE;});
  var cf_reason=process.dimension(function (d){return d.B9_REASON_MVT_IDP;});
  var all=process.groupAll();
  console.log(cf_adm2.top(10));

  var periode=cf_periode.group().reduceSum(function(d) { return d.B5_IND_IDP_YEAR; } );
  var hh=cf_hh.group().reduceSum(function(d) { return d.B5_IND_IDP_YEAR; } );
  var ind=cf_ind.group().reduceSum(function(d) { return d.B5_IND_IDP_YEAR; } );
  var location=cf_location.group().reduceSum(function(d) { return d.B5_IND_IDP_YEAR; } );
  var adm1=cf_adm1.group().reduceSum(function(d) { return d.B5_IND_IDP_YEAR; } );
  var adm2=cf_adm2.group().reduceSum(function(d) { return d.B5_IND_IDP_YEAR; } );
  var reason=cf_reason.group().reduceSum(function(d) { return d.B5_IND_IDP_YEAR; } );
  var all=process.groupAll();
  var max_adm1=adm1.top(1)[0].value;

  dc.numberDisplay("#dc-data-count")
	.dimension(ind)
	.group(all);

  console.log(adm1.top(5));
  var graph_time = dc.pieChart("#time");
  graph_time
    .width(150).height(150)
    .dimension(cf_periode)
    .group(periode);
    /*.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5));*/

  var graph_reason  = dc.pieChart("#reason");
  graph_reason
    .width(150).height(150)
    .dimension(cf_reason)
    .group(reason);


 var graph_adm2  = dc.rowChart("#adm2");
  graph_adm2
    .width(250).height(300)
    .dimension(cf_location)
    .group(location)
    .elasticX(true);
   // .ordering(function (d){return -d.key;});
   // .xAxis().ticks(max_all);


   var map= dc.geoChoroplethChart("#map");
  map
    .width(600).height(600)

    //.overlayGeoJson(regions.features, "Pays", function(d) {return d.properties.NAME_REF;})
    .overlayGeoJson(admin_1.features, "Pays", function(d) {return d.properties.ADM1_CODE;})
    .projection(d3.geo.mercator().center([25,10]).scale(1000))
    .dimension(cf_adm1)
    .group(adm1)
    .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
    .colorDomain([0, max_adm1])
    .colorCalculator(function (d) { return d ? map.colors()(d) : '#ccc'; })
    //.colorDomain([0, max_adm1])
    //.colors(['#ccc', 'blue','red','yellow'])
    //.colors(['grey', 'blue'])
    //.colorDomain([0, max_country])
    /*.colorAccessor(function (d,i) {
            if(d>0){
                console.log(d);
                return d.value;
            } else {
                return 0;
            }
        })*/

  dc.renderAll();
}

function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

