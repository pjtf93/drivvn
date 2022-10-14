const matchCards = (oldCard: string, newCard: string) => {
  if (newCard && oldCard && newCard === oldCard) {
    return true;
  } else {
    return false;
  }
};

export default matchCards;
