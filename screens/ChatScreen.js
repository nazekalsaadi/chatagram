import React from 'react';
import { Image, Button, TextInput, Text, View, ScrollView, StyleSheet } from 'react-native';
import firebase from 'firebase'
import functions from 'firebase/functions'
import db from '../db.js'
export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  };

  state = {
    messages: [],
    message: "",
    imageEmail: null
  }

  users = []

  send = async () => {
    const addMessage = firebase.functions().httpsCallable('addMessage')

    const result = await addMessage({ message: this.state.message })
    this.setState({ message: "" })
  }

  updateImage = async () => {
    await firebase.functions().httpsCallable('updateImage')()
  }

  componentDidMount() {
    // go to db and get all the users
    db.collection("users")
      .onSnapshot(querySnapshot => {
        this.users = []
        querySnapshot.forEach(doc => {
          this.users.push({ id: doc.id, ...doc.data() })
        })
        console.log("Current users: ", this.users.length)
      })

    // go to db and get all the records
    db.collection("messages")
      .orderBy("time")
      .onSnapshot(querySnapshot => {
        let messages = []
        querySnapshot.forEach(doc => {
          messages.push({ id: doc.id, ...doc.data() })
        })
        this.setState({ messages })
        console.log("Current messages: ", messages.length)
      })

    db.collection("image")
      .onSnapshot(querySnapshot => {
        let images = []
        querySnapshot.forEach(doc => {
          images.push({ id: doc.id, ...doc.data() })
        })
        this.setState({ imageEmail: images[0].email })
        console.log("Current imageEmail: ", images[0].email)
      })
  }

  avatarURL = (email) => {
    return "avatars%2F" + this.users.find(u => u.id === email).avatar.replace("@", "%40")
  }

  imageURL = (email) => {
    return "images%2F" + email.replace("@", "%40")
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.imageEmail
          &&
          <View>
            <Image
              style={{ width: 400, height: 400 }}
              source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cp3700-f5264.appspot.com/o/${this.imageURL(this.state.imageEmail)}?alt=media&token=c2f678a6-16ba-436b-86b9-7e7653cec231` }}
            />
            <Text>{this.users.find(u => u.id === this.state.imageEmail).caption}</Text>
            <Button onPress={this.updateImage} title="Change" style={{ width: 100, paddingTop: 20 }} />
          </View>
        }
        <ScrollView>
          {
            this.state.messages.map(m =>
              <Text style={{ fontSize: 20 }} key={m.id}>
                <Image
                  style={{ width: 25, height: 25 }}
                  source={{ uri: `https://firebasestorage.googleapis.com/v0/b/cp3700-f5264.appspot.com/o/${this.avatarURL(m.username)}?alt=media&token=c2f678a6-16ba-436b-86b9-7e7653cec231` }}
                />
                <Text style={{ fontWeight: "bold" }}>{this.users.find(u => console.log("id = ", u.id) || u.id === m.username).name}</Text>
                <Text> </Text>
                <Text>{m.message}</Text>
              </Text>
            )
          }
        </ScrollView>
        <View style={{ flexDirection: 'row' }} keyboardShouldPersistTaps={'handled'}>
          <Text> </Text>
          <TextInput
            placeholder="Message"
            onChangeText={message => this.setState({ message })}
            value={this.state.message}
          />

          <Button onPress={this.send} title="Send" style={{ width: 100, paddingTop: 20 }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
