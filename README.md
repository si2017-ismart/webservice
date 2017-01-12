# webservice
## Liste des URI
### Beacons
#### GET
Liste de tous les beacons
>'url':3000/api/beacons

Vérifie l'existance d'un beacon et renvoie l'établissement qui le possède
>'url':3000/api/beacons/existId/:id_beacon

Liste de tous les beacons d'un etablissement
>'url':3000/api/beacons/getByEtablissement/:id

Demande un jeton d'aide pour le client ()
>'url':3000/api/beacons/needHelp/:profil/:name/:sex/:id_beacon

#### POST

Liste de tous les beacons
>'url':3000/api/beacons/add
> id_etablissement	: id de l'etablissement
> id				: id du beacon
> nom				: nom du beacon
> xPosition			: position X locale du beacon
> yPosition			: position Y locale du beacon
> portee			: portée théorique du beacon


# Docker
You will be able to run the webservice with mongodb
## Install docker
https://docs.docker.com/engine/installation/
## Build the project
docker-compose build
## Up the containers
docker-compose up
