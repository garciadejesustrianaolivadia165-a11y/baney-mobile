import { useEffect, useState } from "react";
import { Pressable, ScrollView, View, type LayoutChangeEvent } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Footer from "@/components/footer";
import LoadingScreen from "@/components/loading-screen";
import Navbar from "@/components/navbar";
import ProductCarousel from "@/components/product-carousel";
import TestimonialCarousel, { type Testimonio } from "@/components/testimonial-carousel";
import TextoTecleado from "@/components/texto-tecleado";
import Button from "@/components/ui/button";
import Texto from "@/components/ui/texto";
import { imagen, IMAGENES } from "@/lib/imagenes";
import { SOMBRA } from "@/lib/estilos";
import type { Product } from "@/types/product";

const IMG = "/images/image_home";

const INTRO =
  "BANEY conecta a productores, transportistas y compradores de República Dominicana en una sola plataforma: publica tu cosecha, consigue quien la mueva y cobra con seguridad, todo desde el teléfono.";
const TESTIMONIOS = [
  "Antes vendía la cosecha al primero que llegaba. Con BANEY publico mis plátanos y los compradores me buscan a mí.",
  "El cacao sale de la finca con un transportista verificado y el pago llega a la cuenta el mismo día de la entrega.",
  "Nos organizamos entre vecinos para llenar un camión completo y el flete nos sale a la mitad.",
  "Con los indicadores de ventas sé qué sembrar la próxima temporada. Dejé de adivinar.",
];
const ECOSISTEMA_TEXTO = [
  "Mayorista agrícola que abastece colmados y mercados de todo el país con producto BANEY.",
  "Cadena de supermercados que compra directo a productores verificados de la plataforma.",
  "Programa de proveedores locales: fruta y vegetal fresco de la finca al anaquel en 48 horas.",
  "Logística de última milla para pedidos agropecuarios con tracking en vivo.",
  "Cooperativa de productores que vende en conjunto para llenar camiones completos.",
  "Distribuidora de insumos y asistencia técnica para fincas de la plataforma.",
];
const FEATURE_TEXTO: Record<number, string> = {
  0: "Catálogo con precios por unidad de medida, fotos y disponibilidad en tiempo real.",
  1: "Transporte con matching por cercanía, tracking en vivo y seguro de carga incluido.",
  2: "Pagos con tarjeta o PayPal y comprobantes fiscales listos para la DGII.",
};

const heroPersonas = [
  { img: `${IMG}/image_home_01.png`, name: "Jose Pérez", loc: "San Pedro de Macoriz" },
  { img: `${IMG}/image_home_02.png`, name: "Cristina Jimenez", loc: "Santo Domingo" },
];

const features = [
  { img: `${IMG}/image_home_03.png`, title: "Regular precios del mercado" },
  { img: `${IMG}/image_home_04.png`, title: "Digitalización del mercado" },
  { img: `${IMG}/image_home_05.png`, title: "Logística simplicidad" },
];

const ecosistema = [
  { img: `${IMG}/image_home_08.png`, name: "AgroMerca RD" },
  { img: `${IMG}/image_home_09.png`, name: "Jumbo RD" },
  { img: `${IMG}/image_home_10.png`, name: "Supermercado Nacional" },
  { img: `${IMG}/image_home_11.png`, name: "AgroExpressRD" },
  { img: `${IMG}/image_home_12.png`, name: "Supermercado Nacional" },
  { img: `${IMG}/image_home_13.png`, name: "AgroExpressRD" },
];

const avatarVendedor = `${IMG}/Ellipse 5.png`;

const testimonios: Testimonio[] = [
  { img: `${IMG}/image_home_06.png`, texto: TESTIMONIOS[0], nombre: "Jacinto José Reyes", rol: "Productor Primario" },
  { img: `${IMG}/image_home_07.png`, texto: TESTIMONIOS[1], nombre: "Hermanos Rodríguez", rol: "Productores de cacao" },
  { img: `${IMG}/image_home_12.png`, texto: TESTIMONIOS[2], nombre: "Luisa y Ramón García", rol: "Agricultores" },
  { img: `${IMG}/image_home_13.png`, texto: TESTIMONIOS[3], nombre: "Miguel Castillo", rol: "Productor de tomates" },
];

const productos: Product[] = [
  { id: "1", name: "Papas Criollas", image: `${IMG}/image_home_14.png`, price: 75, currency: "$", rating: 4, seller: { name: "José Pérez", avatar: avatarVendedor, location: "Bani" } },
  { id: "2", name: "Carne Angus", image: `${IMG}/image_home_15.png`, price: 430, currency: "$", rating: 4, seller: { name: "José Pérez", avatar: avatarVendedor, location: "San Pedro" } },
  { id: "3", name: "Platanos", image: `${IMG}/image_home_16.png`, price: 10, currency: "$", rating: 4, seller: { name: "José Pérez", avatar: avatarVendedor, location: "San Cristobal" } },
  { id: "4", name: "Miel Artesanal", image: `${IMG}/image_home_17.png`, price: 500, currency: "$", rating: 4, seller: { name: "José Pérez", avatar: avatarVendedor, location: "Monte Plata" } },
  // TODO: reemplazar estas imágenes cuando se exporten más productos del Figma
  { id: "5", name: "Papas Blancas", image: `${IMG}/image_home_14.png`, price: 65, currency: "$", rating: 5, seller: { name: "María Santos", avatar: avatarVendedor, location: "Constanza" } },
  { id: "6", name: "Res Premium", image: `${IMG}/image_home_15.png`, price: 520, currency: "$", rating: 4, seller: { name: "Rancho Díaz", avatar: avatarVendedor, location: "Higüey" } },
  { id: "7", name: "Guineos Verdes", image: `${IMG}/image_home_16.png`, price: 8, currency: "$", rating: 4, seller: { name: "Finca López", avatar: avatarVendedor, location: "Azua" } },
  { id: "8", name: "Miel de Abeja Pura", image: `${IMG}/image_home_17.png`, price: 450, currency: "$", rating: 5, seller: { name: "Apiario Marte", avatar: avatarVendedor, location: "Jarabacoa" } },
];

// 02 - Home CON sesión (vista por defecto de la web). El paralaje y el fondo de
// puntos de la web dependen del cursor y del scroll del documento: no aplican aquí.
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ancho, setAncho] = useState(0);

  // Simula la carga inicial; con la API real dependerá de los datos
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-white" onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Fondo decorativo superior (bg-top, 100% de ancho) */}
        {ancho > 0 && (
          <Image pointerEvents="none" source={IMAGENES["/images/image_home/fondo_home.png"]} contentFit="cover" contentPosition="top" style={{ position: "absolute", top: 0, left: 0, width: ancho, height: (ancho * 3713) / 1440 }} />
        )}

        <View className="pt-28">
          {/* Hero */}
          <View className="gap-10 px-5 py-12">
            <View>
              <Texto className="max-w-xl font-sans text-[32px] font-bold leading-[1.15] text-secondary2-500">
                <TextoTecleado texto="Fortalece tus conocimientos y habilidades para hacer crecer tu negocio" />
              </Texto>
              <Texto className="mt-6 max-w-md font-sans text-sm leading-relaxed text-neutral-700">{INTRO}</Texto>
              <Button href="/dashboard" className="mt-8 self-start px-6 py-2.5" textClassName="text-sm">
                Ingresa a tu Perfil
              </Button>
            </View>

            <View className="flex-row justify-center gap-4">
              {heroPersonas.map((p) => (
                <View key={p.name} className="w-1/2 max-w-[288px]">
                  <View style={SOMBRA.card} className="rounded-3xl">
                    <Image source={imagen(p.img)} accessibilityLabel={p.name} contentFit="cover" style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 24 }} />
                  </View>
                  <View className="mt-3 flex-row items-center gap-2">
                    <Image source={imagen(p.img)} contentFit="cover" style={{ width: 32, height: 32, borderRadius: 16 }} />
                    <View className="min-w-0 flex-1">
                      <Texto numberOfLines={1} className="font-sans text-sm font-semibold text-neutral-900">{p.name}</Texto>
                      <Texto numberOfLines={1} className="font-sans text-xs text-neutral-500">{p.loc}</Texto>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Tarjetas informativas */}
          <View className="gap-12 px-6 py-16">
            {features.map((f, i) => (
              <View key={f.title} className="items-center">
                <Image source={imagen(f.img)} accessibilityLabel={f.title} contentFit="contain" style={{ width: "100%", aspectRatio: 1 }} />
                <Texto className="mt-7 max-w-[280px] text-center font-sans text-2xl font-semibold leading-snug text-neutral-900">{f.title}</Texto>
                <Texto className="mt-3 max-w-[300px] text-center font-sans text-sm leading-relaxed text-neutral-500">{FEATURE_TEXTO[i] ?? INTRO}</Texto>
              </View>
            ))}
          </View>

          {/* Testimonios */}
          <View className="overflow-hidden py-14">
            <Image
              source={IMAGENES["/images/image_home/titulo_home.png"]}
              accessibilityLabel="Mas de 35,000 mil proveedores usan nuestros servicios"
              contentFit="contain"
              style={{ width: "100%", aspectRatio: 1249 / 47 }}
            />
            <View className="mt-8">
              <TestimonialCarousel items={testimonios} />
            </View>
          </View>

          {/* Ecosistema */}
          <View className="px-6 py-14">
            <Texto className="text-center font-sans text-2xl font-bold tracking-wide text-neutral-900">CONOCE EL ECOSISTEMA BANEY</Texto>
            <View className="mt-10 gap-10">
              {ecosistema.map((e, i) => (
                <View key={`${e.name}-${i}`} className="flex-row items-start gap-5">
                  <Image source={imagen(e.img)} accessibilityLabel={e.name} contentFit="cover" style={{ width: 80, height: 80, borderRadius: 40 }} />
                  <View className="flex-1">
                    <Texto className="font-sans text-xl font-bold text-neutral-900">{e.name}</Texto>
                    <Texto className="mt-1 font-sans text-sm text-neutral-600">{ECOSISTEMA_TEXTO[i % ECOSISTEMA_TEXTO.length]}</Texto>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Productos */}
          <View className="w-full px-8 py-16">
            <View className="flex-row items-end justify-between">
              <Texto className="font-sans text-lg font-bold tracking-wide text-neutral-900">NUESTROS PRODUCTOS</Texto>
              <Pressable accessibilityRole="link" onPress={() => router.push("/cliente")}>
                <Texto className="font-sans text-sm font-semibold text-neutral-900 underline">Ver Todos ›</Texto>
              </Pressable>
            </View>
            <ProductCarousel items={productos} />
          </View>
        </View>

        <Footer />
      </ScrollView>

      <Navbar session />
    </View>
  );
}
