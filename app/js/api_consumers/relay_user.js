/**
 * API Consumer.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var RELAY_USER = (function () {
	var READY = $.Deferred();
	var XHR_USER_ACCOUNT;
	var XHR_USER_CONTENT;
	var XHR_USER_DISKUSAGE;
	var HAS_ACCOUNT = false;
	var HAS_CONTENT = false;

	// Routes that do not work:
	// users/me
	// organisations/me/diskusage/latest

	// Autorun
	(function () {
		$.when(DATAPORTEN.readyUser().done(function(){
			XHR_USER_ACCOUNT = _getUserAccountXHR();
			$.when(XHR_USER_ACCOUNT).done(function(userInfo){
				// Collect extra info only if user has an account
				if(userInfo !== false){
					HAS_ACCOUNT = true;
					UTILS.updateAuthProgress("TechSmith Relay Bruker");
					UTILS.showAuthInfo("TechSmith Relay Bruker", RELAY_USER.hasAccount() );
					XHR_USER_CONTENT = _getUserContentXHR();
					XHR_USER_DISKUSAGE = _getUserDiskusageXHR();
					$.when(XHR_USER_CONTENT, XHR_USER_DISKUSAGE).done(function(content, diskusage){
						READY.resolve();
					});
				}
			});
		}));
	})();

	// {}
	function _getUserAccountXHR(){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "me/", dataType: 'json'}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.showAuthInfo("TechSmith Relay Bruker", RELAY_USER.hasAccount() );
			return false;
		});
	}

	// []
	function _getUserContentXHR(){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "me/presentations/", dataType: 'json'}).pipe(function (obj) {
			HAS_CONTENT = obj.data.length > 0;
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			return false;
		});
	}

	// []
	function _getUserDiskusageXHR(){
		return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "me/diskusage/", dataType: 'json'}).pipe(function (obj) {
			return obj.data.storage;
		}).fail(function (jqXHR, textStatus, error) {
			return false;
		});
	}



	return {
		ready: function(){
			return READY;
		},
		accountXHR: function(){
			return XHR_USER_ACCOUNT;
		},
		contentXHR: function(){
			return XHR_USER_CONTENT;
		},
		diskusageXHR: function(){
			return XHR_USER_DISKUSAGE;
		},
		hasAccount: function(){
			return HAS_ACCOUNT;
		},
		hasContent: function(){
			return HAS_CONTENT;
		}
	}
})();






