'use strict';

/* ── WORLD ─────────────────────────────────── */
const WW = 6000, WH = 900, YMIN = 1969, YMAX = 2022, MX = 380;
const xY = y => MX + ((y - YMIN) / (YMAX - YMIN)) * (WW - 2 * MX);

const CATS = {
  "Fondations": { color: "#1a7acc", ly: .12 },
  "Infrastructure": { color: "#1aaa8a", ly: .28 },
  "Backend": { color: "#8a6add", ly: .46 },
  "Frontend": { color: "#1acccc", ly: .63 },
  "Sécurité": { color: "#dd8a3a", ly: .78 },
  "Marketing": { color: "#cc6aaa", ly: .90 },
};

const ET = {
  INFLUENCE: { color: "#1a7acc", dash: [4, 6], label: "Influence", w: .9, animType: 'particles', speed: 1.2 },
  DEPENDS_ON: { color: "#1aaa8a", dash: [], label: "Dépend de", w: .7, animType: 'particles', speed: 1.5 },
  REPLACED_BY: { color: "#dd8a3a", dash: [8, 4], label: "Remplacé par", w: 1.1, animType: 'particles', speed: 0.8 },
  EVOLVES_INTO: { color: "#cc6aaa", dash: [6, 4], label: "Évolue vers", w: 1, animType: 'particles', speed: 1.0 },
  STANDARDISATION: { color: "#8a6add", dash: [], label: "Standardise", w: .8, animType: 'particles', speed: 0.6 },
  CONCURRENCE: { color: "#e26a6a", dash: [3, 3], label: "Concurrence", w: 1, animType: 'pingPong', speed: 2 }
};

/* ── NODES ─────────────────────────────────── */
const NODES = [
  { id: "bdd", nom: "Base de données", annee: 1970, cat: "Backend", simple: "Stocker, retrouver et manipuler des informations de façon organisée.", precise: "Formalisé par Edgar Codd chez IBM en 1970. Structure relationnelle dominante 50 ans plus tard." },
  { id: "ftp", nom: "FTP", annee: 1971, cat: "Fondations", simple: "Le protocole pour transférer des fichiers entre ordinateurs.", precise: "File Transfer Protocol. Précède le Web. Remplacé par SFTP et HTTPS." },
  { id: "email", nom: "Email", annee: 1971, cat: "Fondations", simple: "Envoyer des messages électroniques d'une machine à une autre.", precise: "Ray Tomlinson introduit le @ en 1971. 300 milliards d'emails envoyés par jour en 2023." },
  { id: "sql", nom: "SQL", annee: 1974, cat: "Backend", simple: "Le langage universel pour interroger une base de données.", precise: "Standardisé par IBM dans les années 70. Omniprésent depuis 50 ans. PostgreSQL, MySQL, SQLite." },
  { id: "crypto", nom: "Cryptographie", annee: 1976, cat: "Sécurité", simple: "Protéger des données en les rendant illisibles sans la clé.", precise: "Diffie et Hellman formalisent la clé publique en 1976. Fondation de HTTPS, SSL et TLS." },
  { id: "tcpip", nom: "TCP/IP", annee: 1983, cat: "Fondations", simple: "Les règles qui permettent à deux ordinateurs de se comprendre.", precise: "TCP découpe en paquets, IP adresse chaque machine. Standard universel depuis 1983." },
  { id: "ip", nom: "Adresse IP", annee: 1983, cat: "Fondations", simple: "L'identifiant unique de chaque machine connectée à Internet.", precise: "IPv4 épuisé en 2011, IPv6 en déploiement. Sans IP, aucune communication possible." },
  { id: "dns", nom: "DNS", annee: 1985, cat: "Fondations", simple: "L'annuaire d'Internet : traduit un nom de site en adresse machine.", precise: "Domain Name System. Convertit google.com en adresse IP. Une panne DNS = Web inaccessible." },
  { id: "fw", nom: "Firewall", annee: 1988, cat: "Sécurité", simple: "Filtrer le trafic réseau contre les intrusions.", precise: "Émerge en 1988 après le Morris Worm. Première ligne de défense des réseaux." },
  { id: "srv", nom: "Serveur", annee: 1990, cat: "Infrastructure", simple: "Un ordinateur qui stocke et envoie des données aux autres.", precise: "Premier serveur web : Tim Berners-Lee au CERN en 1990. Base de toute l'infrastructure web." },
  { id: "linux", nom: "Linux", annee: 1991, cat: "Infrastructure", simple: "Le système d'exploitation libre qui fait tourner la majorité des serveurs.", precise: "Linus Torvalds en 1991. 96% des serveurs web. Android. Tous les supercalculateurs du top 500." },
  { id: "net", nom: "Internet", annee: 1983, cat: "Fondations", simple: "Le réseau mondial qui relie des milliards d'ordinateurs.", precise: "Né des recherches ARPANET (1969), structuré par TCP/IP en 1983, ouvert au grand public en 1991. Ne pas confondre avec le Web : l'Internet est l'autoroute." },
  { id: "web", nom: "Web", annee: 1991, cat: "Fondations", simple: "Un système de pages reliées, accessibles via Internet.", precise: "Tim Berners-Lee au CERN, 1991. Trois piliers : HTML, HTTP, URL. La plus grande bibliothèque." },
  { id: "http", nom: "HTTP", annee: 1991, cat: "Fondations", simple: "Le protocole qui permet au navigateur de demander une page.", precise: "HyperText Transfer Protocol. Non sécurisé — HTTPS l'a remplacé. HTTP/3 en 2022." },
  { id: "html", nom: "HTML", annee: 1991, cat: "Frontend", simple: "Le langage qui structure le contenu d'une page web.", precise: "HyperText Markup Language. Squelette de chaque page. De HTML 1.0 à HTML5." },
  { id: "url", nom: "URL", annee: 1991, cat: "Fondations", simple: "L'adresse unique d'une page sur le Web.", precise: "Uniform Resource Locator. Système de coordonnées du Web. Chaque ressource a une adresse." },
  { id: "msr", nom: "Moteur de recherche", annee: 1993, cat: "Fondations", simple: "Indexer le Web pour trouver une page parmi des milliards.", precise: "Excite, AltaVista, Yahoo 1993. Google 1998 avec PageRank révolutionne l'indexation." },
  { id: "nav", nom: "Navigateur", annee: 1993, cat: "Fondations", simple: "Le logiciel qui permet d'explorer le Web.", precise: "Mosaic 1993, Netscape 1994, IE 1995, Firefox 2004, Chrome 2008. La fenêtre sur le Web." },
  { id: "php", nom: "PHP", annee: 1994, cat: "Backend", simple: "Un langage pour créer des pages web au contenu dynamique.", precise: "Rasmus Lerdorf, 1994. WordPress, Wikipedia construits en PHP. 79% des sites côté serveur." },
  { id: "w3c", nom: "W3C", annee: 1994, cat: "Fondations", simple: "L'organisation qui définit les standards du Web.", precise: "Tim Berners-Lee, 1994. Définit HTML, CSS, XML, SVG, WebAssembly. Gardien du Web ouvert." },
  { id: "cookie", nom: "Cookie", annee: 1994, cat: "Frontend", simple: "Un petit fichier qui permet aux sites de se souvenir de toi.", precise: "Lou Montulli, Netscape, 1994. Fondation des sessions et du tracking publicitaire." },
  { id: "https", nom: "HTTPS", annee: 1994, cat: "Sécurité", simple: "La version sécurisée du HTTP.", precise: "HTTP + SSL/TLS. Universel après 2014. Let's Encrypt en 2015 rend les certificats gratuits." },
  { id: "stream", nom: "Streaming", annee: 1995, cat: "Fondations", simple: "Diffuser de la vidéo ou de l'audio en continu.", precise: "RealNetworks 1995. YouTube 2005, Netflix 2007, Spotify 2008. 80% du trafic Internet." },
  { id: "apache", nom: "Apache", annee: 1995, cat: "Infrastructure", simple: "Le logiciel qui fait tourner la majorité des serveurs web.", precise: "Open source, 1995. Nommé en hommage au peuple Apache. Pilier de LAMP (Linux, Apache, MySQL, PHP)." },
  { id: "ecom", nom: "E-commerce", annee: 1995, cat: "Fondations", simple: "Acheter et vendre via Internet.", precise: "Amazon et eBay naissent tous deux en 1995. L'année zéro du commerce en ligne." },
  { id: "js", nom: "JavaScript", annee: 1995, cat: "Frontend", simple: "Le langage qui rend les pages web interactives.", precise: "Brendan Eich, 10 jours, 1995. Le langage le plus utilisé au monde. Du browser au serveur." },
  { id: "mysql", nom: "MySQL", annee: 1995, cat: "Backend", simple: "Un système de base de données open source massivement adopté.", precise: "1995. Pilier de LAMP. Racheté par Oracle en 2010. MariaDB en est le fork libre." },
  { id: "ssl", nom: "SSL", annee: 1995, cat: "Sécurité", simple: "Le système qui chiffrer les échanges entre navigateur et serveur.", precise: "Netscape, 1995. Remplacé par TLS — SSL aujourd'hui signifie TLS. Fondation du Web sécurisé." },
  { id: "css", nom: "CSS", annee: 1996, cat: "Frontend", simple: "Le langage qui habille une page web.", precise: "Cascading Style Sheets. Sépare contenu et présentation. Standardisé par le W3C en 1996." },
  { id: "flash", nom: "Flash", annee: 1996, cat: "Frontend", simple: "L'outil d'animation du Web avant JavaScript.", precise: "Macromedia 1996. 15 ans de règne. Tué par l'iPhone 2010. Arrêté définitivement en 2020." },
  { id: "portal", nom: "Portail Web", annee: 1996, cat: "Fondations", simple: "Un site généraliste servant de point d'entrée unique sur Internet.", precise: "Yahoo, AOL, MSN. Dominants 1996–2002. Ancêtres des plateformes et réseaux sociaux." },
  { id: "vpn", nom: "VPN", annee: 1996, cat: "Sécurité", simple: "Un tunnel sécurisé qui chiffre toute ta connexion.", precise: "Microsoft, 1996. D'abord entreprise. Grand public dans les années 2010 pour la confidentialité." },
  { id: "blog", nom: "Blog", annee: 1997, cat: "Fondations", simple: "Un site de publication personnelle régulière.", precise: "'Weblog' Jorn Barger 1997. WordPress 2003. Précurseur des réseaux sociaux." },
  { id: "seo", nom: "SEO", annee: 1997, cat: "Marketing", simple: "Optimiser un site pour les moteurs de recherche.", precise: "Naît avec les premiers moteurs. Google transforme le SEO avec PageRank. 80 Md$/an d'industrie." },
  { id: "xml", nom: "XML", annee: 1998, cat: "Fondations", simple: "Un langage universel pour structurer et échanger des données.", precise: "W3C 1998. Supplanté par JSON pour les APIs. Influence : SVG, XHTML, RSS, SOAP." },
  { id: "css2", nom: "CSS2", annee: 1998, cat: "Frontend", simple: "La version enrichie de CSS pour les mises en page avancées.", precise: "W3C 1998. Positionnement, pseudo-classes, sélecteurs avancés. Base pendant 10 ans." },
  { id: "emkt", nom: "Email Marketing", annee: 1998, cat: "Marketing", simple: "L'utilisation de l'email comme canal commercial.", precise: "1998 : explosion du potentiel et du spam simultanément. ROI de 42$ pour 1$ investi." },
  { id: "google", nom: "Google", annee: 1998, cat: "Fondations", simple: "Le moteur de recherche qui a réorganisé l'accès à l'information.", precise: "Page et Brin, Stanford, 1998. PageRank écrase tous les concurrents en 5 ans. 92% de part." },
  { id: "os", nom: "Open Source", annee: 1998, cat: "Fondations", simple: "Le code accessible et modifiable par tous.", precise: "Officialisé en 1998. Linux, Apache, MySQL, PHP — les quatre piliers du Web libre." },
  { id: "pgrnk", nom: "PageRank", annee: 1998, cat: "Fondations", simple: "L'algorithme de Google qui mesure l'importance d'une page.", precise: "Larry Page. Principe bibliométrique : une page est importante si d'autres importantes y pointent." },
  { id: "dom", nom: "DOM", annee: 1998, cat: "Frontend", simple: "La représentation vivante d'une page que JavaScript peut modifier.", precise: "Document Object Model. Structure arborescente HTML ↔ JavaScript. Standard W3C 1998." },
  { id: "ajax", nom: "AJAX", annee: 1999, cat: "Frontend", simple: "Mettre à jour une page sans la recharger.", precise: "XMLHttpRequest 1999. Gmail et Google Maps 2004 popularisent AJAX. Prémices des SPAs." },
  { id: "api", nom: "API", annee: 1999, cat: "Backend", simple: "Une interface qui permet à deux logiciels de communiquer.", precise: "Application Programming Interface. Moteur invisible du Web moderne. Chaque app dépend de dizaines." },
  { id: "broad", nom: "Broadband", annee: 1999, cat: "Infrastructure", simple: "La connexion haut débit qui remplace le modem téléphonique.", precise: "ADSL, câble, fibre. Internet devient un media à part entière. La fibre atteint 10 Gbps." },
  { id: "cms", nom: "CMS", annee: 1999, cat: "Backend", simple: "Créer un site sans savoir coder.", precise: "Content Management System. WordPress 2003 : 43% des sites mondiaux. Drupal, Joomla..." },
  { id: "p2p", nom: "Peer-to-Peer", annee: 1999, cat: "Fondations", simple: "Un réseau d'échange direct entre ordinateurs, sans serveur central.", precise: "Napster 1999. BitTorrent 2001. Précurseur conceptuel des blockchains décentralisées." },
  { id: "rss", nom: "RSS", annee: 1999, cat: "Fondations", simple: "Un format pour s'abonner à un site et recevoir ses contenus.", precise: "Netscape 1999. Précurseur des fils d'actualité. Toujours utilisé par les podcasts." },
  { id: "wifi", nom: "Wi-Fi", annee: 1999, cat: "Infrastructure", simple: "La connexion Internet sans fil.", precise: "IEEE 802.11b, 1999. Libère Internet du câble. Wi-Fi 7 en 2024 : 40 Gbps théoriques." },
  { id: "y2k", nom: "Bug Y2K", annee: 1999, cat: "Fondations", simple: "La panique mondiale du passage à l'an 2000.", precise: "Bug né d'une économie de mémoire des années 60. 300 Md$ investis. Révèle la fragilité du numérique." },
  { id: "auth", nom: "Authentification", annee: 1999, cat: "Sécurité", simple: "Le mécanisme qui vérifie ton identité en ligne.", precise: "Login et sessions standardisés fin des années 90. Fondation de toute expérience personnalisée." },
  { id: "tls", nom: "TLS", annee: 1999, cat: "Sécurité", simple: "Le successeur moderne et sécurisé de SSL.", precise: "Transport Layer Security. Succède à SSL en 1999. Chiffrement universel pour le protocole HTTPS." },
  { id: "rest", nom: "REST", annee: 2000, cat: "Backend", simple: "Un style d'architecture pour concevoir des APIs web simples.", precise: "Roy Fielding, thèse 2000. GET, POST, PUT, DELETE. Standard universel des APIs web pendant 20 ans." },
  { id: "xmlrpc", nom: "XML-RPC", annee: 2000, cat: "Backend", simple: "Un protocole pour appeler des fonctions sur un serveur distant.", precise: "Précurseur de REST et SOAP. WordPress l'utilise encore pour son API de publication." },
  { id: "adwords", nom: "Google AdWords", annee: 2000, cat: "Marketing", simple: "Le système publicitaire de Google basé sur les recherches.", precise: "2000. Coût par clic. Rebaptisé Google Ads 2018. 200 Md$/an. Modèle copié par tous." },
  { id: "json", nom: "JSON", annee: 2001, cat: "Backend", simple: "Un format léger pour échanger des données entre applications.", precise: "Douglas Crockford, 2001. Supplante XML pour les APIs. Natif JavaScript. Format quasi-universel." },
  { id: "wiki", nom: "Wikipedia", annee: 2001, cat: "Fondations", simple: "La première encyclopédie collaborative en ligne.", precise: "Jimmy Wales et Larry Sanger, 2001. 60 millions d'articles en 330 langues." },
  { id: "bt", nom: "BitTorrent", annee: 2001, cat: "Fondations", simple: "Un protocole d'échange décentralisé ultra-efficace.", precise: "Bram Cohen, 2001. Plus il y a de téléchargeurs, plus c'est rapide. Précurseur du P2P moderne." },
  { id: "itunes", nom: "iTunes / MP3", annee: 2001, cat: "Fondations", simple: "L'écosystème qui a numérisé la musique et préfiguré le streaming.", precise: "Apple 2001. iTunes Store 2003 prouve qu'on peut vendre du contenu numérique." },
  { id: "wp", nom: "WordPress", annee: 2003, cat: "Backend", simple: "Le CMS open source qui propulse 43% des sites du monde.", precise: "Matt Mullenweg, 2003. De blog à plateforme CMS complète. 60 000 plugins." },
  { id: "wk", nom: "WebKit", annee: 2003, cat: "Fondations", simple: "Le moteur de rendu qui propulse Safari et les navigateurs mobiles.", precise: "Apple fork de KHTML, intégré à Safari dès 2003. Google l'adopte puis crée Blink en 2013. Moteur de Safari/iOS." },
  { id: "fb", nom: "Facebook", annee: 2004, cat: "Fondations", simple: "Le réseau social qui a connecté des milliards d'humains.", precise: "Zuckerberg, Harvard, 2004. 3 milliards d'utilisateurs actifs. Inventeur du graphe social." },
  { id: "gmail", nom: "Gmail", annee: 2004, cat: "Fondations", simple: "Le service email de Google avec 1 Go de stockage gratuit.", precise: "1er avril 2004. Interface AJAX ultra-fluide. Rivalise avec les apps de bureau. 1,8 Md d'utilisateurs." },
  { id: "ff", nom: "Firefox", annee: 2004, cat: "Fondations", simple: "Le navigateur open source qui a brisé le monopole d'IE.", precise: "Firefox 1.0, novembre 2004. 100 millions de téléchargements en un an." },
  { id: "pod", nom: "Podcast", annee: 2004, cat: "Fondations", simple: "Un format audio diffusé via Internet, à la demande.", precise: "Ben Hammersley, 2004. Intégré iTunes 2005. 4 millions de podcasts actifs, 500M d'auditeurs." },
  { id: "php5", nom: "PHP5", annee: 2004, cat: "Backend", simple: "La version de PHP qui introduit la programmation orientée objet.", precise: "Juillet 2004, Zend Engine 2. WordPress, Drupal, Symfony se construisent dessus." },
  { id: "web2", nom: "Web 2.0", annee: 2004, cat: "Fondations", simple: "Le tournant où les utilisateurs deviennent créateurs de contenu.", precise: "Tim O'Reilly, 2004. Blogs, wikis, réseaux sociaux. Naissance de l'économie de l'attention." },
  { id: "ga", nom: "Google Analytics", annee: 2005, cat: "Marketing", simple: "Mesurer précisément le comportement des visiteurs d'un site.", precise: "Google rachète Urchin 2005. Gratuit. Données sur la moitié du Web mondial." },
  { id: "yt", nom: "YouTube", annee: 2005, cat: "Fondations", simple: "La plateforme qui a démocratisé la vidéo en ligne.", precise: "2005. Racheté par Google 2006 pour 1,65 Md$. 500h uploadées par minute en 2023." },
  { id: "saas", nom: "SaaS", annee: 2005, cat: "Infrastructure", simple: "Un logiciel via Internet par abonnement, sans installation.", precise: "Software as a Service. Salesforce pionnier. Google Apps, Dropbox, Slack. Modèle dominant." },
  { id: "sass", nom: "Sass / LESS", annee: 2006, cat: "Frontend", simple: "Des langages qui enrichissent CSS avec variables et logique.", precise: "Hampton Catlin 2006. Variables, imbrication, mixins. CSS Variables en 2017 absorbe leurs idées." },
  { id: "jq", nom: "jQuery", annee: 2006, cat: "Frontend", simple: "La bibliothèque JavaScript qui a rendu le Web accessible à tous.", precise: "John Resig 2006. Résout les incompatibilités navigateurs. Sur 77% des sites en 2012." },
  { id: "tw", nom: "Twitter", annee: 2006, cat: "Fondations", simple: "Le réseau social du message court et de l'info en temps réel.", precise: "Jack Dorsey, 2006. 140 caractères, hashtag, retweet. Racheté par Musk 2022, rebaptisé X." },
  { id: "aws", nom: "AWS", annee: 2006, cat: "Infrastructure", simple: "La plateforme cloud d'Amazon pour louer serveurs et services à la demande.", precise: "S3 mars 2006, EC2 août 2006. Invente le cloud grand public. 32% du marché mondial." },
  { id: "cloud", nom: "Cloud Computing", annee: 2006, cat: "Infrastructure", simple: "Utiliser serveurs et logiciels via Internet sans les posséder.", precise: "L'informatique comme l'électricité. 94% des entreprises utilisent un service cloud." },
  { id: "iphone", nom: "iPhone / Mobile", annee: 2007, cat: "Fondations", simple: "L'appareil qui a mis Internet dans toutes les poches.", precise: "Steve Jobs, 9 janvier 2007. Tue Flash. Impose le tactile. Mobile > Desktop en 2016." },
  { id: "drop", nom: "Dropbox", annee: 2008, cat: "Infrastructure", simple: "Le service qui a popularisé le stockage dans le cloud.", precise: "Drew Houston 2008. 100 millions d'utilisateurs en 2012. Inventeur du freemium cloud." },
  { id: "gh", nom: "GitHub", annee: 2008, cat: "Fondations", simple: "La plateforme qui héberge le code de la majorité des projets.", precise: "2008. Interface sociale autour de Git. Racheté par Microsoft 2018 pour 7,5 Md$. 100M devs." },
  { id: "chrome", nom: "Chrome", annee: 2008, cat: "Fondations", simple: "Le navigateur de Google qui domine le Web à 65%.", precise: "Septembre 2008. Moteur V8 JavaScript ultra-rapide. Dépasse IE en 2012." },
  { id: "sp", nom: "Spotify", annee: 2008, cat: "Fondations", simple: "La plateforme qui a légalisé et démocratisé le streaming musical.", precise: "Daniel Ek, 2008. Résout l'équation post-Napster. 600 millions d'utilisateurs." },
  { id: "html5", nom: "HTML5", annee: 2008, cat: "Frontend", simple: "La version moderne de HTML avec vidéo, audio et apps web.", precise: "Draft 2008, standard W3C 2014. Tue Flash. Canvas, WebSockets, localStorage, Service Workers." },
  { id: "node", nom: "Node.js", annee: 2009, cat: "Backend", simple: "Exécuter JavaScript côté serveur.", precise: "Ryan Dahl 2009. Moteur V8 de Chrome. npm : 2,5 millions de paquets. Plein-stack JS possible." },
  { id: "css3", nom: "CSS3", annee: 2009, cat: "Frontend", simple: "Animations, transitions et layouts flexibles en CSS.", precise: "Modules indépendants depuis 2009. Flexbox, animations, variables, Grid Layout." },
  { id: "ang", nom: "Angular", annee: 2010, cat: "Frontend", simple: "Le framework JavaScript de Google pour applications complexes.", precise: "AngularJS 2010. Data-binding bidirectionnel révolutionnaire. Réécrit en TypeScript en 2016." },
  { id: "rwd", nom: "Responsive Design", annee: 2010, cat: "Frontend", simple: "Un site qui s'adapte à toutes les tailles d'écran.", precise: "Ethan Marcotte, A List Apart, mai 2010. Mobile-first. Google impose le responsive en 2012." },
  { id: "ipad", nom: "iPad", annee: 2010, cat: "Fondations", simple: "L'appareil entre smartphone et ordinateur.", precise: "Apple, avril 2010. Troisième breakpoint responsive. Accélère la mort du Flash." },
  { id: "ig", nom: "Instagram", annee: 2010, cat: "Fondations", simple: "Le réseau social de la photo qui a inventé la culture visuelle mobile.", precise: "Kevin Systrom, octobre 2010. Racheté Facebook 2012 pour 1 Md$. 2 milliards d'utilisateurs." },
  { id: "bb", nom: "Backbone.js", annee: 2010, cat: "Frontend", simple: "La première bibliothèque JavaScript qui structure les apps complexes.", precise: "Jeremy Ashkenas 2010. MVC dans le frontend. Précurseur d'Angular, React, Vue." },
  { id: "wp2", nom: "Webpack", annee: 2012, cat: "Frontend", simple: "L'outil qui assemble et optimise les fichiers d'une app web.", precise: "Tobias Koppers 2012. Bundle, transpile, minifie. Concurrencé par Vite depuis 2020." },
  { id: "ts", nom: "TypeScript", annee: 2012, cat: "Frontend", simple: "Une version de JavaScript avec le typage statique.", precise: "Microsoft, octobre 2012. Sur-ensemble de JavaScript. Standard de l'industrie." },
  { id: "react", nom: "React", annee: 2013, cat: "Frontend", simple: "La bibliothèque de Facebook qui a révolutionné les interfaces web.", precise: "Jordan Walke, Facebook, mai 2013. Virtual DOM, composants. 20M téléchargements/semaine." },
  { id: "docker", nom: "Docker", annee: 2013, cat: "Infrastructure", simple: "Empaqueter une app et son environnement dans un conteneur portable.", precise: "Solomon Hykes, mars 2013. Résout 'ça marche sur ma machine'. Révolution DevOps." },
  { id: "srvless", nom: "Serverless", annee: 2014, cat: "Infrastructure", simple: "Déployer des fonctions sans gérer aucun serveur.", precise: "AWS Lambda, novembre 2014. Payer à la milliseconde. Vercel, Netlify popularisent." },
  { id: "k8s", nom: "Kubernetes", annee: 2014, cat: "Infrastructure", simple: "Orchestrer des milliers de conteneurs Docker en production.", precise: "Google, open sourcé juin 2014. Standard universel d'orchestration cloud. 5,6M développeurs." },
  { id: "vue", nom: "Vue.js", annee: 2014, cat: "Frontend", simple: "Le framework JavaScript progressif qui combine simplicité et puissance.", precise: "Evan You, ex-Google, février 2014. Dominant en Asie. Trinité avec React et Angular." },
  { id: "gql", nom: "GraphQL", annee: 2015, cat: "Backend", simple: "Un langage de requête pour APIs qui retourne exactement ce qu'on demande.", precise: "Facebook interne 2012, open source 2015. Résout sur-fetching et under-fetching de REST." },
  { id: "pwa", nom: "Progressive Web App", annee: 2015, cat: "Frontend", simple: "Un site web qui se comporte comme une app mobile native.", precise: "Frances Berriman et Alex Russell, Google, 2015. Service Workers, offline, installable." },
  { id: "next", nom: "Next.js", annee: 2016, cat: "Frontend", simple: "Le framework React qui simplifie le rendu côté serveur.", precise: "Vercel, 2016. Rendu hybride SSR/SSG, API Routes, optimisation automatique. Devient la référence du React moderne avec l’App Router en 2023." },
  { id: "gatsby", nom: "Gatsby", annee: 2016, cat: "Frontend", simple: "Le générateur de sites statiques basé sur React.", precise: "Kyle Mathews, 2016. GraphQL intégré, écosystème de plugins. Pionnier du JAMstack avant d’être dépassé par Next.js et Astro." },
  { id: "nuxt", nom: "Nuxt.js", annee: 2016, cat: "Frontend", simple: "Le framework Vue pour créer des apps universelles.", precise: "2016. SSR, SSG, routing automatique. Nuxt 3 (2022) modernise l’écosystème Vue avec Nitro et Vite." },
  { id: "wasm", nom: "WebAssembly", annee: 2017, cat: "Frontend", simple: "Exécuter du code ultra-rapide dans le navigateur.", precise: "Disponible dans les navigateurs dès 2017, standard W3C 2019. Compile C, C++, Rust. Performances proches du natif." },
  { id: "tailwind", nom: "Tailwind CSS", annee: 2017, cat: "Frontend", simple: "Le framework CSS utilitaire qui remplace les classes personnalisées.", precise: "Adam Wathan, 2017. Approche utility-first, purge automatique, design system intégré. Devient dominant dans les années 2020." },
  { id: "cfw", nom: "Cloudflare Workers", annee: 2017, cat: "Infrastructure", simple: "Exécuter du JavaScript à la périphérie du réseau.", precise: "Cloudflare, 2017. Edge computing ultra-rapide, sans serveur, proche des utilisateurs. Base de l’architecture moderne distribuée." },
  { id: "flutterweb", nom: "Flutter Web", annee: 2017, cat: "Frontend", simple: "Compiler des interfaces Flutter pour le Web.", precise: "Google, 2017. Rendu Canvas/WebGL. Une approche cross‑platform unifiée pour mobile, desktop et web." },
  { id: "wc", nom: "Web Components", annee: 2018, cat: "Frontend", simple: "Créer ses propres balises HTML réutilisables, indépendantes de tout framework.", precise: "Standardisés par le W3C en 2018. Trois piliers : Custom Elements, Shadow DOM, HTML Templates. Fonctionnent nativement dans tous les navigateurs modernes. Promesse d'interopérabilité face aux frameworks." },
  { id: "jam", nom: "JAMstack", annee: 2016, cat: "Infrastructure", simple: "Une architecture qui pré-génère des pages statiques ultra-rapides et sécurisées.", precise: "Formalisée par Mathias Biilmann (Netlify) en 2016. Principe : générer les pages à l'avance, les servir via CDN, déléguer le dynamique aux APIs. Zéro serveur, performance maximale. Next.js, Gatsby, Nuxt. Rebaptisée 'Composable Architecture' en 2022." },
  { id: "lit", nom: "Lit", annee: 2018, cat: "Frontend", simple: "Une librairie légère pour créer des Web Components.", precise: "Google, 2018. Syntaxe minimaliste, rendu ultra-rapide, adoption croissante dans les design systems." },
  { id: "svelte", nom: "Svelte", annee: 2018, cat: "Frontend", simple: "Le framework qui compile les composants au lieu de les exécuter.", precise: "Rich Harris, 2018. Pas de virtual DOM, performances exceptionnelles. SvelteKit devient son framework officiel en 2023." },
  { id: "netlify", nom: "Netlify", annee: 2015, cat: "Infrastructure", simple: "La plateforme qui a popularisé le JAMstack.", precise: "Fondé en 2014, lancé publiquement en 2015. Déploiement Git, fonctions serverless, edge. Accélère la transition vers les sites statiques modernes." },
  { id: "vercel", nom: "Vercel", annee: 2015, cat: "Infrastructure", simple: "La plateforme d'hébergement optimisée pour React et Next.js.", precise: "Fondé sous le nom Zeit en 2015, rebaptisé Vercel en 2020. Edge Functions, ISR, App Router. Devient un pilier du Web moderne." },
  { id: "deno", nom: "Deno", annee: 2019, cat: "Backend", simple: "Le runtime JavaScript sécurisé créé par l’auteur de Node.", precise: "Ryan Dahl, 2019. Permissions explicites, TypeScript natif, modules ES. Alternative moderne à Node.js." },
  { id: "snowpack", nom: "Snowpack", annee: 2019, cat: "Frontend", simple: "Le bundler qui a introduit le développement sans build.", precise: "2019. Basé sur les modules ES natifs. Précurseur direct de Vite." },
  { id: "svelte3", nom: "Svelte 3", annee: 2019, cat: "Frontend", simple: "La version qui a redéfini l’expérience développeur.", precise: "2019. Réactivité déclarative, syntaxe simplifiée. Lance la popularité massive de Svelte." },
  { id: "vite", nom: "Vite", annee: 2020, cat: "Frontend", simple: "Le bundler ultra-rapide basé sur ES modules.", precise: "Evan You, 2020. Dev server instantané, build via Rollup. Devient le standard du tooling frontend." },
  { id: "redwood", nom: "RedwoodJS", annee: 2020, cat: "Frontend", simple: "Le framework full-stack React + GraphQL.", precise: "2020. Pensé pour le JAMstack. Intègre Prisma, GraphQL, Cells et un workflow complet." },
  { id: "blitz", nom: "Blitz.js", annee: 2020, cat: "Frontend", simple: "Le framework inspiré de Ruby on Rails pour React.", precise: "2020. Full-stack, conventions fortes, migrations Prisma. Devient un sur-ensemble de Next.js." },
  { id: "supabase", nom: "Supabase", annee: 2020, cat: "Backend", simple: "L’alternative open source à Firebase.", precise: "2020. PostgreSQL, authentification, stockage, edge functions. Croissance fulgurante." },
  { id: "cfpages", nom: "Cloudflare Pages", annee: 2020, cat: "Infrastructure", simple: "Le déploiement statique ultra-rapide de Cloudflare.", precise: "2020. Intégré à Workers, idéal pour JAMstack et frameworks modernes." },
  { id: "astro", nom: "Astro", annee: 2021, cat: "Frontend", simple: "Le framework orienté contenu avec zéro JavaScript par défaut.", precise: "Fred K. Schott, 2021. Islands Architecture, support multi-framework. Révolutionne le Web statique." },
  { id: "remix", nom: "Remix", annee: 2021, cat: "Frontend", simple: "Le framework React basé sur le Web natif.", precise: "2021. Loaders, actions, navigation progressive. Racheté par Shopify en 2022." },
  { id: "esbuild", nom: "esbuild", annee: 2020, cat: "Frontend", simple: "Le bundler écrit en Go, 100× plus rapide que Webpack.", precise: "Evan Wallace, 2020. Base de nombreux outils modernes (Vite, Bun, etc.)." },
  { id: "swc", nom: "SWC", annee: 2021, cat: "Frontend", simple: "Le compilateur JavaScript ultra-rapide écrit en Rust.", precise: "2021. Adopté par Next.js, Parcel, Deno. Alternative moderne à Babel." },
  { id: "edgefunc", nom: "Edge Functions", annee: 2021, cat: "Infrastructure", simple: "Exécuter du code au plus près de l’utilisateur.", precise: "Vercel, 2021. Temps de réponse ultra-faible, idéal pour le Web distribué." },
  { id: "bun", nom: "Bun", annee: 2022, cat: "Backend", simple: "Le runtime JavaScript ultra-rapide tout-en-un.", precise: "Jarred Sumner, 2022. Bundler, test runner, package manager intégrés. Concurrence directe à Node et Deno." },
  { id: "wasi", nom: "WASI", annee: 2022, cat: "Backend", simple: "L’interface système standardisée pour WebAssembly.", precise: "2022. Permet d’exécuter du WebAssembly en dehors du navigateur. Base du futur Web natif." },
  { id: "qwik", nom: "Qwik", annee: 2022, cat: "Frontend", simple: "Le framework conçu pour le chargement instantané.", precise: "Misko Hevery, 2022. Résume le code en micro-chunks. Hydratation paresseuse révolutionnaire." },
  { id: "solidstart", nom: "SolidStart", annee: 2022, cat: "Frontend", simple: "Le framework full-stack basé sur SolidJS.", precise: "2022. SSR, routing, streaming. Performances extrêmes grâce à Solid." },
  { id: "webgpu", nom: "WebGPU", annee: 2023, cat: "Frontend", simple: "La nouvelle API graphique du Web, successeur de WebGL.", precise: "2023. Accès bas niveau au GPU. IA, 3D, calcul parallèle. Révolution pour le Web haute performance." },
  { id: "sveltekit", nom: "SvelteKit", annee: 2022, cat: "Frontend", simple: "Le framework officiel de Svelte.", precise: "Sorti en version stable en décembre 2022. Routing, SSR, adaptateurs multiples. Concurrent majeur de Next.js et Astro." },
  { id: "next13", nom: "Next.js 13", annee: 2023, cat: "Frontend", simple: "La version qui introduit l’App Router et React Server Components.", precise: "2023. Architecture server-first, streaming, layouts imbriqués. Redéfinit le développement React." },
  { id: "nuxt3", nom: "Nuxt 3", annee: 2023, cat: "Frontend", simple: "La nouvelle génération du framework Vue.", precise: "2023. Basé sur Nitro, Vite, TypeScript. Performances et DX modernisées." },
  { id: "rsc", nom: "React Server Components", annee: 2022, cat: "Frontend", simple: "Le modèle React qui exécute les composants côté serveur.", precise: "Introduit expérimentalement en 2020, intégré dans Next.js 13 en 2022. Moins de JavaScript côté client, streaming natif." },
  { id: "islands", nom: "Islands Architecture", annee: 2021, cat: "Frontend", simple: "Une approche où seules les parties interactives sont hydratées.", precise: "Concept formalisé par Jason Miller en 2019, popularisé par Astro dès 2021. Réduit drastiquement le JavaScript envoyé au client." },
  { id: "htmx", nom: "HTMX", annee: 2020, cat: "Frontend", simple: "Créer des interfaces dynamiques sans JavaScript explicite.", precise: "Carson Gross, 2020. Attributs HTML pour requêtes AJAX, SSE, WebSockets. Retour aux fondamentaux du Web." },
  { id: "unjs", nom: "UnJS", annee: 2024, cat: "Backend", simple: "L’écosystème d’outils JavaScript de l’équipe Nuxt.", precise: "Nitro, H3, Unstorage, Unbuild. Devient un socle majeur pour le Web moderne." },
  { id: "denodeploy", nom: "Deno Deploy", annee: 2024, cat: "Infrastructure", simple: "Le déploiement edge natif pour Deno.", precise: "2024. Exécution distribuée, cold starts quasi nuls. Alternative à Vercel et Cloudflare." },
  { id: "webcontainer", nom: "WebContainer", annee: 2021, cat: "Infrastructure", simple: "Exécuter Node.js directement dans le navigateur.", precise: "StackBlitz, 2021. Environnement de développement complet sans serveur distant." },
  { id: "turbopack", nom: "Turbopack", annee: 2022, cat: "Frontend", simple: "Le bundler Rust de Vercel, successeur de Webpack.", precise: "Annoncé avec Next.js 13 en octobre 2022. Intégré nativement à Next.js, conçu pour dépasser Webpack." },
  { id: "parcel2", nom: "Parcel 2", annee: 2021, cat: "Frontend", simple: "La nouvelle version du bundler zéro‑config.", precise: "Sorti en 2021. Support Rust, HMR amélioré, compilation parallèle." },
  { id: "fresh", nom: "Fresh", annee: 2022, cat: "Frontend", simple: "Le framework Deno basé sur l'hydratation progressive.", precise: "Sorti en version stable en 2022. Pas de build, rendu serveur natif, composants islands. Alternative moderne à React." },

];

/* ── EDGES ─────────────────────────────────── */
const EDGES = [
  ["ftp", "tcpip", "DEPENDS_ON"], ["ftp", "srv", "DEPENDS_ON"],
  ["email", "tcpip", "DEPENDS_ON"], ["email", "srv", "DEPENDS_ON"],
  ["tcpip", "net", "DEPENDS_ON"], ["tcpip", "dns", "INFLUENCE"], ["tcpip", "ip", "DEPENDS_ON"],
  ["dns", "url", "INFLUENCE"], ["net", "web", "EVOLVES_INTO"],
  ["web", "http", "DEPENDS_ON"], ["web", "html", "DEPENDS_ON"], ["web", "url", "DEPENDS_ON"], ["web", "net", "DEPENDS_ON"],
  ["http", "https", "REPLACED_BY"],
  ["html", "html5", "EVOLVES_INTO"],
  ["linux", "apache", "INFLUENCE"], ["linux", "aws", "DEPENDS_ON"], ["linux", "docker", "DEPENDS_ON"], ["linux", "gh", "DEPENDS_ON"],
  ["apache", "srv", "DEPENDS_ON"], ["apache", "php", "INFLUENCE"],
  ["bdd", "sql", "EVOLVES_INTO"], ["sql", "mysql", "EVOLVES_INTO"],
  ["php", "mysql", "DEPENDS_ON"], ["php", "php5", "EVOLVES_INTO"], ["php", "wp", "EVOLVES_INTO"],
  ["php5", "php", "EVOLVES_INTO"], ["php5", "wp", "INFLUENCE"],
  ["wp", "mysql", "DEPENDS_ON"], ["cms", "php", "DEPENDS_ON"], ["cms", "mysql", "DEPENDS_ON"], ["cms", "wp", "EVOLVES_INTO"],
  ["node", "js", "EVOLVES_INTO"], ["node", "npm", "EVOLVES_INTO"],
  ["css", "html", "DEPENDS_ON"], ["css2", "css", "EVOLVES_INTO"], ["css3", "css2", "EVOLVES_INTO"],
  ["css3", "html5", "DEPENDS_ON"], ["css3", "tailwind", "INFLUENCE"],
  ["sass", "css", "EVOLVES_INTO"], ["sass", "css3", "INFLUENCE"],
  ["flash", "html5", "REPLACED_BY"], ["flash", "js", "REPLACED_BY"],
  ["js", "dom", "DEPENDS_ON"],
  ["jq", "js", "DEPENDS_ON"], ["jq", "dom", "DEPENDS_ON"], ["jq", "ajax", "DEPENDS_ON"], ["jq", "react", "INFLUENCE"],
  ["ajax", "js", "DEPENDS_ON"], ["ajax", "dom", "DEPENDS_ON"], ["ajax", "api", "INFLUENCE"],
  ["bb", "js", "DEPENDS_ON"], ["bb", "jq", "DEPENDS_ON"], ["bb", "react", "INFLUENCE"],
  ["ang", "js", "DEPENDS_ON"], ["ang", "ts", "DEPENDS_ON"],
  ["ts", "angular", "DEPENDS_ON"], ["ts", "js", "EVOLVES_INTO"], ["ts", "react", "INFLUENCE"], ["ts", "ang", "INFLUENCE"],
  ["react", "js", "DEPENDS_ON"], ["react", "dom", "DEPENDS_ON"], ["react", "ts", "DEPENDS_ON"],
  ["vue", "js", "DEPENDS_ON"], ["vue", "react", "INFLUENCE"],
  ["wp2", "js", "DEPENDS_ON"], ["wp2", "react", "DEPENDS_ON"], ["wp2", "node", "DEPENDS_ON"],
  ["html5", "js", "DEPENDS_ON"], ["html5", "css3", "DEPENDS_ON"],
  ["dom", "html", "DEPENDS_ON"], ["dom", "js", "DEPENDS_ON"],
  ["pwa", "html5", "DEPENDS_ON"], ["pwa", "js", "DEPENDS_ON"], ["pwa", "iphone", "INFLUENCE"],
  ["wasm", "js", "INFLUENCE"], ["wasm", "html5", "DEPENDS_ON"],
  ["rwd", "css3", "DEPENDS_ON"], ["rwd", "html5", "DEPENDS_ON"], ["rwd", "iphone", "INFLUENCE"],
  ["api", "rest", "EVOLVES_INTO"], ["api", "http", "DEPENDS_ON"],
  ["rest", "json", "DEPENDS_ON"], ["rest", "http", "DEPENDS_ON"],
  ["json", "js", "DEPENDS_ON"], ["xml", "json", "CONCURRENCE"],
  ["gql", "rest", "EVOLVES_INTO"], ["gql", "api", "EVOLVES_INTO"], ["gql", "react", "INFLUENCE"],
  ["xmlrpc", "xml", "DEPENDS_ON"], ["xmlrpc", "api", "DEPENDS_ON"],
  ["crypto", "ssl", "INFLUENCE"], ["ssl", "tls", "EVOLVES_INTO"], ["tls", "https", "DEPENDS_ON"],
  ["auth", "cookie", "DEPENDS_ON"], ["auth", "https", "DEPENDS_ON"], ["fw", "srv", "DEPENDS_ON"], ["vpn", "https", "DEPENDS_ON"],
  ["aws", "srv", "DEPENDS_ON"], ["aws", "linux", "DEPENDS_ON"],
  ["cloud", "aws", "DEPENDS_ON"], ["cloud", "srv", "DEPENDS_ON"],
  ["saas", "cloud", "DEPENDS_ON"], ["saas", "aws", "DEPENDS_ON"], ["saas", "api", "DEPENDS_ON"],
  ["docker", "linux", "DEPENDS_ON"], ["docker", "cloud", "DEPENDS_ON"],
  ["k8s", "docker", "DEPENDS_ON"], ["k8s", "cloud", "DEPENDS_ON"],
  ["srvless", "aws", "DEPENDS_ON"], ["srvless", "cloud", "DEPENDS_ON"], ["srvless", "node", "DEPENDS_ON"],
  ["drop", "cloud", "DEPENDS_ON"], ["drop", "aws", "DEPENDS_ON"],
  ["iphone", "nav", "INFLUENCE"], ["iphone", "html5", "INFLUENCE"],
  ["ipad", "iphone", "DEPENDS_ON"], ["ipad", "rwd", "INFLUENCE"],
  ["ig", "iphone", "DEPENDS_ON"], ["ig", "api", "DEPENDS_ON"],
  ["fb", "api", "DEPENDS_ON"], ["fb", "js", "DEPENDS_ON"], ["fb", "react", "INFLUENCE"],
  ["tw", "api", "DEPENDS_ON"], ["tw", "web2", "DEPENDS_ON"],
  ["blog", "rss", "INFLUENCE"], ["blog", "cms", "DEPENDS_ON"], ["rss", "xml", "DEPENDS_ON"],
  ["wiki", "cms", "DEPENDS_ON"],
  ["yt", "stream", "DEPENDS_ON"], ["yt", "flash", "DEPENDS_ON"],
  ["stream", "broad", "DEPENDS_ON"], ["stream", "http", "DEPENDS_ON"],
  ["sp", "stream", "DEPENDS_ON"], ["sp", "api", "DEPENDS_ON"],
  ["pod", "rss", "DEPENDS_ON"], ["pod", "stream", "DEPENDS_ON"],
  ["itunes", "stream", "INFLUENCE"], ["p2p", "net", "DEPENDS_ON"], ["bt", "p2p", "EVOLVES_INTO"],
  ["web2", "ajax", "DEPENDS_ON"], ["web2", "blog", "DEPENDS_ON"], ["web2", "api", "DEPENDS_ON"],
  ["google", "msr", "EVOLVES_INTO"], ["google", "pgrnk", "DEPENDS_ON"], ["pgrnk", "seo", "INFLUENCE"],
  ["gmail", "email", "DEPENDS_ON"], ["ajax", "gmail", "INFLUENCE"], ["gmail", "google", "DEPENDS_ON"],
  ["ga", "google", "DEPENDS_ON"], ["ga", "cookie", "DEPENDS_ON"],
  ["adwords", "google", "DEPENDS_ON"], ["adwords", "seo", "INFLUENCE"],
  ["chrome", "nav", "EVOLVES_INTO"], ["chrome", "js", "DEPENDS_ON"],
  ["wk", "nav", "DEPENDS_ON"], ["wk", "html", "DEPENDS_ON"],
  ["seo", "msr", "DEPENDS_ON"], ["emkt", "email", "DEPENDS_ON"],
  ["os", "linux", "INFLUENCE"], ["os", "apache", "INFLUENCE"],
  ["ff", "nav", "EVOLVES_INTO"], ["ff", "os", "DEPENDS_ON"], ["gh", "os", "DEPENDS_ON"],
  ["w3c", "html", "STANDARDISATION"], ["w3c", "css", "STANDARDISATION"], ["w3c", "xml", "STANDARDISATION"], ["w3c", "html5", "STANDARDISATION"], ["w3c", "wasm", "STANDARDISATION"],
  ["cookie", "nav", "DEPENDS_ON"], ["cookie", "http", "DEPENDS_ON"], ["cookie", "auth", "INFLUENCE"],
  ["ecom", "https", "DEPENDS_ON"], ["ecom", "cookie", "DEPENDS_ON"],
  ["nav", "web", "DEPENDS_ON"], ["nav", "html", "DEPENDS_ON"],
  ["broad", "net", "DEPENDS_ON"], ["broad", "stream", "INFLUENCE"],
  ["portal", "msr", "DEPENDS_ON"], ["portal", "email", "DEPENDS_ON"],
  ["wc", "html5", "DEPENDS_ON"], ["wc", "lit", "INFLUENCE"], ["wc", "dom", "DEPENDS_ON"], ["wc", "js", "DEPENDS_ON"], ["wc", "w3c", "STANDARDISATION"], ["wc", "react", "CONCURRENCE"],
  ["jam", "srvless", "DEPENDS_ON"], ["jam", "api", "DEPENDS_ON"], ["jam", "react", "INFLUENCE"],
  ["next", "react", "DEPENDS_ON"], ["next", "node", "DEPENDS_ON"], ["next", "vercel", "DEPENDS_ON"],
  ["gatsby", "react", "DEPENDS_ON"], ["gatsby", "graphql", "DEPENDS_ON"], ["gatsby", "gql", "DEPENDS_ON"], ["gatsby", "jam", "INFLUENCE"],
  ["nuxt", "vue", "DEPENDS_ON"], ["nuxt", "node", "DEPENDS_ON"], ["nuxt", "jam", "INFLUENCE"],
  ["tailwind", "css3", "DEPENDS_ON"], ["tailwind", "rwd", "INFLUENCE"],
  ["cfw", "srvless", "EVOLVES_INTO"], ["cfw", "api", "DEPENDS_ON"], ["cfw", "net", "DEPENDS_ON"],
  ["flutterweb", "html5", "DEPENDS_ON"], ["flutterweb", "wasm", "INFLUENCE"],
  ["lit", "wc", "DEPENDS_ON"], ["lit", "js", "DEPENDS_ON"],
  ["svelte", "js", "DEPENDS_ON"], ["svelte", "dom", "INFLUENCE"],
  ["netlify", "jam", "EVOLVES_INTO"], ["netlify", "srvless", "DEPENDS_ON"], ["netlify", "api", "DEPENDS_ON"],
  ["vercel", "srvless", "DEPENDS_ON"], ["vercel", "edgefunc", "EVOLVES_INTO"],
  ["deno", "js", "EVOLVES_INTO"], ["deno", "ts", "DEPENDS_ON"], ["deno", "node", "CONCURRENCE"],
  ["snowpack", "js", "DEPENDS_ON"], ["snowpack", "esm", "INFLUENCE"],
  ["svelte3", "svelte", "EVOLVES_INTO"], ["svelte3", "js", "DEPENDS_ON"], ["svelte3", "sveltekit", "EVOLVES_INTO"],
  ["vite", "esbuild", "INFLUENCE"], ["vite", "js", "DEPENDS_ON"], ["vite", "ts", "DEPENDS_ON"], ["vite", "svelte", "INFLUENCE"], ["vite", "vue", "INFLUENCE"],
  ["redwood", "react", "DEPENDS_ON"], ["redwood", "gql", "DEPENDS_ON"], ["redwood", "jam", "INFLUENCE"],
  ["blitz", "next", "DEPENDS_ON"], ["blitz", "react", "DEPENDS_ON"],
  ["supabase", "sql", "DEPENDS_ON"], ["supabase", "api", "DEPENDS_ON"], ["supabase", "auth", "DEPENDS_ON"], ["supabase", "firebase", "CONCURRENCE"],
  ["cfpages", "jam", "EVOLVES_INTO"], ["cfpages", "cfw", "DEPENDS_ON"],
  ["astro", "html5", "DEPENDS_ON"], ["astro", "islands", "DEPENDS_ON"], ["astro", "react", "INFLUENCE"], ["astro", "vue", "INFLUENCE"], ["astro", "svelte", "INFLUENCE"],
  ["remix", "react", "DEPENDS_ON"], ["remix", "web", "DEPENDS_ON"],
  ["esbuild", "js", "DEPENDS_ON"], ["esbuild", "go", "INFLUENCE"],
  ["swc", "js", "DEPENDS_ON"], ["swc", "rust", "INFLUENCE"],
  ["edgefunc", "srvless", "EVOLVES_INTO"],
  ["bun", "js", "EVOLVES_INTO"], ["bun", "esbuild", "INFLUENCE"], ["bun", "node", "CONCURRENCE"], ["bun", "deno", "CONCURRENCE"],
  ["wasi", "wasm", "EVOLVES_INTO"], ["wasi", "linux", "DEPENDS_ON"],
  ["qwik", "js", "DEPENDS_ON"], ["qwik", "islands", "INFLUENCE"],
  ["solidstart", "solid", "DEPENDS_ON"], ["solidstart", "js", "DEPENDS_ON"],
  ["webgpu", "wasm", "INFLUENCE"], ["webgpu", "js", "DEPENDS_ON"],
  ["sveltekit", "svelte3", "EVOLVES_INTO"], ["sveltekit", "node", "DEPENDS_ON"],
  ["next13", "next", "EVOLVES_INTO"], ["next13", "rsc", "DEPENDS_ON"],
  ["nuxt3", "nuxt", "EVOLVES_INTO"], ["nuxt3", "vite", "DEPENDS_ON"],
  ["rsc", "react", "EVOLVES_INTO"], ["rsc", "next13", "INFLUENCE"],
  ["islands", "html5", "DEPENDS_ON"],
  ["htmx", "html", "DEPENDS_ON"], ["htmx", "ajax", "EVOLVES_INTO"],
  ["unjs", "nuxt3", "INFLUENCE"], ["unjs", "node", "DEPENDS_ON"],
  ["denodeploy", "deno", "EVOLVES_INTO"], ["denodeploy", "edgefunc", "DEPENDS_ON"],
  ["webcontainer", "node", "EVOLVES_INTO"], ["webcontainer", "wasm", "DEPENDS_ON"],
  ["turbopack", "webpack", "EVOLVES_INTO"], ["turbopack", "rust", "INFLUENCE"],
  ["parcel2", "parcel", "EVOLVES_INTO"], ["parcel2", "swc", "DEPENDS_ON"],
  ["fresh", "deno", "DEPENDS_ON"], ["fresh", "islands", "INFLUENCE"],


].map(([s, t, type]) => ({ s, t, type }));

/* ── NARRATIVES ─────────────────────────────── */
const NARRATIVES = [
  {
    id: "react-birth", titre: "Comment est né React ?", desc: "Du DOM manipulé à la main au Virtual DOM révolutionnaire.",
    steps: [
      { id: "html", note: "Tout commence avec HTML. La page est statique." },
      { id: "js", note: "JavaScript apporte l'interactivité. Mais manipuler le DOM est lent et fragile." },
      { id: "ajax", note: "AJAX permet des mises à jour partielles. Gmail et Google Maps révèlent le potentiel." },
      { id: "jq", note: "jQuery simplifie tout, mais les apps grossissent et le code devient ingérable." },
      { id: "bb", note: "Backbone.js tente de structurer avec MVC côté client." },
      { id: "ang", note: "AngularJS chez Google introduit le data-binding bidirectionnel en 2010." },
      { id: "react", note: "Facebook invente le Virtual DOM en 2013. Le composant devient la primitive universelle." },
    ]
  },
  {
    id: "cloud-rise", titre: "L'ascension du Cloud", desc: "Du serveur physique au serverless en 20 ans.",
    steps: [
      { id: "srv", note: "1990 : Tim Berners-Lee allume le premier serveur web. Un seul ordinateur." },
      { id: "linux", note: "Linux rend les serveurs accessibles à tous. 96% des serveurs web tourneront dessus." },
      { id: "apache", note: "Apache, logiciel libre, devient le serveur dominant sur Internet." },
      { id: "broad", note: "Le haut-débit rend les échanges massifs possibles. Internet change de dimension." },
      { id: "aws", note: "Amazon invente le cloud en 2006 : louer un serveur à la demande, à la minute." },
      { id: "docker", note: "Docker empaquète les apps. Le déploiement devient reproductible partout." },
      { id: "k8s", note: "Kubernetes orchestre des milliers de conteneurs. Google open-source sa magie interne." },
      { id: "srvless", note: "Serverless : plus aucun serveur à gérer. Payer à la milliseconde d'exécution." },
    ]
  },
  {
    id: "web-security", titre: "La guerre de la sécurité", desc: "Comment le Web a appris à chiffrer et se protéger.",
    steps: [
      { id: "crypto", note: "1976 : Diffie et Hellman inventent la cryptographie à clé publique. Révolution." },
      { id: "fw", note: "1988 : le premier vers Morris frappe Internet. Le firewall naît de la panique." },
      { id: "ssl", note: "Netscape invente SSL en 1995 pour sécuriser les paiements en ligne." },
      { id: "https", note: "HTTP + SSL = HTTPS. Le cadenas vert naît. Le Web devient commercialement viable." },
      { id: "auth", note: "Sessions et cookies standardisent l'authentification. L'identité en ligne existe." },
      { id: "vpn", note: "Le VPN chiffre toute la connexion. D'abord entreprise, puis grand public." },
    ]
  },
  {
    id: "open-web", titre: "Le Web ouvert", desc: "La philosophie open source qui a construit Internet.",
    steps: [
      { id: "os", note: "1998 : le mouvement Open Source est officiellement nommé." },
      { id: "linux", note: "Linux est la cathédrale du libre. 96% des serveurs, tous les supercalculateurs." },
      { id: "apache", note: "Apache, logiciel libre, devient le serveur dominant. LAMP naît." },
      { id: "ff", note: "Firefox brise le monopole d'Internet Explorer. 100M de téléchargements en un an." },
      { id: "wp", note: "WordPress propulse 43% du Web mondial en open source. Quiconque peut publier." },
      { id: "gh", note: "GitHub devient la mémoire collective du code. 100 millions de développeurs." },
    ]
  },
  {
    id: "mobile-rev", titre: "La révolution mobile", desc: "Comment l'iPhone a recréé le Web.",
    steps: [
      { id: "iphone", note: "9 janvier 2007. Steve Jobs présente l'iPhone. Flash est condamné à mort." },
      { id: "html5", note: "HTML5 répond à la mort de Flash : vidéo, audio, canvas natifs dans le navigateur." },
      { id: "css3", note: "CSS3 apporte animations et flexbox. Flash devient définitivement inutile." },
      { id: "rwd", note: "Ethan Marcotte invente le Responsive Design en 2010. Un site, tous les écrans." },
      { id: "ipad", note: "L'iPad crée une troisième catégorie. Les breakpoints responsive se multiplient." },
      { id: "pwa", note: "Les Progressive Web Apps font de chaque site une app installable." },
    ]
  },
  {
    id: "api-economy", titre: "L'économie des APIs", desc: "Comment les APIs ont fragmenté et unifié le Web.",
    steps: [
      { id: "ajax", note: "XMLHttpRequest permet les premières requêtes asynchrones depuis le navigateur." },
      { id: "api", note: "Le concept d'API Web s'impose avec les premiers services tiers." },
      { id: "rest", note: "Roy Fielding formalise REST en 2000. GET/POST/PUT/DELETE universalisés." },
      { id: "json", note: "JSON remplace XML. Léger, lisible, natif JavaScript. Format quasi-universel." },
      { id: "node", note: "Node.js exécute JavaScript côté serveur. Le plein-stack JS devient possible." },
      { id: "gql", note: "GraphQL de Facebook : demander exactement ce qu'on veut, rien de plus." },
    ]
  },
];

/* ── GRAPH INDEX ────────────────────────────── */
const nodeMap = {};
NODES.forEach(n => nodeMap[n.id] = n);

// adjacency: id → [{node, edge, dir:'out'|'in'}]
const ADJ = {};
NODES.forEach(n => ADJ[n.id] = []);
EDGES.forEach(e => {
  const sn = nodeMap[e.s], tn = nodeMap[e.t];
  if (!sn || !tn) return;
  ADJ[e.s].push({ node: tn, edge: e, dir: 'out' });
  ADJ[e.t].push({ node: sn, edge: e, dir: 'in' });
});

/* ── LAYOUT ─────────────────────────────────── */
function computeLayout() {
  // Group by (cat, annee)
  const groups = {};
  NODES.forEach(n => {
    const k = n.cat + '_' + n.annee;
    if (!groups[k]) groups[k] = [];
    groups[k].push(n);
  });
  NODES.forEach(n => {
    n._wx = xY(n.annee);
    n._wy = CATS[n.cat].ly * WH;
  });
  Object.values(groups).forEach(g => {
    if (g.length <= 1) return;
    const sp = 32;
    g.forEach((n, i) => { n._wy += (i - (g.length - 1) / 2) * sp; });
  });
}
computeLayout();

/* ── CAMERA ─────────────────────────────────── */
let W = window.innerWidth, H = window.innerHeight;
const cam = { cx: WW / 2, cy: WH / 2, scale: .18 };

function w2s(wx, wy) {
  return { sx: (wx - cam.cx) * cam.scale + W / 2, sy: (wy - cam.cy) * cam.scale + H / 2 };
}
function s2w(sx, sy) {
  return { wx: (sx - W / 2) / cam.scale + cam.cx, wy: (sy - H / 2) / cam.scale + cam.cy };
}

// Animation
let camAnim = null;
function flyTo(wx, wy, sc, dur = 650) {
  const sx0 = cam.cx, sy0 = cam.cy, ss0 = cam.scale;
  const sc1 = sc || Math.max(cam.scale, 1.2);
  const t0 = performance.now();
  function ease(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  if (camAnim) cancelAnimationFrame(camAnim);
  function step(now) {
    const t = Math.min(1, (now - t0) / dur);
    const e = ease(t);
    cam.cx = sx0 + (wx - sx0) * e;
    cam.cy = sy0 + (wy - sy0) * e;
    cam.scale = ss0 + (sc1 - ss0) * e;
    dirty = true;
    if (t < 1) camAnim = requestAnimationFrame(step);
    else camAnim = null;
  }
  camAnim = requestAnimationFrame(step);
}
function zoomFit() {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  NODES.forEach(n => { x0 = Math.min(x0, n._wx); x1 = Math.max(x1, n._wx); y0 = Math.min(y0, n._wy); y1 = Math.max(y1, n._wy); });
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const sc = Math.min((W - 140) / (x1 - x0 + 300), (H - 140) / (y1 - y0 + 200), .5);
  flyTo(cx, cy, sc, 700);
}
function zoomAt(sx, sy, factor) {
  const { wx, wy } = s2w(sx, sy);
  cam.scale = Math.max(.08, Math.min(5, cam.scale * factor));
  cam.cx = wx - (sx - W / 2) / cam.scale;
  cam.cy = wy - (sy - H / 2) / cam.scale;
  dirty = true;
}

/* ── RENDER STATE ───────────────────────────── */
let dirty = true, renderMode = 'map', selectedNode = null;
let hoveredNode = null, showEdges = true, showLabels = true;
let activeNarrative = null, activeStep = -1;
let activeEdgeFilters = new Set(['INFLUENCE', 'DEPENDS_ON', 'REPLACED_BY', 'EVOLVES_INTO', 'STANDARDISATION', 'CONCURRENCE']);

const canvas = document.getElementById('cv');
const ctx = canvas.getContext('2d');
const mmc = document.getElementById('mmc');
const mmctx = mmc.getContext('2d');

function setSize() { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; dirty = true; }
setSize();

let _raf = null;
function schedRender() { if (!_raf) _raf = requestAnimationFrame(() => { _raf = null; render(); }); }
function setDirty() { dirty = true; schedRender(); }

/* ── MAIN RENDER ────────────────────────────── */
function render() {
  ctx.clearRect(0, 0, W, H);
  if (renderMode === 'constellation' && selectedNode) renderConstellation();
  else renderMap();
  renderMinimap();
}

/* ── MAP RENDER ─────────────────────────────── */
function renderMap() {
  drawGrid();
  drawLanes();
  if (showEdges && cam.scale > .15) drawEdges();
  if (activeNarrative && activeStep >= 0) drawNarrPath();
  drawNodes();
  if (showLabels || cam.scale > .3) drawLabels();
}

function drawGrid() {
  const sc = cam.scale;
  for (let yr = 1970; yr <= 2020; yr += 5) {
    const { sx } = w2s(xY(yr), 0);
    if (sx < -10 || sx > W + 10) continue;
    ctx.beginPath(); ctx.moveTo(sx, 56); ctx.lineTo(sx, H - 52);
    ctx.strokeStyle = yr % 10 === 0 ? 'rgba(26, 74, 106, .18)' : 'rgba(14, 42, 70, .1)';
    ctx.lineWidth = yr % 10 === 0 ? 1 : .5;
    ctx.setLineDash([]); ctx.stroke();
    if (yr % 10 === 0 && sc > .12) {
      ctx.font = '9px IBM Plex Mono'; ctx.fillStyle = 'rgba(26, 74, 106, .5)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(yr, sx, H - 54);
    }
  }
}

function drawLanes() {
  Object.entries(CATS).forEach(([cat, def]) => {
    const cy = def.ly * WH, bh = 70;
    const { sy: y0 } = w2s(0, cy - bh / 2);
    const { sy: y1 } = w2s(0, cy + bh / 2);
    ctx.fillStyle = def.color + '09';
    ctx.fillRect(0, y0, W, y1 - y0);
    // Lane label
    if (cam.scale > .25 && y0 > 56 && y1 < H - 52) {
      const ly = (y0 + y1) / 2;
      ctx.font = '8px IBM Plex Mono'; ctx.fillStyle = def.color + '55';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(cat, 68, ly);
    }
  });
}

function getQuadraticBezierPoint(t, x1, y1, cx, cy, x2, y2) {
  const mt = 1 - t;
  return {
    x: mt * mt * x1 + 2 * mt * t * cx + t * t * x2,
    y: mt * mt * y1 + 2 * mt * t * cy + t * t * y2
  };
}

function drawEdges() {
  const sc = cam.scale;
  const alpha = Math.min(1, Math.max(.1, (sc - .15) / .8));
  const time = performance.now();

  EDGES.forEach(e => {
    if (!activeEdgeFilters.has(e.type)) return;
    const sn = nodeMap[e.s], tn = nodeMap[e.t];
    if (!sn || !tn) return;
    const { sx: x1, sy: y1 } = w2s(sn._wx, sn._wy);
    const { sx: x2, sy: y2 } = w2s(tn._wx, tn._wy);

    // Skip offscreen
    if ((x1 < -50 && x2 < -50) || (x1 > W + 50 && x2 > W + 50)) return;
    if ((y1 < 40 && y2 < 40) || (y1 > H - 40 && y2 > H - 40)) return;

    const et = ET[e.type];
    if (!et) return;

    const isHov = hoveredNode && (hoveredNode.id === sn.id || hoveredNode.id === tn.id);
    const isNar = activeNarrative && activeStep >= 0;
    const narIds = isNar ? activeNarrative.steps.map(s => s.id) : [];
    const isNarEdge = narIds.includes(sn.id) && narIds.includes(tn.id);

    let a = isHov ? .8 : isNarEdge ? .5 : (alpha * .12);

    // Animations modifications to alpha
    if (et.animType === 'pulse') {
      const pulseFactor = 0.5 + 0.5 * Math.sin(time / 200);
      a = Math.max(0.15, a * (0.4 + pulseFactor * 0.6));
    }

    let mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 20;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.strokeStyle = et.color + hexA(a);
    ctx.lineWidth = isHov ? et.w * 2 : Math.max(1, et.w * (sc > .6 ? 1.2 : .9));

    if (et.animType === 'dashFlow') {
      ctx.setLineDash(et.dash);
      ctx.lineDashOffset = -(time * Math.abs(et.speed)) / 1000;
    } else {
      ctx.setLineDash(isHov ? [] : et.dash);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw particles
    if (et.animType === 'particles') {
      const numParticles = 1;
      const tBase = (time / (2000 / et.speed)) % 1;
      ctx.fillStyle = et.color + hexA(isHov ? 0.9 : 0.6);
      for (let i = 0; i < numParticles; i++) {
        const t = (tBase + i / numParticles) % 1;
        const pt = getQuadraticBezierPoint(t, x1, y1, mx, my, x2, y2);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isHov ? 3 : 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (et.animType === 'pingPong') {
      const tBase = (time / 2500) % 1;
      ctx.fillStyle = et.color + hexA(isHov ? 0.9 : 0.6);

      const pt1 = getQuadraticBezierPoint(tBase, x1, y1, mx, my, x2, y2);
      const pt2 = getQuadraticBezierPoint(1 - tBase, x1, y1, mx, my, x2, y2);

      ctx.beginPath();
      ctx.arc(pt1.x, pt1.y, isHov ? 3.5 : 2.2, 0, Math.PI * 2);
      ctx.arc(pt2.x, pt2.y, isHov ? 3.5 : 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Arrow for replacement/evolution
    if ((e.type === 'REPLACED_BY' || e.type === 'EVOLVES_INTO') && isHov) {
      drawArrow(x1, y1, x2, y2, et.color + hexA(a), 6);
    }
  });
}

function drawArrow(x1, y1, x2, y2, col, sz) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return;
  const nx = dx / len, ny = dy / len;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - sz * nx + sz * .45 * ny, y2 - sz * ny - sz * .45 * nx);
  ctx.lineTo(x2 - sz * nx - sz * .45 * ny, y2 - sz * ny + sz * .45 * nx);
  ctx.closePath(); ctx.fillStyle = col; ctx.fill();
}

function drawNarrPath() {
  if (!activeNarrative) return;
  const ids = activeNarrative.steps.map(s => s.id);
  for (let i = 0; i < ids.length - 1; i++) {
    const a = nodeMap[ids[i]], b = nodeMap[ids[i + 1]];
    if (!a || !b) continue;
    const { sx: x1, sy: y1 } = w2s(a._wx, a._wy);
    const { sx: x2, sy: y2 } = w2s(b._wx, b._wy);
    const active = i === activeStep || i === activeStep - 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = active ? 'rgba(26, 122, 204, .7)' : 'rgba(26, 74, 106, .3)';
    ctx.lineWidth = active ? 2 : 1;
    ctx.setLineDash(active ? [] : [4, 6]); ctx.stroke(); ctx.setLineDash([]);
  }
}

function drawNodes() {
  const sc = cam.scale;
  NODES.forEach(n => {
    const { sx, sy } = w2s(n._wx, n._wy);
    if (sx < -30 || sx > W + 30 || sy < 30 || sy > H - 30) return;
    const col = CATS[n.cat].color;
    const isHov = hoveredNode && hoveredNode.id === n.id;
    const isSel = selectedNode && selectedNode.id === n.id;
    const isNar = activeNarrative && activeNarrative.steps.some(s => s.id === n.id);
    const isNarAct = activeNarrative && activeNarrative.steps[activeStep] && activeNarrative.steps[activeStep].id === n.id;
    const r = isNarAct ? 7 : isHov || isSel ? 5.5 : Math.max(2.5, 3.5 * Math.min(sc / .3, 1));
    // Glow rings
    if (isHov || isSel || isNarAct) {
      [r + 7, r + 14, r + 22].forEach((gr, gi) => {
        ctx.beginPath(); ctx.arc(sx, sy, gr, 0, Math.PI * 2);
        ctx.strokeStyle = col + ['33', '22', '11'][gi]; ctx.lineWidth = 1; ctx.stroke();
      });
    }
    // Node
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
    if (isHov || isSel || isNarAct) {
      ctx.fillStyle = col;
    } else if (isNar) {
      ctx.fillStyle = col + 'cc';
    } else {
      ctx.fillStyle = col + (activeNarrative ? '44' : '99');
    }
    ctx.fill();
    // Inner dot
    if (r > 4) {
      ctx.beginPath(); ctx.arc(sx, sy, r * .4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(3, 6, 10, .6)'; ctx.fill();
    }
  });
}

function drawLabels() {
  const sc = cam.scale;
  if (sc < .15) return;
  ctx.save();
  NODES.forEach(n => {
    const { sx, sy } = w2s(n._wx, n._wy);
    if (sx < -80 || sx > W + 80 || sy < 30 || sy > H - 30) return;
    const col = CATS[n.cat].color;
    const isHov = hoveredNode && hoveredNode.id === n.id;
    const isSel = selectedNode && selectedNode.id === n.id;
    const isNar = activeNarrative && activeNarrative.steps.some(s => s.id === n.id);
    const isNarAct = activeNarrative && activeNarrative.steps[activeStep] && activeNarrative.steps[activeStep].id === n.id;
    const r = isHov || isSel ? 5.5 : 3.5;
    const lx = sx + (sx > W / 2 ? -(r + 8) : (r + 8));
    const align = sx > W / 2 ? 'right' : 'left';
    const fs = Math.min(13, Math.max(9, 11 * sc));
    if (sc < .25 && !isHov && !isSel && !isNar) return;
    ctx.textAlign = align; ctx.textBaseline = 'middle';
    let alpha = 1;
    if (activeNarrative && !isNar && !isHov && !isSel) alpha = .2;
    ctx.font = (isHov || isSel || isNarAct ? '500' : '400') + ` ${isHov || isSel ? fs + 1 : fs}px IBM Plex Mono`;
    ctx.fillStyle = col + hexA(alpha * (isHov || isSel || isNarAct ? 1 : .75));
    ctx.fillText(n.nom, lx, sy);
    if (sc > .55 && (isHov || isSel)) {
      ctx.font = `300 ${Math.max(8, fs - 3)}px IBM Plex Mono`;
      ctx.fillStyle = col + '66';
      ctx.fillText(n.annee + ' · ' + n.cat, lx, sy + fs + 2);
    }
  });
  ctx.restore();
}

/* ── CONSTELLATION ──────────────────────────── */
let constAngle = 0;
function renderConstellation() {
  constAngle += .004;
  dirty = true;
  const cx = W / 2, cy = H / 2;
  const conns = ADJ[selectedNode.id];
  const col = CATS[selectedNode.cat].color;
  const time = performance.now();
  // Background
  ctx.fillStyle = 'rgba(3, 6, 10, .08)';
  ctx.fillRect(0, 0, W, H);
  // Orbital grid
  [160, 260, 360].forEach((r, i) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(26, 74, 106,' + ['.08', '.05', '.03'][i] + ')';
    ctx.lineWidth = 1; ctx.setLineDash([3, 8]); ctx.stroke(); ctx.setLineDash([]);
  });
  // Group connections by type for sector layout
  const byType = {};
  conns.forEach(c => {
    const t = c.edge.type;
    if (!byType[t]) byType[t] = [];
    byType[t].push(c);
  });
  const positions = [];
  const typeOrder = ['EVOLVES_INTO', 'INFLUENCE', 'DEPENDS_ON', 'REPLACED_BY', 'STANDARDISATION', 'CONCURRENCE'];
  const radii = [180, 260, 340];
  let orbit = 0;
  typeOrder.forEach(type => {
    const cs = byType[type] || [];
    if (!cs.length) return;
    const r = radii[Math.min(orbit, radii.length - 1)];
    const dir = orbit % 2 === 0 ? 1 : -1;
    cs.forEach((c, i) => {
      const baseAngle = (i / cs.length) * Math.PI * 2 + (orbit * Math.PI * .6);
      const a = baseAngle + constAngle * dir * .5;
      positions.push({ sx: cx + Math.cos(a) * r, sy: cy + Math.sin(a) * r, conn: c, type });
    });
    orbit++;
  });
  // Draw edges
  positions.forEach(p => {
    if (!activeEdgeFilters.has(p.type)) return;
    const et = ET[p.type];
    if (!et) return;

    let a = 0.33;
    if (et.animType === 'pulse') {
      const pulseFactor = 0.5 + 0.5 * Math.sin(time / 500);
      a = 0.2 + pulseFactor * 0.5;
    }

    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.sx, p.sy);
    ctx.strokeStyle = et.color + hexA(a); ctx.lineWidth = 1;

    if (et.animType === 'dashFlow') {
      ctx.setLineDash(et.dash);
      ctx.lineDashOffset = (time * et.speed) / 1000;
    } else {
      ctx.setLineDash(et.dash);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Draw particles
    if (et.animType === 'particles') {
      const numParticles = 2;
      const tBase = (time / 1500) % 1;
      ctx.fillStyle = et.color + 'aa';
      for (let i = 0; i < numParticles; i++) {
        const t = (tBase + i / numParticles) % 1;
        const px = cx + (p.sx - cx) * t;
        const py = cy + (p.sy - cy) * t;
        ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
      }
    } else if (et.animType === 'pingPong') {
      const tBase = (time / 2000) % 1;
      ctx.fillStyle = et.color + 'aa';
      const px1 = cx + (p.sx - cx) * tBase;
      const py1 = cy + (p.sy - cy) * tBase;
      const px2 = cx + (p.sx - cx) * (1 - tBase);
      const py2 = cy + (p.sy - cy) * (1 - tBase);
      ctx.beginPath();
      ctx.arc(px1, py1, 2.2, 0, Math.PI * 2);
      ctx.arc(px2, py2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  // Draw orbiting nodes
  positions.forEach(p => {
    const nc = CATS[p.conn.node.cat].color;
    const et = ET[p.type];
    const isHov = hoveredNode && hoveredNode.id === p.conn.node.id;
    const r = isHov ? 8 : 5;
    if (isHov) {
      [r + 6, r + 12].forEach((gr, gi) => {
        ctx.beginPath(); ctx.arc(p.sx, p.sy, gr, 0, Math.PI * 2);
        ctx.strokeStyle = nc + ['33', '18'][gi]; ctx.lineWidth = 1; ctx.stroke();
      });
    }
    ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
    ctx.fillStyle = isHov ? nc : nc + 'cc'; ctx.fill();
    // Label
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.font = `${isHov ? '500' : '400'} 10px IBM Plex Mono`;
    ctx.fillStyle = nc + (isHov ? 'ff' : 'cc');
    ctx.fillText(p.conn.node.nom, p.sx, p.sy + r + 5);
    // Edge type
    ctx.font = '7.5px IBM Plex Mono';
    ctx.fillStyle = et.color + '88';
    ctx.fillText(p.dir === 'out' ? et.label : '← ' + et.label, p.sx, p.sy + r + 17);
  });
  // Central node
  [22, 32, 44, 60].forEach((r, i) => {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = col + ['33', '28', '18', '0c'][i]; ctx.lineWidth = 1; ctx.stroke();
  });
  ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = col + '22'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fillStyle = col; ctx.fill();
  // Central label
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.font = '500 15px IBM Plex Mono';
  ctx.fillStyle = col; ctx.fillText(selectedNode.nom, cx, cy + 22);
  ctx.font = '9px IBM Plex Mono';
  ctx.fillStyle = col + 'aa'; ctx.fillText(selectedNode.annee + ' · ' + selectedNode.cat, cx, cy + 39);
}

/* ── MINIMAP ────────────────────────────────── */
const MMW = 178, MMH = 58, MMPad = 8;
function renderMinimap() {
  mmctx.clearRect(0, 0, MMW, MMH);
  mmctx.fillStyle = 'rgba(3, 6, 10, .5)'; mmctx.fillRect(0, 0, MMW, MMH);
  const sx = wx => MMPad + (wx / WW) * (MMW - MMPad * 2);
  const sy = wy => MMPad + (wy / WH) * (MMH - MMPad * 2);
  // Nodes
  NODES.forEach(n => {
    const col = CATS[n.cat].color;
    mmctx.beginPath(); mmctx.arc(sx(n._wx), sy(n._wy), 1.5, 0, Math.PI * 2);
    mmctx.fillStyle = col + 'cc'; mmctx.fill();
  });
  // Viewport rect
  const { wx: vx0, wy: vy0 } = s2w(0, 56);
  const { wx: vx1, wy: vy1 } = s2w(W, H - 52);
  const rx = sx(vx0), ry = sy(vy0), rw = sx(vx1) - rx, rh = sy(vy1) - ry;
  mmctx.strokeStyle = 'rgba(26, 122, 204, .7)'; mmctx.lineWidth = 1;
  mmctx.strokeRect(Math.max(0, rx), Math.max(0, ry), Math.min(rw, MMW - rx), Math.min(rh, MMH - ry));
}

/* ── HIT TEST ───────────────────────────────── */
function hitNode(mx, my) {
  if (renderMode === 'constellation') {
    // Check orbiting nodes
    const cx = W / 2, cy = H / 2;
    const conns = ADJ[selectedNode.id];
    const byType = {};
    conns.forEach(c => { const t = c.edge.type; if (!byType[t]) byType[t] = []; byType[t].push(c); });
    const typeOrder = ['EVOLVES_INTO', 'INFLUENCE', 'DEPENDS_ON', 'REPLACED_BY', 'STANDARDISATION', 'CONCURRENCE'];
    const radii = [180, 260, 340]; let orbit = 0;
    for (const type of typeOrder) {
      const cs = byType[type] || []; if (!cs.length) continue;
      const r = radii[Math.min(orbit, radii.length - 1)];
      const dir = orbit % 2 === 0 ? 1 : -1;
      for (let i = 0; i < cs.length; i++) {
        const baseAngle = (i / cs.length) * Math.PI * 2 + (orbit * Math.PI * .6);
        const a = baseAngle + constAngle * dir * .5;
        const nx = W / 2 + Math.cos(a) * r, ny = H / 2 + Math.sin(a) * r;
        if ((mx - nx) ** 2 + (my - ny) ** 2 < 400) return cs[i].node;
      }
      orbit++;
    }
    return null;
  }
  // Map mode
  let closest = null, minD = 400;
  NODES.forEach(n => {
    const { sx, sy } = w2s(n._wx, n._wy);
    const d = (mx - sx) ** 2 + (my - sy) ** 2;
    if (d < minD) { minD = d; closest = n; }
    // Label hit area
    const r = 5.5, lx = sx + (sx > W / 2 ? -(r + 8) : (r + 8));
    const la = sx > W / 2 ? lx - 100 : lx, lb = sx > W / 2 ? lx : lx + 100;
    if (mx >= la && mx <= lb && Math.abs(my - sy) < 10 && d > minD + 50) closest = n;
  });
  return closest;
}

/* ── SEARCH ─────────────────────────────────── */
const siEl = document.getElementById('si');
const srEl = document.getElementById('sr');
let srIdx = -1, srResults = [];

function doSearch(q) {
  if (!q || q.length < 2) { srEl.classList.remove('on'); srResults = []; return; }
  const lq = q.toLowerCase();
  srResults = NODES.filter(n =>
    n.nom.toLowerCase().includes(lq) ||
    n.simple.toLowerCase().includes(lq) ||
    n.cat.toLowerCase().includes(lq) ||
    String(n.annee).includes(lq)
  ).slice(0, 8);
  srIdx = -1; renderSR();
}
function renderSR() {
  if (!srResults.length) { srEl.classList.remove('on'); return; }
  srEl.innerHTML = srResults.map((n, i) => `
    <div class="sri${i === srIdx ? ' ak' : ''}" data-id="${n.id}" role="option">
      <div class="sri-dot" style="background:${CATS[n.cat].color}"></div>
      <span class="sri-n">${n.nom}</span>
      <span class="sri-y">${n.annee}</span>
      <span class="sri-c" style="color:${CATS[n.cat].color}88">${n.cat}</span>
    </div>`).join('');
  srEl.classList.add('on');
  srEl.querySelectorAll('.sri').forEach(el => {
    el.addEventListener('click', () => {
      const n = nodeMap[el.dataset.id];
      if (n) { selectSR(n); }
    });
  });
}
function selectSR(n) {
  siEl.value = ''; srEl.classList.remove('on'); srResults = [];
  flyTo(n._wx, n._wy, 1.8);
  setTimeout(() => { openDetail(n); }, 400);
}
siEl.addEventListener('input', e => doSearch(e.target.value));
siEl.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { srIdx = Math.min(srIdx + 1, srResults.length - 1); renderSR(); }
  else if (e.key === 'ArrowUp') { srIdx = Math.max(srIdx - 1, -1); renderSR(); }
  else if (e.key === 'Enter' && srIdx >= 0) { selectSR(srResults[srIdx]); }
  else if (e.key === 'Escape') { srEl.classList.remove('on'); siEl.blur(); }
});
siEl.addEventListener('blur', () => setTimeout(() => srEl.classList.remove('on'), 200));

/* ── TOOLTIP ─────────────────────────────────── */
const ttEl = document.getElementById('tt');
function showTT(n, mx, my) {
  const col = CATS[n.cat].color;
  document.getElementById('tt-n').textContent = n.nom;
  document.getElementById('tt-n').style.color = col;
  document.getElementById('tt-m').textContent = n.annee + ' · ' + n.cat;
  document.getElementById('tt-d').textContent = n.simple;
  let tx = mx + 14, ty = my - 12;
  if (tx + 240 > W) tx = mx - 246;
  if (ty + 130 > H - 52) ty = my - 130;
  ttEl.style.left = tx + 'px'; ttEl.style.top = ty + 'px';
  ttEl.style.opacity = '1';
}
function hideTT() { ttEl.style.opacity = '0'; }

/* ── DETAIL PANEL ───────────────────────────── */
const dpEl = document.getElementById('dp');
function openDetail(n) {
  selectedNode = n;
  const col = CATS[n.cat].color;
  document.getElementById('dp-y').textContent = n.annee;
  document.getElementById('dp-n').textContent = n.nom;
  document.getElementById('dp-n').style.color = col;
  document.getElementById('dp-c').textContent = n.cat;
  document.getElementById('dp-c').style.color = col + 'bb';
  // Body
  const body = document.getElementById('dp-body');
  const rels = ADJ[n.id];
  body.innerHTML = `
    <div class="dp-lbl">En bref</div>
    <div class="dp-sm">${n.simple}</div>
    <div class="dp-pr">${n.precise}</div>
    <div class="dp-lbl">Connexions (${rels.length})</div>
    <div class="dp-rels">${rels.map(c => {
    const et = ET[c.edge.type];
    const lbl = c.dir === 'out' ? et.label : '← ' + et.label;
    return `<div class="dp-rel" data-id="${c.node.id}">
        <span class="dp-rb" style="color:${et.color};border-color:${et.color}44;background:${et.color}11">${lbl}</span>
        <span class="dp-rn">${c.node.nom}</span>
        <span class="dp-rel-arrow" style="color:${CATS[c.node.cat].color}88">· ${c.node.annee}</span>
      </div>`;
  }).join('')}</div>`;
  body.querySelectorAll('.dp-rel').forEach(el => {
    el.addEventListener('click', () => {
      const nn = nodeMap[el.dataset.id];
      if (nn) { flyTo(nn._wx, nn._wy, 1.8); openDetail(nn); }
    });
  });
  dpEl.classList.add('on');
  dirty = true; schedRender();
}
function closeDetail() {
  dpEl.classList.remove('on');
  selectedNode = null;
  if (renderMode === 'constellation') exitConstellation();
  dirty = true; schedRender();
}
document.getElementById('dp-x').addEventListener('click', closeDetail);
document.getElementById('dp-const').addEventListener('click', () => {
  if (!selectedNode) return;
  enterConstellation(selectedNode);
});
document.getElementById('dp-story').addEventListener('click', () => {
  if (!selectedNode) return;
  const st = NARRATIVES.find(n => n.steps.some(s => s.id === selectedNode.id));
  if (st) openNarrative(st);
  else openNarrPanel();
});

/* ── CONSTELLATION MODE ─────────────────────── */
function enterConstellation(n) {
  selectedNode = n; renderMode = 'constellation';
  document.getElementById('csh').classList.add('on');
  constAngle = 0;
}
function exitConstellation() {
  renderMode = 'map';
  document.getElementById('csh').classList.remove('on');
}

/* ── NARRATIVE PANEL ────────────────────────── */
const npEl = document.getElementById('np');
const btnNar = document.getElementById('btn-nar');
function openNarrPanel() {
  npEl.classList.add('on');
  btnNar.classList.add('hide');
  btnNar.setAttribute('aria-expanded', 'true');
}
function closeNarrPanel() {
  npEl.classList.remove('on');
  btnNar.classList.remove('hide');
  btnNar.setAttribute('aria-expanded', 'false');
}
btnNar.addEventListener('click', openNarrPanel);
document.getElementById('np-x').addEventListener('click', closeNarrPanel);

// Populate narrative list
const npList = document.getElementById('np-list');
NARRATIVES.forEach(nar => {
  const div = document.createElement('div');
  div.className = 'np-st'; div.innerHTML = `
    <div class="np-st-t">${nar.titre}</div>
    <div class="np-st-d">${nar.desc}</div>
    <div class="np-st-c">${nar.steps.length} étapes</div>`;
  div.addEventListener('click', () => openNarrative(nar));
  npList.appendChild(div);
});

function openNarrative(nar) {
  activeNarrative = nar; activeStep = 0;
  // Mark active in list
  npList.querySelectorAll('.np-st').forEach((el, i) => el.classList.toggle('ak', NARRATIVES[i].id === nar.id));
  // Show steps
  const stepsEl = document.getElementById('nsteps');
  document.getElementById('ns-t').textContent = nar.titre;
  const nsList = document.getElementById('ns-list');
  nsList.innerHTML = nar.steps.map((s, i) => {
    const n = nodeMap[s.id]; if (!n) return '';
    const col = CATS[n.cat].color;
    return `<div class="ns-s${i === 0 ? ' ak' : ''}" data-idx="${i}">
      <span class="ns-n">${i + 1}</span>
      <div><div class="ns-nm" style="color:${col}">${n.nom}</div><div class="ns-nt">${s.note}</div></div>
    </div>`;
  }).join('');
  stepsEl.classList.add('on');
  openNarrPanel();
  updateNarrNav();
  flyToStep(0);
  nsList.querySelectorAll('.ns-s').forEach(el => {
    el.addEventListener('click', () => {
      const i = +el.dataset.idx; activeStep = i;
      nsList.querySelectorAll('.ns-s').forEach((e, j) => e.classList.toggle('ak', j === i));
      updateNarrNav(); flyToStep(i); dirty = true; schedRender();
    });
  });
  dirty = true; schedRender();
}

function flyToStep(i) {
  const s = activeNarrative.steps[i]; if (!s) return;
  const n = nodeMap[s.id]; if (!n) return;
  flyTo(n._wx, n._wy, Math.max(cam.scale, 1.4));
}

function updateNarrNav() {
  document.getElementById('ns-prev').disabled = activeStep <= 0;
  document.getElementById('ns-next').disabled = activeStep >= activeNarrative.steps.length - 1;
}

document.getElementById('ns-prev').addEventListener('click', () => {
  if (activeStep > 0) {
    activeStep--;
    const els = document.getElementById('ns-list').querySelectorAll('.ns-s');
    els.forEach((e, j) => e.classList.toggle('ak', j === activeStep));
    updateNarrNav(); flyToStep(activeStep); dirty = true; schedRender();
  }
});
document.getElementById('ns-next').addEventListener('click', () => {
  if (activeStep < activeNarrative.steps.length - 1) {
    activeStep++;
    const els = document.getElementById('ns-list').querySelectorAll('.ns-s');
    els.forEach((e, j) => e.classList.toggle('ak', j === activeStep));
    updateNarrNav(); flyToStep(activeStep); dirty = true; schedRender();
  }
});
document.getElementById('ns-exit').addEventListener('click', () => {
  activeNarrative = null; activeStep = -1;
  document.getElementById('nsteps').classList.remove('on');
  npList.querySelectorAll('.np-st').forEach(el => el.classList.remove('ak'));
  dirty = true; schedRender();
});

/* ── TIMELINE ────────────────────────────────── */
const tlEl = document.getElementById('tl');
const decades = [1970, 1980, 1990, 2000, 2010, 2020, 2025, 2030];
decades.forEach(d => {
  const cnt = NODES.filter(n => n.annee >= d && n.annee < d + 10).length;
  const div = document.createElement('div');
  div.className = 'tl-d'; div.textContent = d + 's';
  div.innerHTML += `<span class="tl-year-count">${cnt} concepts</span>`;
  div.addEventListener('click', () => {
    document.querySelectorAll('.tl-d').forEach(el => el.classList.remove('ak'));
    div.classList.add('ak');
    const midYear = d + 5;
    const wx = xY(midYear);
    flyTo(wx, WH / 2, Math.max(.35, cam.scale));
  });
  tlEl.appendChild(div);
});

/* ── LEGEND ──────────────────────────────────── */

const legEl = document.getElementById('leg');
legEl.innerHTML = `
<div class="leg-g">
  <div class="leg-gt">Catégories</div>
  ${Object.entries(CATS).map(([k, v]) => `
    <div class="leg-i"><div class="leg-dot" style="background:${v.color}"></div>${k}</div>`).join('')}
</div>
<div class="leg-g">
  <div class="leg-gt">Relations</div>
  ${Object.entries(ET).map(([k, v]) => `
    <div class="leg-i leg-rel on" data-type="${k}" style="cursor:pointer" title="Filtrer ${v.label}">
      <div class="leg-ln" style="border-color:${v.color};border-style:${v.dash.length ? 'dashed' : 'solid'}"></div>
      <span>${v.label}</span>
    </div>`).join('')}
</div>`;

// Rendre cliquable
legEl.querySelectorAll('.leg-rel').forEach(el => {
  el.addEventListener('click', () => {
    const type = el.dataset.type;
    if (activeEdgeFilters.has(type)) {
      activeEdgeFilters.delete(type);
      el.classList.remove('on');
      el.style.opacity = '0.3';
    } else {
      activeEdgeFilters.add(type);
      el.classList.add('on');
      el.style.opacity = '1';
    }
    dirty = true; schedRender();
  });
});

/* ── EVENTS ──────────────────────────────────── */
// Wheel zoom
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.12 : .89;
  if (renderMode === 'constellation') {
    // Zoom noop in constellation
    return;
  }
  zoomAt(e.clientX, e.clientY, factor);
  schedRender();
}, { passive: false });

// Drag pan
let isDrag = false, dragSX = 0, dragSY = 0, dragCX = 0, dragCY = 0;
canvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  isDrag = true; dragSX = e.clientX; dragSY = e.clientY;
  dragCX = cam.cx; dragCY = cam.cy;
  canvas.classList.add('drag');
});
window.addEventListener('mouseup', () => { isDrag = false; canvas.classList.remove('drag'); });
window.addEventListener('mousemove', e => {
  if (isDrag) {
    if (renderMode === 'map') {
      cam.cx = dragCX - (e.clientX - dragSX) / cam.scale;
      cam.cy = dragCY - (e.clientY - dragSY) / cam.scale;
      dirty = true; schedRender();
    }
    return;
  }
  const n = hitNode(e.clientX, e.clientY);
  if (n) {
    if (!hoveredNode || hoveredNode.id !== n.id) { hoveredNode = n; dirty = true; schedRender(); }
    showTT(n, e.clientX, e.clientY);
    canvas.classList.add('hover');
  } else {
    if (hoveredNode) { hoveredNode = null; dirty = true; schedRender(); }
    hideTT(); canvas.classList.remove('hover');
  }
});
canvas.addEventListener('mouseleave', () => { hoveredNode = null; hideTT(); dirty = true; schedRender(); });

// Click
canvas.addEventListener('click', e => {
  if (Math.abs(e.clientX - dragSX) > 4 || Math.abs(e.clientY - dragSY) > 4) return;
  const n = hitNode(e.clientX, e.clientY);
  if (n) {
    if (renderMode === 'constellation') {
      // Navigate to clicked node
      exitConstellation();
      flyTo(n._wx, n._wy, 1.8);
      setTimeout(() => openDetail(n), 400);
    } else {
      flyTo(n._wx, n._wy, Math.max(cam.scale, 1.4));
      openDetail(n);
    }
  } else if (renderMode === 'map') {
    closeDetail();
  }
});

// Touch
let tch = { x: 0, y: 0, cx: 0, cy: 0, dist: 0, sc: 0 };
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    tch.x = e.touches[0].clientX; tch.y = e.touches[0].clientY; tch.cx = cam.cx; tch.cy = cam.cy;
  } else if (e.touches.length === 2) {
    tch.dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    tch.sc = cam.scale;
  }
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && renderMode === 'map') {
    cam.cx = tch.cx - (e.touches[0].clientX - tch.x) / cam.scale;
    cam.cy = tch.cy - (e.touches[0].clientY - tch.y) / cam.scale;
    dirty = true; schedRender();
  } else if (e.touches.length === 2) {
    const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    cam.scale = Math.max(.08, Math.min(5, tch.sc * (d / tch.dist)));
    dirty = true; schedRender();
  }
}, { passive: false });

// Keyboard
window.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== siEl) { e.preventDefault(); siEl.focus(); }
  if (e.key === 'Escape') {
    if (renderMode === 'constellation') { exitConstellation(); }
    else { closeDetail(); }
    srEl.classList.remove('on');
  }
  if (e.key === 'ArrowRight' && activeNarrative) document.getElementById('ns-next').click();
  if (e.key === 'ArrowLeft' && activeNarrative) document.getElementById('ns-prev').click();
});

// Header buttons
document.getElementById('btn-edges').addEventListener('click', function () {
  showEdges = !showEdges; this.classList.toggle('on', showEdges); dirty = true; schedRender();
});
document.getElementById('btn-labels').addEventListener('click', function () {
  showLabels = !showLabels; this.classList.toggle('on', showLabels); dirty = true; schedRender();
});

// Zoom buttons
document.getElementById('z-in').addEventListener('click', () => zoomAt(W / 2, H / 2, 1.35));
document.getElementById('z-out').addEventListener('click', () => zoomAt(W / 2, H / 2, .75));
document.getElementById('z-fit').addEventListener('click', zoomFit);

// Minimap click
document.getElementById('mm').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  const rx = (e.clientX - r.left) / MMW, ry = (e.clientY - r.top) / MMH;
  const wx = rx * WW, wy = ry * WH;
  cam.cx = wx; cam.cy = wy; dirty = true; schedRender();
});

// Resize
window.addEventListener('resize', () => { setSize(); schedRender(); });

/* ── UTIL ────────────────────────────────────── */
function hexA(a) {
  const v = Math.round(Math.max(0, Math.min(1, a)) * 255);
  return v.toString(16).padStart(2, '0');
}

/* ── INIT ────────────────────────────────────── */
const intro = document.getElementById('intro');
zoomFit();
setTimeout(() => {
  intro.style.opacity = '0';
  setTimeout(() => { intro.style.display = 'none'; }, 1200);
}, 2000);

// Global animation loop
function animationLoop() {
  const hasActiveAnim = showEdges && cam.scale > .15;
  if (hasActiveAnim) dirty = true;
  if (dirty) {
    dirty = false;
    ctx.clearRect(0, 0, W, H);
    if (renderMode === 'constellation' && selectedNode) renderConstellation();
    else renderMap();
    renderMinimap();
  }
  requestAnimationFrame(animationLoop);
}
requestAnimationFrame(animationLoop);
