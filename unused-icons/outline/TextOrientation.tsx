import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextOrientation = (props: SvgProps) => (
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
    <Path d="M9 15l-5 -5c-1.367 -1.367 -1.367 -3.633 0 -5s3.633 -1.367 5 0l5 5" />
    <Path d="M5.5 11.5l5 -5" />
    <Path d="M21 12l-9 9" />
    <Path d="M21 12v4" />
    <Path d="M21 12h-4" />
  </Svg>
);
export default SvgTextOrientation;
