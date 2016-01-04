<?php
$host="localhost";
$username="root";
$password="Grech@mp17";
$dbname="testdb";

// Conexion
$con=mysqli_connect($host,$username,$password,$dbname);

// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }



$sql="INSERT INTO foot (player,def,mid,att,color,club,country,age)
VALUES
('$_POST[player]','$_POST[def]','$_POST[mid]','$_POST[att]','$_POST[color]','$_POST[club]','$_POST[country]','$_POST[age]')";
echo "</br>";
echo $sql;

if (!mysqli_query($con,$sql))
  {
  die('Error: ' . mysqli_error($con));
  }


echo "1 record added";


mysqli_close($con);
?>
