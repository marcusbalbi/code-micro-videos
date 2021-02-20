import { Category, Genre } from "./dto";

export const getGenresFromCategory = (genres: Genre[], category: Category) => {
  return genres.filter((genre) => {
    if (!genre.categories || genre.categories.length === 0) {
      return false;
    }
    return genre.categories.filter(cat => cat.id === category.id).length !== 0
  })
}