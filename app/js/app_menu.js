/**
 * Control the menu items/behaviour — determined by user role/access.
 *
 * @author Simon Skrodal
 * @since August 2015
 */


var MENU = (function () {

	/**
	 * Called by APP, which has already waited for all XHR calls to complete.
	 */
	function init() {
		_showMenuItems();
	}

	/**
	 * Controls menu items and initiates appropriate page based on access level.
	 *
	 * @private
	 */
	function _showMenuItems() {
		// Dash and OrgAdmin view for admins
		if (DATAPORTEN.isSuperAdmin() || DATAPORTEN.isOrgAdmin()) {
			PAGE_DASHBOARD.init();
			$('#menuDashboard').removeClass('hidden').fadeIn();
			$('#menuDashboard').trigger('click');
			//
			PAGE_ORG_ADMIN.init();
			$('#menuOrgAdmin').removeClass('hidden').fadeIn();
		}
		// View for SuperAdmins
		if (DATAPORTEN.isSuperAdmin()) {
			PAGE_SUPER_ADMIN.init();
			$('#menuSuperAdmin').removeClass('hidden').fadeIn();
		}

	}

	return {
		init: function () {
			init();
		}
	}
})();

// The menu
var $sidebarMenu = $('#sidebar-menu');

/**
 * Page show/hide logic
 */
$sidebarMenu.on('click', 'li', function () {
	// Make clicked li style active
	$(this).addClass('active').siblings().removeClass("active");
	// Hide all pages
	$('section.app_page').addClass('hidden');
	// Show selected page
	$('section#' + $(this).data('page')).removeClass('hidden').hide().fadeIn();

	// Not the best solution this, but a few updates are required for pages that are hidden.
	switch ($(this).data('page')) {
		case 'pageDashboard':
			PAGE_DASHBOARD.show();
			PAGE_SUPER_ADMIN.hide();
			PAGE_ORG_ADMIN.hide();
			//PAGE_MY_RELAY.hide();
			break;
		case 'pageSuperAdmin':
			PAGE_DASHBOARD.hide();
			PAGE_SUPER_ADMIN.show();
			PAGE_ORG_ADMIN.hide();
			//PAGE_MY_RELAY.hide();
			break;
		case 'pageOrgAdmin':
			PAGE_DASHBOARD.hide();
			PAGE_SUPER_ADMIN.hide();
			PAGE_ORG_ADMIN.show();
			//PAGE_MY_RELAY.hide();
			break;
		case 'pageMyRelay':
			PAGE_DASHBOARD.hide();
			PAGE_SUPER_ADMIN.hide();
			PAGE_ORG_ADMIN.hide();
			//PAGE_MY_RELAY.show();
	}
});
