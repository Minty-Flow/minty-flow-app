import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAnalyze = (props: SvgProps) => (
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
    <Path d="M20 11a8.1 8.1 0 0 0 -6.986 -6.918a8.095 8.095 0 0 0 -8.019 3.918" />
    <Path d="M4 13a8.1 8.1 0 0 0 15 3" />
    <Path d="M18 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M4 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </Svg>
);
export default SvgAnalyze;
