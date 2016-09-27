<section id="pageMyRelay" class="content app_page hidden">
	<div class="jumbotron clearfix bg-dark-gray">
		<div class="container">
			<h1><i class="ion ion-record text-red"></i> <strong>Min</strong>Relay</h1>
			<p class="lead text-muted">Administrer dine TechSmith Relay presentasjoner</p>
		</div>

		<div class="pull-right">
			<h2><span class="text-muted userFullName"><!-- --></span></h2>
			<span class="label bg-light-blue icon ion-ios-home feideOrg"><!-- --></span>
			<span class="label bg-light-blue icon ion-university feideAffiliation"><!-- --></span>
			<span class="label bg-light-blue icon ion-ios-star userRole"><!-- --></span>
		</div>
	</div>

	<h2 class="page-header text-muted">Nøkkeltall for ditt innhold</h2>

	<div id="quickStats" class="row">
		<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
			<div class="info-box">
				<span class="info-box-icon bg-red"><i class="ion ion-ios-film"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">PRESENTASJONER</span>
					<span class="info-box-number myRelayPresentationCount"><!-- --></span>
					<div class="progress bg-red"></div>
					<span class="progress-description text-muted myRelayPresentationDeletedCount"><!-- --></span>
				</div><!-- /.info-box-content -->
			</div><!-- /.info-box -->
		</div><!-- /.col -->

		<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
			<div class="info-box">
				<span class="info-box-icon bg-aqua"><i class="ion ion-ios-clock"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">VARIGHET</span>
					<span class="info-box-number myRelayDurationTotal"><!-- --></span>
					<div class="progress bg-aqua"></div>
					<span class="progress-description text-muted">Slettet ikke medr.</span>
				</div><!-- /.info-box-content -->
			</div><!-- /.info-box -->
		</div><!-- /.col -->

		      <!-- fix for small devices only -->
		<div class="clearfix visible-sm-block"></div>

		<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
			<div class="info-box">
				<span class="info-box-icon bg-yellow"><i class="ion ion-ios-pie"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">LAGRING</span>
					<span class="info-box-number myRelayDiskUsage"><!-- --></span>
					<div class="progress bg-olive"></div>
					<span class="progress-description text-muted">Akkurat nå</span>
				</div><!-- /.info-box-content -->
			</div><!-- /.info-box -->
		</div><!-- /.col -->

		<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
			<div class="info-box">
				<span class="info-box-icon bg-olive"><i class="ion ion-stats-bars"></i></span>
				<div class="info-box-content">
					<span class="info-box-text">HITS</span>
					<span class="info-box-number myRelayHitCount"><!-- --></span>
					<div class="progress bg-olive"></div>
					<span class="progress-description text-muted">Unike visninger</span>
				</div>
			</div>
		</div>
	</div>

	<h2 class="page-header text-muted">Informasjon</h2>

	<div class="row">
		<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
			<div class="box box-solid">
				<div class="box-header with-border">
					<h3 class="box-title">Din konto</h3>
				</div>

				<div class="box-body">
					<p>Brukernavn: <code class="relayUserName"></code></p>
					<p>E-post: <code class="relayUserEmail"></code></p>
					<p>
						Nettsted for tjenesten er <a class="text-light-blue relayServiceURL" target="_blank"><span class="relayServiceURL"><!--></span> </a>.
						Her kan du endre passord, laste ned programvare, se status på dine publiseringer m.m.
					</p>

					<p>
						Brukerveiledninger og mer hjelp med tjenesten finner du på <a class="text-light-blue relaySupportURL" target="_blank">UNINETT sine hjelpesider</a>.
					</p>
				</div>
			</div>
		</div>

		<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
			<div class="box box-solid">
				<div class="box-header with-border">
					<h3 class="box-title">Til info...</h3>
				</div>

				<div class="box-body">
					<ul>
						<li>
							Det kan ta minst en time før ferdige presentasjoner dukker opp i oversikten.
							<ul>
								<li>Sjekk kømonitoren  <a href="#" onclick="$('#menuDashboard').trigger('click');">i Dashboard</a> for live status</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<h2 class="page-header text-muted">Innhold</h2>

	<div id="myRelayContent" class="row">
		<div class="col-lg-12">
			<div class="box box-info">
				<div class="box-header">
					<h3 class="box-title">Dine opptak</h3>
					<div class="box-tools pull-right">
						<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
					</div>
				</div>

				<div class="box-body table-responsive">
					<p>I tabellen finner du alt innhold du har produsert med din TechSmith Relay konto.</p>
					<ul>
						<li>Klikk på tittel for mer informasjon.</li>
						<li>Har du mange presentasjoner - bruk søkefunksjon til høyre, den er veldig bra!</li>
					</ul>

                    <table id="myRelayContentTable" class="table table-bordered table-striped table-hover" style="width: 100%;">
                        <thead>
                            <tr>
                                <th class="hidden"> Dato (for sortering, skjult)</th>
                                <th><i class="ion ion-ios-film text-muted"></i> Tittel</th>
                                <th><i class="ion ion-document-text text-muted"></i> Beskrivelse</th>
	                            <th><i class="ion ion-ios-calendar text-muted"></i> Dato</th>
                                <th><i class="ion ion-ios-clock text-muted"></i> Varighet</th>
                                <!-- <th><i class="ion ion-stats-bars text-muted"></i> Hits</th> -->
                            </tr>
                        </thead>
                        <tbody>
                            <!-- DataTable -->
                        </tbody>
                        <tfoot>
                            <tr>
	                            <th class="hidden"> Dato (for sortering, skjult)</th>
                                <th><i class="ion ion-ios-film text-muted"></i> Tittel</th>
                                <th><i class="ion ion-document-text text-muted"></i> Beskrivelse</th>
	                            <th><i class="ion ion-ios-calendar text-muted"></i> Dato</th>
                                <th><i class="ion ion-ios-clock text-muted"></i> Varighet</th>
	                            <!-- <th><i class="ion ion-stats-bars text-muted"></i> Hits</th> -->
							</tr>
						</tfoot>
					</table>
				</div>

				<div class="overlay ajax">
					<i class="fa fa-spinner fa-pulse"></i>
				</div>

				<div class="box-footer">
					<span class="text-muted">
						Evt. slettet innhold er vist i tabellen nedenfor.
						<!-- Antall hits er et estimat basert p&aring; <em>unike</em> visninger av dine videoer. -->
					</span>
				</div>
			</div>
		</div>
	</div>


<div id="myRelayDeletedContent" class="row">
		<div class="col-lg-12">
			<div class="box box-warning collapsed-box">
				<div class="box-header">
					<h3 class="box-title">Slettede opptak</h3>
					<div class="box-tools pull-right">
						<button class="icon ion-android-refresh no-padding btn btn-sm btn-link btnUpdateContentTables"> oppdater</button>
						<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i></button>
					</div>
				</div>

				<div class="box-body table-responsive">
					<p>
						Slettet innhold er utilgjengelig på nett, men kan gjenopprettes ved å klikke "angre". Etter 14 dager slettes innholdet <em>permanent</em>.
					</p>

					<p class="text-muted">
						PS! Det tar inntil 5 minutter før nylig slettet innhold blir gjort utilgjengelig.
					</p>
                    <table id="myRelayDeletedContentTable" class="table table-bordered table-striped table-hover" style="width: 100%;">
                        <thead>
                            <tr>
                                <th class="hidden"> Dato (for sortering, skjult)</th>
                                <th><i class="ion ion-ios-film text-muted"></i> Tittel</th>
	                            <th><i class="ion ion-ios-calendar text-muted"></i> Dato</th>
                                <th><i class="ion ion-ios-clock text-muted"></i> Varighet</th>
	                            <th><i class="ion ion-document-text text-muted"></i> Status</th>
	                            <th><i class="ion ion-compose text-muted"></i> Handling</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- DataTable -->
                        </tbody>
                        <tfoot>
                            <tr>
	                            <th class="hidden"> Dato (for sortering, skjult)</th>
                                <th><i class="ion ion-ios-film text-muted"></i> Tittel</th>
	                            <th><i class="ion ion-ios-calendar text-muted"></i> Dato</th>
                                <th><i class="ion ion-ios-clock text-muted"></i> Varighet</th>
                                <th><i class="ion ion-document-text text-muted"></i> Status</th>
	                            <th><i class="ion ion-compose text-muted"></i> Handling</th>
							</tr>
						</tfoot>
					</table>
				</div>

				<div class="overlay ajax">
					<i class="fa fa-spinner fa-pulse"></i>
				</div>

				<div class="box-footer">
					<span class="text-muted">
						<button class="btn bg-aqua btnUpdateContentTables" type="button">
							<i class="ion ion-android-refresh"></i> Oppdater tabell
						</button>
					</span>
				</div>
			</div>
		</div>
	</div>
</section>


<!-- TEMPLATES -->


	<!-- Presentation Modal -->
	<div class="modal fade" id="myRelayPresentationModal" tabindex="-1" role="dialog" aria-labelledby="presentation_title" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content bg-black-gradient">
				<!-- HEADER -->
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title"><i class="ion ion-ios-film"></i> <span id="presentation_title"></span> </h4>
				</div>

				<!-- BODY -->
				<div class="modal-body">
					<p id="presentation_description" style="font-style: italic;"><!-- AJAX --></p>
					<p id="presentation_author" class="pull-right text-muted right"><!-- AJAX --></p>

					<div align="center" class="">
					    <video id="presentation_preview" controls class="embed-responsive-item" width="100%">
						    <!-- AJAX -->
					    </video>
					</div>

					<p id="presentation_duration"><!-- AJAX --></p>

					<!-- FILES TABLE -->
					<div class="box box-solid bg-dark-gray">
	                    <div class="box-header">
		                    <span id="presentation_hits" class="badge bg-green pull-right"><!-- AJAX --></span>&nbsp;
	                        <h3 class="box-title">Filer</h3>
	                    </div>
	                    <div class="box-body">
	                        <table id="presentation-files-table" class="table table-condensed">
	                            <thead>
	                                <th>Type</th>
	                                <th>Lenke</th>
	                                <th>Del</th>
	                                <th>Størrelse</th>
	                            </thead>
	                            <tbody>
	                                <!-- AJAX -->
	                            </tbody>
	                        </table>
	                    </div>
					</div>
				</div>

				<div class="modal-footer">
					<button id="presentation_delete" type="button" class="btn bg-red pull-left">
						<i class="ion ion-android-delete"></i> SLETT OPPTAK
					</button>

					<button type="button" class="btn btn-default" data-dismiss="modal">
						Lukk
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- EMBED modal -->

	<div id="myRelayEmbedModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content bg-lighter-gray">
				<!-- HEADER -->
				<div class="modal-header bg-dark-gray">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title"><i class="ion ion-code-working"></i> Bygg inn (embed) opptak p&aring; web</h4>
				</div>

				<!-- BODY -->
				<div class="modal-body">
					<p>Her er en embedkode du kan bruke for &aring; bygge inn opptaket p&aring; en nettside</p>

					<textarea id="embedcode" name="embedcode" data-url="" style="width: 100%;" rows="5" onclick="this.select();" style="display: block;"></textarea>

					<p class="text-muted">Merk: produsert HTML-kode krever en oppdatert nettleser som st&oslash;tter HTML5 video, eks. Chrome, Firefox, Internet Explorer, Opera, Safari m.fl.</p>
				</div>

				<div class="modal-footer bg-dark-gray">
					<button type="button" class="btn btn-default" data-dismiss="modal">
						Lukk
					</button>
				</div>
			</div>
		</div>
	</div>


<script src="app/js/page_my_relay.min.js" type="text/javascript"></script>