<?php 

	$OBJScore = new OBJScore();
	
	class OBJScore {
		
		function getScore(){
			$sql = 'SELECT * FROM user_score ORDER BY score_score DESC LIMIT 10';
			$res = mysqli_query($GLOBALS['mysqli'], $sql);
			if ( $res == false ) {
	    	return mysqli_error($GLOBALS['mysqli']);
			}
		 	$results = array();
	  	while ($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) {
	    	array_push($results, $row);
	   	}
	 		return $results;			
		}
		
		function insertScore($score_name, $score_score){
			$sql = 'INSERT INTO user_score(score_name, score_score) VALUES ("'.$score_name.'", "'.$score_score.'")';
			$res = mysqli_query($GLOBALS['mysqli'], $sql);
			if($res == false){
				return mysqli_error($GLOBALS['mysqli']);
			}else{
				return "success";
			}
		}
	}
?>