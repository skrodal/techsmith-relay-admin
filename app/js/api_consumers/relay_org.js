/**
 * API Consumer.
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
		$.when(FEIDE_CONNECT.readyUser()).done(function(){
			$.when(KIND.ready()).done(function(){
				if(KIND.isAdmin()){
					XHR_DISKUSAGE = _getDiskusage();
					XHR_USERS = _getUsers();
					XHR_PRESENTATIONS = _getPresentations();
					XHR_PRESENTATION_COUNT = _getPresentationCount();
				}
			});
		});
	})();

	function _getDiskusage(){
		return jso.ajax({url: jso.config.get("endpoints").relay + "org/" + FEIDE_CONNECT.user().org.id + "/diskusage/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (diskusage):", "Finner ingen lagringspunkt for org <code>" + FEIDE_CONNECT.user().org.id + "</code>");
		});
	}

	function _getPresentations(){
		return jso.ajax({url: jso.config.get("endpoints").relay + "org/" + FEIDE_CONNECT.user().org.id + "/presentations/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentations):", "Finner ingen presentasjoner for org  <code>" + FEIDE_CONNECT.user().org.id + "</code>");
		});
	}

	function _getPresentationCount(){
		return jso.ajax({url: jso.config.get("endpoints").relay + "org/" + FEIDE_CONNECT.user().org.id + "/presentations/count/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentations):", "Finner ingen presentasjoner for org  <code>" + FEIDE_CONNECT.user().org.id + "</code>");
		});
	}

	function _getUsers(){
		return jso.ajax({url: jso.config.get("endpoints").relay + "org/" + FEIDE_CONNECT.user().org.id + "/users/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (users):", "Finner ingen brukere for org <code>" + FEIDE_CONNECT.user().org.id + "</code>");
		});
	}


	function getUser(user){
		return jso.ajax({url: jso.config.get("endpoints").relay + "org/" + FEIDE_CONNECT.user().org.id + "/user/" + user + "/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Finner ikke bruker", "Finner ikke bruker <code>" + user + "</code>");
		});
	}

	function getUserContent(user, showAlert){
		return jso.ajax({url: jso.config.get("endpoints").relay + "org/" + FEIDE_CONNECT.user().org.id + "/user/" +  user + "/presentations/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			if(showAlert)
				UTILS.alertError("Finner ikke innhold", "Finner ikke noe innhold for bruker <code>" + user + "</code>");
		});
	}

	return {
		diskUsage: function(){
			return !KIND.isAdmin() || XHR_DISKUSAGE;
		},
		presentations: function(){
			return XHR_PRESENTATIONS;
		},
		presentationCount: function(){
			return XHR_PRESENTATION_COUNT;
		},
		user: function(user) {
			return !KIND.isAdmin() || getUser(user);
		},
		userContent: function(user, showAlert) {
			return !KIND.isAdmin() || getUserContent(user, showAlert);
		},
		users: function(){
			return !KIND.isAdmin() || XHR_USERS;
		}
	}
})();






