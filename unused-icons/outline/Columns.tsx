import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgColumns = (props: SvgProps) => (
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
    <Path d="M4 6l5.5 0" />
    <Path d="M4 10l5.5 0" />
    <Path d="M4 14l5.5 0" />
    <Path d="M4 18l5.5 0" />
    <Path d="M14.5 6l5.5 0" />
    <Path d="M14.5 10l5.5 0" />
    <Path d="M14.5 14l5.5 0" />
    <Path d="M14.5 18l5.5 0" />
  </Svg>
);
export default SvgColumns;
