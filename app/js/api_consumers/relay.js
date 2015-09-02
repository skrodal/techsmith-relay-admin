/**
 * API Consumer.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var RELAY = (function () {
	// Default value
	var STORAGE_COST_PER_TB = 15000;
	// Indicator
	var READY = $.Deferred();
	// Bunch of ajax calls for org storage, only READY when all of these are done
	var XHR_PROMISES = [];
	// Our main object with totalstorage, all orgs with storage[], total_mib and usercount
	var XHR_SUBSCRIBERS_INFO;
	// Set when the above is done()
	var SUBSCRIBERS_INFO;
	// Ajax indicators, pipes result $.when(XHR_).done(result) :-)
	var XHR_SERVICE_VERSION,
		XHR_SERVICE_WORKERS,
		XHR_USERS_TOTAL,
		XHR_USERS_TOTAL_EMPLOYEES,
		XHR_USERS_TOTAL_STUDENTS,
		XHR_PRESENTATIONS_TOTAL,
		XHR_HITS_LAST_WEEK;

	/**
	 * Trigger point (see APP)
	 */
	function init() {
		XHR_SUBSCRIBERS_INFO = _getSubscribersInfoXHR();
		XHR_SERVICE_VERSION = _getServiceVersionXHR();
		XHR_SERVICE_WORKERS = _getServiceWorkersXHR();
		XHR_USERS_TOTAL = _getUsersTotalXHR();
		XHR_USERS_TOTAL_EMPLOYEES = _getUsersTotalEmployeesXHR();
		XHR_USERS_TOTAL_STUDENTS = _getUsersTotalStudentsXHR();
		XHR_PRESENTATIONS_TOTAL = _getPresentationsTotalXHR();
		XHR_HITS_LAST_WEEK = _getHitsLastWeekXHR();

// When our org list has been fetched
		$.when(XHR_SUBSCRIBERS_INFO).done(function (info) {
			// Store first set of data returned from getSubscribersInfoXHR()
			SUBSCRIBERS_INFO = info;
			// Show notification
			var adminNotification = $.notify(
				{ icon: FEIDE_CONNECT.user().photo, title: 'Hey ' + FEIDE_CONNECT.user().name.first + ', du er admin!', message: 'Henter ekstra innhold for deg :-)'},
				{ type: 'minimalist', delay: 100000, icon_type: 'image',
					template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
						'<img data-notify="icon" class="img-circle pull-left">' +
						'<span data-notify="title">{1}</span>' +
						'<span data-notify="message">{2}</span>' +
						'</div>'
				});

			// Loop all orgs to get usercount per org (time-consuming)
			$.each(SUBSCRIBERS_INFO.orgs, function (orgName, orgData) {
				//SUBSCRIBERS_INFO.orgs[orgName].users = 0;
				// Note limit. We don't want a list of users, just the count...
				var request = jso.ajax({url: jso.config.get("endpoints").relay + "users/organisation/" + orgName + "?limit=1", dataType: 'json'}).done(function (data) {
					//SUBSCRIBERS_INFO.orgs[orgName].users = data.paginator.total_count;
					orgData.users = data.paginator.total_count;
					// Update
					if (KIND.isAdmin()) {
						adminNotification.update({ 'message': 'Henter ' + orgName + '...' });
					}
				})
				// Add request to array
				XHR_PROMISES.push(request);
			});
			// When all requests are complete, this part of RELAY is ready.
			$.when.apply(null, XHR_PROMISES).done(function () {
				// Tells the client that Relay is now DONE
				READY.resolve();
				// Update, then hide notification
				adminNotification.update({'message': 'Ferdig! Menyen er oppdatert.'});
				setTimeout(function () {
					adminNotification.close();
				}, 1000);
			});

		});
	};

	/** data.version **/
	function _getServiceVersionXHR() {
		return jso.ajax({url: jso.config.get("endpoints").relay + "service/version", dataType: 'json'}).pipe(function (obj) {
			return obj.data.version;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (version):", "Henting av data feilet.");
		});
	}

	/** data.total **/
	function _getServiceWorkersXHR() {
		return jso.ajax({url: jso.config.get("endpoints").relay + "service/workers", dataType: 'json'}).pipe(function (obj) {
			return obj.data.total;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (workerCount):", "Henting av data feilet.");
		});
	}

	/** data.total, data.jobs[] **/
	function getServiceQueueXHR() {
		return jso.ajax({
			url: jso.config.get("endpoints").relay + "service/queue",
			dataType: 'json'
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (queue):", "Henting av k&oslash;status feilet. Pr&oslash;v p&aring; nytt.");
		});
	}

	/** data.total **/
	function _getUsersTotalXHR() {
		return jso.ajax({url: jso.config.get("endpoints").relay + "users/total", dataType: 'json'}).pipe(function (obj) {
			return obj.data.total;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (userCount):", "Henting av data feilet.");
		});
	}

	/** data.total **/
	function _getUsersTotalStudentsXHR() {
		return jso.ajax({url: jso.config.get("endpoints").relay + "users/affiliation/student/total", dataType: 'json'}).pipe(function (obj) {
			return obj.data.total;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (studentCount):", "Henting av data feilet.");
		});
	}

	/** data.total  **/
	function _getUsersTotalEmployeesXHR() {
		return jso.ajax({url: jso.config.get("endpoints").relay + "users/affiliation/ansatt/total", dataType: 'json'}).pipe(function (obj) {
			return obj.data.total;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (employeeCount):", "Henting av data feilet.");
		});
	}

	/** data.total  **/
	function getOrgPresentationCountXHR(org) {
		return jso.ajax({url: jso.config.get("endpoints").relay + "organisations/" + org + "/presentations/total", dataType: 'json'}).pipe(function (obj) {
			return obj.data.total;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentations):", "Henting av data feilet.");
		});
	}

	/** data.org, data.storage[] (.size_mib, .date) **/
	function _getSubscribersInfoXHR() {
		return jso.ajax({url: jso.config.get("endpoints").relay + "organisations?limit=10000", dataType: 'json'}).pipe(function (orgList) {
			// Sort by org name
			orgList.data.sort(function (a, b) {
				return (a.org.toLowerCase() < b.org.toLowerCase()) ? -1 : (a.org.toLowerCase() > b.org.toLowerCase()) ? 1 : 0;
			});
			// Populate an object of orgs : storage[],users,total_mib
			var SUBSCRIBERS_INFO = {};
			SUBSCRIBERS_INFO.total_mib = 0;
			SUBSCRIBERS_INFO.orgs = {};
			// Get total storage global and per org
			$.each(orgList.data, function (index, orgObj) {
				// Default value
				SUBSCRIBERS_INFO.orgs[orgObj.org] = {};
				SUBSCRIBERS_INFO.orgs[orgObj.org].total_mib = 0;
				SUBSCRIBERS_INFO.orgs[orgObj.org].storage = [];
				SUBSCRIBERS_INFO.orgs[orgObj.org].users = 0;

				// If any storage registered for org, get the latest registered storage
				if (orgObj.storage.length > 0) {
					SUBSCRIBERS_INFO.orgs[orgObj.org].storage = orgObj.storage;
					SUBSCRIBERS_INFO.orgs[orgObj.org].total_mib = orgObj.storage[orgObj.storage.length - 1].size_mib;
				}
				// Update global storage
				SUBSCRIBERS_INFO.total_mib += SUBSCRIBERS_INFO.orgs[orgObj.org].total_mib;
			});
			return SUBSCRIBERS_INFO;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (orgsStorage):", "Henting av data feilet.");
		});
	}

	/** paginator.total_count **/
	function _getPresentationsTotalXHR() {
		// TODO: This is a workaround since presentations/total DOES NOT WORK
		return jso.ajax({url: jso.config.get("endpoints").relay + "presentations?limit=1", dataType: 'json'}).pipe(function (obj) {
			return obj.paginator.total_count;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentationCount):", "Henting av data feilet.");
		});
	}

	function _getHitsLastWeekXHR() {
		var d = new Date(new Date().setDate(new Date().getDate() - 1))
		var yesterday = d.getFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();
		var d = new Date(new Date().setDate(new Date().getDate() - 8));
		var weekAgo = d.getFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCDate();

		return jso.ajax({url: jso.config.get("endpoints").relay + "requests/from/" + weekAgo + "/to/" + yesterday, dataType: 'json'}).pipe(function (hitsArr) {
			return hitsArr.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.alertError("Relay API (presentationCount):", "Henting av data feilet.");
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
		usersTotalXHR: function () {
			return XHR_USERS_TOTAL;
		},
		usersTotalEmployeesXHR: function () {
			return XHR_USERS_TOTAL_EMPLOYEES;
		},
		usersTotalStudentsXHR: function () {
			return XHR_USERS_TOTAL_STUDENTS;
		},
		presentationsTotalXHR: function () {
			return XHR_PRESENTATIONS_TOTAL;
		},
		hitsLastWeekXHR: function () {
			return XHR_HITS_LAST_WEEK;
		},
		queueXHR: function () {
			return getServiceQueueXHR();
		},
		orgPresentationCountXHR: function (org) {
			return getOrgPresentationCountXHR(org);
		},
		orgStorageTotalMiB: function (org) {
			return SUBSCRIBERS_INFO.orgs[org] ? SUBSCRIBERS_INFO.orgs[org].total_mib : 0;
		},
		orgStorageArr: function (org) {
			return SUBSCRIBERS_INFO.orgs[org] ? SUBSCRIBERS_INFO.orgs[org].storage : [];
		},
		orgUserCount: function (org) {
			return SUBSCRIBERS_INFO.orgs[org] ? SUBSCRIBERS_INFO.orgs[org].users : 0;
		},
		storageCostTB: function () {
			return STORAGE_COST_PER_TB;
		},
		setStorageCost: function (cost) {
			cost = Number(cost);
			if (isNaN(cost)) {
				UTILS.alertError('Ugyldig verdi', 'Kostnaden du fors&oslash;ker &aring; legge inn er ikke et tall.')
				return false;
			}
			STORAGE_COST_PER_TB = cost;
			return true;
		}
	}
})();






