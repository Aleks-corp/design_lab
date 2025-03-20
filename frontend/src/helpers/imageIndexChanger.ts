export const imageIndexChanger = (
  indexStart: number,
  indexEnd: number,
  setImages: React.Dispatch<React.SetStateAction<File[]>>,
  setPreviews: React.Dispatch<React.SetStateAction<string[] | null>>
) => {
  setImages((prevImages) => {
    // Створюємо новий масив, щоб не мутувати старий
    const newImages = [...prevImages];

    // Переміщаємо зображення в новому масиві
    const [movedImage] = newImages.splice(indexStart, 1); // Видаляємо зображення на indexStart
    newImages.splice(indexEnd, 0, movedImage); // Вставляємо його на indexEnd

    return newImages;
  });

  setPreviews((prevPreviews) => {
    if (!prevPreviews) return prevPreviews; // Перевіряємо на null

    const newPreviews = [...prevPreviews];

    // Переміщаємо зображення в масиві прев'ю
    const [movedPreview] = newPreviews.splice(indexStart, 1);
    newPreviews.splice(indexEnd, 0, movedPreview);

    return newPreviews;
  });
};
