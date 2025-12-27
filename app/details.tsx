import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet, ActivityIndicator, TextInput } from "react-native";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp. ATK",
  "special-defense": "Sp. DEF",
  speed: "SPD",
};


export default function details() {

    const params = useLocalSearchParams<{name: string}>();

    const [pokemonData, setPokemonData] = useState<any>(null); 
    const [loading ,setLoading] = useState(true); 

    console.log(params.name); 

    useEffect(() =>{
        if(params.name){
            fetchPokemonData(); 
        }
    }, [params.name])

    async function fetchPokemonData(){
        try{
            setLoading(true); 
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.name}`);

            if(!res.ok){
                console.error("Error unable to fetch data"); 
                return; 
            }
            const data = await res.json(); 
            console.log(data); 
            setPokemonData(data); 

        }catch(err){
            console.log("Unable to fetch data"); 
        }finally{
            console.log(`Fetching data for ${params}`);
            setLoading(false); 
        }
    }

    if (loading || !pokemonData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
            <Text>Loading Pokémon...</Text>
            </View>
        );
    }  

  return (
    <>
    <Stack.Screen options={{headerShown : true}}></Stack.Screen>
    <ScrollView
  
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >

    <Text style={styles.name}>{pokemonData ? pokemonData.name.toUpperCase() : "Loading..."}</Text>
              
    <Image
    source={{
      uri: pokemonData.sprites.other["official-artwork"].front_default,
    }}
    style={styles.image}
    resizeMode="contain"
    />

      {/* Types */}
  <View style={styles.typesContainer}>
    {pokemonData.types.map((t: any) => (
      <View key={t.type.name} style={styles.typeBadge}>
        <Text style={styles.typeText}>{t.type.name}</Text>
      </View>
    ))}
  </View>

    {/* Height & Weight */}
  <View style={styles.infoRow}>
    <Text>Height: {pokemonData.height}</Text>
    <Text>Weight: {pokemonData.weight}</Text>
  </View>

{/* Stats */}
<Text style={styles.sectionTitle}>Base Stats</Text>

{pokemonData.stats.map((s: any) => {
  const statName = s.stat.name;
  const statValue = s.base_stat;

  return (
    <View key={statName} style={styles.statRow}>
      <Text style={styles.statName}>
        {STAT_LABELS[statName] ?? statName}
      </Text>

      <View style={styles.statBarBackground}>
        <View
          style={[
            styles.statBarFill,
            {
              width: `${Math.min((statValue / 150) * 100, 100)}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.statValue}>{statValue}</Text>
    </View>
  );
})}

  
    </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 220,
  },
  typesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  typeText: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statName: {
    width: 80,
    textTransform: "capitalize",
  },
  statBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  statBarFill: {
    height: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
});


