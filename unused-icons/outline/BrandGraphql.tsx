import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGraphql = (props: SvgProps) => (
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
    <Path d="M4 8l8 -5l8 5v8l-8 5l-8 -5l0 -8" />
    <Path d="M12 4l7.5 12h-15l7.5 -12" />
    <Path d="M11 3a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M11 21a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M3 8a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M3 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M19 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M19 8a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
  </Svg>
);
export default SvgBrandGraphql;
