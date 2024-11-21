import cn from "classnames";
import { icons } from "../constants/icon.constant";

interface Icons {
  [key: string]: string;
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  fill?: string;
  title: keyof Icons;
}

const Icon = (props: IconProps) => {
  const size = props.size ? props.size : 16;
  const fill = props.fill ? props.fill : "inherit";
  return (
    <svg
      className={cn(props.className)}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={fill}
    >
      <path d={icons[props.title]}></path>
    </svg>
  );
};

export default Icon;
