import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../ui/Text";
import { Badge } from "../ui/Badge";
import { theme } from "../../theme";
import { Category } from "@repo/domain";

interface CategorySelectorProps {
  selected: Category[];
  onSelectionChange: (categories: Category[]) => void;
}

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.PLUMBING]: "Plomería",
  [Category.ELECTRICAL]: "Electricidad",
  [Category.CLEANING]: "Limpieza",
  [Category.HANDYMAN]: "Manitas",
  [Category.PAINTING]: "Pintura",
};

export function CategorySelector({
  selected,
  onSelectionChange,
}: CategorySelectorProps) {
  const allCategories = Object.values(Category);

  const toggleCategory = (category: Category) => {
    if (selected.includes(category)) {
      // Remove category if already selected
      onSelectionChange(selected.filter((c) => c !== category));
    } else {
      // Add category if not selected
      onSelectionChange([...selected, category]);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="small" style={styles.label}>
        Categorías de servicio *
      </Text>
      <View style={styles.categoriesContainer}>
        {allCategories.map((category) => {
          const isSelected = selected.includes(category);
          return (
            <TouchableOpacity
              key={category}
              onPress={() => toggleCategory(category)}
              style={[
                styles.categoryButton,
                isSelected && styles.categoryButtonSelected,
              ]}
            >
              <Badge
                variant={isSelected ? "success" : "info"}
                style={styles.badge}
              >
                {CATEGORY_LABELS[category]}
              </Badge>
            </TouchableOpacity>
          );
        })}
      </View>
      {selected.length === 0 && (
        <Text variant="small" style={styles.errorText}>
          Seleccioná al menos una categoría
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  label: {
    marginBottom: theme.spacing[2],
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
  },
  categoryButton: {
    marginBottom: theme.spacing[2],
  },
  categoryButtonSelected: {
    opacity: 1,
  },
  badge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  errorText: {
    color: theme.colors.danger,
    marginTop: theme.spacing[1],
  },
});
