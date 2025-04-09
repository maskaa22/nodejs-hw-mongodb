const parseType = (contactType) => {
  const isString = typeof contactType === 'string';

  if (!isString) return;

  const isType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);

  if (isType(contactType)) return contactType;
};

const parseFavorite = (favorite) => {
  const isString = typeof favorite === 'string';

  if (!isString) return;

  return favorite;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseType(type);
  const parsedContactFavorite = parseFavorite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedContactFavorite,
  };
};
