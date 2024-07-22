import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk('fetch-movies', async (apiUrl, page) => {
    const response = await fetch(`${apiUrl}$page=${page}`)
    return response.json()
})

const moviesSlice = createSlice({
    name: 'movies',
    initialState: { 
        movies: {results: [], page: 1},
        fetchStatus: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            const urlParams = new URLSearchParams(action.meta.arg);
            const page = Number(urlParams.get('page'));
            if (page > 1) {
                state.movies.results = [...state.movies.results, ...action.payload.results]
            } else {
                state.movies.results = action.payload.results
            }
            state.movies.page = action.payload.page
            state.fetchStatus = 'success'
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export default moviesSlice
