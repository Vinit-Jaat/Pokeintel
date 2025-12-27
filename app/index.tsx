import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet, ActivityIndicator} from "react-native";

interface pokemon{
  name: string; 
  image: string; 
  imageBack: string; 
  types: pokemonType[],
}

interface pokemonType{
  type: {
    name : string, 
    uri : string,
  }
}

const colorByType = {
  normal:   "#A8A878",
  fire:     "#F08030",
  water:    "#6890F0",
  electric: "#F8D030",
  grass:    "#78C850",
  ice:      "#98D8D8",
  fighting: "#C03028",
  poison:   "#A040A0",
  ground:   "#E0C068",
  flying:   "#A890F0",
  psychic:  "#F85888",
  bug:      "#A8B820",
  rock:     "#B8A038",
  ghost:    "#705898",
  dragon:   "#7038F8",
  dark:     "#705848",
  steel:    "#B8B8D0",
  fairy:    "#EE99AC", 
}

export default function Index() {

  const [loading, setLoading] = useState(true); 

  const [pokemons, setPokemons] = useState<pokemon[]>([]);  

  useEffect(() =>{
    //fetch pokemons
    fetchPokemons(); 
  }, [])

  async function  fetchPokemons (){
    try{
      setLoading(true); 
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=300&offset=0"); 
      const data = await response.json(); 

      // fetch detailed pokemon in paraller
      const detailedPokemons  = await Promise.all(
        data.results.map(async (pokemon : any ) =>{
          const res = await fetch(pokemon.url); 
          const details = await res.json(); 
          return{ 
            name: pokemon.name, 
            image: details.sprites.front_default,
            imageBack : details.sprites.back_default, 
            types: details.types,
          }
        })
      )

      setPokemons(detailedPokemons); 
    }catch(e){
      console.log(e); 
    }finally{
      setLoading(false); 
      console.log("Api request done")
    }
  }
  if(loading){
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={{ marginTop: 10 }}>Loading Pokémon...</Text>
    </View>
  );
}

return (
  <ScrollView contentContainerStyle={{
    gap:  16, padding: 16,
  }}>
    {pokemons.map((pokemon, i) => (
      <View key={i} style={{
        // @ts-ignore
        backgroundColor: colorByType[pokemon.types[0].type.name] + 50,
        padding: 20,
        borderRadius: 20,
      }}>
        <Text style={style.name}>{pokemon.name}</Text>
        <Text style={style.type}>{pokemon.types[0].type.name}</Text>

        <View style={{
          flexDirection: "row", 
           
        }}>
        <Image source={{uri : pokemon.image}} style={{
          width: 150, 
          height: 150
        }}></Image>
        <Image source={{uri : pokemon.imageBack}} style={{
          width: 150, 
          height: 150
        }}></Image>
        </View>

      </View>
      
    ))}
  </ScrollView>
);
}

const style = StyleSheet.create({
   name: { 
    fontSize: 28, 
    fontWeight: "bold", 
    textAlign: "center",
   },
    type: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "gray",
    textAlign: "center",
   }
})
