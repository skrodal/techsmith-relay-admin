/**
 * PAGE controller for My Relay.
 *
 * @author Simon Skrodal
 * @since August 2015
 */

var PAGE_MY_RELAY = (function () {
	// List of all presentations
	var USERCONTENT = [];
	var DISKUSAGE = [];
	// List of all presentations requested to be deleted
	var USERCONTENT_DELETELIST = [];
	// TODO: Should probably get this setting from the deletelist API (in case of changes on that end)
	var days_to_delete = 14;

	// Tables
	var relayContentTable, relayDeletedContentTable;

	/**
	 * Trigger point - do stuff if user has an account.
	 */
	function init() {
		if (RELAY_USER.hasAccount()) {
			_updateUserUI();
			_updateDeleteListAndBuildTables();
			// No account
		} else {
			$('.relayUserName').html("MANGLER KONTO");
			// No account - remove all page content, sans Jumbotron
			$("#pageMyRelay").find("div:first").nextAll().remove();
		}

	}

	/**
	 * Call whenever a presentation is deleted/undeleted
	 * @private
	 */
	function _updateDeleteListAndBuildTables() {

		$.when(RELAY_USER.contentXHR(), RELAY_USER.diskusageXHR()).done(function (contentArr, diskusageArr) {
			if (RELAY_USER.hasContent()) {
				USERCONTENT = JSON.parse(JSON.stringify(contentArr));
				DISKUSAGE = diskusageArr;
				// Now check the relay-presentation-delete service for any presentations that have a delete-request (can be cancelled)
				// or has already been moved (can be restored). We ignore presentations already deleted, since this is permanent and
				// no longer of interest.
				$.when(RELAY_USER.getPresentationsDeleteListXHR()).done(function (presDeleteList) {
					USERCONTENT_DELETELIST = [];
					// Keep track of which presentations to eliminate from USERCONTENT
					var indecesToDelete = [];
					$.each(USERCONTENT, function (contentIndex, contentObj) {
						$.each(presDeleteList, function (X, delObj) {
							// If the presentation exists in the deletelist..
							// "moved": "1", "deleted": "1", "undelete": "0"
							if (contentObj.path == delObj.path) {
								USERCONTENT_DELETELIST[contentIndex] = contentObj;
								USERCONTENT_DELETELIST[contentIndex].in_deletelist = 1;
								USERCONTENT_DELETELIST[contentIndex].is_deleted = parseInt(delObj.deleted);
								USERCONTENT_DELETELIST[contentIndex].is_moved = parseInt(delObj.moved);
								USERCONTENT_DELETELIST[contentIndex].is_undelete = parseInt(delObj.undelete);
								USERCONTENT_DELETELIST[contentIndex].timestamp = delObj.timestamp;
								// Delete this index from USERCONTENT
								indecesToDelete.push(contentIndex);
								return false;
							}
						});
					});

					// Rebuild the array index for deleted content
					USERCONTENT_DELETELIST = USERCONTENT_DELETELIST.filter(function () { return true; });
					// Now remove deleted presentations from the USERCONTENT array
					indecesToDelete.reverse();
					$.each(indecesToDelete, function (index, toDelete) {
						USERCONTENT.splice(toDelete, 1);
					});

					// 08.07.2016: Relay Harvester does not yet record deleted presentations. For now, we use the relay-presentation-delete service
					// only and match user's MongoDB content with this info. Harvester does, however, update diskusage (also when deleted), so we can
					// rely on this to be up to date every 24 hours.
					_updateContentUI(USERCONTENT, DISKUSAGE);
					// Destroy tables (if they already exist) before rebuilding
					if (relayContentTable)relayContentTable.destroy();
					if (relayDeletedContentTable)relayDeletedContentTable.destroy();
					//
					_buildContentTable(USERCONTENT);
					_buildDeletedContentTable(USERCONTENT_DELETELIST.filter(function () {
						return true;
					}));
				});
				// No content
			} else {
				// TODO: Show info instead of table
			}
		});
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
		$.when(RELAY_USER.accountXHR()).done(function (userInfo) {
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
		var deletedCount = $(USERCONTENT_DELETELIST).size();
		var durationTotalSec = 0;
		var totalStorage = 0;

		$.each(contentArr, function (index, contentObj) {
			hitCount += contentObj.hits;
			// deletedCount += parseInt(contentObj.is_deleted);
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
		relayContentTable = $('#myRelayContentTable').DataTable({
			"bAutoWidth": !true, // Note! Not sure which looks best
			"language": CONFIG.DATATABLES_LANGUAGE(),
			"data": contentArr,
			"order": [[3, 'desc']],
			"columns": [
				// Simon 20FEB2015: 1st column is date presented in a way DataTables can sort (YYYY-MM-DD) and is hidden
				// The other, visible, date column sorts by this column here. A very useful 'hack'.
				{
					"data": "created_date",
					"render": function (data, type, full, meta) {
						var date = new Date(data.sec * 1000);
						return date.getUTCFullYear() + '-' + UTILS.two(date.getUTCMonth() + 1) + '-' + UTILS.two(date.getUTCDate());
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
						var date = new Date(data.sec * 1000);
						return UTILS.two(date.getUTCDate()) + '. ' + UTILS.months_short(date.getUTCMonth()) + ' ' + date.getUTCFullYear();
						//return data;
					},
					"iDataSort": 0  // USE HIDDEN DATE COLUMN FOR SORTING
				},

				{
					"data": "duration_s",
					"render": function (data, type, full, meta) {
						return UTILS.secToTime(data);
					}
				}
			]
		});

		// contentTable.order( [ 0, 'desc' ] ).draw();

		$('#myRelayContent').find('.ajax').hide();
	}


	//
	function _buildDeletedContentTable(contentArr) {
		$('#myRelayDeletedContent').find('.ajax').show();
		relayDeletedContentTable = $('#myRelayDeletedContentTable').DataTable({
			"bAutoWidth": !true, // Note! Not sure which looks best
			"language": CONFIG.DATATABLES_LANGUAGE(),
			"data": contentArr,
			"order": [[2, 'desc']],
			"columns": [
				// Simon 20FEB2015: 1st column is date presented in a way DataTables can sort (YYYY-MM-DD) and is hidden
				// The other, visible, date column sorts by this column here. A very useful 'hack'.
				{
					"data": "created_date",
					"render": function (data, type, full, meta) {
						var date = new Date(data.sec * 1000);
						return date.getUTCFullYear() + '-' + UTILS.two(date.getUTCMonth() + 1) + '-' + UTILS.two(date.getUTCDate());
						//return data;
					},
					"bVisible": false // HIDE COLUMN
				},
				{
					"data": "title",
					"render": function (data, type, full, meta) {
						// Important: ID refers to index in contentArr
						return '<span data-arr-id="' + meta.row + '">' + data + '</span>';
					}
				},
				{
					"data": "created_date",
					"render": function (data, type, full, meta) {
						var date = new Date(data.sec * 1000);
						var dateFormatted = UTILS.two(date.getUTCDate()) + '. ' + UTILS.months_short(date.getUTCMonth()) + ' ' + date.getUTCFullYear();
						return dateFormatted;
					},
					"iDataSort": 0  // USE HIDDEN DATE COLUMN FOR SORTING
				},

				{
					"data": "duration_s",
					"render": function (data, type, full, meta) {
						return UTILS.secToTime(data);
					}
				},
				{
					"data": "is_deleted",
					"render": function (data, type, full, meta) {
						// return '<em>' + data + '</em>';
						if (full.in_deletelist) {
							if (full.is_deleted) {
								return '<p><span class="label label-default">Utilgjengelig</span> - slettet permanent</p>';
							}
							if (full.is_undelete) {
								return '<p><span class="label label-success">Gjenopprettes</span> - blir snart tilgjengelig igjen</p>';
							}
							if (full.is_moved) {
								var deleted = new Date(full.timestamp).getTime();
								var now = Date.now();
								var diff = Math.floor(( now - deleted ) / 86400000);

								return '<p><span class="label label-danger">Slettes</span> - slettes permanent om <strong>' + (days_to_delete - diff)  + '</strong> dager</p>';
							}
							// If none of the above, presentation is in the process of being moved
							return '<p><span class="label label-warning">Flyttes</span> - vil bli utilgjengelig kl. 03:00</span></p>';
						} else {
							// Not in deletelist at all, should never get here since this content belongs in USERCONTENT
							return '<p><span class="label label-success">Tilgjengelig</span></p>';
						}
					}
				},
				{
					"data": "is_deleted",
					"render": function (data, type, full, meta) {
						if (full.in_deletelist) {
							if (full.is_deleted) {
								return '<p class="text-center text-muted small">Slettet</p>';
							}
							if (full.is_undelete) {
								return '<p class="text-center text-muted small" data-obj="'+data+'">Gjenopprettes</p>';
							}
							if (full.is_moved) {
								// Add data to button for use in XHR call when clicked
								return '<p class="text-center"><button data-trigger="undelete" type="button" data-type="moved" data-undelete-path="' + full.path + '" class="btn btn-primary btn-xs"> <i class="ion ion-ios-undo"></i> Angre</button></p>';
							}
							// If none of the above, presentation is not yet moved from user folder
							// Add data to button for use in XHR call when clicked
							return '<p class="text-center"><button data-trigger="undelete" type="button" data-type="unmoved" data-restore-path="' + full.path + '"class="btn btn-primary btn-xs"> <i class="ion ion-ios-undo"></i> Angre</button></p>';
						} else {
							// Not in deletelist at all, should never get here since this content belongs in USERCONTENT
							return '<p class="text-center">Tilgjengelig</p>';
						}
					}
				}
			],
			"rowCallback": function (row, data, index) {
				if (data.is_deleted) {
					$(row).addClass( 'text-gray' );
					$(row).addClass( 'disabled' );
					$(row).css( 'text-decoration', 'line-through' );
				}
			}
		});

		$('#myRelayDeletedContent').find('.ajax').hide();
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
		var pres_date = new Date(presentationObj.created_date.sec * 1000);
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

		// Add the path to the presentation to the delete button's data attrib. We use this when calling the delete API.
		modal.find('#presentation_delete').data("path", presentationObj.path);
	});


	/**
	 * Presentation details modal (closing)
	 *
	 * Stop any playback
	 */
	$('#myRelayPresentationModal').on('hide.bs.modal', function (event) {
		document.getElementById('presentation_preview').pause();
	});

	$('#pageMyRelay').find('#btnUpdateTables').on('click', function (event) {
		var btn = $(this);
		$('#myRelayContent').find('.ajax').show();
		$('#myRelayDeletedContent').find('.ajax').show();
		btn.button('loading');
		_updateDeleteListAndBuildTables();
		btn.button('reset');
	});


	/**
	 * UNDELETE/UNMOVE
	 */
	$('#pageMyRelay').on('click', 'button[data-trigger="undelete"]', function (event) {
		var btn = $(this);
		btn.button('loading');
		// Ajax tables
		$('#myRelayContent').find('.ajax').show();
		$('#myRelayDeletedContent').find('.ajax').show();

		switch (btn.data("type")) {
			case "moved":
				$.when(RELAY_USER.undeletePresentationXHR(btn.data("undeletePath"))).done(function (response) {
					btn.button('reset');
					// UPDATE TABLES
					_updateDeleteListAndBuildTables();
				});
				break;
			case "unmoved":
				$.when(RELAY_USER.removePresentationXHR(btn.data("restorePath"))).done(function (response) {
					btn.button('reset');
					// UPDATE TABLES
					_updateDeleteListAndBuildTables();
				});
				break;
		}

	});
	/**
	 * Presentation details modal (delete presentation)
	 */
	$('#myRelayPresentationModal').find('#presentation_delete').on('click', function (event) {
		if (confirm('Vil du slette denne presentasjonen?')) {
			//
			var btn = $(this);
			var pathToDelete = btn.data("path");
			btn.button('loading');

			$.when(RELAY_USER.deletePresentationXHR(pathToDelete)).done(function (response) {
				console.log(response);
				btn.button('reset');
				// Hide modal window
				$('#myRelayPresentationModal').modal('hide');
				// UPDATE TABLES
				_updateDeleteListAndBuildTables();
			});

			// Todo:
			// - run an ajax call to delete (confirmation dialog +++)
			// - implement delete/restore/undelete in the relay_user.js API CONSUMER FILE.
		}

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