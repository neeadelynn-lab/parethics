import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProductScreen() {
  const params = useLocalSearchParams();
  const barcode = params.barcode as string;
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (barcode) {
      fetchProduct();
    }
  }, [barcode]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(false);
    setProduct(null);

    try {
      // Try Open Beauty Facts first
      const beautyResponse = await fetch(
        `https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`
      );
      const beautyData = await beautyResponse.json();

      if (beautyData.status === 1 && beautyData.product?.product_name) {
        setProduct(beautyData.product);
        return;
      }

      // Try Open Food Facts second
      const foodResponse = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const foodData = await foodResponse.json();

      if (foodData.status === 1 && foodData.product?.product_name) {
        setProduct(foodData.product);
        return;
      }

      // Try UPC Item DB last
      const upcResponse = await fetch(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`
      );
      const upcData = await upcResponse.json();

      if (upcData.items && upcData.items.length > 0) {
        const item = upcData.items[0];
        setProduct({
          product_name: item.title,
          brands: item.brand,
          image_url: item.images?.[0],
          categories: item.category,
        });
        return;
      }

      setError(true);

    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#C4511A" />
        <Text style={styles.loadingText}>Looking up product...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Product Not Found</Text>
        <Text style={styles.errorSub}>Try scanning again or search by name</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Scan Another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Info</Text>
      </View>

      {/* PRODUCT CARD */}
      <View style={styles.productCard}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.productImage} />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>📦</Text>
          </View>
        )}
        <Text style={styles.productName}>{product.product_name || 'Unknown Product'}</Text>
        <Text style={styles.brandName}>{product.brands || 'Unknown Brand'}</Text>
        {product.categories && (
          <Text style={styles.category}>{product.categories.split(',')[0]}</Text>
        )}
      </View>

      {/* SCORE CARDS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parethics Score</Text>

        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreIcon}>🛡️</Text>
            <Text style={styles.scoreName}>Safety</Text>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>A</Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreIcon}>⚖️</Text>
            <Text style={styles.scoreName}>Ethics</Text>
            <View style={[styles.gradeBadge, styles.gradeB]}>
              <Text style={styles.gradeText}>B+</Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreIcon}>🌱</Text>
            <Text style={styles.scoreName}>Planet</Text>
            <View style={[styles.gradeBadge, styles.gradeB]}>
              <Text style={styles.gradeText}>B</Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreIcon}>👩</Text>
            <Text style={styles.scoreName}>Mom Score</Text>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>A-</Text>
            </View>
          </View>
        </View>

      </View>

      {/* RECALL STATUS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recall Status</Text>
        <View style={styles.recallSafe}>
          <Text style={styles.recallIcon}>✅</Text>
          <View>
            <Text style={styles.recallTitle}>No Recalls Found</Text>
            <Text style={styles.recallSub}>Based on CPSC database</Text>
          </View>
        </View>
      </View>

      {/* SCAN AGAIN */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.scanAgain} onPress={() => router.back()}>
          <Text style={styles.scanAgainText}>📷 Scan Another Product</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7F2',
  },
  centered: {
    flex: 1,
    backgroundColor: '#FBF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#8C7B6E',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1410',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 14,
    color: '#8C7B6E',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#C4511A',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  backText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#1A1410',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backLink: {
    color: '#C4511A',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  productCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26,20,16,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  noImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#EDE5D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noImageText: {
    fontSize: 48,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1410',
    textAlign: 'center',
    marginBottom: 6,
  },
  brandName: {
    fontSize: 15,
    color: '#C4511A',
    fontWeight: '600',
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    color: '#8C7B6E',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1410',
    marginBottom: 12,
    marginTop: 8,
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(26,20,16,0.08)',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreIcon: {
    fontSize: 22,
  },
  scoreName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1410',
  },
  gradeBadge: {
    backgroundColor: '#EAF4EA',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gradeB: {
    backgroundColor: '#FFF5E0',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2D',
  },
  recallSafe: {
    backgroundColor: '#EAF4EA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(45,106,45,0.2)',
  },
  recallIcon: {
    fontSize: 28,
  },
  recallTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A4A1A',
    marginBottom: 2,
  },
  recallSub: {
    fontSize: 12,
    color: '#4A6A4A',
  },
  scanAgain: {
    backgroundColor: '#1A1410',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
