auteurs (id_auteur, nom_auteur, prenom_auteur, date_naissance)

categories (id_categorie, nom_categorie)

tags (id_tags, nom_tag)

articles (id_article, nom_article, date_publication, contenu, #id_auteur, #id_categorie)

commentaires (id_commentaire, nom_visiteur, contenu, date_commentaire, #id_article)

article_tags (table de jointure) (#id_article, #id_tags)