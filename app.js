const express = require('express');
const app = express();
const db = require('./db'); 

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    try {
  
        const sql = `
            SELECT 
                article.id_article,
                article.nom_article, 
                article.date_publication, 
                article.contenu,
                auteur.nom_auteur, 
                categorie.nom_categorie
            FROM article
            JOIN auteur ON article.id_auteur = auteur.id_auteur
            JOIN categorie ON article.id_categorie = categorie.id_categorie
            ORDER BY article.date_publication DESC
        `;
        
        const [articles] = await db.query(sql);
        

        res.render('index', { articles: articles });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du chargement des articles");
    }
});

app.get('/article/:id', async (req, res) => {
    const articleId = req.params.id;

    try {

        const articleQuery = `
            SELECT article.*, auteur.nom_auteur, categorie.nom_categorie 
            FROM article
            JOIN auteur ON article.id_auteur = auteur.id_auteur
            JOIN categorie ON article.id_categorie = categorie.id_categorie
            WHERE article.id_article = ?`;
        
        const [articleResult] = await db.query(articleQuery, [articleId]);

        if (articleResult.length === 0) {
            return res.redirect('/');
        }

        const article = articleResult[0];

        const tagsQuery = `
            SELECT tags.nom_tag 
            FROM tags
            JOIN posséder ON tags.id_tags = posséder.id_tags
            WHERE posséder.id_article = ?`;
        const [tags] = await db.query(tagsQuery, [articleId]);

        const commentsQuery = `
            SELECT nom_visiteur, contenu, date_commentaire 
            FROM commentaire 
            WHERE id_article = ?
            ORDER BY date_commentaire DESC`;
        const [comments] = await db.query(commentsQuery, [articleId]);

        res.render('article', { article, tags, comments });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération de l'article");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

