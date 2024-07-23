
const MoviesContainer = ({ title, children }) => {

    return (
        <>
            <h6 className="header">{title}</h6>
            <div className="row">
                {children}
            </div>
        </>
    )
}

export default MoviesContainer
