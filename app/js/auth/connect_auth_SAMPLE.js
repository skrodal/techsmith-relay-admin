/**
 * Feide Connect JSO kickoff for this client.
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
	providerID: "FC-RelayAdmin",
	client_id: "CONNECT_DASH",
	redirect_uri: "CONNECT_DASH",
	authorization: "https://auth.feideconnect.no/oauth/authorization",
	debug: false,
	endpoints: {
		groups: "https://groups-api.feideconnect.no/groups/me/groups",
		photo: "https://auth.feideconnect.no/user/media/",
		userinfo: "https://auth.feideconnect.no/userinfo",
		kind: "CONNECT_DASH_3RD_PTY_API",
		relay: "CONNECT_DASH_3RD_PTY_API"
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


