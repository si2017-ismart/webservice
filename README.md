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
```
'url':3000/api/beacons/add

 id_etablissement	: id de l'etablissement
 id					: id du beacon
 nom				: nom du beacon
 xPosition			: position X locale du beacon
 yPosition			: position Y locale du beacon
 portee				: portée théorique du beacon
 ```

### Etablissement
#### GET
Informations d'un etablissement avec son ID
>'url':3000/api/etablissements/getById/:id

Informations d'un etablissement avec son nom
>'url':3000/api/etablissements/getById/:nom

Récupération des intervenants d'un etablissement avec son ID
>'url':3000/api/etablissements/intervenants/getByEtablissement/:id

Informations d'un intervenant avec son ID
>'url':3000/api/etablissements/intervenants/getById/:id

Vérifie l'existence d'une session
>'url':3000/api/etablissements/sessions/checkToken/:token

Informations d'une session
>'url':3000/api/etablissements/sessions/getByToken/:token

#### POST

Mise à jour du beacon de la session, renvoie true en cas de succès
```
>'url':3000/api/etablissements/sessions/setBeacon

id_beacon 	: ID du nouveau beacon
token 		: Token de la session
```

Création d'un nouvel établissement, retourne l'id du nouvel établissement
```
>'url':3000/api/etablissements/add

nom 		: Nom de l'établissement / Utilisé pour la connexion des intervenants
mail 		: Mail de contact de l'établissement
adresse 	: Adresse de l'établissement 
ville		: Ville de l'établissement 
pays		: Pays de l'établissement
zip			: Zip de l'établissement
tel			: Tel de l'établissement
```

Connexion d'un intervenant, renvoie un booléen
```
>'url':3000/api/etablissements/intervenants/login

nom_etablissement 	: Nom de l'etablissement pour la connexion
identifiant 		: Identifiant de l'intervenant
password 			: Mot de passe de l'intervenant
```

Connexion de l'administrateur d'un etablissement
```
>'url':3000/api/etablissements/loginAdmin

identifiant 	: Identifiant de l'administrateur
password 		: mot de passe de l'administrateur
```




# Docker
You will be able to run the webservice with mongodb
## Install docker
https://docs.docker.com/engine/installation/
## Build the project
docker-compose build
## Up the containers
docker-compose up
