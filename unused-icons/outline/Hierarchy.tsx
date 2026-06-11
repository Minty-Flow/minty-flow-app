import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHierarchy = (props: SvgProps) => (
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
    <Path d="M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6.5 17.5l5.5 -4.5l5.5 4.5" />
    <Path d="M12 7l0 6" />
  </Svg>
);
export default SvgHierarchy;
