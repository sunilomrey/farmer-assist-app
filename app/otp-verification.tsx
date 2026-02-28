import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleOTPChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // Handle paste
      const digits = numericText.split('');
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(digits.length, 6 - index); i++) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);
      
      // Move focus to the last filled input or the next empty one
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      inputRefs.current[Math.min(lastFilledIndex + 1, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // Move to next input if digit is entered
    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const newOtp = [...otp];
    newOtp[index] = '';
    setOtp(newOtp);

    // Move to previous input on backspace
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter all 6 digits');
      return;
    }

    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      // Navigate to home/dashboard
      router.push('/(tabs)');
    }, 1000);
  };

  const handleResendOTP = () => {
    if (!canResend) return;
    
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    // Here you would call the API to resend OTP
    Alert.alert('OTP Resent', 'A new verification code has been sent to your phone');
  };

  const isOTPComplete = otp.every((digit) => digit !== '');
  const formattedPhone = phoneNumber ? `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}` : '';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.backButton}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Verify OTP</ThemedText>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>✓</ThemedText>
        </View>

        {/* Title */}
        <ThemedText style={styles.title}>Enter Verification Code</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>
          We sent a 6-digit code to {formattedPhone}
        </ThemedText>

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, digit && styles.otpInputFilled]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(index);
                }
              }}
              editable={!loading}
            />
          ))}
        </View>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <ThemedText style={styles.resendText}>
            {canResend ? "Didn't receive the code?" : `Resend in ${timer}s`}
          </ThemedText>
          {canResend && (
            <TouchableOpacity onPress={handleResendOTP}>
              <ThemedText style={styles.resendLink}>Resend OTP</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Verify Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOTPComplete || loading) && styles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={!isOTPComplete || loading}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.verifyText}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
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
    color: '#2d5016',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  otpInputFilled: {
    borderColor: '#2d5016',
    backgroundColor: '#fff',
  },
  resendContainer: {
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    fontSize: 13,
    color: '#999',
  },
  resendLink: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  verifyButton: {
    paddingVertical: 14,
    backgroundColor: '#2d5016',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
