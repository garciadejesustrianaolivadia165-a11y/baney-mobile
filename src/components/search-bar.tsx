import { useState } from "react";
import { TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import Icono from "@/components/ui/icono";

export default function SearchBar({ placeholder = "Buscar", className = "" }: { placeholder?: string; className?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function buscar() {
    const q = query.trim();
    if (q) router.push({ pathname: "/marketplace", params: { q } });
  }

  return (
    <View accessibilityRole="search" className={`flex-row items-center gap-2 rounded-full border border-primary-400 bg-transparent px-4 py-2 ${className}`}>
      <Icono d="M21 21l-4.35-4.35" circulos={[[11, 11, 7]]} size={16} color="#878c83" strokeWidth={2} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={buscar}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor="#a2a79e"
        className="flex-1 font-sans text-sm text-neutral-800"
        style={{ paddingVertical: 0 }}
      />
    </View>
  );
}
