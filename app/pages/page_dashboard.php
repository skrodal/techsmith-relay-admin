<link rel="stylesheet" href="dist/plugins/morris/morris.css">

<!-- Main content -->
    <section id="pageDashboard" class="content app_page hidden">

		<div class="jumbotron clearfix">
			<button type="button" class="btn bg-dark-gray icon ion-ios-information pull-right" data-toggle="modal" data-target="#infoDashModal"> Om...</button>
			<div class="container">
				<h1 class="text-nowrap"><i class="icon ion-ios-pulse-strong text-muted"></i>  <strong>Relay</strong>Admin</h1>
				<p class="lead text-muted">— Dashboard</p>
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
			<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-green-active"><i class="ion ion-university"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">ABONNENTER</span>
						<span class="info-box-number subscribersCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>
						<div class="progress bg-green-active"></div>
						<span class="progress-description text-muted">Fullverdige</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-green"><i class="ion ion-ios-people-outline"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">BRUKERE TOTALT</span>
						<span class="info-box-number globalUsersCountTotal mightOverflow"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>
						<div class="progress bg-green"></div>
						<span class="progress-description text-muted mightOverflow"><span class="globalUsersCountByAffiliation"><!-- --></span></span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<!-- fix for small devices only -->
			<div class="clearfix visible-sm-block"></div>


			<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-green disabled"><i class="ion ion-ios-people"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">AKTIVE BRUKERE</span>
						<span class="info-box-number globalActiveUsersCountTotal mightOverflow"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>
						<div class="progress bg-green disabled"></div>
						<span class="progress-description text-muted mightOverflow"><span class="globalActiveUsersCountByAffiliation"><!-- --></span></span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-light-blue-active"><i class="ion ion-upload"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">LAGRING</span>
						<span class="info-box-number subscribersDiskusageTotal"><!-- --></span>
						<div class="progress bg-light-blue-active"></div>
						<span class="progress-description text-muted">Akkurat n&aring;</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<!-- fix for small devices only -->
			<div class="clearfix visible-sm-block"></div>

			<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-light-blue"><i class="ion ion-ios-film"></i></span>
					<div class="info-box-content">
						<span class="info-box-text mightOverflow">PRESENTASJONER</span>
						<span class="info-box-number description-header globalPresentationCount mightOverflow"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>
						<div class="progress bg-light-blue"></div>
						<span class="progress-description text-muted mightOverflow">Slettede opptak ikke medregnet</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-light-blue disabled"><i class="ion ion-ios-timer-outline"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">
							JOBBER I KØ
							<button class="icon ion-android-refresh pull-right no-padding btn btn-sm btn-link updateQueue"> oppdater</button>
						</span>
						<span class="info-box-number"><span class="queueTotal"><!-- --><i class="fa fa-spinner fa-pulse"></i></span></span>
						<div class="progress bg-light-blue disabled"></div>
						<span class="progress-description text-muted">Akkurat n&aring;</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->
		</div>

	    <h2 class="page-header text-muted">Tjenesteinformasjon</h2>

	    <div class="row">
			<div class="col-lg-4">
				<!-- BOX -->
				<div id="serverInfo" class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-information"> Relay Server</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div><!-- /.box-header -->

					<div class="box-body">
						<div class="info-box bg-aqua">
							<span class="info-box-icon"><i class="icon ion-speedometer"></i></span>
							<div class="info-box-content">
								<span class="info-box-more"><strong>Versjon:</strong> <span class="relayVersion"><!-- --></span></span>
								<span class="info-box-more"><strong>Workers:</strong> <span class="relayWorkers"><!-- --></span></span>
								<div class="progress bg-gray"></div>
								<span class="info-box-more"><strong>URL: </strong> <a style="color: #FFF;" class="relayServiceURL"><span class="relayServiceURL"><!--></span></a></span>
							</div>
						</div>
						<a class="relayClientDownloadURL" target="_blank">Hent siste versjon av Relay Recorder</a>
                    </div><!-- /.box-body -->
					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
                </div><!-- /.box -->

				<!-- BOX -->
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-person"> Din konto</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>

					<div id="relayAccountInfo" class="box-body">
						<p>Brukernavn: <code class="relayUserName"></code></p>
						<p>E-post: <code class="relayUserEmail"></code></p>
						<p>Nettsted for tjenesten er <a class="text-light-blue relayServiceURL" target="_blank"><span class="relayServiceURL"><!--></span></a></p>
						<p>Her kan du endre passord, laste ned programvare, se status på dine publiseringer m.m.</p>
						<p>Brukerveiledninger og mer hjelp med tjenesten finner du på <a class="text-light-blue relaySupportURL" target="_blank">UNINETT sine hjelpesider</a>.</p>
					</div>
				</div>
			</div>

			<div class="col-lg-8">
				<!-- QUEUE -->
				<div id="relayQueueMonitorDetails" class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-timer"> Kømonitor</h3>
						<div class="box-tools pull-right">
							<button class="icon ion-android-refresh no-padding btn btn-sm btn-link updateQueue"> oppdater</button>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div><!-- /.box-header -->

					<div class="box-body">
						<p>
							Tabellen gir en pekepinn på hvor lenge du vil måtte vente før din presentasjon er ferdig konvertert.
						    Konvertering av en presentasjon som varer en time vil ta rundt 3 timer. Øverste presentasjon i tabell er først i køen.
						</p>

					    <div id="queueTable" class="table-responsive">
							<table class="table no-margin">
								<thead class="bg-aqua-active">
									<tr>
										<th>ID</th>
										<th>Mottatt</th>
										<th>Jobber</th>
										<th>Varighet</th>
										<th>Eier</th>
									</tr>
								</thead>
								<tbody id="queueTableBody">
								<!-->
								</tbody>
							</table>
						</div>
						<p class="text-muted">
							Konvertering av en presentasjon består typisk av 4 jobber (formater for lyd, mobil, nettbrett og PC). Relay har
							<span class="relayWorkers"><!--></span> servere som hver har kapasitet til å utføre 7 jobber samtidig.
						</p>

                    </div><!-- /.box-body -->
					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
                </div><!-- /.box -->
			</div>
		</div>


		<h2 class="page-header text-muted">Bruksmønster</h2>

	    <div class="row">
			<div class="col-lg-12">
				<!-- HITS -->
				<div id="hitsLastWeekTotalContainer" class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-eye"> Daglige (unike) hits siste 30 dager</h3>
						<div class="box-tools pull-right">
							<span data-toggle="tooltip" data-original-title="Visninger siste 30 dager" class="badge bg-aqua-gradient hitsLastMonthTotal" ><!-- --></span>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div><!-- /.box-header -->

					<div class="box-body">
						<div class="chart" id="hitsLastMonthChart" style="height: 200px;">
							<!-- AJAX -->
							<span class="text-center">
								<h3>Grafen er ikke implementert enda.</h3>
								<h4>Kommer (kanskje) snart.</h4>
							</span>

						</div>
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
						<h3 class="box-title ion-ios-person"> Dataporten</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<pre><code id="dataportenSessionInfo"></code></pre>
					</div><!-- /.box-body -->
					<div class="box-footer">
						Attributter hentet fra UNINETT Dataporten. Evt. feil/mangler kan meldes til <span class="supportEmail"><!--></span>
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
						<p>Følgende læresteder har (hatt) tilgang til TechSmith Relay fra UNINETT:</p>
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

		<!-- QUEUE DETAILS MODAL -->
		<div class="modal fade" id="infoQueueModal" tabindex="-1" role="dialog" aria-labelledby="modalQueueTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header bg-dark-gray">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;&nbsp;<span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="modalQueueTitle">Presentasjoner i kø</h4>
					</div>

					<div class="modal-body">
						<p>
							Konvertering av en presentasjon består typisk av 4 jobber (formater for lyd, mobil, nettbrett og PC). Relay har
							<span class="relayWorkers"><!--></span> servere som hver har kapasitet til å utføre 7 jobber samtidig.
						</p>
						<p>
							Tabellen gir en pekepinn på hvor lenge du vil måtte vente før din presentasjon er ferdig konvertert.
						    Konvertering av en presentasjon som varer en time vil ta rundt 3 timer.
						</p>
					    <p>Følgende opptak ligger i kø for å bli konvertert:</p>

					    <div id="queueTable" class="table-responsive">
							<table class="table no-margin">
								<thead class="bg-aqua-active">
									<tr>
										<th>ID</th>
										<th>Mottatt</th>
										<th>Jobber</th>
										<th>Varighet</th>
										<th>Eier</th>
									</tr>
								</thead>
								<tbody id="queueTableBody">
								<!-->
								</tbody>
							</table>
						</div>
					</div>

					<div class="modal-footer bg-dark-gray">
						<span class="pull-left" style="line-height: 34px;">Opptak øverst i lista er fremst i køen.</span>
						<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
					</div>
				</div>
			</div>
		</div>
      <!-- //.modal -->


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
								<a class="relayServiceURL" target="_blank"><span class="relayServiceURL"><!--></span></a> -
								sluttbrukergrensesnitt for nedlasting av programvare Relay Recorder.
							</p>

						    <p>
							    <span class="screencastBaseURL"><!--></span> - domene der innhold publiseres til (skjer automatisk).
						    </p>

						    <p><strong>Støtteverktøy levert av UNINETT:</strong></p>
						    <p>
							    <a class="relaySupportURL" target="_blank"><span class="relaySupportURL"><!--></span></a> -
								brukerveiledninger, selvbetjent kontooppretter, Min Relay for selvbetjent administrasjon av innhold,
							    kø-monitor, forum...
						    </p>

						    <p>
							    Samt denne tjenesten som gir administratorer bedre oversikt over brukere, innhold og statistikk for sitt
							    lærested.
						    </p>

							<p><strong>Dataporten</strong></p>
							<p>
								Tjenesten bruker <a href="http://www.dataporten.no" target="_blank"><i class="ion ion-star"></i> Dataporten <i class="ion ion-star"></i></a> fra UNINETT for autentisering og dataflyt.
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
  <script src="app/js/page_dashboard.min.js" type="text/javascript"></script>