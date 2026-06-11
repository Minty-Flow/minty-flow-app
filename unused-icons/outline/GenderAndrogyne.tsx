import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderAndrogyne = (props: SvgProps) => (
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
    <Path d="M13 11l6 -6" />
    <Path d="M4 15a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M19 9v-4h-4" />
    <Path d="M16.5 10.5l-3 -3" />
  </Svg>
);
export default SvgGenderAndrogyne;
