var action = function(data)
{
  //data.forEach(function (d){d.mm=10* Math.floor(d.mid/10);});

  var process=crossfilter(data);
  var cf_idp=process.dimension(function (d){return d.B_IDP_B2_IND_IDP;});
  var cf_refugie=process.dimension(function (d){return d.C_REFUGEE_C2_IND_REF;});
  var cf_retourne=process.dimension(function (d){return d.D_RETURNEE_D2_IND_RETURN;});
  var cf_deplace=process.dimension(function (d){return d.E_LOCAUX_DEPLACES_E2_IND_LOCAL_DEP;});
  var cf_adm2=process.dimension(function (d){return d.A_LOCATION_TEAM_A3_ADMIN2_FORM;});
  var cf_logement=process.dimension(function (d){return d.logement;});
  var all=process.groupAll();
  console.log(cf_adm2.top(10));

  var idp=cf_adm2.group().reduceSum(function(d) { return d.B_IDP_B2_IND_IDP;} );
  var refugie=cf_adm2.group().reduceSum(function(d) { return d.C_REFUGEE_C2_IND_REF;} );
  var retourne=cf_adm2.group().reduceSum(function(d) { return d.D_RETURNEE_D2_IND_RETURN;} );
  var deplace=cf_adm2.group().reduceSum(function(d) { return d.E_LOCAUX_DEPLACES_E2_IND_LOCAL_DEP;} );
  var adm2=cf_adm2.group().reduceCount();
  var logement=cf_adm2.group().reduceCount();
  var all=process.groupAll();
  var max_adm2=adm2.top(1)[0].value;


   speedSumGroup       = cf_adm2.group().reduce(function(p, v) {
                  p[v.Expt] = (p[v.Expt] || 0);
                  return p;
              }, function(p, v) {
                  p[v.Expt] = (p[v.Expt] || 0) ;
                  return p;
              }, function() {
                  return {};
              });

  function regroup(dim, cols) {
    var _groupAll = dim.groupAll().reduce(
        function(p, v) { // add
            cols.forEach(function(c) {
                p[c] += v[c];
            });
            return p;
        },
        function(p, v) { // remove
            cols.forEach(function(c) {
                p[c] -= v[c];
            });
            return p;
        },
        function() { // init
            var p = {};
            cols.forEach(function(c) {
                p[c] = 0;
            });
            return p;
        });
    return {
        all: function() {
            // or _.pairs, anything to turn the object into an array
            return d3.map(_groupAll.value()).entries();
        }
    };
}

  var otherView= regroup(cf_adm2, ['B_IDP_B2_IND_IDP', 'C_REFUGEE_C2_IND_REF', 'D_RETURNEE_D2_IND_RETURN', 'E_LOCAUX_DEPLACES_E2_IND_LOCAL_DEP']);

  dc.numberDisplay("#dc-data-count")
	.dimension(process)
	.group(all);

  console.log(adm2.top(5));
  var graph_idp = dc.rowChart("#idp");
  graph_idp
    .width(200).height(200)
    .dimension(cf_idp)
    .group(idp);
    /*.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5));*/

  var graph_ref  = dc.rowChart("#ref");
  graph_ref
    .width(200).height(200)
    .dimension(cf_refugie)
    .group(refugie);


 var graph_ret  = dc.rowChart("#ret");
  graph_ret
    .width(200).height(200)
    .dimension(cf_retourne)
    .group(retourne)
    .elasticX(true);
   // .ordering(function (d){return -d.key;});
   // .xAxis().ticks(max_all);

  var graph_depl  = dc.rowChart("#depl");
  graph_depl
    .width(200).height(200)
    .dimension(cf_deplace)
    .group(deplace);


  var graph_type  = dc.rowChart("#type");
  graph_type
    .width(300).height(150)
    .dimension(cf_adm2)
    .group(otherView)
    .elasticX(true)
    .ordering(function (d){return -d.key;});

   var map= dc.geoChoroplethChart("#map");
  map
    .width(600).height(600)

    //..overlayGeoJson(admin_3.features, "Arrondissement", function(d) {return d.properties.ADM3_ID2;})
    .overlayGeoJson(admin_2.features, "Departement", function(d) {return d.properties.ADM2_ID;})
    .projection(d3.geo.mercator().center([20,6]).scale(2000))
    .dimension(cf_adm2)
    .group(adm2)
    .colorDomain([0, max_adm2])
    //.colors(['#ccc', 'blue','red','yellow'])
    .colors(['grey', 'blue'])
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

