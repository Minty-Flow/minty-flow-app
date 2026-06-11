import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEmpathize = (props: SvgProps) => (
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
    <Path d="M9.5 5.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
    <Path d="M12 21.368l5.095 -5.096a3.088 3.088 0 1 0 -4.367 -4.367l-.728 .727l-.728 -.727a3.088 3.088 0 1 0 -4.367 4.367l5.095 5.096" />
  </Svg>
);
export default SvgEmpathize;
