/**
 * API Consumer for Relay (user scope).
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
		$.when(DATAPORTEN.readyUser().done(function () {
			XHR_USER_ACCOUNT = _getUserAccountXHR();
			$.when(XHR_USER_ACCOUNT).done(function (userInfo) {
				// Collect extra info only if user has an account
				if (userInfo !== false) {
					HAS_ACCOUNT = true;
					UTILS.updateAuthProgress("TechSmith Relay Bruker");
					UTILS.showAuthInfo("TechSmith Relay Bruker", RELAY_USER.hasAccount());
					XHR_USER_CONTENT = _getUserContentXHR();
					XHR_USER_DISKUSAGE = _getUserDiskusageXHR();
					$.when(XHR_USER_CONTENT, XHR_USER_DISKUSAGE).done(function (content, diskusage) {
						READY.resolve();
					});
				}
			});
		}));
	})();

	// {}
	function _getUserAccountXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.showAuthInfo("TechSmith Relay Bruker", RELAY_USER.hasAccount());
			return false;
		});
	}

	// []
	function _getUserContentXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/presentations/",
			dataType: 'json'
		}).pipe(function (obj) {
			HAS_CONTENT = obj.data.length > 0;
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.notify({
				icon: 'ion-android-cancel',
				iconcolor: 'red',
				delay: 10000,
				title: 'OPS!',
				message: 'En feil oppstod: Fikk ikke hentet dine presentasjoner. Min Relay vil ikke fungere.'
			});
		});
	}

	// []
	function _getUserDiskusageXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/diskusage/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data.storage;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.notify({
				icon: 'ion-android-cancel',
				iconcolor: 'red',
				delay: 10000,
				title: 'OPS!',
				message: 'En feil oppstod: Fikk ikke tak i all informasjon om ditt innhold.'
			});
		});
	}


	/**
	 * All presentations (deleted, moved, undelete) for this user.
	 * @returns {*}
	 * @private
	 */
	function _presDeleteListAllXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/presentations/deletelist/all/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.status ? obj.data : false;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.notify({
				icon: 'ion-android-cancel',
				iconcolor: 'red',
				delay: 10000,
				title: 'OPS!',
				message: 'En feil oppstod: Fikk ikke hentet dine presentasjoner. Min Relay vil ikke fungere.'
			});
		});
	}

	/*
	 // Unused, utilising _presDeleteListAllXHR() instead
	 //
	 function _presDeleteGetNotYetMovedXHR(){
	 return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "me/presentations/deletelist/notmoved/", dataType: 'json'}).pipe(function (obj) {
	 return obj.status ? obj.data : false;
	 }).fail(function (jqXHR, textStatus, error) {
	 return false;
	 });
	 }

	 function _presDeleteGetMovedXHR(){
	 return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "me/presentations/deletelist/moved/", dataType: 'json'}).pipe(function (obj) {
	 return obj.status ? obj.data : false;
	 }).fail(function (jqXHR, textStatus, error) {
	 return false;
	 });
	 }

	 function _presDeleteGetDeletedXHR(){
	 return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "me/presentations/deletelist/deleted/", dataType: 'json'}).pipe(function (obj) {
	 return obj.status ? obj.data : false;
	 }).fail(function (jqXHR, textStatus, error) {
	 return false;
	 });
	 }
	 */

	/**
	 * Call deletelist API to request that a path be deleted
	 * @param presentationPath
	 * @returns {*}
	 * @private
	 */
	function _presDeletePresentationXHR(presentationPath) {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/presentation/deletelist/delete/",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				"presentation": {
					"username": DATAPORTEN.user().username,
					"path": presentationPath
				}
			})
		})
			.done(function (data, textStatus, jqXHR) {
				// Notify user
				UTILS.notify({
					icon: 'ion-trash-a',
					iconcolor: 'indianred',
					title: 'Presentasjon vil slettes',
					message: 'Presentasjonen gjøres utilgjengelig innen 5 minutter'
				});
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				UTILS.notify({
					icon: 'ion-android-cancel',
					iconcolor: 'red',
					delay: 10000,
					title: 'OPS!',
					message: 'En feil oppstod: <code>' + jqXHR.responseJSON.message + '</code>'
				});
			})
			.always(function () {
				/* ... */
			});

	}

	/**
	 * Delete a presentation path from deletelist (before it is moved)
	 * @param presentationPath
	 * @returns {*}
	 * @private
	 */
	function _presDeleteRemovePresentationXHR(presentationPath) {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/presentation/deletelist/restore/",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				"presentation": {
					"username": DATAPORTEN.user().username,
					"path": presentationPath
				}
			})
		})
			.done(function (data, textStatus, jqXHR) {
				// Notify user
				UTILS.notify({
					icon: 'ion-ios-checkmark',
					iconcolor: 'green',
					title: 'Sletting kansellert',
					message: 'Presentasjonen vil ikke lenger bli slettet'
				});
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				UTILS.notify({
					icon: 'ion-android-cancel',
					iconcolor: 'red',
					delay: 10000,
					title: 'OPS!',
					message: 'En feil oppstod: <code>' + jqXHR.responseJSON.message + '</code>'
				});
			})
			.always(function () {
				/* ... */
			});
	}

	function _presDeleteUndeletePresentationXHR(presentationPath) {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "me/presentation/deletelist/undelete/",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				"presentation": {
					"username": DATAPORTEN.user().username,
					"path": presentationPath
				}
			})
		})
			.done(function (data, textStatus, jqXHR) {
				// Notify user
				UTILS.notify({
					icon: 'ion-ios-checkmark',
					iconcolor: 'green',
					title: 'Sletting kansellert',
					message: 'Presentasjonen vil bli gjenopprettet snart'
				});
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				UTILS.notify({
					icon: 'ion-android-cancel',
					iconcolor: 'red',
					delay: 10000,
					title: 'OPS!',
					message: 'En feil oppstod: <code>' + jqXHR.responseJSON.message + '</code>'
				});
			})
			.always(function () {
				/* ... */
			});
	}

	return {
		ready: function () {
			return READY;
		},
		accountXHR: function () {
			return XHR_USER_ACCOUNT;
		},
		contentXHR: function () {
			return XHR_USER_CONTENT;
		},
		diskusageXHR: function () {
			return XHR_USER_DISKUSAGE;
		},
		hasAccount: function () {
			return HAS_ACCOUNT;
		},
		hasContent: function () {
			return HAS_CONTENT;
		},
		getPresentationsDeleteListXHR: function () {
			return _presDeleteListAllXHR();
		},
		getDeletedPresentationsXHR: function () {
			return _presDeleteGetDeletedXHR();
		},
		getMovedPresentationsXHR: function () {
			return _presDeleteGetMovedXHR()
		},
		getNotYetMovedPresentationsXHR: function () {
			return _presDeleteGetNotYetMovedXHR();
		},
		deletePresentationXHR: function (presentationPath) {
			return _presDeletePresentationXHR(presentationPath);
		},
		removePresentationXHR: function (presentationPath) {
			return _presDeleteRemovePresentationXHR(presentationPath);
		},
		undeletePresentationXHR: function (presentationPath) {
			return _presDeleteUndeletePresentationXHR(presentationPath);
		}
	}
})();






