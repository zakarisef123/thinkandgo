# thinkGo — site vitrine

Site statique (HTML / CSS / JS, aucune étape de build).

```
index.html            accueil (L’essentiel, expertises, Revue M&A, discrétion)
acquisition.html      acquisition & croissance externe
cession.html          cession d’entreprise
revue.html            Revue M&A (analyses et points de vue)
a-propos.html         à propos, différence, périmètre
contact.html          échange confidentiel (e-mail direct à Servais Micolot)
assets/css/style.css  style « Institution » : serif, angles droits, filets fins
assets/js/main.js     navigation, animations, ligne du temps, carrousel, e-mail
assets/img/           logo, favicon, photos (webp + jpg, 960/1920 px)
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
