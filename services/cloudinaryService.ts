import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET  
const CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY

export interface UploadResponse {
  secure_url: string;
  public_id: string;
}

/**
 * Picks an image from the device gallery
 */
export const pickImage = async (): Promise<string | null> => {
  try {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant access to your photos to upload an image.');
      return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to select image. Please try again.');
    return null;
  }
};

/**
 * Uploads an image to Cloudinary
 */
export const uploadImageToCloudinary = async (imageUri: string): Promise<UploadResponse | null> => {
  try {
    const formData = new FormData();
    
    // Create file from image URI
    const filename = imageUri.split('/').pop() || 'image';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);
    
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const data = await response.json();
    
    if (data.secure_url) {
      return {
        secure_url: data.secure_url,
        public_id: data.public_id,
      };
    } else {
      console.error('Cloudinary upload failed with response:', data);
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    Alert.alert('Error', 'Failed to upload image. Please try again.');
    return null;
  }
};
