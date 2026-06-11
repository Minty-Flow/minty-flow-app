import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLetterB = (props: SvgProps) => (
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
    <Path d="M7 20v-16h6a4 4 0 0 1 0 8a4 4 0 0 1 0 8h-6" />
    <Path d="M7 12l6 0" />
  </Svg>
);
export default SvgLetterB;
