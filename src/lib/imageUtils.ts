export const getImageUrl = (image: string): string => {
  if (!image) return 'https://via.placeholder.com/400x300?text=No+Image';
  
  if (image.startsWith('http')) {
    return image;
  }
  
  return `https://test-frontend.dev.int.perx.ru${image}`;
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
  e.currentTarget.onerror = null;
};