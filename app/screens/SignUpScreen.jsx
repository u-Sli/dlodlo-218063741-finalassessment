import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const SignUpScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('');

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const { signUp } = await import('../../services/FirebaseAuth');
            const userData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`
            };

            const { user, error } = await signUp(formData.email, formData.password, userData);

            if (error) {
                Alert.alert('Sign Up Failed', error);
            } else {
                Alert.alert('Success', 'Account created successfully!');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = () => {
        navigation.navigate('SignIn');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.nameContainer}>
                        <View style={styles.halfInputContainer}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={[styles.input, styles.halfInput, errors.firstName && styles.inputError]}
                                placeholder="First name"
                                value={formData.firstName}
                                onChangeText={(text) => handleInputChange('firstName', text)}
                                autoCapitalize="words"
                            />
                            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                        </View>
                        <View style={styles.halfInputContainer}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={[styles.input, styles.halfInput, errors.lastName && styles.inputError]}
                                placeholder="Last name"
                                value={formData.lastName}
                                onChangeText={(text) => handleInputChange('lastName', text)}
                                autoCapitalize="words"
                            />
                            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={[styles.input, errors.password && styles.inputError]}
                            placeholder="Create a password"
                            value={formData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                            secureTextEntry
                            autoComplete="password-new"
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={[styles.input, errors.confirmPassword && styles.inputError]}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChangeText={(text) => handleInputChange('confirmPassword', text)}
                            secureTextEntry
                            autoComplete="password-new"
                        />
                        {errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleSignIn}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        width: '100%',
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    halfInputContainer: {
        width: '48%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    halfInput: {
        width: '100%',
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
    },
    button: {
        backgroundColor: '#FF5A5F',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#666',
    },
    footerLink: {
        fontSize: 16,
        color: '#FF5A5F',
        fontWeight: '600',
    },
});

export default SignUpScreen;