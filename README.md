# techsmith-relay-admin

RelayAdmin er en samling av tjenester med tilgang tilpasset hvem bruker er og hvor hun kommer fra. 

I pakken inngår følgende sider/tjenester:

- Oversikt (for brukere fra alle fra læresteder som abonnerer på Relay)
- SuperAdmin (kun for UNINETT ansatte)
- OrgAdmin (kun for teknisk kontakt med pri==1 i Kind)
    - Kan og bør endres slik at flere har tilgang 
- Min Relay (for brukere med Relay konto)

I tillegg til UNINETT Dataporten for autentisering benytter RelayAdmin følgende 3.parts APIer:

- Kind API (registrert i Dataporten)
  - https://github.com/skrodal/ecampus-kind
- Relay API (registrert i Dataporten)

![Preview](/app/img/RelayAdmin.png)


Andre avhengigheter:

- Modifisert utgave av AdminLTE Control Panel Theme (basert på Bootstrap 3)
  - https://github.com/almasaeed2010/AdminLTE
- jQuery 2
- Diverse moduler, eks. Chart.js, DataTables, se /dist/plugins/ for komplett liste.
