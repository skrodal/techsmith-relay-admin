/**
 * API Consumer for Relay (OrgAdmin scope).
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var RELAY_ORG = (function () {
	var XHR_USERS;
	var XHR_PRESENTATIONS;
	var XHR_HITS;

	// Autorun
	(function () {
		$.when(DATAPORTEN.READY()).done(function () {
			if (DATAPORTEN.isSuperAdmin() || DATAPORTEN.isOrgAdmin()) {
				XHR_USERS = _getUsers();
				XHR_PRESENTATIONS = _getOrgPresentations();
				XHR_HITS = _getUsersHitsXHR();
			}
		});
	})();

	function _getOrgPresentations() {
		return RELAY._getAPI("org/" + DATAPORTEN.user().org.id + "/presentations/");
	}
	function _getUsers() {
		return RELAY._getAPI("org/" + DATAPORTEN.user().org.id + "/users/");
	}

	function _getUsersHitsXHR() {
		return RELAY._getAPI("org/" + DATAPORTEN.user().org.id + "/presentations/hits/users/");
	}

	return {
		usersPresentationsXHR: function () {
			return XHR_PRESENTATIONS;
		},
		usersXHR: function () {
			return XHR_USERS;
		},
		usersHitsXHR: function () {
			return XHR_HITS;
		}
	}
})();






