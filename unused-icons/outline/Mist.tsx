import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMist = (props: SvgProps) => (
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
    <Path d="M5 5h3m4 0h9" />
    <Path d="M3 10h11m4 0h1" />
    <Path d="M5 15h5m4 0h7" />
    <Path d="M3 20h9m4 0h3" />
  </Svg>
);
export default SvgMist;
