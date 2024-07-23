import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import { fetchMovies } from './data/moviesSlice';
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants';
import Header from './components/Header';
import Movies from './components/Movies';
import Starred from './components/Starred';
import WatchLater from './components/WatchLater';
import YouTubePlayer from './components/YoutubePlayer';
import Modal from './components/Modal';
import './app.scss';
import useInfiniteScroll from './hooks/useInfiniteScroll';

const App = () => {
  const state = useSelector((state) => state);
  const { movies } = state;
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [videoKey, setVideoKey] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const getMovies = useCallback(async () => {
    if (!searchQuery) {
      await dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${page}`));
    } else {
      await dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${page}`));
    }
  }, [dispatch, searchQuery, page]);

  const loadMoreMovies = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const [showLoading, isFetching] = useInfiniteScroll(loadMoreMovies);

  const closeModal = () => setOpen(false);

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=1`));
      setSearchParams(createSearchParams({ search: query }));
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=1`));
      setSearchParams();
    }
    setPage(1); 
  };

  const searchMovies = (query) => {
    navigate('/');
    getSearchResults(query);
  };

  const viewTrailer = (movie) => {
    getMovie(movie.id);
    setOpen(true);
  };

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find((vid) => vid.type === 'Trailer');
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  return (
    <div className="App">
      <div id="modal-root"></div>
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        <Modal isOpen={isOpen} onClose={closeModal}>
          {videoKey ? (
            <YouTubePlayer videoKey={videoKey} />
          ) : (
            <div style={{ padding: '30px' }}>
              <h6>No trailer available. Try another movie</h6>
            </div>
          )}
        </Modal>

        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>

        {showLoading && !isFetching && <p className="loading-message">Loading more movies...</p>}
      </div>
    </div>
  );
};

export default App;
