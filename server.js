const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const PORT = 3000;

const APIkey = "454ef93d493743a5b427e632727ffd9d";
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', async (req, res)=>{
    try{
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${APIkey}`);
        const data = response.data;
        res.render("index", { news: data.articles });
        console.log(data);
    } catch(error){
        res.status(500).send(error);
        console.error(error);
    }
});

app.get('/search', async (req, res)=>{
    try{
        const searchTerm = req.query.searchTerm;
        // console.log(searchTerm);
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${APIkey}`);
        const data = response.data.articles;
        const news = data.filter((dataItem) => dataItem.title?.toLowerCase().includes(searchTerm?.toLowerCase()));
        console.log(news);
        res.render("index", { news });

    } catch(error){
        res.status(500).send(error);
        console.error(error);
    }
});

app.get("/sort-by-date", async (req, res) => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${APIkey}`);
      const data = response.data.articles;
  
      data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
      res.render("index", { news: data });
    } catch (error) {
      console.error("Error sorting articles by date:", error);
      res.status(500).send("Error sorting articles by date. Please try again later.");
    }
  });

app.get('/news-by-date', async (req, res)=>{
    try{
        const date = req.query.date;
        const response = await axios.get(`https://newsapi.org/v2/everything?q=*&from=${date}&to=${date}&sortBy=popularity&apiKey=${APIkey}`);
        const data = response.data;
        // console.log(date);
        res.render("index", { news: data.articles });
    } catch(error){
        res.status(500).send(error);
        console.log(error);
    }
});

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})