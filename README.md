# thinkGo — site vitrine

Site statique (HTML / CSS / JS, aucune étape de build).

```
index.html            accueil (L’essentiel, expertises, Revue M&A, discrétion)
acquisition.html      acquisition & croissance externe
cession.html          cession d’entreprise
revue.html            Revue M&A (analyses et points de vue)
a-propos.html         à propos, différence, périmètre
contact.html          échange confidentiel (formulaire en 4 étapes)
assets/css/style.css  style « Institution » : serif, angles droits, filets fins
assets/js/main.js     navigation, animations, ligne du temps, formulaire
assets/img/           logo, favicon, photos (webp + jpg, 960/1920 px)
```

## Revue M&A

Les articles sont dans `revue.html`, chacun dans une balise `<article id="...">`.
Pour en ajouter un, copiez un bloc `<article>` existant et ajoutez sa carte sur la page d’accueil (section `#revue`).

## Formulaire de contact

Le formulaire est prêt pour **Netlify Forms** (`data-netlify="true"`) : une fois le site déployé sur Netlify, les demandes arrivent dans l’onglet *Forms* du tableau de bord.
Sur un autre hébergement, remplacez l’attribut `action="/"` du formulaire par l’URL d’un service de formulaires (Formspree, Basin…) : le JavaScript envoie les données à cette adresse.

## Aperçu local

```bash
python3 -m http.server 8000
```
