export type GalleryContent = {
  meta: {
    title: string;
    description: string;
  };
  eyebrow: string;
  heading: string;
  description: string;
  countLabel: {
    singular: string;
    plural: string;
  };
  empty: {
    heading: string;
    description: string;
    hint: string;
  };
  backLabel: string;
  lightbox: {
    closeLabel: string;
    previousLabel: string;
    nextLabel: string;
    openLabel: string;
  };
};

export const galleryContent: GalleryContent = {
  meta: {
    title: "Gallery | Vision Interiors",
    description:
      "A visual record of interiors, materials, and details from Vision Interiors projects.",
  },
  eyebrow: "The Gallery",
  heading: "Rooms, Materials, And Moments",
  description:
    "A growing visual record of the spaces we shape — textures, light, and the details that give each project its character. Newest work appears first.",
  countLabel: {
    singular: "image",
    plural: "images",
  },
  empty: {
    heading: "The Gallery Is Being Prepared",
    description:
      "There are no images here yet. New photography is added as projects complete.",
    hint: "Drop image files into public/gallery to populate this page.",
  },
  backLabel: "Back To Home",
  lightbox: {
    closeLabel: "Close",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    openLabel: "View larger",
  },
};
