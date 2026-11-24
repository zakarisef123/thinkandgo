# thinkGo — site vitrine

Site statique (HTML / CSS / JS, aucune étape de build).

```
index.html            page unique (sections + tunnel de contact)
assets/css/style.css  design system & mise en page
assets/js/main.js     navigation, animations, onglets, formulaire multi-étapes
assets/img/           logo, favicon, photos (webp + jpg, 960/1920 px)
```

## Formulaire de contact

Le formulaire est prêt pour **Netlify Forms** (`data-netlify="true"`) : une fois le site déployé sur Netlify, les demandes arrivent dans l’onglet *Forms* du tableau de bord.
Sur un autre hébergement, remplacez l’attribut `action="/"` du formulaire par l’URL d’un service de formulaires (Formspree, Basin…) : le JavaScript envoie les données à cette adresse.

## Aperçu local

```bash
python3 -m http.server 8000
```
