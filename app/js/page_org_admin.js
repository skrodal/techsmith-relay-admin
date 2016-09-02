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
	 * Called by MENU which checks that necessary data is available
	 */
	function init() {
		_updateOrgAdminKindUI();
		_buildUserTable();
		USER_ORG_ID = DATAPORTEN.user().org.id;
		USER_ORG_NAME = DATAPORTEN.user().org.shortname;
	}

	function onShowListener() {
		$.when(RELAY.ready().done(function () {
			chartOrgUsageLine = _buildOrgPresentationLineChart();
		}));
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

		// -- QUICKSTATS
		$.when(RELAY_ORG.users()).done(function (users) {
			$('#pageOrgAdmin').find('.orgUserCount').text(users.length);
		});

		$.when(RELAY_ORG.diskUsage()).done(function (usage) {
			$('#pageOrgAdmin').find('.orgDiskUsage').text(UTILS.mib2gb(usage.total_mib).toFixed(2) + "GB");
			$('#pageOrgAdmin').find('.orgDiskUsageDate').text(UTILS.timestamp2date(usage.storage[usage.storage.length - 1].date.sec));
			$('#pageOrgAdmin').find('.orgStorageCostEstimate').text("kr. " + (UTILS.mib2tb(usage.total_mib) * RELAY.storageCostTB()).toFixed());
		});

		$.when(DATAPORTEN.orgAdminInvitationLinkXHR()).done(function (link) {
			$('#pageOrgAdmin').find('.orgAdminGroupLink').text(link);
		});

		$.when(RELAY_ORG.presentationCount()).done(function (presCount) {
			$('#pageOrgAdmin').find('.orgPresentationCount').text(presCount);
		});

		// Number of dates available in org's storage history (max 30 days)
		$('#pageOrgAdmin').find('.orgRecordedDatesNum').text(ORG_RECORDED_DATES_NUM);
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

	/** USER DETAILS MODAL **/
	$('#userDetailsModal').on('show.bs.modal', function (event) {
		var userDetailsLink = $(event.relatedTarget);            // Table button that triggered the modal
		var userName = userDetailsLink.data('username');
		var presentationCount = userDetailsLink.data('presentationcount'); // Extract info from data-* attributes
		var presentationDeletedCount = userDetailsLink.data('presentationdeletedcount'); // Extract info from data-* attributes
		var hits = userDetailsLink.data('hits'); // Extract info from data-* attributes
		// Update the modal's content.
		var modal = $(this);

		modal.find('#fullName').text(userDetailsLink.data('fullname'));
		modal.find('#userInfo').html(
			'<p>Brukernavn: <code>' + userName + '</code></p>' +
			'<p>Epost: <code>' + userDetailsLink.data('email') + '</code> </p>'
		);

		modal.find('#jsonUserPresentations').empty();
		modal.find('#footerText').empty();

		var jsonEditorUserDetails = new JSONEditor(document.getElementById('jsonUserPresentations'), { "modes": ["view", "text"], "mode": "text", "search": true, "indentation": 4 });

		// Get presentation metadata for user
		$.when(RELAY_ORG.userContent(userName, false)).done(function (user) {
			jsonEditorUserDetails.set(user);
			jsonEditorUserDetails.setName(userName);

			if (presentationDeletedCount == 0) {
				modal.find('#footerText').html('Presentasjoner: <span class="badge bg-green">' + presentationCount + '</span>');
			} else {
				modal.find('#footerText').html('Presentasjoner: <span class="badge bg-green">' + (presentationCount + presentationDeletedCount) + '</span> ( av disse er <span class="badge bg-red">' + presentationDeletedCount + '</span> slettet )');
			}
		}).fail(function () {
			modal.find('#jsonUserPresentations').html('<div class="alert alert-warning" role="alert">Bruker <code>' + userName + '</code> har ingen presentasjoner.</div>');
		});
	});

	/** EMAIL EXPORT MODAL **/
	$('#emailExportOrgAdminModal').on('show.bs.modal', function (event) {
		var emailList = [];
		$.each(USER_LIST, function (userName, userObj) {
			emailList.push(userObj.displayName + ' <' + userObj.email + '>');
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

			$.when(RELAY_ORG.users(), RELAY_ORG.presentations()).done(function (usersArr, presentationsArr) {
				// Find selected export group
				switch (exportGroup) {
					case 'Brukere':
						$modal.find('.modal-title').html('<i class="ion ion-ios-people"></i> Eksporter metadata for alle <strong>brukere</strong>');
						$modal.find('#legend_users').fadeIn();
						APP.jsonEditor().set(USER_LIST);
						break;
					case 'Opptak':
						$modal.find('.modal-title').html('<i class="ion ion-ios-film"></i> Eksporter metadata for alle <strong>opptak</strong>');
						$modal.find('#legend_users').hide();
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
		var presentationDeletedCount = 0;
		var presentationTotalDurationSec = 0;
		var orgDiskusageMiB = 0;
		var orgHits = 0;
		var employeeCount = 0;
		var studentCount = 0;

		$.when(RELAY_ORG.users(), RELAY_ORG.presentations()).done(function (usersArr, presentationsArr) {
			var affiliation;
			userCount = usersArr.length;
			// Populate users object
			$.each(usersArr, function (index, userObj) {
				// Set affiliation
				switch (userObj.affiliation.toLowerCase()) {
					case "ansatt":
						employeeCount++;
						affiliation = "ansatt";
						break;
					case "student":
						studentCount++;
						affiliation = "student";
						break;
					default:
						affiliation = '---';
				}

				USER_LIST[userObj.username] =
				{
					displayName: userObj.displayname,
					email: userObj.email,
					org: userObj.org,
					affiliation: affiliation,
					status: userObj.status,
					userName: userObj.username,
					userNameOnDisk: userObj.usernameOnDisk,
					hits: 0,
					diskusageMiB: 0,
					presentationDurationTotalSec: 0,
					presentationCount: 0,
					presentationDeletedCount: 0
				};
			});

			// Add data accumulated from presentations
			$.each(presentationsArr, function (index, value) {
				// In test with .hibu.no, I found that content existed for heaps of old users NO longer in users_arr...
				// Hence, make sure user exist in user object before assigning presentation values.
				if (USER_LIST[value.username]) {
					// Presentation is NOT deleted
					if (value.is_deleted !== 1) {
						// Update USER totals
						USER_LIST[value.username].presentationCount++;
						presentationCount++;
						USER_LIST[value.username].presentationDurationTotalSec += value.duration_s;
						USER_LIST[value.username].diskusageMiB += value.size_mib;
						// TODO: Update when IIS harvest is in place.
						// USERLIST[value.username].hits += value.hits;

						// Update ORG totals
						presentationTotalDurationSec += value.duration_s;
						orgDiskusageMiB += value.size_mib;
						// TODO: Update when IIS harvest is in place.
						// orgHits += value.hits;
					} else {
						USER_LIST[value.username].presentationDeletedCount++;
						presentationDeletedCount++;
					}
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
						"data": "displayName",
						"render": function (data, type, full, meta) {
							return '<a style="cursor:context-menu;" class="userTableMoreInfo" data-toggle="modal" data-target="#userDetailsModal" data-fullname="' + full.displayName + '" data-username="' + full.userName + '" data-email="' + full.email + '" data-presentationcount="' + full.presentationCount + '" data-presentationdeletedcount="' + full.presentationDeletedCount + '" data-hits="' + full.hits + '">' + data + '</a>';
						}
					},
					{
						"data": "affiliation"
					},
					{
						"data": "presentationCount"
					},
					{
						"data": "presentationDeletedCount"

					},
					{
						"data": "presentationDurationTotalSec",
						"render": function (data, type, full, meta) {
							return UTILS.secToTime(data);
						}
						//"width" : "10%"
					},
					{
						"data": "diskusageMiB",
						"render": function (data, type, full, meta) {
							return data.toFixed(2);
						}
					},
					{
						"data": "hits",
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
			$org_table.find('.th-presentations').html("<span class='label label-default'><i class='ion ion-ios-film'></i> = " + presentationCount + "</span>");

			$org_table.find('.th-deleted').html("<span class='label label-default'><i class='ion ion-android-delete'></i> = " + presentationDeletedCount + "</span>");
			$org_table.find('.th-duration').html("<span class='label label-default'><i class='ion ion-ios-clock'></i> = " + UTILS.secToTimeAndDays(presentationTotalDurationSec) + "</span>");
			$org_table.find('.th-diskusage').html("<span class='label label-default'><i class='ion ion-android-upload'></i> = " + UTILS.mib2gb(orgDiskusageMiB).toFixed(2) + 'GB' + "</span>");
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


	function _updateOrgAdminKindUI() {
		var tabs = '&nbsp;&nbsp;&nbsp;';
		var contactName = KIND.subscriberDetails().contact_person.navn !== "" ? KIND.subscriberDetails().contact_person.navn : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';
		var contactEmail = KIND.subscriberDetails().contact_person.e_post !== "" ? KIND.subscriberDetails().contact_person.e_post : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';
		var contactPhone = KIND.subscriberDetails().contact_person.direkte_telefon !== "" ? KIND.subscriberDetails().contact_person.direkte_telefon : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';
		var contactMobile = KIND.subscriberDetails().contact_person.mobil_telefon !== "" ? KIND.subscriberDetails().contact_person.mobil_telefon : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';
		var supportName = KIND.subscriberDetails().contact_support.navn !== "" ? KIND.subscriberDetails().contact_support.navn : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';
		var supportEmail = KIND.subscriberDetails().contact_support.e_post !== "" ? KIND.subscriberDetails().contact_support.e_post : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';
		var supportPhone = KIND.subscriberDetails().contact_support.direkte_telefon !== "" ? KIND.subscriberDetails().contact_support.direkte_telefon : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';
		var supportMobile = KIND.subscriberDetails().contact_support.mobil_telefon !== "" ? KIND.subscriberDetails().contact_support.mobil_telefon : '<span class="label label-warning icon ion-android-warning"> Mangler</span>';

		//SUBSCRIBER_ORG_DETAILS_OBJ
		$('.serviceContact').html('<p>' +
			tabs + '<i class="icon ion-android-person text-muted"></i>&nbsp;&nbsp;' + contactName + '<br>' +
			tabs + '<i class="icon ion-ios-email text-muted"></i>&nbsp;&nbsp;' + contactEmail + '<br>' +
			tabs + '<i class="icon ion-ios-telephone text-muted"></i>&nbsp;&nbsp;' + contactPhone + '<br>' +
			tabs + '<i class="icon ion-android-phone-portrait text-muted"></i>&nbsp;&nbsp;' + contactMobile +
			'</p>'
		);
		$('.serviceSupport').html('<p>' +
			tabs + '<i class="icon ion-help-buoy text-muted"></i>&nbsp;&nbsp;' + supportName + '<br>' +
			tabs + '<i class="icon ion-ios-email text-muted"></i>&nbsp;&nbsp;' + supportEmail + '<br>' +
			tabs + '<i class="icon ion-ios-telephone text-muted"></i>&nbsp;&nbsp;' + supportPhone + '<br>' +
			tabs + '<i class="icon ion-android-phone-portrait text-muted"></i>&nbsp;&nbsp;' + supportMobile +
			'</p>'
		);
		$('.serviceUrl').html('<p>' +
			tabs + '<i class="icon ion-link text-muted"> </i> ' + KIND.subscriberDetails().service_uri +
			'</p>'
		);
		$('.subscriptionStatus').html('<span class="label bg-' + KIND.subscriptionCodesToColors()[KIND.subscriberDetails().subscription_cide] + '">' + KIND.subscriptionCodesToNames()[KIND.subscriberDetails().subscription_code] + '</span>');
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
		}
	}
})();





