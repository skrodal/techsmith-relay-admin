<link rel="stylesheet" href="dist/plugins/morris/morris.css">

<!-- Main content -->
    <section id="pageDashboard" class="content app_page hidden">

		<div class="jumbotron clearfix">
			<button type="button" class="btn bg-dark-gray icon ion-ios-information pull-right" data-toggle="modal" data-target="#infoDashModal"> Om&hellip;</button>
			<div class="container">
				<h1 class="text-nowrap"><i class="icon ion-ios-pulse-strong text-muted"></i>  <strong>Relay</strong>Admin</h1>
				<p class="lead text-muted">Statistikk og kostnadsestimator for din organisasjon.</p>
			</div>

			<div class="pull-right">
				<h2><span class="text-muted userFullName"><!-- --></span></h2>
				<span class="label bg-light-blue icon ion-ios-home feideOrg"><!-- --></span>
				<span class="label bg-light-blue icon ion-university feideAffiliation"><!-- --></span>
				<span class="label bg-light-blue icon ion-ios-star userRole"><!-- --></span>
			</div>
		</div>

		<h2 class="page-header text-muted">Globale tall</h2>

		<div class="row">
			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-aqua"><i class="ion ion-university"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">ABONNENTER</span>
						<span class="info-box-number subscribersCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>
						<div class="progress bg-aqua"></div>
						<span class="progress-description text-muted">Fullverdige</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-red"><i class="ion ion-ios-people-outline"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">BRUKERE</span>
						<span class="info-box-number globalUsersCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>
						<div class="progress bg-red"></div>
						<span class="progress-description text-muted">Totalt</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<!-- fix for small devices only -->
			<div class="clearfix visible-sm-block"></div>

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-green"><i class="ion ion-ios-people"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">MED INNHOLD</span>
						<span class="info-box-number"> <span class="globalEmployeeCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span> /  <span class="globalStudentCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span> </span>
						<div class="progress bg-green"></div>
						<span class="progress-description text-muted">Ansatte/Studenter</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-yellow-active"><i class="ion ion-ios-film"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">PRESENTASJONER</span>
						<span class="info-box-number description-header globalPresentationCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>
						<div class="progress bg-yellow-active"></div>
						<span class="progress-description text-muted">TOTALT</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->
		</div>

	    <h2 class="page-header text-muted">Tjenesteinformasjon</h2>

	    <div class="row">
			<div class="col-lg-4">
				<div id="serverInfo" class="box box-info collapsed-box">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-information"> Relay Server</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div><!-- /.box-header -->

					<div class="box-body">
						<div class="info-box bg-aqua">
							<span class="info-box-icon"><i class="icon ion-speedometer"></i></span>
							<div class="info-box-content">
								<span class="info-box-more"><strong>Versjon:</strong> <span class="relayVersion"><!-- --></span></span>
								<span class="info-box-more"><strong>Workers:</strong> <span class="relayWorkers"><!-- --></span></span>
								<div class="progress bg-gray"></div>
								<span class="info-box-more"><strong>URL: </strong> <a style="color: #FFF;" href="https://relay.uninett.no">relay.uninett.no</a></span>

							</div>
						</div>
                    </div><!-- /.box-body -->
					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
                </div><!-- /.box -->

				<div id="relayQueueMonitor" class="box box-info collapsed-box">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-arrow-graph-up-right"> K&oslash;-monitor</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div><!-- /.box-header -->

					<div class="box-body">
						<div class="info-box bg-aqua">
							<span class="info-box-icon"><i class="icon ion-stats-bars"></i></span>
							<div id="relayQueueMonitorContent" class="info-box-content">
								<!-- -->
							</div>
						</div>
                    </div><!-- /.box-body -->
					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
                </div><!-- /.box -->
			</div>

			<div class="col-lg-8">
				<div id="hitsLastWeekTotalContainer" class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-eye"> Daglige visninger siste uke</h3>
						<div class="box-tools pull-right">
							<span data-toggle="tooltip" data-original-title="Visninger siste 7 dager" class="badge bg-aqua-gradient hitsLastWeekTotal" ><!-- --></span>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div><!-- /.box-header -->

					<div class="box-body">
						<div class="chart" id="hitsLastWeekChart" style="height: 200px;"><!-- AJAX --></div>
                    </div><!-- /.box-body -->
					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
                </div><!-- /.box -->
			</div>
		</div>

		<h2 class="page-header text-muted">Abonnenter</h2>
	    <div class="row">
			<div class="col-md-5">
				<!-- PIE CHART -->
				<div id="usersPie" class="box box-success">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-pie"> Brukere fordelt p&aring; abonnenter</h3>
					</div>
					<div class="box-body">
						<canvas id="chartOrgsUserCountDashboard">
							<!--buildDashboardOrgsDiskusagePie-->
						</canvas>

						<p>
							<code class="feideOrg"></code> har <code class="homeOrgUserCount"></code> brukere.
						</p>
					</div><!-- /.box-body -->
					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
					<div class="box-footer">
						<span class="text-muted icon ion-ios-information">&nbsp;
							<small>
								Data er anonymifisert
							</small>
						</span>
					</div><!-- /.box-footer -->
				</div><!-- /.box -->

				<div class="box box-success">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-list-outline"> Oversikt</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div><!-- /.box-header -->

					<div class="box-body">
						<div class="info-box bg-olive">
							<span class="info-box-icon"><i class="icon ion-home"></i></span>
							<div class="info-box-content">
								<strong>Abonnenter:</strong> <span class="subscribersCount"><!--updateUserUI--><i class="fa fa-spinner fa-pulse"></i></span><br>
								<strong>Utprøving/bestilt:</strong> <span class="subscribersTrialCount"><!--updateUserUI--><i class="fa fa-spinner fa-pulse"></i></span><br>
								<strong>Andre:</strong> <span class="subscribersOtherCount"><!--updateUserUI--><i class="fa fa-spinner fa-pulse"></i></span><br>
								<strong>Totalt:</strong> <span class="subscribersTotalCount"><!--updateUserUI--><i class="fa fa-spinner fa-pulse"></i></span>
							</div>
						</div>

						<div class="info-box bg-olive">
							<span class="info-box-icon"><i class="icon ion-upload"></i></span>
							<div class="info-box-content">
								<span class="info-box-text">Lagring totalt</span>
								<h3 class="subscribersDiskusageTotal" class="info-box-number"><!--getTotalDiskusage--><i class="fa fa-spinner fa-pulse"></i></h3>
							</div>
						</div>
                    </div><!-- /.box-body -->
                </div><!-- /.box -->

				<h2 class="page-header text-muted">Sesjonsinformasjon</h2>
				<!-- Session info (DEV) -->
				<div class="box box-default collapsed-box">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-person"> Feide Connect</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<pre><code id="connectSessionInfo"></code></pre>
					</div><!-- /.box-body -->
					<div class="box-footer">
						Attributter hentet fra Feide Connect. Evt. feil/mangler kan meldes til <a href="mailto:support@ecampus.no">support@ecampus.no</a>
					</div>
				</div><!-- /.box -->

            </div><!-- /.col -->

            <div class="col-md-7">
				<!-- TABLE: SUBSCRIBERS -->
				<div id="subscribersTable" class="box box-success">
					<div class="box-header with-border">
						<h3 class="box-title ion-ios-home"> Abonnenter</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool icon ion-ios-information" style="margin-right: 15px;" data-toggle="modal" data-target="#subscriptionInfoDashModal">&nbsp;info&hellip;</button>
							<span data-toggle="tooltip" title="Totalt" class="badge bg-blue subscribersTotalCount"><!--updateUserUI--></span>
							<span data-toggle="tooltip" title="Aktive" class="badge bg-green subscribersCount"><!--updateUserUI--></span>
							<span data-toggle="tooltip" title="Utpr&oslash;ving/bestilt" class="badge bg-orange subscribersTrialCount"><!--updateUserUI--></span>
							<span data-toggle="tooltip" title="Andre" class="badge bg-red subscribersOtherCount"><!--updateUserUI--></span>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>

					<div class="box-body">
						<div id="subscribers_table_dash" class="table-responsive">
							<table class="table no-margin">
								<thead>
									<tr>
										<th>Org</th>
										<th style="text-align: center;">Status</th>
									</tr>
								</thead>
								<tbody id="subscriber_table_body">
									<!--buildOrgsTableDashboard-->
								</tbody>
							</table>
						</div><!-- /.table-responsive -->
					</div><!-- /.box-body -->

					<div class="box-footer text-muted">
						<small><i class="icon ion-ios-information"></i> Abonnementsinformasjon hentet live fra UNINETTs driftsdatabase ('KIND').</small>
					</div>

					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
				</div><!-- /.box -->
            </div><!-- /.col -->

        </div><!-- /.row -->


	    <!-- SUBSCRIPTION INFO MODAL -->
		<div id="subscriptionInfoDashModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalSubscriptionInfoTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header bg-dark-gray">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;&nbsp;<span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="modalInfoTitle">Status abonnement</h4>
					</div>
					<div class="modal-body">
						<div class="list-group">
							<div class="list-group-item bg-green">
								<h4 class="list-group-item-heading">Abonnent</h4>
								<p class="list-group-item-text">Avtaleverk signert</p>
							</div>

							<div class="list-group-item bg-orange">
								<h4 class="list-group-item-heading">Utpr&oslash;ving</h4>
								<p class="list-group-item-text">Mangler avtaleverk - &aring;pnet for testing i en tidsbegrenset periode</p>
							</div>

							<div class="list-group-item bg-red">
								<h4 class="list-group-item-heading">Andre</h4>
								<p class="list-group-item-text">Mangler avtaleverk - abonnement/utpr&oslash;ving avsluttet, eller org funsjonert</p>
							</div>
						</div>
					</div>
					<div class="modal-footer bg-dark-gray">
						<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
					</div>
				</div>
			</div>
		</div>

		<!-- INFO MODAL -->
		<div class="modal fade" id="infoDashModal" tabindex="-1" role="dialog" aria-labelledby="modalInfoTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header bg-dark-gray">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;&nbsp;<span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="modalInfoTitle">TechSmith Relay</h4>
					</div>

					<div class="modal-body">
						    <p><strong>URLer som inngår i tjenesten fra TechSmith:</strong></p>
							<p>
								<a href="https://relay.uninett.no">https://relay.uninett.no</a> -
								sluttbrukergrensesnitt for nedlasting av programvare Relay Recorder.
							</p>

						    <p>
							    https://screencast.uninett.no - domene der innhold publiseres til (skjer automatisk).
						    </p>

						    <p><strong>Støtteverktøy levert av UNINETT eCampus:</strong></p>
						    <p>
							    <a href="https://support.ecampus.no/techsmithrelay/">https://support.ecampus.no/techsmithrelay/</a> -
								brukerveiledninger, selvbetjent kontooppretter, Min Relay for selvbetjent administrasjon av innhold,
							    kø-monitor, forum...
						    </p>

						    <p>
							    Samt denne tjenesten som gir administratorer bedre oversikt over brukere, innhold og statistikk for sitt
							    lærested.
						    </p>

							<p>(Feide)<strong>Connect</strong></p>
							<p>
								Tjenesten bruker <a href="http://www.feideconnect.no" target="_blank"><i class="ion ion-star"></i> (Feide)Connect <i class="ion ion-star"></i></a> fra UNINETT for autentisering og dataflyt.
							</p>
					</div>

					<div class="modal-footer bg-dark-gray">
						<span class="pull-left" style="line-height: 34px;">
							RelayAdmin er utviklet og levert av<a href="http://www.uninett.no" class="logo"><img src="dist/AdminLTE/img/UNINETT_logo_dark_gray.svg" alt="UNINETT AS" style="vertical-align:middle; height: 18px;" type="image/svg+xml"></a>
						</span>
						<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
					</div>
				</div>
			</div>
		</div>
		<!-- //.modal -->

    </section>

  <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js"></script>
  <script src="app/js/page_dashboard.js" type="text/javascript"></script>