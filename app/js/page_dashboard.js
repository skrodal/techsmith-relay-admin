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

	function init() {
		// Subscribers table (simple)
		_buildOrgsTableDashboard();
		// Fresh fetch
		refreshQueueMonitor();
	}

	function refreshQueueMonitor() {
		$('#pageDashboard').find('#relayQueueMonitor').find('.ajax').show();
		$('.queueTotal').html('<i class="fa fa-spinner fa-pulse"></i>');
		$('#relayQueueMonitorContent').html('');
		$.when(RELAY.serviceQueueXHR()).done(function (queue) {
			//  TODO: Logic/presentation
			var total = queue.total || 'Ingen jobber i k&oslash;';
			var details = queue.jobs ? JSON.stringify(queue.jobs, null, 4) : 'Ingen detaljer tilgjengelig';

			$('#relayQueueMonitorContent').html(
				'<strong>Jobber:</strong> ' + total + '<br>' +
					'<strong>Detaljer:</strong> ' + details
			);
			$('#pageDashboard').find('#relayQueueMonitor').find('.ajax').hide();
			$('#pageDashboard').find('#queueBox').find('.ajax').hide();

			$('.queueTotal').html(queue.total || 0);
		});
	}

	$('.updateQueue').on('click', function(){
		refreshQueueMonitor();
	});

	function _buildLastWeeksHitsChart() {
		$.when(RELAY.hitsLastWeekXHR()).done(function (hitsArr) {
			var morrisLineData = [];
			var datesObj = {};
			var datePointer; var newDate;
			var totalHits = 0;
			$.each(hitsArr, function (index, val) {
				// YYYY-MM-DD HH:MM:SS
				newDate = val.date.substring(0, 10).trim();
				newDate = newDate.split('-');
				newDate = newDate[1]+"/"+newDate[2]+"/"+newDate[0];
				// Timestamp
				newDate = new Date(newDate).getTime();
				//
				if(datePointer !== newDate) datePointer = newDate;
				//
				if(!datesObj[datePointer]){
					datesObj[datePointer] = 0;
				}
				datesObj[datePointer] += val.requests;
				totalHits += val.requests;
			});

			// Make a data array for morris chart
			$.each(datesObj, function (date, hits) {
				// Used by Morris chart (which is able to read timestamps) - have to add 24 hours to get Morris to display correct dates
				morrisLineData.push({date: parseInt(date) + 86400000, hits: hits});
			});

			$('.hitsLastWeekTotal').html(totalHits);
			$('#hitsLastWeekTotalContainer').find('.ajax').hide();
			//$.AdminLTE.boxWidget.collapse($('#hitsLastWeekChart'));

			return new Morris.Line({
				element: 'hitsLastWeekChart',
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
	 * Simple table with orgs and subscription status
	 *
	 * @private
	 */
	function _buildOrgsTableDashboard() {
		$('#subscriber_table_body').empty();
		var labelText = '---', labelColor = 'red';
		var rowClass;
		// Loop all subscribers
		$.each(KIND.subscribers(), function (index, org) {
			rowClass = '';
			// Text/color for subscription status
			labelText = KIND.subscriptionCodesToNames()[org.subscription_code];
			labelColor = KIND.subscriptionCodesToColors()[org.subscription_code];
			// To highlight home org
			if (org.org_id == DATAPORTEN.user().org.id) {
				rowClass = 'active';
			}
			// New row
			$('#subscriber_table_body').append(
				"<tr class='" + rowClass + "'>" +
					"<td>" + org.org_id + "</td>" +
					"<td style='text-align: center;'><span class='label bg-" + labelColor + "'>" + labelText + "</span></td>" +
					"</tr>"
			);
		});
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
				value: orgObj.users,
				color: '#' + (Math.random().toString(16) + '0000000').slice(2, 8),
				highlight: '#' + (Math.random().toString(16) + '0000000').slice(2, 8),
				label: ""
			});
		});
		var ctx = document.getElementById("chartOrgsUserCountDashboard").getContext("2d");
		return new Chart(ctx).Pie(orgsUserCountChartData, {});
	}

	/**
	 * Draw/display things when page is finally visible (called by app_menu.js on show).
	 *
	 * Solves specific problem with Charts, as these will not draw on hidden DOM since
	 * size is then set to 0.
	 */
	function onShowListener() {
		$.when(RELAY.ready()).done(function () {
			pieOrgsUserCount = _buildOrgsUserCountPie(RELAY.subscribersInfo());
			$('#pageDashboard').find('#usersPie').find('.ajax').hide();
		});
		// TODO: When hits are back in the API
		// lineLastWeeksHits = _buildLastWeeksHitsChart();
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
