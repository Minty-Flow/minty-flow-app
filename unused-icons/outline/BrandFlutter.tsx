import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandFlutter = (props: SvgProps) => (
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
    <Path d="M7 14l-3 -3l8 -8h6l-11 11" />
    <Path d="M14 21l-5 -5l5 -5h5l-5 5l5 5l-5 0" />
  </Svg>
);
export default SvgBrandFlutter;
