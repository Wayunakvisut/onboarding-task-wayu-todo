import Image from "next/image";
import { useState } from "react";
import { PokemonCardProps } from "../type";

export default function PokemonCard({ id, name, types }: PokemonCardProps) {
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured((prevCaptured) => !prevCaptured);
    console.log(`${name} has been ${captured ? "released" : "captured"}`);
  };

  return (
    <div className="bg-blue-100 rounded-lg shadow-md p-4 w-full text-black">
      <div className="flex flex-col items-center">
        <span className="text-gray-500 text-sm">{id}</span>
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          alt={name}
          width={180}
          height={200}
        />
        <h2 className="text-lg font-bold mt-2">{name}</h2>

        <div className="flex space-x-2 mt-1">{types}</div>

        <div className="flex items-center mt-4">
          <span className="mr-2 text-sm">
            {captured ? "Captured" : "Not Captured"}
          </span>

          <input
            type="checkbox"
            checked={captured}
            onChange={handleCapture}
            className="rounded-full h-4 w-4 border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
