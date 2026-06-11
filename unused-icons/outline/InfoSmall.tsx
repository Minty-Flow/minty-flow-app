import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgInfoSmall = (props: SvgProps) => (
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
    <Path d="M12 9h.01" />
    <Path d="M11 12h1v4h1" />
  </Svg>
);
export default SvgInfoSmall;
