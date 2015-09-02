/**
 * MENU Controller
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
		// Dash only for admins
		if (KIND.isAdmin()) {
			PAGE_DASHBOARD.init();
			$('li#menuDashboard').removeClass('hidden').fadeIn();
			$('li#menuDashboard').trigger('click');
		}

		// If user has an account
		if (RELAY_USER.hasAccount()) {
			$('li#menuMyRelay').removeClass('hidden').fadeIn();
			PAGE_MY_RELAY.init();
			// If user is not an admin, this is the only page s/he can view
			if (!KIND.isAdmin()) {
				$('li#menuMyRelay').trigger('click');
			}
		}


		if (KIND.isSuperAdmin()) {
			$('li#menuOrgAdmin').removeClass('hidden').fadeIn();
			$('li#menuSuperAdmin').removeClass('hidden').fadeIn();
			PAGE_ORG_ADMIN.init();
			PAGE_SUPER_ADMIN.init();
		} else if (KIND.isOrgAdmin()) {
			PAGE_ORG_ADMIN.init();
			$('li#menuOrgAdmin').removeClass('hidden').fadeIn();
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
	//
	switch ($(this).data('page')) {
		case 'pageDashboard':
			PAGE_DASHBOARD.show();
			PAGE_SUPER_ADMIN.hide();
			PAGE_ORG_ADMIN.hide();
			PAGE_MY_RELAY.hide();
			break;
		case 'pageSuperAdmin':
			PAGE_DASHBOARD.hide();
			PAGE_SUPER_ADMIN.show();
			PAGE_ORG_ADMIN.hide();
			PAGE_MY_RELAY.hide();
			break;
		case 'pageOrgAdmin':
			PAGE_DASHBOARD.hide();
			PAGE_SUPER_ADMIN.hide();
			PAGE_ORG_ADMIN.show();
			PAGE_MY_RELAY.hide();
			break;
		case 'pageMyRelay':
			PAGE_DASHBOARD.hide();
			PAGE_SUPER_ADMIN.hide();
			PAGE_ORG_ADMIN.hide();
			PAGE_MY_RELAY.show();
	}
});
