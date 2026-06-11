import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSquareRoundedPlus2 = (props: SvgProps) => (
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
    <Path d="M12.54 20.996c-.176 .004 -.356 .004 -.54 .004c-7.2 0 -9 -1.8 -9 -9s1.8 -9 9 -9s9 1.8 9 9c0 .185 -.001 .366 -.004 .544" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgSquareRoundedPlus2;
