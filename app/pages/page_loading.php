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
				<h4><i class="icon fa fa-ban"></i> Beklager! P&aring;loggingsprosessen har dessverre feilet ;-(</h4>
				<p class="text-bold">Rapporterte &aring;rsak ser du under.</p>
				<p>Dersom du mener dette er feil kan du kan fors&oslash;ke &aring; laste siden p&aring; nytt.</p>
				<p>Om problemet vedvarer kan du si ifra om feilen til <a href="mailto:support@ecampus.no">support@ecampus.no</a></p>
			</div>

			<div id="authInfo" class="alert bg-light-blue hidden">
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
<script src="app/js/etc/utils.js"></script>
<script src="dist/plugins/bootstrap-notify/bootstrap-notify.min.js"></script>
<!-- JSO -->
<script src="app/js/auth/jso.js"></script>
<script src="app/js/auth/dataporten_auth.js"></script>


<script src="app/js/api_consumers/dataporten.js"></script>
<script src="app/js/api_consumers/kind.js"></script>

<script src="app/js/api_consumers/relay.js"></script>
<script src="app/js/api_consumers/relay_org.js"></script>
<script src="app/js/api_consumers/relay_user.js"></script>

