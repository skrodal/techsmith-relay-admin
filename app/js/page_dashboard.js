/**
 * PAGE controller for Dashboard.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var PAGE_DASHBOARD = (function () {
	// Pie chart
	var pieOrgsUserCount = false;          // The Chart instance
	//
	var lineLastWeeksHits = false;
	//
	var queuedPresentations = [];

	/**
	 *
	 */
	function init() {
		// Subscribers table (simple)
		_buildOrgsTable();
		// Hits (pass in last number of days to include)
		_buildHitsChart(30);
		// Fresh fetch
		refreshQueueMonitor();
	}

	function refreshQueueMonitor() {
		$('#pageDashboard').find('[id^=relayQueueMonitor]').find('.ajax').show();
		$('.queueTotal').html('<i class="fa fa-spinner fa-pulse"></i>');
		$.when(RELAY.serviceQueueXHR()).done(function (queue) {
			var totalQueuedJobs = queue.length;
			$('#pageDashboard').find('[id^=relayQueueMonitor]').find('.ajax').hide();
			$('.queueTotal').html(totalQueuedJobs);
			// Queue arrayobj
			queuedPresentations = queue;
			// Update details table in modal
			_buildQueueTable();
		});
	}

	$('.updateQueue').on('click', function(){
		refreshQueueMonitor();
	});


	function _buildQueueTable() {
		var $queueTableBody = $('#queueTableBody');
		$queueTableBody.html('');
		if(queuedPresentations.length == 0){
			$queueTableBody.html('<tr><td colspan="2"><strong>Det er ingen jobber i kø akkurat nå</strong></td></tr>');
			return;
		}
		var presID = false;
		var newPresID;
		var jobCount = 0;
		var lastObj = false;
		$.each(queuedPresentations, function (index, obj) {
			// Current presentation ID
			newPresID = obj['jobPresentation_PresId'];
			// Initiate presID if this is first time in the loop
			if (!presID) presID = newPresID;
			// If current presID has a different number than previous, we can output the job data
			if (jobCount > 0 && newPresID != presID) {
				$queueTableBody.append(
					'<tr><td>#' + lastObj['jobPresentation_PresId'] + '</td>' +
					'<td>' + lastObj['jobQueuedDate'] + ', kl. ' + lastObj['jobQueuedTime'] + '</td>' +
					'<td>' + jobCount + '</td>' +
					// Duration from Relay DB is in ms
					'<td>' + UTILS.secToTime(lastObj['presDuration']/1000) + '</td>' +
					'<td>' + lastObj['presPresenterName'].substring(0, lastObj['presPresenterName'].indexOf(' ')) + '</td></tr>');
				// Reset counter
				jobCount = 0;
				// Update pointer
				presID = obj['jobPresentation_PresId'];
			}
			jobCount++;
			lastObj = obj;
		});

		// Get the last obj
		$queueTableBody.append(
			'<tr><td>#' + lastObj['jobPresentation_PresId'] + '</td>' +
			'<td>' + lastObj['jobQueuedDate'] + ', kl. ' + lastObj['jobQueuedTime'] + '</td>' +
			'<td>' + jobCount + '</td>' +
			// Duration from Relay DB is in ms
			'<td>' + UTILS.secToTime(lastObj['presDuration']/1000) + '</td>' +
			'<td>' + lastObj['presPresenterName'].substring(0, lastObj['presPresenterName'].indexOf(' ')) + '</td></tr>');
	}


	function _buildHitsChart(days) {
		// Update all pages with global hits info
		$.when(RELAY.hitsTotalXHR()).done(function (hitsTotal) {
			$('.hitsTotalGlobal').html(hitsTotal.hits);
			$('.hitsFirstRecord').html(UTILS.timestamp2date(hitsTotal.first_timestamp));
		});

		// Build chart with Last X days of recorded hits
		$.when(RELAY.hitsByDaysXHR(days)).done(function (hitsArr) {
			var morrisLineData = [];
			var timestamp;
			var totalHits = 0;
			$.each(hitsArr, function (index, val) {
				// Date to timestamp
				timestamp = parseInt(new Date(val.log_date).getTime());
				morrisLineData.push({date: timestamp, hits: val.hits});
				totalHits += parseInt(val.hits);
			});
			// We don't want today's read - it was likely read early morning and not representative
			morrisLineData.pop();
			//
			$('.hitsLastDaysTotal').html(totalHits);
			$('.hitsLastDaysChartDays').html(days);
			$('#hitsLastDaysChartContainer').find('.ajax').hide();
			//$.AdminLTE.boxWidget.collapse($('#hitsLastWeekChart'));

			return new Morris.Line({
				element: 'hitsLastDaysChart',
				resize: true,
				data: morrisLineData,
				xkey: 'date',
				// Custom formatting of dates
				xLabelFormat: function (x) {
					return ('0' + x.getUTCDate()).slice(-2) + '.' + ('0' + (x.getUTCMonth() + 1)).slice(-2) + '.' + x.getUTCFullYear();
				},
				dateFormat: function (x) {
					x = new Date(x);
					return ('0' + x.getUTCDate()).slice(-2) + '.' + ('0' + (x.getUTCMonth() + 1)).slice(-2) + '.' + x.getUTCFullYear();
					//return new Date(x);//.toDateString();
				},
				ykeys: ['hits'],
				labels: ['Visninger'],
				lineColors: ['#3c8dbc'],
				hideHover: 'auto'
			});
		});
	}


	/**
	 * Simple table with orgs
	 *
	 * @private
	 */
	function _buildOrgsTable() {
		$('#subscriber_table_body').empty();
		var myOrgHiglight;
		// Loop all subscribers
		var count = 1;
		var table = "";
		$.each(RELAY.subscribersInfo(), function (org, orgObj) {
			myOrgHiglight = '';
			// To highlight home org
			if (org == DATAPORTEN.user().org.id) {
				myOrgHiglight = 'text-blue';
			}
			// new row
			if(count % 2 == 1){
				table = table + "<tr>";
			}
			// cell
			table = table + "<td class='icon ion-university "+myOrgHiglight+"'> &nbsp; &nbsp;" + org + "</td>";
			// close row
			if(count % 2 == 0){
				table = table + "</tr>";
			}
			count++;
		});
		// If we ended on an odd number, add cell and close row
		if(count % 2 == 1){
			table = table + "<td></td></tr>";
		}

		$('#subscriber_table_body').append(table);
		delete table;
		//
		$('#pageDashboard').find('#subscribersTable').find('.ajax').hide();
	}

	/**
	 * Simple pie chart with anonymous values. SuperAdmin gets the same,
	 * but with legend.
	 *
	 * @param orgs
	 * @returns {*}
	 * @private
	 */
	function _buildOrgsUserCountPie(orgs) {
		_destroyPieChart();
		var orgsUserCountChartData = [];

		$.each(orgs, function (org, orgObj) {
			// Chart prefs and data
			orgsUserCountChartData.push({
				value: orgObj.users.total,
				color: '#' + (Math.random().toString(16) + '0000000').slice(2, 8),
				highlight: '#' + (Math.random().toString(16) + '0000000').slice(2, 8),
				label: ""
			});
		});
		var ctx = document.getElementById("chartOrgsUserCountDashboard").getContext("2d");
		return new Chart(ctx).Pie(UTILS.arrayShuffle(orgsUserCountChartData), {});
	}

	/**
	 * Draw/display things when page is finally visible (called by app_menu.js on show).
	 *
	 * Solves specific problem with Charts, as these will not draw on hidden DOM since
	 * size is then set to 0.
	 */
	function onShowListener() {
		pieOrgsUserCount = _buildOrgsUserCountPie(RELAY.subscribersInfo());
		$('#pageDashboard').find('#usersPie').find('.ajax').hide();
	}

	/**
	 * Destroy elements that can't be redrawn when hidden
	 */
	function onHideListener() {
		_destroyPieChart();
	}

	function _destroyPieChart() {
		// PIE CHART, destroy if already present (to get the animation effect)
		if (pieOrgsUserCount !== false) {
			pieOrgsUserCount.destroy();
			pieOrgsUserCount = false;
			$('#pageDashboard').find('#usersPie').find('.ajax').show();
		}
	}

	return {
		init: function () {
			return init();
		},
		hide: function () {
			onHideListener();
		},
		show: function () {
			onShowListener();
		},
		refreshQueue: function () {
			refreshQueueMonitor();
		}
	}

})();
