import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShoe = (props: SvgProps) => (
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
    <Path d="M4 6h5.426a1 1 0 0 1 .863 .496l1.064 1.823a3 3 0 0 0 1.896 1.407l4.677 1.114a4 4 0 0 1 3.074 3.89v2.27a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1" />
    <Path d="M14 13l1 -2" />
    <Path d="M8 18v-1a4 4 0 0 0 -4 -4h-1" />
    <Path d="M10 12l1.5 -3" />
  </Svg>
);
export default SvgShoe;
