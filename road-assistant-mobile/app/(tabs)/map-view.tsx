import { getImageByClass } from '@/constants/image.paths';
import React, { useRef, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

const routesData = [
  {
    routeId: 'route1',
    startPoint: { latitude: 51.524847, longitude: 33.382453 },
    endPoint: { latitude: 51.550630, longitude: 33.362599 },
    markers: [
      {
        latitude: 51.536192,
        longitude: 33.358049,
        image: getImageByClass(0),
      },
      {
        latitude: 51.547005,
        longitude: 33.352258,
        image: getImageByClass(1),
      },
    ],
    commentMarkers: [
      {
        latitude: 51.540000,
        longitude: 33.360000,
        text: 'Цей коментар для прикладу',
      },
    ],
  },
  {
    routeId: 'route2',
    startPoint: { latitude: 48.8566, longitude: 2.3522 },
    endPoint: { latitude: 48.8540, longitude: 2.3490 },
    markers: [
      {
        latitude: 48.8566,
        longitude: 2.3522,
        image: getImageByClass(5),
      },
      {
        latitude: 48.8550,
        longitude: 2.3500,
        image: getImageByClass(11),
      },
    ],
    commentMarkers: [
      {
        latitude: 48.8560,
        longitude: 2.3510,
        text: 'Ще один приклад коментаря',
      },
    ],
  },
];

export interface Coords {
  latitude: number;
  longitude: number;
}

export interface Marker extends Coords {
  image: any;
}

export interface CommentMarker extends Coords {
  text: string;
}

export interface RouteData {
  routeId: string;
  startPoint: Coords;
  endPoint: Coords;
  markers: Array<Marker>;
  commentMarkers?: Array<CommentMarker>;
}

export default function MapScreen() {
  const [selectedRoute, setSelectedRoute] = useState<RouteData>();
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<MapView>(null);

  const handleSelectRoute = (routeId: string) => {
    const route = routesData.find((r) => r.routeId === routeId);
    setSelectedRoute(route);

    if (route && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...route.startPoint,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const filteredRoutes = routesData.filter(route =>
    route.routeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 51.528390,
            longitude: 33.395879,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {selectedRoute && (
            <>
              <Marker
                coordinate={selectedRoute.startPoint}
                title="Початок маршруту"
                pinColor="green"
              />
              
              <Marker
                coordinate={selectedRoute.endPoint}
                title="Кінець маршруту"
                pinColor="red"
              />

              {selectedRoute.markers.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                >
                  <Image source={marker.image} style={styles.markerImage} />
                </Marker>
              ))}

              {selectedRoute.commentMarkers?.map((comment, index) => (
                <Marker
                  key={`comment-${index}`}
                  coordinate={{
                    latitude: comment.latitude,
                    longitude: comment.longitude,
                  }}
                  pinColor='blue'
                >
                  <Callout>
                    <Text>{comment.text}</Text>
                  </Callout>
                </Marker>
              ))}
            </>
          )}
        </MapView>
      </View>

      <KeyboardAvoidingView
        style={styles.routeListContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук маршруту"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <FlatList
          data={filteredRoutes}
          keyExtractor={(item) => item.routeId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectRoute(item.routeId)} style={styles.routeItem}>
              <Text style={styles.routeText}>{item.routeId}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.routeList}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 0.65,
    borderRadius: 20,
    overflow: 'hidden',
    margin: 10,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  routeListContainer: {
    flex: 0.35,
    padding: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  routeList: {
    paddingBottom: 20,
  },
  routeItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  routeText: {
    fontSize: 16,
  },
});
