export const updateKitStatus = (
  key: string,
  value: boolean,
  setKits: React.Dispatch<React.SetStateAction<Record<string, boolean>[]>>
) => {
  setKits((prevKits) => ({ ...prevKits, [key]: value }));
};
