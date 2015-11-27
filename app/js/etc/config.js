var CONFIG = (function () {

	(function(){
		// Charts.js global config
		Chart.defaults.global.responsive = true;
	})()

	return {
		SCREENCAST_BASE_URL: function () {
			return 'https://screencast.uninett.no/relay/';
		},
		DATATABLES_LANGUAGE: function () {
			return {
				emptyTable:     "Ingen informasjon tilgjengelig",
				info:           "Viser _START_ til _END_ av _TOTAL_ innslag",
				infoEmpty:      "Viser 0 til 0 av 0 innslag",
				infoFiltered:   "(filtrert fra totalt _MAX_ innslag)",
				infoPostFix:    "",
				thousands:      ",",
				lengthMenu:     "Vis _MENU_ innslag per side",
				loadingRecords: "Henter...",
				processing:     "Vennligst vent...",
				search:         "Søk: ",
				zeroRecords:    "Fant ingen innslag",
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