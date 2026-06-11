import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgForms = (props: SvgProps) => (
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
    <Path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3" />
    <Path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" />
    <Path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7" />
    <Path d="M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1" />
    <Path d="M17 12h.01" />
    <Path d="M13 12h.01" />
  </Svg>
);
export default SvgForms;
