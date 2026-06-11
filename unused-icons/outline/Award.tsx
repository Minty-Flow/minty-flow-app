import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAward = (props: SvgProps) => (
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
    <Path d="M6 9a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
    <Path d="M12 15l3.4 5.89l1.598 -3.233l3.598 .232l-3.4 -5.889" />
    <Path d="M6.802 12l-3.4 5.89l3.598 -.233l1.598 3.232l3.4 -5.889" />
  </Svg>
);
export default SvgAward;
