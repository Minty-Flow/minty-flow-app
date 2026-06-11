import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWeight = (props: SvgProps) => (
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
    <Path d="M9 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M6.835 9h10.33a1 1 0 0 1 .984 .821l1.637 9a1 1 0 0 1 -.984 1.179h-13.604a1 1 0 0 1 -.984 -1.179l1.637 -9a1 1 0 0 1 .984 -.821" />
  </Svg>
);
export default SvgWeight;
