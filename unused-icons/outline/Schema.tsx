import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSchema = (props: SvgProps) => (
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
    <Path d="M5 2h5v4h-5l0 -4" />
    <Path d="M15 10h5v4h-5l0 -4" />
    <Path d="M5 18h5v4h-5l0 -4" />
    <Path d="M5 10h5v4h-5l0 -4" />
    <Path d="M10 12h5" />
    <Path d="M7.5 6v4" />
    <Path d="M7.5 14v4" />
  </Svg>
);
export default SvgSchema;
