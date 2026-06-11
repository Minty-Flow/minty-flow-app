import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockPlus = (props: SvgProps) => (
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
    <Path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
    <Path d="M12 7v5l3 3" />
  </Svg>
);
export default SvgClockPlus;
