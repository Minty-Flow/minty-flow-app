import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandBinance = (props: SvgProps) => (
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
    <Path d="M6 8l2 2l4 -4l4 4l2 -2l-6 -6l-6 6" />
    <Path d="M6 16l2 -2l4 4l3.5 -3.5l2 2l-5.5 5.5l-6 -6" />
    <Path d="M20 10l2 2l-2 2l-2 -2l2 -2" />
    <Path d="M4 10l2 2l-2 2l-2 -2l2 -2" />
    <Path d="M12 10l2 2l-2 2l-2 -2l2 -2" />
  </Svg>
);
export default SvgBrandBinance;
