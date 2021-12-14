<?php 

	include('function/Object.php');
	
	/* cryption */
	if (isset($_POST['cryption'])) {
		parse_str($_POST['cryption'], $result); // (da serialize ad array)
		if (!isset($result)) {
			exit("failure");
		}
		// possibilita' di usare post o get:
		$_POST = $result;
		$_GET = $result;
	}

	if(isset($_GET['type']) && ($_GET['type'] == "submitScore")) {
		
		$score_name = trim(addslashes(preg_replace("/[<>]+/", "", $_GET['userName'])));
		$score_score = preg_replace("/[^0-9-]+/", "", $_GET['score']);

		
		$all['success'] = $OBJScore->insertScore(addslashes($score_name), $score_score);
		echo json_encode($all);
	}elseif(isset($_GET['type']) && ($_GET['type'] == "getTopTen")) {
		
		$all_users = $OBJScore->getScore();
		$topten = NULL;
		//$all['arr_topten'] = array();
		if(count($all_users) > 0 ){
			$count = 1;
			foreach($all_users as $one_user){
				$score_name = $one_user['score_name'];
				$score_score = $one_user['score_score'];
				//$all['arr_topten'][$count]['score_name'] = $count." ".htmlentities($score_name):
				//$all['arr_topten'][$count]['score_name'] = $score_score." Point".PHP_EOL;
				
				$topten.= $count." ".$score_name."\t\t\t".$score_score." Point".PHP_EOL;
				$count++;
			}
		}
		

		$all['topten'] = $topten;
		echo json_encode($all);
	}

	
?>