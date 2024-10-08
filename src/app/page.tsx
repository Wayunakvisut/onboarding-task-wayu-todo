"use client";
import { useEffect, useState } from "react";
import { PokemonCardProps } from "./type";
import PokemonCard from "./component/pokemoncard";

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonCardProps[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<
    PokemonCardProps[]
  >([]);
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchName, setSearchName] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPokemonTypes();
    loadMorePokemon();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  const fetchPokemonTypes = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();
    setPokemonTypes(data.results.map((type: { name: string }) => type.name));
  };

  const loadMorePokemon = async () => {
    setIsLoading(true);
    const data = await (
      await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
    ).json();
    const newPokemon = await fetchPokemonDetails(data.results);
    const updatedPokemonList = [...pokemonList, ...newPokemon];
    setPokemonList(updatedPokemonList);
    setOffset((prevOffset) => prevOffset + 20);
    filterPokemon(updatedPokemonList);
    setIsLoading(false);
  };

  const fetchPokemonDetails = async (
    pokemonArray: { name: string; url: string }[]
  ) => {
    const promises = pokemonArray.map(async (pokemon) => {
      const { id, name, types } = await (await fetch(pokemon.url)).json();
      const captured = localStorage.getItem(`captured-${id}`) === "true";

      return {
        id,
        name,
        types: types.map((t: { type: { name: string } }) => t.type.name),
        captured,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
    return await Promise.all(promises);
  };

  const filterPokemon = (pokemonData: PokemonCardProps[]) => {
    let filteredList = pokemonData;

    if (selectedType !== "All") {
      filteredList = filteredList.filter((pokemon) =>
        pokemon.types.includes(selectedType)
      );
    }
    if (searchName) {
      filteredList = filteredList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchId) {
      filteredList = filteredList.filter(
        (pokemon) => pokemon.id === parseInt(searchId)
      );
    }
    setFilteredPokemonList(filteredList);
  };

  useEffect(() => {
    filterPokemon(pokemonList);
  }, [selectedType, searchName, searchId, pokemonList]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !isLoading
    ) {
      loadMorePokemon();
    }
  };

  return (
    <div className="w-full bg-blue-400 flex justify-center flex-col h-auto items-center p-20 text-black">
      <video
        id="myVideo"
        autoPlay
        playsInline
        loop
        muted
        className="object-none"
      >
        <source src="PokemonTwerk.mp4" type="video/mp4" />
      </video>
      <h1 className="text-8xl pb-20 pt-20">Pokédex RANGER</h1>

      <SearchInput
        label="Search by Name:"
        value={searchName}
        onChange={setSearchName}
      />
      <SearchInput
        label="Search by Pokédex Number:"
        value={searchId}
        onChange={setSearchId}
        type="number"
      />
      <TypeFilter
        types={pokemonTypes}
        selectedType={selectedType}
        onChange={setSelectedType}
      />

      <div className="grid-flow-row grid-cols-4 grid gap-10">
        {filteredPokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types}
            captured={pokemon.captured}
            img={pokemon.img}
          />
        ))}
      </div>

      {isLoading && (
        <div className="pt-20 text-2xl">Loading more Pokémon...</div>
      )}
    </div>
  );
}

const SearchInput = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="input" className="pr-8">
        {label}
      </label>
      <input
        id="input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2"
      />
    </div>
  );
};

const TypeFilter = ({
  types,
  selectedType,
  onChange,
}: {
  types: string[];
  selectedType: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="typeSelect" className="pr-8">
        Filter by Type:
      </label>
      <select
        id="typeSelect"
        value={selectedType}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2"
      >
        <option value="All">All Types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
