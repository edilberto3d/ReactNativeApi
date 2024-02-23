import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Animated, BackHandler } from 'react-native';

const API_KEY ='08ce2353891fcfcee7d55eacfb3af28b';
const API_URL = `https://api.themoviedb.org/3`;
const IMAGE_BASE_URL = `https://image.tmdb.org/t/p/w500`;

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        setPopularMovies(data.results);
      } catch (error) {
        console.error('Error fetching popular movies: ', error);
      }
    };

    fetchPopularMovies();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedMovie) {
        handleBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [selectedMovie]);

  const handleMoviePress = (movie) => {
    setSelectedMovie(movie);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedMovie(null);
    });
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity style={styles.movieItem} onPress={() => handleMoviePress(item)}>
      <Image style={styles.poster} source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }} />
    </TouchableOpacity>
  );

  const descriptionOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const descriptionTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Películas Populares</Text>
      </View>
      <FlatList
        data={popularMovies}
        numColumns={4}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
      />
      {selectedMovie && (
        <Animated.View style={[styles.descriptionContainer, { opacity: descriptionOpacity, transform: [{ translateY: descriptionTranslateY }] }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
          <Text style={styles.descriptionTitle}>{selectedMovie.title}</Text>
          <Text style={styles.description}>{selectedMovie.overview}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D',
  },
  header: {
    backgroundColor: '#E50914',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  movieItem: {
    marginTop: 5,
    flex: 1,
    aspectRatio: 0.7,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  poster: {
    flex: 1,
    borderRadius: 10,
  },
  descriptionContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    paddingTop: 60,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#E50914',
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    marginTop: 10,
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default App;
