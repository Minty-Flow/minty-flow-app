import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChairDirector = (props: SvgProps) => (
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
    <Path d="M6 21l12 -9" />
    <Path d="M6 12l12 9" />
    <Path d="M5 12h14" />
    <Path d="M6 3v9" />
    <Path d="M18 3v9" />
    <Path d="M6 8h12" />
    <Path d="M6 5h12" />
  </Svg>
);
export default SvgChairDirector;
