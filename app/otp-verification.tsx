import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const HARDCODED_OTP = '000000';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phoneNumber, countryCode } = useLocalSearchParams<{
    phoneNumber: string;
    countryCode: string;
  }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer for resend OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
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

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  }, []);

  const handleOTPChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length > 1) {
      // Handle paste
      const digits = numericText.split('');
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(digits.length, 6 - index); i++) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      inputRefs.current[Math.min(lastFilledIndex + 1, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const newOtp = [...otp];
    newOtp[index] = '';
    setOtp(newOtp);

    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      showError('Please enter all 6 digits');
      return;
    }

    if (otpString !== HARDCODED_OTP) {
      showError('The OTP you entered is incorrect. Please try again.');
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to home/dashboard — replace so user can't go back to auth
      router.replace('/(tabs)');
    }, 800);
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorVisible(true);
  };

  const isOTPComplete = otp.every((digit) => digit !== '');
  const displayPhone = phoneNumber
    ? `${countryCode || '+91'} ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
    : '';

  const { width } = Dimensions.get('window');
  const isSmall = width < 380;
  const otpBoxSize = isSmall ? 44 : Math.min(52, (width - 48 - 40) / 6);
  const otpFontSize = isSmall ? 20 : 24;

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <ThemedText style={styles.icon}>🔐</ThemedText>
          </View>
        </View>

        {/* Title */}
        <ThemedText style={styles.title}>Enter Verification Code</ThemedText>

        {/* Description */}
        <ThemedText style={styles.description}>
          We sent a 6-digit code to{' '}
          <ThemedText style={styles.phoneHighlight}>{displayPhone}</ThemedText>
        </ThemedText>

        {/* OTP Input Fields */}
        <Animated.View style={[styles.otpContainer, { transform: [{ translateX: shakeAnim }] }]}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                { width: otpBoxSize, height: otpBoxSize, fontSize: otpFontSize },
                digit ? styles.otpInputFilled : null,
              ]}
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
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <ThemedText style={styles.resendText}>
            {canResend ? "Didn't receive the code?" : `Resend code in ${timer}s`}
          </ThemedText>
          {canResend && (
            <TouchableOpacity onPress={handleResendOTP}>
              <ThemedText style={styles.resendLink}>Resend OTP</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Hint for testing */}
        <View style={styles.hintContainer}>
          <ThemedText style={styles.hintText}>
            💡 For testing, use OTP: 000000
          </ThemedText>
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
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Error Popup Modal */}
      <Modal
        visible={errorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorVisible(false)}
      >
        <Pressable style={styles.errorOverlay} onPress={() => setErrorVisible(false)}>
          <View style={styles.errorPopup}>
            <View style={styles.errorIconCircle}>
              <ThemedText style={styles.errorIcon}>!</ThemedText>
            </View>
            <ThemedText style={styles.errorTitle}>Wrong OTP</ThemedText>
            <ThemedText style={styles.errorMsg}>{errorMessage}</ThemedText>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => setErrorVisible(false)}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.errorButtonText}>Try Again</ThemedText>
            </TouchableOpacity>
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
  flex: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 8,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 15,
    color: '#2d5016',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#e8f5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 34,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#fafafa',
  },
  otpInputFilled: {
    borderColor: '#2d5016',
    backgroundColor: '#fff',
  },
  resendContainer: {
    alignItems: 'center',
    gap: 6,
  },
  resendText: {
    fontSize: 13,
    color: '#999',
  },
  resendLink: {
    fontSize: 14,
    color: '#2d5016',
    fontWeight: '700',
  },
  hintContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fffbe6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffe58f',
  },
  hintText: {
    fontSize: 13,
    color: '#8B6F47',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  verifyButton: {
    paddingVertical: 16,
    backgroundColor: '#2d5016',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  // Error popup styles
  errorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorPopup: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  errorIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 28,
    fontWeight: '800',
    color: '#dc2626',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  errorMsg: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#dc2626',
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
