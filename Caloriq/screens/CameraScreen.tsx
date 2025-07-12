import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { X, RotateCcw, Image as ImageIcon, Camera as CameraIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

interface CameraScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const [type, setType] = useState<CameraType>('back');
  const [isLoading, setIsLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null); // CameraView doesn't export a specific type for the ref

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        navigation.navigate('NutritionResult', {
          imageUri: photo.uri,
          fromCamera: true,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      navigation.navigate('NutritionResult', {
        imageUri: result.assets[0].uri,
        fromCamera: false,
      });
    }
  };

  if (!permission) {
    return (
      <View style={[styles.flex, styles.center, { backgroundColor: '#000' }]}>
        <Text style={[styles.textWhite]}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.flex, styles.center, { backgroundColor: '#000', paddingHorizontal: 24 }]}>
        <Text style={[styles.textWhite, styles.textCenter, styles.textLg, { marginBottom: 16 }]}>
          Camera access is required to scan food
        </Text>
        <TouchableOpacity
          style={[styles.bgEmerald, styles.px6, styles.py3, styles.roundedXl]}
          onPress={requestPermission}
        >
          <Text style={[styles.textWhite, styles.fontSemibold]}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: '#000' }]}>
      <CameraView
        ref={cameraRef}
        style={styles.flex}
        facing={type}
        enableTorch={false}
      >
        {/* Header */}
        <SafeAreaView>
          <View style={[styles.row, styles.justifyBetween, styles.itemsCenter, styles.px6, styles.py4]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.bgBlack30, styles.p2, styles.roundedFull]}
            >
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={[styles.textWhite, styles.textLg, styles.fontSemibold]}>Scan Food</Text>
            <TouchableOpacity
              onPress={() =>
                setType((prev) => (prev === 'back' ? 'front' : 'back'))
              }
              style={[styles.bgBlack30, styles.p2, styles.roundedFull]}
            >
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Overlay Guide */}
        <View style={[styles.flex, styles.center]}>
          <View style={[styles.overlayBox]} />
          <Text style={[styles.textWhite, styles.textCenter, { marginTop: 24, paddingHorizontal: 32 }]}>
            Position your food within the frame for best results
          </Text>
        </View>

        {/* Bottom Controls */}
        <SafeAreaView>
          <View style={[styles.row, styles.justifyCenter, styles.itemsCenter, styles.px6, styles.py8]}>
            <TouchableOpacity
              onPress={pickFromGallery}
              style={[styles.bgBlack30, styles.p4, styles.roundedFull, { marginRight: 32 }]}
            >
              <ImageIcon size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePicture}
              disabled={isLoading}
              style={[
                styles.roundedFull,
                styles.border4,
                styles.borderWhite,
                styles.itemsCenter,
                styles.justifyCenter,
                { width: 80, height: 80 },
                isLoading ? styles.bgGray500 : styles.bgEmerald,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CameraIcon size={32} color="white" />
              )}
            </TouchableOpacity>

            <View style={{ width: 48, height: 48, marginRight: 32 }} />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  textWhite: { color: '#fff' },
  textCenter: { textAlign: 'center' },
  textLg: { fontSize: 18 },
  fontSemibold: { fontWeight: '600' },
  bgEmerald: { backgroundColor: '#10B981' },
  bgBlack30: { backgroundColor: 'rgba(0,0,0,0.3)' },
  px6: { paddingHorizontal: 24 },
  py3: { paddingVertical: 12 },
  py4: { paddingVertical: 16 },
  py8: { paddingVertical: 32 },
  p2: { padding: 8 },
  p4: { padding: 16 },
  roundedXl: { borderRadius: 24 },
  roundedFull: { borderRadius: 9999 },
  border4: { borderWidth: 4 },
  borderWhite: { borderColor: '#fff' },
  bgGray500: { backgroundColor: '#6B7280' },
  row: { flexDirection: 'row' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  itemsCenter: { alignItems: 'center' },
  overlayBox: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 24,
  },
});
