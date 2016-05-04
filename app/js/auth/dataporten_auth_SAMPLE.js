/**
 * DATAPORTEN JSO kickoff for this client.
 *
 * Auth and collection of user/group info, all combined in a USER object.
 *
 */

// Global vars
var DEV = !true;
//
JSO.enablejQuery($);

// Settings pertaining to this client.
var jso = new JSO({
	providerID: "DP-RelayAdmin",
	client_id: "DATAPORTEN_DASH",
	redirect_uri: "DATAPORTEN_DASH",
	authorization: "https://auth.dataporten.no/oauth/authorization",
	debug: false,
	endpoints: {
		groups: "https://groups-api.dataporten.no/groups/me/groups",
		photo: "https://auth.dataporten.no/user/media/",
		userinfo: "https://auth.dataporten.no/userinfo",
		kind: "DATAPORTEN_DASH_3RD_PTY_API",
		relay: "DATAPORTEN_DASH_3RD_PTY_API"
	},
	kind: {
		relayID: "FROM_KIND"
	}
});


jso.callback();
// Catch response
jso.getToken(function (token) {
	// Run the essential API calls
	// console.log('Authorization: Bearer ' + token.access_token);
	// console.log(JSON.stringify(token, undefined, 2));
});


