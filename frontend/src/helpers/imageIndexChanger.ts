export const imageIndexChanger = (
  indexStart: number,
  indexEnd: number,
  setImages: React.Dispatch<React.SetStateAction<File[]>>,
  setPreviews: React.Dispatch<React.SetStateAction<string[] | null>>
) => {
  setImages((prevImages) => {
    const newImages = [...prevImages];

    const [movedImage] = newImages.splice(indexStart, 1);
    newImages.splice(indexEnd, 0, movedImage);

    return newImages;
  });

  setPreviews((prevPreviews) => {
    if (!prevPreviews) return prevPreviews;

    const newPreviews = [...prevPreviews];

    const [movedPreview] = newPreviews.splice(indexStart, 1);
    newPreviews.splice(indexEnd, 0, movedPreview);

    return newPreviews;
  });
};
