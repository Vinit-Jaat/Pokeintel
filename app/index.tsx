import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorByType: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* ---------------- Debounce Search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText.trim()), 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  /* ---------------- Fetch Pokémon ---------------- */
  useEffect(() => {
    if (debouncedSearch.length === 0) {
      fetchDefaultPokemons();
    } else {
      searchPokemonFromApi(debouncedSearch);
    }
  }, [debouncedSearch]);

  async function fetchDefaultPokemons() {
    try {
      setLoading(true);
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0");
      const data = await res.json();

      const detailed = await Promise.all(
        data.results.map(async (p: any) => {
          const r = await fetch(p.url);
          const d = await r.json();
          return {
            name: d.name,
            image: d.sprites.front_default,
            imageBack: d.sprites.back_default,
            types: d.types,
          };
        })
      );

      setPokemons(detailed);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function searchPokemonFromApi(name: string) {
    try {
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

      if (!res.ok) {
        setPokemons([]);
        return;
      }

      const d = await res.json();
      setPokemons([
        {
          name: d.name,
          image: d.sprites.front_default,
          imageBack: d.sprites.back_default,
          types: d.types,
        },
      ]);
    } catch (err) {
      console.log("Search failed");
      setPokemons([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Search bar always on top */}
      <View style={{ padding: 16 }}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for a Pokémon"
          style={styles.search}
        />
      </View>

      {/* Loading or list */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading Pokémon...</Text>
        </View>
      ) : debouncedSearch.length > 0 && pokemons.length === 0 ? (
        <Text style={styles.noResult}>No Pokémon found 😢</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {pokemons.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={{ pathname: "/details", params: { name: pokemon.name } }}
                style={[
                  styles.card,
                  { backgroundColor: colorByType[pokemon.types[0].type.name] + "50" },
                ]}
            >
              <View

              >
                {/* Name and type on separate lines */}
                <Text style={styles.name}>{pokemon.name}</Text>
                <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Image source={{ uri: pokemon.image }} style={styles.image} />
                  <Image source={{ uri: pokemon.imageBack }} style={styles.image} />
                </View>
              </View>
            </Link>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
  },
  noResult: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  card: {
    padding: 20,
    borderRadius: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 12,
  },
  image: {
    width: 150,
    height: 150,
  },
});
