/**
 * API Consumer.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var FEIDE_CONNECT = (function () {
	var USER = {};

	var XHR_USER = _getUserInfo(),
		XHR_GROUPS = _getUserGroups();

	(function () {
		$.when(XHR_USER).done(function(userObj){
			// Merge returned object with USER
			$.extend(true, USER, userObj);
		});

		$.when(XHR_GROUPS).done(function(groupsObj){
			// Merge returned object with USER
			$.extend(true, USER, groupsObj);
		});
	})();

	function _getUserInfo() {
		return jso.ajax({
			url: jso.config.get("endpoints").userinfo,
			oauth: { scopes: { request: ["userinfo userinfo-feide userinfo-mail userinfo-photo"] } },
			dataType: 'json'
		}).pipe(function (userData) {
			var user = userData.user;
			var userObj = {};
			userObj.org = {};

			if(user.userid_sec[0].indexOf('feide:') == -1){
				UTILS.showAuthError("Brukerinfo", "Tjenesten krever p&aring;logging med Feide. Fant ikke ditt Feide brukernavn.");
				return false;
			}

			var username = user.userid_sec[0].split('feide:')[1].toLowerCase();
			var org = username.split('@')[1];

			userObj.id = user.userid;
			userObj.username = username;
			userObj.name = {
				full: user.name,
				first: user.name.split(' ')[0]
			};
			userObj.email = user.email;
			userObj.photo = jso.config.get("endpoints").photo + user.profilephoto;
			// userObj.org.id = 'uio.no';
			userObj.org.id = org;
			userObj.org.shortname = org.split('.')[0];
			UTILS.updateAuthProgress("Brukerinfo");
			UTILS.showAuthInfo("Feide Brukerinfo", username);
			return userObj;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.showAuthError("Brukerinfo", jqXHR);
		});
	}

	/**
	 * Populate USER object with group info, mostly interested in EduPersonAffiliation...
	 */
	function _getUserGroups() {
		return jso.ajax({
			url: jso.config.get("endpoints").groups,
			oauth: { scopes: { request: ["groups"] } },
			dataType: 'json'
		}).pipe(function (groupsData) {
			var groupsArr = groupsData;
			var groupsObj = {};
			groupsObj.affiliation = null;
			groupsObj.org = {};
			groupsObj.org.name = null;

			if(groupsArr.length === 0) {
				UTILS.showAuthError("Mangler rettigheter", "Du har dessverre ikke tilgang til denne tjenesten (fikk ikke tak i din tilh&oslash;righet)");
			} else {
				$.each(groupsArr, function (index, group) {
					// orgType is only present for org-type group
					if (group.orgType !== undefined) {
						// We only allow higher ed orgs and check that the group is for same org as user's org
						if (group.orgType.indexOf("higher_education") >= 0 && group.orgType.indexOf("home_organization") >= 0) { // && group.id.indexOf(USER.org.id) >= 0) {
							// Beware - according to docs, should return a string, not array - reported and may change
							groupsObj.affiliation = group.membership.primaryAffiliation; // https://www.feide.no/attribute/edupersonprimaryaffiliation
							if (groupsObj.affiliation instanceof Array) {
								groupsObj.affiliation = groupsObj.affiliation[0];
							}
							groupsObj.affiliation = groupsObj.affiliation.toLowerCase();
							groupsObj.org.name = group.displayName;
							// Done!
							return false;
						}
					}
				});

				if (!groupsObj.affiliation) {
					UTILS.showAuthError("Tilh&oslash;righet", "Fikk ikke tak i din tilh&oslash;righet (eks. 'ansatt'/'student'");
				} else {
					UTILS.updateAuthProgress("Grupper");
					UTILS.showAuthInfo("Feide Tilh&oslash;righet", groupsObj.affiliation );
				}
			}
			return groupsObj;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.showAuthError("Grupper", jqXHR);
		});
	}


	/*** Expose public functions ***/
	return {
		readyUser: function() {
			return XHR_USER;
		},
		readyGroups: function() {
			return XHR_GROUPS;
		},
		user: function() {
			return USER;
		},
		isEmployee: function () {
			return USER.affiliation.toLowerCase() === 'employee';
		},
		isStudent: function () {
			return USER.affiliation.toLowerCase() === 'student';
		},
		affiliation: function (){
			return USER.affiliation.toLowerCase();
		}
	}
})();
