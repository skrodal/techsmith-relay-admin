<!-- Main content -->
    <section id="pageSuperAdmin" class="content app_page hidden">
		<div class="jumbotron clearfix bg-dark-gray">
			<div class="container">
				<h1 class="text-nowrap"><i class="icon ion-ios-star text-yellow"></i> <strong>Super</strong>Admin</h1>
				<p class="lead text-muted">Infoside for UNINETT internt.</p>
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
						<span class="info-box-number subscribersCount"><!-- --></span>
						<div class="progress bg-aqua"></div>
						<span class="progress-description text-muted">Med brukerkonto</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-red"><i class="ion ion-upload"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">LAGRING</span>
						<span class="info-box-number subscribersDiskusageTotal"><!-- --></span>
						<div class="progress bg-red"></div>
						<span class="progress-description text-muted">Akkurat n&aring;</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			      <!-- fix for small devices only -->
			<div class="clearfix visible-sm-block"></div>

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-yellow"><i class="ion ion-ios-people"></i></span>
					<div class="info-box-content">
						<span class="info-box-text mightOverflow">BRUKERE TOTALT</span>
						<span class="info-box-number"> <span class="globalUsersCountTotal"><!-- --><i class="fa fa-spinner fa-pulse"></i></span> </span>
						<div class="progress bg-green"></div>
						<span class="progress-description text-muted mightOverflow"><span class="globalUsersCountByAffiliation"><!-- --></span></span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-green"><i class="fa fa-money"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">FAKTURERBART</span>
						<span class="info-box-number description-header totalStorageCostEstimate"><!-- --></span>
						<div class="progress bg-olive"></div>
						<span class="progress-description text-muted mightOverflow">Estimat - kun lagring</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->
		</div>

		<h2 class="page-header text-muted">Tilstand</h2>

		<div class="row">
			<div class="col-md-6">
				<div id="queueFailedJobsContainer" class="box box-danger">
					<div class="box-header with-border">
						<h3 class="box-title"><i class="icon ion-heart-broken text-red"></i> Kræsjopptak</h3>
						<div class="box-tools pull-right">
							<button class="icon ion-android-refresh no-padding btn btn-sm btn-link refreshQueueFailedJobs"> oppdater</button>
						</div>
					</div>
					<div class="box-body">
						<p>
							Konverteringer som kræsjer vil fortsatt ligge i kø og spise ressurser (Relay vil forsøke konverteringen om og om igjen).
							Disse bør derfor fikses, kanselleres eller slettes.
						</p>
						<p>
							Aktive jobber i kø som har kræsjet: <span class="badge bg-orange queueFailedJobsCount"></span>
						</p>
						<div id="queueFailedJobsTable" class="table-responsive">
							<table class="table table-bordered table-hover table-condensed">
								<thead>
									<tr class="bg-red">
										<th>ID</th>
										<th>Antall forsøk</th>
										<th>Årsak</th>
									</tr>
								</thead>
								<tbody id="queueFailedJobsTableBody"><!--></tbody>
							</table>
						</div>
					</div><!-- /.box-body -->

					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
					<div class="box-footer text-muted">
						<a class="relayServiceURL" target="_blank">Gå til Relay Server og fix evt. problemer</a>
					</div>
				</div><!-- /.box -->
			</div><!-- /.col -->

			<div class="col-md-6">
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-code-working"> Server/API</i></h3>
					</div>
					<div class="box-body">
						<table class="table table-bordered table-hover table-condensed no-margin no-padding">
							<thead>
								<tr class="bg-aqua-active"><td colspan="3">Serverinformasjon:</td></tr>
							</thead>
							<tbody>
								<tr><td style="width: 30%;" nowrap>Database versjon: </td><td><span class="relayVersion"><!--></span></td></tr>
								<tr><td>Antall workers:</td><td><span class="relayWorkers"><!--></span> stk.</td></tr>
								<tr><td>Sist oppgradert:</td><td><span class="relayLastUpgrade"><!--></span></td></tr>
							</tbody>
						</table>
						<br>
						<p>RelayAdmin er avhengig av mange forskjellige services og APIer, bl.a. <code>Dataporten</code> (bruker/grupper), <code>TechSmith Relay</code> (metadata brukere/innhold), <code>Relay Sletting</code> og <code>Relay Hits</code> (IIS logger).</p>
						<p>Dersom Relay oppgraderes, <em>må</em> service/API-config oppdateres til å peke til riktig DB. Hvis versjon <code class="relayVersion"><!--></code> ikke stemmer overens med <em>faktisk</em> installert versjon av Relay har vi en liten krise på gang:</p>
						<ul>
							<li>Nye brukerkontoer skrives til gammel DB</li>
							<li>Høsting av nytt innhold/brukere/orgs vil ikke lenger fungere</li>
							<li>Alt av statistikk blir feil og deler av sletting/hits vil ikke lenger virke</li>
						</ul>
					</div>
					<div class="box-footer text-muted">
						<span class="text-muted">
							Tjenesteansvarlig har dokumentasjon på hva som må oppdateres ved oppgradering.
							Videre dokumentasjon/kode/info for ulike services/clients/APIs finnes også på server
							der de kjører, Simon Skrødal sin <a href="https://github.com/skrodal?tab=repositories" target="_blank">GitHub-side</a>
							(alle repos med <code>relay</code> i tittel) og i <a href="https://dashboard.dataporten.no">Dataporten</a>.
						</span>
					</div>
				</div>
			</div>

		</div>


	    <h2 class="page-header text-muted">Fakturering &amp; oversikt</h2>

		<div class="row">
			<div class="col-md-8">
				<div id="usersPie" class="box box-success">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-pie"> Fordeling av brukere</i></h3>
					</div>
					<div class="box-body">
						<canvas id="chartOrgsUserCountSuperAdmin">
							<!--buildOrgsDiskusageChart-->
						</canvas>
					</div><!-- /.box-body -->
					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>
					<div class="box-footer text-muted">
						Klikk på paien for å oppdatere detaljvisning nedenfor :)
					</div>
				</div><!-- /.box -->
			</div><!-- /.col -->

			<div class="col-md-4">
				<div class="box box-success">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-arrow-graph-down-right"> Kostnadsestimator</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>

					<div class="box-body">
						<p>
							Estimatoren er i utgangspunktet hardkodet med en pris per TB p&aring;
							<em>kr. <span class="storageCostPerTB"><!--updateUserUI()--></span></em>.
							Du kan endre dette i feltet under og klikke p&aring; kalkulatoren.
						</p>
						<p>
							Alle fakturaestimater i tjenesten oppdateres iht. kostnaden du setter her.
						</p>

						<p class="text-muted">
							* Estimatene baseres p&aring; siste avleste lagringsforbruk.
						</p>

						<div class="input-group input-group-sm" style="margin-bottom: 10px;">
	                        <input id="inputCostTB" type="text" placeholder="Pris per TB" value="" class="form-control pull-right" style="width: 100px;">
	                        <span class="input-group-btn">
	                            <button id="btnInvoiceCalc" class="btn btn-info btn-sm btn-flat ion ion-calculator" type="button">&nbsp;</button>
	                        </span>
                        </div>
					</div><!-- /.box-body -->

					<div class="box-footer">
						<div class="row">
									<div class="col-md-6">
										<div class="description-block border-right">
											<h5 class="description-header costTB"><!-- --></h5>
											<span class="description-text">PER TB</span>
										</div><!-- /.description-block -->
									</div><!-- /.col -->
									<div class="col-md-6">
										<div class="description-block border-right">
											<h5 class="description-header totalStorageCostEstimate"><!-- --></h5>
											<span class="description-text">ESTIMAT</span>
										</div><!-- /.description-block -->
									</div><!-- /.col -->
								</div><!-- /.row -->
					</div>
				</div><!-- /.box -->
			</div><!-- /.col  -->
		</div><!-- /.row -->

		<h2 id="orgDetailsHeader" class="page-header text-muted">Detaljvisning</h2>

		<div class="row">
			<div class="col-md-12">
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-university"> Viser oversikt for <span class="selectedOrg"></span></h3>
						<div class="box-tools pull-right">
							<div class="btn-group">
								<button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="ion ion-university"></i> Velg org <span class="fa fa-caret-down"></span></button>
								<ul id="orgListSuperAdmin" class="dropdown-menu" role="menu">
									<!-- OrgList -->
								</ul>
							</div>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<div class="info-box">
							<span class="info-box-icon bg-aqua"><i class="ion ion-arrow-graph-up-right"></i></span>
							<div class="info-box-content">
								<p>
									Viser siste <code class="selectedOrgRecordedDatesNum"><!----></code> dager med endringer i diskforbruk (i GB) for <code class="selectedOrg"><!----></code>.
								</p>
								<p>
									Bytt org i tittellinja oppe til høyre, eller ved å klikke på pai-grafen.
								</p>
							</div><!-- /.info-box-content -->
						</div>

						<div id="lineChartAlert" class="alert alert-danger" style="display: none;"></div>
						<div class="chart">
							<canvas id="orgUsageLineChartSuperAdmin" style="min-height: 350px; max-height: 350px;">
								<!-- Line Chart -->
							</canvas>
							<span class="text-muted">Klikk for å endre farge, høyreklikk for å lagre som bildefil (png).</span>
						</div>
					</div><!-- /.box-body -->

					<div class="box-footer">
						<div class="row">
							<div class="col-sm-3 col-xs-6">
								<div class="description-block border-right">
									<span class="description-percentage text-olive" data-toggle="tooltip" data-original-title="Prosentandel av alle abonnenter"><i class="ion ion-ios-pie"></i> <span class="orgStoragePercentageGlobal"><!-- --></span>%</span>
									<h5 class="description-header orgTotalStorage"><!-- --></h5>
									<span class="description-text">TOTALT</span>
								</div><!-- /.description-block -->
							</div><!-- /.col -->

							<div class="col-sm-3 col-xs-6">
								<div class="description-block border-right">
									<span class="description-percentage text-aqua"><i class="ion ion-android-people"></i></span>
									<h5 class="description-header orgUserCount"><!-- --></h5>
									<small class="text-muted">ansatt/student</small><br>
									<span class="description-text">BRUKERE</span>

								</div><!-- /.description-block -->
							</div><!-- /.col -->

							<div class="col-sm-3 col-xs-6">
								<div class="description-block border-right">
									<span class="description-percentage text-red"><i class="ion ion-ios-film"></i></span>
									<h5 class="description-header orgPresentationCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></h5>
									<small class="text-muted">ansatt/student</small><br>
									<span class="description-text">OPPTAK</span>

								</div><!-- /.description-block -->
							</div><!-- /.col -->

							<div class="col-sm-3 col-xs-6">
								<div class="description-block border-right">
									<span class="description-percentage text-gray"><i class="ion ion-ios-calendar"></i> Per i dag</span>
									<h5 class="description-header orgInvoiceEstimate"><!-- --></h5>
									<span class="description-text">ESTIMAT</span>
								</div><!-- /.description-block -->
							</div><!-- /.col -->
						</div> <!-- /.row -->
					</div> <!-- /. box-footer -->

					<div class="box-footer">
						<!-- Export buttons -->
						<button type="button" class="btn btn-default icon ion-ios-email email_export" data-toggle="modal" data-export-group="brukere" data-target="#emailExportSuperAdminModal">
					        &nbsp;Epostliste
					    </button>&nbsp;&nbsp;

						<button type="button" class="btn btn-default icon ion-ios-people users_export" data-toggle="modal" data-action="Brukere" data-context="superAdmin" data-target="#dataExportModal">
					        &nbsp;Metadata brukere
					    </button>&nbsp;&nbsp;
<!--
// 21.11.2016: Disabled (dropdown button removed from DOM) after moving to DB-API (won't get anything useful from tblPresentations only, and joined query with tblFile is too expensive).
// Metadata users still kept (above)

						<div class="btn-group">
					        <button type="button" class="btn btn-default dropdown-toggle icon ion-code-working" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					            Data eksport&nbsp;&nbsp;<span class="fa fa-caret-down"></span>
					        </button>
					        <ul class="dropdown-menu">
					            <li>
					                <a data-toggle="modal" data-action="Brukere" data-context="superAdmin" data-target="#dataExportModal"><i class="ion ion-ios-people"></i> Metadata <strong>brukere</strong></a>
					            </li>
					            <li>
					                <a data-toggle="modal" data-action="Opptak" data-context="superAdmin" data-target="#dataExportModal"><i class="ion ion-ios-film"></i> Metadata <strong>opptak</strong></a>
					            </li>
					        </ul>
					    </div>
-->
					</div>
				</div><!-- /.box -->
			</div><!-- /.col -->
		</div><!-- /.row -->

		<h2 class="page-header text-muted">Abonnenter</h2>

	    <div class="row">
		    <div class="col-lg-12">
				<!-- SUBSCRIBERS TABLE -->
				<div id="subscribersTableBox" class="box box-primary">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-home"> Oversikt</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body table-responsive">
						<table id="subscribersTableSuperAdmin" class="table table-bordered table-striped table-hover" style="width: 100%;">
	                        <thead class="text-muted">
	                            <tr>
	                                <th class="text-nowrap"><i class="icon ion-android-home"></i> Org</th>
		                            <th class="text-nowrap"><i class="icon ion-ios-people"></i> Brukere</th>
		                            <th class="text-nowrap"><i class="icon ion-university"></i> Ansatte</th>
		                            <th class="text-nowrap"><i class="icon ion-university"></i> Studenter</th>
		                            <th class="text-nowrap"><i class="icon ion-ios-videocam"></i> Presentasjoner</th>
									<th class="text-nowrap"><i class="icon ion-eye"></i> Hits</th>
	                                <th class="text-nowrap"><i class="icon ion-upload"></i> Lagring (GB)</th>
	                                <th class="text-nowrap"><i class="icon ion-cash"></i> Kostnad</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            <!-- AJAX/DataTables -->
	                        </tbody>
	                        <tfoot class="text-muted">
	                            <tr>
	                                <th class="text-nowrap"><i class="icon ion-android-home"></i> Org</th>
		                            <th class="text-nowrap"><i class="icon ion-ios-people"></i> Brukere</th>
		                            <th class="text-nowrap"><i class="icon ion-university"></i> Ansatte</th>
		                            <th class="text-nowrap"><i class="icon ion-university"></i> Studenter</th>
		                            <th class="text-nowrap"><i class="icon ion-ios-videocam"></i> Presentasjoner</th>
		                            <th class="text-nowrap"><i class="icon ion-eye"></i> Hits</th>
		                            <th class="text-nowrap"><i class="icon ion-upload"></i> Lagring (GB)</th>
		                            <th class="text-nowrap"><i class="icon ion-cash"></i> Kostnad</th>
	                            </tr>
	                        </tfoot>
	                    </table>
					</div><!-- /.box-body -->
					<div class="box-footer">
						<p>
							Viktig: Det meste av informasjon trekkes direkte fra tabeller i Relay sin egen DB. Med tanke på fusjonerte læresteder så er det ikke mulig å
							plukke opp dette automatisk kun basert på info i tabeller. Tabellen vil derfor liste f.eks. UiN som en egen org (selv om de nå er fusjonert til Nord)
							siden historisk presentasjonsinformasjon i Relay DB ikke oppdateres ved endring av brukernavn.
						</p>

						<p>
							Ved fakturering må det tas høyde for dette (eks. slå sammen alle orgs som er fusjonert til f.eks. Nord).
						</p>
					</div>

					<div class="overlay ajax">
						<i class="fa ion-load-d fa-spin"></i>
					</div>
				</div><!-- /.box -->
		    </div> <!-- /.col -->
	    </div><!-- /.row -->


		<!-- EMAIL EXPORT MODAL -->
		<div class="modal fade" id="emailExportSuperAdminModal" tabindex="-1" role="dialog" aria-labelledby="modalExportTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header bg-dark-gray">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;&nbsp;<span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="modalExportTitle">
							Epostliste eksport for <strong id="emailExportTargetGroup"><!--JS--></strong> ved <code class="selectedOrg"><!----></code>
							<span id="emailExportCount" class="badge bg-green pull-right" title="Antall adresser i liste"><!--JS--></span>
						</h4>
					</div>
					<div class="modal-body">
						<p>Kopier og lim inn i epost (<code>To:</code> / <code>Cc:</code> / <code>BCc:</code>):</p>
						<textarea id="emailExportList" style="width: 100%;" rows="10" onclick="$(this).select();"><!--JS--></textarea>
						<div id="emailMissing" class="text-muted"><!--JS--></div>
					</div>
					<div class="modal-footer bg-dark-gray">
						<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
					</div>
				</div>
			</div>
		</div>
<!-- //.modal -->

    </section><!-- /.content -->

<!-- Scripts pertaining only to SuperAdmin -->
<script src="app/js/page_super_admin.min.js" type="text/javascript"></script>