<?php
  $host="localhost";
$username="root";
$password="Grech@mp17";
$dbname="odk_prod";
$server = mysql_connect($host, $username, $password);

    $connection = mysql_select_db($dbname, $server);

    $myquery = "select temp.type, temp.period, temp.household, temp.individual,temp.adm0, temp.adm1,temp.adm2 as adm2_dep, gps.ADM2_Name as adm2_name,temp.reason, adm.ADM2_Name as adm2_arr, adm.ADM2_ID, adm.ADM3_Name as adm3_arr, adm.ADM3_ID2 from (SELECT 'IDP' as type,`b3_idp_deplacement_year` AS period,  `b4_hh_idp_year` AS household,  `b5_ind_idp_year` AS individual, 'CMR' AS adm0,  `admin1_deplace` AS adm1,  `b8_admin2_origin_deplace` AS adm2,  `b9_reason_mvt_idp` AS reason,  `b10_other_reason_idp` AS other_reason,  `PARENT_KEY` as parent_key
FROM Cameroon_B2_V6_B_idp_deplacement_repeat
UNION
SELECT 'Refugee' AS type, `c3_ref_deplacement_year` AS period, `c4_hh_ref_year` AS household, `c5_ind_ref_year` AS individual, `c6_admin0_origin_ref` AS adm0, `c7_admin1_origin_ref` AS adm1,`c7_admin1_origin_ref` AS adm2, `c8_reason_mvt_ref` AS reason, `c9_other_reason_ref` AS other_reason, `PARENT_KEY` as parent_key
FROM Cameroon_B2_V6_C_refugee_deplacement_ref
UNION SELECT 'Returnee' AS type, `d3_return_deplacement_year` AS period, `d4_hh_return_year` AS household, `d5_ind_return_year` AS individual, `d6_admin0_origin_returnee` AS adm0, `d7_admin1_origin_returnee` AS adm1, `d8_admin2_origin_returnee` AS adm2, 'Unknown' AS reason, '' AS other_reason, `PARENT_KEY` as parent_key
FROM  Cameroon_B2_V6_D_returnee_deplacement_return) as temp left join GPS_admin2 as gps on temp.adm2=gps.ADM2_ID right join Cameroon_B2_V6 as base on base.KEY=temp.parent_key LEFT JOIN ADM3_Arrondissement as adm ON base.A_location_team_a4_admin3_form = adm.ADM3_ID2";
$query = mysql_query($myquery);

    if ( ! $query ) {
        echo mysql_error();
        die;
    }

    $data = array();

    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }

    echo json_encode($data);

    mysqli_close($con);
?>
