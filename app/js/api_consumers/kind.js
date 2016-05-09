/**
 * API Consumer.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var KIND = (function () {
	
	var subscribersObj = {};  // Object with all subscriber data from Kind sorted by org

	var XHR_KIND;

	// Autorun
	(function () {
		// Check subsciber info when we know who the user is
		$.when(DATAPORTEN.readyUser()).done(function () {
			XHR_KIND = _getServiceSubscribers();
		});
	})();


	function _getServiceSubscribers() {
		var route = 'service/' + DP_AUTH.config().kind.relayID + '/subscribers/';
		
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.kind + route,
			dataType: 'json'
		})
			.then(function (response, status, res) {
				// Check for and catch errors before done is fired
				if (!response.status || $.isEmptyObject(response.data)) {
					return $.Deferred().reject(res, status, "Henting av tjenestetilganger (KIND) feilet.").promise();
				}
				// All good - process a few things here before done is fired...
				subscribersObj = response.data;
				//
				if (!KIND.isSubscriber()) {
					return $.Deferred().reject(res, status, "Din org abonnerer ikke p&aring; tjenesten.").promise();
				}
				// Success
				return $.Deferred().resolve(subscribersObj, status, res).promise();
			})
			.done(function (data) {
				UTILS.updateAuthProgress("Tjenestetilganger");
				UTILS.showAuthInfo("Tjenestetilgang", 'Abonnent');
				UTILS.showAuthInfo("SuperAdmin", KIND.isSuperAdmin());
				UTILS.showAuthInfo("OrgAdmin", KIND.isOrgAdmin());
			})
			.fail(function (jqXHR, textStatus, error) {
				UTILS.showAuthError("Tjenestetilganger", error);
			});
	}
	
	// Details for logged on user's org
	function getSubscriberDetails() {
		return KIND.subscribers()[DATAPORTEN.user().org.id];
	}
	
	// 1D Array with org names
	function getSubscribingOrgNames(){
		// var orgs = [];
		// $.each(KIND.subscribers(), function(index, org){  orgs.push(org.org_id);  });
		//return orgs;
		return Object.keys(KIND.subscribers());
	}

	/**
	 * 1. Get an a account for type/number of subscriptions/subscribers in KIND.
	 * 2. Get a sorted list of all subscribers
	 */
	function getSubscriptionCount() {
		var count = { 'total': 0, 'full': 0, 'trial': 0, 'other': 0 };
		$.each(KIND.subscribers(), function (index, org) {
			switch (org.subscription_code) {
				case 20: count.full++; break;
				case 15: count.trial++; break;
				case 10: count.trial++; break; // Bestilt
				default: count.other++; break;
			}
			count.total++;
		});
		return count;
	}

	//
	function isSuperAdmin() {
		return (DATAPORTEN.user().username.indexOf("@uninett.no") > -1);
	}

	//
	function isOrgAdmin() {
		if ($.isEmptyObject(KIND.subscriberDetails())) {
			return false;
		} else {
			return (DATAPORTEN.user().email.indexOf(KIND.subscriberDetails().contact_person.e_post.toLowerCase()) > -1);
		}
	}

	//
	function getRole() {
		if (isSuperAdmin()) return 'SuperAdmin';
		if (isOrgAdmin()) return 'OrgAdmin';
		return 'Bruker';
	}

	// 404 if no subscription code from Kind.
	function getOrgSubscriptionStatusCode(requestedOrg) {
		return KIND.subscribers()[requestedOrg].subscription_code || 404;
	}
	

	return {
		ready: function () {
			return XHR_KIND;
		},
		subscribers: function () {
			return subscribersObj;
		},
		subscriptionCount: function () {
			return getSubscriptionCount();
		},
		subscribingOrgNames: function () {
			return getSubscribingOrgNames();
		},
		isSubscriber: function () {
			return !$.isEmptyObject(KIND.subscriberDetails());
		},
		subscriberDetails: function () {
			return getSubscriberDetails();
		},
		isAdmin: function () {
			return KIND.isSuperAdmin() || KIND.isOrgAdmin();
		},
		isSuperAdmin: function () {
			return isSuperAdmin();
		},
		isOrgAdmin: function () {
			return isOrgAdmin();
		},
		role: function () {
			return getRole();
		},
		
		
		orgSubscriptionStatusCode: function (requiredOrg) {
			return getOrgSubscriptionStatusCode(requiredOrg);
		},


		subscriptionCodesToNames: function () {
			var codes =
			{
				x: ' --- ', 			// Mangler status
				10: 'Bestilt',		    // Bestilt
				15: 'Utprøving',	    // Demo
				20: 'Abonnent',         // Installert
				30: 'Avbestilt',		// Avbestilt
				40: 'Stengt',		    // Nedkoblet
				50: 'Utfasing',         // Fjernes
				404: 'Ukjent'           // Kind vil aldri sende denne, brukes dersom org ikke ble funnet
			};
			return codes;
		},
		subscriptionCodesToColors: function () {
			var codes =
			{
				x: 'red', 			// Mangler status
				10: 'blue',   		// Bestilt
				15: 'orange',       // Demo
				20: 'green',        // Installert
				30: 'red',	    	// Avbestilt
				40: 'red',    	    // Nedkoblet
				50: 'red', 	        // Fjernes
				404: 'red'          // Kind vil aldri sende denne, brukes dersom org ikke ble funnet
			};
			return codes;
		}
	}
})();






