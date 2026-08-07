import type { DemoProduct } from "@/types/product";
import { productImageManifest } from "@/data/product-image-manifest";

const productSeeds = [
  ["new-01", "AMARANTH Dr.Soie", "Антивозрастной кушон для лица", "Face", 8290, "12 г", "Новинка", "Кушон для лица из каталога JapRise."],
  ["new-02", "Direia", "Солнцезащитный крем SPF50+", "Sun Care", 7290, "40 г", "Новинка", "Средство с солнцезащитой из каталога JapRise."],
  ["new-03", "Quality 1st", "Патчи для глаз Derma Laser", "Face", 2890, "30 шт.", "Новинка", "Патчи для области вокруг глаз из каталога JapRise."],
  ["new-04", "Tokio Inkarami", "Маска-уход для волос Home N", "Hair", 13500, "250 г", "Новинка", "Маска для волос из каталога JapRise."],
  ["best-01", "Spa Treatment", "Патчи для глаз HAS", "Face", 8190, "60 шт.", "Хит", "Патчи для области вокруг глаз из каталога JapRise."],
  ["best-02", "Enzym", "Лосьон Enzy Cerad", "Face", 6790, "150 мл", "Хит", "Лосьон для ухода за лицом из каталога JapRise."],
  ["best-03", "Spa Treatment", "Сыворотка EXO Moist", "Face", 9890, "30 мл", "Хит", "Эссенция для ухода за лицом из каталога JapRise."],
  ["best-04", "Tokio Inkarami", "Масло для волос Platinum", "Hair", 6000, "100 мл", "Хит", "Масло для волос из каталога JapRise."],
  ["best-05", "Tokio Inkarami", "Кондиционер Premium", "Hair", 7000, "200 мл", "Хит", "Кондиционер для волос из каталога JapRise."],
  ["face-01", "Direia", "Крем для глаз STM", "Face", 13890, "20 г", null, "Крем для области вокруг глаз из каталога JapRise."],
  ["face-02", "AMARANTH Dr.Soie", "Тональный кушон 5G Lift", "Face", 8290, "15 г", null, "Тональный кушон из каталога JapRise."],
  ["hair-01", "Tokio Inkarami", "Шампунь Premium", "Hair", 6600, "200 мл", null, "Шампунь для волос из каталога JapRise."],
  ["hair-02", "Tokio Inkarami", "Кондиционер Platinum", "Hair", 6400, "200 мл", null, "Кондиционер для волос из каталога JapRise."],
  ["body-01", "MONNALI", "Крем для рук TR50", "Body", 3190, "40 г", null, "Крем для рук из каталога JapRise."],
  ["wellness-01", "Fine Japan", "Экстракт гинкго билоба", "Wellness", 8590, "120 табл.", null, "Wellness-продукт из каталога JapRise."],
  ["wellness-02", "Fine Japan", "Коллаген с витамином C", "Wellness", 14490, "150 табл.", null, "Wellness-продукт из каталога JapRise."],
  ["wellness-03", "Fancl", "Good Choice Men 50+", "Wellness", 7690, "30 дней", null, "Wellness-продукт из каталога JapRise."],
  ["wellness-04", "Fancl", "Good Choice Men 60+", "Wellness", 7890, "30 дней", null, "Wellness-продукт из каталога JapRise."],
  ["wellness-05", "Fancl", "Good Choice Man 30+", "Wellness", 4590, "30 дней", null, "Wellness-продукт из каталога JapRise."],
  ["wellness-06", "Fancl", "Good Choice Man 40+", "Wellness", 7890, "30 дней", null, "Wellness-продукт из каталога JapRise."],
  ["face-03", "Plamine", "Питательный и увлажняющий крем для лица Plamine Rich Cream", "Face", 7590, "50 г", null, "Питательный крем для спокойного ежедневного ухода."],
  ["face-04", "Enzym", "Крем-сыворотка Ki-ha-da-bi Enzym", "Face", 11390, "100 г", null, "Крем-сыворотка для продуманного ухода за кожей."],
  ["face-05", "Direia", "Бальзам-стик для зоны глаз Direia Stem Stick ImPresSion", "Face", 9490, "6 г", null, "Стик для точного ухода за зоной вокруг глаз."],
  ["face-06", "Axxzia", "Омолаживающий крем для кожи вокруг глаз Axxzia Agtheory Ultra Eye Cream", "Face", 10890, "15 г", null, "Крем для деликатного ежедневного ухода за зоной вокруг глаз."],
  ["hair-03", "Shiseido", "Восстанавливающая маска для волос Tsubaki Premium Repair Mask", "Hair", 2890, "180 г", null, "Восстанавливающая маска для мягкого ритуала ухода за волосами."],
] as const;

export const demoProducts = productSeeds.map(
  ([id, brand, name, category, price, volume, badge, description]) => {
    const imageEntry = productImageManifest[id];
    if (!imageEntry) throw new Error(`Missing product image manifest entry for ${id}`);
    const image = imageEntry.primary;

    return {
      id,
      brand,
      name,
      category,
      price,
      volume,
      image,
      hoverImage: imageEntry.secondary ?? image,
      galleryImages: imageEntry.gallery,
      badge,
      description,
      available: false,
      availability: "catalog-preview",
    };
  },
) satisfies readonly DemoProduct[];
