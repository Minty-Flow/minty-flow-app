import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHelpSmall = (props: SvgProps) => (
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
    <Path d="M12 16v.01" />
    <Path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
  </Svg>
);
export default SvgHelpSmall;
