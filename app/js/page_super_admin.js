/**
 * PAGE controller.
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
		SELECTED_ORG = FEIDE_CONNECT.user().org.id;
		orgSubscribersTable = _buildOrgSubscribersTable();
		_updateUI();
	};

	function _updateUI() {
		$('ul#orgListSuperAdmin').html('');
		// Drop-down for Line Chart
		$.each(KIND.subscribingOrgNames(), function (index, org) {
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

		$.when(RELAY.serviceStorageXHR()).done(function (total_mib) {
			var serviceStorageMiB = total_mib;
			// On disk as of last reading (total)
			$('#pageSuperAdmin').find('.subscribersDiskusageTotal').text(UTILS.mib2tb(serviceStorageMiB).toFixed(2) + "TB");
			// Invoice estimate total
			$('#pageSuperAdmin').find('.totalStorageCostEstimate').text('kr. ' + (UTILS.mib2tb(serviceStorageMiB) * RELAY.storageCostTB()).toFixed());
			// QuickStats below line graph
			var orgTotalStorageMiB = RELAY.orgStorageTotalMiB(SELECTED_ORG);
			var orgStoragePercentageGlobal = (orgTotalStorageMiB / serviceStorageMiB) * 100;

			// Storage
			$('#pageSuperAdmin').find('.orgTotalStorage').text(UTILS.mib2gb(orgTotalStorageMiB).toFixed(2) + " GB");
			$('#pageSuperAdmin').find('.orgStoragePercentageGlobal').text(orgStoragePercentageGlobal.toFixed(2));
			// Users
			$('#pageSuperAdmin').find('.orgUserCount').text(RELAY.orgUserCount(SELECTED_ORG));
			// Subsctiption status
			$('#pageSuperAdmin').find('.orgSubscriptionStatus').html('<span class="label bg-' + KIND.subscriptionCodesToColors()[KIND.orgSubscriptionStatusCode(SELECTED_ORG)] + '">' + KIND.subscriptionCodesToNames()[KIND.orgSubscriptionStatusCode(SELECTED_ORG)] + '</span>');
			// Invoice estimate
			$('#pageSuperAdmin').find('.orgInvoiceEstimate').text('kr. ' + (UTILS.mib2tb(orgTotalStorageMiB) * RELAY.storageCostTB()).toFixed(2));
			// Ajax call each time presentation count is requested
			$('#pageSuperAdmin').find('.orgPresentationCount').html('<i class="fa fa-spinner fa-pulse"></i>');
			$('#pageSuperAdmin').find('.orgPresentationCount').html(RELAY.orgPresentationCount(SELECTED_ORG));
		});
	}

	function onShowListener() {
		$.when(RELAY.ready().done(function () {
			pieOrgsUserCount = _buildOrgsUserCountPie(RELAY.subscribersInfo());
			$('#pageSuperAdmin').find('#usersPie').find('.ajax').hide();
			chartOrgUsageLine = _buildOrgPresentationLineChart(SELECTED_ORG);
		}));
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

	/** ----------------- PIE CHART ----------------- **/


	function _buildOrgsUserCountPie(orgs) {
		_destroyPieChart();
		var orgsUserCountChartData = [];
		$.each(orgs, function (orgName, orgObj) {
			// Chart prefs and data
			orgsUserCountChartData.push({
				value: orgObj.users,
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

	function _buildOrgPresentationLineChart(org, fillColor) {
		_destroyOrgDiskusageLineChart();
		$('#lineChartAlert').hide();
		if (RELAY.orgStorageArr(org).length < 2) {
			$('#lineChartAlert').html('<code>' + org + '</code>&nbsp;&nbsp;har for f&aring; nylige lagringspunkter registrert til &aring; bygge grafen.')
			$('#lineChartAlert').show();
			SELECTED_ORG_RECORDED_DATES_NUM = 'INGEN';
			return false;
		}

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
			data.push(UTILS.mib2mb(storage.size_mib).toFixed(2));    // And value
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
		var subscribersObj = JSON.parse(JSON.stringify(KIND.subscribers()));
		// Before passing dataset to table - add storage consumption and usercount per org
		$.each(subscribersObj, function (org, orgObj) {
			// Get org from Kind array, map to corresponding Mediasite org and add storage to the end of the Kind array
			var orgStorageMiB = RELAY.orgStorageTotalMiB(org);
			var orgUserCount = RELAY.orgUserCount(org);
			// Create a 6th index in org array
			orgObj.storage =
			{
				mib: orgStorageMiB,
				gb: UTILS.mib2gb(orgStorageMiB).toFixed(2),
				percentage: (orgStorageMiB / RELAY.serviceStorageXHR() * 100 ).toFixed(),
				cost: (UTILS.mib2tb(orgStorageMiB) * RELAY.storageCostTB()).toFixed()
			};
			orgObj.userCount = orgUserCount;
		});


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
								"sTitle": "Mediasite_Abonnenter"
							},
							{
								"sExtends": "xls",
								"sButtonText": "Excel (.csv)",
								"sTitle": "Mediasite_Abonnenter"
							}
						]
					}
				]
			},
			// "data": subscribersObj,
			"data": UTILS.convertDataTablesData(subscribersObj), // Obj to Array
			"columns": [
				{
					"data": "org_id",
					"render": function (data, type, full, meta) {
						//	console.log('FULL: ');
						//	console.log(full)
						//	console.log('DATA: ');
						//	console.log(data);
						return full.org_id;
					}
				},
				{
					"data": "contact_person",
					"render": function (data, type, full, meta) {
						var contact;
						try {
							// TODO: POPUP WITH DETAILS
							contact = '<a class="icon ion-ios-email" href="mailto:' + (full.contact_person.e_post).toLowerCase() + '"> ' + full.contact_person.navn + '</a>';
						} catch (e) {
							contact = "<span class='label bg-red'>MANGLER!</span>";
						}
						return contact;
					}
				},
				{
					"data": "contact_support",
					"render": function (data, type, full, meta) {
						var support;
						try {
							if ((full.contact_support.e_post).indexOf('http') == -1) {
								support = '<a class="icon ion-ios-email" href="mailto:' + (full.contact_support.e_post).toLowerCase() + '"> ' + full.contact_support.navn + '</a>';
							} else {
								support = '<a class="icon ion-android-open" href="' + (full.contact_support.e_post).toLowerCase() + '" target="_blank"> ' + full.contact_support.navn + '</a>';
							}
						} catch (e) {
							support = "<span class='label bg-red'>MANGLER!</span>";
						}
						return support;
					}
				},
				{
					"data": "userCount",
					"width": "5%",
					"render": function (data, type, full, meta) {
						return full.userCount;
					}
				},
				{
					"data": "storage",
					"width": "5%",
					"render": function (data, type, full, meta) {
						return '<div class="progress no-margin">' +
							'<div class="progress-bar bg-gray tablePercentage" style="width: ' + full.storage.percentage + '%">' + full.storage.gb + '</div>' +
							'</div>';
						// return full[0].org;
					}
				},
				{
					"data": "storage",
					"width": "5%",
					"render": function (data, type, full, meta) {
						return '<span class="text-muted">' + full.storage.cost + 'kr</span>';
					}
				},
				{
					"data": "subscription_code",
					"width": "5%",
					"render": function (data, type, full, meta) {
						return "<span class='label bg-" + KIND.subscriptionCodesToColors()[full.subscription_code] + "'>" + KIND.subscriptionCodesToNames()[full.subscription_code] + "</span>";
					}
				}
			]
		});
		$('#pageSuperAdmin').find('#subscribersTableBox').find('.ajax').hide();
		return table;
	}

	/**
	 * Make the users JSON object more palatable for DataTables
	 * @param dataObject
	 * @returns {Array}
	 */
	function _convertDataTablesData(dataObject) {
		var dataArray = [];
		$.each(dataObject, function (idx, obj) {
			dataArray.push($.extend(obj, {name: idx}));
		});
		return dataArray;
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
			$.when(RELAY.orgUserListXHR(SELECTED_ORG)).then(function (usersArr){
				$.each(usersArr, function (key, userObj){
					emailList.push(userObj.displayname + ' <' + userObj.email + '>');
				});
				// Badge number in modal title
				$modal.find('#emailExportCount').html(emailList.length);
				// TextArea
				$modal.find('#emailExportList').html(emailList.toString());
			});
		}
		// Mailinglists for all subscribers selected
		else {
			var tmpContact = "";
			var nonEmailList = {'count': 0, 'orgs': ''};
			var contactObj;

			$.each(KIND.subscribers(), function (key, org) {
				// Teknisk ansvarlig or support?
				contactObj = $btnClicked.data("exportGroup") === 'kontaktpersoner' ? org.contact_person : org.contact_support;
				//
				if (contactObj !== null && (org.subscription_code == 20 || org.subscription_code == 15)) {
					if (contactObj.e_post !== null && contactObj.e_post.indexOf('http') == -1) {
						tmpContact = '<' + contactObj.e_post.trim() + '>';
						if (contactObj.navn !== null) {
							tmpContact = contactObj.navn.trim() + ' ' + tmpContact;
						}
						emailList.push(tmpContact);

					} else {
						nonEmailList.count++;
						nonEmailList.orgs += "<span class='label bg-red'>" + org.org_id + "</span> ";
					}
				} else {
					nonEmailList.count++;
					nonEmailList.orgs += "<span class='label bg-red'>" + org.org_id + "</span> ";
				}
			});
			// Badge number in modal title
			$modal.find('#emailExportCount').html(emailList.length);
			// TextArea
			$modal.find('#emailExportList').html(emailList.toString());
			// Missing contact email adress
			if (nonEmailList.count > 0) {
				$('#emailExportSuperAdminModal').find('#emailMissing').html("<span class='badge bg-red'>" + nonEmailList.count + "</span> mangler kontaktadresse: <br/>" + nonEmailList.orgs);
			}
		}
	}

	// Trigger modal
	$('.email_export').on('click', function () {
		_showEmailExportModal($(this));
	});

	/** DATA EXPORT MODAL **/
	$('#dataExportModal').on('show.bs.modal', function (event) {
		// Only do something if calling button was on superAdmin page
		if($(event.relatedTarget).data().context === 'superAdmin') {
			var $modal = $(this);
			// attr 'data-action' on buttons (Brukere || Opptak)
			var exportGroup = $(event.relatedTarget).data().action;
			//
			APP.jsonEditor().setName(exportGroup);
			APP.jsonEditor().set('Henter data, vennligst vent...');

			// Find selected export group
			switch (exportGroup) {
				case 'Brukere':
					$modal.find('.modal-title').html('<i class="ion ion-ios-people"></i> Eksporter metadata for alle <strong>brukere</strong>');
					$modal.find('#legend_users').fadeIn();
					$.when(RELAY.orgUserListXHR(SELECTED_ORG)).then(function (orgUserList){
						APP.jsonEditor().set(orgUserList);
					});
					break;
				case 'Opptak':
					$modal.find('.modal-title').html('<i class="ion ion-ios-film"></i> Eksporter metadata for alle <strong>opptak</strong>');
					$modal.find('#legend_users').hide();
					$.when(RELAY.orgPresentationListXHR(SELECTED_ORG)).then(function (orgPresentationList){
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











