import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExposurePlus1 = (props: SvgProps) => (
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
    <Path d="M3 12h6" />
    <Path d="M6 9v6" />
    <Path d="M18 19v-14l-4 4" />
  </Svg>
);
export default SvgExposurePlus1;
