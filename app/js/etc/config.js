/**
 * Edit URLs/emails here.
 *
 */

var CONFIG = (function () {

	var RELAY_SERVICE_URL = 'https://relay.uninett.no';
	var RELAY_CLIENT_DOWNLOAD_URL = 'https://relay.uninett.no/relay/ClientDownload.aspx';
	var SCREENCAST_BASE_URL = 'https://screencast.uninett.no/relay/';
	var RELAY_REGISTER_URL = 'https://service.ecampus.no/client/relay-register/';
	var RELAY_SUPPORT_URL = 'https://support.ecampus.no/techsmithrelay/';
	var RELAY_SUPPORT_EMAIL = '<a href="mailto:kontakt@uninett.no">kontakt@uninett.no</a>';

	(function () {
		// Charts.js global config
		Chart.defaults.global.responsive = true;
	})()

	$(document).ready(function () {

	});

	return {
		RELAY_SERVICE_URL: function () {
			return RELAY_SERVICE_URL;
		},
		RELAY_CLIENT_DOWNLOAD_URL: function () {
			return RELAY_CLIENT_DOWNLOAD_URL;
		},
		RELAY_REGISTER_URL: function () {
			return RELAY_REGISTER_URL;
		},
		SCREENCAST_BASE_URL: function () {
			return SCREENCAST_BASE_URL;
		},
		RELAY_SUPPORT_URL: function () {
			return RELAY_SUPPORT_URL;
		},
		RELAY_SUPPORT_EMAIL: function () {
			return RELAY_SUPPORT_EMAIL;
		},
		DATATABLES_LANGUAGE: function () {
			return {
				emptyTable: "Ingen informasjon tilgjengelig",
				info: "Viser _START_ til _END_ av _TOTAL_ innslag",
				infoEmpty: "Viser 0 til 0 av 0 innslag",
				infoFiltered: "(filtrert fra totalt _MAX_ innslag)",
				infoPostFix: "",
				thousands: ",",
				lengthMenu: "Vis _MENU_ innslag per side",
				loadingRecords: "Henter...",
				processing: "Vennligst vent...",
				search: "Søk: ",
				zeroRecords: "Fant ingen innslag",
				paginate: {
					first: 'F&oslash;rste',
					previous: '&larr;',
					next: '&rarr;',
					last: 'Siste'
				}
			}
		}
	}

})();