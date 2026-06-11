import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowUpDashed = (props: SvgProps) => (
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
    <Path d="M12 5v6m0 3v1.5m0 3v.5" />
    <Path d="M18 11l-6 -6" />
    <Path d="M6 11l6 -6" />
  </Svg>
);
export default SvgArrowUpDashed;
