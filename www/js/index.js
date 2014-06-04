var i = 0;
var j = 0;
var frames = ['frame1', 'frame2', 'frame3', 'frame4', 'frame5', 'frame6', 'frame7', 'frame8', 'frame9', 'frame10'];

var frameNum = ['Frame 1', 'Frame 2', 'Frame 3', 'Frame 4', 'Frame 5', 'Frame 6', 'Frame 7', 'Frame 8', 'Frame 9', 'Frame 10'];

var balls = ['Ball 1', 'Ball 2', 'Ball 3'];

var hist = new Array ();

var pinsdown = new Array ();



function confirmEnd () {
	if (confirm("Are you sure you want to end this game? All Progress will be deleted.")) {
			$('#welcome').show();
              $('#gameinfo, #frames, #scores, #home, #next, #frameNum, #details, #back').hide();
              $('#scores li').hide();
              $('input').val('');
              $('.comments').val('');
              
              var currentgame = localStorage.getItem('currentGame');
              console.log(currentgame);
              function deleteGame(tx) {
               		tx.executeSql('DELETE FROM games WHERE created=' + currentgame);
               		tx.executeSql('DELETE FROM frames WHERE gameID=' + currentgame);
               }
               
               function deleteFrames(tx) {
               		
               }
               function errorCB(err) {
					alert("error" + err.code);
				}
			   function successCB() {
               
				}
				var db = openDatabase('TrackPin', '1.0', 'TrackPin', 2 * 1024 * 1024);
					db.transaction(deleteGame, errorCB, successCB);
    }else {
		return false;
	}
}


$('#layout td').on('click', function () {
console.log('this is working!');
                   if ($(this).hasClass('selected')){
                        $(this).find('img').attr('src', "img/dot.png");
                   $(this).removeClass('selected');
                   } else {
                        $(this).addClass('selected');
                        $(this).find('img').attr('src', "img/selected_dot.png");
                   }
             
             });
             
function reset() {
	$('#ball1layout td').find('img').attr('src', 'img/dot.png');
	$('#ball2layout td').find('img').attr('src', 'img/dot.png');
	$('#ball3layout td').find('img').attr('src', 'img/dot.png');
	$('#ball1layout #framelayout').css('opacity', '1');
	$('#ball2layout #framelayout').css('opacity', '1');
	$('#ball3layout #framelayout').css('opacity', '1');
}

$("body").delegate('#trackpin', 'click', function () {
                  $('#welcome').hide();
                  $('#endgame').hide();
                  $('#gameinfo').show();
                  $('#home').show();
			
});

$('#home').on('click', function () {
		if ($('#frames').is(':visible')){
			confirmEnd();
            } else {
            	$('#welcome').show();
              $('#gameinfo, #frames, #scores, #home, #next, #frameNum, #details, #back, #end').hide();
              $('#scores li').hide();
              $('input').val('');
            }
});
              
$('#back').on('click', function () {

			if ($('#framedetails').is(':visible')){
				$('#details').show();
				$('#noresults').show();
				$('#details li').show();
 				$('#framedetails').hide();
 				reset();
			}else if ($('#details').is(':visible')){
			$('#scores').show();
			
 			$('#details').hide();
 			$('#back').hide();
			$('#home').show();
			}

			
			
});

$('#start').on('click', function () {
               i=0;
               j=0;
               $('#welcome').hide();
               $('#gameinfo').hide();
               $('#frames').show();
               $('#home').show();
               $('#next').show();
               $('#frameNum').html(frameNum[i] + ", " + balls[j]);
               $('#frameNum').show();
               
               var alley = $('#alley').val();
               var date = $('#date').val();
               var weight = $('#weight').val();
               var created = $.now();
               
               localStorage.setItem('currentGame', created);
               
               function createGame (tx) {
               		tx.executeSql('INSERT INTO games(created, alley, date, weight) VALUES(?, ?, ?, ?)', [created, alley, date, weight]);
               }
               
               function errorCB(err) {
					alert("error" + err.code);
				}
			   function successCB() {
					alert("success!");
               console.log(localStorage.getItem('currentGame'));
				}
				var db = openDatabase('TrackPin', '1.0', 'TrackPin', 2 * 1024 * 1024);
					db.transaction(createGame, errorCB, successCB);
});

$("body").delegate('#seeScores', 'click', function () {
               $('#welcome').hide();
               $('#gameinfo').hide();
               $('#frames').hide();
               $('#scores').show();
               $('#endgame').hide();
               $('#home').show();
                   
                   
            	
            	
                   var db = openDatabase('TrackPin', '1.0', 'TrackPin', 2 * 1024 * 1024);
                   db.transaction(function (tx) {
                                  tx.executeSql('SELECT * FROM games', [], function (tx, results) {
                                                var len = results.rows.length;
                                                console.log(len);
                                                for (i=0; i < len; i++){
                                                $('#scores ul').append('<li class="game" id="' + results.rows.item(i).created + '"><span class="alley">' + results.rows.item(i).alley + '</span><br><span class="date">' + results.rows.item(i).date + '</span></li>');
                                                }
                                                
                                               
                                                
                                    });
                                  
                                  
                    });


});

var gameid;

$('#scores ul').on('click','li' , function () {
						$('#details li').replaceWith('');
						$('#noresults').replaceWith('');
                      $('#scores').hide();
                      $('#home').hide();
                      $('#back').show();
                      $('#details').show();
                   gameid = $(this).attr('id');
                   console.log(gameid);
                   var db = openDatabase('TrackPin', '1.0', 'TrackPin', 2 * 1024 * 1024);
                   db.transaction(function (tx) {
                                  tx.executeSql('SELECT * FROM frames WHERE gameID= "' + gameid + '"', [], function (tx, results) {
                                                var len = results.rows.length;
                                                
                                                if (len == 0 ) {
                                                	$('#noresults').append('No Frames for this Game');
                                                }
                                                console.log(len);
                                                for (i=0; i < len; i++){
                                                	if (results.rows.item(i).ball1 === null){
														ball1count = '&nbsp;';
													}else {
                                                		var ball1count = results.rows.item(i).ball1.split(',').length;
                                                		var ball2count;
														if (ball1count == 10) {
															ball1count = 'X';
														}
												
														if (results.rows.item(i).ball2 === null){
															ball2count = '&nbsp;';
														}else {
															ball2count = results.rows.item(i).ball2.split(',').length;
														
															if (ball2count == 10) {
																ball2count = 'X';
															}
															if (ball1count + ball2count == 10){
																var ball2count = '&#92;';
															}
														}
													
														if (results.rows.item(i).ball3 === null) {
															ball3count = null;
														}else {
															ball3count = results.rows.item(i).ball3.split(',').length;
															$('#ball3count').show();
														}
												
														
													
                                                	$('#details ul').append('<li class="frame" id="' + results.rows.item(i).frame + '"><span class="framenumber">' + results.rows.item(i).frame + '</span><span class="balls"><span class="ball1count">' + ball1count + '</span> <span class="ball2count">' + ball2count + '</span><span class="ball3count">' + ball3count + '</span></span><br><span class="comment">' + results.rows.item(i).comments + '</span></li>');
                                                	console.log(ball1count);
                                                
                                                	
                                                	
                                                	}
                                                
                                            }
                                    });
                	});
                                  
                                  
});                                  

                   
                
                
$('#details ul').on('click', 'li', function () {
		$('#noresults').hide();
			$('#details li').hide();
		$('#details').hide();
		$('#framedetails').show();
		var frameNo = $(this).attr('id');
		var db = openDatabase('TrackPin', '1.0', 'TrackPin', 2 * 1024 * 1024);
                   db.transaction(function (tx) {
                                  tx.executeSql('SELECT * FROM frames LEFT JOIN games ON frames.gameID=games.created WHERE frames.frame="' + frameNo + '" AND frames.gameID="' + gameid + '"', [], function (tx, results)  {
                                                var len = results.rows.length;
                                                var firstball =results.rows.item(0).ball1;
                                                var ball1pins = firstball.split(',');
                                                var secondball = results.rows.item(0).ball2;
                                                
                                                if (secondball === null) {
                                                	$('#ball2layout #framelayout').css('opacity', '0.6');
                                                	var ball2pins = null;
                                                } else {
                                                
                                                var ball2pins = results.rows.item(0).ball2.split(',');
                                                	
                                                }
                                                console.log(gameid);
                                                console.log(frameNo);
                                                
                                                
                                                
                                                for (i=0; i < len; i++) {
                                                	for (j = 0; j < ball1pins.length; j++){
                                                	if (ball1pins.length == null){
                                                			$('#ball1layout #framelayout').css('opacity : 0.6');
                                                		} else {
                                                		$('#ball1layout #framelayout #' + ball1pins[j]).find('img').attr('src', "img/selected_dot.png");
                                                		}
                                                	}	
                                                	for (k = 0; k < ball2pins.length; k++){
                                                		if (ball2pins.length == null){
                                                			$('#ball2layout #framelayout').css('opacity : 0.6');
                                                		} else {
                                                		$('#ball2layout #framelayout #' + ball2pins[k]).find('img').attr('src', "img/selected_dot.png");
                                                		}
                                                	}
                                                	
                                                	for (l = 0; l < ball3pins.length; l++){
                                                		if (ball3pins.length == null){
                                                			console.log('');
                                                		} else {
                                                			$('#ball3layout #framelayout #' + ball3pins[k]).find('img').attr('src', "img/selected_dot.png");
                                                			$('#ball3layout').show();
                                                		}
                                                	}
                                                	
                                                }
                                    });
                                  
                                  
                    });
                                  
});
		



function resetPins () {
    if ($('#layout td').hasClass('selected')){
        $('#layout td').find('img').attr('src', "img/dot.png");
        $('#layout td').removeClass('selected');
        $('#strike').attr('src', "img/strikeButton.png");
        $('#strike').removeClass('isStrike');
        
    }
    
    pinsdown =[];

}

function getPins() {
	for(p=1; p <= $('#pins #layout td').length; p++){
		if ($('#layout #' + p).hasClass('selected')){
			pinsdown.push($('#' + p).attr('id'));
			
		}
		}
	console.log(pinsdown);

}



$('#strike').on('click', function () {
                if (!$(this).hasClass("isStrike")){
                $('#layout td').addClass('selected');
                $('#layout td').find('img').attr('src', "img/selected_dot.png");
                $(this).attr('src', "img/clearButton.png");
                $(this).addClass("isStrike");
                }
                else {
                $('#layout td').removeClass('selected');
                $('#layout td').find('img').attr('src', "img/dot.png");
                $(this).attr('src', "img/strikeButton.png");
                $(this).removeClass("isStrike");
                }
});

var frame = {ballone: null,balltwo:null, ballthree:null, ball1pins: null, ball2pins: null, ball3pins:null};
var frameID;
var ball1;
var ball2;
var ball3;
var comments;
var gameID;


function createframe (tx) {
    tx.executeSql('INSERT INTO frames(frame, ball1, ball2, ball3, comments, gameID) VALUES(?, ?, ?, ?, ?, ?)', [frameID, ball1, ball2, ball3, comments, gameID]);
}

function errorCB(err) {
    alert("error " + err.code);
}
function successCB() {
	console.log('motherfucker');
}




function nextFrame() {
     $('#strike').show();
     frameID = frameNum[i];
     ball1 = frame.ball1pins;
     ball2 = frame.ball2pins;
     ball3 = frame.ball3pins;
     comments = $('#frameComments').val();
     gameID = localStorage.getItem('currentGame');

        var db = openDatabase('TrackPin', '1.0', 'TrackPin', 2 * 1024 * 1024);
    db.transaction(createframe, errorCB, successCB);
    frame = {ballone: null,balltwo: null,ballthree:null, ball1pins: null, ball2pins: null,ball3pins:null};
    $('.comments').val("");
}


$('#next').on('click', function(){
              getPins();
                var pins = pinsdown.length; //this will be the amount of divs with the class of highlighted pins  and are blue....
              
              
              for(p=0; p <= pinsdown.length; p++){
                if ($('#layout #' + pinsdown[p]).hasClass('selected')) {
                    $('#layout #' + pinsdown[p]).addClass('down');
                }
              }

				console.log(i + ", " + j);
              
              console.log(frameNum[i]);
              console.log(frame.ballone + ", " + frame.balltwo);


              
                if (frame.ballone == null){
                console.log(pins);
                    if(pins == 10 && i < 9){
                        frame.ballone=10;
                        frame.balltwo = 0;
                        frame.ballthree = 0;
                        frame.ball1pins = pinsdown.toString();
                        //toast("strike")// parameter to toast the strike image that will fade in and out
                        nextFrame(); /*this is a function you will call to save the frame in the data base set the frame.ball one and two to null and switch the title to frame two clear the pins etc all that stuff*/
                        resetPins();
                        console.log('you are setting a strike');
                        if ($('#layout td').hasClass('down')) {
                            $('#layout td').removeClass('down');
                        }
                        i++;
                    } else if (pins == 10 && i == 9 ) {
                    		j++;
                    		frame.ballone= 10;
                    		frame.ball1pins = pinsdown.toString();
                    		if ($('#layout td').hasClass('down')) {
                            $('#layout td').removeClass('down');
                        }
                    		resetPins();
                    }else{
              
                        frame.ballone = pins;
                        frame.ball1pins = pinsdown.toString();
                        console.log('you are setting ball 1');
                        $('#strike').hide();
                        resetPins();//remove the blue high light from the pins but stay in the same frame
                        j++;
              
                        }
                                    
                }else{
              		if (i < 9){
                    frame.balltwo = pins;
                    frame.ball2pins = pinsdown.toString();
                    frame.ballthree = 0;
                    nextFrame();
                    j=0;
                    i++;  // increment your frame number make sure the game isnt over and then put what frame it is somewhere....
                    resetPins();
                    if ($('#layout td').hasClass('down')) {
                              $('#layout td').removeClass('down');
                          }
                    } else if (pins == 10 && i == 9){
                    	if (j==1){
                    	j++;
                    	frame.balltwo =10;
                    	frame.ball2pins = pinsdown.toString();
                    	if ($('#layout td').hasClass('down')) {
                              $('#layout td').removeClass('down');
                          }
                          resetPins();
                    	} else if (j==2) {
                    		frame.ballthree = 10;
                    		frame.ball3pins = pinsdown.toString();
                    		nextFrame();
                    		$('#next').replaceWith('<div id="end">End Game</div>');
                    	}
                    }else if (i == 9 && pins < 10){
                    	if (j==1){
                    	frame.balltwo = pins;
                    	frame.ball2pins = pinsdown.toString();
                    	$('#next').replaceWith('<div id="end">End Game</div>');
                    	nextFrame();
                    	if ($('#layout td').hasClass('down')) {
                              $('#layout td').removeClass('down');
                          }
                    	}else if (j == 2) {
                    		frame.ballthree = pins;
                    		frame.ball3pins = pinsdown.toString();
                    		console.log('are we in here?');
                    		$('#next').replaceWith('<div id="end">End Game</div>');
                    		nextFrame();
                    	}
                    	
                    }
                    
            
                          
                }
              
              $('div#frameNum').html(frameNum[i] + ", " + balls[j]);

});
                
$("body").delegate('#end', 'click', function (){

	nextFrame();
	$('#frames').hide();
	$('#frameNum').hide();
	$('#home').hide();
	$('#endgame').show();
});

