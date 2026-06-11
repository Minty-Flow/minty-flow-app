import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCandle = (props: SvgProps) => (
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
    <Path d="M9 21h6v-10a1 1 0 0 0 -1 -1h-4a1 1 0 0 0 -1 1l0 10" />
    <Path d="M12 2l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737" />
  </Svg>
);
export default SvgCandle;
