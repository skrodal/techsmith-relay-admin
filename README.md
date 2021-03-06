# RelayAdmin #

_This service is tailor-made for UNINETT AS and uses in-house developed APIs pertaining to a specific use-case. Its re-usability is, as such, limited._  

RelayAdmin er en samling av tjenester med tilgang tilpasset hvem bruker er og hvor hun kommer fra. 

I pakken inngår følgende sider/tjenester:

- Oversikt (for brukere fra alle fra læresteder som abonnerer på Relay)
- SuperAdmin (kun for UNINETT ansatte)
- OrgAdmin <strike>(kun for teknisk kontakt med pri==1 i Kind)</strike>
    - Medlem av Dataporten gruppe `RelayAdmin`
- <strike>Min Relay (for brukere med Relay konto)</strike>
    - Flyttet ut av tjenesten: https://github.com/skrodal/min-relay

![Preview](/app/img/RelayAdmin.png)

## TODO ##

* Dato-selektor for lagringsdata (API tillater mer enn hva UI tilbyr...)

## Avhengigheter ##

I tillegg til UNINETT Dataporten for autentisering benytter RelayAdmin følgende egenutviklede APIer/services:

- <strike>eCampus Kind API (registrert i Dataporten)
    - https://github.com/skrodal/ecampus-kind-api</strike>
- Relay API (registrert i Dataporten)
    - https://github.com/skrodal/techsmith-relay-api
- Relay Hits (service for IIS parsing, uttrekk implementert i Relay API)
    - https://github.com/skrodal/techsmith-relay-iis-logparser
- Relay Delete (service/API selvbetjent sletting, implementert i Relay API)
    - https://github.com/skrodal/techsmith-relay-presentation-delete

Noe av informasjon tilbydt av Relay API er hentet fra datakilder tilgjengeliggjort av "Relay Harvester":
 
 - https://github.com/skrodal/relay-mediasite-harvest


## 3rd parties ##

- UI er en modifisert versjon av "AdminLTE", bruker UNINETTs Bootstrap template
- JSO v2 av Andreas Åkre Solberg (https://github.com/andreassolberg/jso)
- Se dist/plugins for andre 3rt party biblioteker brukt

### Annet ###

Utviklet av Simon Skrødal