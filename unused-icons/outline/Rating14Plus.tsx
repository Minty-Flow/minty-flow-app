import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRating14Plus = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M7 15v-6" />
    <Path d="M15.5 12h3" />
    <Path d="M17 10.5v3" />
    <Path d="M12.5 15v-6m-2.5 0v4h3" />
  </Svg>
);
export default SvgRating14Plus;
