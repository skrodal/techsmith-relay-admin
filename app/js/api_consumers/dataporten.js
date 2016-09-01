/**
 * API Consumer.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var DATAPORTEN = (function () {
	var USER = {};
	// Autorun
	var XHR_USER = _getUserInfo(),
		XHR_USER_ROLE = _getUserRole(),
		XHR_GROUPS = _getUserGroups();


	(function () {
		$.when(XHR_USER).done(function(userObj){
			// Merge returned object with USER
			$.extend(true, USER, userObj);
		});
		$.when(XHR_USER_ROLE).done(function(userRoleObj){
			// Merge returned object with USER
			$.extend(true, USER, userRoleObj);
		});
		$.when(XHR_GROUPS).done(function(groupsObj){
			// Merge returned object with USER
			$.extend(true, USER, groupsObj);
		});
	})();


	/**
	 * From Dataporten's userinfo API
	 * @returns {*}
	 * @private
	 */
	function _getUserInfo() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().dp_endpoints.userinfo,
			dataType: 'json'
		}).pipe(function (userData) {

			var user = userData.user;
			var userObj = {};
			userObj.org = {};

			if(user.userid_sec[0].indexOf('feide:') == -1){
				UTILS.showAuthError("Brukerinfo", "Tjenesten krever pålogging med Feide. Fant ikke ditt Feide brukernavn.");
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
			userObj.photo = DP_AUTH.config().dp_endpoints.photo + user.profilephoto;
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
	 * Calls the Relay API, which provides a role obj for the user (e.g. {title: "SuperAdmin", isOrgAdmin: true, isSuperAdmin: true})
	 *
	 * Check the Dataporten RelayAdmin ad-hoc group for user membership. If user is member s/he is OrgAdmin.
	 *
	 * @returns {*}
	 * @private
	 */
	function _getUserRole(){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/role/",
			dataType: 'json'
		}).pipe(function (obj) {
			var userRoleObj = {};
			userRoleObj.role = obj.data;
			UTILS.showAuthInfo("SuperAdmin", obj.data.isSuperAdmin);
			UTILS.showAuthInfo("OrgAdmin", obj.data.isOrgAdmin);
			UTILS.showAuthInfo("Rolle", obj.data.title);
			return userRoleObj;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (version):", "Henting av brukerrolle feilet.");
		});
	}

	function _getAdminGroupInvitationURL(){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "org/" + DATAPORTEN.user().org.shortname + "/orgadmin/invitationurl/",
			datatype: 'json'
		})
			.pipe(function (response) {
				return response.data;
			})
			.fail(function (jqXHR, textStatus, error) {
				var title = "Relay API — <code>org/" + DATAPORTEN.user().org.shortname + "/orgadmin/invitationurl/</code>";
				var message = "Mediasite API avslo forespørselen - manglende rettigheter?."
				UTILS.alertError(title, message);
				UTILS.showAuthError(title, message);
			});
	}



	/**
	 * From Dataporten's Groups API
	 *
	 * Populate USER object with group info, mostly interested in EduPersonAffiliation...
	 *
	 * @returns {*}
	 * @private
	 */
	function _getUserGroups() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().dp_endpoints.groups + 'me/groups',
			dataType: 'json'
		}).pipe(function (groupsData) {
			var groupsArr = groupsData;
			var groupsObj = {};
			groupsObj.affiliation = null;
			groupsObj.org = {};
			groupsObj.org.name = null;

			if(groupsArr.length === 0) {
				UTILS.showAuthError("Mangler rettigheter", "Du har dessverre ikke tilgang til denne tjenesten (fikk ikke tak i din tilhørighet)");
			} else {
				$.each(groupsArr, function (index, group) {
					// orgType is only present for org-type group
					if (group.orgType !== undefined && group.type !== undefined) {
						// Access only for users belonging to an Organization pertaining to higher education.
						if (group.orgType.indexOf("higher_education") >= 0 && group.type.toUpperCase() === "FC:ORG") {
							// Beware - according to docs, should return a string, not array - reported and may change
							groupsObj.affiliation = group.membership.primaryAffiliation; // https://www.feide.no/attribute/edupersonprimaryaffiliation
							if (groupsObj.affiliation instanceof Array) {
								groupsObj.affiliation = groupsObj.affiliation[0];
							}
							groupsObj.affiliation = groupsObj.affiliation.toLowerCase();
							groupsObj.org.name = group.displayName;
							// Done - exit loop.
							return false;
						}
					}
				});

				// MUST have this - otherwise throw error for this XHR call.
				if (!groupsObj.affiliation) {
					var errMsg = "Fikk ikke tak i din tilh&oslash;righet (eks. 'ansatt'/'student')";
					return $.Deferred().reject(errMsg, errMsg, errMsg).promise();
				} else {
					UTILS.updateAuthProgress("Grupper");
					UTILS.showAuthInfo("Feide Tilhørighet", groupsObj.affiliation );
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
		readyUserRole: function() {
			return XHR_USER_ROLE;
		},
		readyGroups: function() {
			return XHR_GROUPS;
		},
		user: function() {
			return USER;
		},
		isSuperAdmin: function () {
			return USER.role.isSuperAdmin;
		},
		isOrgAdmin: function () {
			return USER.role.isOrgAdmin;
		},
		userRole: function () {
			return USER.role.title;
		},
		orgAdminInvitationLinkXHR: function () {
			return !DATAPORTEN.isOrgAdmin() || _getAdminGroupInvitationURL();
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
