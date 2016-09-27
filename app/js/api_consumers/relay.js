/**
 * API Consumer for Relay (admin paths).
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var RELAY = (function () {
	// Default value
	var STORAGE_COST_PER_TB = 12000;
	// Indicator
	var READY = $.Deferred();
	// Bunch of ajax calls for org storage, only READY when all of these are done
	// var XHR_PROMISES = [];
	// Our main object with totalstorage, all orgs with storage[], total_mib and usercount
	var XHR_SUBSCRIBERS_INFO;
	// Set when the above is done()
	var SUBSCRIBERS_INFO;
	// Ajax indicators, pipes result $.when(XHR_).done(result) :-)
	var XHR_SERVICE_VERSION,
		XHR_SERVICE_WORKERS,
		XHR_SERVICE_STORAGE,
		XHR_SERVICE_JOBS_FAILED,
		XHR_USERS_TOTAL,
		XHR_USERS_TOTAL_ACTIVE,
		XHR_PRESENTATIONS_TOTAL;


	/**
	 * Only triggered if user is some sort of admin(see APP)
	 */
	function init() {
		XHR_SUBSCRIBERS_INFO = _getSubscribersInfoXHR();
		XHR_SERVICE_VERSION = _getServiceVersionXHR();
		XHR_SERVICE_WORKERS = _getServiceWorkersXHR();
		XHR_USERS_TOTAL = _getTotalUsersByAffiliationCountXHR();
		XHR_USERS_TOTAL_ACTIVE = _getTotalActiveUsersByAffiliationCountXHR();
		XHR_PRESENTATIONS_TOTAL = _getPresentationsTotalXHR();
		XHR_SERVICE_STORAGE = _getServiceStorageXHR();
		XHR_SERVICE_JOBS_FAILED = _getServiceQueueFailedJobsXHR();
		// TODO: When added to API
		// XHR_HITS_LAST_WEEK = _getHitsLastWeekXHR();

		// When our org list has been fetched
		$.when(XHR_SUBSCRIBERS_INFO).done(function (info) {
			// Store first set of data returned from getSubscribersInfoXHR()
			SUBSCRIBERS_INFO = info;
			// Show notification
			var adminNotification = $.notify(
				{
					icon: DATAPORTEN.user().photo,
					title: 'Hey ' + DATAPORTEN.user().name.first + ', du er admin!',
					message: 'Henter ekstra innhold for deg :-)'
				},
				{
					type: 'minimalist', delay: 100000, icon_type: 'image',
					template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<img data-notify="icon" class="img-circle pull-left">' +
					'<span data-notify="title">{1}</span>' +
					'<span data-notify="message">{2}</span>' +
					'</div>'
				});

			READY.resolve();
			// Update, then hide notification
			adminNotification.update({'message': 'Ferdig! Menyen er oppdatert.'});
			setTimeout(function () {
				adminNotification.close();
			}, 1000);
		});
	};

	/** data.version **/
	function _getServiceVersionXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/version/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data.versValue;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (version):", "Henting av data feilet.");
		});
	}

	/** data.total **/
	function _getServiceWorkersXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/workers/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data.length;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (workerCount):", "Henting av data feilet.");
		});
	}

	/** data.total, data.jobs[] **/
	function getServiceQueueXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/queue/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (queue):", "Henting av køstatus feilet. Prøv på nytt.");
		});
	}

	function _getServiceQueueFailedJobsXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/queue/failed/",
			dataType: 'json'
		}).pipe(function (obj) {
			// obj = {"status":true,"data":[{"jobId":258576,"jobType":0,"jobState":3,"jobPresentation_PresId":35046,"jobQueuedTime":"Sep 21 2016 11:12:10:080PM","jobPercentComplete":6.6911389417004,"jobFailureReason":"An error occurred in the encoder","jobNumberOfFailures":87,"jobTitle":null},{"jobId":258578,"jobType":0,"jobState":3,"jobPresentation_PresId":35046,"jobQueuedTime":"Sep 21 2016 11:13:19:173PM","jobPercentComplete":6.6911389417004,"jobFailureReason":"An error occurred in the encoder","jobNumberOfFailures":87,"jobTitle":null},{"jobId":258580,"jobType":0,"jobState":3,"jobPresentation_PresId":35046,"jobQueuedTime":"Sep 21 2016 11:13:43:983PM","jobPercentComplete":6.6911389417004,"jobFailureReason":"An error occurred in the encoder","jobNumberOfFailures":87,"jobTitle":null}]};
			console.log(obj);
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (queue):", "Henting av køstatus feilet. Prøv på nytt.");
		});
	}

	/** data **/
	function _getServiceStorageXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/diskusage/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (queue):", "Henting av lagring. Prøv på nytt.");
		});
	}

	/** data.employees, data.students **/
	function _getTotalUsersByAffiliationCountXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/users/edupersonaffiliation/count/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (active user count):", "Henting av data feilet.");
		});
	}

	/** data.employees, data.students **/
	function _getTotalActiveUsersByAffiliationCountXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/users/edupersonaffiliation/active/count/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (user count):", "Henting av data feilet.");
		});
	}

	/** data.total  **/
	function getOrgPresentationCountXHR(org) {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "org/" + org + "/presentations/count/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentations):", "Henting av data feilet.");
		});
	}


	function getOrgPresentationListXHR(org) {
		if(DATAPORTEN.isSuperAdmin()){
			return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + org + "/presentations/", dataType: 'json'}).pipe(function (obj) {
				return obj.data;
			}).fail(function (jqXHR, textStatus, error) {
				UTILS.alertError("Relay API (presentations):", "Finner ingen presentasjoner for org  <code>" + org + "</code>");
			});
		}
	}

	/** **/
	function getOrgUserListXHR(org){
		// Only for super admins
		if(DATAPORTEN.isSuperAdmin()) {
			return DP_AUTH.jso().ajax({url: DP_AUTH.config().api_endpoints.relay + "org/" + org + "/users/", dataType: 'json'}).pipe(function (obj) {
				return obj.data;
			}).fail(function (jqXHR, textStatus, error) {
				UTILS.alertError("Relay API (users):", "Finner ingen brukere for org <code>" + org + "</code>");
			});
		}
	}


	/** data.org, data.org.users, data.org.presentations, data.org.total_mib, data.org.storage[] **/
	function _getSubscribersInfoXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "admin/orgs/info/",
			dataType: 'json'
		}).pipe(function (orgList) {
			return orgList.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (orgsStorage):", "Henting av data feilet.");
		});
	}

	/** paginator.total_count **/
	function _getPresentationsTotalXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/presentations/count/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentationCount):", "Henting av data feilet.");
		});
	}

	function getHitsByDaysXHR(days) {
		// Default if we get no parameter
		days = typeof days !== 'undefined' ? days : 30;
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/presentations/hits/daily/days/"+days+"/",
			dataType: 'json'
		}).pipe(function (hitsArr) {
			// [ {log_date : hits}, {...} ]
			return hitsArr.status ? hitsArr.data : false;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (hitsByDay):", "Henting av data feilet.");
		});
	}

	function getHitsTotalXHR(){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + "service/presentations/hits/total/",
			dataType: 'json'
		}).pipe(function (totalHits) {
			// {"hits":"493847","first_timestamp":"1441364104"}
			return totalHits.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (hitsTotal):", "Henting av data feilet.");
		});
	}


	return {
		ready: function () {
			// Completely done fetching subscriber data and users
			return READY;
		},

		init: function () {
			init();
		},
		subscribersInfoXHR: function () {
			// Done with initial collection (sans users)
			return XHR_SUBSCRIBERS_INFO;
		},
		subscribersInfo: function () {
			// Only fetch when subscribersInfoXHR.done() or ready().done (if users also needed)
			return SUBSCRIBERS_INFO;
		},
		// USAGE: $.when(RELAY.serviceVersionXHR()).done(function(version){...do something with version...})
		serviceVersionXHR: function () {
			return XHR_SERVICE_VERSION;
		},
		serviceWorkersXHR: function () {
			return XHR_SERVICE_WORKERS;
		},
		// Will update for each call
		serviceQueueXHR: function () {
			return getServiceQueueXHR();
		},
		serviceQueueFailedJobsXHR: function () {
			return XHR_SERVICE_JOBS_FAILED();
		},
		serviceStorageXHR: function () {
			return XHR_SERVICE_STORAGE;
		},
		usersTotalXHR: function () {
			return XHR_USERS_TOTAL;
		},
		usersTotalActiveXHR: function () {
			return XHR_USERS_TOTAL_ACTIVE;
		},
		presentationsTotalXHR: function () {
			return XHR_PRESENTATIONS_TOTAL;
		},
		hitsByDaysXHR: function (days) {
			return getHitsByDaysXHR(days);
		},
		hitsTotalXHR: function () {
			return getHitsTotalXHR();
		},
		orgPresentationCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].presentations : 0;
		},
		orgPresentationListXHR: function (org) {
			return 	getOrgPresentationListXHR(org);
		},
		orgStorageTotalMiB: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].total_mib : 0;
		},
		orgStorageArr: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].storage : [];
		},
		orgUserCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].users : 0;
		},
		orgUserListXHR: function (org) {
			return 	getOrgUserListXHR(org);
		},
		storageCostTB: function () {
			return STORAGE_COST_PER_TB;
		},
		setStorageCost: function (cost) {
			cost = Number(cost);
			if (isNaN(cost)) {
				UTILS.alertError('Ugyldig verdi', 'Kostnaden du forsøker å legge inn er ikke et tall.')
				return false;
			}
			STORAGE_COST_PER_TB = cost;
			return true;
		}
	}
})();






