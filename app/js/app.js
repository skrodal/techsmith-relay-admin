/**
 * Application "bootstrapper"
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var APP = (function() {
	//
	$(document).ready(function () {

		$.when(FEIDE_CONNECT.readyUser()).done(function(){
			$.when(FEIDE_CONNECT.readyGroups()).done(function(){
				// Always
				updateUIFeide();
				//
				$.when(KIND.ready()).done(function(){
					// Always
					updateUIKind();
					//
					$.when(RELAY_USER.accountXHR()).done(function(){
						// Always
						updateUIRelayUser();
						// If user is some sort of admin
						if(KIND.isAdmin()){
							// Fetch global Relay info
							RELAY.init();
							//
							$.when(RELAY.ready()).done( function(){
								MENU.init();
								updateUIRelay();
							});
						} else {
							// Not even a user account - stop here!
							if(!RELAY_USER.hasAccount()){
								UTILS.showAuthError("Manglende tilgang", "Du mangler brukerkonto og er ikke administrator for tjenesten. Tilgang er derfor sperret.")
								return false;
							}
							MENU.init();
						}
					}); // relay
				});	// kind
			});	// groups
		}); // user


	});


	/**
	 * Update UI here and there...
	 */
	function updateUIFeide() {
		// User-specific
		$('.userFirstName').html(' ' + FEIDE_CONNECT.user().name.first);
		$('.userFullName').html(' ' + FEIDE_CONNECT.user().name.full);
		$('.feideOrg').html(' ' + FEIDE_CONNECT.user().org.name);
		$('.feideAffiliation').html(' ' + (FEIDE_CONNECT.user().affiliation == "employee") ? " Ansatt" : " Student");
		$('.userImage').attr('src', FEIDE_CONNECT.user().photo);
		// Dev
		$('#connectSessionInfo').text(JSON.stringify(FEIDE_CONNECT.user(), undefined, 2));
		// Show top logout dropdown
		$('#userMenu').fadeIn().removeClass('hidden');
	}

	function updateUIKind(){
		$('.userRole').html(' ' + KIND.role());
		$('.subscribersCount').html(KIND.subscriptionCount().full);
		$('.subscribersTrialCount').html(KIND.subscriptionCount().trial);
		$('.subscribersOtherCount').html(KIND.subscriptionCount().other);
		$('.subscribersTotalCount').html(KIND.subscriptionCount().total);

		// e_post can be URL or email... or not set...
		var epost = KIND.subscriberDetails().contact_support.e_post || false;
		if (epost !== false) {
			// URL or email?
			epost.indexOf('@') > 0 ?
				epost = '<a href="mailto:' + epost + '" class="text-navy">Send epost</a>' :
				epost = '<a href="' + epost + '" target="_blank" class="text-blue">G&aring; til nettsted</a> ';
		}

		// Sidebar
		$('#supportDetails').html(
			'<h4>Ditt supportpunkt: </h4>' +
				(KIND.subscriberDetails().contact_support.navn == undefined ? '' : '<p class="bold">' + KIND.subscriberDetails().contact_support.navn + '</p>') +
				'<p>' + epost + '</p>' +
				(KIND.subscriberDetails().contact_support.mobil_telefon == undefined ? '' : '<p>Mobil: ' + KIND.subscriberDetails().contact_support.mobil_telefon + '</p>') +
				(KIND.subscriberDetails().contact_support.direkte_telefon == undefined ? '' : '<p>Direkte: ' + KIND.subscriberDetails().contact_support.direkte_telefon + '</p>')
		);
	}


	/**
	 * Each data fragment comes from separate API calls. Update continuously
	 * as soon as calls are done.
	 */
	function updateUIRelay(){
		// Invoicing
		$('.storageCostPerTB').html(RELAY.storageCostTB());
		// Users count
		$.when(RELAY.usersTotalXHR()).done(function(users){
			$('.globalUsersCount').html(users.employees + '/' + users.students);
		});
		$.when(RELAY.usersTotalActiveXHR()).done(function(users){
			$('.globalActiveUsersCount').html(users.employees + '/' + users.students);
		});
		// Presentation count
		$.when(RELAY.presentationsTotalXHR()).done(function(presentations){
			$('.globalPresentationCount').html(presentations);
		});
		// Org info
		$.when(RELAY.serviceStorageXHR()).done(function(total_mib){
			$('.subscribersDiskusageTotal').html(UTILS.mib2tb( total_mib ).toFixed(2) + "TB");
		});
		// User count home org
		$.when(RELAY.ready()).done(function(){
			$('.homeOrgUserCount').html(RELAY.orgUserCount(FEIDE_CONNECT.user().org.id));
		});

		// Server version
		$.when(RELAY.serviceVersionXHR()).done(function(version){
			$('.relayVersion').html(version);
		});

		// Server version
		$.when(RELAY.serviceWorkersXHR()).done(function(workers){
			$('.relayWorkers').html(workers);
		});

		$('#pageDashboard').find('#serverInfo').find('.ajax').hide();

	}



	function updateUIRelayUser(){
		// TODO: Something on dashboard about user account
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