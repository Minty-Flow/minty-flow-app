import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandSnowflake = (props: SvgProps) => (
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
    <Path d="M14 21v-5.5l4.5 2.5" />
    <Path d="M10 21v-5.5l-4.5 2.5" />
    <Path d="M3.5 14.5l4.5 -2.5l-4.5 -2.5" />
    <Path d="M20.5 9.5l-4.5 2.5l4.5 2.5" />
    <Path d="M10 3v5.5l-4.5 -2.5" />
    <Path d="M14 3v5.5l4.5 -2.5" />
    <Path d="M12 11l1 1l-1 1l-1 -1l1 -1" />
  </Svg>
);
export default SvgBrandSnowflake;
