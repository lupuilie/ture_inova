$(document).ready(function () {
	$('#datepicker').datepicker({
		format: 'yyyy-mm-dd',
		calendarWeeks: true,
		language: "ro",
		weekStart: 1 // day of the week start. 0 for Sunday - 6 for Saturday
	});
	var date = new Date();
	var day = (date.getDate() < 10) ? ("0" + date.getDate()) : (date.getDate());
	var month = (date.getMonth() < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
	var year = date.getFullYear();
	var dateFormat = year + "-" + month + "-" + day;
	//console.log(dateFormat);
	$('#datepicker').val(dateFormat);
	$('#datepicker').trigger("change");
});

$("#minusweek").click(function () {
	var date = new Date($('#datepicker').val());
	var pastDate = date.getDate() - 7;
	date.setDate(pastDate);
	var day = (date.getDate() < 10) ? ("0" + date.getDate()) : (date.getDate());
	var month = (date.getMonth() < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
	var year = date.getFullYear();
	var dateFormat = year + "-" + month + "-" + day;
	//console.log(dateFormat);
	$('#datepicker').val(dateFormat);
	$('#datepicker').trigger("change");
});

$("#plusweek").click(function () {
	var date = new Date($('#datepicker').val());
	var pastDate = date.getDate() + 7;
	date.setDate(pastDate);
	var day = (date.getDate() < 10) ? ("0" + date.getDate()) : (date.getDate());
	var month = (date.getMonth() < 10) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
	var year = date.getFullYear();
	var dateFormat = year + "-" + month + "-" + day;
	//console.log(dateFormat);
	$('#datepicker').val(dateFormat);
	$('#datepicker').trigger("change");
});



function getWeekNr(dt) {
	var tdt = new Date(dt.valueOf());
	var dayn = (dt.getDay() + 6) % 7;
	tdt.setDate(tdt.getDate() - dayn + 3);
	var firstThursday = tdt.valueOf();
	tdt.setMonth(0, 1);
	if (tdt.getDay() !== 4) {
		tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
	}
	return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}
/*
dt = new Date();
console.log(getWeekNr(dt));

dt2 = new Date("2020-05-3");
console.log(getWeekNr(dt2));
*/
var ture = {
	ture_initiale: [
			["d_i", "2020-5-10", 3, "Daniel &amp; Iulian", "S"],
			["g_o", "2020-5-10", 1, "Gabi &amp; Ovidiu", "S"],
			["c_a", "2020-5-10", 2, "Cristi &amp; Alexandru", "S"],
			["a_i", "2020-5-10", 2, "Andrei &amp; Ilie", "HP"],
			["l_a", "2020-5-10", 1, "Lucian &amp; Andrei", "HP"]

		],
	data: function (input, date, show_all) {
		show_all = (show_all) ? true : false;
		date = new Date(date);

		for (i = 0; i <= ture.ture_initiale.length - 1; i++) {
			if (ture.ture_initiale[i][0] == input) {
				var initialW = getWeekNr(new Date(ture.ture_initiale[i][1]));
				var initialS = ture.ture_initiale[i][2];
				var hp = (ture.ture_initiale[i][0] == "a_i" || ture.ture_initiale[i][0] == "l_a") ? true : false;

				if (getWeekNr(date) < initialW) {
					var shift = [];
					var start = initialS;
					var last = null;
					for (i = initialW; i >= getWeekNr(date); i--) {
						//console.log("i=" + i);
						if (!last) {
							//last = start;
							shift.push(initialW, initialS);

							if (initialS == 3) last = 3;
							if (initialS == 2) last = 2;
							if (initialS == 1) last = 1;
						} else {
							if (last == 3) {
								last = 2;
								shift.push(i, 2);


							} else if (last == 2) {
								last = 1
								shift.push(i, 1);
							} else {
								if (hp) {
									last = 2
									shift.push(i, 2);
								} else {
									last = 3
									shift.push(i, 3);
								}
							}
						}
					}
					var atDate = shift.indexOf((getWeekNr(date)));
					return (!show_all) ? shift[atDate + 1] : shift;
				} else {
					var shift = [];
					var start = initialS;
					var last = null;
					for (i = initialW; i <= getWeekNr(date); i++) {
						//console.log("i=" + i);
						if (!last) {
							//last = start;
							shift.push(initialW, initialS);

							if (initialS == 3) last = 3;
							if (initialS == 2) last = 2;
							if (initialS == 1) last = 1;
						} else {
							if (last == 3) {
								last = 2;
								shift.push(i, 2);
							} else if (last == 2) {
								last = 1
								shift.push(i, 1);
							} else {
								if (hp) {
									last = 2
									shift.push(i, 2);
								} else {
									last = 3
									shift.push(i, 3);
								}
							}
						}
					}
					var atDate = shift.indexOf((getWeekNr(date)));
					return (!show_all) ? shift[atDate + 1] : shift;
				}
			}
		}
	} /* /data */
}
//console.log(ture.data("a_i", "2020-05-1",1));
//var schimburi = ture.data("a_i", "2020-05-20");


$('#datepicker').change(function () {
	var nume = [];
	var smag = [];
	var hp = [];
	var datepicker = $(this).val();
	
	// un array separat doar cu prescurtarile
	for (i = 0; i < ture.ture_initiale.length; i++) {
		nume.push(ture.ture_initiale[i][0]);
	}
	
	nume.forEach(schimburi);
	function schimburi(i, index) {
		//console.log(i + " - " + ture.data(i, "2020-05-20") + " - "+ ture.ture_initiale[index][4]);
		if (ture.ture_initiale[index][4] == "S") {
			smag.push([ture.data(i, datepicker), i, ture.ture_initiale[index][3]]);
		}
		if (ture.ture_initiale[index][4] == "HP") {
			hp.push([ture.data(i, datepicker), i, ture.ture_initiale[index][3]]);
		}
	}
	// to have everything sorted
	smag.sort();
	hp.sort();
	
	console.log("Schimb 1 >  HP: " + hp[0][2] + "; SMAG: " + smag[0][2]);
	console.log("Schimb 2 >  HP: " + hp[1][2] + "; SMAG: " + smag[1][2]);
	console.log("Schimb 3 >  HP: ; SMAG: " + smag[2][2]);
	
	// make space for new data
	if($("#table tbody tr").length > 0) {
		$("#table tbody tr").remove();
	}
	
	var markup = "<tr><th scope='row'>1</th><td>" + hp[0][2] + "</td><td>" + smag[0][2] +"</td></tr>";
	markup += "<tr><th scope='row'>2</th><td>" + hp[1][2] + "</td><td>" + smag[1][2] +"</td></tr>";
	markup += "<tr><th scope='row'>3</th><td></td><td>" + smag[2][2] +"</td></tr>";
	
	$("#table tbody").append(markup);
	
});
