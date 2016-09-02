/**
 * API Consumer for Relay (OrgAdmin scope).
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var RELAY_ORG = (function () {
	var XHR_DISKUSAGE;
	var XHR_USERS;
	var XHR_PRESENTATIONS;
	var XHR_PRESENTATION_COUNT;


	// Autorun
	(function () {
		$.when(DATAPORTEN.readyUser()).done(function(){
			$.when(KIND.ready()).done(function(){
				if(DATAPORTEN.isSuperAdmin() || DATAPORTEN.isOrgAdmin()){
					XHR_DISKUSAGE = _getDiskusage();
					XHR_USERS = _getUsers();
					XHR_PRESENTATIONS = _getPresentations();
					XHR_PRESENTATION_COUNT = _getPresentationCount();
				}
			});
		});
	})();

	function _getDiskusage(){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + DATAPORTEN.user().org.id + "/diskusage/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (diskusage):", "Finner ingen lagringspunkt for org <code>" + DATAPORTEN.user().org.id + "</code>");
		});
	}

	function _getPresentations(){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + DATAPORTEN.user().org.id + "/presentations/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentations):", "Finner ingen presentasjoner for org  <code>" + DATAPORTEN.user().org.id + "</code>");
		});
	}

	function _getPresentationCount(){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + DATAPORTEN.user().org.id + "/presentations/count/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentations):", "Finner ingen presentasjoner for org  <code>" + DATAPORTEN.user().org.id + "</code>");
		});
	}

	function _getUsers(){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + DATAPORTEN.user().org.id + "/users/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (users):", "Finner ingen brukere for org <code>" + DATAPORTEN.user().org.id + "</code>");
		});
	}


	function getUser(user){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + DATAPORTEN.user().org.id + "/user/" + user + "/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Finner ikke bruker", "Finner ikke bruker <code>" + user + "</code>");
		});
	}

	function getUserContent(user, showAlert){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + DATAPORTEN.user().org.id + "/user/" +  user + "/presentations/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			if(showAlert)
				UTILS.alertError("Finner ikke innhold", "Finner ikke noe innhold for bruker <code>" + user + "</code>");
		});
	}

	return {
		diskUsage: function(){
			return !DATAPORTEN.isOrgAdmin() || XHR_DISKUSAGE;
		},
		presentations: function(){
			return XHR_PRESENTATIONS;
		},
		presentationCount: function(){
			return XHR_PRESENTATION_COUNT;
		},
		user: function(user) {
			return !DATAPORTEN.isOrgAdmin() || getUser(user);
		},
		userContent: function(user, showAlert) {
			return !DATAPORTEN.isOrgAdmin() || getUserContent(user, showAlert);
		},
		users: function(){
			return !DATAPORTEN.isOrgAdmin() || XHR_USERS;
		}
	}
})();






