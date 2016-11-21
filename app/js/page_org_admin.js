/**
 * PAGE controller for OrgAdmin.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var PAGE_ORG_ADMIN = (function () {
	var USER_LIST = {};
	var ORG_RECORDED_DATES_NUM = 0;
	var chartOrgUsageLine = false;
	var USER_ORG_ID;
	var USER_ORG_NAME;

	/**
	 * Called by MENU, which checks that necessary data is available
	 */
	function init() {
		USER_ORG_ID = DATAPORTEN.user().org.id;
		USER_ORG_NAME = DATAPORTEN.user().org.shortname;
		_buildUserTable();
	}


	function onShowListener() {
		chartOrgUsageLine = _buildOrgPresentationLineChart();
		_updateUI();
	}

	function onHideListener() {
		_destroyOrgDiskusageLineChart();
	}

	function _updateUI() {
		// Calculator
		$('#pageOrgAdmin').find('#inputCostTB').val(RELAY.storageCostTB());
		// All fields referring to cost defined by calculator
		$('#pageOrgAdmin').find('.costTB').text("kr. " + RELAY.storageCostTB());
		//
		$('#pageOrgAdmin').find('.orgPresentationCount').text(RELAY.orgPresentationCount(USER_ORG_ID));
		//
		$('#pageOrgAdmin').find('.orgDiskUsage').text(UTILS.mib2gb(RELAY.orgStorageTotalMiB(USER_ORG_ID)).toFixed(2) + "GB");
		$('#pageOrgAdmin').find('.orgDiskUsageDate').text(UTILS.timestamp2date(RELAY.orgStorageArr(USER_ORG_ID)[RELAY.orgStorageArr(USER_ORG_ID).length - 1].date.sec));
		$('#pageOrgAdmin').find('.orgStorageCostEstimate').text("kr. " + (UTILS.mib2tb(RELAY.orgStorageTotalMiB(USER_ORG_ID)) * RELAY.storageCostTB()).toFixed());

		$.when(DATAPORTEN.orgAdminInvitationLinkXHR()).done(function (link) {
			$('#pageOrgAdmin').find('.orgAdminGroupLink').text(link);
		});
	}

	/**
	 * Update cost column when calc-button is pressed
	 */
	function _setInvoiceEstimate() {
		var cost_tb = $('#pageOrgAdmin').find('#inputCostTB').val();
		// Returns error if not a number
		if (RELAY.setStorageCost(cost_tb)) {
			_updateUI();
		}
	}

	$('#pageOrgAdmin #btnInvoiceCalc').on('click', _setInvoiceEstimate);


	/** EMAIL EXPORT MODAL **/
	$('#emailExportOrgAdminModal').on('show.bs.modal', function (event) {
		var emailList = [];
		$.each(USER_LIST, function (userId, userObj) {
			emailList.push(userObj.userDisplayName + ' <' + userObj.userEmail + '>');
		});
		$('#emailExportOrgAdminModal').find('#emailExportList').html(emailList.toString());
	});


	/** DATA EXPORT MODAL **/
	$('#dataExportModal').on('show.bs.modal', function (event) {
		// Only do something if calling button was on orgAdmin page
		if($(event.relatedTarget).data().context === 'orgAdmin') {
			var $modal = $(this);
			// attr 'data-action' on buttons (Brukere || Opptak)
			var exportGroup = $(event.relatedTarget).data().action;
			//
			APP.jsonEditor().setName(exportGroup);
			APP.jsonEditor().set('Henter data, vennligst vent...');

			$.when(RELAY_ORG.usersXHR(), RELAY_ORG.usersPresentationsXHR()).done(function (usersArr, presentationsArr) {
				// Find selected export group
				switch (exportGroup) {
					case 'Brukere':
						$modal.find('.modal-title').html('<i class="ion ion-ios-people"></i> Eksporter metadata for alle <strong>brukere</strong>');
						APP.jsonEditor().set(UTILS.convertDataTablesData(USER_LIST));
						break;
					// Disabled in DOM
					case 'Opptak':
						$modal.find('.modal-title').html('<i class="ion ion-ios-film"></i> Eksporter metadata for alle <strong>opptak</strong>');
						APP.jsonEditor().set(presentationsArr);
						break;
					default:
						break;
				}
			});
		}
	});

	/** TIDY DATA EXPORT MODAL **/
	$('#dataExportModal').on('hide.bs.modal', function (event) {
		APP.jsonEditor().set('Henter data, vennligst vent...');
	});


	/**
	 *
	 * @param users_arr
	 * @param presentations_arr
	 */
	function _buildUserTable() {
		USER_LIST = {};
		var presentationCount = 0;
		var userCount = 0;
		var presentationTotalDurationSec = 0;
		var orgDiskusageMiB = 0;
		var orgHits = 0;
		var employeeCount = 0;
		var studentCount = 0;

		// Merge data from user/usersPresentationsXHR/hits
		$.when(RELAY_ORG.usersXHR(), RELAY_ORG.usersPresentationsXHR(), RELAY_ORG.usersHitsXHR()).done(function (usersArr, presentationsArr, usersHitsArr) {
			var affiliation;
			userCount = usersArr.length;
			orgHits = usersHitsArr.total_hits; // Total #of hits for org
			// Populate users object
			$.each(usersArr, function (index, userObj) {
				// Set affiliation
				switch (userObj.userAffiliation.toLowerCase()) {
					case "employee":
						employeeCount++;
						userObj.userAffiliation = "ansatt";
						break;
					case "student":
						studentCount++;
						userObj.userAffiliation = "student";
						break;
					default:
						userObj.userAffiliation = '---';
				}

				var usernameOnDisk = userObj.userName.replace('@','');
				var userHits = usersHitsArr['users'][usernameOnDisk] ? usersHitsArr['users'][usernameOnDisk] : 0;

				USER_LIST[userObj.userId] =
				{
					userDisplayName: userObj.userDisplayName,
					userEmail: userObj.userEmail,
					userId: userObj.userId,
					userOrg: userObj.userOrg,
					userAffiliation: userObj.userAffiliation,
					userName: userObj.userName,
					userNameOnDisk: usernameOnDisk,
					userHits: userHits,
					userPresentationDurationTotalSec: 0,
					userPresentationCount: 0
				};
			});

			// Add data accumulated from usersPresentationsXHR
			$.each(presentationsArr, function (index, presObj) {
				// In test with .hibu.no, I found that content existed for heaps of old users NO longer in users_arr...
				// Hence, make sure user exist in user object before assigning presentation values.
				if (USER_LIST[presObj.presUser_userId]) {
						// Update USER totals
						USER_LIST[presObj.presUser_userId].userPresentationCount++;
						presentationCount++;
						USER_LIST[presObj.presUser_userId].userPresentationDurationTotalSec += parseInt(presObj.presDuration)/1000;
						// Update ORG totals
						presentationTotalDurationSec += parseInt(presObj.presDuration)/1000;
				}
			});


			// This table may be updated with another orgs details, so make sure
			// to destroy any existing datatable before building a new.
			var $table = $('#pageOrgAdmin').find('#usersTableOrg');
			if ($.fn.DataTable.isDataTable($table)) {
				$table = $table.DataTable();
				$table.destroy();
			}

			var users_org_table = $('#pageOrgAdmin').find('#usersTableOrg').DataTable({
				"language": CONFIG.DATATABLES_LANGUAGE(),
				"bAutoWidth": true,
				"sDom": 'T<"clear">lfrtip',
				"oTableTools": {
					"sSwfPath": "dist/plugins/datatables/tabletools/swf/copy_csv_xls_pdf.swf",
					"aButtons": [
						{
							"sExtends": "copy",
							"sButtonText": "Kopier"
						},
						// Drop-down
						{
							"sExtends": "collection",
							"sButtonText": "Lagre",
							"aButtons": [
								{
									"sExtends": "pdf",
									"sPdfOrientation": "landscape",
									"sTitle": "Relay_Abonnenter"
								},
								{
									"sExtends": "xls",
									"sButtonText": "Excel (.csv)",
									"sTitle": "Relay_Abonnenter"
								}
							]
						}
					]
				},
				"data": UTILS.convertDataTablesData(USER_LIST), // Obj to Array
				"columns": [
					{
						"data": "userDisplayName",
						"render": function (data, type, full, meta) {
							return '<a class="userTableMoreInfo icon ion-ios-email" href="mailto:' + full.userEmail + '"> ' + data + '</a>';
						}
					},
					{
						"data": "userAffiliation"
					},
					{
						"data": "userPresentationCount"
					},
					{
						"data": "userPresentationDurationTotalSec",
						"render": function (data, type, full, meta) {
							return UTILS.secToTime(data);
						}
						//"width" : "10%"
					},
					{
						"data": "userHits",
						"render": function (data, type, full, meta) {
							var bg = parseInt(data) < 100 ? 'red' : parseInt(data) < 500 ? 'yellow' : 'light-blue';
							return '<div style="width: 100%;" class="text-center"><span class="badge bg-' + bg + '">' + data + '</span></div>';
						}
					}
				]/*,
				 "aoColumnDefs": [
				 { "sClass": "text-nowrap", "aTargets": [ 0 ] }
				 ]*/
			});

			var $org_table = $('#usersTableOrg');
			// Update totals table footer
			$org_table.find('.th-name').html("<span class='label label-default'><i class='ion ion-android-person'></i> = " + userCount + "</span>");
			$org_table.find('.th-type').html("<span class='label label-default'>A=" + employeeCount + "/S=" + studentCount + "</span>");
			$org_table.find('.th-usersPresentationsXHR').html("<span class='label label-default'><i class='ion ion-ios-film'></i> = " + presentationCount + "</span>");

			$org_table.find('.th-duration').html("<span class='label label-default'><i class='ion ion-ios-clock'></i> = " + UTILS.secToTimeAndDays(presentationTotalDurationSec) + "</span>");
			$org_table.find('.th-hits').html("<span class='label label-default'><i class='ion ion-stats-bars'></i> = " + orgHits + "</span>");
			$('#pageOrgAdmin').find('#usersTableBox').find('.ajax').hide();
		});
	}

	/** ----------------- LINE CHART ----------------- **/

	function _buildOrgPresentationLineChart() {
		_destroyOrgDiskusageLineChart();
		ORG_RECORDED_DATES_NUM = 'INGEN';
		$('#lineChartOrgAlert').hide();
		if (RELAY.orgStorageArr(USER_ORG_ID).length < 2) {
			$('#lineChartOrgAlert').html('<code>' + USER_ORG_NAME + '</code>&nbsp;&nbsp;har for f&aring; nylige lagringspunkter registrert til &aring; bygge grafen.')
			$('#lineChartOrgAlert').show();
			return false;
		}

		//
		var orgUsageChartData;
		// "Clone" since we will be reversing and shit later on
		orgUsageChartData = JSON.parse(JSON.stringify(RELAY.orgStorageArr(USER_ORG_ID)));
		//
		fillColor = typeof fillColor !== 'undefined' ? fillColor : '#' + (Math.random().toString(16) + '0000000').slice(2, 8);

		// Max 30 days
		var daysToShow = 30;
		var counter = daysToShow;
		var labels = [];
		var data = [];
		// Start from most recent date and count backwards in time
		orgUsageChartData.reverse();
		//
		$.each(orgUsageChartData, function (index, storage) {
			//var date = new Date(storage.date.replace(/-/g, "/"));   // replace hack seems to fix Safari issue...
			var date = new Date(storage.date.sec * 1000);
			// Chart labels and data
			labels.push(date.getUTCDate() + '.' + (date.getUTCMonth()+1) + '.' + date.getUTCFullYear());      // Add label
			data.push(UTILS.mib2gb(storage.size_mib).toFixed(2));    // And value
			counter--;
			if (counter == 0) return false;
		});
		// In case there exist less than 30 days worth of data
		ORG_RECORDED_DATES_NUM = daysToShow - counter;
		// Number of dates available in org's storage history (max 30 days)
		$('#pageOrgAdmin').find('.orgRecordedDatesNum').text(ORG_RECORDED_DATES_NUM);

		// Reverse back so we get most recent date last
		data.reverse();
		labels.reverse();

		// Build dataset
		var lineChartData = {
			labels: labels,
			datasets: [
				{
					label: "Diskforbruk siste " + data.length + ' dager',
					fillColor: fillColor,
					strokeColor: "#666",
					pointColor: "#fff",
					pointStrokeColor: "#666",
					pointHighlightFill: "#285C85",
					pointHighlightStroke: "rgba(60,141,188,1)",
					data: data
				}
			]
		};

		var ctx = document.getElementById("orgUsageLineChartOrgAdmin").getContext("2d");
		return new Chart(ctx).Line(lineChartData,
			{
				showScale: true,
				scaleShowGridLines: false,
				scaleShowHorizontalLines: true,
				scaleShowVerticalLines: true,
				bezierCurve: true,
				bezierCurveTension: 0.3,
				pointDot: true,
				pointDotRadius: 4,
				pointDotStrokeWidth: 1,
				pointHitDetectionRadius: 5,
				datasetStroke: true,
				datasetStrokeWidth: 2,
				datasetFill: true,
				maintainAspectRatio: false
			}
		);
	}

	function _destroyOrgDiskusageLineChart() {
		if (chartOrgUsageLine !== false) {
			chartOrgUsageLine.destroy();
			chartOrgUsageLine = false;
		}
	}

	// Update chart color
	$("#orgUsageLineChartOrgAdmin").on('click', function (evt) {
		chartOrgUsageLine.datasets[0].fillColor = '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
		chartOrgUsageLine.update();
	});


	/** ----------------- ./ LINE CHART ----------------- **/

	return {
		init: function () {
			return init();
		},
		hide: function () {
			onHideListener();
		},
		show: function () {
			onShowListener();
		}
	}
})();





