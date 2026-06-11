import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShoppingCartCopy = (props: SvgProps) => (
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
    <Path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M11.5 17h-5.5v-14h-2" />
    <Path d="M6 5l14 1l-1 7h-13" />
    <Path d="M15 19l2 2l4 -4" />
  </Svg>
);
export default SvgShoppingCartCopy;
