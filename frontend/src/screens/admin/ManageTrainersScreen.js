import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/axios";

const Field = ({ label, value, onChange, placeholder, keyboardType }) => (
  <View className="mb-4">
    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#64748b"
      keyboardType={keyboardType || "default"}
      className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800"
    />
  </View>
);

export default function ManageTrainersScreen({ navigation }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    specialization: "",
    contact: "",
    image: null,
    availableFrom: "06:00 AM",
    availableTo: "08:00 PM",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchTrainers = async () => {
    try {
      const response = await api.get("/trainers");
      setTrainers(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to load trainers.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setForm({
        ...form,
        image: `data:image/jpeg;base64,${result.assets[0].base64}`,
      });
    }
  };

  const openEditModal = (trainer) => {
    setEditingId(trainer._id);
    setForm({
      name: trainer.name,
      age: trainer.age ? trainer.age.toString() : "",
      specialization: trainer.specialization,
      contact: trainer.contact || "",
      image: trainer.image || null,
      availableFrom: trainer.availableFrom || "06:00 AM",
      availableTo: trainer.availableTo || "08:00 PM",
    });
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      age: "",
      specialization: "",
      contact: "",
      image: null,
      availableFrom: "06:00 AM",
      availableTo: "08:00 PM",
    });
    setModalVisible(true);
  };

  const handleSaveTrainer = async () => {
    if (
      !form.name.trim() ||
      !form.specialization.trim() ||
      !form.contact.trim()
    ) {
      Alert.alert(
        "Missing Fields",
        "Please fill required fields including contact number.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        age: form.age.trim() ? Number(form.age) : undefined,
        specialization: form.specialization.trim(),
        contact: form.contact.trim(),
        image: form.image,
        availableFrom: form.availableFrom,
        availableTo: form.availableTo,
      };

      if (editingId) {
        await api.put(`/trainers/${editingId}`, payload);
        Alert.alert("Success", "Trainer details updated.");
      } else {
        await api.post("/trainers", payload);
        Alert.alert("Success", "New trainer added.");
      }

      setModalVisible(false);
      fetchTrainers();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Action failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrainer = (id, name) => {
    Alert.alert("Delete Trainer", `Are you sure you want to remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/trainers/${id}`);
            fetchTrainers();
          } catch (error) {
            Alert.alert("Error", "Failed to delete.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View className="bg-slate-50 dark:bg-slate-900 p-5 rounded-[28px] mb-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/150" }}
          className="w-16 h-16 rounded-2xl mr-4 bg-slate-200"
        />
        <View className="flex-1">
          <Text className="text-slate-900 dark:text-white font-extrabold text-lg uppercase">
            {item.name}
          </Text>
          <View className="flex-row items-center gap-x-2 mt-1">
            <View className="flex-row items-center bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
              <Ionicons name="star" size={10} color="#fbbf24" />
              <Text className="text-amber-600 dark:text-amber-400 font-bold text-[10px] ml-1">
                {item.rating?.toFixed(1) || "0.0"}
              </Text>
            </View>
            <Text className="text-slate-400 font-bold text-[9px] uppercase">
              ({item.numReviews || 0} Reviews)
            </Text>
          </View>
          <Text className="text-green-600 font-bold uppercase text-[10px] tracking-widest mt-1">
            {item.specialization}
          </Text>
          <Text className="text-slate-500 font-bold text-[9px] mt-1 uppercase">
            📞 {item.contact || "No Contact"}
          </Text>
        </View>
        <View className="flex-row gap-x-2">
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            className="bg-blue-500/10 p-3 rounded-2xl"
          >
            <Ionicons name="create-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteTrainer(item._id, item.name)}
            className="bg-red-500/10 p-3 rounded-2xl"
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-4"
            >
              <Ionicons name="arrow-back" size={28} color="#22c55e" />
            </TouchableOpacity>
            <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase">
              Trainers
            </Text>
          </View>
          <TouchableOpacity
            onPress={openAddModal}
            className="w-12 h-12 bg-green-500 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={28} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#22c55e" size="large" />
        ) : (
          <FlatList
            data={trainers}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white dark:bg-slate-950 p-6 rounded-t-[40px]">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-2xl font-extrabold dark:text-white uppercase">
                    {editingId ? "Edit Trainer" : "Add Trainer"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full"
                  >
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={pickImage}
                  className="items-center mb-6"
                >
                  {form.image ? (
                    <Image
                      source={{ uri: form.image }}
                      className="w-24 h-24 rounded-3xl"
                    />
                  ) : (
                    <View className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-3xl items-center justify-center border-2 border-dashed border-slate-300">
                      <Ionicons name="camera" size={32} color="#64748b" />
                      <Text className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                        Select Photo
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Field
                  label="Trainer Name"
                  value={form.name}
                  onChange={(text) => setForm({ ...form, name: text })}
                  placeholder="Full name"
                />
                <Field
                  label="Age"
                  value={form.age}
                  onChange={(text) => setForm({ ...form, age: text })}
                  placeholder="e.g. 29"
                  keyboardType="numeric"
                />
                <Field
                  label="Specialization"
                  value={form.specialization}
                  onChange={(text) =>
                    setForm({ ...form, specialization: text })
                  }
                  placeholder="e.g. Yoga"
                />

                {/*New added WhatsApp Field*/}
                <Field
                  label="WhatsApp Number"
                  value={form.contact}
                  onChange={(text) => setForm({ ...form, contact: text })}
                  placeholder="e.g. +94771234567"
                  keyboardType="phone-pad"
                />

                <View className="flex-row gap-x-4">
                  <View className="flex-1">
                    <Field
                      label="Available From"
                      value={form.availableFrom}
                      onChange={(text) =>
                        setForm({ ...form, availableFrom: text })
                      }
                      placeholder="06:00 AM"
                    />
                  </View>
                  <View className="flex-1">
                    <Field
                      label="Available To"
                      value={form.availableTo}
                      onChange={(text) =>
                        setForm({ ...form, availableTo: text })
                      }
                      placeholder="08:00 PM"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSaveTrainer}
                  disabled={isSubmitting}
                  className="w-full bg-green-500 py-5 rounded-2xl items-center mt-2 mb-8 shadow-lg shadow-green-500/20"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text className="text-slate-900 font-extrabold uppercase">
                      Save Trainer
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
