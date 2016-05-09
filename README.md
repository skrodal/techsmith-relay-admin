# RelayAdmin #

_This service is tailor-made for UNINETT AS and uses in-house developed APIs pertaining to a specific use-case. Its re-usability is, as such, limited._  

RelayAdmin er en samling av tjenester med tilgang tilpasset hvem bruker er og hvor hun kommer fra. 

I pakken inngår følgende sider/tjenester:

- Oversikt (for brukere fra alle fra læresteder som abonnerer på Relay)
- SuperAdmin (kun for UNINETT ansatte)
- OrgAdmin (kun for teknisk kontakt med pri==1 i Kind)
    - Kan og bør endres slik at flere har tilgang 
- Min Relay (for brukere med Relay konto)

![Preview](/app/img/RelayAdmin.png)

## Avhengigheter ##

I tillegg til UNINETT Dataporten for autentisering benytter RelayAdmin følgende egenutviklede APIer:

- eCampus Kind API (registrert i Dataporten)
    - https://github.com/skrodal/ecampus-kind-api
- Relay API (registrert i Dataporten)
    - https://github.com/skrodal/techsmith-relay-api

Mesteparten av Relay-informasjon leses fra datakilder generert at "Relay Harvester":
 
 - https://github.com/skrodal/relay-mediasite-harvest


## 3rd parties ##

- UI er en modifisert versjon av "AdminLTE", bruker UNINETTs Bootstrap template
- JSO v2 av Andreas Åkre Solberg (https://github.com/andreassolberg/jso)
- Se dist/plugins for andre 3rt party biblioteker brukt

### Annet ###

Utviklet av Simon Skrødal