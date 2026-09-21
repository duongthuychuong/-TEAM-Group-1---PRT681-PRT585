export type MenuCategory = "Food" | "Drinks"
export type MenuKind = "food" | "drinks"

export type MenuImage = {
  id: string
  src: string
  category: MenuCategory
  page: number
  total: number
}

export type UploadedMenuImage = {
  key: string
  src: string
  category: MenuCategory
  page: number
  updatedAt: string
}

export type MenuResponse = {
  items?: UploadedMenuImage[]
  order?: Partial<Record<MenuKind, string[]>>
}

export function resolveMenuImages(
  kind: MenuKind,
  uploaded: UploadedMenuImage[] = [],
  order?: string[],
): MenuImage[] {
  const category = kind === "food" ? "Food" : "Drinks"
  const uploadedImages: MenuImage[] = uploaded
    .filter((image) => image.category === category)
    .map((image) => ({
      id: image.key,
      src: image.src,
      category,
      page: image.page,
      total: 0,
    }))

  if (order) {
    const available = new Map(
      uploadedImages.map((image) => [image.id, image]),
    )
    return order
      .map((id) => available.get(id))
      .filter((image): image is MenuImage => image !== undefined)
      .map((image, index, images) => ({
        ...image,
        page: index + 1,
        total: images.length,
      }))
  }

  // Older uploads without a saved order still appear in their page order.
  const sorted = [...uploadedImages].sort(
    (first, second) => first.page - second.page,
  )
  return sorted.map((image, index) => ({
    ...image,
    page: index + 1,
    total: sorted.length,
  }))
}
