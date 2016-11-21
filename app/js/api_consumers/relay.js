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
	// Our main object with totalstorage, all orgs with storage[], total_mib and usercount
	var XHR_SUBSCRIBERS_INFO;
	// Set when the above is done()
	var SUBSCRIBERS_INFO;
	// Ajax indicators, pipes result $.when(XHR_).done(result) :-)
	var XHR_SERVICE_INFO,
		XHR_SERVICE_STORAGE,
		XHR_USERS_TOTAL_COUNT,
		XHR_PRESENTATIONS_TOTAL;


	/**
	 * Only triggered if user is some sort of admin(see APP)
	 */
	function init() {
		XHR_SUBSCRIBERS_INFO = _getSubscribersInfoXHR();
		XHR_SERVICE_INFO = _getServiceInfoXHR();
		XHR_USERS_TOTAL_COUNT = _getTotalUsersCountXHR();
		XHR_PRESENTATIONS_TOTAL = _getPresentationsTotalXHR();
		XHR_SERVICE_STORAGE = _getServiceStorageXHR();
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

	/** data.version, data.workers, data.jobs **/
	function _getServiceInfoXHR() {
		return _getAPI("service/info/");
	}

	function getServiceQueueXHR(){
		return _getAPI("service/queue/");
	}

	function getServiceQueueFailedJobsXHR(){
		return _getAPI("service/queue/failed/");
	}

	/** data **/
	function _getServiceStorageXHR() {
		return _getAPI("service/diskusage/");
	}

	/** data.employees, data.students **/
	function _getTotalUsersCountXHR() {
		return _getAPI("service/users/count/");
	}

	function getOrgPresentationListXHR(org) {
		if (DATAPORTEN.isSuperAdmin()) {
			return _getAPI("org/" + org + "/presentations/");
		}
	}

	/** **/
	function getOrgUserListXHR(org) {
		// Only for super admins
		if (DATAPORTEN.isSuperAdmin()) {
			return _getAPI("org/" + org + "/users/");
		}
	}

	/** org.users.total|employees|students, org.storage[], org.total_mib **/
	function _getSubscribersInfoXHR() {
		return _getAPI("admin/orgs/info/");
	}

	/** paginator.total_count **/
	function _getPresentationsTotalXHR() {
		return _getAPI("service/presentations/count/");
	}

	function getHitsByDaysXHR(days) {
		return _getAPI("service/presentations/hits/daily/days/" + (typeof days !== 'undefined' ? days : 30) + "/");
	}

	function getHitsTotalXHR() {
		return _getAPI("service/presentations/hits/total/");
	}

	function _getAPI(route) {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay + route,
			datatype: 'json'
		})
			.pipe(function (response) {
				return response.status ? response.data : false;
			})
			.fail(function (jqXHR, textStatus, error) {
				var title = "<kbd>" + error + "</kbd>";
				var message =
					"<p>Forespørsel <code>" + route + "</code> feilet med melding: </p>" +
					"<p class='well'>" + JSON.parse(jqXHR.responseText).message + "</p>" +
					"<p><button class='btn btn-default icon ion-refresh' onclick='location.reload();'> Last siden på nytt?</button></p>";
				UTILS.alertError(title, message);
			});
	}

	return {
		ready: function () {
			// Resolved when subscribersInfoXHR is done
			return READY;
		},
		init: function () {
			init();
		},
		subscribersInfoXHR: function () {
			// Done with initial collection
			return XHR_SUBSCRIBERS_INFO;
		},
		subscribersInfo: function () {
			// Only fetch when subscribersInfoXHR.done() or ready().done (if usersXHR also needed)
			return SUBSCRIBERS_INFO;
		},
		// USAGE: $.when(RELAY.serviceInfoXHR()).done(function(info){...do something with workers/version...})
		serviceInfoXHR: function () {
			return XHR_SERVICE_INFO;
		},
		// Will update for each call
		serviceQueueXHR: function () {
			return getServiceQueueXHR();
		},
		serviceQueueFailedJobsXHR: function () {
			return getServiceQueueFailedJobsXHR();
		},
		serviceStorageXHR: function () {
			return XHR_SERVICE_STORAGE;
		},
		usersTotalCountXHR: function () {
			return XHR_USERS_TOTAL_COUNT;
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
		orgCount: function () {
			return Object.keys(SUBSCRIBERS_INFO).length;
		},
		orgPresentationCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].presentations.total : 0;
		},
		orgEmployeesPresentationCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].presentations.employees : 0;
		},
		orgStudentsPresentationCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].presentations.students : 0;
		},
		orgPresentationListXHR: function (org) {
			return getOrgPresentationListXHR(org);
		},
		orgStorageTotalMiB: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].total_mib : 0;
		},
		orgStorageArr: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].storage : [];
		},
		orgUserCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].users.total : 0;
		},
		orgEmployeesCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].users.employees : 0;
		},
		orgStudentsCount: function (org) {
			return SUBSCRIBERS_INFO[org] ? SUBSCRIBERS_INFO[org].users.students : 0;
		},
		orgUserListXHR: function (org) {
			return getOrgUserListXHR(org);
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
		},
		_getAPI: function (route) {
			return _getAPI(route);
		}
	}
})();






