import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandInertia = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M12.5 8l4 4l-4 4h4.5l4 -4l-4 -4l-4.5 0" />
    <Path d="M3.5 8l4 4l-4 4h4.5l4 -4l-4 -4l-4.5 0" />
  </Svg>
);
export default SvgBrandInertia;
