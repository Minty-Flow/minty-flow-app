import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockMinus = (props: SvgProps) => (
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
    <Path d="M20.477 15.022a9 9 0 1 0 -7.998 5.965" />
    <Path d="M12 7v5l3 3" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgClockMinus;
