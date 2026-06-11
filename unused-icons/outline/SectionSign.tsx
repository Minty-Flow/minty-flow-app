import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSectionSign = (props: SvgProps) => (
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
    <Path d="M9.172 19a3 3 0 1 0 2.828 -4" />
    <Path d="M14.83 5a3 3 0 1 0 -2.83 4" />
    <Path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </Svg>
);
export default SvgSectionSign;
