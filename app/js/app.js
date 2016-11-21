/**
 * Application "bootstrapper".
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var APP = (function () {

	var jsonEditor;

	// Startup
	$(document).ready(function () {
		// Single instance, shared by all
		jsonEditor = new JSONEditor(document.getElementById('jsonDataExport'), {
			"modes": ["view", "text"],
			"mode": "text",
			"search": true,
			"indentation": 4
		});

		updateUIAll();
		// Call important endpoints in sequence: these make part of the login-process
		$.when(DATAPORTEN.READY()).done(function () {
			updateUIFeide();
			// If user is some sort of admin
			if (DATAPORTEN.isOrgAdmin() || DATAPORTEN.isSuperAdmin()) {
				// Fetch global Relay info for admins
				RELAY.init();
				//
				$.when(RELAY.ready()).done(function () {
					MENU.init();
					updateUIRelay();
				});
			} else {

				UTILS.showAuthError("Nektet tilgang", "Du mangler brukerkonto og er ikke administrator for tjenesten. Du kan <a href='" + CONFIG.RELAY_REGISTER_URL() + "' target='_blank' class='text-light-blue'>opprette konto her</a>.")
				return false;
			}
		});
	});


	function updateUIAll() {
		//
		$('span.supportEmail').html(CONFIG.RELAY_SUPPORT_EMAIL());
		//
		$('span.relaySupportURL').html(CONFIG.RELAY_SUPPORT_URL());
		$('a.relaySupportURL').attr("href", CONFIG.RELAY_SUPPORT_URL());
		//
		$('span.relayServiceURL').html(CONFIG.RELAY_SERVICE_URL());
		$('a.relayServiceURL').attr("href", CONFIG.RELAY_SERVICE_URL());
		$('span.screencastBaseURL').html(CONFIG.SCREENCAST_BASE_URL());
		$('a.screencastBaseURL').attr("href", CONFIG.SCREENCAST_BASE_URL());

		$('a.relayRegisterURL').attr("href", CONFIG.RELAY_REGISTER_URL());
		$('a.relayClientDownloadURL').attr("href", CONFIG.RELAY_CLIENT_DOWNLOAD_URL());
	}

	/**
	 * Update UI here and there...
	 */
	function updateUIFeide() {
		// User-specific
		$('.userFirstName').html(' ' + DATAPORTEN.user().name.first);
		$('.userFullName').html(' ' + DATAPORTEN.user().name.full);
		$('.feideOrg').html(' ' + DATAPORTEN.user().org.name);
		$('.userRole').html(' ' + DATAPORTEN.user().role.title);
		$('.feideAffiliation').html(' ' + (DATAPORTEN.user().affiliation == "employee") ? " Ansatt" : " Student");
		$('.userImage').attr('src', DATAPORTEN.user().photo);
		// Dev
		$('#dataportenSessionInfo').text(JSON.stringify(DATAPORTEN.user(), undefined, 2));
		// Show top logout dropdown
		$('#userMenu').fadeIn().removeClass('hidden');
	}

	/**
	 * Each data fragment comes from separate API calls. Update continuously
	 * as soon as calls are done.
	 */
	function updateUIRelay() {

		$('.homeOrgUserCount').html(RELAY.orgUserCount(DATAPORTEN.user().org.id));
		$('.subscribersCount').html(RELAY.orgCount());


		// Invoicing
		$('.storageCostPerTB').html(RELAY.storageCostTB());
		// Users count
		$.when(RELAY.usersTotalCountXHR()).done(function (users) {
			$('.globalUsersCountTotal').html(parseInt(users.total));
			$('.globalUsersCountByAffiliation').html(parseInt(users.employees.total) + ' ansatte og ' + parseInt(users.students.total) + ' studenter');
			$('.globalActiveUsersCountTotal').html(parseInt(users.active));
			$('.globalActiveUsersCountByAffiliation').html(parseInt(users.employees.active) + ' ansatte og ' + parseInt(users.students.active) + ' studenter');
		});
		// Presentation count
		$.when(RELAY.presentationsTotalXHR()).done(function (presentations) {
			$('.globalPresentationCount').html(presentations);
		});
		// Service storage
		$.when(RELAY.serviceStorageXHR()).done(function (total_mib) {
			$('.subscribersDiskusageTotal').html(UTILS.mib2tb(total_mib).toFixed(2) + "TB");
		});
		// Server version
		$.when(RELAY.serviceInfoXHR()).done(function (info) {
			$('.relayVersion').html(info.version.versValue);
			// UPDATE 29.09.2016: Switched to using PDO in API, now the date is returned as: 2016-08-09 12:15:08
			var d = (info.version.createdOn.split(' ')[0]).split('-');
			$('.relayLastUpgrade').html(d[2] + '.' + d[1] + '.' + d[0]);
			$('.relayWorkers').html(info.workers.length);
		});
		$('#pageDashboard').find('#serverInfo').find('.ajax').hide();

	}


	// Dynamically add tooltip for overflowed text (requires class mightOverflow on element)
	$(document).on('mouseenter', '.mightOverflow', function () {
		var $t = $(this);
		var title = $t.attr('title');
		if (!title) {
			if (this.offsetWidth < this.scrollWidth) $t.attr('title', $t.text())
		} else {
			if (this.offsetWidth >= this.scrollWidth && title == $t.text()) $t.removeAttr('title')
		}
	});


	return {
		jsonEditor: function () {
			return jsonEditor;
		}
	}
})();
