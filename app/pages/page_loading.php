<section id="pageLoading" class="content app_page">
	<div class="row">
		<div class="col-lg-12">
			<div class="callout bg-aqua">
			    <h4>Autentiserer</h4>
			    <p>Vennligst vent...</p>

				<div class="progress">
			        <div id="authProgressBar" class="progress-bar progress-bar-light-blue" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><!-- updateProgress --></div>
			    </div>
				<!-- -->
				<p>Går ting tregt, eller har stoppet helt opp? <button class="btn btn-link" onclick="DP_AUTH.wipeTokens(); location.reload();">Klikk her og prøv på nytt.</button></p>
			</div>

			<div id="authError" class="alert alert-danger hidden">
				<h4><i class="icon fa fa-ban"></i> Beklager!</h4>
				<p><strong>Pålogging feilet fordi:</strong></p>

				<div id="authErrorMsg"><!-- --></div>

				<p>
					Dersom du mener dette dreier seg om en feil i tjenesten kan du forsøke å laste siden på nytt eller rapportere feilen til
					<span class="supportEmail"><!--></span>
				</p>
			</div>

			<div id="authInfo" class="alert hidden text-muted">
				<h4><i class="ion ion-checkmark"></i> Info: </h4>
			</div>

			<div class="panel">
				<div class="panel-body text-red">
				    Tjenesten bruker <a href="http://www.dataporten.no" target="_blank"><i class="ion ion-star"></i> Dataporten <i class="ion ion-star"></i></a> fra UNINETT for autentisering og dataflyt.
				</div>
			</div>
		</div>
	</div>
</section>

<!-- -->
<script src="app/js/etc/utils.min.js"></script>
<script src="dist/plugins/bootstrap-notify/bootstrap-notify.min.js"></script>
<!-- JSO -->
<script src="app/js/auth/jso.min.js"></script>
<script src="app/js/auth/dataporten_auth.js"></script>

<script src="app/js/api_consumers/dataporten.min.js"></script>
<script src="app/js/api_consumers/kind.min.js"></script>

<script src="app/js/api_consumers/relay.min.js"></script>
<script src="app/js/api_consumers/relay_org.min.js"></script>
<script src="app/js/api_consumers/relay_user.min.js"></script>

