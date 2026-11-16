# Portfolio de Konate Linsogui Bethel

Site web one-page : Finance Digitale, Fintech et Data Analysis. Aucun outil de compilation n'est nécessaire : ce sont des fichiers HTML, CSS et JavaScript simples.

## Contenu du dossier

```
portfolio-konate/
├── index.html                          La page (toutes les sections)
├── css/
│   └── style.css                       Design, thèmes clair/sombre, effets de survol, responsive
├── js/
│   └── main.js                         Thème, menu mobile, liste des certificats, formulaire, effets
├── assets/
│   ├── photo-konate.jpg                Photo professionnelle (extraite du CV)
│   ├── CV-Konate-Linsogui-Bethel.pdf   CV téléchargeable depuis le bouton de l'accueil
│   └── favicon.svg                     Icône de l'onglet du navigateur
└── README.md                           Ce fichier
```

## Ouvrir le site sur ton ordinateur

Double-clique sur `index.html`. Il s'ouvre dans ton navigateur. Une connexion internet est utile pour charger les polices (Google Fonts). Sans connexion, le site reste lisible avec des polices de remplacement.

## Mettre le site en ligne

Envoie le dossier entier (pas seulement `index.html`) chez un hébergeur de sites statiques, par exemple :

- **Netlify** : glisse le dossier sur la page « Netlify Drop ».
- **GitHub Pages** : mets le contenu du dossier dans un dépôt, puis active Pages dans les réglages.
- **Vercel** : importe le dossier ou le dépôt.

Garde la même arborescence (`css/`, `js/`, `assets/`), sinon les styles, le script, la photo et le CV ne se chargent plus.

## Modifier le contenu

| Pour changer | Où |
|---|---|
| Textes des sections, parcours, compétences, certifications | `index.html` |
| E-mail, téléphone, lien WhatsApp, lien LinkedIn | `index.html`, section `id="contact"` ; et les deux constantes `EMAIL` et `WHATSAPP` en haut de `js/main.js` |
| Photo | Remplace `assets/photo-konate.jpg` (garde le même nom, format portrait 2:3) |
| CV | Remplace `assets/CV-Konate-Linsogui-Bethel.pdf` (garde le même nom) |
| Couleurs et polices | Bloc `:root` en haut de `css/style.css` (variables `--navy`, `--mint`, `--bg`, etc.) |
| Description de SANLISHOP | `index.html`, section `id="projet"` |
| Organisme et date de chaque certificat | `index.html`, section `id="certifications"` (une carte `li.cert` par certificat) |

Le thème sombre a ses propres valeurs : elles sont dans les deux blocs qui suivent `:root` dans `css/style.css`. Modifie les deux si tu changes une couleur.

## Ce que fait le formulaire de contact

Le formulaire vérifie les champs, prépare le message, puis propose de l'envoyer par WhatsApp ou par e-mail. Il n'envoie rien tout seul : c'est le visiteur qui valide l'envoi dans WhatsApp ou dans sa messagerie.

## Ce qui n'est pas inclus

- **Notification automatique par e-mail** à chaque message du formulaire : elle demande un service d'envoi (un service de formulaires en ligne ou ton propre serveur).
- **Espace sécurisé `/documents`** pour gérer le CV et les certificats : il demande un serveur avec connexion. Ici, le CV se remplace simplement en changeant le fichier dans `assets/`.

## Accessibilité et confort

- Navigation au clavier, lien « Aller au contenu », focus visible.
- Les animations et les effets de souris sont coupés pour les visiteurs qui ont réduit les animations dans leur système.
- Les effets de survol ne s'appliquent pas sur téléphone et tablette.
