// MoviesPage.jsx
import s from './MoviesPage.module.css';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import SearchForm from '../../components/SearchForm/SearchForm.jsx';
import fetchApi from '../../servises/Api.js';
import { useSearchParams } from 'react-router-dom'; // Додано для навігації
import Loader from '../../../src/components/Loader/Loader';
import MovieList from '../../components/MovieList/MovieList';
const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChangeQuery = newQuery => {
    setQuery(newQuery);
    setSearchParams(newQuery ? { query: newQuery } : {});
  };

  useEffect(() => {
    if (query.trim()) {
      const fetchMoviesByQuery = async () => {
        setLoading(true);
        setError(null);
        try {
          console.log('Fetching movies for query:', query);
          const results = await fetchApi.fetchMovieSearch(query);
          console.log('Results from API:', results);
          setMovies(results);
        } catch (error) {
          console.log(error, 'Fetching movies');
          setError('Не вдалося виконати пошук.');
          toast.error('Не вдалося виконати пошук.');
        } finally {
          setLoading(false);
        }
      };

      fetchMoviesByQuery();
    } else {
      setMovies([]);
    }
  }, [query]);

  return (
    <>
      <div className={s.MoviesPage_w}>
        <SearchForm onSubmit={handleChangeQuery} />
        {loading && <Loader />}
        {error && <p className={s.error}>{error}</p>}
        {movies.length > 0 ? (
          <MovieList movies={movies} /> // Використовуємо компонент MovieListSearch
        ) : (
          !loading && <p className={s.SearchForm_mesage}>No movies found</p>
        )}
      </div>
    </>
  );
};

export default MoviesPage;
