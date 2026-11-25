# thinkGo — site vitrine

Site statique (HTML / CSS / JS, aucune étape de build).

```
index.html            accueil (L’essentiel, expertises, Revue M&A, discrétion)
acquisition.html      acquisition & croissance externe
cession.html          cession d’entreprise
revue.html            Revue M&A (analyses et points de vue)
a-propos.html         à propos, différence, périmètre
contact.html          échange confidentiel (e-mail direct à Servais Micolot)
confidentialite.html  déclaration de confidentialité et politique de cookies
en/, de/              versions anglaise et allemande (mêmes noms de pages)
assets/css/style.css  style « Institution » : serif, angles droits, filets fins
assets/js/main.js     navigation, animations, ligne du temps, carrousel, e-mail
assets/img/           logo, favicon, photos (webp + jpg, 960/1920 px)
assets/fonts/         polices Newsreader et Inter Tight, hébergées localement
assets/video/         vidéo d’ouverture de l’accueil (mp4 + webm)
```

## Revue M&A

Les articles sont dans `revue.html`, chacun dans une balise `<article id="...">`.
Pour en ajouter un, copiez un bloc `<article>` existant et ajoutez sa carte sur la page d’accueil (section `#revue`).

## Contact

Pas de formulaire : la page Contact propose un bouton e-mail qui ouvre la messagerie du visiteur avec l’adresse servais.micolot@thinkgo.ch déjà renseignée.
L’objet du message s’adapte au projet quand le visiteur arrive depuis la page Acquisition ou Cession (`contact.html?projet=acquerir|ceder`).

## Aperçu local

```bash
python3 -m http.server 8000
```

## Langues

Le site existe en français (racine), anglais (`en/`) et allemand (`de/`, orthographe suisse).
Chaque page indique ses équivalents (`hreflang`) et le sélecteur FR · EN · DE renvoie vers la même page dans l’autre langue.
Toute modification de texte doit être reportée dans les trois versions.

## Cookies et données

Le site n’utilise aucun cookie de suivi ni outil de statistiques, et ne charge aucune ressource externe (polices hébergées localement).
Seules deux préférences techniques sont enregistrées dans le navigateur du visiteur : la messagerie choisie (`tg-mail-provider`) et la fermeture du bandeau d’information (`tg-cookie-notice`).
Si un outil de statistiques est ajouté plus tard, le bandeau devra demander un consentement et la politique devra être mise à jour.
