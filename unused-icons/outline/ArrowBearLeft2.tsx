import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBearLeft2 = (props: SvgProps) => (
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
    <Path d="M9 3h-5v5" />
    <Path d="M4 3l7.536 7.536a5 5 0 0 1 1.464 3.534v6.93" />
    <Path d="M20 5l-4.5 4.5" />
  </Svg>
);
export default SvgArrowBearLeft2;
