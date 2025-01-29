const codenames = ['The Phantom', 'The Kraken', 'The Nightingale', 'The Wasp', 'Sunbeam', 'Blackout', 'Beacon'];

export const generateCodename = (): string => {
  const randomIndex = Math.floor(Math.random() * codenames.length);
  return codenames[randomIndex];
};
