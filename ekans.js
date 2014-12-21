window.onload = function() {
	// BUG: IE-ben nem működik...
		var 
		// Mindegy milyen szélességet és magasságot állítok be a pályának, a lényeg, hogy 10-el osztható legyen.	
		ah = ekansArea.offsetHeight;
		aw = ekansArea.offsetWidth;
		body_height = ekansHead.offsetHeight;	
		ekansHead = document.getElementById('ekansHead');
		ekansArea = document.getElementById('ekansArea');
		head_topPos = ekansHead.offsetTop;	// a kigyó fejének margintop-ja
		head_leftPos = ekansHead.offsetLeft;	// a kigyó fejének marginleft-je
		step = body_height;						// 10px-es lépésközökben mozog a hüllő
		state = "stopped"
		way = "right";
		old_way = "";
		hc = new Array();	//head coordinates
		pos = new Array();	//head position [x, y]
		i = 0;				//step counter
		body_num = 3;
		all_score = 0;
		score = 0;
		score_at_level_up = 0;
		level = 1;
		mistake = 0;
		s = 0;
		sl = score_limit()
		speed = 70;
		all_coords = ekansArea_coords();	// all coordinates of ekansArea
		write_msg();
		
		function write_msg() {
			$('p.msg').text('SCORE: ' + all_score + ' | LEVEL: ' + level + ' | MISTAKE: ' + mistake);		
		}	
		function build_body() {
			for ( var c = 1; c <= body_num; c++ ) {
				has_body_item = document.getElementById('ekansBody' + c);
				if (!has_body_item) {
					$('div#ekansArea').append(     
						'<div id="ekansBody' + c + '" class="ekansBody" style="margin-top:' + head_topPos + 'px; margin-left:' + head_leftPos + 'px;"></div>'         
						);
				}
			}		
		}
		function remove_elements() {
			for ( var c = 1; c <= body_num; c++ ) {
				body_item = document.getElementById('ekansBody' + c);
				if ( body_item ) {
					body_item.remove()
				}
			}
			bonus_item = document.getElementById('bonus_item');
			if ( bonus_item ) {
				bonus_item.remove()
			}
		}
		//get all coords;
		function ekansArea_coords() {
			var all_coords = new Array();
			var x_y = new Array();
			var num_x = ( ah - body_height );
			var num_y = ( aw - body_height );
			for ( var cx = 0; cx <= num_x; cx++) {
				for ( var cy = 0; cy <= num_y; cy++ ) {
					if ( cx % body_height == 0 && cy % body_height == 0) {
						all_coords[all_coords.length] = [cx, cy];
					}
				}
			}
			return all_coords;
		}
		// adott tömb utolsó x eleme
		function last_x_elem_of_array( array, max ) {
			var last_x_elems = []
			for ( var i = 1; i <= max; i++ ) {
				last_i = array.length - i
				last_x_elems[last_x_elems.length] = ( array[ last_i] );
			}
			return last_x_elems;
		}
		//a bonus_item nem eshet egybe a kígyó egyetlen elemével sem
		function validation_coord(x_y) {
				if ( hc.length >= body_num + 1) {
					max = body_num + 1 
					used_coords = last_x_elem_of_array( hc, max )
					for ( var i = 0; i < used_coords.length; i++ ) {
						if ( used_coords[i][0] == x_y[0] && used_coords[i][1] == x_y[1] ) {
							return false;
						}  
					}					
				}
			return true;
		}
		// random numbers | 0 - all_coords.length
		function random_nums() {
			var max = all_coords.length + 1;
			return Math.floor(Math.random() * max) 
		}		
		function put_bonus_item() {
			var rn = random_nums();
			var x_y = all_coords[rn]
			if ( !validation_coord(x_y) ) { 
				put_bonus_item(); 
			} else {
				$('div#ekansArea').append(
				'<div id="bonus_item" style="margin-top:' + x_y[0] + 'px; margin-left:' + x_y[1] + 'px;"></div>'
				);
			}
		}
		function eat_item(item) {
			build_body();
			// BUG: a Chrome kivételével, a böngészők nem szeretik a remove() methodust.
			item.remove();
		}
		function canibalizm() {
		//nemsoka
		return true;
		}	
		function set_hc() {
			// TODO: a tömb hosszát maximalizálni kell, kb body_num + 10 -re
			x = ekansHead.offsetTop;
			y = ekansHead.offsetLeft;
			pos = [x, y]	// x = margin top, y = margin left
			hc[i] = pos		// hc[ [x0, y0], [x1, y1], [xN, yN], ]
			i++;
			// reset hc, reset i
			var limit = 100;
			var hc_max_size = body_num + limit + 1;	// +1: snake head!!
			if ( i == hc_max_size ) {
				hc.splice( 0, limit )
				i -= limit ;
			}
			return hc
		}
		function follow_them(hc, i, body_item, b) {
			bpos = hc[i-b];
			bod_topPos = bpos[0];
			bod_leftPos = bpos[1];
			body_item.style.marginTop = bod_topPos.toString() + "px";
			body_item.style.marginLeft = bod_leftPos.toString() + "px";
		}
		function whereDoIgo(what_way){
			old_way = way;
			if ( what_way ) {
				if ( what_way == "right" &&  old_way == "left" || what_way == "left" &&  old_way == "right" || what_way == "up" &&  old_way == "down" || what_way == "down" &&  old_way == "up") { 
					way = old_way; 
					} else {
						way = what_way;
					}
				} else { way = old_way; }
			return way;
		}
		function letMove(way) {
			hc = set_hc();
			for ( var b = 1; b <= body_num; b++ ) {
				// b counts body items and calls them
				body_item = document.getElementById('ekansBody' + b);
				if ( body_item && hc.length > b ) {
					follow_them(hc, i, body_item, b);
				}
			}
			// TODO: több bonusz kezelésére felkészíteni
			bonus_item = document.getElementById('bonus_item');
			if ( !bonus_item ) {
				put_bonus_item();
			} else {
				bonus_item = document.getElementById('bonus_item');
				bonus_item_topPos = bonus_item.offsetTop;
				bonus_item_leftPos = bonus_item.offsetLeft;
				if ( head_topPos == bonus_item_topPos && head_leftPos == bonus_item_leftPos ) {
					body_num++;
					score++;
					all_score = zero_score() + score;
					eat_item( bonus_item );
					write_msg();
					sl = score_limit();
					if ( all_score == sl ) {
						level_up();
					}
				}				
			}
			if ( state == "started" ) {
				switch (way) {
					case "up":
					moveUp();
					break;
					case "down":
					moveDown();
					break;
					case "left":
					moveLeft();
					break;
					case "right":
					moveRight();
					break;
				}
			}			
		}
		function moveUp() {
			canibalizm_no = canibalizm();
			if ( head_topPos > 0 && way == "up" && canibalizm_no ) {
				head_topPos -= step;
				ekansHead.style.marginTop = head_topPos.toString() + "px";
			} else {
				stop();
			}
		}
		function moveDown() {
			canibalizm_no = canibalizm();
			var over_bottom = ( ah - body_height )
			if ( head_topPos < over_bottom && way == "down" && canibalizm_no ) {
				head_topPos += step;
				ekansHead.style.marginTop = head_topPos.toString() + "px";
			} else {
				stop();
				}
		}
		function moveLeft() {
			canibalizm_no = canibalizm();
			if ( head_leftPos > 0 && way == "left" && canibalizm_no ) {
				head_leftPos -= step;
				ekansHead.style.marginLeft = head_leftPos.toString() + "px";
			} else {
				stop();
				} 
		}
		function moveRight() {
			canibalizm_no = canibalizm();
			var over_right = ( aw - body_height )
			if ( head_leftPos < over_right && way == "right" && canibalizm_no ) {			
				head_leftPos += step;
				ekansHead.style.marginLeft = head_leftPos.toString() + "px";
			} else {
				stop();
				} 
		}		
		function go() {
			if ( state == "started" ) {
				build_body();		
				way = whereDoIgo(way);
				s = setInterval( function() {
					letMove(way);
					}, speed)
			}
		}		
		function start() {
			state = "started"
			// start pause restart buttons
			startButton.disabled = true;
			pauseButton.disabled = false;
			restartButton.disabled = true;
			//wayselector buttons ON
			wsb_on()
			if ( ekansHead ) {
				go();
			}		
		}
		function pause() {
			state = "stopped"
			clearInterval(s);
			// start pause restart buttons
			startButton.disabled = false;
			pauseButton.disabled = true;
			//wayselector buttons OFF
			wsb_off();
		}
		function zero_score() {
			zero_score_on_level = ( 0 + ((level-1) * 1000));
			return zero_score_on_level;
		}
		function score_limit() {
			sl = zero_score() + score_at_level_up + 150;
			return sl;
		}
		function restart() {
			state = "stopped"
			clearInterval(s);
			remove_elements();
			ekansHead.style.marginTop = "0px";
			ekansHead.style.marginLeft = "0px";
			head_topPos = 0;
			head_leftPos = 0;			
			hc = new Array();
			pos = new Array();
			i = 0;
			body_num = 3;
			way = "right";
			all_score = score + zero_score();
			write_msg();
			startButton.disabled = false;
			pauseButton.disabled = true;
			restartButton.disabled = true;
			}
		function stop() {
			clearInterval(s);						// Game Over elött van egy lépésnyi esély
			if ( old_way != way ) {					// új útirányt megadni.
				canibalizm_no = true;
				go();
			} else {
			state = "stopped";
			alert('GAME OVER!  Your score: ' + all_score);
			score_at_level_up = 0;
			score = 0;
			all_score = zero_score();
			mistake++;
			// start pause restart buttons
			startButton.disabled = true;
			pauseButton.disabled = true;
			restartButton.disabled = false;
			//wayselector buttons
			wsb_off();
			}
		}
		function level_up() {
			score_at_level_up = score;
			level++;
			alert('Új szintre léptél: ' + level)
			restart();
		}
		//wayselector buttons OFF
		function wsb_off() {
			turnUp.disabled = true;
			turnDown.disabled = true;
			turnLeft.disabled = true;
			turnRight.disabled = true;
		}
		//wayselector buttons ON		
		function wsb_on() {
			turnUp.disabled = false;
			turnDown.disabled = false;
			turnLeft.disabled = false;
			turnRight.disabled = false;
		}
	// start pause restart buttons	
	pauseButton.disabled = true;		
	restartButton.disabled = true;		
	startButton.onclick = function() { start(); }
	restartButton.onclick = function() { restart(); }
	pauseButton.onclick = function() { pause(); }
	
	//wayselector buttons
	wsb_off();
	
	turnUp.onclick = function() { whereDoIgo('up'); }
	turnDown.onclick = function() { whereDoIgo('down'); }
	turnLeft.onclick = function() { whereDoIgo('left'); }
	turnRight.onclick = function() { whereDoIgo('right'); }
	
//wayselector wasd
	document.onkeydown = 
	function(e) {
		//console.log(e.keyCode);
		// TODO: space to pause
		if ( state == 'started' ) {
			switch (e.keyCode) {
				case 65:					// a
				what_way = whereDoIgo('left');
				break;			
				case 87:					// w
				what_way = whereDoIgo('up');
				break;		
				case 68:					// d
				what_way = whereDoIgo('right');
				break;		
				case 83:					// s
				what_way = whereDoIgo('down');
				break;		
			}
		}
	}	
};