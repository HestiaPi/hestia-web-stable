function updateImages(json) {
	//Heating
	if (json.Heating == "ON") {
		$('#heating').attr('src', '/images/led_on.png');
//		$('#heatingset').css('visibility', 'visible');
	} else if (json.Heating == "OFF") {
		$('#heating').attr('src', '/images/led_off.png');
//		$('#heatingset').css('visibility', 'hidden');
	}
	
	//Update DesiredTemp
	$('#temperatureset').html(json.DesiredTemp);

	//Preselect Previously used Boost Timeouts
	$("#heatTime option").filter(function() {
	    return $(this).text() == json.boostTimeH+" minutes";
	}).get(0).selected = true;
	
	$("#waterTime option").filter(function() {
	    return $(this).text() == json.boostTimeW+" minutes";
	}).get(0).selected = true;
	
	//Water
	if (json.Water == "ON") {
		$('#water').attr('src', '/images/led_on.png');
	} else if (json.Water == "OFF") {
		$('#water').attr('src', '/images/led_off.png');
	}
	
	//Heating Boost
	if (json.HeatingBoost == "ON") {
		$('#heatingBoost').attr('src', '/images/on.png');
		if (typeof json.HeatingBoostTime !== "undefined") {
			var timestamp = parseInt(json.HeatingBoostTime);
			var now = new Date().getTime();
			var remaining = Math.round( (timestamp - now) / 1000 / 60 );
			if (remaining < 0)
			{
				checkStatus();
				location.reload();
			}
			if (remaining > 1)
				$('#heatingBoostTime').html(remaining + " minutes");
			else if ((remaining < 1) && (remaining >= 0))
				$('#heatingBoostTime').html("Less than a minute remaining");
			else
				$('#heatingBoostTime').html(remaining + " minute");
		}
	} else if (json.HeatingBoost == "OFF") {
		$('#heatingBoost').attr('src', '/images/off.png');
		$('#heatingBoostTime').html("");
	}
	
	//Water Boost
	if (json.WaterBoost == "ON") {
		$('#waterBoost').attr('src', '/images/on.png');
		var t = json.WaterBoostTime;
		if (typeof json.WaterBoostTime !== "undefined") {
			var timestamp = parseInt(json.WaterBoostTime);
			var now = new Date().getTime();
			var remaining = Math.round( (timestamp - now) / 1000 / 60 );
			if (remaining < 0)
			{
				checkStatus();
				location.reload();
			}
			if (remaining > 1)
				$('#waterBoostTime').html(remaining + " minutes");
			else if ((remaining < 1) && (remaining >= 0))
				$('#waterBoostTime').html("Less than a minute remaining");
			else
				$('#waterBoostTime').html(remaining + " minute");
		}
	} else if (json.WaterBoost == "OFF") {
		$('#waterBoost').attr('src', '/images/off.png');
		$('#waterBoostTime').html("");
	}
}

function checkStatus() {
	$.getJSON("/api/heating/status/", function(json) {
		if(json.Result == "OK") {
			updateImages(json);
		} else {
			alert(json.Message);
		}
	});
	t = setTimeout('checkStatus()', 30000);
}
$(document).ready(checkStatus());

function setupDialog(dialogId, postName, timeId, buttonId) {
    $( dialogId ).dialog({
        autoOpen: false,
        height: 150,
        width: 250,
        modal: true,
        buttons: {
          "Toggle": function() {
        	  $.post("/api/heating/boost/toggle/" + postName +"/time/" + 
        			  $(timeId).val(), function(json) {
      			if (json.Result == "OK") {
      				updateImages(json);
      			} else {
      				$dialog.html("Oops something went wrong");
      			}
      		}, "json");
              $( this ).dialog( "close" );
          },
          "Cancel": function() {
            $( this ).dialog( "close" );
          }
        },
        close: function() {
          //$(timeId).val( "60" );//commented out in order to leave last boost time preselected
        }
      });
	
	$(buttonId).click(function() {
		if ($(buttonId).attr('src') == '/images/on.png') {
			$(timeId).prop('disabled', true);

      	  $.post("/api/heating/boost/toggle/" + postName +"/time/" + 
    			  $(timeId).val(), function(json) {
  			if (json.Result == "OK") {
  				updateImages(json);
  			} else {
  				$dialog.html("Oops something went wrong");
  			}
  		}, "json");
          $( this ).dialog( "close" );
			
			
		} else if ($(buttonId).attr('src') == '/images/off.png') {
			$(timeId).prop('disabled', false);
			$( dialogId ).dialog( "open" );
		}		
	});
}

function setupButton(buttonId) {	
	$(buttonId).click(function() {
		if ($(buttonId).attr('src') == '/images/minus.png') {
			$('#temperatureset').html((parseFloat($('#temperatureset').text())-0.5).toString());
			//call decDesiredTemp($time)
			//$.post("/api/heating/boost/toggle/decdesiredtemp", function(json) { $('#temperatureset').html((parseFloat($('#temperatureset').text())-0.5).toString()); }, "json");
			$.post("/api/heating/boost/toggle/decdesiredtemp", function(json) {}, "json");
		} else if ($(buttonId).attr('src') == '/images/plus.png') {
			$('#temperatureset').html((parseFloat($('#temperatureset').text())+0.5).toString());
			//call incDesiredTemp($time);
			//$.post("/api/heating/boost/toggle/incdesiredtemp", function(json) { $('#temperatureset').html((parseFloat($('#temperatureset').text())+0.5).toString()); }, "json");
			$.post("/api/heating/boost/toggle/incdesiredtemp", function(json) {}, "json");
		}
	});
}

$(document).ready(function() {
	setupDialog("#heating-boost-dialog", "heating", "#heatTime", "#heatingBoost");
	setupDialog("#water-boost-dialog", "water", "#waterTime", "#waterBoost");
	setupButton("#setminus");
	setupButton("#setplus");
});