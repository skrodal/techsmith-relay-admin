<!-- Main content -->
    <section id="pageOrgAdmin" class="content app_page hidden">
		<div class="jumbotron clearfix bg-dark-gray">
			<div class="container">
				<h1 class="text-nowrap"><i class="icon ion-university text-aqua"></i>  <strong>Org</strong>Admin</h1>
				<p class="lead text-muted">Infoside for <span class="feideOrg"><!-- --></span>.</p>
			</div>

			<div class="pull-right">
				<h2><span class="text-muted userFullName"><!-- --></span></h2>
				<span class="label bg-light-blue icon ion-ios-home feideOrg"><!-- --></span>
				<span class="label bg-light-blue icon ion-university feideAffiliation"><!-- --></span>
				<span class="label bg-light-blue icon ion-ios-star userRole"><!-- --></span>
			</div>
		</div>

		<h2 class="page-header text-muted">Oversikt</h2>

		<div class="row">
			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-aqua"><i class="ion ion-ios-people"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">BRUKERE</span>
						<span class="info-box-number orgUserCount"><!-- --></span>
						<div class="progress bg-aqua"></div>
						<span class="progress-description text-muted">Totalt</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-yellow"><i class="ion ion-ios-film"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">PRESENTASJONER</span>
						<span class="info-box-number orgPresentationCount"><!-- --></span>
						<div class="progress bg-yellow"></div>
						<span class="progress-description text-muted">På disk</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<!-- fix for small devices only -->
			<div class="clearfix visible-sm-block"></div>

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-red"><i class="ion ion-upload"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">LAGRING</span>
						<span class="info-box-number orgDiskUsage"><!-- --></span>
						<div class="progress bg-red"></div>
						<span class="progress-description text-muted mightOverflow">Siden <span class="orgDiskUsageDate"></span></span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->

			<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
				<div class="info-box">
					<span class="info-box-icon bg-green"><i class="fa fa-money"></i></span>
					<div class="info-box-content">
						<span class="info-box-text">KOSTNAD</span>
						<span class="info-box-number description-header orgStorageCostEstimate"><!-- --></span>
						<div class="progress bg-green"></div>
						<span class="progress-description text-muted mightOverflow">Estimat - kun lagring</span>
					</div><!-- /.info-box-content -->
				</div><!-- /.info-box -->
			</div><!-- /.col -->
		</div>

		<h2 class="page-header text-muted">Lagring &amp; Fakturering</h2>

		<div class="row">
			<div class="col-md-8">
				<div class="box box-default">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-arrow-graph-up-right"> Forbruk lagring (i GB)</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<div id="lineChartOrgAlert" class="callout callout-warning" style="display: none;"></div>
						<p>
							Viser siste <code class="orgRecordedDatesNum"></code> <i>datoer</i> med endringer i diskforbruk.
						</p>
						<div class="chart">
							<canvas id="orgUsageLineChartOrgAdmin" style="min-height: 300px;">
								<!-- Line Chart -->
							</canvas>
						</div>
					</div><!-- /.box-body -->
					<div class="box-footer text-muted">
						Klikk for å endre farge, høyreklikk for å lagre som bildefil (png).
					</div>
				</div><!-- /.box -->
			</div>


			<div class="col-md-4">
				<div class="box box-info">
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
							Fakturaestimatet inkluderer ikke tjenesteavgiften.
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
									<h5 class="description-header orgStorageCostEstimate"><!-- --></h5>
									<span class="description-text">ESTIMAT</span>
								</div><!-- /.description-block -->
							</div><!-- /.col -->
						</div><!-- /.row -->
					</div>
				</div><!-- /.box -->
			</div><!-- /.col  -->
		</div>

	    <h2 class="page-header text-muted">Bruk og brukere</h2>

		<div class="row">
			<div class="col-lg-12">
				<div id="usersTableBox" class="box box-primary">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-people"> Brukerkontoer</h3>
						<div class="box-tools pull-right">
							<span data-toggle="tooltip" title="Aktive" class="badge bg-green userCount"><!--updateUserUI--></span>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body table-responsive">
						<p>
							Kontoliste og totaler forbundet med hver konto.
						</p>
	                    <table id="usersTableOrg" class="table table-bordered table-striped table-hover" style="width: 100%;">
	                        <thead>
	                            <tr>
	                                <th><i class="ion ion-android-person text-muted"></i>   Navn</th>
		                            <th><i class="ion ion-university text-muted"></i>       Type</th>
	                                <th><i class="ion ion-ios-film text-muted"></i>         Opptak</th>
	                                <th><i class="ion ion-android-delete text-muted"></i>   Slettet</th>
	                                <th><i class="ion ion-ios-clock text-muted"></i>        Tid</th>
	                                <th><i class="ion ion-android-upload text-muted"></i>   Lagret (MB)</th>
	                                <th><i class="ion ion-stats-bars text-muted"></i>       Hits</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            <!-- AJAX/DataTables -->
	                        </tbody>
	                        <tfoot>
	                            <tr>
	                                <th class="th-name"></th>
		                            <th class="th-type"></th>
		                            <th class="th-presentations"></th>
	                                <th class="th-deleted"></th>
	                                <th class="th-duration"></th>
	                                <th class="th-diskusage"></th>
	                                <th class="th-hits"></th>
	                            </tr>
	                        </tfoot>
	                    </table>

						<span class="text-muted">
							Type (ansatt/student) kan bare identifiseres om en bruker har produsert innhold.
						</span>
					</div>

					<div class="overlay ajax">
						<i class="fa fa-spinner fa-pulse"></i>
					</div>

					<div class="box-footer">
						<button type="button" class="btn btn-default" data-toggle="modal" data-target="#emailExportOrgAdminModal">
		                    <span class="ion ion-ios-email"></span>&nbsp;&nbsp;Epostliste
		                </button>&nbsp;&nbsp;

						<div class="btn-group">
		                    <button type="button" class="btn btn-default dropdown-toggle icon ion-code-working" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		                        Data eksport&nbsp;&nbsp;<span class="fa fa-caret-down"></span>
		                    </button>
		                    <ul class="dropdown-menu">
		                        <li>
		                            <a data-toggle="modal" data-action="Brukere" data-context="orgAdmin" data-target="#dataExportModal"><i class="ion ion-ios-people"></i> Metadata <strong>brukere</strong></a>
		                        </li>
		                        <li>
		                            <a data-toggle="modal" data-action="Opptak" data-context="orgAdmin" data-target="#dataExportModal"><i class="ion ion-ios-film"></i> Metadata <strong>opptak</strong></a>
		                        </li>
		                    </ul>
		                </div>
					</div>
				</div>
			</div>
		</div>

	    <h2 class="page-header text-muted">Tjenesteinfo og tilgang for <span class="feideOrg"></span></h2>

	    <div class="row">
			<div class="col-lg-6">
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-contact"> Tilgang som administrator i RelayAdmin</h3>
						<div class="box-tools pull-right">
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<p>Du kan gjøre andre ansatte ved <span class="feideOrg"><!--></span> til <code>OrgAdmin</code> ved å dele denne lenka:</p>
						<div class="well orgAdminGroupLink"><!-- --></div>

						<p>
							Lenka er en invitasjon til Dataporten-gruppe <em>RelayAdmin</em>. Alle med kjennskap til denne kan
							melde seg inn og få tilgang som <code>OrgAdmin</code> for sitt lærested.
						</p>
					</div>
					<div class="box-footer text-muted">
						Informer mottaker om at URL ikke skal deles med hvemsomhelst.
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="box box-info">
					<div class="box-header with-border">
						<h3 class="box-title icon ion-ios-contact"> Registrerte detaljer</h3>
						<div class="box-tools pull-right">
							<span class="subscriptionStatus"><!-- --></span>
							<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
						</div>
					</div>
					<div class="box-body">
						<dl>
							<dt>Kontaktperson:</dt>
							<dd class="serviceContact"><!--updateOrgAdminUI()--></dd>
							<dt>Supportpunkt</dt>
							<dd class="serviceSupport"><!--updateOrgAdminUI()--></dd>
							<dt>Tjeneste URL:</dt>
							<dd class="serviceUrl"><!--updateOrgAdminUI()--></dd>
						</dl>
					</div>
					<div class="box-footer text-muted">
						<small>
							<i class="icon ion-ios-information"></i> Hentet fra UNINETTs driftsdatabase ('KIND'). <br>
							&Oslash;nsker om endringer av informasjon sendes til <a href="mailto:kontakt@uninett.no">kontakt@uninett.no</a>
						</small>
					</div>
				</div>
			</div>
	    </div>
    </section><!-- /.content -->

 <!-- EMAIL EXPORT MODAL -->
		<div class="modal fade" id="emailExportOrgAdminModal" tabindex="-1" role="dialog" aria-labelledby="modalExportTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header bg-dark-gray">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;&nbsp;<span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="modalExportTitle">
							<i class="ion ion-ios-people"></i>
							Epostliste :: Alle brukere
						</h4>
					</div>
					<div class="modal-body">
						<p>Kopier og lim inn i epost (<code>To:</code> / <code>Cc:</code> / <code>BCc:</code>):</p>
						<textarea id="emailExportList" style="width: 100%;" rows="10" onclick="$(this).select();"><!-- --></textarea>
					</div>
					<div class="modal-footer bg-dark-gray">
						<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
					</div>
				</div>
			</div>
		</div>
  <!-- //.modal -->

<!-- USER DETAILS MODAL -->
		<div class="modal fade" id="userDetailsModal" tabindex="-1" role="dialog" aria-labelledby="userDetailsModalTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header bg-dark-gray">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;&nbsp;<span aria-hidden="true">&times;</span></button>
						<h4 id="userDetailsModalTitle" class="modal-title">
							<i class="ion ion-ios-person"></i> <span id="fullName"><!--JS--></span>
						</h4>
					</div>

					<div class="modal-body">
						<div id="userInfo"><!-- --></div>

						<hr/>
						<p class="text-bold"><span class="ion ion-code-working"></span> Metadata Presentasjoner</p>
						<p>Data er i <a href="https://no.wikipedia.org/wiki/JSON" target="_blank">JSON</a>-format</p>
							<div id="jsonUserPresentations" style="height:250px;"><!-- --></div>
						<a href="http://jsoneditoronline.org/" class="pull-right" style="text-muted" target="_blank">JSON Editor Online</a>

					</div>

					<div class="modal-footer bg-dark-gray">
						<span id="footerText" class="pull-left">
							<!-- -->
						</span>
						<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
					</div>
				</div>
			</div>
		</div>
<!-- //.modal -->



<script src="app/js/page_org_admin.min.js" type="text/javascript"></script>
