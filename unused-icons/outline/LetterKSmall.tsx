import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLetterKSmall = (props: SvgProps) => (
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
    <Path d="M10.5 8v8" />
    <Path d="M14.5 8l-3 4l3 4" />
    <Path d="M10.5 12h1" />
  </Svg>
);
export default SvgLetterKSmall;
