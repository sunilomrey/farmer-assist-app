import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function PhoneEntryScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    // Validate phone number
    const phoneRegex = /^[0-9]{10,}$/;
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/otp-verification',
        params: { phoneNumber: cleanPhone },
      });
    }, 500);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.backButton}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Phone Verification</ThemedText>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>📱</ThemedText>
        </View>

        {/* Title */}
        <ThemedText style={styles.title}>Enter Your Phone Number</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>
          We'll send you a verification code to confirm your identity
        </ThemedText>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.countryCodeContainer}>
            <ThemedText style={styles.countryCode}>🇺🇸 +1</ThemedText>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="(555) 123 - 4567"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={formatPhoneNumber}
            editable={!loading}
          />
        </View>

        {/* Info Text */}
        <ThemedText style={styles.infoText}>
          Standard rates may apply. We'll never share your number.
        </ThemedText>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!phoneNumber || loading) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!phoneNumber || loading}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.continueText}>
            {loading ? 'Sending...' : 'Continue'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  spacer: {
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 24,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  continueButton: {
    paddingVertical: 14,
    backgroundColor: '#2d5016',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
