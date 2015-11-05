var UTILS = (function () {
	// Constants
	var GB_to_TB = 0.001; // Used in MiB_to_GB to GB_to_TB conversion
	var MiB_to_GB = 0.001048576; // From MiB to MiB_to_GB
	var MiB_to_MB = 1.048576; // From Mib to MiB_to_MB


	/**** AUTH CYCLE ****/
	function updateAuthProgress(msg) {
		var w = parseInt($('#authProgressBar')[0].style.width.slice(0, -1));
		$('#authProgressBar').width(w + 24 + '%');
		$('#authProgressBar').text(msg);

		if ($('#authProgressBar')[0].style.width.slice(0, -1) > 100) {
			$('#pageLoading').fadeOut();
			//$('#pageDashboard').fadeIn().removeClass('hidden');
		}
	}

	function showAuthError(funcname, msg) {
		$('#authError').fadeIn().removeClass('hidden');
		$('#authError').append("<p><code>" + funcname + ": " + JSON.stringify(msg, undefined, 2) + "</code></p>");
	}

	function showAuthInfo(funcname, msg) {
		$('#authInfo').fadeIn().removeClass('hidden');
		$('#authInfo').append("<li style='padding-left: 10px;' class='text-bold'>" + funcname + ":&nbsp;&nbsp;&nbsp;<code class='text-muted'>" + JSON.stringify(msg, undefined, 2) + "</code></li>");
	}

	function alertError(title, message) {
		$('#modalErrorAlert').find('#title').html(title);
		$('#modalErrorAlert').find('#message').html(message);
		$('#modalErrorAlert').modal('show');
	}

	function alertInfo(title, message) {
		$('#modalInfoAlert').find('#title').html(title);
		$('#modalInfoAlert').find('#message').html(message);
		$('#modalInfoAlert').modal('show');
	}

	function secToTime(totalSec) {
		var hours = parseInt(totalSec / 3600) % 24;
		var minutes = parseInt(totalSec / 60) % 60;
		var seconds = (totalSec % 60).toFixed();
		return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);

	}
	function two(x) {
		return ((x > 9) ? "" : "0") + x
	}

	function secToTimeAndDays(totalSec) {
		var minutes = Math.floor(totalSec / 60)
		var seconds = (totalSec % 60).toFixed()
		var t = two(seconds)

		var hours = Math.floor(minutes / 60)
		minutes = minutes % 60
		t = two(minutes) + ":" + t

		var days = Math.floor(hours / 60)
		hours = hours % 60
		t = two(hours) + ":" + t

		if (days > 0) {
			t = days + (days > 1 ? " dager " : " dag ") + t
		}
		return t;
	}

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	/**
	 * Make the users JSON object more palatable for DataTables
	 * @param dataObject
	 * @returns {Array}
	 */
	function convertDataTablesData(dataObject) {
		var dataArray = [];
		$.each(dataObject, function (idx, obj) {
			dataArray.push($.extend(obj, {name: idx}));
		});
		return dataArray;
	}


	/*** Expose public functions ***/
	return {
		updateAuthProgress: function (msg) {
			updateAuthProgress(msg);
		},
		showAuthError: function (funcname, msg) {
			showAuthError(funcname, msg);
		},
		showAuthInfo: function (funcname, msg) {
			showAuthInfo(funcname, msg);
		},
		alertError: function (title, message) {
			alertError(title, message);
		},
		alertInfo: function (title, message){
			alertInfo(title, message);
		},
		secToTime: function (totalSec) {
			return secToTime(totalSec);
		},
		secToTimeAndDays: function (totalSec) {
			return secToTimeAndDays(totalSec);
		},
		two: function (x) {
			return two(x);
		},
		isNumber: function(n){
			return isNumber(n);
		},
		mib2mb: function (mib) {
			return mib * MiB_to_MB;
		},
		mib2gb: function (mib) {
			return mib * MiB_to_GB;
		},
		mib2tb: function (mib) {
			return (mib * MiB_to_GB) * GB_to_TB;
		}, 
		convertDataTablesData : function(dataObject){
			return convertDataTablesData(dataObject);
		},
		timestamp2date : function (timestamp) {
			var date = new Date(timestamp * 1000);
			return  UTILS.two(date.getUTCDate()) + '. ' + UTILS.months_short(date.getUTCMonth()) + ' ' + date.getUTCFullYear();
		},
		months_short : function(month){
			var months = ['jan.', 'feb.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'nov.', 'okt.', 'nov.', 'des.'];
			return months[month];
		}

	}
})();

