import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMessageLanguage = (props: SvgProps) => (
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
    <Path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
    <Path d="M10 14v-4a2 2 0 1 1 4 0v4" />
    <Path d="M14 12h-4" />
  </Svg>
);
export default SvgMessageLanguage;
