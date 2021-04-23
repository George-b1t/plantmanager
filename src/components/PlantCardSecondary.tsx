import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { SvgFromUri } from 'react-native-svg';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface PlantProps extends RectButtonProps {
  data: {
    name: string;
    photo: string;
    hour: string;
  }
}

export function PlantCardSecondary({
  data,
  ...rest
}: PlantProps) {
  return (
    <RectButton
      style={styles.container}
      {...rest}
    >
      <View style={styles.fieldSvg}>
        <SvgFromUri 
          uri={data.photo} 
          width={50} 
          height={50}
        />
      </View>
      <Text style={styles.title}>
          {data.name}
      </Text>
      <View style={styles.details}>
        <Text style={styles.timeLabel}>
          Regar às 
        </Text>
        <Text style={styles.time}>
          {data.hour}
        </Text>
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 25,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.shape,
    marginVertical: 5
  },
  fieldSvg: {
    width: 50,
    height: 50
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.heading
  },
  details: {
    alignItems: 'center'
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_light,
  },
  time: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.body_dark  
  }
});
