import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { ImagePicker } from 'expo';

import { MonoText } from '../components/StyledText';
import firebase from 'firebase'
import db from '../db.js'
import { uploadImageAsync } from '../ImageUtils.js'


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    name: "",
    email: "",
    password: "",
    avatar: null,
    caption: ""
  }


  pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ avatar: result.uri });
    }
  };

  pickImage= async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      await uploadImageAsync("images", result.uri, this.state.email)
      await db.collection('users').doc(this.state.email).update({ caption: this.state.caption })
    }
  };

  finishLoginOrRegister = async () => {

  }

  loginOrRegister = async () => {
    let avatar = "default.png"
    try {

      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      // upload this.state.avatar called this.state.email to firebase storage
      if (this.state.avatar) {
        avatar = this.state.email
        await uploadImageAsync("avatars", this.state.avatar, this.state.email)
      }

      console.log("avatar upload: ", avatar)
      const name = this.state.name || this.state.email
      await db.collection('users').doc(this.state.email).set({ name, avatar, online: true })
    } catch (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode)
      console.log(errorMessage)
      if (errorCode == "auth/email-already-in-use") {
        try {
          await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)

          if (this.state.avatar) {
            avatar = this.state.email
            await uploadImageAsync("avatars", this.state.avatar, this.state.email)
            await db.collection('users').doc(this.state.email).update({ avatar })
          }

          await db.collection('users').doc(this.state.email).update({ online: true })
          
          if(this.state.name) {
            await db.collection('users').doc(this.state.email).update({ name: this.state.name })
          }
          console.log("avatar upload: ", result)
        } catch (error) {

          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log(errorMessage)
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            {
              this.state.avatar
              &&
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: this.state.avatar }}
              />
            }
            <TextInput
              autoCapitalize="none"
              placeholder="Name"
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
            />

            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />

            <TextInput
              autoCapitalize="none"
              placeholder="Password"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />

            <Button onPress={this.loginOrRegister} title="Login / Register" style={{ width: 100, paddingTop: 20 }} />
            <Button onPress={this.pickAvatar} title="Select Avatar" style={{ width: 100, paddingTop: 20 }} />

            <TextInput
              autoCapitalize="none"
              placeholder="Caption"
              onChangeText={caption => this.setState({ caption })}
              value={this.state.caption}
            />

            <Button onPress={this.pickImage} title="Upload new image" style={{ width: 100, paddingTop: 20 }} />
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 300,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
