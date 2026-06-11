import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRibbonHealth = (props: SvgProps) => (
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
    <Path d="M7 21s9.286 -9.841 9.286 -13.841a3.864 3.864 0 0 0 -1.182 -3.008a4.13 4.13 0 0 0 -3.104 -1.144a4.13 4.13 0 0 0 -3.104 1.143a3.864 3.864 0 0 0 -1.182 3.01c0 4 9.286 13.84 9.286 13.84" />
  </Svg>
);
export default SvgRibbonHealth;
