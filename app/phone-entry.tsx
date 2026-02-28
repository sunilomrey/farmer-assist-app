import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
];

export default function PhoneEntryScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // India default
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleSendOTP = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/otp-verification',
        params: { phoneNumber: cleanPhone, countryCode: selectedCountry.code },
      });
    }, 500);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
  };

  const isPhoneValid = phoneNumber.replace(/\D/g, '').length >= 10;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <ThemedText style={styles.icon}>📱</ThemedText>
          </View>
        </View>

        {/* Title */}
        <ThemedText style={styles.title}>Enter Your Phone Number</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>
          We'll send you a verification code to confirm your identity
        </ThemedText>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          {/* Country Code Picker */}
          <TouchableOpacity
            style={styles.countryCodeContainer}
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.countryFlag}>
              {selectedCountry.flag}
            </ThemedText>
            <ThemedText style={styles.countryCode}>
              {selectedCountry.code}
            </ThemedText>
            <ThemedText style={styles.dropdownArrow}>▼</ThemedText>
          </TouchableOpacity>

          {/* Phone Number Input */}
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter mobile number"
            placeholderTextColor="#bbb"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={formatPhoneNumber}
            editable={!loading}
            maxLength={10}
          />
        </View>

        {/* Info Text */}
        <ThemedText style={styles.infoText}>
          Standard rates may apply. We'll never share your number.
        </ThemedText>
      </View>

      {/* Send OTP Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.sendOtpButton,
            (!isPhoneValid || loading) && styles.buttonDisabled,
          ]}
          onPress={handleSendOTP}
          disabled={!isPhoneValid || loading}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.sendOtpText}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCountryPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <ThemedText style={styles.modalTitle}>Select Country</ThemedText>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryRow,
                    item.code === selectedCountry.code && styles.countryRowActive,
                  ]}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryPicker(false);
                  }}
                >
                  <ThemedText style={styles.countryRowFlag}>
                    {item.flag}
                  </ThemedText>
                  <ThemedText style={styles.countryRowName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.countryRowCode}>
                    {item.code}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 15,
    color: '#2d5016',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    backgroundColor: '#fafafa',
    marginBottom: 16,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    gap: 6,
    backgroundColor: '#f5f5f5',
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#999',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 17,
    color: '#333',
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 44,
  },
  sendOtpButton: {
    paddingVertical: 16,
    backgroundColor: '#2d5016',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOtpText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  countryRowActive: {
    backgroundColor: '#e8f5e1',
  },
  countryRowFlag: {
    fontSize: 22,
  },
  countryRowName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  countryRowCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});
