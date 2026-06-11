import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSection = (props: SvgProps) => (
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
    <Path d="M20 20h.01" />
    <Path d="M4 20h.01" />
    <Path d="M8 20h.01" />
    <Path d="M12 20h.01" />
    <Path d="M16 20h.01" />
    <Path d="M20 4h.01" />
    <Path d="M4 4h.01" />
    <Path d="M8 4h.01" />
    <Path d="M12 4h.01" />
    <Path d="M16 4l0 .01" />
    <Path d="M4 9a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1l0 -6" />
  </Svg>
);
export default SvgSection;
