import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSocial = (props: SvgProps) => (
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
    <Path d="M9 14a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M12 7l0 4" />
    <Path d="M6.7 17.8l2.8 -2" />
    <Path d="M17.3 17.8l-2.8 -2" />
  </Svg>
);
export default SvgSocial;
