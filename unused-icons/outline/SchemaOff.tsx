import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSchemaOff = (props: SvgProps) => (
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
    <Path d="M6 2h4v4m-4 0h-1v-1" />
    <Path d="M15 11v-1h5v4h-2" />
    <Path d="M5 18h5v4h-5l0 -4" />
    <Path d="M5 10h5v4h-5l0 -4" />
    <Path d="M10 12h2" />
    <Path d="M7.5 7.5v2.5" />
    <Path d="M7.5 14v4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSchemaOff;
