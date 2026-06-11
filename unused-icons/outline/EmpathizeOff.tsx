import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEmpathizeOff = (props: SvgProps) => (
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
    <Path d="M12 8a2.5 2.5 0 1 0 -2.5 -2.5" />
    <Path d="M12.317 12.315l-.317 .317l-.728 -.727a3.088 3.088 0 1 0 -4.367 4.367l5.095 5.096l4.689 -4.69m1.324 -2.673a3.087 3.087 0 0 0 -3.021 -3.018" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgEmpathizeOff;
