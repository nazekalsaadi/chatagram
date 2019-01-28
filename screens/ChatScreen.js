import React from 'react';
import { Button, TextInput, Text, View, ScrollView, StyleSheet } from 'react-native';
import firebase from 'firebase'
import db from '../db.js'
export default class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  };

  state = {
    messages: [],
    message: ""
  }

  send = () => {
    console.log("Send clicked")
    db.collection("messages").add({ username: firebase.auth().currentUser.email, message: this.state.message, time: new Date() })
    this.setState({ message: "" })
  }

  componentDidMount() {
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
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {
            this.state.messages.map(m =>
              <Text key={m.id}>
                <Text style={{ fontWeight: "bold" }}>{m.username}</Text>
                <Text> </Text>
                <Text>{m.message}</Text>
              </Text>
            )
          }
        </ScrollView>
        <View style={{ flexDirection: 'row' }} keyboardShouldPersistTaps={'handled'}>

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
