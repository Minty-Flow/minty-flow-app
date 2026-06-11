import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCirclePlus2 = (props: SvgProps) => (
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
    <Path d="M20.985 12.522a9 9 0 1 0 -8.475 8.464" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgCirclePlus2;
