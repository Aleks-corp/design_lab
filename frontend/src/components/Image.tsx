import { useTheme } from "../helpers/darkModeContext";

interface ImageProps {
  className?: string;
  src: string;
  srcDark: string;
  srcSet?: string;
  srcSetDark?: string;
  alt: string;
}

const Image = ({
  className,
  src,
  srcDark,
  srcSet,
  srcSetDark,
  alt,
}: ImageProps) => {
  const { darkMode } = useTheme();

  return (
    <img
      className={className}
      srcSet={darkMode ? srcSetDark : srcSet}
      src={darkMode ? srcDark : src}
      alt={alt}
    />
  );
};

export default Image;
