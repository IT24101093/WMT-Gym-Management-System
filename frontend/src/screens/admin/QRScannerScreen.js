import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"; //Expo Camera
import { Ionicons } from "@expo/vector-icons";
import api from "../../api/axios";

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white dark:bg-black">
        <Text className="text-center dark:text-white mb-4">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-green-500 p-4 rounded-2xl"
        >
          <Text className="font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      // Sending data to the backend
      const response = await api.post("/trainers/attendance", { userId: data });
      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to mark attendance",
      );
      setScanned(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Overlay UI */}
      <View className="flex-1 justify-between p-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-black/50 w-12 h-12 rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <View className="w-64 h-64 border-4 border-green-500 rounded-3xl mb-10" />
          <Text className="text-white font-black uppercase tracking-widest text-center bg-black/50 p-4 rounded-2xl">
            Align QR Code inside the frame
          </Text>
        </View>

        <View />
      </View>
    </View>
  );
}
