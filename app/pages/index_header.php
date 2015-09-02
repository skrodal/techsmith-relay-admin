<header class="main-header">
	<!-- Logo -->
	<a href="index.php" class="logo">
	    <img src="dist/AdminLTE/img/UNINETT_logo_dark_gray.svg" alt="UNINETT AS" type="image/svg+xml">
	</a>
	<!-- Header Navbar -->
	<nav class="navbar navbar-static-top" role="navigation">
	    <!-- Sidebar toggle button-->
		<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
			<span class="sr-only">Vis/skjul meny</span>
		</a>

		<span class="navbar-title">
			<strong>Relay</strong>Admin
			<sup class="text-orange" style="font-size: 10px; font-weight: bold; vertical-align: middle;">beta</sup>
		</span>

		<!-- Navbar Right Menu -->
		<div class="navbar-custom-menu">
			<ul class="nav navbar-nav">
				<!-- User Account Menu -->
				<li id="userMenu" class="dropdown user user-menu hidden">
					<!-- Menu Toggle Button -->
					<a href="#" class="dropdown-toggle" data-toggle="dropdown">
						<!-- The user image in the navbar-->
						<img src="" class="user-image userImage"><!-- updateUserUI -->
						<!-- hidden-xs hides the username on small devices so only the image appears.-->
						<span class="hidden-xs userFirstName"><!-- --></span>

					</a>
					<ul class="dropdown-menu">
						<!-- The user image in the menu -->
						<li class="user-header">
							<img src="" class="img-circle userImage"><!--   -->
	                        <p>
		                        <span class="text-muted userFullName"><!-- --></span>
		                        <small><span class="feideOrg"><!-- --></span></small>
	                        </p>
						</li>
						<!-- <li class="user-body"></li> -->
						<!-- Menu Footer-->
						<li class="user-footer">
							<div class="pull-right">
								<a href="https://auth.feideconnect.no/logout" class="btn btn-flat ion-log-out" onclick="jso.wipeTokens()"> Logg ut</a>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</nav>
</header>