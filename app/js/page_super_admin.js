/**
 * PAGE controller for SuperAdmin.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var PAGE_SUPER_ADMIN = (function () {
	// CHART
	var pieOrgsUserCount = false; // The Chart instance
	var chartOrgUsageLine = false; // The Chart instance
	// SUBSCRIBERS TABLE
	var orgSubscribersTable;        // The DataTable instance
	// Selected org for stats/chart
	var SELECTED_ORG = "";
	var SELECTED_ORG_RECORDED_DATES_NUM = 0;

	/**
	 * Called by MENU which checks that necessary data is available
	 */
	function init() {
		SELECTED_ORG = DATAPORTEN.user().org.id;
		orgSubscribersTable = _buildOrgSubscribersTable();
		_updateUI();
		refreshQueueFailedJobs();

	};

	function _updateUI() {
		$('ul#orgListSuperAdmin').html('');
		// Drop-down for Line Chart
		$.each(RELAY.subscribersInfo(), function (org, orgObj) {
			$('ul#orgListSuperAdmin').append('<li class="orgLineChartSelector" style="cursor: pointer;" data-org="' + org + '">' + org + '</li>');
		});
		// Selected from drop-down
		$('#pageSuperAdmin').find('.selectedOrg').html('<code>' + SELECTED_ORG + "</code>");
		// Number of dates available in org's storage history (max 30 days)
		$('#pageSuperAdmin').find('.selectedOrgRecordedDatesNum').text(SELECTED_ORG_RECORDED_DATES_NUM);
		// Calculator
		$('#pageSuperAdmin').find('#inputCostTB').val(RELAY.storageCostTB());
		// All fields referring to cost defined by calculator
		$('#pageSuperAdmin').find('.costTB').text("kr. " + RELAY.storageCostTB());
		// Users/content
		$('#pageSuperAdmin').find('.orgUserCount').html(RELAY.orgUserCount(SELECTED_ORG) + "<br><small class='text-muted'>" + RELAY.orgEmployeesCount(SELECTED_ORG) + "/" + RELAY.orgStudentsCount(SELECTED_ORG) + "</small>");

		$('#pageSuperAdmin').find('.orgPresentationCount').html(RELAY.orgPresentationCount(SELECTED_ORG) + "<br><small class='text-muted'>" + RELAY.orgEmployeesPresentationCount(SELECTED_ORG) + "/" + RELAY.orgStudentsPresentationCount(SELECTED_ORG) + "</small>");

		$.when(RELAY.serviceStorageXHR()).done(function (total_mib) {
			var serviceStorageMiB = total_mib;
			// Invoice estimate total
			$('#pageSuperAdmin').find('.totalStorageCostEstimate').text('kr. ' + (UTILS.mib2tb(serviceStorageMiB) * RELAY.storageCostTB()).toFixed());
			// QuickStats below line graph
			var orgTotalStorageMiB = RELAY.orgStorageTotalMiB(SELECTED_ORG);
			var orgStoragePercentageGlobal = (orgTotalStorageMiB / serviceStorageMiB) * 100;
			// Storage
			$('#pageSuperAdmin').find('.orgTotalStorage').text(UTILS.mib2gb(orgTotalStorageMiB).toFixed(2) + " GB");
			$('#pageSuperAdmin').find('.orgStoragePercentageGlobal').text(orgStoragePercentageGlobal.toFixed(2));
			// Invoice estimate
			$('#pageSuperAdmin').find('.orgInvoiceEstimate').text('kr. ' + (UTILS.mib2tb(orgTotalStorageMiB) * RELAY.storageCostTB()).toFixed(2));
		});
	}

	function onShowListener() {
		pieOrgsUserCount = _buildOrgsUserCountPie(RELAY.subscribersInfo());
		$('#pageSuperAdmin').find('#usersPie').find('.ajax').hide();
		chartOrgUsageLine = _buildOrgPresentationLineChart(SELECTED_ORG);
		_updateUI();
	}

	function onHideListener() {
		_destroyPieChart();
		_destroyOrgDiskusageLineChart();
	}

	function _updateSelectedOrg(org) {
		// Find selected org's data
		if (RELAY.subscribersInfo()[org]) {
			SELECTED_ORG = org;
			return true;
		} else {
			UTILS.alertError('Fant ikke data for <code>' + org + '</code>', 'Fant ikke noe data for organisasjonen du valgte: ' + org);
			return false;
		}
	}

	function refreshQueueFailedJobs() {
		$('#pageSuperAdmin').find('#queueFailedJobsContainer').find('.ajax').show();
		$('#pageSuperAdmin').find('#queueFailedJobsTable').hide();

		$.when(RELAY.serviceQueueFailedJobsXHR()).done(function (jobs) {
			var totalFailedJobs = jobs.length;
			$('#pageSuperAdmin').find('.queueFailedJobsCount').text(totalFailedJobs);
			if (totalFailedJobs > 0) {
				$('#pageSuperAdmin').find('#queueFailedJobsTableBody').html('');

				$.each(jobs, function (index, jobObj) {
					$('#pageSuperAdmin').find('#queueFailedJobsTableBody').append(
						"<tr>" +
						"<td>" + jobObj.jobPresentation_PresId + "</td>" +
						"<td>" + jobObj.jobNumberOfFailures + "</td>" +
						"<td>" + jobObj.jobFailureReason + "</td>" +
						"</tr>"
					);
				});
				$('#pageSuperAdmin').find('#queueFailedJobsTable').show();
			}
			$('#pageSuperAdmin').find('#queueFailedJobsContainer').find('.ajax').hide();
		});
	}

	$('.refreshQueueFailedJobs').on('click', function () {
		refreshQueueFailedJobs();
	});

	/** ----------------- PIE CHART ----------------- **/


	function _buildOrgsUserCountPie(orgs) {
		_destroyPieChart();
		var orgsUserCountChartData = [];
		$.each(orgs, function (orgName, orgObj) {
			// Chart prefs and data
			orgsUserCountChartData.push({
				value: orgObj.users.total,
				color: '#' + (Math.random().toString(16) + '0000000').slice(2, 8),
				highlight: '#' + (Math.random().toString(16) + '0000000').slice(2, 8),
				label: orgName
			});
		});
		var ctx = document.getElementById("chartOrgsUserCountSuperAdmin").getContext("2d");
		return new Chart(ctx).Pie(orgsUserCountChartData, {});
	}

	function _destroyPieChart() {
		if (pieOrgsUserCount !== false) {
			pieOrgsUserCount.destroy();
			pieOrgsUserCount = false;
			$('#pageSuperAdmin').find('#usersPie').find('.ajax').show();
		}
	}

	// Update line chart on click on pie
	$("#chartOrgsUserCountSuperAdmin").on('click', function (evt) {
		var activePoints = pieOrgsUserCount.getSegmentsAtEvent(evt);
		if (_updateSelectedOrg(activePoints[0].label)) {
			chartOrgUsageLine = _buildOrgPresentationLineChart(SELECTED_ORG, activePoints[0]._saved.fillColor); // Label is org name :-)
			_updateUI();
			$('html, body').animate({scrollTop: $('#orgDetailsHeader').offset().top + 'px'}, 'fast');
		}
	});


	/** ----------------- ./ PIE CHART ----------------- **/


	/** ----------------- LINE CHART ----------------- **/

	$('ul#orgListSuperAdmin').on('click', 'li.orgLineChartSelector', function () {
		if (_updateSelectedOrg($(this).data('org'))) {
			chartOrgUsageLine = _buildOrgPresentationLineChart(SELECTED_ORG);
			_updateUI();
		}
	});

	$('#subscribersTableSuperAdmin').on('click', 'button.org', function () {
		if (_updateSelectedOrg($(this).data('org'))) {
			chartOrgUsageLine = _buildOrgPresentationLineChart(SELECTED_ORG);
			_updateUI();
			$('html, body').animate({scrollTop: $('#orgDetailsHeader').offset().top + 'px'}, 'fast');
		}
	});

	function _buildOrgPresentationLineChart(org, fillColor) {
		_destroyOrgDiskusageLineChart();
		$('#lineChartAlert').hide();
		// Make sure we have storage data
		if (RELAY.orgStorageArr(org) !== null) {
			//...and enough of it
			if (RELAY.orgStorageArr(org).length >= 2) {
				//
				var orgUsageChartData;
				// "Clone" since we will be reversing and shit later on
				orgUsageChartData = JSON.parse(JSON.stringify(RELAY.orgStorageArr(org)));
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
					labels.push(date.getUTCDate() + '.' + (date.getUTCMonth() + 1) + '.' + date.getUTCFullYear());      // Add label
					data.push(UTILS.mib2gb(storage.size_mib).toFixed(2));    // And value
					counter--;
					if (counter == 0) return false;
				});
				// In case there exist less than 30 days worth of data
				SELECTED_ORG_RECORDED_DATES_NUM = daysToShow - counter;
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

				var ctx = document.getElementById("orgUsageLineChartSuperAdmin").getContext("2d");
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
		}
		// Not enough data, show error msg
		$('#lineChartAlert').html('<code>' + org + '</code>&nbsp;&nbsp;har for f&aring; nylige lagringspunkter registrert til &aring; bygge grafen.')
		$('#lineChartAlert').show();
		SELECTED_ORG_RECORDED_DATES_NUM = 'INGEN';
		return false;
	}

	function _destroyOrgDiskusageLineChart() {
		if (chartOrgUsageLine !== false) {
			chartOrgUsageLine.destroy();
			chartOrgUsageLine = false;
		}
	}

	// Update chart color
	$("#orgUsageLineChartSuperAdmin").on('click', function (evt) {
		chartOrgUsageLine.datasets[0].fillColor = '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
		chartOrgUsageLine.update();
	});


	/** ----------------- ./ LINE CHART ----------------- **/

	/**
	 *
	 */
	function _buildOrgSubscribersTable() {

		// Clone the array so as to not modify passed original
		var subscribersObj = JSON.parse(JSON.stringify(RELAY.subscribersInfo()));

		var table = $('#pageSuperAdmin').find('#subscribersTableSuperAdmin').DataTable({
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
			// "data": subscribersObj,
			"data": UTILS.convertDataTablesData(subscribersObj), // Obj to Array
			"columns": [
				{
					"data": "id",
					"render": function (data, type, full, meta) {
						return "<button class='btn btn-link org' data-org='" + data + "'>" + data + "</button>";
					}
				},
				{
					"data": "active",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return full.active == 1 ? '<span class="icon ion-unlocked text-green"></span> Aktiv' : '<span class="icon ion-locked text-red"></span> Stengt';
					}
				},
				{
					"data": "affiliation_access",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return full.affiliation_access == 'member' ? '<span class="icon ion-ios-people text-blue"></span> Alle' : '<span class="icon ion-ios-person text-aqua"></span> Ansatt';
					}
				},
				{
					"data": "users",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return full.users.total
					}
				},
				{
					"data": "employees",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return full.users.employees;
					}
				},
				{
					"data": "students",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return full.users.students;
					}
				},
				{
					"data": "presentations",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return full.presentations.total;
					}
				},
				{
					"data": "hits",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return full.hits.hits;
					}
				},
				{
					"data": "storage",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return UTILS.mib2gb(full.total_mib).toFixed(2);
						/*
						 '<div class="progress no-margin">' +
						 '<div class="progress-bar bg-gray tablePercentage" style="width: ' + full.storage.percentage + '%">' +  UTILS.mib2gb(full.total_mib) + '</div>' +
						 '</div>';
						 */
					}
				},
				{
					"data": "storage",
					//"width": "5%",
					"render": function (data, type, full, meta) {
						return (UTILS.mib2tb(full.total_mib) * RELAY.storageCostTB()).toFixed() + 'kr';
					}
				}
			]
		});
		$('#pageSuperAdmin').find('#subscribersTableBox').find('.ajax').hide();
		return table;
	}

	/**
	 * Email export modal, displaying either contacts or supports depending on which button was clicked
	 */
	function _showEmailExportModal(btn) {
		var $btnClicked = btn;
		var $modal = $('#emailExportSuperAdminModal');
		// Add group name to modal title
		$modal.find('#emailExportTargetGroup').html($btnClicked.data("exportGroup"));
		// Reset old info
		$modal.find('#emailMissing').html('');
		$modal.find('#emailExportCount').html('');
		$modal.find('#emailExportList').html('Henter liste, vennligst vent....');
		// The list
		var emailList = [];
		// Mailinglist for users at selected org selected
		if ($btnClicked.data("exportGroup") === 'brukere') {
			// AJAX call for this type of data
			$.when(RELAY.orgUserListXHR(SELECTED_ORG)).then(function (usersArr) {
				$.each(usersArr, function (key, userObj) {
					emailList.push(userObj.userDisplayName + ' <' + userObj.userEmail + '>');
				});
				// Badge number in modal title
				$modal.find('#emailExportCount').html(emailList.length);
				// TextArea
				$modal.find('#emailExportList').html(emailList.toString());
			});
		}
	}

	// Trigger modal
	$('.email_export').on('click', function () {
		_showEmailExportModal($(this));
	});


	/** DATA EXPORT MODAL **/
	$('#dataExportModal').on('show.bs.modal', function (event) {
		// Only do something if calling button was on superAdmin page
		if ($(event.relatedTarget).data().context === 'superAdmin') {
			var $modal = $(this);
			// attr 'data-action' on buttons (Brukere || Opptak)
			var exportGroup = $(event.relatedTarget).data().action;
			//
			APP.jsonEditor().setName(exportGroup);
			APP.jsonEditor().set('Henter data, vennligst vent...');

			// Find selected export group
			switch (exportGroup) {
				case 'Brukere':
					$modal.find('.modal-title').html('<i class="ion ion-ios-people"></i> Eksporter metadata for alle <strong>brukere</strong> ved <code>' + SELECTED_ORG + '</code>');
					$.when(RELAY.orgUserListXHR(SELECTED_ORG)).then(function (orgUserList) {
						APP.jsonEditor().set(orgUserList);
					});
					break;
				// 21.11.2016: Below disabled (and button removed from DOM) after moving to DB-API (won't get anything useful from tblPresentations only, and joined query with tblFile is too expensive).
				case 'Opptak':
					$modal.find('.modal-title').html('<i class="ion ion-ios-film"></i> Eksporter metadata for alle <strong>opptak</strong> fra <code>' + SELECTED_ORG + '</code>');
					$.when(RELAY.orgPresentationListXHR(SELECTED_ORG)).then(function (orgPresentationList) {
						APP.jsonEditor().set(orgPresentationList);
					});
					break;
				default:
					break;
			}
		}
	});

	/** TIDY DATA EXPORT MODAL **/
	$('#dataExportModal').on('hide.bs.modal', function (event) {
		APP.jsonEditor().set('Henter data, vennligst vent...');
	});

	/**
	 * Update cost column when calc-button is pressed
	 */
	function _setInvoiceEstimate() {
		var cost_tb = $('#pageSuperAdmin').find('#inputCostTB').val();
		// Returns error if not a number
		if (RELAY.setStorageCost(cost_tb)) {
			_updateUI();
			// Rebuild the table
			orgSubscribersTable.destroy();
			orgSubscribersTable = _buildOrgSubscribersTable();
		}
	}

	$('#pageSuperAdmin #btnInvoiceCalc').on('click', _setInvoiceEstimate);


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











