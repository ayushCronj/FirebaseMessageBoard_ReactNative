import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  FlatList
} from "react-native";
import { Input, Card, Button, Icon } from "native-base";
import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyC8BLsU7SAcmhRfofgKMNSXnLh7QLt6BNE",
  authDomain: "messageboard-9b0e6.firebaseapp.com",
  databaseURL: "https://messageboard-9b0e6.firebaseio.com",
  projectId: "messageboard-9b0e6",
  storageBucket: "messageboard-9b0e6.appspot.com",
  messagingSenderId: "648160679318",
  appId: "1:648160679318:web:26a73012d52e55301379b7",
  measurementId: "G-YQVNQX5MJ0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: []
    };
  }

  sendMessage = message => {
    let messageListRef = firebase.database().ref("message_list");
    let newMessageRef = messageListRef.push();
    newMessageRef.set({
      text: message,
      time: Date.now()
    });
    this.setState({
      message: ""
    });
  };

  updateList = messageList => {
    this.setState({ messageList });
  };

  componentWillMount() {
    var self = this;
    let messageListRef = firebase.database().ref("message_list");

    messageListRef.on("value", dataSnapshot => {
      if (dataSnapshot.val()) {
        let messageList = Object.values(dataSnapshot.val());
        self.updateList(messageList.reverse());
      }
    });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Message Board </Text>
        </View>
        <View style={styles.itemContainer}>
          <FlatList
            inverted
            keyExtractor={item => item.time.toString()}
            renderItem={({ item }) => {
              return (
                <Card style={styles.listItem}>
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.timeText}>
                    {new Date(item.time).toLocaleDateString()}
                  </Text>
                </Card>
              );
            }}
            data={this.state.messageList}></FlatList>
        </View>

        <View style={styles.inputContainer}>
          <Input
            onChangeText={message => {
              this.setState({ message });
            }}
            value={this.state.message}
            placeholder="Enter a Message"
          />
          <Button
            danger
            rounded
            icon
            onPress={() => {
              this.sendMessage(this.state.message);
            }}>
            <Icon name="arrow-forward" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    margin: 2,
    backgroundColor: "#01CBC6"
  },
  header: {
    backgroundColor: "#2B2B52",
    alignItems: "center",
    height: 40,
    justifyContent: "center"
  },
  headerText: {
    paddingHorizontal: 10,
    color: "#FFF",
    fontSize: 20
  },
  listContainer: {
    flex: 1,
    padding: 5
  },
  listItem: {
    padding: 10
  },
  messageText: {
    fontSize: 20
  },
  timeText: {
    fontSize: 10
  },
  inputContainer: {
    flexDirection: "row",
    padding: 5,
    borderWidth: 5,
    borderRadius: 15,
    borderColor: "#2B2B52",
    color: "#fff"
  }
});
