# -*- coding: utf-8 -*-
NEW_NODES = [
dict(id="redis", nom="Redis", annee=2009, categorie="Backend", importance=3,
 courte="Un stockage clé-valeur en mémoire, extrêmement rapide, devenu l'un des piliers de l'infrastructure web moderne.",
 longue="Créé par Salvatore Sanfilippo (antirez) et publié en 2009. Redis stocke les données en mémoire vive pour offrir des temps de réponse de l'ordre de la microseconde, tout en proposant une persistance optionnelle sur disque. Utilisé aussi bien comme cache, comme courtier de messages (pub/sub) que comme backend de files de tâches (Celery, BullMQ, Sidekiq).",
 sources=["https://redis.io/","https://en.wikipedia.org/wiki/Redis"],
 relations=["CONCURRENCE:dragonfly"]),

dict(id="postgresql", nom="PostgreSQL", annee=1996, categorie="Backend", importance=3,
 courte="Un système de gestion de base de données relationnelle open source réputé pour sa rigueur et son extensibilité.",
 longue="Issu du projet de recherche POSTGRES lancé par Michael Stonebraker à Berkeley en 1986, le projet est renommé PostgreSQL en 1996 après l'ajout d'un support SQL complet (via le fork Postgres95 de 1994). Reconnu pour sa conformité stricte au standard SQL et son système d'extensions (dont Citus ou PostGIS). Sert de fondation à de nombreux services managés modernes comme Supabase.",
 sources=["https://www.postgresql.org/docs/current/history.html","https://en.wikipedia.org/wiki/PostgreSQL"],
 relations=["DEPENDS_ON:sql"]),

dict(id="mongodb", nom="MongoDB", annee=2009, categorie="Backend", importance=3,
 courte="La base de données NoSQL orientée documents la plus utilisée, stockant les données au format proche de JSON.",
 longue="Créée par Dwight Merriman, Eliot Horowitz et Kevin Ryan au sein de la société 10gen, et publiée en 2009. MongoDB stocke les documents en BSON (JSON binaire) sans schéma rigide imposé, facilitant l'évolution rapide des modèles de données. Devenue la base NoSQL de référence pour les applications web, notamment via la stack MEAN/MERN.",
 sources=["https://www.mongodb.com/company","https://en.wikipedia.org/wiki/MongoDB"],
 relations=["CONCURRENCE:arangodb"]),

dict(id="rabbitmq", nom="RabbitMQ", annee=2007, categorie="Backend", importance=2,
 courte="Un courtier de messages open source qui implémente le protocole standard AMQP.",
 longue="Développé par Rabbit Technologies, coentreprise de LShift et CohesiveFT fondée en 2007, avant d'être racheté par SpringSource/VMware en 2010. Écrit en Erlang pour sa tolérance aux pannes, RabbitMQ reste l'un des courtiers de messages open source les plus déployés en entreprise. Concurrence directement Kafka et ActiveMQ, avec un positionnement plus proche de la messagerie classique que du streaming massif.",
 sources=["https://www.rabbitmq.com/","https://en.wikipedia.org/wiki/RabbitMQ"],
 relations=["CONCURRENCE:apache_kafka","CONCURRENCE:activemq","DEPENDS_ON:erlang"]),

dict(id="grpc", nom="gRPC", annee=2015, categorie="Backend", importance=2,
 courte="Un framework d'appel de procédure à distance (RPC) haute performance créé par Google, basé sur HTTP/2.",
 longue="Publié en open source par Google en 2015, comme évolution publique de son système RPC interne Stubby. gRPC utilise Protocol Buffers pour sérialiser les messages et HTTP/2 pour le transport, permettant du streaming bidirectionnel. Largement adopté pour la communication interne entre microservices, où sa performance dépasse celle de REST/JSON classique.",
 sources=["https://grpc.io/","https://en.wikipedia.org/wiki/GRPC"],
 relations=["DEPENDS_ON:protocol_buffers","CONCURRENCE:rest"]),

dict(id="protocol_buffers", nom="Protocol Buffers", annee=2008, categorie="Backend", importance=2,
 courte="Un format de sérialisation binaire, compact et typé, créé par Google pour remplacer XML en interne.",
 longue="Utilisé en interne chez Google depuis 2001, Protocol Buffers (protobuf) est publié en open source en 2008. Chaque message est défini dans un fichier .proto qui génère du code pour de nombreux langages, garantissant une sérialisation compacte et rétrocompatible. Sert de format de sérialisation par défaut à gRPC.",
 sources=["https://protobuf.dev/","https://en.wikipedia.org/wiki/Protocol_Buffers"],
 relations=["CONCURRENCE:json"]),

dict(id="openapi", nom="OpenAPI", annee=2011, categorie="Backend", importance=2,
 courte="Le standard de spécification pour décrire des API REST de façon lisible par des machines, né sous le nom de Swagger.",
 longue="Créé en 2011 par Tony Tam chez Wordnik sous le nom de Swagger, pour documenter automatiquement les API REST. Racheté par SmartBear en 2015 puis donné à la Linux Foundation, le projet est renommé OpenAPI en 2016 sous la gouvernance de l'OpenAPI Initiative. Permet de générer automatiquement documentation, clients et serveurs à partir d'un même fichier de spécification.",
 sources=["https://www.openapis.org/","https://en.wikipedia.org/wiki/OpenAPI_Specification"],
 relations=["STANDARDISATION:rest"]),

dict(id="laravel", nom="Laravel", annee=2011, categorie="Backend", importance=3,
 courte="Le framework PHP le plus populaire de la décennie 2010, reconnu pour son ergonomie et son riche écosystème.",
 longue="Créé par Taylor Otwell et publié en 2011, en réaction à la complexité perçue de CodeIgniter. Laravel introduit un ORM expressif (Eloquent), un moteur de templates (Blade) et une injection de dépendances moderne, tout en gardant une courbe d'apprentissage douce. Devenu le framework PHP de référence, il a largement contribué à moderniser l'image du langage.",
 sources=["https://laravel.com/","https://en.wikipedia.org/wiki/Laravel"],
 relations=["DEPENDS_ON:php5","CONCURRENCE:symfony","CONCURRENCE:cakephp","CONCURRENCE:codeigniter"]),

dict(id="rails", nom="Ruby on Rails", annee=2004, categorie="Backend", importance=3,
 courte="Le framework qui a popularisé les conventions 'convention over configuration' et le développement web rapide.",
 longue="Extrait par David Heinemeier Hansson du code de Basecamp (alors 37signals) et publié en 2004. Rails a popularisé l'architecture MVC pour le web ainsi que le principe 'convention plutôt que configuration', réduisant drastiquement le code nécessaire pour démarrer une application. Son influence dépasse largement Ruby : CakePHP, Laravel, AdonisJS ou Django lui doivent une partie de leur philosophie.",
 sources=["https://rubyonrails.org/","https://en.wikipedia.org/wiki/Ruby_on_Rails"],
 relations=["INFLUENCE:cakephp","INFLUENCE:adonisjs","INFLUENCE:redwood","INFLUENCE:blitz"]),

dict(id="symfony", nom="Symfony", annee=2005, categorie="Backend", importance=2,
 courte="Un framework PHP modulaire d'entreprise, dont de nombreux composants sont réutilisés par Laravel lui-même.",
 longue="Créé par Fabien Potencier et sa société SensioLabs, publié en 2005. Symfony se distingue par son architecture en composants indépendants, dont plusieurs (routing, HttpFoundation, Console) sont directement réutilisés par Laravel et d'autres frameworks PHP. Reste la référence pour les applications PHP d'entreprise nécessitant une grande rigueur architecturale.",
 sources=["https://symfony.com/","https://en.wikipedia.org/wiki/Symfony"],
 relations=["DEPENDS_ON:php5","CONCURRENCE:laravel","CONCURRENCE:cakephp","CONCURRENCE:codeigniter"]),

dict(id="microservices", nom="Microservices", annee=2014, categorie="Backend", importance=3,
 courte="Un style d'architecture qui découpe une application en petits services indépendants, déployables séparément.",
 longue="Le terme circule dès un atelier d'architectes logiciels près de Venise en 2011, mais c'est l'article de James Lewis et Martin Fowler en mars 2014 qui le formalise et le popularise à grande échelle. Chaque service porte une responsabilité métier précise, communique via API ou événements, et peut être développé, déployé et scalé indépendamment des autres. Rendu praticable à grande échelle par Docker et Kubernetes, mais aussi source d'une complexité opérationnelle nouvelle (observabilité, cohérence des données).",
 sources=["https://martinfowler.com/articles/microservices.html","https://en.wikipedia.org/wiki/Microservices"],
 relations=["DEPENDS_ON:docker","DEPENDS_ON:k8s","DEPENDS_ON:bounded_context"]),

dict(id="webrtc", nom="WebRTC", annee=2011, categorie="Backend", importance=2,
 courte="Une technologie standardisée permettant la communication audio, vidéo et de données en pair-à-pair directement dans le navigateur.",
 longue="Initiée par Google en 2011 puis standardisée conjointement par le W3C et l'IETF. WebRTC permet à deux navigateurs d'échanger des flux audio, vidéo ou des données arbitraires sans plugin ni serveur intermédiaire pour le flux lui-même, un serveur ne servant qu'à la négociation initiale (signaling). Fondation technique de la visioconférence web moderne (Google Meet, Discord, Zoom pour sa version web).",
 sources=["https://webrtc.org/","https://en.wikipedia.org/wiki/WebRTC"],
 relations=["DEPENDS_ON:html5","STANDARDISATION:w3c"]),

dict(id="envoy", nom="Envoy", annee=2016, categorie="DevOps", importance=2,
 courte="Un proxy réseau haute performance créé par Lyft, devenu la brique standard des maillages de services (service mesh).",
 longue="Développé en interne chez Lyft à partir de 2015 par Matt Klein, puis publié en open source en septembre 2016 et confié à la Cloud Native Computing Foundation en 2017. Envoy s'exécute aux côtés de chaque service pour gérer le routage, l'observabilité et la résilience réseau, indépendamment du langage de l'application. Sert de fondation technique à des service mesh comme Istio.",
 sources=["https://www.envoyproxy.io/","https://en.wikipedia.org/wiki/Envoy_(proxy)"],
 relations=["DEPENDS_ON:microservices","DEPENDS_ON:k8s"]),
]

if __name__ == "__main__":
    print(len(NEW_NODES), "nouvelles fiches fondations")
