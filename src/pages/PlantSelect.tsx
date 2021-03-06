import React, { useEffect, useState } from 'react';
import { 
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';

import colors from '../styles/colors';

import { Header } from '../components/Header';
import fonts from '../styles/fonts';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import api from '../services/api';
import { useNavigation } from '@react-navigation/core';
import { PlantProps } from '../libs/storage';

interface EnvironmentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [environmentsSelected, setEnvironmentsSelected] = useState('all');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  const navigation = useNavigation();

  async function fetchPlants() {
    const { data } = await api
      .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
    
    if(!data) {
      return setLoading(true);
    }
    if(page > 1) {
      setPlants(oldValue => [...oldValue, ...data]);
      setFilteredPlants(oldValue => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentsSelected(environment);

    if(environment == 'all') {
      return setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(plant => 
        plant.environments.includes(environment)
      );
      setFilteredPlants(filtered);
    };
  };

  function handleFetchMore(distance: number) {
    if(distance < 0 || loadingMore) {
      return;
    }
    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
  };

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
  };

  useEffect(() => {
    (async () => {
      const { data } = await api
        .get('plants_environments?_sort=title&_order=asc');
      setEnvironments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...data
      ]);
    })();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    if (plants.length < (page - 1) * 8) {
      setLoadedAll(true);
    }else{
      if(plants.length != 0) {
        fetchPlants();
      };
    };
  }, [page]);

  if(loading) {
    return <Load />
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          voc?? quer colocar sua planta
        </Text>
      </View>
      <View>
        <FlatList
          data={environments}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (            
            <EnvironmentButton 
              title={item.title}
              active={item.key === environmentsSelected}
              onPress={() => {handleEnvironmentSelected(item.key)}}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList 
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <PlantCardPrimary 
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.2}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            (loadingMore && (!loadedAll))
            ? <ActivityIndicator color={colors.green}/>
            : <></>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    paddingLeft: 30,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center'
  }
});
