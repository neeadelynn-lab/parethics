import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera needed', 'Please allow camera access to scan products.');
        return;
      }
    }
    setScanning(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanning(false);
    Alert.alert('Product Found! 🎉', `Barcode: ${data}\n\nNext step: looking up this product...`);
  };

  if (scanning) {
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanInstruction}>Point at any product barcode</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setScanning(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appName}>Parethics</Text>
        <Text style={styles.tagline}>Scan. Know. Protect.</Text>
      </View>

      {/* SCAN BUTTON */}
      <View style={styles.scanSection}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Text style={styles.scanIcon}>📷</Text>
          <Text style={styles.scanText}>Scan a Product</Text>
        </TouchableOpacity>
        <Text style={styles.scanSub}>Point at any barcode on baby & kids products</Text>
      </View>

      {/* SCORE PREVIEW */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How We Score</Text>
        <View style={styles.pillarsRow}>
          <View style={styles.pillar}>
            <Text style={styles.pillarIcon}>🛡️</Text>
            <Text style={styles.pillarName}>Safety</Text>
          </View>
          <View style={styles.pillar}>
            <Text style={styles.pillarIcon}>⚖️</Text>
            <Text style={styles.pillarName}>Ethics</Text>
          </View>
          <View style={styles.pillar}>
            <Text style={styles.pillarIcon}>🌱</Text>
            <Text style={styles.pillarName}>Planet</Text>
          </View>
          <View style={styles.pillar}>
            <Text style={styles.pillarIcon}>👩</Text>
            <Text style={styles.pillarName}>Moms</Text>
          </View>
        </View>
      </View>

      {/* RECENT SCANS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Your scanned products will appear here</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7F2',
  },
  header: {
    backgroundColor: '#1A1410',
    padding: 48,
    paddingTop: 72,
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FEFCF9',
    letterSpacing: -1,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: '#C4511A',
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scanSection: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 32,
  },
  scanButton: {
    backgroundColor: '#C4511A',
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#C4511A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  scanIcon: {
    fontSize: 48,
    marginBottom: 6,
  },
  scanText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  scanSub: {
    fontSize: 13,
    color: '#8C7B6E',
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 18,
  },
  section: {
    padding: 24,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1410',
    marginBottom: 14,
  },
  pillarsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pillar: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,20,16,0.08)',
  },
  pillarIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  pillarName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1410',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,20,16,0.08)',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#8C7B6E',
    textAlign: 'center',
    lineHeight: 20,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 260,
    height: 260,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#C4511A',
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  scanInstruction: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});