import Movie from './Movie'
import '../styles/movies.scss'
import MoviesContainer from './MovieContainer'

const Movies = ({ movies, viewTrailer, closeCard }) => {

    return (
        <div data-testid="movies">
            <div data-testid="wrapper-movies" className="wrapper-movies">
            <MoviesContainer>
            {movies.movies.results?.map((movie) => {
                return (
                    <Movie 
                        movie={movie} 
                        key={movie.id}
                        viewTrailer={viewTrailer}
                        closeCard={closeCard}
                    />
                )
            })}
            </MoviesContainer>
            </div>
        </div>
    )
}

export default Movies
