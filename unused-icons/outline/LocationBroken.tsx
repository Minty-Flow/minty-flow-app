import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLocationBroken = (props: SvgProps) => (
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
    <Path d="M12.896 19.792l-2.896 -5.792l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5l-3.487 9.657" />
    <Path d="M21.5 21.5l-5 -5" />
    <Path d="M16.5 21.5l5 -5" />
  </Svg>
);
export default SvgLocationBroken;
