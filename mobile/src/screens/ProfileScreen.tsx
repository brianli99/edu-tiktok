import React from "react";
import { View, Text, StyleSheet } from "react-native";
const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Learning Profile</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" },
  text: { color: "#fff", fontSize: 18 }
});
export default ProfileScreen;
