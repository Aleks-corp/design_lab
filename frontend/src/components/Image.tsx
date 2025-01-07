// import useDarkMode from "use-dark-mode";

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
  // srcDark,
  srcSet,
  // srcSetDark,
  alt,
}: ImageProps) => {
  // const darkMode = useDarkMode(false);

  return <img className={className} srcSet={srcSet} src={src} alt={alt} />;
};

export default Image;
