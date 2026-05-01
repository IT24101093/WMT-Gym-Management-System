import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../api/axios";

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  keyboardType,
}) => (
  <View className="mb-4">
    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#64748b"
      multiline={multiline}
      keyboardType={keyboardType || "default"}
      className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800"
    />
  </View>
);

const ClickableField = ({ label, value, onPress, placeholder }) => (
  <TouchableOpacity onPress={onPress} className="mb-4">
    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-2 mb-2">
      {label}
    </Text>
    <View className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[56px] justify-center">
      <Text
        className={`font-bold ${value ? "text-slate-900 dark:text-white" : "text-slate-400"}`}
      >
        {value || placeholder}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function TrainersScreen({ navigation }) {
  const [trainers, setTrainers] = useState([]);
  const [topTrainer, setTopTrainer] = useState(null); // Top Trainer state එක
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);
  const [form, setForm] = useState({ className: "", date: null, notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [tempDate, setTempDate] = useState(new Date());

  const [reviewFor, setReviewFor] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchData = async () => {
    try {
      const [trainersRes, profileRes, topTrainerRes] = await Promise.all([
        api.get("/trainers"),
        api.get("/users/profile"),
        api.get("/trainers/top").catch(() => ({ data: null })), // Top trainer ලබා ගැනීම
      ]);

      setTrainers(trainersRes.data);
      setTopTrainer(topTrainerRes.data);

      if (profileRes.data.selectedTrainer) {
        const selectedTrainerId =
          profileRes.data.selectedTrainer._id ||
          profileRes.data.selectedTrainer;
        const currentTrainer =
          trainersRes.data.find(
            (trainer) => trainer._id === selectedTrainerId,
          ) || null;
        setSelectedTrainer(currentTrainer);
      } else {
        setSelectedTrainer(null);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openBooking = (trainer) => {
    setForm({ className: "", date: null, notes: "" });
    setBookingFor(trainer);
    setTempDate(new Date());
  };

  const openReview = (trainer) => {
    setReviewForm({ rating: 0, comment: "" });
    setReviewFor(trainer);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      setPickerMode("date");
      return;
    }

    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);

    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (pickerMode === "date") {
        setTimeout(() => {
          setPickerMode("time");
          setShowDatePicker(true);
        }, 100);
      } else {
        setPickerMode("date");
        setForm({ ...form, date: currentDate });
      }
    } else {
      setForm({ ...form, date: currentDate });
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBook = async () => {
    if (!form.className.trim() || !form.date)
      return Alert.alert("Error", "Class name and date are required");
    const when = form.date;
    if (when.getTime() < Date.now())
      return Alert.alert("Error", "Date must be in the future");

    setIsSubmitting(true);
    try {
      await api.post("/bookings", {
        trainer: bookingFor._id,
        className: form.className,
        date: when.toISOString(),
        notes: form.notes,
      });
      setBookingFor(null);
      Alert.alert(
        "Booked!",
        "Your session was booked. Track it in My Bookings.",
      );
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      return Alert.alert("Error", "Please provide a rating and a comment.");
    }

    setIsSubmittingReview(true);
    try {
      await api.post(`/trainers/${reviewFor._id}/reviews`, reviewForm);
      Alert.alert("Success", "Thank you for your feedback!");
      setReviewFor(null);
      fetchData();
    } catch (e) {
      Alert.alert(
        "Error",
        e.response?.data?.message || "Failed to submit review.",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSelectTrainer = async (trainer) => {
    setIsSelecting(true);
    try {
      await api.put("/users/profile/selections", {
        selectedTrainer: trainer._id,
      });
      setSelectedTrainer(trainer);
      Alert.alert(
        "Coach Selected",
        `${trainer.name} is now your active coach.`,
      );
    } catch (e) {
      Alert.alert("Error", "Failed to select coach.");
    } finally {
      setIsSelecting(false);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedTrainer?._id === item._id;

    return (
      <View
        className={`p-5 rounded-[32px] mb-6 border ${isSelected ? "bg-green-500/10 border-green-500" : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"}`}
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/150" }}
            className="w-20 h-20 rounded-3xl mr-4 bg-slate-200 dark:bg-slate-800"
          />

          <View className="flex-1 pr-2">
            <View className="flex-row items-center gap-x-2">
              <Text className="text-slate-900 dark:text-white font-extrabold text-lg uppercase tracking-tight">
                {item.name}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              )}
            </View>
            <View className="flex-row items-center gap-x-2">
              <Text className="text-green-500 font-bold uppercase text-[10px] tracking-widest">
                {item.specialization}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={12} color="#fbbf24" />
                <Text className="text-slate-600 dark:text-slate-400 font-bold text-[10px] ml-1">
                  {item.rating?.toFixed(1) || "0.0"}
                </Text>
              </View>
            </View>

            <View className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-lg self-start mt-2 border border-slate-300 dark:border-slate-700">
              <Text className="text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase">
                🕒 {item.availableFrom || "06:00 AM"} -{" "}
                {item.availableTo || "08:00 PM"}
              </Text>
            </View>
          </View>

          <View className="gap-y-2">
            <TouchableOpacity
              onPress={() => openBooking(item)}
              className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <Ionicons name="calendar-outline" size={20} color="#22c55e" />
            </TouchableOpacity>
            {!isSelected ? (
              <TouchableOpacity
                onPress={() => handleSelectTrainer(item)}
                disabled={isSelecting}
                className="bg-green-500 p-3 rounded-2xl"
              >
                <Ionicons name="star" size={20} color="#000" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => openReview(item)}
                className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20"
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#3b82f6"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {item.bio && (
          <Text
            className="text-slate-500 font-medium text-xs mt-4 leading-5"
            numberOfLines={2}
          >
            {item.bio}
          </Text>
        )}

        <View className="flex-row justify-between items-center mt-4">
          <View className="bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
            <Text className="text-green-600 font-extrabold text-[10px] uppercase">
              {item.experience
                ? `${item.experience} Yrs Experience`
                : "Available Coach"}
            </Text>
          </View>
          <Text className="text-slate-400 font-bold text-[10px] uppercase">
            {item.numReviews || 0} REVIEWS
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4 flex-1">
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <Ionicons name="arrow-back" size={28} color="#22c55e" />
          </TouchableOpacity>
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            Our <Text className="text-green-500">Trainers</Text>
          </Text>
          <Text className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Pick a coach, book a session
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#22c55e" size="large" />
          </View>
        ) : (
          <FlatList
            data={trainers}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchData();
                }}
                tintColor="#22c55e"
              />
            }
            // 🏆 TOP RATED TRAINER BANNER - HEADER එකක් ලෙස එකතු කිරීම
            ListHeaderComponent={
              topTrainer && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => openBooking(topTrainer)}
                  className="bg-slate-950 p-6 rounded-[32px] mb-8 relative overflow-hidden border border-slate-800 shadow-xl"
                >
                  <View className="absolute -right-6 -bottom-6 w-32 h-32 bg-green-500/10 rounded-full" />
                  <View className="flex-row items-center">
                    <Image
                      source={{
                        uri:
                          topTrainer.image || "https://via.placeholder.com/150",
                      }}
                      className="w-16 h-16 rounded-2xl border-2 border-green-500"
                    />
                    <View className="ml-4 flex-1">
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="trophy" size={12} color="#fbbf24" />
                        <Text className="text-green-500 font-extrabold text-[9px] uppercase tracking-[2px] ml-1">
                          Top Rated Coach
                        </Text>
                      </View>
                      <Text className="text-white text-xl font-extrabold uppercase">
                        {topTrainer.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="star" size={12} color="#fbbf24" />
                        <Text className="text-slate-400 font-bold text-xs ml-1">
                          {topTrainer.rating?.toFixed(1)} Avg Rating
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#22c55e"
                    />
                  </View>
                </TouchableOpacity>
              )
            }
            ListEmptyComponent={
              <Text className="text-center text-slate-500 mt-20 font-bold uppercase tracking-widest text-xs">
                No trainers yet
              </Text>
            }
          />
        )}
      </View>

      {/* Modals (Booking & Review)*/}
      <Modal visible={!!bookingFor} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white dark:bg-slate-950 p-6 rounded-t-[40px] border-t border-slate-200 dark:border-slate-800">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between items-center mb-2 mt-2">
                  <Text className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                    Book Session
                  </Text>
                  <TouchableOpacity
                    onPress={() => setBookingFor(null)}
                    className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full"
                  >
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
                <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-6">
                  With {bookingFor?.name}
                </Text>

                <Field
                  label="Class / Session Name"
                  value={form.className}
                  onChange={(t) => setForm({ ...form, className: t })}
                  placeholder="e.g., Strength 1-on-1"
                />
                <ClickableField
                  label="Date & Time"
                  value={formatDate(form.date)}
                  onPress={() => {
                    setPickerMode("date");
                    setShowDatePicker(true);
                  }}
                  placeholder="Select Date & Time"
                />
                <Field
                  label="Notes (optional)"
                  value={form.notes}
                  onChange={(t) => setForm({ ...form, notes: t })}
                  placeholder="Anything trainer should know"
                  multiline
                />

                <TouchableOpacity
                  onPress={handleBook}
                  disabled={isSubmitting}
                  className="w-full bg-green-500 py-5 rounded-2xl items-center shadow-lg mt-2 mb-8"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text className="text-slate-900 font-extrabold uppercase text-lg tracking-wide">
                      Confirm Booking
                    </Text>
                  )}
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={tempDate}
                    mode={Platform.OS === "ios" ? "datetime" : pickerMode}
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!reviewFor} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white dark:bg-slate-950 p-6 rounded-t-[40px]">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                  Rate {reviewFor?.name}
                </Text>
                <TouchableOpacity
                  onPress={() => setReviewFor(null)}
                  className="p-2"
                >
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-center gap-x-4 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setReviewForm({ ...reviewForm, rating: s })}
                  >
                    <Ionicons
                      name={reviewForm.rating >= s ? "star" : "star-outline"}
                      size={40}
                      color={reviewForm.rating >= s ? "#fbbf24" : "#64748b"}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Field
                label="Your Feedback"
                value={reviewForm.comment}
                onChange={(t) => setReviewForm({ ...reviewForm, comment: t })}
                placeholder="How was your training session?"
                multiline
              />

              <TouchableOpacity
                onPress={handleReviewSubmit}
                disabled={isSubmittingReview}
                className="w-full bg-blue-500 py-5 rounded-2xl items-center shadow-lg mb-10"
              >
                {isSubmittingReview ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-extrabold uppercase text-lg">
                    Submit Review
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
