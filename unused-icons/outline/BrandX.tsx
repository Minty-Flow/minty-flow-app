import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandX = (props: SvgProps) => (
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
    <Path d="M4 4l11.733 16h4.267l-11.733 -16l-4.267 0" />
    <Path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </Svg>
);
export default SvgBrandX;
