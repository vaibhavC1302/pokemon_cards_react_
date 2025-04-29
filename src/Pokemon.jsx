import React from 'react'
import { useEffect, useState } from 'react'
import PokemonCard from './components/PokemonCard'
import Loader from './components/Loader'

const api = "https://pokeapi.co/api/v2/pokemon?limit=150"

function Pokemon() {

    const [pokemonData, setPokemonData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [pokemonType, setPokemonType] = useState("")

    // all the available categories
    const categories = [... new Set(pokemonData.flatMap(item => item.types))]

    // data filtering
    let filteredData = pokemonData;
    if (searchValue.trim() !== "") {
        filteredData = filteredData.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
    }
    if (pokemonType) {
        filteredData = filteredData.filter(item => item.types.includes(pokemonType))
    }
    useEffect(() => {
        fetchData()
    }, [])

    // function to fetch data
    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(api)
            const data = await res.json()
            // console.log(data.results)
            const pokemonData = await Promise.all(data.results.map(async (item) => {
                const res = await fetch(item.url);
                const data = await res.json();
                const types = data.types.map(item => item.type.name);

                const pokemonObj = {
                    name: data.name,
                    id: data.id,
                    imageUrl: data.sprites.front_default,
                    types: types
                }
                return pokemonObj;

            }))
            setPokemonData(pokemonData)

        } catch (error) {
            console.log("error:::::", error)
            setError(error)
        } finally {
            setLoading(false)
        }


    }

    return (
        <>
            <header>
                <h1>Lets catch Pokémon</h1>
            </header>
            <div className='searchContainer'>


                <input
                    type="text"
                    value={searchValue}
                    placeholder='Search ...'
                    onChange={e => setSearchValue(e.target.value)} />

                <select onChange={(e) => setPokemonType(e.target.value)}>
                    <option value="">All</option>
                    {categories.map(category => {
                        return <option key={category} value={category}>{category}</option>
                    })}
                </select>

            </div>

            {error && <h2>Error fetching data</h2>}

            {loading === true
                ? <Loader />
                : <div className='cardsContainer'>
                    {filteredData.length > 0
                        ? filteredData.map(item => {
                            console.log(item.id)
                            return <PokemonCard key={item.id} pokemon={item} />
                        })
                        : <h2>No pokemon found </h2>}
                </div>
            }

        </>
    )
}

export default Pokemon