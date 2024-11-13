import UnauthorizedScreen from '@/components/NotAuthorized';
import { getImageByClass } from '@/constants/image.paths';
import { getPrettyDateString } from '@/lib/date-utils';
import { RouteReportResponse, RouteService } from '@/service/Api';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import MapView, { Callout, Marker } from 'react-native-maps';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [selectedRoute, setSelectedRoute] = useState<RouteReportResponse>();
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<MapView>(null);
  const [routesData, setRoutesData] = useState<Array<RouteReportResponse>>([])
  const { user } = useAuth0();

  useEffect(() => {
    (async () => {
      if (!locationPermission) {
        const { status } = await requestLocationPermission();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to use this feature.');
        } else {
          Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, setLocation);
        }
      }

      if (user) {
        const routes = await RouteService.getRoutesForUser();
        setRoutesData(routes);
      }
    })();
  }, []);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [location]);

  useFocusEffect(
    useCallback(() => {
      const fetchRoutes = async () => {
        const routes = await RouteService.getRoutesForUser();
        setRoutesData(routes);
      };
      if (user) {
        fetchRoutes();
      }
    }, [user])
  )

  const handleSelectRoute = (routeId: number) => {
    const route = routesData.find((r) => r.id === routeId);
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
    getPrettyDateString(route.createdAt).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if(!user) {
    return <UnauthorizedScreen />
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location ? location.coords.latitude : 51.528390,
            longitude: location ? location.coords.longitude : 33.395879,
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

              {selectedRoute.recognizedSigns.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.coordinates.latitude,
                    longitude: marker.coordinates.longitude,
                  }}
                >
                  <Image source={getImageByClass(marker.signClass)} style={styles.markerImage} />
                </Marker>
              ))}

              {selectedRoute.comments.map((comment, index) => (
                <Marker
                  key={`comment-${index}`}
                  coordinate={{
                    latitude: comment.coordinates.latitude,
                    longitude: comment.coordinates.longitude,
                  }}
                  pinColor='blue'
                >
                  <Callout style={{ minWidth: 100, maxWidth: 300}}>
                    <Text style={{ fontSize: 10, color: 'black' }}>{comment.text}</Text>
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
          data={filteredRoutes.sort((r1, r2) => r1.id - r2.id)}
          keyExtractor={(item) => `${item.id}-${new Date(item.createdAt).getDate()}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleSelectRoute(item.id)} style={styles.routeItem}>
              <Text style={styles.routeText}>{index + 1}) {getPrettyDateString(item.createdAt)}</Text>
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
