import type { Metadata } from "next";

import GalleryExperience from "@/components/pages/gallery/GalleryExperience";
import { galleryContent } from "@/content/gallery/gallery";
import { readGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = {
  title: galleryContent.meta.title,
  description: galleryContent.meta.description,
};

export default async function GalleryPage() {
  const images = await readGalleryImages();

  return <GalleryExperience content={galleryContent} images={images} />;
}
