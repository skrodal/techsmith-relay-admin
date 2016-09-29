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
		$.when(DATAPORTEN.readyUser()).done(function () {
			$.when(DATAPORTEN.readyGroups()).done(function () {
				$.when(DATAPORTEN.readyUserRole()).done(function () {
					updateUIFeide();
					$.when(KIND.ready()).done(function () {
						updateUIKind();
						$.when(RELAY_USER.accountXHR()).done(function () {
							updateUIRelayUser();
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
								// Not even a user account - stop here!
								if (!RELAY_USER.hasAccount()) {
									UTILS.showAuthError("Manglende tilgang", "Du mangler brukerkonto og er ikke administrator for tjenesten. Tilgang er derfor sperret.")
									return false;
								}
								// Only My Relay
								MENU.init();
							}
						}); // relay
					});	// kind
			    });	// userRole
			});	// groups
		}); // user
	});


	function updateUIAll(){
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
		$('.feideAffiliation').html(' ' + (DATAPORTEN.user().affiliation == "employee") ? " Ansatt" : " Student");
		$('.userImage').attr('src', DATAPORTEN.user().photo);
		// Dev
		$('#dataportenSessionInfo').text(JSON.stringify(DATAPORTEN.user(), undefined, 2));
		// Show top logout dropdown
		$('#userMenu').fadeIn().removeClass('hidden');
	}

	function updateUIKind() {
		$('.userRole').html(' ' + DATAPORTEN.userRole());
		$('.subscribersCount').html(KIND.subscriptionCount().full);
		$('.subscribersTrialCount').html(KIND.subscriptionCount().trial);
		$('.subscribersOtherCount').html(KIND.subscriptionCount().other);
		$('.subscribersTotalCount').html(KIND.subscriptionCount().total);

		var supportEmail, supportName, supportPhone, supportMobile = false;

		if (KIND.subscriberDetails().contact_support) {
			supportName = KIND.subscriberDetails().contact_support.navn || null;
			supportPhone = KIND.subscriberDetails().contact_support.direkte_telefon || 'mangler';
			supportMobile = KIND.subscriberDetails().contact_support.mobil_telefon || 'mangler';

			// Can be URL or email... or not set...
			supportEmail = KIND.subscriberDetails().contact_support.e_post || false;
			if (supportEmail !== false) {
				// URL or email?
				supportEmail.indexOf('@') > 0 ?
						supportEmail = '<a href="mailto:' + supportEmail + '" class="text-navy">Send epost</a>' :
						supportEmail = '<a href="' + supportEmail + '" target="_blank" class="text-blue">G&aring; til nettsted</a> ';
			}

			// Sidebar
			$('#supportDetails').html(
					'<h4>Ditt supportpunkt: </h4>' +
					'<p class="bold">' + supportName + '</p>' +
					'<p>' + supportEmail + '</p>' +
					'<p>Tlf: ' + supportPhone + '</p>' +
					'<p>Mobil: ' + supportMobile + '</p>'
			);
		} else {
			$('#supportDetails').html(
					'<h4>Ditt supportpunkt</h4>' +
					'<p>Vi har dessverre ikke registrert noe kontaktpunkt for ditt lærested. Dersom du trenger bistand, forsøk IT-helpdesk for din avdeling.</p>'
			);
		}


	}


	/**
	 * Each data fragment comes from separate API calls. Update continuously
	 * as soon as calls are done.
	 */
	function updateUIRelay() {
		// Invoicing
		$('.storageCostPerTB').html(RELAY.storageCostTB());
		// Users count
		$.when(RELAY.usersTotalXHR()).done(function (users) {
			$('.globalUsersCountTotal').html(users.employees + users.students);
			$('.globalUsersCountByAffiliation').html(users.employees + ' ansatte og ' + users.students + ' studenter');
		});
		$.when(RELAY.usersTotalActiveXHR()).done(function (users) {
			$('.globalActiveUsersCountTotal').html(users.employees + users.students);
			$('.globalActiveUsersCountByAffiliation').html(users.employees + ' ansatte og ' + users.students + ' studenter');
		});
		// Presentation count
		$.when(RELAY.presentationsTotalXHR()).done(function (presentations) {
			$('.globalPresentationCount').html(presentations);
		});
		// Org info
		$.when(RELAY.serviceStorageXHR()).done(function (total_mib) {
			$('.subscribersDiskusageTotal').html(UTILS.mib2tb(total_mib).toFixed(2) + "TB");
		});
		// User count home org
		$.when(RELAY.ready()).done(function () {
			$('.homeOrgUserCount').html(RELAY.orgUserCount(DATAPORTEN.user().org.id));
		});

		// Server version
		$.when(RELAY.serviceVersionXHR()).done(function (version) {
			$('.relayVersion').html(version.versValue);
			// API returns the worst formatted date string (e.g "Aug  9 2016 12:15:08:940PM") when using MSSQL
			//var updated = version.createdOn.split(/\s+/);
			//$('.relayLastUpgrade').html(updated[0] + ' ' + updated[1] + ' ' + updated[2]);
			// UPDATE 29.09.2016: Switched to using PDO in API, now the date is returned as: 2016-08-09 12:15:08
			var d = (version.createdOn.split(' ')[0]).split('-');
			$('.relayLastUpgrade').html(d[2]+'.'+d[1]+'.'+d[0]);
		});

		// Server version
		$.when(RELAY.serviceWorkersXHR()).done(function (workers) {
			$('.relayWorkers').html(workers);
		});

		$('#pageDashboard').find('#serverInfo').find('.ajax').hide();

	}


	function updateUIRelayUser() {
		// TODO: Something on dashboard about user account

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


/*
 // SUPER ADMIN
 if (is_super_admin) {
 org_active_subscribers = getActiveSubscribersCount(SUBSCRIBERS_KIND_ARR);
 buildSubscribersTable(SUBSCRIBERS_KIND_ARR);
 populateSubscribersDropdown(SUBSCRIBERS_KIND_ARR);
 }
 */