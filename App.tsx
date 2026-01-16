import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

type ProductSummary = {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  thumbnailUrl: string;
};

type ProductDetail = {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  description: string;
  brand: string;
  sku: string;
  weightGrams: number | null;
  dimensions: string | null;
  material: string | null;
  color: string | null;
  stock: number | null;
  thumbnailUrl: string;
  imageUrl: string;
};

type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

const PAGE_SIZE = 10;
const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

const formatPrice = (value: number) => `INR ${Math.round(value)}`;

async function fetchProducts(page: number): Promise<PagedResponse<ProductSummary>> {
  const response = await fetch(`${API_BASE_URL}/api/products?page=${page}&size=${PAGE_SIZE}`);
  if (!response.ok) {
    throw new Error("Failed to load products");
  }
  return response.json();
}

async function fetchProductDetail(id: number): Promise<ProductDetail> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to load product details");
  }
  return response.json();
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState<PagedResponse<ProductSummary> | null>(null);
  const [selected, setSelected] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entered) {
      return;
    }

    setLoading(true);
    setError(null);

    fetchProducts(page)
      .then((data) => {
        setProducts(data);
        setSelected(null);
      })
      .catch(() => {
        setError("Could not load products. Check the API server.");
      })
      .finally(() => setLoading(false));
  }, [entered, page]);

  const handleSelect = async (productId: number) => {
    setDetailLoading(true);
    setError(null);

    try {
      const detail = await fetchProductDetail(productId);
      setSelected(detail);
    } catch {
      setError("Could not load product details.");
    } finally {
      setDetailLoading(false);
    }
  };

  if (!entered) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.backgroundBlobTop} />
        <View style={styles.backgroundBlobBottom} />
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>THRIFTY STORE</Text>
          <Text style={styles.heroTitle}>Design made for daily rituals.</Text>
          <Text style={styles.heroSubtitle}>
            Launching in India with handcrafted essentials and earthy textures.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => setEntered(true)}>
            <Text style={styles.primaryButtonText}>Enter Thrifty</Text>
          </Pressable>
          <View style={styles.badges}>
            <Text style={styles.badge}>Handmade</Text>
            <Text style={styles.badge}>Earth-first</Text>
            <Text style={styles.badge}>Local makers</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>THRIFTY</Text>
          <Text style={styles.headerTitle}>Storefront Preview</Text>
          <Text style={styles.headerSubtitle}>
            {products ? `${products.totalElements} products` : "Curated pieces"}
          </Text>
        </View>
        <View style={styles.pagePill}>
          <Text style={styles.pagePillText}>
            Page {products ? products.page + 1 : 1} / {products?.totalPages || 1}
          </Text>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#f46b45" style={styles.loader} />
      ) : (
        <FlatList
          data={products?.content || []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handleSelect(item.id)}>
              <Image source={{ uri: item.thumbnailUrl }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.shortDescription}</Text>
              <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
            </Pressable>
          )}
          ListFooterComponent={
            <View style={styles.pagination}>
              <Pressable
                style={[styles.ghostButton, page <= 0 && styles.ghostDisabled]}
                onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page <= 0}
              >
                <Text style={styles.ghostText}>Previous</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.ghostButton,
                  products && page >= products.totalPages - 1 && styles.ghostDisabled
                ]}
                onPress={() =>
                  setPage((prev) => Math.min(prev + 1, Math.max((products?.totalPages || 1) - 1, 0)))
                }
                disabled={!!products && page >= products.totalPages - 1}
              >
                <Text style={styles.ghostText}>Next</Text>
              </Pressable>
            </View>
          }
        />
      )}

      {selected && (
        <View style={styles.detailSheet}>
          {detailLoading ? (
            <ActivityIndicator size="large" color="#f46b45" />
          ) : (
            <View>
              <Pressable style={styles.closeButton} onPress={() => setSelected(null)}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
              <Image source={{ uri: selected.imageUrl }} style={styles.detailImage} />
              <Text style={styles.detailTitle}>{selected.name}</Text>
              <Text style={styles.detailPrice}>{formatPrice(selected.price)}</Text>
              <Text style={styles.detailDescription}>{selected.description}</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text>{selected.brand}</Text>
            </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>SKU</Text>
                  <Text>{selected.sku}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Material</Text>
                  <Text>{selected.material}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Color</Text>
                  <Text>{selected.color}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Dimensions</Text>
                  <Text>{selected.dimensions}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Stock</Text>
                  <Text>{selected.stock}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f1ea"
  },
  backgroundBlobTop: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(244, 107, 69, 0.2)",
    top: -40,
    right: -40
  },
  backgroundBlobBottom: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(31, 122, 140, 0.18)",
    bottom: -60,
    left: -60
  },
  hero: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center"
  },
  eyebrow: {
    letterSpacing: 2,
    fontSize: 12,
    color: "#1f7a8c",
    fontWeight: "600"
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 12,
    color: "#1d1a17"
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#6b5c4f",
    lineHeight: 22
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: "#f46b45",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 999,
    alignSelf: "flex-start"
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20
  },
  badge: {
    backgroundColor: "rgba(31, 122, 140, 0.12)",
    color: "#1f7a8c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 12,
    marginRight: 10,
    marginBottom: 10
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
    color: "#1d1a17"
  },
  headerSubtitle: {
    color: "#6b5c4f",
    marginTop: 4
  },
  pagePill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e4d3c2"
  },
  pagePillText: {
    fontWeight: "600"
  },
  error: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 10,
    color: "#9c3f2c"
  },
  loader: {
    marginTop: 20
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120
  },
  column: {
    justifyContent: "space-between"
  },
  card: {
    flex: 1,
    backgroundColor: "#fffaf5",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#e4d3c2"
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 14,
    backgroundColor: "#f0e6dc"
  },
  cardTitle: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14
  },
  cardSubtitle: {
    marginTop: 4,
    color: "#6b5c4f",
    fontSize: 12
  },
  cardPrice: {
    marginTop: 6,
    color: "#c84a2b",
    fontWeight: "600"
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 32
  },
  ghostButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e4d3c2",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 6
  },
  ghostDisabled: {
    opacity: 0.4
  },
  ghostText: {
    fontWeight: "600"
  },
  detailSheet: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 20,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e4d3c2",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(244, 107, 69, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999
  },
  closeText: {
    color: "#c84a2b",
    fontWeight: "600"
  },
  detailImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginTop: 10
  },
  detailTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#1d1a17"
  },
  detailPrice: {
    color: "#c84a2b",
    fontWeight: "600",
    marginTop: 4
  },
  detailDescription: {
    marginTop: 8,
    color: "#6b5c4f",
    lineHeight: 20
  },
  detailGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  detailItem: {
    width: "48%",
    marginRight: 8,
    marginBottom: 10
  },
  detailLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#6b5c4f",
    marginBottom: 2
  }
});
