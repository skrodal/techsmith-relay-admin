<!-- ERROR MODAL -->
<div id="modalErrorAlert" class="modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header bg-yellow-active">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>
				<h4 id="title" class="modal-title"></h4>
			</div>

			<div id="message" class="modal-body"><!-- --></div>

			<div class="modal-footer bg-yellow-active">
				<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!-- INFO MODAL -->
<div id="modalInfoAlert" class="modal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header bg-blue">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">x</span></button>
				<h4 id="title" class="modal-title"></h4>
			</div>

			<div id="message" class="modal-body"><!-- --></div>

			<div class="modal-footer bg-blue">
				<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!-- DATA EXPORT MODAL (users/presentations as JSON): Shared across pages-->
<div id="dataExportModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<!-- HEADER -->
			<div class="modal-header bg-dark-gray">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title"><!-- --></h4>
			</div>
			<!-- BODY -->
			<div class="modal-body">
				<p>Data er i <a href="https://no.wikipedia.org/wiki/JSON" target="_blank">JSON</a>-format</p>
				<!-- EDITOR -->
				<div id="jsonDataExport" style="height:250px;"><!-- --></div>
				<!-- Link to source -->
				<a href="http://jsoneditoronline.org/" class="pull-right" style="text-muted" target="_blank">JSON Editor Online</a>
				<br/>
				<!-- Only used for user export -->
				<div id="legend_users" style="margin-top: 10px; display: none;">
					<div class="callout bg-light-blue">
						<h4>Om feltet 'status'</h4>
						<p>En bruker kan ha status som følger:</p>
						<table class="table table-bordered table-condensed">
	                        <tbody>
	                            <tr>
	                                <th>Status</th>
	                                <th>Betydning</th>
	                            </tr>
	                            <tr>
	                                <td>-1</td>
	                                <td>Status mangler - default når bruker er nyimportert.</td>
	                            </tr>

	                            <tr>
	                                <td>1</td>
	                                <td>Har konto, men mangler innhold.</td>
	                            </tr>
	                            <tr>
	                                <td>2</td>
	                                <td>Har konto og innhold. Type ansatt/student kan nå identifiseres.</td>
	                            </tr>
	                            <tr>
	                                <td>3</td>
	                                <td>Konto er slettet, men innhold på disk finnes fortsatt.</td>
	                            </tr>
	                            <tr>
	                                <td>4</td>
	                                <td>Konto er slettet og mangler innhold (bruker vil snart forsvinne fra systemet).</td>
	                            </tr>
	                        </tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="modal-footer bg-dark-gray">
				<button type="button" class="btn btn-default" data-dismiss="modal">Lukk</button>
			</div>
		</div>
	</div>
</div>
<!-- //.modal -->