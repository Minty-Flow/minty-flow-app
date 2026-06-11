import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHemispherePlus = (props: SvgProps) => (
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
    <Path d="M3 9a9 3 0 1 0 18 0a9 3 0 1 0 -18 0" />
    <Path d="M3 9a9 9 0 0 0 9 9m8.396 -5.752a8.978 8.978 0 0 0 .604 -3.248" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgHemispherePlus;
