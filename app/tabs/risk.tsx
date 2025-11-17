import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Callout, Circle, PROVIDER_DEFAULT } from 'react-native-maps';
import { Theme } from '../../constants/theme';

const RiskZoneMapScreen = () => {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  type RiskLevel = 'High' | 'Medium' | 'Low';

  interface RiskZone {
    id: number;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    risk: RiskLevel;
    name: string;
    nearestHelp: string;
    crowdDensity: string;
  }

  const riskZones: RiskZone[] = [
    { id: 1, coordinate: { latitude: 37.78, longitude: -122.44 }, risk: 'High', name: 'Downtown Core', nearestHelp: 'Police Station (1.5km)', crowdDensity: 'High' },
    { id: 2, coordinate: { latitude: 37.79, longitude: -122.42 }, risk: 'Medium', name: "Fisherman's Wharf", nearestHelp: 'Medical Clinic (0.8km)', crowdDensity: 'Medium' },
    { id: 3, coordinate: { latitude: 37.77, longitude: -122.45 }, risk: 'Low', name: 'Golden Gate Park', nearestHelp: 'Park Ranger (2.1km)', crowdDensity: 'Low' },
  ];

  const getRiskColor = (risk: RiskLevel) => {
    if (risk === 'High') return Theme.colors.riskHigh;
    if (risk === 'Medium') return Theme.colors.riskMedium;
    return Theme.colors.riskLow;
  };

  const getFillColor = (risk: RiskLevel) => {
    if (risk === 'High') return 'rgba(255, 0, 0, 0.3)';
    if (risk === 'Medium') return 'rgba(255, 165, 0, 0.3)';
    return 'rgba(0, 255, 0, 0.3)';
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
      >
        {riskZones.map((zone) => (
          <Circle
            key={`circle-${zone.id}`}
            center={zone.coordinate}
            radius={500}
            fillColor={getFillColor(zone.risk)}
            strokeColor={getRiskColor(zone.risk)}
            strokeWidth={2}
          />
        ))}
        {riskZones.map((zone) => (
          <Marker
            key={`marker-${zone.id}`}
            coordinate={zone.coordinate}
          >
            <View style={[styles.customMarker, { backgroundColor: getRiskColor(zone.risk) }]}>
              <Text style={styles.markerText}>{zone.risk}</Text>
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{zone.name}</Text>
                <Text style={styles.calloutText}>Risk Level: {zone.risk}</Text>
                <Text style={styles.calloutText}>Nearest Help: {zone.nearestHelp}</Text>
                <Text style={styles.calloutText}>Crowd Density: {zone.crowdDensity}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.white,
  },
  markerText: {
    color: Theme.colors.white,
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.sm,
  },
  calloutContainer: {
    width: 200,
    padding: Theme.spacing.sm,
  },
  calloutTitle: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sansBold,
    marginBottom: Theme.spacing.xs,
    color: Theme.colors.primary,
  },
  calloutText: {
    fontSize: Theme.font.size.sm,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.darkGray,
  },
});

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

export default RiskZoneMapScreen;
