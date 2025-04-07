const parseType = (contactType) => {
  const isString = typeof contactType === 'string';

  if (!isString) return;

  const isType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isType(contactType)) return contactType;
};
const parseFavorite = (favorite) => {
  const isString = typeof favorite === 'boolean';

  if (!isString) return;

  const isFavourite = (favorite) => [true, false].includes(favorite);

  if (isFavourite(favorite)) return favorite;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseType(contactType);
  const parsedContactFavorite = parseFavorite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedContactFavorite,
  };
};
