window.onload = function() {
	var 
		ekansHead = document.getElementById('ekansHead');
		ekansArea = document.getElementById('ekansArea');
		topPos = ekansHead.offsetTop;
		leftPos = ekansHead.offsetLeft;	
		step = 10;
		way = "up";
		what_way = "";
		hc = new Array();	//head coordinates
		pos = new Array();	//head position [x, y]
		i = 0;
		a = 0;				//step counter
		body_num = 3;
		score = 0;
		speed = 150;
		s = 0;
		ah = ekansArea.offsetHeight;
		aw = ekansArea.offsetWidth;		
		body_height = ekansHead.offsetHeight;
		last_chance = true;
		
		$('p.body_counter').text('SCORE:' + score)
			
		function build_body() {
			for ( var c = 1; c <= body_num; c++ ) {                                //
				has_body_item = document.getElementById('ekansBody' + c);
				//kiegésziteni, mivel az uj bodi fixen a bal felső sarokba kerül
				//minimum a new_item -el fedésbe kell igazítani.	
				if (!has_body_item) {
					$('div#ekansArea').append(     
						'<div id="ekansBody' + c + '" class="ekansBody"></div>'         
						);
				}
			}
		}
		function random_coordinates() {				// random koordináták generálása a cél...
													//ami nem egyezhet a kigyó egyetlen elemének koordinátájáway!
		}  											//
		function put_new_item() {
			$('div#ekansArea').append(                 
			'<div id="new_item" class=""></div>'       
			);                                         
		}
		function eat_item(item) {
			build_body();
			item.remove();
		}
		function set_hc() {
			x = ekansHead.offsetTop;
			y = ekansHead.offsetLeft;
			pos = [x, y]	// x = margin top, y = margin left
			hc[i] = pos		// hc[ [x0, y0], [x1, y1], [xN, yN], ]
			i++;
			return hc
		}
		function follow_them(hc, a, body_item, b) {
			bpos = hc[a-b];
			bod_topPos = bpos[0];
			bod_leftPos = bpos[1];
			body_item.style.marginTop = bod_topPos.toString() + "px";
			body_item.style.marginLeft = bod_leftPos.toString() + "px";
		}
		function whereDoIgo(what_way){
			var old_way = way;
			if ( what_way ) { 
				way = what_way;
				} else { way = old_way }
			return way;
		}		
		function letMove(way) {
			hc = set_hc();	// idővel eléggé megtelik ez a fos. célszerű X lépésenként az utolsó Y (a) lépésekkel egy új tömböt létrehozni
			a++;	//de inkább leszarom, de esetleg ha csinálok egy új tömböt, amibe elkezdem lerakni a koordinátákat és mondjuk 20 lépés után átváltok rá??Két tömmb között
			for ( var b = 1; b <= body_num; b++ ) {
				// b counts body items and calls them
				body_item = document.getElementById('ekansBody' + b);
				if ( body_item && hc.length > b ) {
					follow_them(hc, a, body_item, b);
				}
			}	
			new_item = document.getElementById('new_item');
			if ( !new_item ) {
				put_new_item();
			} else {
				head_topPos = ekansHead.offsetTop;
				head_leftPos = ekansHead.offsetLeft;
				new_item = document.getElementById('new_item');
				new_item_topPos = new_item.offsetTop;
				new_item_leftPos = new_item.offsetLeft;
				if ( head_topPos == new_item_topPos && head_leftPos == new_item_leftPos ) {
					body_num++;
					score++;
					eat_item(new_item);
					$('p.body_counter').text('SCORE:' + score);
				}				
			}
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
		function moveUp() {
			if ( topPos > 0 && way == "up") {
				topPos -= step;
				ekansHead.style.marginTop = topPos.toString() + "px";
			} else {
				stop();
				//way = "left";
			}
		}
		function moveDown() {
			var diff =  ( 2 * body_height )
			var over_bottom = ( ah - diff )
			if ( topPos <= over_bottom && way == "down") {
				topPos += step;
				ekansHead.style.marginTop = topPos.toString() + "px";
			} else {
				stop();
				//way = "right";
				}
		}
		function moveLeft() {
			if ( leftPos > 0 && way == "left") {
				leftPos -= step;
				ekansHead.style.marginLeft = leftPos.toString() + "px";
			} else {
				stop();
				//way = "down";
				} 
		}
		function moveRight() {
			var diff = ( 2 * body_height )
			var over_right = ( aw - diff )
			if ( leftPos <= over_right && way == "right") {			
				leftPos += step;
				ekansHead.style.marginLeft = leftPos.toString() + "px";
			} else {
				stop();
				//way = "up";
				} 
		}		
		function go() { 
			build_body();
			way = whereDoIgo(what_way);
			s = setInterval( function() {
				letMove(way)
				}, speed)
		}		
		function start() {
			// start pause restart buttons
			startButton.disabled = true;
			pauseButton.disabled = false;
			restartButton.disabled = false;
			//wayselector buttons ON
			wsb_on()
			if (ekansHead) {
				go();
			}		
		}
		function pause() {
			clearInterval(s);
			// start pause restart buttons
			startButton.disabled = false;
			pauseButton.disabled = true;
			//wayselector buttons
			wsb_off();
		}
		function restart() {
			location.reload();
		}
		function chance() {
			//go();
		}
		function stop() {
			if ( !last_chance ) { 
				clearInterval(s);
				// start pause restart buttons
				startButton.disabled = true;
				pauseButton.disabled = true;
				restartButton.disabled = false;
				//wayselector buttons
				wsb_off();
				alert('Fuckin looooooooooooooser.  Your score: ' + score);			
			} else { chance(); }
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
	
	//wayselector arrows
	document.onkeydown = 
	function(e) {
	//console.log(e.keyCode);
		switch (e.keyCode) {
			case 65:					// a
			whereDoIgo('left');
			break;			
			case 87:					// w
			whereDoIgo('up');
			break;		
			case 68:					// d
			whereDoIgo('right');
			break;		
			case 83:					// s
			whereDoIgo('down');
			break;		
		}
	}
	
};