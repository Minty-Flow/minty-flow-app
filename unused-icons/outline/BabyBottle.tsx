import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBabyBottle = (props: SvgProps) => (
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
    <Path d="M5 10h14" />
    <Path d="M12 2v2" />
    <Path d="M12 4a5 5 0 0 1 5 5v11a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2v-11a5 5 0 0 1 5 -5" />
  </Svg>
);
export default SvgBabyBottle;
