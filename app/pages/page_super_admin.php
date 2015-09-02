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
						<span class="progress-description text-muted">Fullverdige</span>
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
						<span class="info-box-text">BRUKERE</span>
						<span class="info-box-number"> <span class="globalUsersCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span> <small>(<span class="globalEmployeeCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>/<span class="globalStudentCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></span>)</small> </span>
						<div class="progress bg-green"></div>
						<span class="progress-description text-muted">Totalt <small>(Ansatte/Studenter)</small></span>
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
						<span class="progress-description text-muted">Estimat</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->
		</div>

		<h2 class="page-header text-muted">Abonnenter og kontaktpunkt</h2>

	    <div class="row">
		    <div class="col-lg-12">
				<!-- SUBSCRIBERS TABLE -->
				<div id="subscribersTableBox" class="box box-primary collapsed-box">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-home"> Abonnenter</h3>
						<div class="box-tools pull-right">
							<span data-toggle="tooltip" title="Totalt" class="badge bg-blue subscribersTotalCount"><!--updateUserUI--></span>
							<span data-toggle="tooltip" title="Aktive" class="badge bg-green subscribersCount"><!--updateUserUI--></span>
							<span data-toggle="tooltip" title="Utpr&oslash;ving" class="badge bg-orange subscribersTrialCount"><!--updateUserUI--></span>
							<span data-toggle="tooltip" title="Andre" class="badge bg-red subscribersOtherCount"><!--updateUserUI--></span>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
						</div>
					</div>
					<div class="box-body table-responsive">
						<table id="subscribersTableSuperAdmin" class="table table-bordered table-striped table-hover" style="width: 100%; font-size: 13px;">
	                        <thead class="text-muted">
	                            <tr>
	                                <th class="text-nowrap"><i class="icon ion-android-home"></i> Org</th>
	                                <th class="text-nowrap"><i class="icon ion-android-person"></i> Kontakt</th>
	                                <th class="text-nowrap"><i class="icon ion-help-buoy"></i> Support</th>
		                            <th class="text-nowrap"><i class="icon ion-ios-people"></i> Brukere</th>
	                                <th class="text-nowrap"><i class="icon ion-upload"></i> Lagring (GB)</th>
	                                <th class="text-nowrap"><i class="icon ion-cash"></i> Kostnad</th>
		                            <th class="text-nowrap"><i class="icon ion-key"></i> Status</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            <!-- AJAX/DataTables -->
	                        </tbody>
	                        <tfoot class="text-muted">
	                            <tr>
	                                <th class="text-nowrap"><i class="icon ion-android-home"></i> Org</th>
	                                <th class="text-nowrap"><i class="icon ion-android-person"></i> Kontakt</th>
	                                <th class="text-nowrap"><i class="icon ion-help-buoy"></i> Support</th>
		                            <th class="text-nowrap"><i class="icon ion-ios-people"></i> Brukere</th>
		                            <th class="text-nowrap"><i class="icon ion-upload"></i> Lagring (GB)</th>
		                            <th class="text-nowrap"><i class="icon ion-cash"></i> Kostnad</th>
		                            <th class="text-nowrap"><i class="icon ion-key"></i> Status</th>
	                            </tr>
	                        </tfoot>
	                    </table>
					</div><!-- /.box-body -->
					<div class="box-footer">
						<div class="input-group-btn">
							<button type="button" class="btn btn-default dropdown-toggle icon ion-ios-email" data-toggle="dropdown"> Epostlister&nbsp;&nbsp;<span class="fa fa-caret-down"></span></button>
							<ul class="dropdown-menu">
								<li><a href="#" class="email_export icon ion-android-people" data-export-group="kontaktpersoner" data-toggle="modal" data-target="#emailExportSuperAdminModal"> Kontakter</a></li>
								<li class="divider"></li>
								<li><a href="#" class="email_export icon ion-help-buoy" data-export-group="supportpunkt" data-toggle="modal" data-target="#emailExportSuperAdminModal"> Supportpunkt</a></li>
							</ul>
						</div>
					</div>

					<!-- EMAIL EXPORT MODAL -->
					<div class="modal fade" id="emailExportSuperAdminModal" tabindex="-1" role="dialog" aria-labelledby="modalExportTitle" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header bg-dark-gray">
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;&nbsp;<span aria-hidden="true">&times;</span></button>
									<h4 class="modal-title" id="modalExportTitle">
										Epostliste eksport for <strong id="emailExportTargetGroup"><!--JS--></strong>
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

					<div class="overlay ajax">
						<i class="fa ion-load-d fa-spin"></i>
					</div>
				</div><!-- /.box -->
		    </div> <!-- /.col -->
	    </div><!-- /.row -->

	    <h2 class="page-header text-muted">Lagring &amp; Fakturering</h2>

		<div class="row">
			<div class="col-md-6">
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
						Klikk p&aring; graf for &aring; oppdatere detaljvisning nedenfor.
					</div>
				</div><!-- /.box -->
			</div><!-- /.col -->

			<div class="col-md-6">
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
											<span class="description-text">PRIS PER TB</span>
										</div><!-- /.description-block -->
									</div><!-- /.col -->
									<div class="col-md-6">
										<div class="description-block border-right">
											<h5 class="description-header totalStorageCostEstimate"><!-- --></h5>
											<span class="description-text">FAKTURAESTIMAT</span>
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
						<h3 class="box-title icon ion-arrow-graph-up-right"> Viser oversikt for <span class="selectedOrg"></span></h3>
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
						<div class="row">
							<div class="col-md-8">
								<div id="lineChartAlert" class="callout callout-warning" style="display: none;"></div>
								<div class="chart">
									<canvas id="orgUsageLineChartSuperAdmin" style="min-height: 350px; max-height: 350px;">
										<!-- Line Chart -->
									</canvas>
								</div>
							</div>

							<div class="col-md-4">
								<h3>
									<i class="icon ion-university"></i> <span class="selectedOrg"></span>: <small class="pull-right"><span class="orgSubscriptionStatus"></span></small>
								</h3>
								<div class="box">
									<div class="box-body">
										<div class="row">
											<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<div class="description-block border-right">
													<span class="description-percentage text-olive" data-toggle="tooltip" data-original-title="Prosentandel av alle abonnenter"><i class="ion ion-ios-pie"></i> <span class="orgStoragePercentageGlobal"><!-- --></span>%</span>
													<h5 class="description-header orgTotalStorage"><!-- --></h5>
													<span class="description-text">LAGRING</span>
												</div><!-- /.description-block -->
											</div><!-- /.col -->
											<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<div class="description-block border-right">
													<span class="description-percentage text-aqua"><i class="ion ion-android-people"></i></span>
													<h5 class="description-header orgUserCount"><!-- --></h5>
													<span class="description-text">BRUKERE</span>
												</div><!-- /.description-block -->
											</div><!-- /.col -->
											<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<div class="description-block border-right">
													<span class="description-percentage text-red"><i class="ion ion-ios-film"></i></span>
													<h5 class="description-header orgPresentationCount"><!-- --><i class="fa fa-spinner fa-pulse"></i></h5>
													<span class="description-text">OPPTAK</span>
												</div><!-- /.description-block -->
											</div><!-- /.col -->
											<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<div class="description-block">
													<span class="description-percentage text-gray"><i class="ion ion-ios-calendar"></i> Per i dag</span>
													<h5 class="description-header orgInvoiceEstimate"><!-- --></h5>
													<span class="description-text">ESTIMAT</span>
												</div><!-- /.description-block -->
											</div>
										</div><!-- /.row -->
									</div>

									<div class="box-footer">
										Grafen viser siste <code class="selectedOrgRecordedDatesNum"></code> dager med endringer i diskforbruk (<strong>i MB!</strong>) for <code class="selectedOrg"></code>.
									</div>
								</div>
							</div>
						</div>
					</div><!-- /.box-body -->

					<div class="box-footer text-muted">
						Klikk p&aring; grafen for annen farge | H&oslash;yreklikk for &aring; lagre bildefil.
					</div>
				</div><!-- /.box -->
			</div><!-- /.col -->
		</div><!-- /.row -->
    </section><!-- /.content -->

<!-- Scripts pertaining only to SuperAdmin -->
<script src="app/js/page_super_admin.js" type="text/javascript"></script>