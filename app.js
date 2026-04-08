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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});