import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandNpm = (props: SvgProps) => (
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
    <Path d="M1 8h22v7h-12v2h-4v-2h-6l0 -7" />
    <Path d="M7 8v7" />
    <Path d="M14 8v7" />
    <Path d="M17 11v4" />
    <Path d="M4 11v4" />
    <Path d="M11 11v1" />
    <Path d="M20 11v4" />
  </Svg>
);
export default SvgBrandNpm;
