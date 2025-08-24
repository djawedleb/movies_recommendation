import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT ;
// const TmdbApiKey = process.env.TMDB_API_KEY;
// console.log("API Key loaded:", TmdbApiKey);
const TmdbToken = process.env.TMDB_BEARER_TOKEN;
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get("/movie", async (req, res) => {
    const movieName = req.query.name;

    if (!movieName) {
        return res.status(400).json({ error: "Please provide a movie name (?name=...)" });
    }

    try {
        // Search movie
        const response = await axios.get("https://api.themoviedb.org/3/search/multi", {
            params: { query: movieName },
            headers: {
                Authorization: `Bearer ${TmdbToken}`,
                accept: "application/json"
            }
        });

        // If no results
        if (response.data.results.length === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Take the first result
        const movie = response.data.results[0];

        const result = {
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null
        };

        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

