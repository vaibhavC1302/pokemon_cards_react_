import React from 'react'

function PokemonCard({ pokemon }) {
    return (
        <div className='cardContainer'>
            <h1 >{pokemon.name}</h1>
            <img src={pokemon.imageUrl} />
            {pokemon.types.map(item => {
                return <p key={item}>{item}</p>
            })}
        </div>
    )
}

export default PokemonCard