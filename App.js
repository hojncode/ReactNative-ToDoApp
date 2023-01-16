import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  // Storing string value === 스트링 값으로 저장하기.
  // const saveToDos = async (toSave) => {
  //   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  // };

  // const loadToDos = async () => {
  //   const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  //   setToDos(JSON.parse(jsonValue));
  //   console.log("콘솔", jsonValue, "콘솔2", JSON.parse(jsonValue)); //parse 를 사용해서 자바스크립트 오브젝트로 만들어준다.
  // };

  // Storing object value === 오브젝트로 저장하기. try catch 문 사용 : 실제 앱을 만들 경우 사용할 것.
  const saveToDos = async (toSave) => {
    try {
      const jsonValue = JSON.stringify(toSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      //saving error
    }
  };

  const loadToDos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? setToDos(JSON.parse(jsonValue)) : null;
      // console.log("콘솔", jsonValue, "콘솔2", JSON.parse(jsonValue)); //parse 를 사용해서 자바스크립트 오브젝트로 만들어준다.
    } catch (e) {
      //saving error
    }
  };

  useEffect(() => {
    loadToDos();
  }, []);

  const addToDo = async () => {
    // alert("test");
    if (text === "") {
      return;
    }
    // toDos 추가하는 방법 1. Object.assign 사용.
    // Object.assign은 object 를 가져다가 다른 object와 합쳐준다. 그런다음 새로운 object를 리턴해준다.
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    //  toDos 추가하는 방법 2. es6문법인 스프레드 연산을 사용.
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  console.log(toDos);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <View style={styles.header}>
        {/* // TouchableOpacity 이걸 누르면 애니매이션이 들어간다. */}
        <TouchableOpacity activeOpacity={0.5} onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? "white" : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
        {/* onPress 손가락이 터치되었을때.
        <TouchableHighlight
          underlayColor="#DDDDDD"
          activeOpacity={0}
          onPress={() => console.log("pressed")}
        >
          <Text style={styles.btnText}>test1</Text>
        </TouchableHighlight>
        <Pressable> 향후에 Pressable 로 대체 될 수 있다.(method 가 많다.)
          <Text style={styles.btnText}>test2</Text>
        </Pressable> */}
      </View>
      <TextInput
        // 다양한 기능을 가져다 사용할 수 있다.
        // keyboardType="default"
        // returnKeyType="send"
        // returnKeyLabel=""
        // secureTextEntry
        // multiline
        // placeholderTextColor="red"
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        autoCapitalize={"sentences"}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
        value={text}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, // padding 을 네이티브에서 사용할때.
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
