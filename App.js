import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Permissions, AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  async componentWillMount() {
    const prompt = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    console.log("Camera permission 1: ", prompt)
    const result = await Permissions.getAsync(Permissions.CAMERA_ROLL)
    console.log("Camera permission 2: ", result)
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
