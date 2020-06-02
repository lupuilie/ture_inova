function dateFormat(date) {
	var d = new Date(date);
	var day = (d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate());
	var month = (d.getMonth() < 10) ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1);
	var year = date.getFullYear();
	return year + "-" + month + "-" + day;
}

function formatDateWeek(date, value) {
	var d = new Date(date);
	if (value < 0) {
		d.setDate(d.getDate() - 7)
	}
	if (value > 0) {
		d.setDate(d.getDate() + 7)
	}
	var day = (d.getDate() < 10) ? ("0" + d.getDate()) : (d.getDate());
	var month = (d.getMonth() < 10) ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1);
	var year = date.getFullYear();
	return year + "-" + month + "-" + day;
}

var shifts = {
	getWeekNo: function (inputDate) {
		var tdt = new Date(inputDate.valueOf());
		var dayn = (inputDate.getDay() + 6) % 7;
		tdt.setDate(tdt.getDate() - dayn + 3);
		var firstThursday = tdt.valueOf();
		tdt.setMonth(0, 1);
		if (tdt.getDay() !== 4) {
			tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
		}
		return 1 + Math.ceil((firstThursday - tdt) / 604800000);

	},
	employees: [
		{
			date: '2020-05-10',
			names: 'Daniel &amp; Iulian',
			shift: 3,
			machine: 'SMAG'
		},
		{
			date: '2020-05-10',
			names: 'Gabi &amp; Ovidiu',
			shift: 1,
			machine: 'SMAG'
		},
		{
			date: '2020-05-10',
			names: 'Cristi &amp; Alexandru',
			shift: 2,
			machine: 'SMAG'
		},
		{
			date: '2020-05-10',
			names: 'Andrei &amp; Ilie',
			shift: 2,
			machine: 'HP'
		},
		{
			date: '2020-05-10',
			names: 'Lucian &amp; Andrei',
			shift: 1,
			machine: 'HP'
		}
	],


	shiftAtDate: function (input) {
		var noOfWeek = shifts.getWeekNo(new Date(input));
		//console.log(noOfWeek);

		var all = [];

		//treci prin fiecare schimb
		shifts.employees.forEach(function (shift, index) {
			var initWeek = shifts.getWeekNo(new Date(shift.date));
			all.push(shift);

			if (noOfWeek < initWeek) {
				for (i = initWeek - 1; i >= noOfWeek; i--) {

					var lastEl = (all.length - 1);
					var oldDate = formatDateWeek(new Date(all[lastEl].date), -7);
					var nextShift = all[lastEl].shift;
					if (nextShift == 3) {
						var prevShiftNum = 1
					}
					if (nextShift == 2) {
						if (shift.machine == "HP") {
							var prevShiftNum = 1;
						} else {
							var prevShiftNum = 3;
						}
					}
					if (nextShift == 1) {
						var prevShiftNum = 2
					}

					var prevShift = {
						date: oldDate,
						names: shift.names,
						shift: prevShiftNum,
						machine: shift.machine,
						weekNum: i
					};
					all.push(prevShift);
				}
			}
			if (noOfWeek > initWeek) {
				for (i = initWeek + 1; i <= noOfWeek; i++) {
					var lastEl = (all.length - 1);
					var oldDate = formatDateWeek(new Date(all[lastEl].date), +7);
					var prevShiftNum = all[lastEl].shift;
					if (prevShiftNum == 3) {
						var nextShiftNum = 2
					}
					if (prevShiftNum == 2) {
						var nextShiftNum = 1
					}
					if (prevShiftNum == 1) {
						if (shift.machine == "HP") {
							var nextShiftNum = 2;
						} else {
							var nextShiftNum = 3
						}
					}

					var nextShift = {
						date: oldDate,
						names: shift.names,
						shift: nextShiftNum,
						machine: shift.machine,
						weekNum: i
					};
					all.push(nextShift);
				}
			}
		});

		all.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date)
		});

		// return only for selected date
		if (new Date(shifts.employees[0].date) < new Date(input)) {

			var result = all.slice(0, 5);
			result.forEach(function (el, i) {
				result[i].date = dateFormat(new Date(input));
			})
			return result;
		} else {
			var result = all.slice(all.length - 5, all.length);
			result.forEach(function (el, i) {
				result[i].date = dateFormat(new Date(input));
			})
			return result;
		}

	}
}



$(document).ready(function () {
	$('#datepicker').datepicker({
		format: 'yyyy-mm-dd',
		calendarWeeks: true,
		language: "ro",
		weekStart: 1 // day of the week start. 0 for Sunday - 6 for Saturday
	});
	$('#datepicker').val(dateFormat(new Date()));

	$('#datepicker').change(function () {
		var date = new Date($('#datepicker').val());
		var allDayShifts = shifts.shiftAtDate(dateFormat(date));
		var smag = [];
		var hp = [];
		allDayShifts.forEach(function (e, i) {
			if (e.machine == "SMAG") {
				smag.push(e)
			}
			if (e.machine == "HP") {
				hp.push(e)
			}
		});
		smag.sort(function (a, b) {
			return a.shift - b.shift;
		});
		hp.sort(function (a, b) {
			return a.shift - b.shift;
		});

		if ($("#table tbody tr").length > 0) {
			$("#table tbody tr").remove();
		}

		var markup = "<tr><th scope='row'>1</th><td>" + hp[0].names + "</td><td>" + smag[0].names + "</td></tr>";
		markup += "<tr><th scope='row'>2</th><td>" + hp[1].names + "</td><td>" + smag[1].names + "</td></tr>";
		markup += "<tr><th scope='row'>3</th><td></td><td>" + smag[2].names + "</td></tr>";

		$("#table tbody").append(markup);
		console.log(smag);
		console.log(hp);

	});

	$('#datepicker').trigger("change");
	
	$("#minusweek").click(function () {
		var current = $('#datepicker').val();
		var minusWeek = formatDateWeek(new Date(current), -7);
		$('#datepicker').val(minusWeek);
		$('#datepicker').trigger("change");
		
	});
	$("#plusweek").click(function () {
		var current = $('#datepicker').val();
		var plusWeek = formatDateWeek(new Date(current), +7);
		$('#datepicker').val(plusWeek);
		$('#datepicker').trigger("change");
	});
});
