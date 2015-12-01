/**
 * PAGE controller.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var PAGE_MY_RELAY = (function () {

	var USERCONTENT = [];

	/**
	 * Trigger point - do stuff if user has an account.
	 */
	function init() {
		if (RELAY_USER.hasAccount()) {
			_updateUserUI();
			//
			$.when(RELAY_USER.contentXHR(), RELAY_USER.diskusageXHR()).done(function (contentArr, diskusageArr) {
				if (RELAY_USER.hasContent()) {
					USERCONTENT = contentArr;
					_updateContentUI(contentArr, diskusageArr);
					_buildContentTable(contentArr);
					// No content
				} else {
					// TODO: Show info instead of table
				}
			});
			// No account
		} else {
			$('.relayUserName').html("MANGLER KONTO");
			// No account - remove all page content, sans Jumbotron
			$("#pageMyRelay").find("div:first").nextAll().remove();
		}

	}


	function onHideListener() {

	}

	function onShowListener() {

	}

	/**
	 * Update user-related UI elements.
	 * @param userInfo
	 * @private
	 */
	function _updateUserUI() {
		$.when(RELAY_USER.accountXHR()).done(function(userInfo){
			$('.relayUserName').html(userInfo.username);
			$('.relayUserEmail').html(userInfo.email);
		});
	}

	/**
	 * Update quickstats and other content-related UI elements.
	 *
	 * @param contentArr
	 * @param diskusageArr
	 * @private
	 */
	function _updateContentUI(contentArr, diskusageArr) {
		var hitCount = 0;
		var deletedCount = 0;
		var durationTotalSec = 0;
		var totalStorage = 0;

		$.each(contentArr, function (index, contentObj) {
			hitCount += contentObj.hits;
			deletedCount += contentObj.is_deleted == 1 ? 1 : 0;
			durationTotalSec += contentObj.duration_s;
		});

		$('.myRelayPresentationCount').html(contentArr.length);
		$('.myRelayPresentationDeletedCount').html(deletedCount > 0 ? deletedCount + ' av disse slettet' : 'Ingen slettet');
		$('.myRelayDurationTotal').html(UTILS.secToTimeAndDays(durationTotalSec));
		$('.myRelayDiskUsage').html(UTILS.mib2gb(diskusageArr[diskusageArr.length - 1].size_mib).toFixed(2) + 'GB');
		$('.myRelayHitCount').html(hitCount);

	}

	/**
	 * DataTable view of all user content.
	 *
	 * @param contentArr
	 * @private
	 */
	function _buildContentTable(contentArr) {
		$('#myRelayContent').find('.ajax').show();
		var contentTable = $('#myRelayContentTable').DataTable({
			"bAutoWidth": !true, // Note! Not sure which looks best
			"language": CONFIG.DATATABLES_LANGUAGE(),
			"data": contentArr,
			"columns": [
				// Simon 20FEB2015: 1st column is date presented in a way DataTables can sort (YYYY-MM-DD) and is hidden
				// The other, visible, date column sorts by this column here. A very useful 'hack'.
				{
					"data": "created_date",
					"render": function (data, type, full, meta) {
						var date = new Date(data.sec*1000);
						return date.getUTCFullYear() + '-' + UTILS.two(date.getUTCMonth()+1) + '-' +  UTILS.two(date.getUTCDate());
						//return data;
					},
					"bVisible": false // HIDE COLUMN
				},
				{
					"data": "title",
					"render": function (data, type, full, meta) {
						// Important: ID refers to index in contentArr
						return '<span class="text-blue" style="cursor: context-menu;" data-toggle="modal" data-arr-id="' + meta.row + '" data-target="#myRelayPresentationModal">' + data + '</span>';
					}
				},
				{
					"data": "description",
					"render": function (data, type, full, meta) {
						return '<em>' + data + '</em>';
					}
				},
				{
					"data": "created_date",
					"render": function (data, type, full, meta) {
						var date = new Date(data.sec*1000);
						return UTILS.two(date.getUTCDate()) + '. ' + UTILS.months_short(date.getUTCMonth()) + ' ' + date.getUTCFullYear();
						//return data;
					},
					"iDataSort": 0 // USE HIDDEN DATE COLUMN FOR SORTING
				},

				{
					"data": "duration_s",
					"render": function (data, type, full, meta) {
						return UTILS.secToTime(data);
					}
				},
				{
					"data": "hits",
					"render": function (data, type, full, meta) {
						return '<h4 class="text-center"><span class="badge bg-red">' + data + '</span></h4>';
					}
				}
			]
		});

		$('#myRelayContent').find('.ajax').hide();
	}


	/**
	 * Presentation details modal (showing)
	 */
	$('#myRelayPresentationModal').on('show.bs.modal', function (event) {
		// Way to access data attributes from element that was clicked
		var trigger = $(event.relatedTarget);
		//
		var presentationObj = USERCONTENT[trigger.data('arr-id')]; // Extract info from data-* attributes
		// Update the modal's content
		var modal = $(this);
		var presPreview = modal.find('#presentation_preview');
		var pres_date = new Date(presentationObj.created_date.sec*1000);
		var presCreatedDate = UTILS.two(pres_date.getUTCDate()) + '. ' + UTILS.months_short(pres_date.getUTCMonth()) + ' ' + pres_date.getUTCFullYear();

		modal.find('#presentation_title').text(presentationObj.title);
		modal.find('#presentation_description').text(presentationObj.description);
		modal.find('#presentation_author').html('- ' + presentationObj.recorded_by + '<br/>' + presCreatedDate);
		modal.find('#presentation_hits').text(presentationObj.hits);
		modal.find('#presentation_duration').html('<i class="ion ion-ios-clock"></i> ' + UTILS.secToTime(presentationObj.duration_s));
		// Set preview - load() is important
		presPreview.html('<source src="' + CONFIG.SCREENCAST_BASE_URL() + presentationObj.files[1].path + '" type="video/mp4">');
		presPreview.load();
		//
		modal.find('#presentation-files-table tbody').empty();
		$.each(presentationObj.files, function (index, value) {
			modal.find('#presentation-files-table tbody').append(
				'<tr>' +
					'<td>' + value.encoding + '</td>' +
					'<td><a class="text-light-blue" target="_blank" href="' + CONFIG.SCREENCAST_BASE_URL() + value.path + '">H&oslash;yreklikk...</a></td>' +
					'<td><a class="text-light-blue" data-dismiss="modal" data-toggle="modal" data-url="' + CONFIG.SCREENCAST_BASE_URL() + value.path + '" data-target="#myRelayEmbedModal" style="cursor: context-menu;"><i class="ion ion-android-share-alt"></i></a></td>' +
					//'<td>' + UTILS.mib2mb(value.size_mib).toFixed() + 'MB</td>' +
					'<td><span class="badge bg-black-gradient">' + value.hits + '</span></td>' +
					'</tr>'
			);
		});
	});


	/**
	 * Presentation details modal (closing)
	 *
	 * Stop any playback
	 */
	$('#myRelayPresentationModal').on('hide.bs.modal', function (event) {
		document.getElementById('presentation_preview').pause();
	});

	/**
	 * Presentation details modal (delete presentation)
	 *
	 * TODO
	 */
	$('#myRelayPresentationModal').find('#presentation_delete').on('click', function (event) {
		UTILS.alertInfo('KOMMER SNART', 'Denne funksjonaliteten er ikke implementert enda.');
	});

	/**
	 * Embed code modal
	 */
	$('#myRelayEmbedModal').on('show.bs.modal', function (event) {
		// Link that was clicked
		var trigger = $(event.relatedTarget);
		// Get the selected URL to embed from the link that triggered this modal
		var embed_url = trigger.attr('data-url');
		// TextArea
		var $embed_code = $('#myRelayEmbedModal').find('#embedcode');
		// OLD
		// Media directly into iFrame. Generates <video> element with autostart true...
		//$embed_code.val('<iframe style="width:' + $('#myRelayEmbedModal').find('#videowidth').val() + 'px; height:' + $('#myRelayEmbedModal').find('#videoheight').val()
		//	+ 'px;" allowfullscreen webkitallowfullscreen mozallowfullscreen frameborder="0" scrolling="no" src="'
		//	+ embed_url + '"></iframe>');
		//
		$embed_code.val(
			'<video width="100%" height="auto" controls>' +
				'<source src="' + embed_url + '" type="video/mp4">' +
				'Your browser does not support the video tag.' +
				'</video>'
		);
		// Flash
		$embed_code.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
	});


	return {
		init: function () {
			init();
		},
		hide: function () {
			onHideListener();
		},
		show: function () {
			onShowListener();
		},
		dimensionsChanged: function (x, y) {
			dimensionsChanged(x, y);
		}
	}

})();